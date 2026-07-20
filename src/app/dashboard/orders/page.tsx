import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

type Order = {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  total: number | string | null;
  payment_status: string | null;
  fulfillment_status: string | null;
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
    month: "short",
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

export default async function OrdersPage() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      `
        id,
        customer_name,
        customer_email,
        total,
        payment_status,
        fulfillment_status,
        created_at
      `,
    )
    .order("created_at", {
      ascending: false,
    });

  const orders = (data ?? []) as Order[];

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total ?? 0),
    0,
  );

  const pendingOrders = orders.filter(
    (order) =>
      order.fulfillment_status?.toLowerCase() === "pending",
  ).length;

  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-400">
              Dealer Center
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight">
              Orders
            </h1>

            <p className="mt-3 max-w-2xl text-neutral-400">
              Review customer purchases, payment status, and
              fulfillment progress.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex w-fit items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold transition hover:bg-white/10"
          >
            Back to Dashboard
          </Link>
        </div>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold text-neutral-400">
              Total Orders
            </p>

            <p className="mt-3 text-3xl font-black">
              {orders.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold text-neutral-400">
              Pending Fulfillment
            </p>

            <p className="mt-3 text-3xl font-black">
              {pendingOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold text-neutral-400">
              Total Revenue
            </p>

            <p className="mt-3 text-3xl font-black text-green-400">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </section>

        {error ? (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">
            <p className="font-bold">Orders could not be loaded.</p>

            <p className="mt-2 text-sm">{error.message}</p>
          </div>
        ) : null}

        {!error && orders.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-16 text-center">
            <h2 className="text-2xl font-black">
              No orders yet
            </h2>

            <p className="mt-3 text-neutral-400">
              Customer orders will appear here after a successful
              Stripe payment.
            </p>
          </div>
        ) : null}

        {!error && orders.length > 0 ? (
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-white/10 bg-black/20">
                  <tr className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400">
                    <th className="px-6 py-4">Order</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Fulfillment</th>
                    <th className="px-6 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition hover:bg-white/[0.03]"
                    >
                      <td className="px-6 py-5">
                        <p className="font-bold">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>

                        <p className="mt-1 text-sm text-neutral-500">
                          {formatDate(order.created_at)}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-semibold">
                          {order.customer_name ||
                            "Customer name unavailable"}
                        </p>

                        <p className="mt-1 text-sm text-neutral-400">
                          {order.customer_email ||
                            "Email unavailable"}
                        </p>
                      </td>

                      <td className="px-6 py-5 font-bold">
                        {formatCurrency(order.total)}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${getStatusClasses(
                            order.payment_status,
                          )}`}
                        >
                          {order.payment_status || "unknown"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${getStatusClasses(
                            order.fulfillment_status,
                          )}`}
                        >
                          {order.fulfillment_status || "unknown"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/dashboard/orders/${order.id}`}
                          className="inline-flex rounded-full border border-white/15 px-4 py-2 text-sm font-bold transition hover:bg-white/10"
                        >
                          View Order
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}