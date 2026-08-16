import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function authorizeDealer() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const dealerEmail = process.env.DEALER_EMAIL?.trim().toLowerCase();
  const signedInEmail = user?.email?.trim().toLowerCase();

  if (!user || !dealerEmail || signedInEmail !== dealerEmail) {
    return NextResponse.json(
      {
        error: "You are not authorized to manage dealer records.",
      },
      { status: 401 },
    );
  }

  return user;
}
