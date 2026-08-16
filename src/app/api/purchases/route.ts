import { NextResponse } from "next/server";
import { authorizeDealer } from "@/lib/dealer-auth";
import {
  buildPurchaseRecord,
  type PurchaseWriteInput,
} from "@/lib/purchases";
import { supabaseAdmin } from "@/lib/supabase-admin";

const purchaseSelect = `
  id,
  name,
  purchase_date,
  source,
  seller,
  total_cost,
  expected_item_count,
  notes,
  status,
  created_at,
  updated_at
`;

export async function GET(request: Request) {
  try {
    const authResult = await authorizeDealer();

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status")?.trim().toLowerCase();
    const includeArchived = searchParams.get("includeArchived") === "true";

    let query = supabaseAdmin
      .from("purchases")
      .select(purchaseSelect)
      .order("purchase_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    } else if (!includeArchived) {
      query = query.neq("status", "archived");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Purchases list error:", error);
      return NextResponse.json(
        {
          error:
            error.message || "Purchases could not be loaded.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ purchases: data ?? [] });
  } catch (error) {
    console.error("Unexpected purchases list error:", error);
    return NextResponse.json(
      { error: "Something went wrong while loading purchases." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await authorizeDealer();

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = (await request.json()) as PurchaseWriteInput;
    const parsed = buildPurchaseRecord(body);

    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("purchases")
      .insert(parsed.record)
      .select(purchaseSelect)
      .single();

    if (error) {
      console.error("Purchase create error:", error);
      return NextResponse.json(
        {
          error: error.message || "The purchase could not be saved.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Purchase created successfully.",
        purchase: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unexpected purchase create error:", error);
    return NextResponse.json(
      { error: "Something went wrong while saving the purchase." },
      { status: 500 },
    );
  }
}
