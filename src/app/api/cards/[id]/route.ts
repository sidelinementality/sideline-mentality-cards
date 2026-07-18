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

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as UpdateCardRequest;

    const slug = body.slug?.trim().toLowerCase();
    const playerName = body.playerName?.trim();
    const sport = body.sport?.trim();
    const brand = body.brand?.trim();
    const imageUrl = body.imageUrl?.trim();

    if (!id) {
      return NextResponse.json(
        { error: "A card ID is required." },
        { status: 400 }
      );
    }

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
      !Number.isInteger(body.stock) ||
      Number(body.stock) < 0
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