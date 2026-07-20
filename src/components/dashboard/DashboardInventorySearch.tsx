import Link from "next/link";

type InventoryCard = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  year: number | null;
  brand: string | null;
  price: number | string | null;
  image_url: string | null;
  featured: boolean | null;
  stock: number | null;
  created_at: string | null;
};

type DashboardInventorySearchProps = {
  inventory: InventoryCard[];
};

export default function DashboardInventorySearch({
  inventory,
}: DashboardInventorySearchProps) {
  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
            Inventory Search
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Dashboard Inventory Search
          </h2>

          <p className="mt-2 text-zinc-400">
            Search your cards, review stock levels, and quickly open the full
            inventory manager.
          </p>
        </div>

        <Link
          href="/dashboard/inventory"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-3 text-sm font-black text-green-300 transition hover:bg-green-500/20"
        >
          View Full Inventory
        </Link>
      </div>

      {inventory.length === 0 ? (
        <div className="p-8 text-center">
          <p className="font-semibold text-white">
            No inventory is available yet.
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Add your first card to begin managing inventory.
          </p>

          <Link
            href="/sell"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white transition hover:bg-green-500"
          >
            Add Your First Card
          </Link>
        </div>
      ) : (
        <div className="p-6">
          <div className="overflow-hidden rounded-xl border border-white/10">
            <div className="hidden grid-cols-[1.5fr_0.8fr_0.8fr_0.7fr_0.8fr] gap-4 border-b border-white/10 bg-black/30 px-5 py-4 text-xs font-bold uppercase tracking-wide text-zinc-500 lg:grid">
              <p>Card</p>
              <p>Sport</p>
              <p>Brand</p>
              <p>Stock</p>
              <p className="text-right">Price</p>
            </div>

            <div className="divide-y divide-white/10">
              {inventory.slice(0, 8).map((card) => (
                <article
                  key={card.id}
                  className="grid gap-4 bg-black/10 p-5 lg:grid-cols-[1.5fr_0.8fr_0.8fr_0.7fr_0.8fr] lg:items-center"
                >
                  <div>
                    <Link
                      href={`/cards/${card.slug}`}
                      className="font-black text-white transition hover:text-green-300"
                    >
                      {card.player_name}
                    </Link>

                    <p className="mt-1 text-sm text-zinc-500">
                      {[card.year, card.brand]
                        .filter(Boolean)
                        .join(" • ") || "Card details unavailable"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 lg:hidden">
                      Sport
                    </p>

                    <p className="mt-1 font-bold text-white lg:mt-0">
                      {card.sport || "Not listed"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 lg:hidden">
                      Brand
                    </p>

                    <p className="mt-1 font-bold text-white lg:mt-0">
                      {card.brand || "Not listed"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 lg:hidden">
                      Stock
                    </p>

                    <p
                      className={`mt-1 font-black lg:mt-0 ${
                        Number(card.stock ?? 0) === 0
                          ? "text-red-300"
                          : Number(card.stock ?? 0) <= 2
                            ? "text-yellow-300"
                            : "text-green-300"
                      }`}
                    >
                      {Number(card.stock ?? 0)}
                    </p>
                  </div>

                  <div className="lg:text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 lg:hidden">
                      Price
                    </p>

                    <p className="mt-1 font-black text-white lg:mt-0">
                      {formatCurrency(Number(card.price ?? 0))}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}