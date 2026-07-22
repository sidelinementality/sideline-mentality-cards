import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type TrendingCard = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  year: number | null;
  brand: string | null;
  price: number | string | null;
  image_url: string | null;
  stock: number | null;
  view_count: number | string;
};

type TrendingCardsProps = {
  limit?: number;
};

function formatCurrency(value: number | string | null) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default async function TrendingCards({
  limit = 4,
}: TrendingCardsProps) {
  const { data, error } = await supabase.rpc(
    "get_trending_cards",
    {
      result_limit: limit,
    },
  );

  if (error) {
    console.error("Trending cards error:", error.message);
    return null;
  }

  const cards = (data ?? []) as TrendingCard[];

  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
            Collector Activity
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Trending This Week
          </h2>

          <p className="mt-3 text-slate-500">
            The cards collectors are viewing most right now.
          </p>
        </div>

        <Link
          href="/shop"
          className="text-sm font-black text-green-700 transition hover:text-green-600"
        >
          Browse all cards →
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Link
            key={card.id}
            href={`/cards/${card.slug}`}
            className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-600/40 hover:shadow-xl"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
              <div className="absolute left-4 top-4 z-10 rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                #{index + 1}
              </div>

              {card.image_url ? (
                <Image
                  src={card.image_url}
                  alt={card.player_name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-5 transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-5 text-center text-sm font-bold text-slate-400">
                  No image available
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-green-700">
                    {card.sport || "Sports Card"}
                  </p>

                  <h3 className="mt-2 text-lg font-black text-slate-950">
                    {card.player_name}
                  </h3>
                </div>

                <span className="whitespace-nowrap text-sm font-black text-slate-500">
                  {Number(card.view_count)} views
                </span>
              </div>

              <p className="mt-2 text-sm font-bold text-slate-500">
                {[card.year, card.brand]
                  .filter(Boolean)
                  .join(" ")}
              </p>

              <p className="mt-4 text-xl font-black text-slate-950">
                {formatCurrency(card.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}