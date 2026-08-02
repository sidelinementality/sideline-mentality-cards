import Link from "next/link";

type TodaysPrioritiesProps = {
  draftCards: number;
  readyToPublishCards: number;
  lowStockCards: number;
  missingBackImages: number;
  pendingOrders: number;
};

export default function TodaysPriorities({
  draftCards,
  readyToPublishCards,
  lowStockCards,
  missingBackImages,
  pendingOrders,
}: TodaysPrioritiesProps) {
  const totalTasks =
    draftCards +
    readyToPublishCards +
    lowStockCards +
    missingBackImages +
    pendingOrders;

  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03]">
      <div className="border-b border-white/10 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">
              Dealer OS
            </p>

            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Today&apos;s Priorities
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Review the cards and orders that need your attention.
            </p>
          </div>

          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-400">
              Open Tasks
            </p>

            <p className="mt-1 text-3xl font-black text-white">
              {totalTasks}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-5">
        <PriorityCard
          label="Draft Cards"
          value={draftCards}
          description="Cards still being prepared"
          href="/dashboard/inventory?status=Draft"
          urgency="neutral"
        />

        <PriorityCard
          label="Ready to Publish"
          value={readyToPublishCards}
          description="Cards ready for the storefront"
          href="/dashboard/inventory?status=Ready%20to%20Publish"
          urgency="success"
        />

        <PriorityCard
          label="Low Stock"
          value={lowStockCards}
          description="Listings with limited quantity"
          href="/dashboard/inventory"
          urgency="warning"
        />

        <PriorityCard
          label="Missing Back Image"
          value={missingBackImages}
          description="Listings needing complete photos"
          href="/dashboard/inventory"
          urgency="warning"
        />

        <PriorityCard
          label="Orders to Ship"
          value={pendingOrders}
          description="Paid orders awaiting fulfillment"
          href="/dashboard/orders"
          urgency="danger"
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-5 sm:flex-row sm:px-8">
        <Link
          href="/dashboard/inventory/new"
          className="inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white transition hover:bg-green-500"
        >
          + Add Card
        </Link>

        <Link
          href="/dashboard/inventory"
          className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-black text-white transition hover:border-white/30 hover:bg-white/5"
        >
          Review Inventory
        </Link>

        <Link
          href="/dashboard/orders"
          className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-black text-white transition hover:border-white/30 hover:bg-white/5"
        >
          View Orders
        </Link>
      </div>
    </section>
  );
}

type PriorityCardProps = {
  label: string;
  value: number;
  description: string;
  href: string;
  urgency: "neutral" | "success" | "warning" | "danger";
};

function PriorityCard({
  label,
  value,
  description,
  href,
  urgency,
}: PriorityCardProps) {
  const styles = {
    neutral: {
      number: "text-zinc-200",
      badge: "border-zinc-500/20 bg-zinc-500/10",
    },
    success: {
      number: "text-green-400",
      badge: "border-green-500/20 bg-green-500/10",
    },
    warning: {
      number: "text-amber-400",
      badge: "border-amber-500/20 bg-amber-500/10",
    },
    danger: {
      number: "text-red-400",
      badge: "border-red-500/20 bg-red-500/10",
    },
  };

  const selectedStyle = styles[urgency];

  return (
    <Link
      href={href}
      className="group bg-zinc-950 p-6 transition hover:bg-white/[0.04]"
    >
      <div
        className={`inline-flex min-w-12 items-center justify-center rounded-xl border px-3 py-2 ${selectedStyle.badge}`}
      >
        <span className={`text-2xl font-black ${selectedStyle.number}`}>
          {value}
        </span>
      </div>

      <h3 className="mt-5 font-black text-white transition group-hover:text-green-400">
        {label}
      </h3>

      <p className="mt-2 text-sm leading-6 text-zinc-500">
        {description}
      </p>

      <p className="mt-4 text-xs font-black uppercase tracking-[0.15em] text-zinc-600 transition group-hover:text-green-400">
        Review →
      </p>
    </Link>
  );
}