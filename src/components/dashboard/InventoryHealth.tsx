import Link from "next/link";

type Card = {
  id: string;
  player_name: string;
  year: number | null;
  brand: string | null;
  price: number | string | null;
  stock: number | null;
};

type InventoryHealthProps = {
  outOfStockInventory: Card[];
  lowStockInventory: Card[];
  cardsMissingImages: Card[];
  highestValueCard: Card | null;
  newestCard: Card | null;
};

export default function InventoryHealth({
  outOfStockInventory,
  lowStockInventory,
  cardsMissingImages,
  highestValueCard,
  newestCard,
}: InventoryHealthProps) {
  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/5">
      <div className="border-b border-white/10 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
          Inventory Health
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          Cards That Need Your Attention
        </h2>

        <p className="mt-2 text-zinc-400">
          Review stock alerts and important inventory details without searching
          through your entire catalog.
        </p>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-2 xl:grid-cols-4">
        <HealthPanel
          title="Out of Stock"
          count={outOfStockInventory.length}
          emptyMessage="No cards are currently out of stock."
          borderClassName="border-red-500/30"
          backgroundClassName="bg-red-500/5"
          titleClassName="text-red-300"
        >
          {outOfStockInventory.slice(0, 4).map((card) => (
            <InventoryAlertRow
              key={card.id}
              card={card}
              detail="0 available"
            />
          ))}
        </HealthPanel>

        <HealthPanel
          title="Low Stock"
          count={lowStockInventory.length}
          emptyMessage="No cards are currently low in stock."
          borderClassName="border-yellow-500/30"
          backgroundClassName="bg-yellow-500/5"
          titleClassName="text-yellow-300"
        >
          {lowStockInventory.slice(0, 4).map((card) => (
            <InventoryAlertRow
              key={card.id}
              card={card}
              detail={`${Number(card.stock ?? 0)} left`}
            />
          ))}
        </HealthPanel>

        <HealthPanel
          title="Missing Images"
          count={cardsMissingImages.length}
          emptyMessage="Every card currently has an image."
          borderClassName="border-orange-500/30"
          backgroundClassName="bg-orange-500/5"
          titleClassName="text-orange-300"
        >
          {cardsMissingImages.slice(0, 4).map((card) => (
            <InventoryAlertRow
              key={card.id}
              card={card}
              detail="Image needed"
            />
          ))}
        </HealthPanel>

        <article className="rounded-xl border border-green-500/30 bg-green-500/5 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-green-300">
            Inventory Highlights
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Highest Value Card
              </p>

              {highestValueCard ? (
                <>
                  <p className="mt-2 font-bold text-white">
                    {highestValueCard.player_name}
                  </p>

                  <p className="mt-1 text-sm text-zinc-400">
                    {highestValueCard.year || "—"}{" "}
                    {highestValueCard.brand || ""}
                  </p>

                  <p className="mt-2 font-black text-green-300">
                    {formatCurrency(Number(highestValueCard.price ?? 0))}
                  </p>

                  <Link
                    href={`/dashboard/inventory/${highestValueCard.id}/edit`}
                    className="mt-2 inline-block text-sm font-bold text-green-400 hover:text-green-300"
                  >
                    Edit Card
                  </Link>
                </>
              ) : (
                <p className="mt-2 text-sm text-zinc-500">
                  No inventory available.
                </p>
              )}
            </div>

            <div className="border-t border-white/10 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Newest Card Added
              </p>

              {newestCard ? (
                <>
                  <p className="mt-2 font-bold text-white">
                    {newestCard.player_name}
                  </p>

                  <p className="mt-1 text-sm text-zinc-400">
                    {newestCard.year || "—"} {newestCard.brand || ""}
                  </p>

                  <Link
                    href={`/dashboard/inventory/${newestCard.id}/edit`}
                    className="mt-2 inline-block text-sm font-bold text-green-400 hover:text-green-300"
                  >
                    View Listing
                  </Link>
                </>
              ) : (
                <p className="mt-2 text-sm text-zinc-500">
                  No inventory available.
                </p>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function HealthPanel({
  title,
  count,
  emptyMessage,
  borderClassName,
  backgroundClassName,
  titleClassName,
  children,
}: {
  title: string;
  count: number;
  emptyMessage: string;
  borderClassName: string;
  backgroundClassName: string;
  titleClassName: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={`rounded-xl border p-5 ${borderClassName} ${backgroundClassName}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p
          className={`text-xs font-black uppercase tracking-[0.18em] ${titleClassName}`}
        >
          {title}
        </p>

        <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-xs font-black text-white">
          {count}
        </span>
      </div>

      {count === 0 ? (
        <p className="mt-5 text-sm leading-6 text-zinc-500">
          {emptyMessage}
        </p>
      ) : (
        <div className="mt-5 divide-y divide-white/10">{children}</div>
      )}

      {count > 4 && (
        <Link
          href="/dashboard/inventory"
          className="mt-4 inline-block text-sm font-bold text-green-400 hover:text-green-300"
        >
          View all {count}
        </Link>
      )}
    </article>
  );
}

function InventoryAlertRow({
  card,
  detail,
}: {
  card: Card;
  detail: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-white">
          {card.player_name}
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          {card.year || "—"} {card.brand || ""}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-xs font-semibold text-zinc-400">{detail}</p>

        <Link
          href={`/dashboard/inventory/${card.id}/edit`}
          className="mt-1 inline-block text-xs font-bold text-green-400 hover:text-green-300"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}