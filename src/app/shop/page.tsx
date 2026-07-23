import Image from "next/image";
import Link from "next/link";
import ActiveFilterChips from "@/components/shop/ActiveFilterChips";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopSearch from "@/components/shop/ShopSearch";
import { supabase } from "@/lib/supabase";
import ShopCardQuickView from "@/components/shop/ShopCardQuickView";

type ShopPageProps = {
    searchParams: Promise<{
        sport?: string;
        grade?: string;
        rookie?: string;
        auto?: string;
        price?: string;
        featured?: string;
        graded?: string;
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

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const {
        sport,
        grade,
        rookie,
        auto,
        price,
        featured,
        graded,
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
    query = query.or("grade_company.is.null,grade_company.eq.RAW");
  } else if (grade) {
    query = query.ilike("grade_company", grade);
  }

  if (rookie === "true") {
    query = query.eq("rookie_card", true);
  }

  if (auto === "true") {
    query = query.eq("autograph", true);
  }
  if (featured === "true") {
    query = query.eq("featured", true);
  }
  
  if (graded === "true") {
    query = query
      .not("grade_company", "is", null)
      .neq("grade_company", "RAW");
  }
  
  if (price === "under-25") {
    query = query.lt("price", 25);
  } else if (price === "under-50") {
    query = query.lt("price", 50);
  } else if (price === "under-100") {
    query = query.lt("price", 100);
  } else if (price === "100-plus") {
    query = query.gte("price", 100);
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

  const visibleStart =
    totalCards === 0 ? 0 : Math.min(rangeStart + 1, totalCards);

  const visibleEnd =
    totalCards === 0 ? 0 : Math.min(rangeStart + cards.length, totalCards);

    const hasActiveFilters = Boolean(
        grade ||
          rookie ||
          auto ||
          price ||
          featured ||
          graded ||
          sort,
      );

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
      
      if (price) {
        params.set("price", price);
      }
      
      if (featured) {
        params.set("featured", featured);
      }
      
      if (graded) {
        params.set("graded", graded);
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
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-black px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-green-500/5 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-green-500 sm:w-16" />

                <p className="text-xs font-black uppercase tracking-[0.3em] text-green-400">
                  Sideline Mentality Cards
                </p>
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-7xl">
                {sport ? (
                  <>
                    Shop
                    <span className="block text-green-400">{sport} Cards</span>
                  </>
                ) : (
                  <>
                    Shop the
                    <span className="block text-green-400">Collection</span>
                  </>
                )}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-400 sm:text-lg">
                Discover standout rookies, graded cards, autographs, and
                collector-worthy inventory from across the sports world.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-3xl font-black text-white">
                  {totalCards.toLocaleString()}
                </p>

                <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
                  Available Cards
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-3xl font-black text-green-400">5</p>

                <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
                  Sports
                </p>
              </div>

              <div className="col-span-2 rounded-2xl border border-green-500/20 bg-green-500/10 p-5 sm:col-span-1 lg:col-span-2">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-green-400">
                  New inventory added regularly
                </p>

                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Check back often for recently added cards and featured finds.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-3xl border border-white/10 bg-neutral-950/90 p-4 shadow-2xl backdrop-blur sm:p-6">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                Search the marketplace
              </p>

              <ShopSearch cards={cards} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-6">
              <Link
                href="/shop"
                className={`rounded-xl border px-4 py-2.5 text-sm font-black transition ${
                  !sport
                    ? "border-green-500 bg-green-500 text-black"
                    : "border-white/15 bg-white/5 text-white hover:border-green-500 hover:text-green-400"
                }`}
              >
                All Cards
              </Link>

              <Link
                href="/shop?sport=Football"
                className={`rounded-xl border px-4 py-2.5 text-sm font-black transition ${
                  sport === "Football"
                    ? "border-green-500 bg-green-500 text-black"
                    : "border-white/15 bg-white/5 text-white hover:border-green-500 hover:text-green-400"
                }`}
              >
                Football
              </Link>

              <Link
                href="/shop?sport=Basketball"
                className={`rounded-xl border px-4 py-2.5 text-sm font-black transition ${
                  sport === "Basketball"
                    ? "border-green-500 bg-green-500 text-black"
                    : "border-white/15 bg-white/5 text-white hover:border-green-500 hover:text-green-400"
                }`}
              >
                Basketball
              </Link>

              <Link
                href="/shop?sport=Baseball"
                className={`rounded-xl border px-4 py-2.5 text-sm font-black transition ${
                  sport === "Baseball"
                    ? "border-green-500 bg-green-500 text-black"
                    : "border-white/15 bg-white/5 text-white hover:border-green-500 hover:text-green-400"
                }`}
              >
                Baseball
              </Link>

              <Link
                href="/shop?sport=UFC"
                className={`rounded-xl border px-4 py-2.5 text-sm font-black transition ${
                  sport === "UFC"
                    ? "border-green-500 bg-green-500 text-black"
                    : "border-white/15 bg-white/5 text-white hover:border-green-500 hover:text-green-400"
                }`}
              >
                UFC
              </Link>

              <Link
                href="/shop?sport=WWE"
                className={`rounded-xl border px-4 py-2.5 text-sm font-black transition ${
                  sport === "WWE"
                    ? "border-green-500 bg-green-500 text-black"
                    : "border-white/15 bg-white/5 text-white hover:border-green-500 hover:text-green-400"
                }`}
              >
                WWE
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5">
          <ShopFilters />
        </div>

        <ActiveFilterChips
  sport={sport}
  grade={grade}
  rookie={rookie}
  auto={auto}
  price={price}
  featured={featured}
  graded={graded}
  sort={sort}
/>

        {error ? (
          <div className="mt-10 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
            Unable to load cards right now.
          </div>
        ) : cards.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">
              No Results
            </p>

            <h2 className="mt-4 text-2xl font-black uppercase">
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
            <div className="mt-10 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
                  Marketplace Inventory
                </p>

                <h2 className="mt-2 text-2xl font-black uppercase tracking-tight sm:text-3xl">
                  {sport ? `${sport} Collection` : "Available Cards"}
                </h2>

                <p className="mt-2 text-sm font-semibold text-neutral-400">
                  Showing {visibleStart}–{visibleEnd} of{" "}
                  {totalCards.toLocaleString()}{" "}
                  {totalCards === 1 ? "card" : "cards"}
                </p>
              </div>

              {hasActiveFilters ? (
                <Link
                  href={sport ? `/shop?sport=${sport}` : "/shop"}
                  className="text-sm font-black uppercase tracking-wide text-green-400 transition hover:text-green-300"
                >
                  Clear Filters
                </Link>
              ) : null}
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {cards.map((card) => (
    <article
      key={card.id}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.03] shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-green-500/60 hover:shadow-[0_20px_50px_rgba(34,197,94,0.18)]"
    >
      <Link href={`/cards/${card.slug}`} className="block">
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
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400">
          {card.sport || "Sports Card"}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {card.featured ? (
            <span className="rounded-full bg-yellow-500 px-2 py-1 text-[10px] font-black uppercase text-black">
              Featured
            </span>
          ) : null}

          {card.rookie_card ? (
            <span className="rounded-full bg-green-500 px-2 py-1 text-[10px] font-black uppercase text-black">
              Rookie
            </span>
          ) : null}

          {card.autograph ? (
            <span className="rounded-full bg-purple-500 px-2 py-1 text-[10px] font-black uppercase text-white">
              Auto
            </span>
          ) : null}

          {card.stock !== null && card.stock <= 3 ? (
            <span className="rounded-full border border-red-500 bg-red-500/15 px-2 py-1 text-[10px] font-black uppercase text-red-300">
              Only {card.stock} Left
            </span>
          ) : null}
        </div>

        <Link
          href={`/cards/${card.slug}`}
          className="mt-3 transition hover:text-green-400"
        >
          <h2 className="text-xl font-black">{card.player_name}</h2>
        </Link>

        <p className="mt-2 text-sm text-neutral-400">
          {[card.year, card.brand].filter(Boolean).join(" • ")}
        </p>

        <div className="mt-3">
          {Number(card.stock ?? 0) > 3 ? (
            <p className="text-sm font-bold text-green-400">In Stock</p>
          ) : Number(card.stock ?? 0) > 0 ? (
            <p className="text-sm font-bold text-amber-400">
              Low Stock — Only {card.stock} Left
            </p>
          ) : (
            <p className="text-sm font-bold text-red-400">Sold Out</p>
          )}
        </div>

        {(card.grade_company ||
          card.grade ||
          card.rookie_card ||
          card.autograph) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {card.grade_company ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-neutral-300">
                {card.grade_company} {card.grade}
              </span>
            ) : null}

            {card.rookie_card ? (
              <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                Rookie
              </span>
            ) : null}

            {card.autograph ? (
              <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                Autograph
              </span>
            ) : null}
          </div>
        )}

        <div className="mt-auto border-t border-white/10 pt-5">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
              Price
            </p>

            <p className="mt-1 text-2xl font-black text-white">
              {formatCurrency(card.price)}
            </p>
          </div>

          <ShopCardQuickView
            card={{
              id: card.id,
              slug: card.slug,
              playerName: card.player_name,
              year: card.year,
              brand: card.brand,
              price: Number(card.price ?? 0),
              imageUrl: card.image_url,
              availableStock: card.stock ?? 0,
            }}
          />
        </div>
      </div>
    </article>
  ))}
</div>

            {totalPages > 1 ? (
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
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}