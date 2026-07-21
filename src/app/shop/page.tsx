import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type ShopPageProps = {
  searchParams: Promise<{
    sport?: string;
  }>;
};

type Card = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  year: number | null;
  brand: string | null;
  price: number | string | null;
  image_url: string | null;
  stock: number | null;
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
  const { sport } = await searchParams;

  let query = supabase
    .from("cards")
    .select(
      `
        id,
        slug,
        player_name,
        sport,
        year,
        brand,
        price,
        image_url,
        stock
      `,
    )
    .gt("stock", 0)
    .order("created_at", {
      ascending: false,
    });

  if (sport) {
    query = query.ilike("sport", sport);
  }

  const { data, error } = await query;

  const cards = (data ?? []) as Card[];

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
        </div>

        {error ? (
          <div className="mt-10 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
            Unable to load cards right now.
          </div>
        ) : cards.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <h2 className="text-2xl font-black">
              No cards available yet
            </h2>

            <p className="mt-3 text-neutral-400">
              New inventory will be added soon.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((card) => (
              <Link
                key={card.id}
                href={`/cards/${card.slug}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-green-500/60"
              >
                <div className="relative aspect-[3/4] bg-neutral-900">
                  {card.image_url ? (
                    <Image
                      src={card.image_url}
                      alt={card.player_name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-4 transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                      No image available
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400">
                    {card.sport || "Sports Card"}
                  </p>

                  <h2 className="mt-2 text-xl font-black">
                    {card.player_name}
                  </h2>

                  <p className="mt-2 text-sm text-neutral-400">
                    {[card.year, card.brand]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xl font-black">
                      {formatCurrency(card.price)}
                    </span>

                    <span className="text-sm font-bold text-green-400">
                      View Card →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}