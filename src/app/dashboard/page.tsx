import DashboardInventorySearch from "@/components/DashboardInventorySearch";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DealerHighlights from "@/components/dashboard/DealerHighlights";
import DealerInsights from "@/components/dashboard/DealerInsights";
import DealerSalesStats from "@/components/dashboard/DealerSalesStats";
import InventoryValueByBrandChart from "@/components/dashboard/InventoryValueByBrandChart";
import InventoryValueByYearChart from "@/components/dashboard/InventoryValueByYearChart";
import InventoryValueChart from "@/components/dashboard/InventoryValueChart";
import LowInventoryAlerts from "@/components/dashboard/LowInventoryAlerts";
import RecentlyAddedCards from "@/components/dashboard/RecentlyAddedCards";
import StockHealthChart from "@/components/dashboard/StockHealthChart";
import TodaysPriorities from "@/components/dashboard/TodaysPriorities";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import DealerProfitDashboard from "@/components/dashboard/DealerProfitDashboard";
import TopProfitCards from "@/components/dashboard/TopProfitCards";
import InventoryIntelligence from "@/components/dashboard/InventoryIntelligence";
import DealerDashboardCharts from "@/components/dashboard/DealerDashboardCharts";
import BuyBibleCommandCenter from "@/components/dashboard/BuyBibleCommandCenter";
import {
  createInventoryQuantityMap,
  getOwnedQuantity,
} from "@/lib/buy-bible-inventory";

type Card = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  year: number | null;
  brand: string | null;
  price: number | string | null;
  image_url: string | null;
  back_image_url: string | null;
  featured: boolean | null;
  website_ready: boolean | null;
  listing_status: string | null;
  stock: number | null;
  created_at: string | null;
  grade_company: string | null;
  grade: string | null;
  rookie_card: boolean | null;
  autograph: boolean | null;
  serial_number: string | null;
  purchase_price: number | string | null;
shipping_cost: number | string | null;
sales_tax: number | string | null;
purchase_fees: number | string | null;
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
      back_image_url,
      stock,
      featured,
      website_ready,
      listing_status,
      grade_company,
      grade,
      rookie_card,
      autograph,
      serial_number,
      created_at,
      purchase_price,
shipping_cost,
sales_tax,
purchase_fees
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Dashboard loading error:", error);
  }

  const { data: orders, error: ordersError } = await supabaseAdmin
    .from("orders")
    .select(`
      total,
      payment_status,
      fulfillment_status,
      created_at
    `);

  if (ordersError) {
    console.error("Dashboard orders loading error:", ordersError);
  }

  const inventory = (cards ?? []) as Card[];
  const salesOrders = orders ?? [];

  const { data: buyBibleTargets, error: buyBibleError } =
  await supabaseAdmin
    .from("buy_bible_targets")
    .select(`
      id,
      player_name,
      sport,
      priority_level,
      overall_buy_score,
      target_quantity,
      target_status
    `)
    .eq("is_active", true)
    .order("priority_level", { ascending: false })
    .order("overall_buy_score", {
      ascending: false,
      nullsFirst: false,
    });

if (buyBibleError) {
  console.error(
    "Dashboard Buy Bible loading error:",
    buyBibleError,
  );
}

const inventoryQuantityMap =
  createInventoryQuantityMap(inventory);

  const totalRevenue = salesOrders
    .filter(
      (order) => order.payment_status?.toLowerCase() === "paid",
    )
    .reduce(
      (sum, order) => sum + Number(order.total ?? 0),
      0,
    );

  const paidOrders = salesOrders.filter(
    (order) => order.payment_status?.toLowerCase() === "paid",
  ).length;

  const pendingFulfillmentOrders = salesOrders.filter(
    (order) =>
      order.payment_status?.toLowerCase() === "paid" &&
      order.fulfillment_status?.toLowerCase() === "pending",
  ).length;

  const averageOrderValue =
    paidOrders > 0 ? totalRevenue / paidOrders : 0;

  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  );

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const revenueToday = salesOrders
    .filter((order) => {
      if (order.payment_status?.toLowerCase() !== "paid") {
        return false;
      }

      return new Date(order.created_at) >= startOfToday;
    })
    .reduce(
      (sum, order) => sum + Number(order.total ?? 0),
      0,
    );

  const revenueThisMonth = salesOrders
    .filter((order) => {
      if (order.payment_status?.toLowerCase() !== "paid") {
        return false;
      }

      return new Date(order.created_at) >= startOfMonth;
    })
    .reduce(
      (sum, order) => sum + Number(order.total ?? 0),
      0,
    );

  const revenueLast7Days = salesOrders
    .filter((order) => {
      if (order.payment_status?.toLowerCase() !== "paid") {
        return false;
      }

      return new Date(order.created_at) >= sevenDaysAgo;
    })
    .reduce(
      (sum, order) => sum + Number(order.total ?? 0),
      0,
    );

  const ordersThisMonth = salesOrders.filter((order) => {
    if (order.payment_status?.toLowerCase() !== "paid") {
      return false;
    }

    return new Date(order.created_at) >= startOfMonth;
  }).length;

  const dealerSalesStats = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      description: "All completed sales",
    },
    {
      label: "Paid Orders",
      value: paidOrders,
      description: "Successfully paid orders",
    },
    {
      label: "Average Order",
      value: formatCurrency(averageOrderValue),
      description: "Average revenue per paid order",
    },
    {
      label: "Pending Fulfillment",
      value: pendingFulfillmentOrders,
      description: "Paid orders awaiting fulfillment",
    },
    {
      label: "Revenue Today",
      value: formatCurrency(revenueToday),
      description: "Paid sales recorded today",
    },
    {
      label: "Last 7 Days",
      value: formatCurrency(revenueLast7Days),
      description: "Paid revenue during the past seven days",
    },
    {
      label: "Revenue This Month",
      value: formatCurrency(revenueThisMonth),
      description: "Paid revenue during the current month",
    },
    {
      label: "Orders This Month",
      value: ordersThisMonth,
      description: "Paid orders during the current month",
    },
  ];

  const totalListings = inventory.length;

  const totalQuantity = inventory.reduce(
    (total, card) => total + Number(card.stock ?? 0),
    0,
  );

  const inventoryValue = inventory.reduce((total, card) => {
    const price = Number(card.price ?? 0);
    const stock = Number(card.stock ?? 0);

    return total + price * stock;
  }, 0);

  const inventoryCost = inventory.reduce((total, card) => {
    const purchasePrice = Number(card.purchase_price ?? 0);
    const shippingCost = Number(card.shipping_cost ?? 0);
    const salesTax = Number(card.sales_tax ?? 0);
    const purchaseFees = Number(card.purchase_fees ?? 0);
  
    return (
      total +
      purchasePrice +
      shippingCost +
      salesTax +
      purchaseFees
    );
  }, 0);
  
  const estimatedProfit = inventoryValue - inventoryCost;
  
  const overallRoi =
    inventoryCost > 0
      ? (estimatedProfit / inventoryCost) * 100
      : 0;

  const averagePrice =
    totalListings > 0
      ? inventory.reduce(
          (total, card) => total + Number(card.price ?? 0),
          0,
        ) / totalListings
      : 0;

  const averageQuantityPerListing =
    totalListings > 0 ? totalQuantity / totalListings : 0;

  const cardsAddedThisWeek = inventory.filter((card) => {
    if (!card.created_at) {
      return false;
    }

    return new Date(card.created_at) >= sevenDaysAgo;
  }).length;

  const featuredCards = inventory.filter(
    (card) => card.featured,
  ).length;

  const featuredPercentage =
    totalListings > 0
      ? (featuredCards / totalListings) * 100
      : 0;

  const healthyStockCards = inventory.filter(
    (card) => Number(card.stock ?? 0) >= 4,
  );

  const lowStockInventory = inventory.filter((card) => {
    const stock = Number(card.stock ?? 0);

    return stock > 0 && stock <= 3;
  });

  const outOfStockInventory = inventory.filter(
    (card) => Number(card.stock ?? 0) === 0,
  );

  const cardsMissingImages = inventory.filter(
    (card) => !card.image_url,
  );

  const draftCards = inventory.filter(
    (card) =>
      (card.listing_status ?? "").toLowerCase() === "draft",
  ).length;

  const readyToPublishCards = inventory.filter(
    (card) =>
      card.website_ready === true &&
      (card.listing_status ?? "").toLowerCase() ===
        "ready to publish",
  ).length;

  const cardsMissingBackImages = inventory.filter(
    (card) => !card.back_image_url,
  ).length;

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

  const inventoryBySport: SportSummary[] = Object.entries(
    sportTotals,
  )
    .map(([sport, totals]) => ({
      sport,
      listings: totals.listings,
      quantity: totals.quantity,
      value: totals.value,
      percentage:
        totalQuantity > 0
          ? (totals.quantity / totalQuantity) * 100
          : 0,
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

  const inventoryByBrand: BrandSummary[] = Object.entries(
    brandTotals,
  )
    .map(([brand, totals]) => ({
      brand,
      listings: totals.listings,
      quantity: totals.quantity,
      value: totals.value,
      percentage:
        totalQuantity > 0
          ? (totals.quantity / totalQuantity) * 100
          : 0,
    }))
    .sort((a, b) => b.quantity - a.quantity);

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
    const yearName = card.year
      ? String(card.year)
      : "Unknown Year";

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

  const inventoryByYear: YearSummary[] = Object.entries(
    yearTotals,
  )
    .map(([year, totals]) => ({
      year,
      listings: totals.listings,
      quantity: totals.quantity,
      value: totals.value,
      percentage:
        totalQuantity > 0
          ? (totals.quantity / totalQuantity) * 100
          : 0,
    }))
    .sort((a, b) => {
      if (a.year === "Unknown Year") {
        return 1;
      }

      if (b.year === "Unknown Year") {
        return -1;
      }

      return Number(b.year) - Number(a.year);
    });

  const highestValueSport =
    [...inventoryBySport].sort(
      (a, b) => b.value - a.value,
    )[0] ?? null;

  const highestValueBrand =
    [...inventoryByBrand].sort(
      (a, b) => b.value - a.value,
    )[0] ?? null;

  const highestValueYear =
    [...inventoryByYear].sort(
      (a, b) => b.value - a.value,
    )[0] ?? null;

    const dashboardSportData = inventoryBySport.map((sport) => {
      const cardsInSport = inventory.filter(
        (card) => (card.sport ?? "Uncategorized") === sport.sport,
      );
    
      const inventoryCost = cardsInSport.reduce((total, card) => {
        return (
          total +
          Number(card.purchase_price ?? 0) +
          Number(card.shipping_cost ?? 0) +
          Number(card.sales_tax ?? 0) +
          Number(card.purchase_fees ?? 0)
        );
      }, 0);
    
      return {
        sport: sport.sport,
        inventoryValue: sport.value,
        inventoryCost,
        profit: sport.value - inventoryCost,
      };
    });
    
    const dashboardAgeData = [
      {
        label: "0–30 Days",
        count: inventory.filter((card) => {
          if (!card.created_at) return false;
    
          const age =
            (Date.now() -
              new Date(card.created_at).getTime()) /
            (1000 * 60 * 60 * 24);
    
          return age <= 30;
        }).length,
      },
      {
        label: "31–90 Days",
        count: inventory.filter((card) => {
          if (!card.created_at) return false;
    
          const age =
            (Date.now() -
              new Date(card.created_at).getTime()) /
            (1000 * 60 * 60 * 24);
    
          return age > 30 && age <= 90;
        }).length,
      },
      {
        label: "91–180 Days",
        count: inventory.filter((card) => {
          if (!card.created_at) return false;
    
          const age =
            (Date.now() -
              new Date(card.created_at).getTime()) /
            (1000 * 60 * 60 * 24);
    
          return age > 90 && age <= 180;
        }).length,
      },
      {
        label: "180+ Days",
        count: inventory.filter((card) => {
          if (!card.created_at) return false;
    
          const age =
            (Date.now() -
              new Date(card.created_at).getTime()) /
            (1000 * 60 * 60 * 24);
    
          return age > 180;
        }).length,
      },
    ];

    const dashboardBuyTargets = (buyBibleTargets ?? []).map(
      (target) => ({
        id: target.id,
        playerName: target.player_name,
        sport: target.sport,
        priority: Number(target.priority_level ?? 0),
        buyScore:
          target.overall_buy_score === null
            ? null
            : Number(target.overall_buy_score),
        currentQuantity: getOwnedQuantity(
          target.player_name,
          inventoryQuantityMap,
        ),
        targetQuantity: Number(
          target.target_quantity ?? 0,
        ),
        status: target.target_status,
      }),
    );

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
      description: "Inventory records in Dealer OS",
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
      description: "Cards marked as featured inventory",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
          Dealer OS
        </p>

        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Dashboard Overview
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Review today&apos;s priorities, monitor inventory, and manage
          Sideline Mentality Cards from one place.
        </p>
      </section>

      <TodaysPriorities
        draftCards={draftCards}
        readyToPublishCards={readyToPublishCards}
        lowStockCards={lowStockInventory.length}
        missingBackImages={cardsMissingBackImages}
        pendingOrders={pendingFulfillmentOrders}
      />

<BuyBibleCommandCenter
  targets={dashboardBuyTargets}
/>

<DealerProfitDashboard
  inventoryCost={inventoryCost}
  websiteValue={inventoryValue}
  estimatedProfit={estimatedProfit}
  roi={overallRoi}
  totalQuantity={totalQuantity}
  totalListings={totalListings}
/>

<TopProfitCards
  cards={inventory.map((card) => ({
    id: card.id,
    player_name: card.player_name,
    total_cost:
      Number(card.purchase_price ?? 0) +
      Number(card.shipping_cost ?? 0) +
      Number(card.sales_tax ?? 0) +
      Number(card.purchase_fees ?? 0),
    price: Number(card.price ?? 0),
    quantity: Number(card.stock ?? 0),
  }))}
/>

<InventoryIntelligence
  cards={inventory.map((card) => ({
    id: card.id,
    playerName: card.player_name,
    totalCost:
      Number(card.purchase_price ?? 0) +
      Number(card.shipping_cost ?? 0) +
      Number(card.sales_tax ?? 0) +
      Number(card.purchase_fees ?? 0),
    websitePrice: Number(card.price ?? 0),
    stock: Number(card.stock ?? 0),
    createdAt: card.created_at,
    imageUrl: card.image_url,
    backImageUrl: card.back_image_url,
    purchasePrice:
      card.purchase_price === null
        ? null
        : Number(card.purchase_price),
    websiteReady: Boolean(card.website_ready),
    listingStatus: card.listing_status ?? "Available",
  }))}
/>

<DealerDashboardCharts
  sportData={dashboardSportData}
  ageData={dashboardAgeData}
/>

      {error ? (
        <section className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <p className="font-semibold text-red-300">
            Dashboard information could not be loaded.
          </p>
        </section>
      ) : (
        <>
          <DealerSalesStats stats={dealerSalesStats} />

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
            <InventoryValueByBrandChart
              data={inventoryByBrand}
            />

            <InventoryValueByYearChart
              data={inventoryByYear}
            />
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

          <LowInventoryAlerts
            lowStockCards={lowStockInventory}
            soldOutCards={outOfStockInventory}
          />

          <DashboardInventorySearch cards={inventory} />

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