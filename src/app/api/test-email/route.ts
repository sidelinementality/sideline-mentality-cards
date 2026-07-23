import { NextResponse } from "next/server";
import { sendOrderConfirmation } from "@/lib/send-order-confirmation";

export async function GET() {
  try {
    await sendOrderConfirmation({
      customerEmail: "eric@sidelinementality.com",
      customerName: "Eric",
      orderNumber: "TEST-1001",
      items: [
        {
          playerName: "Test Football Card",
          year: 2024,
          brand: "Prizm",
          quantity: 1,
          price: 45,
        },
      ],
      shippingAddress: {
        line1: "123 Test Street",
        city: "Smithville",
        state: "MO",
        zipCode: "64089",
      },
      subtotal: 45,
      shippingCost: 4.99,
      total: 49.99,
    });

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully.",
    });
  } catch (error) {
    console.error("Test email error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email.",
      },
      { status: 500 },
    );
  }
}