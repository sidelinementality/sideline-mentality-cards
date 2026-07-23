import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("cards")
    .select(`
      id,
      slug,
      player_name,
      sport,
      team,
      year,
      brand,
      price,
      image_url,
      grade_company,
      grade
    `)
    .or(
      [
        `player_name.ilike.%${query}%`,
        `team.ilike.%${query}%`,
        `sport.ilike.%${query}%`,
        `brand.ilike.%${query}%`,
        `grade_company.ilike.%${query}%`,
        `grade.ilike.%${query}%`,
      ].join(","),
    )
    .gt("stock", 0)
    .limit(8);

  if (error) {
    console.error(error);

    return NextResponse.json([], {
      status: 500,
    });
  }

  return NextResponse.json(data ?? []);
}