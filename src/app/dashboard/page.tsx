import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DashboardInventorySearch from "@/components/DashboardInventorySearch";
import DashboardStats from "@/components/dashboard/DashboardStats";
import InventoryHealth from "@/components/dashboard/InventoryHealth";
import InventoryBySport from "@/components/dashboard/InventoryBySport";
import InventoryByBrand from "@/components/dashboard/InventoryByBrand";
import InventoryByYear from "@/components/dashboard/InventoryByYear";
import InventoryValueByCategory from "@/components/dashboard/InventoryValueByCategory";
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

type SportSummary = {
  sport: string;
  listings: number;
  quantity: number;
  value: number;
  percentage: number;
};
type BrandSummary = {
    brand: string;
    listings: number;
    quantity: number;
    value: number;
    percentage: number;
  };
  type YearSummary = {
    year: string;
    listings: number;
    quantity: number;
    value: number;
    percentage: number;
  };
export default async function DashboardPage() {
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
    console.error("Dashboard loading error:", error);
  }

  const inventory = (cards ?? []) as Card[];

  const totalListings = inventory.length;

  const totalQuantity = inventory.reduce(
    (total, card) => total + Number(card.stock ?? 0),
    0
  );

  const inventoryValue = inventory.reduce((total, card) => {
    const price = Number(card.price ?? 0);
    const stock = Number(card.stock ?? 0);

    return total + price * stock;
  }, 0);

  const averagePrice =
    totalListings > 0
      ? inventory.reduce(
          (total, card) => total + Number(card.price ?? 0),
          0
        ) / totalListings
      : 0;

  const featuredCards = inventory.filter((card) => card.featured).length;

  const healthyStockCards = inventory.filter(
    (card) => Number(card.stock ?? 0) >= 3
  );

  const lowStockInventory = inventory.filter((card) => {
    const stock = Number(card.stock ?? 0);

    return stock > 0 && stock <= 2;
  });

  const outOfStockInventory = inventory.filter(
    (card) => Number(card.stock ?? 0) === 0
  );

  const cardsMissingImages = inventory.filter((card) => !card.image_url);

  const highestValueCard =
    inventory.length > 0
      ? inventory.reduce((highestCard, currentCard) => {
          const highestPrice = Number(highestCard.price ?? 0);
          const currentPrice = Number(currentCard.price ?? 0);

          return currentPrice > highestPrice
            ? currentCard
            : highestCard;
        })
      : null;

  const newestCard = inventory[0] ?? null;
  const recentCards = inventory.slice(0, 5);

  const sportTotals = inventory.reduce<
    Record<
      string,
      {
        listings: number;
        quantity: number;
        value: number;
      }
    >
  >((totals, card) => {
    const sportName = card.sport?.trim() || "Uncategorized";
    const stock = Number(card.stock ?? 0);
    const price = Number(card.price ?? 0);

    if (!totals[sportName]) {
      totals[sportName] = {
        listings: 0,
        quantity: 0,
        value: 0,
      };
    }

    totals[sportName].listings += 1;
    totals[sportName].quantity += stock;
    totals[sportName].value += price * stock;

    return totals;
  }, {});

  const inventoryBySport: SportSummary[] = Object.entries(sportTotals)
    .map(([sport, totals]) => ({
      sport,
      listings: totals.listings,
      quantity: totals.quantity,
      value: totals.value,
      percentage:
        totalQuantity > 0 ? (totals.quantity / totalQuantity) * 100 : 0,
    }))
    .sort((a, b) => b.quantity - a.quantity);
    const brandTotals = inventory.reduce<
    Record<
      string,
      {
        listings: number;
        quantity: number;
        value: number;
      }
    >
  >((totals, card) => {
    const brandName = card.brand?.trim() || "Uncategorized";
    const stock = Number(card.stock ?? 0);
    const price = Number(card.price ?? 0);

    if (!totals[brandName]) {
      totals[brandName] = {
        listings: 0,
        quantity: 0,
        value: 0,
      };
    }

    totals[brandName].listings += 1;
    totals[brandName].quantity += stock;
    totals[brandName].value += price * stock;

    return totals;
  }, {});

  const inventoryByBrand: BrandSummary[] = Object.entries(brandTotals)
    .map(([brand, totals]) => ({
      brand,
      listings: totals.listings,
      quantity: totals.quantity,
      value: totals.value,
      percentage:
        totalQuantity > 0 ? (totals.quantity / totalQuantity) * 100 : 0,
    }))
    .sort((a, b) => b.quantity - a.quantity);

  const topBrand = inventoryByBrand[0] ?? null;
  const yearTotals = inventory.reduce<
  Record<
    string,
    {
      listings: number;
      quantity: number;
      value: number;
    }
  >
>((totals, card) => {
  const yearName = card.year ? String(card.year) : "Unknown Year";
  const stock = Number(card.stock ?? 0);
  const price = Number(card.price ?? 0);

  if (!totals[yearName]) {
    totals[yearName] = {
      listings: 0,
      quantity: 0,
      value: 0,
    };
  }

  totals[yearName].listings += 1;
  totals[yearName].quantity += stock;
  totals[yearName].value += price * stock;

  return totals;
}, {});

const inventoryByYear: YearSummary[] = Object.entries(yearTotals)
  .map(([year, totals]) => ({
    year,
    listings: totals.listings,
    quantity: totals.quantity,
    value: totals.value,
    percentage:
      totalQuantity > 0 ? (totals.quantity / totalQuantity) * 100 : 0,
  }))
  .sort((a, b) => {
    if (a.year === "Unknown Year") return 1;
    if (b.year === "Unknown Year") return -1;

    return Number(b.year) - Number(a.year);
  });

const largestYear =
  [...inventoryByYear].sort((a, b) => b.quantity - a.quantity)[0] ?? null;
  const highestValueSport =
  [...inventoryBySport].sort((a, b) => b.value - a.value)[0] ?? null;

const highestValueBrand =
  [...inventoryByBrand].sort((a, b) => b.value - a.value)[0] ?? null;

const highestValueYear =
  [...inventoryByYear].sort((a, b) => b.value - a.value)[0] ?? null;
  const topSport = inventoryBySport[0] ?? null;
  const valueCategories = [
    {
      label: "Under $25",
      quantity: inventory
        .filter((card) => Number(card.price ?? 0) < 25)
        .reduce((total, card) => total + Number(card.stock ?? 0), 0),

      value: inventory
        .filter((card) => Number(card.price ?? 0) < 25)
        .reduce(
          (total, card) =>
            total +
            Number(card.price ?? 0) * Number(card.stock ?? 0),
          0
        ),
    },
    {
      label: "$25–$99",
      quantity: inventory
        .filter(
          (card) =>
            Number(card.price ?? 0) >= 25 &&
            Number(card.price ?? 0) < 100
        )
        .reduce((total, card) => total + Number(card.stock ?? 0), 0),

      value: inventory
        .filter(
          (card) =>
            Number(card.price ?? 0) >= 25 &&
            Number(card.price ?? 0) < 100
        )
        .reduce(
          (total, card) =>
            total +
            Number(card.price ?? 0) * Number(card.stock ?? 0),
          0
        ),
    },
    {
      label: "$100–$249",
      quantity: inventory
        .filter(
          (card) =>
            Number(card.price ?? 0) >= 100 &&
            Number(card.price ?? 0) < 250
        )
        .reduce((total, card) => total + Number(card.stock ?? 0), 0),

      value: inventory
        .filter(
          (card) =>
            Number(card.price ?? 0) >= 100 &&
            Number(card.price ?? 0) < 250
        )
        .reduce(
          (total, card) =>
            total +
            Number(card.price ?? 0) * Number(card.stock ?? 0),
          0
        ),
    },
    {
      label: "$250+",
      quantity: inventory
        .filter((card) => Number(card.price ?? 0) >= 250)
        .reduce((total, card) => total + Number(card.stock ?? 0), 0),

      value: inventory
        .filter((card) => Number(card.price ?? 0) >= 250)
        .reduce(
          (total, card) =>
            total +
            Number(card.price ?? 0) * Number(card.stock ?? 0),
          0
        ),
    },
  ];
  const dashboardStats = [
    {
      label: "Total Listings",
      value: totalListings,
      description: "Unique card listings in your catalog",
    },
    {
      label: "Total Card Quantity",
      value: totalQuantity,
      description: "Total cards currently available",
    },
    {
      label: "Inventory Value",
      value: formatCurrency(inventoryValue),
      description: "Total listed value based on current stock",
    },
    {
      label: "Average Price",
      value: formatCurrency(averagePrice),
      description: "Average listed price per card",
    },
    {
      label: "Featured Cards",
      value: featuredCards,
      description: "Cards displayed as featured inventory",
    },
    {
      label: "Healthy Stock",
      value: healthyStockCards.length,
      description: "Listings with three or more cards available",
    },
    {
      label: "Low Stock",
      value: lowStockInventory.length,
      description: "Listings with only one or two cards left",
    },
    {
      label: "Out of Stock",
      value: outOfStockInventory.length,
      description: "Listings that currently have no inventory",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
          Dealer Center
        </p>

        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Dashboard Overview
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Review your inventory, monitor stock levels, and manage your
          Sideline Mentality Cards catalog.
        </p>
      </section>

      {error ? (
        <section className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <p className="font-semibold text-red-300">
            Dashboard information could not be loaded.
          </p>
        </section>
      ) : (
        <>
                    <DashboardStats stats={dashboardStats} />

                    <InventoryHealth
            outOfStockInventory={outOfStockInventory}
            lowStockInventory={lowStockInventory}
            cardsMissingImages={cardsMissingImages}
            highestValueCard={highestValueCard}
            newestCard={newestCard}
          />

<InventoryBySport
            inventoryBySport={inventoryBySport}
            topSport={topSport}
          />
                    <InventoryByBrand
            inventoryByBrand={inventoryByBrand}
            topBrand={topBrand}
          />
                    <InventoryByYear inventoryByYear={inventoryByYear} />
                    <InventoryValueByCategory valueCategories={valueCategories} />
          <DashboardInventorySearch cards={inventory} />
          <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
                    Recent Inventory
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-white">
                    Recently Added Cards
                  </h2>
                </div>

                <Link
                  href="/dashboard/inventory"
                  className="text-sm font-bold text-green-400 transition hover:text-green-300"
                >
                  View All
                </Link>
              </div>

              {recentCards.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="font-semibold text-white">
                    No cards have been added yet.
                  </p>

                  <p className="mt-2 text-sm text-zinc-400">
                    Add your first card to begin building your inventory.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {recentCards.map((card) => {
                    const stock = Number(card.stock ?? 0);

                    return (
                      <div
                        key={card.id}
                        className="flex items-center gap-4 p-5"
                      >
                        <div className="h-20 w-14 shrink-0 overflow-hidden rounded-md bg-black">
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

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold text-white">
                            {card.player_name}
                          </p>

                          <p className="mt-1 text-sm text-zinc-400">
                            {card.year || "—"} {card.brand || ""}
                          </p>

                          <p className="mt-2 text-xs text-zinc-500">
                            Stock: {stock}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-black text-white">
                            {formatCurrency(Number(card.price ?? 0))}
                          </p>

                          <Link
                            href={`/dashboard/inventory/${card.id}/edit`}
                            className="mt-2 inline-block text-sm font-bold text-green-400 transition hover:text-green-300"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </article>

            <div className="grid gap-6">
              <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
                  Quick Action
                </p>

                <h2 className="mt-3 text-2xl font-black text-white">
                  Add a New Card
                </h2>

                <p className="mt-3 text-zinc-400">
                  Upload a card image and add a new listing to your inventory.
                </p>

                <Link
                  href="/dashboard/inventory/add"
                  className="mt-6 inline-flex rounded-lg bg-green-700 px-5 py-3 font-bold text-white transition hover:bg-green-600"
                >
                  + Add Card
                </Link>
              </article>

              <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
                  Inventory
                </p>

                <h2 className="mt-3 text-2xl font-black text-white">
                  Manage Your Cards
                </h2>

                <p className="mt-3 text-zinc-400">
                  Search cards, update stock, edit listings, and remove
                  inventory.
                </p>

                <Link
                  href="/dashboard/inventory"
                  className="mt-6 inline-flex rounded-lg border border-white/15 px-5 py-3 font-bold text-white transition hover:border-green-500 hover:bg-green-500/10"
                >
                  View Inventory
                </Link>
              </article>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}