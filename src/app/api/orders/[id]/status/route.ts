import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateStatusBody = {
  fulfillmentStatus?: string;
};

const allowedStatuses = [
  "pending",
  "packed",
  "shipped",
  "delivered",
] as const;

type FulfillmentStatus = (typeof allowedStatuses)[number];

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as UpdateStatusBody;

    const fulfillmentStatus =
      body.fulfillmentStatus?.trim().toLowerCase();

    if (!fulfillmentStatus) {
      return NextResponse.json(
        {
          error: "A fulfillment status is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !allowedStatuses.includes(
        fulfillmentStatus as FulfillmentStatus,
      )
    ) {
      return NextResponse.json(
        {
          error: "That fulfillment status is not allowed.",
        },
        {
          status: 400,
        },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
        fulfillment_status: fulfillmentStatus,
      })
      .eq("id", id)
      .select(
        `
          id,
          fulfillment_status
        `,
      )
      .single();

    if (error) {
      console.error("Order status update error:", error);

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        },
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error: "Order not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      message: "Order status updated successfully.",
      order: data,
    });
  } catch (error) {
    console.error("Unexpected order status error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while updating the order.",
      },
      {
        status: 500,
      },
    );
  }
}