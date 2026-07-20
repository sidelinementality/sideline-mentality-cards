import Image from "next/image";
import Link from "next/link";

type RelatedCard = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  year: number | null;
  brand: string | null;
  price: number | string | null;
  image_url: string | null;
};

type RelatedCardsProps = {
  cards: RelatedCard[];
};

export default function RelatedCards({
  cards,
}: RelatedCardsProps) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="mt-14">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-green-700">
            More Inventory
          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-950">
            You May Also Like
          </h2>
        </div>

        <Link
          href="/shop"
          className="hidden font-black text-green-700 transition hover:text-green-600 sm:inline"
        >
          View All Cards
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const price = Number(card.price);

          return (
            <Link
              key={card.id}
              href={`/cards/${card.slug}`}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
                {card.image_url ? (
                  <Image
                    src={card.image_url}
                    alt={`${card.player_name} card`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-4 text-center text-sm font-bold text-zinc-400">
                    No card image available
                  </div>
                )}
              </div>

              <div className="p-5">
                {card.sport && (
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-green-700">
                    {card.sport}
                  </p>
                )}

                <h3 className="mt-2 text-lg font-black text-slate-950">
                  {card.player_name}
                </h3>

                <p className="mt-1 text-sm font-bold text-slate-500">
                  {[card.year, card.brand]
                    .filter(Boolean)
                    .join(" ")}
                </p>

                <p className="mt-4 text-xl font-black text-slate-950">
                  {Number.isFinite(price)
                    ? `$${price.toFixed(2)}`
                    : "Price unavailable"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <Link
        href="/shop"
        className="mt-6 block text-center font-black text-green-700 transition hover:text-green-600 sm:hidden"
      >
        View All Cards
      </Link>
    </section>
  );
}