import { NextResponse } from "next/server";
import { resolveCardSlug } from "@/lib/card-slug";
import { supabaseAdmin } from "@/lib/supabase-admin";

type ExistsRequest = {
  playerName?: string;
  slug?: string;
  year?: number | string;
  brand?: string;
  setName?: string;
  parallel?: string;
  cardNumber?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ExistsRequest;

    const slug = resolveCardSlug({
      playerName: body.playerName,
      year: body.year,
      brand: body.brand,
      setName: body.setName,
      parallel: body.parallel,
      cardNumber: body.cardNumber,
      slug: body.slug,
    });

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

    const { data, error } = await supabaseAdmin
      .from("cards")
      .select("id, slug")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Card exists check error:", error);
      return NextResponse.json(
        { error: error.message || "The inventory check could not be completed." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      exists: Boolean(data),
      slug,
      cardId: data?.id ?? null,
    });
  } catch (error) {
    console.error("Unexpected card exists check error:", error);

    return NextResponse.json(
      { error: "Something went wrong while checking inventory." },
      { status: 500 },
    );
  }
}
