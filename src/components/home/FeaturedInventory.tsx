import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Card = {
  id: string;
  slug: string;
  player_name: string;
  sport: string;
  price: number | string;
  image_url: string | null;
  featured: boolean;
  brand: string;
  year: string | number | null;
  stock: number | null;
};

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
        stock
      `,
    )
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Featured inventory error:", error);
  }

  return (
    <section
      id="featured"
      className="bg-white px-6 py-20 text-gray-900"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-700">
              Featured Inventory
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Premium cards worth a closer look
            </h2>
          </div>
        </div>

        {!cards || cards.length === 0 ? (
          <p className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
            No featured cards are available yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(cards as Card[]).map((card) => {
              const stock = Number(card.stock ?? 0);
              const isSoldOut = stock <= 0;
              const price = Number(card.price);

              return (
                <article
                  key={card.id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-green-950 p-6">
                    {isSoldOut && (
                      <div className="absolute left-4 top-4 z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-black uppercase tracking-wide text-white shadow-lg">
                        Sold Out
                      </div>
                    )}

                    {card.image_url ? (
                      <img
                        src={card.image_url}
                        alt={`${card.player_name} sports card`}
                        className={`h-full w-full rounded-xl object-contain ${
                          isSoldOut ? "opacity-60" : ""
                        }`}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 text-center">
                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-green-400">
                          Card Image Coming Soon
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                        {card.sport}
                      </p>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
                          isSoldOut
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {isSoldOut ? "Sold Out" : "In Stock"}
                      </span>
                    </div>

                    <h3 className="mt-2 text-xl font-black">
                      {card.player_name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {card.year} {card.brand}
                    </p>

                    <p className="mt-3 text-xs font-bold text-gray-500">
                      {isSoldOut
                        ? "Currently unavailable"
                        : `${stock} available`}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <span className="text-lg font-black">
                        {Number.isFinite(price)
                          ? `$${price.toFixed(2)}`
                          : "Price unavailable"}
                      </span>

                      <Link
                        href={`/cards/${card.slug}`}
                        className={`rounded-lg px-4 py-2 text-sm font-bold text-white transition ${
                          isSoldOut
                            ? "bg-zinc-500 hover:bg-zinc-600"
                            : "bg-black group-hover:bg-green-700"
                        }`}
                      >
                        {isSoldOut ? "View Details" : "View Card"}
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