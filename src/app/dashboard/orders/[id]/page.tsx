import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import DealerActions from "@/components/orders/DealerActions";
import TrackingForm from "@/components/orders/TrackingForm";

type OrderDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type Order = {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  total: number | string | null;
  payment_status: string | null;
  fulfillment_status: string | null;
  stripe_payment_intent: string | null;
  shipping_carrier: string | null;
tracking_number: string | null;
shipped_at: string | null;
  created_at: string | null;
};

type OrderItem = {
  id: string;
  order_id: string;
  card_id: string | null;
  player_name: string | null;
  card_slug: string | null;
  quantity: number | null;
  price: number | string | null;
  image_url: string | null;
  created_at: string | null;
};

function formatCurrency(value: number | string | null) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(value: string | null) {
  if (!value) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getStatusClasses(status: string | null) {
  const normalizedStatus = status?.toLowerCase();

  if (
    normalizedStatus === "paid" ||
    normalizedStatus === "delivered"
  ) {
    return "border-green-500/30 bg-green-500/10 text-green-300";
  }

  if (
    normalizedStatus === "pending" ||
    normalizedStatus === "packed"
  ) {
    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  }

  if (normalizedStatus === "shipped") {
    return "border-blue-500/30 bg-blue-500/10 text-blue-300";
  }

  return "border-white/10 bg-white/5 text-neutral-300";
}
function getTrackingUrl(
    carrier: string | null,
    trackingNumber: string | null,
  ) {
    if (!carrier || !trackingNumber) {
      return null;
    }
  
    switch (carrier.toLowerCase()) {
      case "usps":
        return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
  
      case "ups":
        return `https://www.ups.com/track?tracknum=${trackingNumber}`;
  
      case "fedex":
        return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
  
      default:
        return null;
    }
  }
export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;

  const { data: orderData, error: orderError } =
    await supabaseAdmin
      .from("orders")
      .select(
        `
          id,
          customer_name,
          customer_email,
          total,
          payment_status,
          fulfillment_status,
stripe_payment_intent,
shipping_carrier,
tracking_number,
shipped_at,
created_at
        `,
      )
      .eq("id", id)
      .single();

  const order = orderData as Order | null;

  if (orderError || !order) {
    console.error("Order details error:", orderError);
    notFound();
  }

  const { data: orderItemsData, error: orderItemsError } =
    await supabaseAdmin
      .from("order_items")
      .select(
        `
          id,
          order_id,
          card_id,
          player_name,
          card_slug,
          quantity,
          price,
          image_url,
          created_at
        `,
      )
      .eq("order_id", order.id)
      .order("created_at", {
        ascending: true,
      });

  const orderItems = (orderItemsData ?? []) as OrderItem[];

  const calculatedSubtotal = orderItems.reduce(
    (sum, item) =>
      sum + Number(item.price ?? 0) * Number(item.quantity ?? 1),
    0,
  );

  const totalQuantity = orderItems.reduce(
    (sum, item) => sum + Number(item.quantity ?? 1),
    0,
  );

  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard/orders"
          className="text-sm font-semibold text-green-400 transition hover:text-green-300"
        >
          ← Back to Orders
        </Link>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-400">
              Dealer Center
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>

            <p className="mt-3 text-neutral-400">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span
              className={`inline-flex rounded-full border px-4 py-2 text-sm font-bold capitalize ${getStatusClasses(
                order.payment_status,
              )}`}
            >
              Payment: {order.payment_status || "unknown"}
            </span>

            <span
              className={`inline-flex rounded-full border px-4 py-2 text-sm font-bold capitalize ${getStatusClasses(
                order.fulfillment_status,
              )}`}
            >
              Fulfillment:{" "}
              {order.fulfillment_status || "unknown"}
            </span>
          </div>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
            <h2 className="text-xl font-black">
              Customer Information
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Customer Name
                </p>

                <p className="mt-2 font-semibold">
                  {order.customer_name || "Name unavailable"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Customer Email
                </p>

                <p className="mt-2 break-all font-semibold">
                  {order.customer_email || "Email unavailable"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-black">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">
                  Items
                </span>

                <span className="font-bold">
                  {totalQuantity}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400">
                  Subtotal
                </span>

                <span className="font-bold">
                  {formatCurrency(calculatedSubtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="font-bold">
                  Order Total
                </span>

                <span className="text-xl font-black text-green-400">
                  {formatCurrency(order.total)}
                </span>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Order ID
                </p>

                <p className="mt-2 break-all text-sm text-neutral-300">
                  {order.id}
                </p>
              </div>
              {order.shipping_carrier && (
  <div className="border-t border-white/10 pt-4">
    <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
      Shipping Carrier
    </p>

    <p className="mt-2 font-semibold">
      {order.shipping_carrier}
    </p>
  </div>
)}

{order.tracking_number && (
  <div className="border-t border-white/10 pt-4">
    <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
      Tracking Number
    </p>

    <p className="mt-2 break-all font-semibold">
      {order.tracking_number}
    </p>
  </div>
)}

{order.shipped_at && (
  <div className="border-t border-white/10 pt-4">
    <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
      Shipped
    </p>

    <p className="mt-2 font-semibold">
      {formatDate(order.shipped_at)}
    </p>
  </div>
)}
{getTrackingUrl(
  order.shipping_carrier,
  order.tracking_number,
) && (
  <div className="border-t border-white/10 pt-4">
    <a
      href={
        getTrackingUrl(
          order.shipping_carrier,
          order.tracking_number,
        )!
      }
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded-xl bg-green-500 px-4 py-3 font-bold text-black transition hover:bg-green-400"
    >
      Track Package →
    </a>
  </div>
)}

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Stripe Payment Intent
                </p>

                <p className="mt-2 break-all text-sm text-neutral-300">
                  {order.stripe_payment_intent ||
                    "Not available"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-black">
              Purchased Cards
            </h2>

            <p className="text-sm text-neutral-400">
              {totalQuantity}{" "}
              {totalQuantity === 1 ? "card" : "cards"}
            </p>
          </div>

          {orderItemsError ? (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">
              <p className="font-bold">
                Purchased cards could not be loaded.
              </p>

              <p className="mt-2 text-sm">
                {orderItemsError.message}
              </p>
            </div>
          ) : null}

          {!orderItemsError && orderItems.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-black/20 px-6 py-12 text-center">
              <p className="font-semibold text-neutral-300">
                No purchased cards were found for this order.
              </p>
            </div>
          ) : null}

          {!orderItemsError && orderItems.length > 0 ? (
            <div className="mt-6 space-y-4">
              {orderItems.map((item) => {
                const quantity = Number(item.quantity ?? 1);
                const itemPrice = Number(item.price ?? 0);
                const lineTotal = itemPrice * quantity;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-black/20 p-5 sm:flex-row sm:items-center"
                  >
                    <div className="relative h-36 w-full overflow-hidden rounded-xl bg-neutral-900 sm:h-28 sm:w-24 sm:flex-none">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={
                            item.player_name ||
                            "Purchased card"
                          }
                          fill
                          sizes="(max-width: 640px) 100vw, 96px"
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-3 text-center text-xs font-semibold text-neutral-500">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-black">
                        {item.player_name ||
                          "Unknown card"}
                      </p>

                      {item.card_slug ? (
                        <Link
                          href={`/cards/${item.card_slug}`}
                          className="mt-2 inline-flex text-sm font-semibold text-green-400 transition hover:text-green-300"
                        >
                          View card page
                        </Link>
                      ) : null}
                    </div>

                    <div className="grid grid-cols-3 gap-4 sm:flex sm:items-center sm:gap-8">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                          Price
                        </p>

                        <p className="mt-1 font-bold">
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                          Quantity
                        </p>

                        <p className="mt-1 font-bold">
                          {quantity}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                          Total
                        </p>

                        <p className="mt-1 font-black text-green-400">
                          {formatCurrency(lineTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>
        <div className="mt-6">
  <TrackingForm
    orderId={order.id}
    currentCarrier={order.shipping_carrier}
    currentTrackingNumber={order.tracking_number}
  />
</div>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
  <Link
    href={`/dashboard/orders/print/${order.id}`}
    className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-black text-neutral-950 transition hover:bg-neutral-200"
  >
    Print Packing Slip
  </Link>

  <DealerActions
    orderId={order.id}
    currentStatus={order.fulfillment_status}
  />
</div>
      </div>
    </main>
  );
}