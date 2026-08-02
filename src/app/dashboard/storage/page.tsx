import Link from "next/link";
import StorageMap from "@/components/dashboard/StorageMap";
import { supabase } from "@/lib/supabase";

type StorageCard = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  year: number | null;
  brand: string | null;
  image_url: string | null;
  stock: number | null;
  storage_area: string | null;
  cabinet: string | null;
  shelf: string | null;
  box: string | null;
  storage_row: string | null;
  slot: string | null;
};

type StorageGroup = {
  location: string;
  listings: number;
  quantity: number;
  cards: StorageCard[];
};

export default async function StorageManagerPage() {
  const { data: cards, error } = await supabase
    .from("cards")
    .select(`
      id,
      slug,
      player_name,
      sport,
      year,
      brand,
      image_url,
      stock,
      storage_area,
      cabinet,
      shelf,
      box,
      storage_row,
      slot
    `)
    .order("storage_area", { ascending: true, nullsFirst: false })
    .order("cabinet", { ascending: true, nullsFirst: false })
    .order("shelf", { ascending: true, nullsFirst: false })
    .order("box", { ascending: true, nullsFirst: false })
    .order("storage_row", { ascending: true, nullsFirst: false })
    .order("slot", { ascending: true, nullsFirst: false });

  if (error) {
    console.error("Storage manager loading error:", error);
  }

  const inventory = (cards ?? []) as StorageCard[];

  const assignedCards = inventory.filter((card) =>
    hasStorageLocation(card),
  );

  const unassignedCards = inventory.filter(
    (card) => !hasStorageLocation(card),
  );

  const totalQuantity = inventory.reduce(
    (total, card) => total + Number(card.stock ?? 0),
    0,
  );

  const assignedQuantity = assignedCards.reduce(
    (total, card) => total + Number(card.stock ?? 0),
    0,
  );

  const storageGroups = createStorageGroups(assignedCards);

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
            Dealer OS
          </p>

          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Storage Manager
          </h1>

          <p className="mt-3 max-w-3xl text-zinc-400">
            Find every card quickly by storage area, cabinet, shelf, box,
            row, and slot.
          </p>
        </div>

        <Link
          href="/dashboard/inventory"
          className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 font-bold text-white transition hover:border-green-500 hover:text-green-400"
        >
          View Inventory
        </Link>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Listings"
          value={inventory.length}
          description={`${totalQuantity.toLocaleString()} total cards`}
        />

        <StatCard
          label="Assigned Listings"
          value={assignedCards.length}
          description={`${assignedQuantity.toLocaleString()} cards assigned`}
        />

        <StatCard
          label="Unassigned Listings"
          value={unassignedCards.length}
          description="Cards missing a storage location"
        />

        <StatCard
          label="Storage Locations"
          value={storageGroups.length}
          description="Unique physical locations"
        />
      </section>

      <StorageMap
  cards={inventory.map((card) => ({
    id: card.id,
    playerName: card.player_name,
    stock: Number(card.stock ?? 0),
    storageArea: card.storage_area,
    cabinet: card.cabinet,
    shelf: card.shelf,
    box: card.box,
  }))}
/>

      {error ? (
        <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <p className="font-semibold text-red-300">
            Storage information could not be loaded.
          </p>
        </section>
      ) : (
        <>
          {unassignedCards.length > 0 && (
            <section className="mb-8 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-400">
                    Needs Attention
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-white">
                    {unassignedCards.length} unassigned{" "}
                    {unassignedCards.length === 1
                      ? "listing"
                      : "listings"}
                  </h2>

                  <p className="mt-2 text-sm text-amber-100/70">
                    Assign these cards a physical location so they can be
                    found quickly when an order arrives.
                  </p>
                </div>

                <Link
                  href="/dashboard/inventory"
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-amber-400 px-5 py-3 font-black text-black transition hover:bg-amber-300"
                >
                  Review Unassigned Cards
                </Link>
              </div>
            </section>
          )}

          {storageGroups.length === 0 ? (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
              <h2 className="text-2xl font-black text-white">
                No storage locations yet
              </h2>

              <p className="mt-3 text-zinc-400">
                Add storage details to a card from the Edit Card page.
              </p>
            </section>
          ) : (
            <section className="space-y-6">
              {storageGroups.map((group) => (
                <StorageLocationCard
                  key={group.location}
                  group={group}
                />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

function StorageLocationCard({
  group,
}: {
  group: StorageGroup;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="border-b border-white/10 px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
              Storage Location
            </p>

            <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
              {group.location}
            </h2>
          </div>

          <div className="flex gap-3">
            <StorageCount
              label="Listings"
              value={group.listings}
            />

            <StorageCount
              label="Quantity"
              value={group.quantity}
            />
          </div>
        </div>
      </div>

      <div className="divide-y divide-white/10">
        {group.cards.map((card) => (
          <div
            key={card.id}
            className="flex flex-col gap-4 px-6 py-5 transition hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between sm:px-8"
          >
            <div className="flex items-center gap-4">
              <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
                {card.image_url ? (
                  <img
                    src={card.image_url}
                    alt={`${card.player_name} card`}
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
                  {card.player_name}
                </p>

                <p className="mt-1 text-sm text-zinc-400">
                  {[card.year, card.brand, card.sport]
                    .filter(Boolean)
                    .join(" • ")}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Quantity: {Number(card.stock ?? 0)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/dashboard/inventory/${card.id}/edit`}
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-white transition hover:border-green-500 hover:text-green-400"
              >
                Edit Location
              </Link>

              <Link
                href={`/cards/${card.slug}`}
                className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-500"
              >
                View Card
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StorageCount({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-white">
        {value}
      </p>
    </div>
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
      <p className="text-sm font-semibold text-zinc-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-white">
        {value}
      </p>

      <p className="mt-2 text-xs text-zinc-500">
        {description}
      </p>
    </div>
  );
}

function hasStorageLocation(card: StorageCard) {
  return Boolean(
    card.storage_area ||
      card.cabinet ||
      card.shelf ||
      card.box ||
      card.storage_row ||
      card.slot,
  );
}

function createStorageGroups(
  cards: StorageCard[],
): StorageGroup[] {
  const groupedCards = new Map<string, StorageCard[]>();

  cards.forEach((card) => {
    const location = formatLocation(card);

    const existingCards = groupedCards.get(location) ?? [];

    groupedCards.set(location, [...existingCards, card]);
  });

  return Array.from(groupedCards.entries())
    .map(([location, groupedInventory]) => ({
      location,
      listings: groupedInventory.length,
      quantity: groupedInventory.reduce(
        (total, card) => total + Number(card.stock ?? 0),
        0,
      ),
      cards: groupedInventory,
    }))
    .sort((firstGroup, secondGroup) =>
      firstGroup.location.localeCompare(secondGroup.location),
    );
}

function formatLocation(card: StorageCard) {
  return [
    card.storage_area,
    card.cabinet,
    card.shelf,
    card.box,
    card.storage_row,
    card.slot,
  ]
    .filter(Boolean)
    .join(" • ");
}