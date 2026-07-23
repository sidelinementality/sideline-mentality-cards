import { NextResponse } from "next/server";
import { sendShippingConfirmation } from "@/lib/send-shipping-confirmation";

export async function GET() {
  try {
    await sendShippingConfirmation({
      customerEmail: "eric@sidelinementality.com",
      customerName: "Eric",
      orderNumber: "TEST-1002",
      trackingNumber: "9400111202555234567890",
      trackingUrl:
        "https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=9400111202555234567890",
    });

    return NextResponse.json({
      success: true,
      message: "Shipping confirmation email sent successfully.",
    });
  } catch (error) {
    console.error("Shipping email test error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send shipping confirmation email.",
      },
      { status: 500 }
    );
  }
}