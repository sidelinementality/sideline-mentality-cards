import Link from "next/link";
import CardThumbnail from "@/components/dashboard/CardThumbnail";

type RecentCard = {
    id: string;
    slug: string;
    player_name: string;
    image_url: string | null;
    sport: string | null;
    year: number | null;
    brand: string | null;
    price: number | string | null;
    stock: number | null;
    grade_company: string | null;
    grade: string | null;
    rookie_card: boolean | null;
    featured: boolean | null;
autograph: boolean | null;
serial_number: string | null;
  };
type RecentlyAddedCardsProps = {
  cards: RecentCard[];
};

export default function RecentlyAddedCards({
  cards,
}: RecentlyAddedCardsProps) {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
            Latest Inventory
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Recently Added Cards
          </h2>

          <p className="mt-2 text-zinc-400">
            The newest cards added to your inventory.
          </p>
        </div>

        <Link
          href="/dashboard/inventory"
          className="inline-flex w-fit items-center justify-center rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-2 text-sm font-bold text-green-300 transition hover:bg-green-500/20"
        >
          View All Inventory
        </Link>
      </div>

      {cards.length > 0 ? (
        <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={`/cards/${card.slug}`}
              className="block"
            >
              <CardThumbnail
  player_name={card.player_name}
  image_url={card.image_url}
  sport={card.sport}
  year={card.year}
  brand={card.brand}
  price={card.price}
  stock={card.stock}
  grade_company={card.grade_company}
  grade={card.grade}
  rookie_card={card.rookie_card}
  featured={card.featured}
  autograph={card.autograph}
  serial_number={card.serial_number}
  slug={card.slug}
/>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-6">
          <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20 p-6">
            <p className="text-center text-zinc-400">
              Recently added cards will appear here.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}