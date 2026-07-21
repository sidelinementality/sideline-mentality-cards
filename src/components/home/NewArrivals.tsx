import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Card = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  price: number | string | null;
  image_url: string | null;
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

export default async function NewArrivals() {
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
        brand,
        year,
        stock,
        rookie_card,
        autograph,
        grade_company,
        grade
      `,
    )
    .gt("stock", 0)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("New arrivals error:", error);
  }

  return (
    <section className="bg-white px-6 py-24 text-neutral-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
              Just Added
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              New Arrivals
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-neutral-600">
              Explore the newest cards added to Sideline Mentality Cards.
              Inventory updates automatically as new cards are listed.
            </p>
          </div>

          <Link
            href="/shop?sort=newest"
            className="inline-flex w-fit items-center justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-black text-neutral-950 transition hover:border-green-700 hover:bg-green-700 hover:text-white"
          >
            Shop New Arrivals →
          </Link>
        </div>

        {!cards || cards.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-10 text-center">
            <p className="text-lg font-black">No new arrivals yet.</p>

            <p className="mt-2 text-sm text-neutral-600">
              New inventory will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {(cards as Card[]).map((card) => {
              const stock = Number(card.stock ?? 0);
              const isLowStock = stock <= 3;

              const gradeLabel =
                card.grade_company && card.grade
                  ? `${card.grade_company} ${card.grade}`
                  : card.grade_company;

              return (
                <article
                  key={card.id}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-green-700/30 hover:shadow-2xl"
                >
                  <Link
                    href={`/cards/${card.slug}`}
                    className="relative block aspect-[4/5] overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-green-950 p-5"
                  >
                    <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
                      <span className="rounded-full bg-green-500 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-black shadow-lg">
                        New
                      </span>

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
                        className="h-full w-full rounded-2xl object-contain transition duration-500 group-hover:scale-110 group-hover:rotate-[1deg]"
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
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-green-700">
                        {card.sport || "Sports Card"}
                      </p>

                      {gradeLabel && (
                        <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-neutral-700">
                          {gradeLabel}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-xl font-black leading-tight">
                      {card.player_name}
                    </h3>

                    <p className="mt-2 text-sm text-neutral-500">
                      {[card.year, card.brand].filter(Boolean).join(" • ")}
                    </p>

                    <div className="mt-4">
                      {isLowStock ? (
                        <p className="text-sm font-bold text-amber-600">
                          Low Stock — Only {stock} Left
                        </p>
                      ) : (
                        <p className="text-sm font-bold text-green-700">
                          In Stock
                        </p>
                      )}
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-4 border-t border-neutral-200 pt-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
                          Price
                        </p>

                        <p className="mt-1 text-2xl font-black">
                          {formatCurrency(card.price)}
                        </p>
                      </div>

                      <Link
                        href={`/cards/${card.slug}`}
                        className="text-sm font-black text-green-700 transition group-hover:text-green-600"
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