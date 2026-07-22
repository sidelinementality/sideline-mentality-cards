import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const { cardId, sessionId } = await request.json();

    if (!cardId) {
      return NextResponse.json(
        { error: "Missing cardId" },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin
      .from("card_views")
      .insert({
        card_id: cardId,
        viewer_session_id: sessionId ?? null,
      });

    if (error) {
      console.error("Card view insert error:", error);

      return NextResponse.json(
        { error: "Unable to record view" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Card views API error:", error);

    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
}