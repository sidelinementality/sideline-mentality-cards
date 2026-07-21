import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type OrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type OrderItem = {
  id: string;
  card_id: string | null;
  player_name: string;
  card_slug: string | null;
  quantity: number | null;
  price: number | string | null;
  image_url: string | null;
};

function money(value: number | string | null) {
  const amount = Number(value);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(amount) ? amount : 0);
}

function prettyDate(date: string | null) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function prettyStatus(status: string | null) {
  if (!status) {
    return "Pending";
  }

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function paymentStatusClasses(status: string | null) {
  const normalizedStatus = status?.toLowerCase();

  if (
    normalizedStatus === "paid" ||
    normalizedStatus === "complete" ||
    normalizedStatus === "completed"
  ) {
    return "bg-green-100 text-green-800";
  }

  if (
    normalizedStatus === "failed" ||
    normalizedStatus === "refunded" ||
    normalizedStatus === "canceled" ||
    normalizedStatus === "cancelled"
  ) {
    return "bg-red-100 text-red-700";
  }

  return "bg-amber-100 text-amber-800";
}

function fulfillmentStatusClasses(status: string | null) {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "delivered") {
    return "bg-green-100 text-green-800";
  }

  if (normalizedStatus === "shipped") {
    return "bg-blue-100 text-blue-800";
  }

  if (
    normalizedStatus === "canceled" ||
    normalizedStatus === "cancelled"
  ) {
    return "bg-red-100 text-red-700";
  }

  return "bg-zinc-200 text-slate-700";
}

function getTrackingLink(
  carrier: string | null,
  trackingNumber: string | null,
) {
  if (!carrier || !trackingNumber) {
    return null;
  }

  const normalizedCarrier = carrier.toLowerCase();
  const encodedTrackingNumber = encodeURIComponent(trackingNumber);

  if (normalizedCarrier.includes("usps")) {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodedTrackingNumber}`;
  }

  if (normalizedCarrier.includes("ups")) {
    return `https://www.ups.com/track?tracknum=${encodedTrackingNumber}`;
  }

  if (normalizedCarrier.includes("fedex")) {
    return `https://www.fedex.com/fedextrack/?trknbr=${encodedTrackingNumber}`;
  }

  return null;
}

export default async function CustomerOrderDetailsPage({
  params,
}: OrderPageProps) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login");
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (orderError) {
    console.error(
      "Customer order lookup error:",
      orderError.message,
    );
  }

  if (!order) {
    notFound();
  }

  if (
    order.customer_email?.toLowerCase() !==
    user.email?.toLowerCase()
  ) {
    notFound();
  }

  const { data: orderItemsData, error: orderItemsError } =
    await supabase
      .from("order_items")
      .select(
        `
          id,
          card_id,
          player_name,
          card_slug,
          quantity,
          price,
          image_url
        `,
      )
      .eq("order_id", order.id)
      .order("created_at", {
        ascending: true,
      });

  if (orderItemsError) {
    console.error(
      "Customer order items lookup error:",
      orderItemsError.message,
    );
  }

  const orderItems = (orderItemsData ?? []) as OrderItem[];

  const trackingLink = getTrackingLink(
    order.shipping_carrier,
    order.tracking_number,
  );

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/account/orders"
          className="font-black text-green-700 transition hover:text-green-600"
        >
          ← Back to Orders
        </Link>

        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
                Order
              </p>

              <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
                #{order.id.slice(0, 8).toUpperCase()}
              </h1>

              <p className="mt-2 text-slate-500">
                Placed {prettyDate(order.created_at)}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${paymentStatusClasses(
                    order.payment_status,
                  )}`}
                >
                  Payment: {prettyStatus(order.payment_status)}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${fulfillmentStatusClasses(
                    order.fulfillment_status,
                  )}`}
                >
                  Fulfillment:{" "}
                  {prettyStatus(order.fulfillment_status)}
                </span>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-sm font-bold text-slate-500">
                Order Total
              </p>

              <p className="mt-1 text-4xl font-black text-slate-950">
                {money(order.total)}
              </p>
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-green-700">
                Purchase
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Cards in This Order
              </h2>
            </div>

            <p className="font-bold text-slate-500">
              {orderItems.reduce(
                (total, item) => total + Number(item.quantity ?? 0),
                0,
              )}{" "}
              {orderItems.reduce(
                (total, item) => total + Number(item.quantity ?? 0),
                0,
              ) === 1
                ? "card"
                : "cards"}
            </p>
          </div>

          {orderItemsError ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="font-black text-red-800">
                We could not load the cards in this order.
              </p>
            </div>
          ) : orderItems.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center">
              <p className="font-black text-slate-700">
                No card details are available for this order.
              </p>
            </div>
          ) : (
            <div className="mt-6 divide-y divide-zinc-200">
              {orderItems.map((item) => {
                const quantity = Number(item.quantity ?? 0);
                const itemPrice = Number(item.price);
                const itemTotal =
                  (Number.isFinite(itemPrice) ? itemPrice : 0) *
                  quantity;

                const cardContent = (
                  <>
                    <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:h-36 sm:w-28">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={`${item.player_name} trading card`}
                          fill
                          className="object-contain p-2"
                          sizes="112px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center p-3 text-center text-xs font-bold text-slate-400">
                          Image unavailable
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-black text-slate-950">
                        {item.player_name}
                      </p>

                      <p className="mt-2 text-sm font-bold text-slate-500">
                        Quantity: {quantity}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Price each: {money(item.price)}
                      </p>

                      {item.card_slug && (
                        <p className="mt-3 text-sm font-black text-green-700">
                          View Card →
                        </p>
                      )}
                    </div>
                  </>
                );

                return (
                  <article
                    key={item.id}
                    className="flex flex-col gap-5 py-6 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                  >
                    {item.card_slug ? (
                      <Link
                        href={`/cards/${item.card_slug}`}
                        className="flex min-w-0 flex-1 gap-5 rounded-2xl transition hover:bg-zinc-50 sm:p-3"
                      >
                        {cardContent}
                      </Link>
                    ) : (
                      <div className="flex min-w-0 flex-1 gap-5">
                        {cardContent}
                      </div>
                    )}

                    <div className="sm:text-right">
                      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                        Item Total
                      </p>

                      <p className="mt-1 text-xl font-black text-slate-950">
                        {money(itemTotal)}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Customer Information
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm font-bold text-slate-500">
                  Name
                </p>

                <p className="mt-1 font-black text-slate-950">
                  {order.customer_name || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-500">
                  Email
                </p>

                <p className="mt-1 break-all font-black text-slate-950">
                  {order.customer_email || "Not provided"}
                </p>
              </div>

              {order.customer_phone && (
                <div>
                  <p className="text-sm font-bold text-slate-500">
                    Phone
                  </p>

                  <p className="mt-1 font-black text-slate-950">
                    {order.customer_phone}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Shipping
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm font-bold text-slate-500">
                  Shipping Address
                </p>

                <div className="mt-1 font-black text-slate-950">
                  <p>{order.shipping_address || "Not provided"}</p>

                  {(order.city || order.state || order.zip_code) && (
                    <p>
                      {[order.city, order.state]
                        .filter(Boolean)
                        .join(", ")}{" "}
                      {order.zip_code}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-500">
                  Carrier
                </p>

                <p className="mt-1 font-black text-slate-950">
                  {order.shipping_carrier || "Not shipped"}
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-500">
                  Tracking Number
                </p>

                {trackingLink ? (
                  <a
                    href={trackingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block break-all font-black text-green-700 transition hover:text-green-600"
                  >
                    {order.tracking_number} ↗
                  </a>
                ) : (
                  <p className="mt-1 break-all font-black text-slate-950">
                    {order.tracking_number || "Not available"}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-slate-500">
                  Shipped Date
                </p>

                <p className="mt-1 font-black text-slate-950">
                  {prettyDate(order.shipped_at)}
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-8">
          <h2 className="text-2xl font-black text-slate-950">
            Order Totals
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between gap-6 text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold">
                {money(order.subtotal)}
              </span>
            </div>

            <div className="flex justify-between gap-6 text-slate-600">
              <span>Shipping</span>
              <span className="font-bold">
                {money(order.shipping_cost)}
              </span>
            </div>

            <div className="flex justify-between gap-6 text-slate-600">
              <span>Tax</span>
              <span className="font-bold">{money(order.tax)}</span>
            </div>

            <div className="flex justify-between gap-6 border-t border-zinc-200 pt-5 text-xl font-black text-slate-950">
              <span>Total</span>
              <span>{money(order.total)}</span>
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-xl bg-green-700 px-6 py-3 font-black text-white transition hover:bg-green-800"
          >
            Continue Shopping
          </Link>

          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 py-3 font-black text-slate-800 transition hover:border-green-700 hover:text-green-700"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </main>
  );
}