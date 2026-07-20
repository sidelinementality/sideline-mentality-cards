import { supabaseAdmin } from "@/lib/supabase-admin";

type PurchasedItem = {
  id: string;
  slug: string;
  playerName: string;
  imageUrl: string | null;
  quantity: number;
  price: number;
};

type CreateOrderParams = {
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  shippingAddress: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  stripePaymentIntent: string;
  stripeCheckoutSession: string;
  items: PurchasedItem[];
};

export async function createOrder(
  order: CreateOrderParams,
) {
  const { data: existingOrder, error: existingOrderError } =
    await supabaseAdmin
      .from("orders")
      .select("id")
      .eq(
        "stripe_checkout_session",
        order.stripeCheckoutSession,
      )
      .maybeSingle();

  if (existingOrderError) {
    throw new Error(
      `Unable to check for an existing order: ${existingOrderError.message}`,
    );
  }

  if (existingOrder) {
    return existingOrder;
  }

  for (const item of order.items) {
    const { data: card, error: cardError } =
      await supabaseAdmin
        .from("cards")
        .select("id, stock")
        .eq("id", item.id)
        .single();

    if (cardError || !card) {
      throw new Error(
        `Unable to find inventory for ${item.playerName}.`,
      );
    }

    const currentStock = Number(card.stock ?? 0);

    if (currentStock < item.quantity) {
      throw new Error(
        `Not enough inventory is available for ${item.playerName}.`,
      );
    }
  }

  const { data: createdOrder, error: orderError } =
    await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
        shipping_address: order.shippingAddress,
        city: order.city,
        state: order.state,
        zip_code: order.zipCode,
        subtotal: order.subtotal,
        shipping_cost: order.shippingCost,
        tax: order.tax,
        total: order.total,
        payment_status: "paid",
        fulfillment_status: "pending",
        stripe_payment_intent: order.stripePaymentIntent,
        stripe_checkout_session:
          order.stripeCheckoutSession,
      })
      .select()
      .single();

  if (orderError) {
    if (orderError.code === "23505") {
      const { data: duplicateOrder } =
        await supabaseAdmin
          .from("orders")
          .select("id")
          .eq(
            "stripe_checkout_session",
            order.stripeCheckoutSession,
          )
          .single();

      if (duplicateOrder) {
        return duplicateOrder;
      }
    }

    throw new Error(
      `Unable to create order: ${orderError.message}`,
    );
  }

  const orderItems = order.items.map((item) => ({
    order_id: createdOrder.id,
    card_id: item.id,
    player_name: item.playerName,
    card_slug: item.slug,
    quantity: item.quantity,
    price: item.price,
    image_url: item.imageUrl,
  }));

  const { error: itemsError } =
    await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

  if (itemsError) {
    throw new Error(
      `Unable to create order items: ${itemsError.message}`,
    );
  }

  for (const item of order.items) {
    const { data: card, error: cardError } =
      await supabaseAdmin
        .from("cards")
        .select("stock")
        .eq("id", item.id)
        .single();

    if (cardError || !card) {
      throw new Error(
        `Unable to update inventory for ${item.playerName}.`,
      );
    }

    const currentStock = Number(card.stock ?? 0);

    if (currentStock < item.quantity) {
      throw new Error(
        `Inventory changed before fulfillment for ${item.playerName}.`,
      );
    }

    const newStock = currentStock - item.quantity;

    const { error: updateError } =
      await supabaseAdmin
        .from("cards")
        .update({
          stock: newStock,
        })
        .eq("id", item.id);

    if (updateError) {
      throw new Error(
        `Unable to reduce inventory for ${item.playerName}: ${updateError.message}`,
      );
    }
  }

  return createdOrder;
}