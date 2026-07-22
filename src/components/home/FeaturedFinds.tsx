import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type FeaturedCard = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  team: string | null;
  year: number | null;
  brand: string | null;
  set_name: string | null;
  grade_company: string | null;
  grade: string | null;
  price: number | string | null;
  image_url: string | null;
  rookie_card: boolean | null;
  autograph: boolean | null;
  featured: boolean | null;
  stock: number | null;
};

function formatPrice(price: number | string | null) {
  const numericPrice =
    typeof price === "string" ? Number.parseFloat(price) : price;

  if (numericPrice === null || Number.isNaN(numericPrice)) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericPrice);
}

function getCardDetails(card: FeaturedCard) {
  return [
    card.year,
    card.brand,
    card.set_name,
  ]
    .filter(Boolean)
    .join(" ");
}

export default async function FeaturedFinds() {
  const { data, error } = await supabase
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
        set_name,
        grade_company,
        grade,
        price,
        image_url,
        rookie_card,
        autograph,
        featured,
        stock
      `,
    )
    .eq("featured", true)
    .gt("stock", 0)
    .order("created_at", { ascending: false })
    .limit(4);

  const cards = (data ?? []) as FeaturedCard[];

  if (error) {
    console.error("Featured Finds error:", error);
  }

  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-neutral-950 px-5 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-[52rem] -translate-x-1/2 rounded-full bg-green-500/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-green-400">
              Hand-Picked Inventory
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight sm:text-4xl lg:text-5xl">
              Featured Finds
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-400 sm:text-lg">
              Standout cards selected from the Sideline Mentality collection.
              These are the cards worth taking a closer look at.
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition duration-200 hover:-translate-y-0.5 hover:border-green-500/60 hover:bg-green-500/10 hover:text-green-400"
          >
            View All Cards

            <span
              className="transition group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>

        {cards.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => {
              const cardDetails = getCardDetails(card);
              const isOutOfStock = !card.stock || card.stock <= 0;

              return (
                <article
                  key={card.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black transition duration-300 hover:-translate-y-2 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/10"
                >
                  <Link
                    href={`/cards/${card.slug}`}
                    className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-400"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-neutral-900 to-black">
                      <div
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_55%)]"
                        aria-hidden="true"
                      />

                      {card.image_url ? (
                        <Image
                          src={card.image_url}
                          alt={`${card.player_name} sports card`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-contain p-5 transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-6 text-center">
                          <p className="text-sm font-bold uppercase tracking-widest text-neutral-600">
                            Image coming soon
                          </p>
                        </div>
                      )}

                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-green-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-black shadow-lg">
                          Featured
                        </span>

                        {card.rookie_card ? (
                          <span className="rounded-full border border-white/15 bg-black/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white backdrop-blur">
                            Rookie
                          </span>
                        ) : null}

                        {card.autograph ? (
                          <span className="rounded-full border border-green-500/40 bg-black/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-green-400 backdrop-blur">
                            Auto
                          </span>
                        ) : null}
                      </div>

                      {isOutOfStock ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/65 backdrop-blur-[2px]">
                          <span className="rounded-full border border-white/20 bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
                            Sold Out
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <div className="border-t border-white/10 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-green-400">
                          {card.sport ?? "Sports Card"}
                        </p>

                        {card.grade_company || card.grade ? (
                          <p className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-neutral-300">
                            {[card.grade_company, card.grade]
                              .filter(Boolean)
                              .join(" ")}
                          </p>
                        ) : null}
                      </div>

                      <h3 className="mt-4 line-clamp-2 min-h-14 text-xl font-black uppercase leading-tight tracking-tight text-white transition group-hover:text-green-400">
                        {card.player_name}
                      </h3>

                      <p className="mt-2 line-clamp-1 min-h-5 text-sm text-neutral-400">
                        {cardDetails || card.team || "Premium collectible card"}
                      </p>

                      <div className="mt-6 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                            Price
                          </p>

                          <p className="mt-1 text-2xl font-black text-white">
                            {formatPrice(card.price)}
                          </p>
                        </div>

                        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10 text-lg text-green-400 transition duration-300 group-hover:border-green-400 group-hover:bg-green-500 group-hover:text-black">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 rounded-3xl border border-dashed border-white/15 bg-black/40 px-6 py-14 text-center">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-green-400">
              Featured Finds
            </p>

            <h3 className="mt-4 text-2xl font-black uppercase text-white">
              New featured cards are coming soon
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-neutral-400">
              Browse the full marketplace while the next group of hand-picked
              cards is being prepared.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-green-500 px-6 py-3 text-sm font-black uppercase tracking-wide text-black transition hover:-translate-y-0.5 hover:bg-green-400"
            >
              Browse All Cards
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}