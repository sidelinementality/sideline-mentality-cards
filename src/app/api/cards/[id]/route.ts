import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type UpdateCardRequest = {
  slug?: string;
  playerName?: string;
  sport?: string;
  team?: string;
  year?: number | string;
  brand?: string;
  setName?: string;
  parallel?: string;
  cardNumber?: string;

  rookieCard?: boolean;
  autograph?: boolean;
  patch?: boolean;
  relic?: boolean;
  shortPrint?: boolean;
  caseHit?: boolean;
  serialNumber?: string;
  condition?: string;
  conditionNotes?: string;

  graded?: boolean;
  gradeCompany?: string;
  grade?: string;
  certificationNumber?: string;

  purchaseDate?: string;
  purchaseSource?: string;
  seller?: string;
  purchaseSession?: string;
  purchasePrice?: number;
  shippingCost?: number;
  salesTax?: number;
  purchaseFees?: number;

  marketValue?: number;
  websitePrice?: number;
  minimumPrice?: number;

  storageArea?: string;
  cabinet?: string;
  shelf?: string;
  box?: string;
  row?: string;
  slot?: string;
  storageNotes?: string;

  imageUrl?: string | null;
  backImageUrl?: string | null;

  websiteReady?: boolean;
  featured?: boolean;
  listingStatus?: string;
  internalNotes?: string;

  stock?: number;
  stockOnly?: boolean;
};

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function cleanOptionalText(
  value: string | null | undefined,
) {
  const cleanedValue = value?.trim();

  return cleanedValue ? cleanedValue : null;
}

function cleanOptionalNumber(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return value;
}

function cleanRequiredMoney(value: number | undefined) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return null;
  }

  return value;
}

function createSlug(
  parts: Array<string | number | null | undefined>,
) {
  return parts
    .filter(
      (part) =>
        part !== null &&
        part !== undefined &&
        part !== "",
    )
    .join("-")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as UpdateCardRequest;

    if (!id) {
      return NextResponse.json(
        { error: "A card ID is required." },
        { status: 400 },
      );
    }

    if (body.stockOnly === true) {
      if (
        typeof body.stock !== "number" ||
        !Number.isInteger(body.stock) ||
        body.stock < 0
      ) {
        return NextResponse.json(
          { error: "Please enter a valid stock quantity." },
          { status: 400 },
        );
      }

      const { data, error } = await supabaseAdmin
        .from("cards")
        .update({
          stock: body.stock,
        })
        .eq("id", id)
        .select("id, stock")
        .single();

      if (error) {
        console.error("Supabase stock update error:", error);

        return NextResponse.json(
          {
            error:
              "The stock quantity could not be updated.",
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        message: "Stock updated successfully.",
        card: data,
      });
    }

    const playerName = body.playerName?.trim();
    const sport = body.sport?.trim();
    const brand = body.brand?.trim();
    const team = cleanOptionalText(body.team);
    const setName = cleanOptionalText(body.setName);
    const parallel = cleanOptionalText(body.parallel);
    const cardNumber = cleanOptionalText(body.cardNumber);

    const year = Number(body.year);
    const stock = Number(body.stock);

    const suppliedSlug = body.slug?.trim().toLowerCase();

    const generatedSlug = createSlug([
      playerName,
      year,
      brand,
      setName,
      parallel,
      cardNumber,
    ]);

    const slug = suppliedSlug || generatedSlug;

    const imageUrl = cleanOptionalText(body.imageUrl);
    const backImageUrl = cleanOptionalText(
      body.backImageUrl,
    );

    const purchasePrice = cleanRequiredMoney(
      body.purchasePrice,
    );

    const shippingCost = cleanRequiredMoney(
      body.shippingCost ?? 0,
    );

    const salesTax = cleanRequiredMoney(
      body.salesTax ?? 0,
    );

    const purchaseFees = cleanRequiredMoney(
      body.purchaseFees ?? 0,
    );

    const websitePrice = cleanRequiredMoney(
      body.websitePrice,
    );

    if (!playerName) {
      return NextResponse.json(
        {
          error: "A player or subject name is required.",
        },
        { status: 400 },
      );
    }

    if (!sport) {
      return NextResponse.json(
        { error: "A sport is required." },
        { status: 400 },
      );
    }

    if (
      !Number.isInteger(year) ||
      year < 1800 ||
      year > 2100
    ) {
      return NextResponse.json(
        { error: "Please enter a valid card year." },
        { status: 400 },
      );
    }

    if (!brand) {
      return NextResponse.json(
        { error: "A brand is required." },
        { status: 400 },
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "A URL slug could not be generated." },
        { status: 400 },
      );
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json(
        {
          error:
            "The URL slug may only contain lowercase letters, numbers, and hyphens.",
        },
        { status: 400 },
      );
    }

    if (
      purchasePrice === null ||
      shippingCost === null ||
      salesTax === null ||
      purchaseFees === null
    ) {
      return NextResponse.json(
        {
          error:
            "Purchase prices, shipping, tax, and fees must be valid non-negative amounts.",
        },
        { status: 400 },
      );
    }

    if (websitePrice === null) {
      return NextResponse.json(
        { error: "Please enter a valid website price." },
        { status: 400 },
      );
    }

    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return NextResponse.json(
        { error: "Please enter a valid stock quantity." },
        { status: 400 },
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "A front card image is required." },
        { status: 400 },
      );
    }

    const graded = Boolean(body.graded);

    const { data, error } = await supabaseAdmin
      .from("cards")
      .update({
        slug,
        player_name: playerName,
        sport,
        team,
        year,
        brand,
        set_name: setName,
        parallel,
        card_number: cardNumber,

        rookie_card: Boolean(body.rookieCard),
        autograph: Boolean(body.autograph),
        patch: Boolean(body.patch),
        relic: Boolean(body.relic),
        short_print: Boolean(body.shortPrint),
        case_hit: Boolean(body.caseHit),
        serial_number: cleanOptionalText(
          body.serialNumber,
        ),
        card_condition: cleanOptionalText(
          body.condition,
        ),
        condition_notes: cleanOptionalText(
          body.conditionNotes,
        ),

        graded,
        grade_company: graded
          ? cleanOptionalText(body.gradeCompany)
          : null,
        grade: graded
          ? cleanOptionalText(body.grade)
          : null,
        certification_number: graded
          ? cleanOptionalText(
              body.certificationNumber,
            )
          : null,

        purchase_date: cleanOptionalText(
          body.purchaseDate,
        ),
        purchase_source: cleanOptionalText(
          body.purchaseSource,
        ),
        seller: cleanOptionalText(body.seller),
        purchase_session: cleanOptionalText(
          body.purchaseSession,
        ),
        purchase_price: purchasePrice,
        shipping_cost: shippingCost,
        sales_tax: salesTax,
        purchase_fees: purchaseFees,

        market_value: cleanOptionalNumber(
          body.marketValue,
        ),
        price: websitePrice,
        minimum_price: cleanOptionalNumber(
          body.minimumPrice,
        ),

        storage_area: cleanOptionalText(
          body.storageArea,
        ),
        cabinet: cleanOptionalText(body.cabinet),
        shelf: cleanOptionalText(body.shelf),
        box: cleanOptionalText(body.box),
        storage_row: cleanOptionalText(body.row),
        slot: cleanOptionalText(body.slot),
        storage_notes: cleanOptionalText(
          body.storageNotes,
        ),

        image_url: imageUrl,
        back_image_url: backImageUrl,

        website_ready: Boolean(body.websiteReady),
        featured: Boolean(body.featured),
        listing_status:
          cleanOptionalText(body.listingStatus) ??
          "Available",
        internal_notes: cleanOptionalText(
          body.internalNotes,
        ),

        stock,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Supabase card update error:", error);

      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "That URL slug is already being used by another card.",
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        {
          error:
            error.message ||
            "The card could not be updated.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Card updated successfully.",
      card: data,
    });
  } catch (error) {
    console.error(
      "Unexpected card update error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while updating the card.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "A card ID is required." },
        { status: 400 },
      );
    }

    const { data: existingCard, error: fetchError } =
      await supabaseAdmin
        .from("cards")
        .select("image_url, back_image_url")
        .eq("id", id)
        .single();

    if (fetchError || !existingCard) {
      return NextResponse.json(
        { error: "Card not found." },
        { status: 404 },
      );
    }

    const { error: deleteError } = await supabaseAdmin
      .from("cards")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(
        "Supabase card deletion error:",
        deleteError,
      );

      return NextResponse.json(
        { error: "The card could not be deleted." },
        { status: 500 },
      );
    }

    const imagesToDelete = [
      existingCard.image_url,
      existingCard.back_image_url,
    ].filter(
      (image): image is string =>
        typeof image === "string" &&
        image.length > 0,
    );

    for (const imageUrl of imagesToDelete) {
      try {
        const imagePath =
          imageUrl.split("/card-images/")[1];

        if (!imagePath) {
          continue;
        }

        const { error: storageError } =
          await supabaseAdmin.storage
            .from("card-images")
            .remove([imagePath]);

        if (storageError) {
          console.error(
            "Unable to delete image from storage:",
            storageError,
          );
        }
      } catch (storageError) {
        console.error(
          "Unexpected image deletion error:",
          storageError,
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Card deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Unexpected card deletion error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while deleting the card.",
      },
      { status: 500 },
    );
  }
}