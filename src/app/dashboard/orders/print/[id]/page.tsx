import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import PrintPackingSlipButton from "@/components/orders/PrintPackingSlipButton";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(
    "STRIPE_SECRET_KEY is missing from .env.local.",
  );
}

const stripe = new Stripe(stripeSecretKey);

type PackingSlipPageProps = {
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
  created_at: string | null;
};

type OrderItem = {
  id: string;
  order_id: string;
  player_name: string | null;
  quantity: number | null;
  price: number | string | null;
};

type ShippingAddress = {
  name: string | null;
  phone: string | null;
  line1: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
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
  }).format(new Date(value));
}

export default async function PackingSlipPage({
  params,
}: PackingSlipPageProps) {
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
          created_at
        `,
      )
      .eq("id", id)
      .single();

  const order = orderData as Order | null;

  if (orderError || !order) {
    console.error("Packing slip order error:", orderError);
    notFound();
  }

  const { data: orderItemsData, error: orderItemsError } =
    await supabaseAdmin
      .from("order_items")
      .select(
        `
          id,
          order_id,
          player_name,
          quantity,
          price
        `,
      )
      .eq("order_id", order.id)
      .order("created_at", {
        ascending: true,
      });

  if (orderItemsError) {
    console.error(
      "Packing slip order items error:",
      orderItemsError,
    );
  }

  const orderItems = (orderItemsData ?? []) as OrderItem[];

  let shippingAddress: ShippingAddress = {
    name: order.customer_name,
    phone: null,
    line1: null,
    line2: null,
    city: null,
    state: null,
    postalCode: null,
    country: null,
  };

  if (order.stripe_payment_intent) {
    try {
      const paymentIntent =
        await stripe.paymentIntents.retrieve(
          order.stripe_payment_intent,
        );

      shippingAddress = {
        name:
          paymentIntent.shipping?.name ??
          order.customer_name,
        phone: paymentIntent.shipping?.phone ?? null,
        line1:
          paymentIntent.shipping?.address?.line1 ?? null,
        line2:
          paymentIntent.shipping?.address?.line2 ?? null,
        city:
          paymentIntent.shipping?.address?.city ?? null,
        state:
          paymentIntent.shipping?.address?.state ?? null,
        postalCode:
          paymentIntent.shipping?.address
            ?.postal_code ?? null,
        country:
          paymentIntent.shipping?.address?.country ??
          null,
      };
    } catch (error) {
      console.error(
        "Unable to load Stripe shipping address:",
        error,
      );
    }
  }

  const subtotal = orderItems.reduce(
    (sum, item) =>
      sum +
      Number(item.price ?? 0) *
        Number(item.quantity ?? 1),
    0,
  );

  const orderTotal = Number(order.total ?? 0);
  const shippingAmount = Math.max(
    orderTotal - subtotal,
    0,
  );

  const totalQuantity = orderItems.reduce(
    (sum, item) =>
      sum + Number(item.quantity ?? 1),
    0,
  );

  const hasShippingAddress = Boolean(
    shippingAddress.line1 ||
      shippingAddress.city ||
      shippingAddress.state ||
      shippingAddress.postalCode,
  );

  return (
    <main className="min-h-screen bg-neutral-200 px-4 py-8 text-black print:bg-white print:p-0">
      <div className="mx-auto mb-6 flex max-w-4xl items-center justify-between gap-4 print:hidden">
        <Link
          href={`/dashboard/orders/${order.id}`}
          className="rounded-xl border border-neutral-400 bg-white px-5 py-3 text-sm font-bold transition hover:bg-neutral-100"
        >
          ← Back to Order
        </Link>

        <PrintPackingSlipButton />
      </div>

      <article className="mx-auto max-w-4xl bg-white p-8 shadow-xl print:max-w-none print:p-6 print:shadow-none">
        <header className="border-b-4 border-black pb-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em]">
                Sideline Mentality
              </p>

              <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">
                Cards
              </h1>

              <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-600">
                Developing athletes. Building leaders.
                Impacting lives beyond the scoreboard.
              </p>
            </div>

            <div className="sm:text-right">
              <h2 className="text-2xl font-black uppercase">
                Packing Slip
              </h2>

              <p className="mt-3 text-sm">
                <span className="font-bold">
                  Order:
                </span>{" "}
                #{order.id.slice(0, 8).toUpperCase()}
              </p>

              <p className="mt-1 text-sm">
                <span className="font-bold">Date:</span>{" "}
                {formatDate(order.created_at)}
              </p>

              <p className="mt-1 text-sm capitalize">
                <span className="font-bold">
                  Payment:
                </span>{" "}
                {order.payment_status || "Unknown"}
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-8 border-b border-neutral-300 py-7 sm:grid-cols-2">
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
              Ship To
            </h3>

            <div className="mt-4 space-y-1 text-sm leading-6">
              <p className="font-black">
                {shippingAddress.name ||
                  order.customer_name ||
                  "Customer name unavailable"}
              </p>

              {hasShippingAddress ? (
                <>
                  {shippingAddress.line1 ? (
                    <p>{shippingAddress.line1}</p>
                  ) : null}

                  {shippingAddress.line2 ? (
                    <p>{shippingAddress.line2}</p>
                  ) : null}

                  <p>
                    {[
                      shippingAddress.city,
                      shippingAddress.state,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                    {shippingAddress.postalCode
                      ? ` ${shippingAddress.postalCode}`
                      : ""}
                  </p>

                  {shippingAddress.country &&
                  shippingAddress.country !== "US" ? (
                    <p>{shippingAddress.country}</p>
                  ) : null}
                </>
              ) : (
                <p className="font-semibold text-red-700">
                  Shipping address unavailable
                </p>
              )}

              {shippingAddress.phone ? (
                <p className="pt-2">
                  Phone: {shippingAddress.phone}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
              Customer
            </h3>

            <div className="mt-4 space-y-2 text-sm leading-6">
              <p>
                <span className="font-bold">Name:</span>{" "}
                {order.customer_name ||
                  shippingAddress.name ||
                  "Unavailable"}
              </p>

              <p className="break-all">
                <span className="font-bold">Email:</span>{" "}
                {order.customer_email || "Unavailable"}
              </p>

              <p>
                <span className="font-bold">
                  Total Cards:
                </span>{" "}
                {totalQuantity}
              </p>
            </div>
          </div>
        </section>

        <section className="py-7">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
            Items Included
          </h3>

          <div className="mt-5 overflow-hidden border border-neutral-300">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-neutral-100">
                <tr>
                  <th className="border-b border-neutral-300 px-4 py-3 font-black">
                    Card
                  </th>

                  <th className="border-b border-neutral-300 px-4 py-3 text-center font-black">
                    Qty
                  </th>

                  <th className="border-b border-neutral-300 px-4 py-3 text-right font-black">
                    Price
                  </th>

                  <th className="border-b border-neutral-300 px-4 py-3 text-right font-black">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {orderItems.length > 0 ? (
                  orderItems.map((item) => {
                    const quantity = Number(
                      item.quantity ?? 1,
                    );
                    const price = Number(
                      item.price ?? 0,
                    );
                    const lineTotal = quantity * price;

                    return (
                      <tr key={item.id}>
                        <td className="border-b border-neutral-200 px-4 py-4 font-semibold">
                          {item.player_name ||
                            "Unknown card"}
                        </td>

                        <td className="border-b border-neutral-200 px-4 py-4 text-center">
                          {quantity}
                        </td>

                        <td className="border-b border-neutral-200 px-4 py-4 text-right">
                          {formatCurrency(price)}
                        </td>

                        <td className="border-b border-neutral-200 px-4 py-4 text-right font-bold">
                          {formatCurrency(lineTotal)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-neutral-500"
                    >
                      No order items were found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ml-auto max-w-sm border-t-2 border-black pt-4">
          <div className="flex items-center justify-between py-1 text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex items-center justify-between py-1 text-sm">
            <span>Shipping</span>
            <span>
              {formatCurrency(shippingAmount)}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-neutral-300 pt-3 text-lg font-black">
            <span>Order Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </section>

        <footer className="mt-12 border-t border-neutral-300 pt-7 text-center">
          <p className="text-lg font-black">
            Thank you for supporting Sideline Mentality
            Cards!
          </p>

          <p className="mt-3 text-sm leading-6 text-neutral-600">
            Every purchase helps us continue building a
            sports and faith-based brand focused on
            developing athletes, building leaders, and
            impacting lives beyond the scoreboard.
          </p>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
            Built Different. Live Different. Leave a
            Legacy.
          </p>
        </footer>
      </article>
    </main>
  );
}