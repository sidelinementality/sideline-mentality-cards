type DealerInsightsProps = {
    topSport: string;
    topSportValue: number;
  
    topBrand: string;
    topBrandValue: number;
  
    topYear: string;
    topYearValue: number;
  
    averagePrice: number;
  
    averageQuantity: number;
  
    featuredPercentage: number;
  };
  
  export default function DealerInsights({
    topSport,
    topSportValue,
    topBrand,
    topBrandValue,
    topYear,
    topYearValue,
    averagePrice,
    averageQuantity,
    featuredPercentage,
  }: DealerInsightsProps) {
    const money = (value: number) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
  
    return (
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20">
        <div className="border-b border-white/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
            Dealer Analytics
          </p>
  
          <h2 className="mt-2 text-2xl font-black text-white">
            Dealer Insights
          </h2>
  
          <p className="mt-2 text-zinc-400">
            Your highest-performing categories and key business metrics.
          </p>
        </div>
  
        <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
          <InsightCard
            title="Top Sport"
            value={topSport}
            subtitle={money(topSportValue)}
          />
  
          <InsightCard
            title="Top Brand"
            value={topBrand}
            subtitle={money(topBrandValue)}
          />
  
          <InsightCard
            title="Top Year"
            value={topYear}
            subtitle={money(topYearValue)}
          />
  
          <InsightCard
            title="Average Price"
            value={money(averagePrice)}
            subtitle="Per Listing"
          />
  
          <InsightCard
            title="Average Quantity"
            value={averageQuantity.toFixed(1)}
            subtitle="Cards per Listing"
          />
  
          <InsightCard
            title="Featured Inventory"
            value={`${featuredPercentage.toFixed(1)}%`}
            subtitle="Featured Listings"
          />
        </div>
      </section>
    );
  }
  
  type InsightCardProps = {
    title: string;
    value: string;
    subtitle: string;
  };
  
  function InsightCard({
    title,
    value,
    subtitle,
  }: InsightCardProps) {
    return (
      <article className="rounded-xl border border-white/10 bg-black/20 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
          {title}
        </p>
  
        <h3 className="mt-4 text-2xl font-black text-white">
          {value}
        </h3>
  
        <p className="mt-2 text-sm text-green-300">
          {subtitle}
        </p>
      </article>
    );
  }