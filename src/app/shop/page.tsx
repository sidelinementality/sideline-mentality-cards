import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import ShopSearch from "@/components/shop/ShopSearch";
import ShopFilters from "@/components/shop/ShopFilters";

type ShopPageProps = {
    searchParams: Promise<{
      sport?: string;
      grade?: string;
      rookie?: string;
      auto?: string;
      sort?: string;
      page?: string;
    }>;
  };

type Card = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  team: string | null;
  year: number | null;
  brand: string | null;
  price: number | string | null;
  image_url: string | null;
  stock: number | null;
  grade_company: string | null;
  grade: string | null;
  featured: boolean | null;
  rookie_card: boolean | null;
  autograph: boolean | null;
};

function formatCurrency(value: number | string | null) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default async function ShopPage({
  searchParams,
}: ShopPageProps) {
    const {
        sport,
        grade,
        rookie,
        auto,
        sort,
        page,
      } = await searchParams;
      
      const parsedPage = Number(page ?? "1");
const currentPage =
  Number.isFinite(parsedPage) && parsedPage > 0
    ? Math.floor(parsedPage)
    : 1;

const pageSize = 24;
const rangeStart = (currentPage - 1) * pageSize;
const rangeEnd = rangeStart + pageSize - 1;

let query = supabase
.from("cards")
.select(
  `
    id,
    slug,
    player_name,
    sport,
    team,
    year,
    brand,
    price,
    image_url,
    stock,
    featured,
    grade_company,
    grade,
    rookie_card,
    autograph
  `,
  {
    count: "exact",
  },
)
    .gt("stock", 0)
.range(rangeStart, rangeEnd);

  if (sport) {
    query = query.ilike("sport", sport);
  }

  if (grade === "RAW") {
    query = query.or(
      "grade_company.is.null,grade_company.eq.RAW",
    );
  } else if (grade) {
    query = query.ilike("grade_company", grade);
  }

  if (rookie === "true") {
    query = query.eq("rookie_card", true);
  }

  if (auto === "true") {
    query = query.eq("autograph", true);
  }

  if (sort === "price-low") {
    query = query.order("price", {
      ascending: true,
    });
  } else if (sort === "price-high") {
    query = query.order("price", {
      ascending: false,
    });
  } else {
    query = query.order("created_at", {
      ascending: false,
    });
  }

  const { data, error, count } = await query;

  const cards = (data ?? []) as Card[];
  const totalCards = count ?? 0;
  const totalPages = Math.ceil(totalCards / pageSize);
  function createPageUrl(targetPage: number) {
    const params = new URLSearchParams();
  
    if (sport) {
      params.set("sport", sport);
    }
  
    if (grade) {
      params.set("grade", grade);
    }
  
    if (rookie) {
      params.set("rookie", rookie);
    }
  
    if (auto) {
      params.set("auto", auto);
    }
  
    if (sort) {
      params.set("sort", sort);
    }
  
    if (targetPage > 1) {
      params.set("page", String(targetPage));
    }
  
    const queryString = params.toString();
  
    return queryString ? `/shop?${queryString}` : "/shop";
  }
  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-12 text-white sm:px-6">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
              Sideline Mentality Cards
            </p>

            <h1 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">
              {sport ? `${sport} Cards` : "Shop All Cards"}
            </h1>

            <p className="mt-4 max-w-2xl text-neutral-400">
              Browse available sports cards from Sideline Mentality Cards.
            </p>
          </div>

          <div className="max-w-2xl">
            <ShopSearch cards={cards} />
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
                !sport
                  ? "border-green-500 bg-green-500 text-black"
                  : "border-white/20 hover:border-green-500 hover:text-green-400"
              }`}
            >
              All Cards
            </Link>

            <Link
              href="/shop?sport=Football"
              className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
                sport === "Football"
                  ? "border-green-500 bg-green-500 text-black"
                  : "border-white/20 hover:border-green-500 hover:text-green-400"
              }`}
            >
              Football
            </Link>

            <Link
              href="/shop?sport=Basketball"
              className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
                sport === "Basketball"
                  ? "border-green-500 bg-green-500 text-black"
                  : "border-white/20 hover:border-green-500 hover:text-green-400"
              }`}
            >
              Basketball
            </Link>

            <Link
              href="/shop?sport=Baseball"
              className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
                sport === "Baseball"
                  ? "border-green-500 bg-green-500 text-black"
                  : "border-white/20 hover:border-green-500 hover:text-green-400"
              }`}
            >
              Baseball
            </Link>
          </div>

          <ShopFilters />
        </div>

        {error ? (
          <div className="mt-10 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
            Unable to load cards right now.
          </div>
        ) : cards.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <h2 className="text-2xl font-black">
              No cards match those filters
            </h2>

            <p className="mt-3 text-neutral-400">
              Try removing one or more filters to see additional inventory.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex rounded-xl bg-green-500 px-5 py-3 font-black text-black transition hover:bg-green-400"
            >
              Clear All Filters
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm font-bold text-neutral-400">
                {cards.length}{" "}
                {cards.length === 1 ? "card" : "cards"} found
              </p>

              {(grade || rookie || auto || sort) && (
                <Link
                  href={sport ? `/shop?sport=${sport}` : "/shop"}
                  className="text-sm font-bold text-green-400 hover:text-green-300"
                >
                  Clear Filters
                </Link>
              )}
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cards.map((card) => (
                <Link
                  key={card.id}
                  href={`/cards/${card.slug}`}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.03] shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-green-500/60 hover:shadow-[0_20px_50px_rgba(34,197,94,0.18)]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-neutral-900 to-black">
                    {card.image_url ? (
                      <Image
                        src={card.image_url}
                        alt={card.player_name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain p-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-[1deg]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                        No image available
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
  <span className="mb-5 rounded-full bg-white px-5 py-2 text-sm font-black text-black shadow-lg">
    View Card
  </span>
</div>
                  </div>

                  <div className="flex h-full flex-col p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400">
                      {card.sport || "Sports Card"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
  {card.featured && (
    <span className="rounded-full bg-yellow-500 px-2 py-1 text-[10px] font-black uppercase text-black">
      Featured
    </span>
  )}

  {card.rookie_card && (
    <span className="rounded-full bg-green-500 px-2 py-1 text-[10px] font-black uppercase text-black">
      Rookie
    </span>
  )}

  {card.autograph && (
    <span className="rounded-full bg-purple-500 px-2 py-1 text-[10px] font-black uppercase text-white">
      Auto
    </span>
  )}

  {card.stock !== null && card.stock <= 3 && (
    <span className="rounded-full border border-red-500 bg-red-500/15 px-2 py-1 text-[10px] font-black uppercase text-red-300">
      Only {card.stock} Left
    </span>
  )}
</div>

                    <h2 className="mt-2 text-xl font-black">
                      {card.player_name}
                    </h2>

                    <p className="mt-2 text-sm text-neutral-400">
                      {[card.year, card.brand]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                    <div className="mt-3">
  {Number(card.stock ?? 0) > 3 ? (
    <p className="text-sm font-bold text-green-400">
      In Stock
    </p>
  ) : Number(card.stock ?? 0) > 0 ? (
    <p className="text-sm font-bold text-amber-400">
      Low Stock — Only {card.stock} Left
    </p>
  ) : (
    <p className="text-sm font-bold text-red-400">
      Sold Out
    </p>
  )}
</div>

                    {(card.grade_company ||
                      card.grade ||
                      card.rookie_card ||
                      card.autograph) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {card.grade_company && (
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-neutral-300">
                            {card.grade_company}{" "}
                            {card.grade}
                          </span>
                        )}

                        {card.rookie_card && (
                          <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                            Rookie
                          </span>
                        )}

                        {card.autograph && (
                          <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                            Autograph
                          </span>
                        )}
                      </div>
                    )}

<div className="mt-auto flex items-end justify-between border-t border-white/10 pt-5">
<div>
  <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
    Price
  </p>

  <p className="mt-1 text-2xl font-black text-white">
    {formatCurrency(card.price)}
  </p>
</div>

                      <span className="text-sm font-bold text-green-400">
                        View Card →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
  <nav
    aria-label="Shop pagination"
    className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row"
  >
    <div className="text-sm font-semibold text-neutral-400">
      Page {currentPage} of {totalPages}
    </div>

    <div className="flex items-center gap-3">
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="rounded-xl border border-white/20 px-5 py-3 text-sm font-black transition hover:border-green-500 hover:text-green-400"
        >
          ← Previous
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-xl border border-white/10 px-5 py-3 text-sm font-black text-neutral-600">
          ← Previous
        </span>
      )}

      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="rounded-xl bg-green-500 px-5 py-3 text-sm font-black text-black transition hover:bg-green-400"
        >
          Next →
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-xl bg-white/5 px-5 py-3 text-sm font-black text-neutral-600">
          Next →
        </span>
      )}
    </div>
  </nav>
)}
          </>
        )}
      </section>
    </main>
  );
}