import Image from "next/image";
import Link from "next/link";

type InventoryAlertCard = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  year: number | null;
  brand: string | null;
  image_url: string | null;
  stock: number | null;
};

type LowInventoryAlertsProps = {
  lowStockCards: InventoryAlertCard[];
  soldOutCards: InventoryAlertCard[];
};

export default function LowInventoryAlerts({
  lowStockCards,
  soldOutCards,
}: LowInventoryAlertsProps) {
  const hasAlerts =
    lowStockCards.length > 0 || soldOutCards.length > 0;

  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-400">
            Inventory Alerts
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Low Inventory
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Review cards that are running low or currently sold
            out.
          </p>
        </div>

        <Link
          href="/dashboard/inventory"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white transition hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-300"
        >
          Manage Inventory
        </Link>
      </div>

      {!hasAlerts ? (
        <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/10 p-5">
          <p className="font-black text-green-300">
            Inventory levels look healthy.
          </p>

          <p className="mt-1 text-sm text-green-100/70">
            No low-stock or sold-out listings need attention.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-black text-white">
                Running Low
              </h3>

              <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-black text-amber-300">
                {lowStockCards.length}
              </span>
            </div>

            {lowStockCards.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-black/20 p-5 text-sm text-zinc-400">
                No cards are currently running low.
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockCards.map((card) => (
                  <AlertCard
                    key={card.id}
                    card={card}
                    status="low"
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-black text-white">
                Sold Out
              </h3>

              <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-black text-red-300">
                {soldOutCards.length}
              </span>
            </div>

            {soldOutCards.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-black/20 p-5 text-sm text-zinc-400">
                No cards are currently sold out.
              </div>
            ) : (
              <div className="space-y-3">
                {soldOutCards.map((card) => (
                  <AlertCard
                    key={card.id}
                    card={card}
                    status="sold-out"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

type AlertCardProps = {
  card: InventoryAlertCard;
  status: "low" | "sold-out";
};

function AlertCard({ card, status }: AlertCardProps) {
  const stock = Number(card.stock ?? 0);
  const isSoldOut = status === "sold-out";

  return (
    <Link
      href={`/dashboard/inventory/edit/${card.id}`}
      className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/20 p-4 transition hover:border-green-500/40 hover:bg-white/10"
    >
      <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-900">
        {card.image_url ? (
          <Image
            src={card.image_url}
            alt={card.player_name}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-1 text-center text-[9px] font-bold uppercase text-zinc-500">
            No Image
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-black text-white">
          {card.player_name}
        </p>

        <p className="mt-1 truncate text-sm text-zinc-400">
          {[card.year, card.brand, card.sport]
            .filter(Boolean)
            .join(" • ")}
        </p>

        <p
          className={`mt-2 text-sm font-black ${
            isSoldOut ? "text-red-300" : "text-amber-300"
          }`}
        >
          {isSoldOut
            ? "Sold out"
            : `Only ${stock} ${
                stock === 1 ? "card" : "cards"
              } remaining`}
        </p>
      </div>

      <span className="shrink-0 text-sm font-black text-green-400">
        Edit
      </span>
    </Link>
  );
}