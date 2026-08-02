type DealerProfitDashboardProps = {
    inventoryCost: number;
    websiteValue: number;
    estimatedProfit: number;
    roi: number;
    totalQuantity: number;
    totalListings: number;
  };
  
  export default function DealerProfitDashboard({
    inventoryCost,
    websiteValue,
    estimatedProfit,
    roi,
    totalQuantity,
    totalListings,
  }: DealerProfitDashboardProps) {
    const averageCostPerCard =
      totalQuantity > 0 ? inventoryCost / totalQuantity : 0;
  
    const averageWebsiteValuePerCard =
      totalQuantity > 0 ? websiteValue / totalQuantity : 0;
  
    const averageProfitPerCard =
      totalQuantity > 0 ? estimatedProfit / totalQuantity : 0;
  
    const averageQuantityPerListing =
      totalListings > 0 ? totalQuantity / totalListings : 0;
  
    return (
      <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03]">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">
            Business Performance
          </p>
  
          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            Dealer Profit Dashboard
          </h2>
  
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            A live snapshot of your inventory cost, website value, expected
            profit, and average performance per card.
          </p>
        </div>
  
        <div className="grid gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Inventory Cost"
            value={formatMoney(inventoryCost)}
            description="Total acquisition cost and expenses"
            tone="danger"
          />
  
          <MetricCard
            title="Website Value"
            value={formatMoney(websiteValue)}
            description="Total current asking value"
            tone="success"
          />
  
          <MetricCard
            title="Estimated Profit"
            value={formatMoney(estimatedProfit)}
            description="Website value minus inventory cost"
            tone={estimatedProfit >= 0 ? "success" : "danger"}
          />
  
          <MetricCard
            title="Overall ROI"
            value={`${formatNumber(roi)}%`}
            description="Expected return on invested inventory"
            tone={roi >= 0 ? "success" : "danger"}
          />
        </div>
  
        <div className="grid gap-px border-t border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Average Cost Per Card"
            value={formatMoney(averageCostPerCard)}
            description={`${totalQuantity.toLocaleString()} total cards`}
            tone="neutral"
            compact
          />
  
          <MetricCard
            title="Average Website Value"
            value={formatMoney(averageWebsiteValuePerCard)}
            description="Average asking value per card"
            tone="neutral"
            compact
          />
  
          <MetricCard
            title="Average Profit Per Card"
            value={formatMoney(averageProfitPerCard)}
            description="Expected average gross profit"
            tone={averageProfitPerCard >= 0 ? "success" : "danger"}
            compact
          />
  
          <MetricCard
            title="Average Quantity Per Listing"
            value={formatNumber(averageQuantityPerListing)}
            description={`${totalListings.toLocaleString()} unique listings`}
            tone="neutral"
            compact
          />
        </div>
      </section>
    );
  }
  
  type MetricCardProps = {
    title: string;
    value: string;
    description: string;
    tone: "neutral" | "success" | "danger";
    compact?: boolean;
  };
  
  function MetricCard({
    title,
    value,
    description,
    tone,
    compact = false,
  }: MetricCardProps) {
    const valueClasses = {
      neutral: "text-white",
      success: "text-green-300",
      danger: "text-red-300",
    };
  
    return (
      <div className="bg-zinc-950 p-6 transition hover:bg-white/[0.03] sm:p-7">
        <p className="text-sm font-semibold text-zinc-400">{title}</p>
  
        <p
          className={`mt-3 font-black ${valueClasses[tone]} ${
            compact ? "text-2xl" : "text-3xl"
          }`}
        >
          {value}
        </p>
  
        <p className="mt-2 text-xs leading-5 text-zinc-600">
          {description}
        </p>
      </div>
    );
  }
  
  function formatMoney(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number.isFinite(amount) ? amount : 0);
  }
  
  function formatNumber(value: number) {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 1,
    }).format(Number.isFinite(value) ? value : 0);
  }