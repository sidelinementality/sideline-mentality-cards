import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DashboardInventorySearch from "@/components/DashboardInventorySearch";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DealerInsights from "@/components/dashboard/DealerInsights";
import InventoryValueChart from "@/components/dashboard/InventoryValueChart";
import InventoryValueByBrandChart from "@/components/dashboard/InventoryValueByBrandChart";
import InventoryValueByYearChart from "@/components/dashboard/InventoryValueByYearChart";
import StockHealthChart from "@/components/dashboard/StockHealthChart";
import DealerHighlights from "@/components/dashboard/DealerHighlights";
import RecentlyAddedCards from "@/components/dashboard/RecentlyAddedCards";
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
    .select(`
        id,
        slug,
        player_name,
        sport,
        year,
        brand,
        price,
        image_url,
        stock,
        featured,
        grade_company,
        grade,
        rookie_card,
        autograph,
        serial_number
      `)
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
      const averageQuantityPerListing =
      totalListings > 0 ? totalQuantity / totalListings : 0;
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
      const cardsAddedThisWeek = inventory.filter((card) => {
        if (!card.created_at) {
          return false;
        }
    
        return new Date(card.created_at) >= sevenDaysAgo;
      }).length;
  const featuredCards = inventory.filter((card) => card.featured).length;
  const featuredPercentage =
    totalListings > 0 ? (featuredCards / totalListings) * 100 : 0;
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
  const dashboardStats = [
    {
      label: "Inventory Value",
      value: formatCurrency(inventoryValue),
      description: "Total listed inventory value",
    },
    {
      label: "Total Card Quantity",
      value: totalQuantity,
      description: "Total number of cards currently in stock",
    },
    {
      label: "Total Listings",
      value: totalListings,
      description: "Active inventory listings",
    },
    {
      label: "Cards Added This Week",
      value: cardsAddedThisWeek,
      description: "Listings added during the past seven days",
    },
    {
      label: "Low Stock",
      value: lowStockInventory.length,
      description: "Listings with limited quantity remaining",
    },
    {
      label: "Featured Cards",
      value: featuredCards,
      description: "Cards displayed as featured inventory",
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
                    <DealerInsights
  topSport={highestValueSport?.sport ?? "No data"}
  topSportValue={highestValueSport?.value ?? 0}
  topBrand={highestValueBrand?.brand ?? "No data"}
  topBrandValue={highestValueBrand?.value ?? 0}
  topYear={highestValueYear?.year ?? "No data"}
  topYearValue={highestValueYear?.value ?? 0}
  averagePrice={averagePrice}
  averageQuantity={averageQuantityPerListing}
  featuredPercentage={featuredPercentage}
/>
<InventoryValueChart data={inventoryBySport} />
<div className="grid gap-6 xl:grid-cols-2">
  <InventoryValueByBrandChart data={inventoryByBrand} />
  <InventoryValueByYearChart data={inventoryByYear} />
</div>
<div className="grid gap-6 xl:grid-cols-2">
  <StockHealthChart
    healthy={healthyStockCards.length}
    lowStock={lowStockInventory.length}
    outOfStock={outOfStockInventory.length}
  />

  <DealerHighlights
    highestValueCard={highestValueCard}
    newestCard={newestCard}
    missingImageCount={cardsMissingImages.length}
  />
</div>
                    <DashboardInventorySearch inventory={inventory} />
                  <RecentlyAddedCards cards={recentCards} />  
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