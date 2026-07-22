import Link from "next/link";
import { redirect } from "next/navigation";
import CustomerLogoutButton from "@/components/account/CustomerLogoutButton";
import RecentlyViewedCards from "@/components/cards/RecentlyViewedCards";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login");
  }

  if (!user.email) {
    redirect("/account/login");
  }

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    "Collector";

  const { count: wishlistCount, error: wishlistCountError } =
    await supabase
      .from("wishlist_items")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id);

  if (wishlistCountError) {
    console.error(
      "Wishlist count error:",
      wishlistCountError.message,
    );
  }

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(
      `
        id,
        total,
        payment_status
      `,
    )
    .ilike("customer_email", user.email);

  if (ordersError) {
    console.error(
      "Customer dashboard orders error:",
      ordersError.message,
    );
  }

  const paidOrders = (orders ?? []).filter((order) => {
    const status = order.payment_status?.toLowerCase();

    return (
      status === "paid" ||
      status === "complete" ||
      status === "completed"
    );
  });

  const paidOrderIds = paidOrders.map((order) => order.id);

  let cardsPurchased = 0;

  if (paidOrderIds.length > 0) {
    const { data: orderItems, error: orderItemsError } =
      await supabase
        .from("order_items")
        .select("quantity")
        .in("order_id", paidOrderIds);

    if (orderItemsError) {
      console.error(
        "Customer dashboard order items error:",
        orderItemsError.message,
      );
    }

    cardsPurchased = (orderItems ?? []).reduce(
      (total, item) => total + Number(item.quantity ?? 0),
      0,
    );
  }

  const totalSpent = paidOrders.reduce(
    (total, order) => total + Number(order.total ?? 0),
    0,
  );

  const orderCount = orders?.length ?? 0;
  const savedCardsCount = wishlistCount ?? 0;

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-400">
              My Account
            </p>

            <h1 className="mt-3 text-4xl font-black">
              Welcome, {fullName}
            </h1>

            <p className="mt-3 max-w-2xl text-neutral-400">
              This is your personal collection hub. Track orders,
              manage your account, save favorite cards, and view your
              purchase activity here.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-neutral-200 transition hover:border-green-500 hover:text-white"
            >
              Continue Shopping
            </Link>

            <CustomerLogoutButton />
          </div>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/account/orders"
            className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-green-500/50 hover:bg-white/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-neutral-400">
                  Orders
                </p>

                <p className="mt-3 text-3xl font-black">
                  {orderCount}
                </p>

                <p className="mt-2 text-sm text-neutral-500">
                  Purchase history
                </p>
              </div>

              <span
                aria-hidden="true"
                className="text-2xl text-green-400 transition group-hover:translate-x-1"
              >
                →
              </span>
            </div>
          </Link>

          <Link
            href="/account/wishlist"
            className="group rounded-3xl border border-green-500/30 bg-green-500/10 p-6 transition hover:-translate-y-1 hover:border-green-400 hover:bg-green-500/15"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-green-300">
                  Wishlist
                </p>

                <p className="mt-3 text-3xl font-black">
                  {savedCardsCount}
                </p>

                <p className="mt-2 text-sm text-neutral-400">
                  {savedCardsCount === 1
                    ? "Saved card"
                    : "Saved cards"}
                </p>
              </div>

              <span
                aria-hidden="true"
                className="text-2xl text-green-400 transition group-hover:translate-x-1"
              >
                →
              </span>
            </div>
          </Link>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-neutral-400">
              Cards Purchased
            </p>

            <p className="mt-3 text-3xl font-black">
              {cardsPurchased}
            </p>

            <p className="mt-2 text-sm text-neutral-500">
              Across paid orders
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-neutral-400">
              Total Spent
            </p>

            <p className="mt-3 text-3xl font-black text-green-400">
              {formatCurrency(totalSpent)}
            </p>

            <p className="mt-2 break-all text-sm text-neutral-500">
              {user.email}
            </p>
          </div>
        </section>

        <RecentlyViewedCards />
        
        <section className="mt-10 rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-2xl font-black">
            Build Your Collection
          </h2>

          <p className="mt-4 text-neutral-400">
            Browse available cards, save your favorites, and review
            your orders and shipping updates from one place.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-xl bg-green-500 px-6 py-3 font-black text-black transition hover:bg-green-400"
            >
              Browse Cards
            </Link>

            <Link
              href="/account/orders"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 px-6 py-3 font-black text-white transition hover:border-green-500 hover:text-green-400"
            >
              View Orders
            </Link>

            <Link
              href="/account/wishlist"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 px-6 py-3 font-black text-white transition hover:border-green-500 hover:text-green-400"
            >
              View Wishlist
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}