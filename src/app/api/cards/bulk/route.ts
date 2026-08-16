import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  buildBulkDeleteMessage,
  cardImageStoragePaths,
  planBulkCardDeletion,
} from "@/lib/bulk-card-deletion";

type BulkAction =
  | "publish"
  | "website-ready"
  | "feature"
  | "unfeature"
  | "archive"
  | "change-status"
  | "delete";

type BulkCardRequest = {
  cardIds?: string[];
  action?: BulkAction;
  status?: string;
};

type PublishableCard = {
  id: string;
  player_name: string | null;
  sport: string | null;
  year: number | null;
  brand: string | null;
  price: number | string | null;
  image_url: string | null;
  stock: number | null;
};

type DeletableCard = {
  id: string;
  image_url: string | null;
  back_image_url: string | null;
};

type OrderItemCardRef = {
  card_id: string | null;
};

const allowedStatuses = [
  "Available",
  "Draft",
  "Needs Photos",
  "Needs Pricing",
  "Ready to Publish",
  "Published",
  "Reserved",
  "Sold",
  "Archived",
];

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const dealerEmail =
      process.env.DEALER_EMAIL?.trim().toLowerCase();

    const signedInEmail =
      user?.email?.trim().toLowerCase();

    if (
      !user ||
      !dealerEmail ||
      signedInEmail !== dealerEmail
    ) {
      return NextResponse.json(
        {
          error:
            "You are not authorized to update inventory.",
        },
        { status: 401 },
      );
    }

    const body = (await request.json()) as BulkCardRequest;

    const cardIds = Array.isArray(body.cardIds)
      ? Array.from(
          new Set(
            body.cardIds
              .filter(
                (id): id is string =>
                  typeof id === "string" &&
                  id.trim().length > 0,
              )
              .map((id) => id.trim()),
          ),
        )
      : [];

    if (cardIds.length === 0) {
      return NextResponse.json(
        { error: "Select at least one card." },
        { status: 400 },
      );
    }

    if (cardIds.length > 500) {
      return NextResponse.json(
        {
          error:
            "Bulk updates are limited to 500 cards at a time.",
        },
        { status: 400 },
      );
    }

    if (!body.action) {
      return NextResponse.json(
        { error: "Choose a bulk action." },
        { status: 400 },
      );
    }

    if (body.action === "delete") {
      return await deleteSelectedCards(cardIds);
    }

    const requestedStatus = body.status?.trim();

    if (
      body.action === "change-status" &&
      (!requestedStatus ||
        !allowedStatuses.includes(requestedStatus))
    ) {
      return NextResponse.json(
        {
          error: "Choose a valid inventory status.",
        },
        { status: 400 },
      );
    }

    const willPublish =
      body.action === "publish" ||
      (body.action === "change-status" &&
        requestedStatus === "Published");

    if (willPublish) {
      const { data: selectedCards, error: validationError } =
        await supabaseAdmin
          .from("cards")
          .select(`
            id,
            player_name,
            sport,
            year,
            brand,
            price,
            image_url,
            stock
          `)
          .in("id", cardIds);

      if (validationError) {
        console.error(
          "Bulk publishing validation error:",
          validationError,
        );

        return NextResponse.json(
          {
            error:
              "The selected cards could not be checked before publishing.",
          },
          { status: 500 },
        );
      }

      const cardsToValidate =
        (selectedCards ?? []) as PublishableCard[];

      if (cardsToValidate.length !== cardIds.length) {
        return NextResponse.json(
          {
            error:
              "One or more selected cards could not be found.",
          },
          { status: 404 },
        );
      }

      const invalidCards = cardsToValidate
        .map((card) => {
          const missingFields: string[] = [];

          if (!card.player_name?.trim()) {
            missingFields.push("player name");
          }

          if (!card.sport?.trim()) {
            missingFields.push("sport");
          }

          if (
            !Number.isInteger(Number(card.year)) ||
            Number(card.year) < 1800 ||
            Number(card.year) > 2100
          ) {
            missingFields.push("year");
          }

          if (!card.brand?.trim()) {
            missingFields.push("brand");
          }

          if (!card.image_url?.trim()) {
            missingFields.push("front image");
          }

          if (
            !Number.isFinite(Number(card.price)) ||
            Number(card.price) <= 0
          ) {
            missingFields.push("website price");
          }

          if (
            !Number.isInteger(Number(card.stock)) ||
            Number(card.stock) <= 0
          ) {
            missingFields.push("stock");
          }

          return {
            id: card.id,
            playerName:
              card.player_name?.trim() || "Unnamed card",
            missingFields,
          };
        })
        .filter((card) => card.missingFields.length > 0);

      if (invalidCards.length > 0) {
        const preview = invalidCards
          .slice(0, 5)
          .map(
            (card) =>
              `${card.playerName}: ${card.missingFields.join(
                ", ",
              )}`,
          )
          .join("; ");

        const additionalCount =
          invalidCards.length > 5
            ? ` Plus ${
                invalidCards.length - 5
              } more incomplete card${
                invalidCards.length - 5 === 1 ? "" : "s"
              }.`
            : "";

        return NextResponse.json(
          {
            error: `Publishing blocked. Complete the required information first. ${preview}.${additionalCount}`,
            invalidCards,
          },
          { status: 400 },
        );
      }
    }

    let updates: Record<string, string | boolean>;

    switch (body.action) {
      case "publish":
        updates = {
          website_ready: true,
          listing_status: "Published",
        };
        break;

      case "website-ready":
        updates = {
          website_ready: true,
          listing_status: "Ready to Publish",
        };
        break;

      case "feature":
        updates = {
          featured: true,
        };
        break;

      case "unfeature":
        updates = {
          featured: false,
        };
        break;

      case "archive":
        updates = {
          website_ready: false,
          listing_status: "Archived",
          featured: false,
        };
        break;

      case "change-status":
        updates = {
          listing_status: requestedStatus!,
          website_ready:
            requestedStatus === "Published" ||
            requestedStatus === "Ready to Publish",
        };

        if (
          requestedStatus === "Sold" ||
          requestedStatus === "Archived"
        ) {
          updates.featured = false;
        }

        break;

      default:
        return NextResponse.json(
          {
            error: "That bulk action is not supported.",
          },
          { status: 400 },
        );
    }

    const { data, error } = await supabaseAdmin
      .from("cards")
      .update(updates)
      .in("id", cardIds)
      .select(`
        id,
        website_ready,
        featured,
        listing_status
      `);

    if (error) {
      console.error("Bulk card update error:", error);

      return NextResponse.json(
        {
          error:
            error.message ||
            "The selected cards could not be updated.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: `${data?.length ?? 0} card${
        data?.length === 1 ? "" : "s"
      } updated successfully.`,
      cards: data ?? [],
    });
  } catch (error) {
    console.error(
      "Unexpected bulk update error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while updating the selected cards.",
      },
      { status: 500 },
    );
  }
}

async function deleteSelectedCards(cardIds: string[]) {
  const { data: existingCards, error: existingError } =
    await supabaseAdmin
      .from("cards")
      .select("id, image_url, back_image_url")
      .in("id", cardIds);

  if (existingError) {
    console.error(
      "Bulk card deletion lookup error:",
      existingError,
    );

    return NextResponse.json(
      {
        error:
          "The selected cards could not be checked before deletion.",
      },
      { status: 500 },
    );
  }

  const { data: orderItems, error: orderItemsError } =
    await supabaseAdmin
      .from("order_items")
      .select("card_id")
      .in("card_id", cardIds);

  if (orderItemsError) {
    console.error(
      "Bulk card deletion order lookup error:",
      orderItemsError,
    );

    return NextResponse.json(
      {
        error:
          "Order history could not be checked before deleting inventory.",
      },
      { status: 500 },
    );
  }

  const cards = (existingCards ?? []) as DeletableCard[];
  const plan = planBulkCardDeletion({
    requestedIds: cardIds,
    existingIds: cards.map((card) => card.id),
    orderReferencedIds: ((orderItems ?? []) as OrderItemCardRef[])
      .map((item) => item.card_id)
      .filter(
        (id): id is string =>
          typeof id === "string" && id.length > 0,
      ),
  });

  let deletedCardIds: string[] = [];

  if (plan.deletableIds.length > 0) {
    const imagesById = new Map(
      cards.map((card) => [card.id, card] as const),
    );

    const { data: deletedRows, error: deleteError } =
      await supabaseAdmin
        .from("cards")
        .delete()
        .in("id", plan.deletableIds)
        .select("id");

    if (deleteError) {
      console.error("Bulk card deletion error:", deleteError);

      return NextResponse.json(
        {
          error: "The selected cards could not be deleted.",
        },
        { status: 500 },
      );
    }

    deletedCardIds = (deletedRows ?? []).map((row) => row.id);

    const imagePaths = cardImageStoragePaths(
      deletedCardIds.flatMap((id) => {
        const card = imagesById.get(id);
        return [card?.image_url, card?.back_image_url];
      }),
    );

    if (imagePaths.length > 0) {
      const { error: storageError } = await supabaseAdmin.storage
        .from("card-images")
        .remove(imagePaths);

      if (storageError) {
        console.error(
          "Unable to delete images from storage:",
          storageError,
        );
      }
    }
  }

  const skippedCardIds = plan.skipped.map((item) => item.cardId);

  return NextResponse.json({
    message: buildBulkDeleteMessage(
      deletedCardIds.length,
      plan.skipped,
    ),
    requestedCount: cardIds.length,
    deletedCount: deletedCardIds.length,
    skippedCount: skippedCardIds.length,
    deletedCardIds,
    skippedCardIds,
    skipped: plan.skipped,
  });
}