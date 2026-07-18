import Link from "next/link";
import InventoryManager from "@/components/cards/InventoryManager";
import { supabase } from "@/lib/supabase";

type Card = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  year: number | null;
  brand: string | null;
  price: number | string | null;
  image_url: string | null;
  featured: boolean | null;
  stock: number | null;
  created_at: string | null;
};

export default async function InventoryPage() {
  const { data: cards, error } = await supabase
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
        featured,
        stock,
        created_at
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Inventory loading error:", error);
  }

  const inventory = (cards ?? []) as Card[];

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
            Inventory
          </p>

          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Card Inventory
          </h1>

          <p className="mt-3 text-zinc-400">
            View and manage every card listed in your Sideline Mentality
            inventory.
          </p>
        </div>

        <Link
          href="/dashboard/inventory/add"
          className="inline-flex items-center justify-center rounded-lg bg-green-700 px-5 py-3 font-bold text-white transition hover:bg-green-600"
        >
          + Add New Card
        </Link>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Listings" value={inventory.length} />

        <StatCard
          label="Featured Cards"
          value={inventory.filter((card) => card.featured).length}
        />

        <StatCard
          label="Out of Stock"
          value={inventory.filter((card) => Number(card.stock ?? 0) === 0).length}
        />

        <StatCard
          label="Inventory Value"
          value={`$${inventory
            .reduce((total, card) => {
              const price = Number(card.price ?? 0);
              const stock = Number(card.stock ?? 0);

              return total + price * stock;
            }, 0)
            .toFixed(2)}`}
        />
      </section>

      {error ? (
        <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <p className="font-semibold text-red-300">
            Inventory could not be loaded.
          </p>
        </section>
      ) : inventory.length === 0 ? (
        <section className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-xl font-black text-white">
            No cards in inventory
          </h2>

          <p className="mt-2 text-zinc-400">
            Add your first card to begin building your inventory.
          </p>

          <Link
            href="/dashboard/inventory/add"
            className="mt-6 inline-flex rounded-lg bg-green-700 px-5 py-3 font-bold text-white transition hover:bg-green-600"
          >
            Add First Card
          </Link>
        </section>
      ) : (
        <InventoryManager cards={inventory} />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm font-semibold text-zinc-400">{label}</p>

      <p className="mt-3 text-3xl font-black text-white">{value}</p>
    </div>
  );
}