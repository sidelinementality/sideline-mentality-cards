import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type UpdateCardRequest = {
  slug?: string;
  playerName?: string;
  sport?: string;
  team?: string;
  year?: number;
  brand?: string;
  setName?: string;
  cardNumber?: string;
  gradeCompany?: string;
  grade?: string;
  price?: number;
  imageUrl?: string;
  featured?: boolean;
  rookieCard?: boolean;
  autograph?: boolean;
  serialNumber?: string;
  stock?: number;
  conditionNotes?: string;
  stockOnly?: boolean;
};

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function cleanOptionalText(value: string | undefined) {
  const cleanedValue = value?.trim();

  return cleanedValue ? cleanedValue : null;
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as UpdateCardRequest;

    if (!id) {
      return NextResponse.json(
        { error: "A card ID is required." },
        { status: 400 }
      );
    }

    /*
     * Quick stock update from the inventory + and − buttons.
     */
    if (body.stockOnly === true) {
      if (
        typeof body.stock !== "number" ||
        !Number.isInteger(body.stock) ||
        body.stock < 0
      ) {
        return NextResponse.json(
          { error: "Please enter a valid stock quantity." },
          { status: 400 }
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
          { error: "The stock quantity could not be updated." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "Stock updated successfully.",
        card: data,
      });
    }

    /*
     * Full card update from the Edit Card page.
     */
    const slug = body.slug?.trim().toLowerCase();
    const playerName = body.playerName?.trim();
    const sport = body.sport?.trim();
    const brand = body.brand?.trim();
    const imageUrl = body.imageUrl?.trim();

    if (!slug) {
      return NextResponse.json(
        { error: "A URL slug is required." },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json(
        {
          error:
            "The URL slug may only contain lowercase letters, numbers, and hyphens.",
        },
        { status: 400 }
      );
    }

    if (!playerName) {
      return NextResponse.json(
        { error: "A player or subject name is required." },
        { status: 400 }
      );
    }

    if (!sport) {
      return NextResponse.json(
        { error: "A sport is required." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(body.year) || Number(body.year) < 1800) {
      return NextResponse.json(
        { error: "Please enter a valid card year." },
        { status: 400 }
      );
    }

    if (!brand) {
      return NextResponse.json(
        { error: "A brand is required." },
        { status: 400 }
      );
    }

    if (
      typeof body.price !== "number" ||
      !Number.isFinite(body.price) ||
      body.price < 0
    ) {
      return NextResponse.json(
        { error: "Please enter a valid price." },
        { status: 400 }
      );
    }

    if (
      typeof body.stock !== "number" ||
      !Number.isInteger(body.stock) ||
      body.stock < 0
    ) {
      return NextResponse.json(
        { error: "Please enter a valid stock quantity." },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "A card image is required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("cards")
      .update({
        slug,
        player_name: playerName,
        sport,
        team: cleanOptionalText(body.team),
        year: Number(body.year),
        brand,
        set_name: cleanOptionalText(body.setName),
        card_number: cleanOptionalText(body.cardNumber),
        grade_company: cleanOptionalText(body.gradeCompany),
        grade: cleanOptionalText(body.grade),
        price: Number(body.price),
        image_url: imageUrl,
        featured: Boolean(body.featured),
        rookie_card: Boolean(body.rookieCard),
        autograph: Boolean(body.autograph),
        serial_number: cleanOptionalText(body.serialNumber),
        stock: Number(body.stock),
        condition_notes: cleanOptionalText(body.conditionNotes),
      })
      .eq("id", id)
      .select("id, slug")
      .single();

    if (error) {
      console.error("Supabase card update error:", error);

      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "That URL slug is already being used by another card.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "The card could not be updated." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Card updated successfully.",
      card: data,
    });
  } catch (error) {
    console.error("Unexpected card update error:", error);

    return NextResponse.json(
      { error: "Something went wrong while updating the card." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "A card ID is required." },
        { status: 400 }
      );
    }

    const { data: existingCard, error: fetchError } =
      await supabaseAdmin
        .from("cards")
        .select("image_url")
        .eq("id", id)
        .single();

    if (fetchError || !existingCard) {
      return NextResponse.json(
        { error: "Card not found." },
        { status: 404 }
      );
    }

    const { error: deleteError } = await supabaseAdmin
      .from("cards")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Supabase card deletion error:", deleteError);

      return NextResponse.json(
        { error: "The card could not be deleted." },
        { status: 500 }
      );
    }

    if (existingCard.image_url) {
      try {
        const imagePath =
          existingCard.image_url.split("/card-images/")[1];

        if (imagePath) {
          const { error: storageError } =
            await supabaseAdmin.storage
              .from("card-images")
              .remove([imagePath]);

          if (storageError) {
            console.error(
              "Unable to delete image from storage:",
              storageError
            );
          }
        }
      } catch (storageError) {
        console.error(
          "Unexpected image deletion error:",
          storageError
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Card deleted successfully.",
    });
  } catch (error) {
    console.error("Unexpected card deletion error:", error);

    return NextResponse.json(
      { error: "Something went wrong while deleting the card." },
      { status: 500 }
    );
  }
}