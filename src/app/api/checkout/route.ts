import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(
    "STRIPE_SECRET_KEY is missing from .env.local.",
  );
}

const stripe = new Stripe(stripeSecretKey);

type CheckoutItem = {
  id: string;
  quantity: number;
};

type CheckoutRequest = {
  items?: CheckoutItem[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutRequest;
    const requestedItems = body.items;

    if (!requestedItems || requestedItems.length === 0) {
      return NextResponse.json(
        {
          error: "Your shopping cart is empty.",
        },
        {
          status: 400,
        },
      );
    }

    const validRequestedItems = requestedItems.filter(
      (item) =>
        typeof item.id === "string" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    );

    if (
      validRequestedItems.length !== requestedItems.length
    ) {
      return NextResponse.json(
        {
          error: "The shopping cart contains invalid items.",
        },
        {
          status: 400,
        },
      );
    }

    const cardIds = [
      ...new Set(
        validRequestedItems.map((item) => item.id),
      ),
    ];

    const { data: cards, error: cardsError } =
      await supabaseAdmin
        .from("cards")
        .select(
          `
            id,
            slug,
            player_name,
            year,
            brand,
            price,
            image_url,
            stock
          `,
        )
        .in("id", cardIds);

    if (cardsError) {
      console.error(
        "Unable to load checkout cards:",
        cardsError,
      );

      return NextResponse.json(
        {
          error:
            "We could not prepare your checkout. Please try again.",
        },
        {
          status: 500,
        },
      );
    }

    if (!cards || cards.length !== cardIds.length) {
      return NextResponse.json(
        {
          error:
            "One or more cards in your cart are no longer available.",
        },
        {
          status: 400,
        },
      );
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      [];

    for (const requestedItem of validRequestedItems) {
      const card = cards.find(
        (currentCard) =>
          currentCard.id === requestedItem.id,
      );

      if (!card) {
        return NextResponse.json(
          {
            error:
              "One or more cards in your cart could not be found.",
          },
          {
            status: 400,
          },
        );
      }

      const price = Number(card.price);
      const availableStock = Number(card.stock ?? 0);

      if (!Number.isFinite(price) || price <= 0) {
        return NextResponse.json(
          {
            error: `${card.player_name} does not have a valid price.`,
          },
          {
            status: 400,
          },
        );
      }

      if (
        requestedItem.quantity > availableStock ||
        availableStock <= 0
      ) {
        return NextResponse.json(
          {
            error: `${card.player_name} does not have enough inventory available.`,
          },
          {
            status: 400,
          },
        );
      }

      const productName = [
        card.player_name,
        card.year,
        card.brand,
      ]
        .filter(Boolean)
        .join(" ");

      lineItems.push({
        quantity: requestedItem.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(price * 100),
          product_data: {
            name: productName,
            images: card.image_url
              ? [card.image_url]
              : undefined,
            metadata: {
              card_id: card.id,
              card_slug: card.slug,
            },
          },
        },
      });
    }

    const origin =
      request.headers.get("origin") ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      customer_creation: "always",
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        cart: JSON.stringify(validRequestedItems),
      },
    });

    if (!session.url) {
      return NextResponse.json(
        {
          error:
            "Stripe did not return a checkout address.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      {
        error:
          "We could not start checkout. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}