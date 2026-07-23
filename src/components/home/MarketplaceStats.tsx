import { supabase } from "@/lib/supabase";

const statIcons = {
  listings: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 8h8M8 12h8M8 16h5"
      />
    </svg>
  ),

  cards: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 7h6M9 17h6"
      />
    </svg>
  ),

  value: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 8.5c-.8-.9-2-1.5-3.5-1.5-2 0-3.5 1-3.5 2.5S10.5 12 12.5 12 16 13 16 14.5 14.5 17 12.5 17c-1.7 0-3.1-.7-4-1.8M12 5v14"
      />
    </svg>
  ),

  sports: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.7 5.7 18.3 18.3M18.3 5.7 5.7 18.3"
      />
    </svg>
  ),
};

export default async function MarketplaceStats() {
  const { data: cards, error } = await supabase
    .from("cards")
    .select("id, price, stock, sport");

  if (error || !cards) {
    return null;
  }

  const activeListings = cards.filter(
    (card) => Number(card.stock ?? 0) > 0,
  ).length;

  const totalCards = cards.reduce(
    (sum, card) => sum + Number(card.stock ?? 0),
    0,
  );

  const inventoryValue = cards.reduce(
    (sum, card) =>
      sum + Number(card.price ?? 0) * Number(card.stock ?? 0),
    0,
  );

  const sports = new Set(
    cards
      .map((card) => card.sport?.trim())
      .filter((sport): sport is string => Boolean(sport)),
  );

  const stats = [
    {
      value: activeListings.toLocaleString(),
      label: "Active Listings",
      description: "Available to purchase now",
      icon: statIcons.listings,
    },
    {
      value: totalCards.toLocaleString(),
      label: "Cards Available",
      description: "Across the full inventory",
      icon: statIcons.cards,
    },
    {
      value: inventoryValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
      label: "Inventory Value",
      description: "Current marketplace selection",
      icon: statIcons.value,
    },
    {
      value: sports.size.toLocaleString(),
      label: "Sports & Categories",
      description: "Something for every collector",
      icon: statIcons.sports,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-black px-5 py-20 text-white sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-0 h-px w-full max-w-7xl -translate-x-1/2 bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

        <div className="absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-green-500/5 blur-3xl" />

        <div className="absolute -right-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-green-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-green-400">
              Marketplace Snapshot
            </p>

            <h2 className="mt-4 max-w-2xl text-3xl font-black uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
              A Growing Collection
              <span className="block text-neutral-400">
                Built for the Hobby.
              </span>
            </h2>
          </div>

          <p className="max-w-xl text-base leading-7 text-neutral-400 lg:text-right">
            Explore a carefully selected inventory of rookies, stars,
            legends, graded cards, autographs, and collector favorites.
          </p>
        </div>

        <div className="mt-12 grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/30 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`group relative p-7 transition duration-300 hover:bg-white/[0.06] sm:p-8 ${
                index > 0
                  ? "border-t border-white/10 sm:[&:nth-child(even)]:border-l lg:border-l lg:border-t-0"
                  : ""
              } ${
                index >= 2
                  ? "sm:border-t lg:border-t-0"
                  : ""
              }`}
            >
              <div
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-green-500 to-transparent transition duration-300 group-hover:scale-x-100"
                aria-hidden="true"
              />

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-green-500/25 bg-green-500/10 text-green-400 transition duration-300 group-hover:border-green-500/50 group-hover:bg-green-500/15">
                {stat.icon}
              </div>

              <p className="mt-7 text-4xl font-black tracking-tight text-white sm:text-5xl">
                {stat.value}
              </p>

              <p className="mt-3 text-sm font-black uppercase tracking-[0.18em] text-green-400">
                {stat.label}
              </p>

              <p className="mt-3 text-sm leading-6 text-neutral-500">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-col gap-3 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Inventory totals update automatically as cards are added or sold.</p>

          <p className="font-semibold text-neutral-400">
            Secure checkout powered by Stripe
          </p>
        </div>
      </div>
    </section>
  );
}