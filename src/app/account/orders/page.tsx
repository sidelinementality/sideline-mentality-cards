import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type CustomerOrder = {
  id: string;
  created_at: string;
  total: number | string | null;
  payment_status: string | null;
  fulfillment_status: string | null;
  shipping_carrier: string | null;
  tracking_number: string | null;
  shipped_at: string | null;
};

function formatCurrency(value: number | string | null) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "$0.00";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatStatus(value: string | null) {
  if (!value) {
    return "Pending";
  }

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getPaymentStatusClasses(status: string | null) {
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
    normalizedStatus === "canceled"
  ) {
    return "bg-red-100 text-red-700";
  }

  return "bg-amber-100 text-amber-800";
}

function getFulfillmentStatusClasses(status: string | null) {
  const normalizedStatus = status?.toLowerCase();

  if (
    normalizedStatus === "shipped" ||
    normalizedStatus === "delivered"
  ) {
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

export default async function CustomerOrdersPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login");
  }

  if (!user.email) {
    redirect("/account");
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        created_at,
        total,
        payment_status,
        fulfillment_status,
        shipping_carrier,
        tracking_number,
        shipped_at
      `,
    )
    .ilike("customer_email", user.email)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Customer orders lookup error:", error.message);
  }

  const orders = (data ?? []) as CustomerOrder[];

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
              My Account
            </p>

            <h1 className="mt-3 text-4xl font-black text-slate-950 sm:text-5xl">
              My Orders
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              View your purchase history, payment status, and shipping
              updates.
            </p>
          </div>

          <Link
            href="/account"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-3 font-black text-slate-800 transition hover:border-green-700 hover:text-green-700"
          >
            Back to Account
          </Link>
        </div>

        {error ? (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-black text-red-800">
              We could not load your orders.
            </h2>

            <p className="mt-2 text-sm text-red-700">
              Please refresh the page and try again.
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-zinc-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="text-5xl">📦</div>

            <h2 className="mt-5 text-2xl font-black text-slate-950">
              No orders yet
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-slate-600">
              Orders placed using {user.email} will appear here.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-green-700 px-6 py-3 font-black text-white transition hover:bg-green-800"
            >
              Browse Cards
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-10 font-bold text-slate-600">
              {orders.length}{" "}
              {orders.length === 1 ? "order" : "orders"}
            </p>

            <div className="mt-5 space-y-5">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-lg sm:p-7"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-green-700">
                        Order
                      </p>

                      <h2 className="mt-2 text-xl font-black text-slate-950">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </h2>

                      <p className="mt-2 text-sm font-bold text-slate-500">
                        Placed {formatDate(order.created_at)}
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 lg:min-w-[540px]">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                          Total
                        </p>

                        <p className="mt-2 text-lg font-black text-slate-950">
                          {formatCurrency(order.total)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                          Payment
                        </p>

                        <span
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${getPaymentStatusClasses(
                            order.payment_status,
                          )}`}
                        >
                          {formatStatus(order.payment_status)}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                          Fulfillment
                        </p>

                        <span
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${getFulfillmentStatusClasses(
                            order.fulfillment_status,
                          )}`}
                        >
                          {formatStatus(order.fulfillment_status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {(order.shipping_carrier ||
                    order.tracking_number) && (
                    <div className="mt-6 rounded-2xl bg-zinc-50 p-4">
                      <p className="font-black text-slate-950">
                        Shipping Information
                      </p>

                      <div className="mt-2 flex flex-col gap-1 text-sm text-slate-600 sm:flex-row sm:gap-6">
                        {order.shipping_carrier && (
                          <p>
                            <span className="font-bold">Carrier:</span>{" "}
                            {order.shipping_carrier}
                          </p>
                        )}

                        {order.tracking_number && (
                          <p className="break-all">
                            <span className="font-bold">Tracking:</span>{" "}
                            {order.tracking_number}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 font-black text-white transition hover:bg-green-700"
                    >
                      View Order Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}