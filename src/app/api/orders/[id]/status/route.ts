import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendShippingConfirmation } from "@/lib/send-shipping-confirmation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateStatusBody = {
  fulfillmentStatus?: string;
  shippingCarrier?: string;
  trackingNumber?: string;
};

const allowedStatuses = [
  "pending",
  "packed",
  "shipped",
  "delivered",
] as const;

type FulfillmentStatus = (typeof allowedStatuses)[number];

const allowedCarriers = ["USPS", "UPS", "FedEx"] as const;

type ShippingCarrier = (typeof allowedCarriers)[number];

function createTrackingUrl(
  carrier: ShippingCarrier,
  trackingNumber: string,
) {
  const encodedTrackingNumber = encodeURIComponent(trackingNumber);

  switch (carrier) {
    case "USPS":
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodedTrackingNumber}`;

    case "UPS":
      return `https://www.ups.com/track?tracknum=${encodedTrackingNumber}`;

    case "FedEx":
      return `https://www.fedex.com/fedextrack/?trknbr=${encodedTrackingNumber}`;
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as UpdateStatusBody;

    const fulfillmentStatus =
      body.fulfillmentStatus?.trim().toLowerCase();

    const shippingCarrier = body.shippingCarrier?.trim();
    const trackingNumber = body.trackingNumber?.trim();

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

    if (fulfillmentStatus === "shipped") {
      if (!shippingCarrier) {
        return NextResponse.json(
          {
            error:
              "A shipping carrier is required when marking an order as shipped.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        !allowedCarriers.includes(
          shippingCarrier as ShippingCarrier,
        )
      ) {
        return NextResponse.json(
          {
            error: "The shipping carrier must be USPS, UPS, or FedEx.",
          },
          {
            status: 400,
          },
        );
      }

      if (!trackingNumber) {
        return NextResponse.json(
          {
            error:
              "A tracking number is required when marking an order as shipped.",
          },
          {
            status: 400,
          },
        );
      }
    }

    const updateData: {
      fulfillment_status: FulfillmentStatus;
      shipping_carrier?: ShippingCarrier;
      tracking_number?: string;
      shipped_at?: string;
    } = {
      fulfillment_status:
        fulfillmentStatus as FulfillmentStatus,
    };

    if (
      fulfillmentStatus === "shipped" &&
      shippingCarrier &&
      trackingNumber
    ) {
      updateData.shipping_carrier =
        shippingCarrier as ShippingCarrier;
      updateData.tracking_number = trackingNumber;
      updateData.shipped_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select(
        `
          id,
          customer_name,
          customer_email,
          fulfillment_status,
          shipping_carrier,
          tracking_number,
          shipped_at
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

    let emailWarning: string | null = null;

    if (
      fulfillmentStatus === "shipped" &&
      data.customer_email &&
      data.shipping_carrier &&
      data.tracking_number
    ) {
      try {
        const trackingUrl = createTrackingUrl(
          data.shipping_carrier as ShippingCarrier,
          data.tracking_number,
        );

        await sendShippingConfirmation({
          customerEmail: data.customer_email,
          customerName: data.customer_name ?? "Collector",
          orderNumber: data.id,
          trackingNumber: data.tracking_number,
          trackingUrl,
        });
      } catch (emailError) {
        console.error(
          "Shipping confirmation email error:",
          emailError,
        );

        emailWarning =
          "The order was updated, but the shipping email could not be sent.";
      }
    }

    return NextResponse.json({
      message:
        fulfillmentStatus === "shipped"
          ? "Order marked as shipped successfully."
          : "Order status updated successfully.",
      order: data,
      emailWarning,
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