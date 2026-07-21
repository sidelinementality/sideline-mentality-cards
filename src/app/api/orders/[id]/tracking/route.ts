import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type TrackingRequestBody = {
  shippingCarrier?: string;
  trackingNumber?: string;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as TrackingRequestBody;

    const shippingCarrier = body.shippingCarrier?.trim() ?? "";
    const trackingNumber = body.trackingNumber?.trim() ?? "";

    if (!shippingCarrier) {
      return NextResponse.json(
        {
          error: "Please select a shipping carrier.",
        },
        {
          status: 400,
        },
      );
    }

    if (!trackingNumber) {
      return NextResponse.json(
        {
          error: "Please enter a tracking number.",
        },
        {
          status: 400,
        },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
        shipping_carrier: shippingCarrier,
        tracking_number: trackingNumber,
        shipped_at: new Date().toISOString(),
        fulfillment_status: "shipped",
      })
      .eq("id", id)
      .select(
        `
          id,
          shipping_carrier,
          tracking_number,
          shipped_at,
          fulfillment_status
        `,
      )
      .single();

    if (error) {
      console.error("Tracking update error:", error);

      return NextResponse.json(
        {
          error: "Unable to save tracking information.",
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
      order: data,
    });
  } catch (error) {
    console.error("Tracking route error:", error);

    return NextResponse.json(
      {
        error: "An unexpected error occurred.",
      },
      {
        status: 500,
      },
    );
  }
}