type SportChartItem = {
    sport: string;
    inventoryValue: number;
    inventoryCost: number;
    profit: number;
  };
  
  type InventoryAgeItem = {
    label: string;
    count: number;
  };
  
  type DealerDashboardChartsProps = {
    sportData: SportChartItem[];
    ageData: InventoryAgeItem[];
  };
  
  export default function DealerDashboardCharts({
    sportData,
    ageData,
  }: DealerDashboardChartsProps) {
    const maximumInventoryValue = Math.max(
      ...sportData.map((item) => item.inventoryValue),
      1,
    );
  
    const maximumAgeCount = Math.max(
      ...ageData.map((item) => item.count),
      1,
    );
  
    return (
      <section className="mb-8">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">
            Business Trends
          </p>
  
          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            Dealer Dashboard Charts
          </h2>
  
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Compare inventory value, projected profit, and inventory age across
            the business.
          </p>
        </div>
  
        <div className="grid gap-6 xl:grid-cols-2">
          <ChartPanel
            title="Inventory Value by Sport"
            description="Current website asking value grouped by sport."
          >
            {sportData.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-5">
                {sportData.map((item) => {
                  const width =
                    (item.inventoryValue / maximumInventoryValue) * 100;
  
                  return (
                    <div key={item.sport}>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-white">
                            {item.sport}
                          </p>
  
                          <p className="mt-1 text-xs text-zinc-500">
                            Cost {formatCurrency(item.inventoryCost)}
                          </p>
                        </div>
  
                        <div className="text-right">
                          <p className="font-black text-white">
                            {formatCurrency(item.inventoryValue)}
                          </p>
  
                          <p
                            className={`mt-1 text-xs font-bold ${
                              item.profit >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {formatCurrency(item.profit)} profit
                          </p>
                        </div>
                      </div>
  
                      <div className="h-3 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-green-500 transition-all"
                          style={{
                            width: `${Math.max(width, 2)}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ChartPanel>
  
          <ChartPanel
            title="Inventory Age"
            description="How long current inventory has been held."
          >
            {ageData.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-5">
                {ageData.map((item) => {
                  const width = (item.count / maximumAgeCount) * 100;
  
                  return (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <p className="font-bold text-white">
                          {item.label}
                        </p>
  
                        <p className="font-black text-white">
                          {item.count.toLocaleString()}
                        </p>
                      </div>
  
                      <div className="h-3 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-white/60 transition-all"
                          style={{
                            width: `${Math.max(width, 2)}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ChartPanel>
        </div>
      </section>
    );
  }
  
  type ChartPanelProps = {
    title: string;
    description: string;
    children: React.ReactNode;
  };
  
  function ChartPanel({
    title,
    description,
    children,
  }: ChartPanelProps) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="mb-8">
          <h3 className="text-xl font-black text-white">
            {title}
          </h3>
  
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {description}
          </p>
        </div>
  
        {children}
      </div>
    );
  }
  
  function EmptyState() {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-8 text-center">
        <p className="font-bold text-white">
          No chart data available
        </p>
  
        <p className="mt-2 text-sm text-zinc-500">
          Add inventory records to begin displaying business trends.
        </p>
      </div>
    );
  }
  
  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number.isFinite(value) ? value : 0);
  }