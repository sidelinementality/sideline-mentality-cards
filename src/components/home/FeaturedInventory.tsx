import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Card = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  price: number | string | null;
  image_url: string | null;
  featured: boolean | null;
  brand: string | null;
  year: string | number | null;
  stock: number | null;
  rookie_card: boolean | null;
  autograph: boolean | null;
  grade_company: string | null;
  grade: string | null;
};

function formatCurrency(value: number | string | null) {
  const price = Number(value);

  if (!Number.isFinite(price)) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default async function FeaturedInventory() {
  const { data: cards, error } = await supabase
    .from("cards")
    .select(
      `
        id,
        slug,
        player_name,
        sport,
        price,
        image_url,
        featured,
        brand,
        year,
        stock,
        rookie_card,
        autograph,
        grade_company,
        grade
      `,
    )
    .eq("featured", true)
.eq("website_ready", true)
.eq("listing_status", "Published")
.gt("stock", 0)
.order("created_at", { ascending: false })
.limit(4);

  if (error) {
    console.error("Featured inventory error:", error);
  }

  return (
    <section
      id="featured"
      className="relative overflow-hidden bg-neutral-950 px-6 py-24 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.08),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-400">
              Featured Inventory
            </p>

            <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Standout cards for serious collectors
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-neutral-400">
              Explore hand-selected cards from across the hobby, including
              rookies, autographs, graded cards, and collector favorites.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex w-fit items-center justify-center rounded-full border border-green-500/50 px-6 py-3 text-sm font-black text-green-400 transition hover:border-green-400 hover:bg-green-500 hover:text-black"
          >
            View All Cards →
          </Link>
        </div>

        {!cards || cards.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-lg font-bold text-white">
              No featured cards are available yet.
            </p>

            <p className="mt-2 text-sm text-neutral-400">
              Mark cards as featured in the Dealer Center to display them here.
            </p>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {(cards as Card[]).map((card) => {
              const stock = Number(card.stock ?? 0);
              const isSoldOut = stock <= 0;
              const isLowStock = stock > 0 && stock <= 3;

              const gradeLabel =
                card.grade_company && card.grade
                  ? `${card.grade_company} ${card.grade}`
                  : card.grade_company;

              return (
                <article
                  key={card.id}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] shadow-2xl transition duration-300 hover:-translate-y-2 hover:border-green-500/40 hover:shadow-green-500/10"
                >
                  <Link
                    href={`/cards/${card.slug}`}
                    className="relative block aspect-[4/5] overflow-hidden bg-gradient-to-br from-neutral-900 via-black to-green-950 p-5"
                  >
                    <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
                      {card.rookie_card && (
                        <span className="rounded-full bg-blue-500 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
                          Rookie
                        </span>
                      )}

                      {card.autograph && (
                        <span className="rounded-full bg-purple-500 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
                          Auto
                        </span>
                      )}

                      {isSoldOut && (
                        <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
                          Sold Out
                        </span>
                      )}

                      {isLowStock && (
                        <span className="rounded-full bg-amber-400 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-black shadow-lg">
                          Only {stock} Left
                        </span>
                      )}
                    </div>

                    {card.image_url ? (
                      <img
                        src={card.image_url}
                        alt={`${card.player_name} sports card`}
                        className={`h-full w-full rounded-2xl object-contain transition duration-500 group-hover:scale-110 group-hover:rotate-[1deg] ${
                          isSoldOut ? "opacity-60" : ""
                        }`}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-center">
                        <span className="text-sm font-black uppercase tracking-[0.2em] text-green-400">
                          Card Image Coming Soon
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="mb-6 rounded-full bg-white px-5 py-2 text-sm font-black text-black shadow-xl">
                        View Card
                      </span>
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-green-400">
                        {card.sport || "Sports Card"}
                      </p>

                      {gradeLabel && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-neutral-300">
                          {gradeLabel}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-xl font-black leading-tight text-white">
                      {card.player_name}
                    </h3>

                    <p className="mt-2 text-sm text-neutral-400">
                      {[card.year, card.brand].filter(Boolean).join(" • ")}
                    </p>

                    <div className="mt-4">
                      {isSoldOut ? (
                        <p className="text-sm font-bold text-red-400">
                          Currently unavailable
                        </p>
                      ) : isLowStock ? (
                        <p className="text-sm font-bold text-amber-400">
                          Low Stock — Only {stock} Left
                        </p>
                      ) : (
                        <p className="text-sm font-bold text-green-400">
                          In Stock
                        </p>
                      )}
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                          Price
                        </p>

                        <p className="mt-1 text-2xl font-black text-white">
                          {formatCurrency(card.price)}
                        </p>
                      </div>

                      <Link
                        href={`/cards/${card.slug}`}
                        className="text-sm font-black text-green-400 transition group-hover:text-green-300"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}