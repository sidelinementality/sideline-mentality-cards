import Link from "next/link";
import { supabase } from "@/lib/supabase";
import PublishToWebsiteButton from "@/components/dealer/website/PublishToWebsiteButton";
import {
  canViewLiveCard,
  splitWebsiteQueue,
  type WebsiteQueueCard,
} from "@/lib/website-queue";

type QueueCard = WebsiteQueueCard & {
  sport: string | null;
};

export default async function WebsiteQueuePage() {
  const { data: cards, error } = await supabase
    .from("cards")
    .select(`
      id,
      slug,
      player_name,
      sport,
      year,
      brand,
      set_name,
      parallel,
      card_number,
      price,
      stock,
      image_url,
      featured,
      website_ready,
      listing_status
    `)
    .eq("website_ready", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Website Queue loading error:", error);
  }

  const queue = splitWebsiteQueue((cards ?? []) as QueueCard[]);

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
          Dealer OS
        </p>

        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Website Queue
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Review cards marked ready for the website and listings that are
          currently live on Sideline Mentality Cards.
        </p>
      </section>

      {error ? (
        <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <p className="font-semibold text-red-300">
            Website Queue could not be loaded.
          </p>
        </section>
      ) : (
        <>
          <section className="mb-8 grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Ready to Publish"
              value={queue.readyToPublishCount}
              description="Marked ready for website and waiting to go live"
            />

            <StatCard
              label="Live on Website"
              value={queue.liveOnWebsiteCount}
              description="Published listings currently on the public site"
            />
          </section>

          <QueueSection
            title="Ready to Publish"
            description="These cards are prepared for the website and are not live yet. Use Publish to Website when they should appear on the storefront."
            cards={queue.readyToPublish}
            emptyTitle="No cards ready to publish"
            emptyDescription="Mark a card ready for the website and set its status to Ready to Publish to see it here."
            showPublish
          />

          <QueueSection
            title="Live on Website"
            description="These published cards are currently visible on the public website when they have stock."
            cards={queue.liveOnWebsite}
            emptyTitle="No live website listings"
            emptyDescription="Published cards marked ready for the website will appear here."
          />
        </>
      )}
    </div>
  );
}

function QueueSection({
  title,
  description,
  cards,
  emptyTitle,
  emptyDescription,
  showPublish = false,
}: {
  title: string;
  description: string;
  cards: QueueCard[];
  emptyTitle: string;
  emptyDescription: string;
  showPublish?: boolean;
}) {
  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="border-b border-white/10 px-5 py-5 sm:px-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
          {title}
        </p>

        <h2 className="mt-2 text-xl font-black text-white">
          {cards.length} {cards.length === 1 ? "card" : "cards"}
        </h2>

        <p className="mt-2 text-sm text-zinc-400">{description}</p>
      </div>

      {cards.length === 0 ? (
        <div className="p-10 text-center">
          <h3 className="text-xl font-black text-white">{emptyTitle}</h3>
          <p className="mt-2 text-zinc-400">{emptyDescription}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] divide-y divide-white/10">
            <thead className="bg-black/30">
              <tr>
                <TableHeading>Card</TableHeading>
                <TableHeading>Details</TableHeading>
                <TableHeading>Price</TableHeading>
                <TableHeading>Stock</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading>Actions</TableHeading>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {cards.map((card) => {
                const stock = Number(card.stock ?? 0);
                const showView = canViewLiveCard(card);

                return (
                  <tr key={card.id} className="transition hover:bg-white/[0.03]">
                    <td className="px-5 py-4">
                      <div className="flex min-w-[250px] items-center gap-4">
                        <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
                          {card.image_url ? (
                            <img
                              src={card.image_url}
                              alt={`${card.player_name || "Card"} listing`}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center px-1 text-center text-[9px] text-zinc-500">
                              No image
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="font-black text-white">
                            {card.player_name || "Unnamed card"}
                          </p>

                          <p className="mt-1 text-sm text-zinc-400">
                            {[card.year, card.brand, card.set_name]
                              .filter(Boolean)
                              .join(" ")}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="min-w-[180px] text-sm">
                        <p className="font-semibold text-zinc-200">
                          {card.parallel || "Base / No parallel"}
                        </p>

                        <p className="mt-1 text-zinc-400">
                          Card #{card.card_number || "—"}
                        </p>

                        <p className="mt-1 text-zinc-500">
                          {card.sport || "—"}
                        </p>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <p className="font-bold text-white">
                        {formatCurrency(Number(card.price ?? 0))}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Website price
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="min-w-[110px] space-y-2">
                        <p className="font-black text-white">{stock}</p>
                        <StockBadge stock={stock} />
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="min-w-[150px] space-y-2">
                        <StatusBadge
                          status={card.listing_status || "Available"}
                        />

                        {card.featured && (
                          <span className="block text-xs font-bold text-yellow-300">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex min-w-[125px] flex-col items-start gap-2">
                        {showPublish && (
                          <PublishToWebsiteButton
                            cardId={card.id}
                            playerName={card.player_name}
                          />
                        )}

                        {showView && (
                          <Link
                            href={`/cards/${card.slug}`}
                            className="text-sm font-bold text-green-400 hover:text-green-300"
                          >
                            View Card
                          </Link>
                        )}

                        <Link
                          href={`/dashboard/inventory/${card.id}/edit`}
                          className="text-sm font-bold text-zinc-300 hover:text-white"
                        >
                          Edit Card
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm font-semibold text-zinc-400">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
      <p className="mt-2 text-xs text-zinc-500">{description}</p>
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-300">
        Out of Stock
      </span>
    );
  }

  if (stock <= 2) {
    return (
      <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-xs font-bold text-yellow-300">
        Low Stock
      </span>
    );
  }

  return (
    <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-xs font-bold text-green-300">
      In Stock
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const classes =
    normalized === "published" || normalized === "ready to publish"
      ? "border-green-500/30 bg-green-500/10 text-green-300"
      : "border-zinc-500/30 bg-zinc-500/10 text-zinc-300";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${classes}`}
    >
      {status}
    </span>
  );
}

function TableHeading({ children }: { children: React.ReactNode }) {
  return (
    <th
      scope="col"
      className="whitespace-nowrap px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-zinc-400"
    >
      {children}
    </th>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(value) ? value : 0);
}
