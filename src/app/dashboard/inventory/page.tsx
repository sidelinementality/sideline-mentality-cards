import Link from "next/link";
import InventoryManager from "@/components/cards/InventoryManager";
import { supabase } from "@/lib/supabase";

type Card = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  team: string | null;
  year: number | null;
  brand: string | null;
  set_name: string | null;
  parallel: string | null;
  card_number: string | null;
  serial_number: string | null;

  price: number | string | null;
  purchase_price: number | string | null;
  shipping_cost: number | string | null;
  sales_tax: number | string | null;
  purchase_fees: number | string | null;
  market_value: number | string | null;

  image_url: string | null;
  featured: boolean | null;
  website_ready: boolean | null;
  listing_status: string | null;

  storage_area: string | null;
  cabinet: string | null;
  shelf: string | null;
  box: string | null;
  storage_row: string | null;
  slot: string | null;

  stock: number | null;
  created_at: string | null;
};

export default async function InventoryPage() {
  const { data: cards, error } = await supabase
    .from("cards")
    .select(`
      id,
      slug,
      player_name,
      sport,
      team,
      year,
      brand,
      set_name,
      parallel,
      card_number,
      serial_number,
      price,
      purchase_price,
      shipping_cost,
      sales_tax,
      purchase_fees,
      market_value,
      image_url,
      featured,
      website_ready,
      listing_status,
      storage_area,
      cabinet,
      shelf,
      box,
      storage_row,
      slot,
      stock,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Inventory loading error:", error);
  }

  const inventory = (cards ?? []) as Card[];

  const totalQuantity = inventory.reduce(
    (total, card) => total + Number(card.stock ?? 0),
    0,
  );

  const inventoryValue = inventory.reduce((total, card) => {
    return total + Number(card.price ?? 0) * Number(card.stock ?? 0);
  }, 0);

  const totalCostBasis = inventory.reduce((total, card) => {
    const purchasePrice = Number(card.purchase_price ?? 0);
    const shipping = Number(card.shipping_cost ?? 0);
    const tax = Number(card.sales_tax ?? 0);
    const fees = Number(card.purchase_fees ?? 0);

    return total + purchasePrice + shipping + tax + fees;
  }, 0);

  const potentialProfit = inventoryValue - totalCostBasis;

  const readyForWebsite = inventory.filter(
    (card) => card.website_ready,
  ).length;

  const lowStock = inventory.filter((card) => {
    const stock = Number(card.stock ?? 0);

    return stock > 0 && stock <= 2;
  }).length;

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
            Dealer OS
          </p>

          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Inventory
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Search, price, locate, and manage every card in your Sideline
            Mentality Cards inventory.
          </p>
        </div>

        <Link
          href="/dashboard/inventory/new"
          className="inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-500"
        >
          + Add Card
        </Link>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Cards"
          value={totalQuantity.toLocaleString()}
          description={`${inventory.length.toLocaleString()} unique listings`}
        />

        <StatCard
          label="Inventory Value"
          value={formatCurrency(inventoryValue)}
          description="Current website asking value"
        />

        <StatCard
          label="Potential Profit"
          value={formatCurrency(potentialProfit)}
          description={`${formatCurrency(totalCostBasis)} total cost basis`}
        />

        <StatCard
          label="Ready for Website"
          value={readyForWebsite}
          description={`${lowStock} low-stock listings`}
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
            href="/dashboard/inventory/new"
            className="mt-6 inline-flex rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-500"
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}