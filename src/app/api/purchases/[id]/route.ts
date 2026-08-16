import { NextResponse } from "next/server";
import { authorizeDealer } from "@/lib/dealer-auth";
import {
  buildPurchaseRecord,
  isPurchaseId,
  type PurchaseWriteInput,
} from "@/lib/purchases";
import { supabaseAdmin } from "@/lib/supabase-admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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

export async function GET(_request: Request, context: RouteContext) {
  try {
    const authResult = await authorizeDealer();

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = await context.params;

    if (!isPurchaseId(id)) {
      return NextResponse.json(
        { error: "A valid purchase id is required." },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("purchases")
      .select(purchaseSelect)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Purchase get error:", error);
      return NextResponse.json(
        {
          error: error.message || "The purchase could not be loaded.",
        },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Purchase not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ purchase: data });
  } catch (error) {
    console.error("Unexpected purchase get error:", error);
    return NextResponse.json(
      { error: "Something went wrong while loading the purchase." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const authResult = await authorizeDealer();

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = await context.params;

    if (!isPurchaseId(id)) {
      return NextResponse.json(
        { error: "A valid purchase id is required." },
        { status: 400 },
      );
    }

    const body = (await request.json()) as PurchaseWriteInput;
    const parsed = buildPurchaseRecord(body);

    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("purchases")
      .update(parsed.record)
      .eq("id", id)
      .select(purchaseSelect)
      .maybeSingle();

    if (error) {
      console.error("Purchase update error:", error);
      return NextResponse.json(
        {
          error: error.message || "The purchase could not be updated.",
        },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Purchase not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Purchase updated successfully.",
      purchase: data,
    });
  } catch (error) {
    console.error("Unexpected purchase update error:", error);
    return NextResponse.json(
      { error: "Something went wrong while updating the purchase." },
      { status: 500 },
    );
  }
}
