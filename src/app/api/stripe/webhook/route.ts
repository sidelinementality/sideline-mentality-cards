import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder } from "@/lib/order-service";
import { sendOrderConfirmation } from "@/lib/send-order-confirmation";

export const runtime = "nodejs";

type PurchasedItem = {
  id: string;
  slug: string;
  playerName: string;
  year: number | null;
  brand: string | null;
  imageUrl: string | null;
  quantity: number;
  price: number;
};

function getStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is missing.");
  }

  return new Stripe(stripeSecretKey);
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is missing.");

    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    const stripe = getStripe();

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error("Invalid webhook signature.", error);

    return NextResponse.json(
      { error: "Invalid signature." },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const cartMetadata = session.metadata?.cart;

        if (!cartMetadata) {
          throw new Error("Missing cart metadata.");
        }

        const items = JSON.parse(cartMetadata) as PurchasedItem[];
        const shipping = session.customer_details?.address;

        const subtotal = session.amount_subtotal
          ? session.amount_subtotal / 100
          : 0;

        const total = session.amount_total
          ? session.amount_total / 100
          : 0;

        const shippingCost = total - subtotal;

        await createOrder({
          customerName: session.customer_details?.name ?? null,
          customerEmail: session.customer_details?.email ?? null,
          customerPhone: session.customer_details?.phone ?? null,
          shippingAddress: shipping?.line1 ?? null,
          city: shipping?.city ?? null,
          state: shipping?.state ?? null,
          zipCode: shipping?.postal_code ?? null,
          subtotal,
          shippingCost,
          tax: 0,
          total,
          stripePaymentIntent:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : "",
          stripeCheckoutSession: session.id,
          items,
        });

        if (session.customer_details?.email) {
          await sendOrderConfirmation({
            customerEmail: session.customer_details.email,
            customerName: session.customer_details.name ?? "Collector",
            orderNumber: session.id,
            items: items.map((item) => ({
              playerName: item.playerName,
              year: item.year ?? null,
              brand: item.brand ?? null,
              quantity: item.quantity,
              price: item.price,
            })),
            shippingAddress: {
              line1: shipping?.line1 ?? null,
              city: shipping?.city ?? null,
              state: shipping?.state ?? null,
              zipCode: shipping?.postal_code ?? null,
            },
            subtotal,
            shippingCost,
            total,
          });
        }

        console.log(
          `Order created for Checkout Session ${session.id}`,
        );

        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("Webhook processing failed:", error);

    return NextResponse.json(
      { error: "Webhook failed." },
      { status: 500 },
    );
  }
}