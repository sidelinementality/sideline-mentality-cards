import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type CreateCardRequest = {
  slug?: string;
  playerName?: string;
  sport?: string;
  year?: number | string;
  brand?: string;
  price?: number;
  imageUrl?: string;
  backImageUrl?: string;
  featured?: boolean;
};

function cleanOptionalText(value: string | undefined) {
  const cleanedValue = value?.trim();

  return cleanedValue ? cleanedValue : null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateCardRequest;

    const slug = body.slug?.trim().toLowerCase();
    const playerName = body.playerName?.trim();
    const sport = body.sport?.trim();
    const brand = body.brand?.trim();
    const imageUrl = body.imageUrl?.trim();
    const backImageUrl = cleanOptionalText(body.backImageUrl);
    const year = Number(body.year);

    if (!slug) {
      return NextResponse.json(
        { error: "A URL slug is required." },
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

    if (!playerName) {
      return NextResponse.json(
        { error: "A player or subject name is required." },
        { status: 400 },
      );
    }

    if (!sport) {
      return NextResponse.json(
        { error: "A sport is required." },
        { status: 400 },
      );
    }

    if (!Number.isInteger(year) || year < 1800 || year > 2100) {
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

    if (
      typeof body.price !== "number" ||
      !Number.isFinite(body.price) ||
      body.price < 0
    ) {
      return NextResponse.json(
        { error: "Please enter a valid price." },
        { status: 400 },
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "A front card image is required." },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("cards")
      .insert({
        slug,
        player_name: playerName,
        sport,
        year,
        brand,
        price: body.price,
        image_url: imageUrl,
        back_image_url: backImageUrl,
        featured: Boolean(body.featured),
        stock: 1,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Supabase card creation error:", error);

      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "That URL slug is already being used. Please choose a different slug.",
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "The card could not be saved." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Card created successfully.",
        card: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unexpected card creation error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while saving the card.",
      },
      { status: 500 },
    );
  }
}