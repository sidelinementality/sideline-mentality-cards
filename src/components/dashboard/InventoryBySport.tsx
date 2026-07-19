type SportSummary = {
    sport: string;
    listings: number;
    quantity: number;
    value: number;
    percentage: number;
  };
  
  type InventoryBySportProps = {
    inventoryBySport: SportSummary[];
    topSport: SportSummary | null;
  };
  
  export default function InventoryBySport({
    inventoryBySport,
    topSport,
  }: InventoryBySportProps) {
    return (
      <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
              Inventory Analytics
            </p>
  
            <h2 className="mt-2 text-2xl font-black text-white">
              Inventory by Sport
            </h2>
  
            <p className="mt-2 text-zinc-400">
              See how your available card quantity and inventory value are
              distributed across each sport.
            </p>
          </div>
  
          {topSport && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-3">
              <p className="text-xs font-bold uppercase tracking-wide text-green-300">
                Largest Category
              </p>
  
              <p className="mt-1 text-lg font-black text-white">
                {topSport.sport}
              </p>
            </div>
          )}
        </div>
  
        {inventoryBySport.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-semibold text-white">
              No sport information is available yet.
            </p>
  
            <p className="mt-2 text-sm text-zinc-400">
              Add a sport to your card listings to begin viewing this report.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 p-6 lg:grid-cols-2">
            {inventoryBySport.map((sport) => (
              <article
                key={sport.sport}
                className="rounded-xl border border-white/10 bg-black/20 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {sport.sport}
                    </h3>
  
                    <p className="mt-1 text-sm text-zinc-500">
                      {sport.listings}{" "}
                      {sport.listings === 1 ? "listing" : "listings"}
                    </p>
                  </div>
  
                  <div className="text-right">
                    <p className="text-2xl font-black text-white">
                      {sport.quantity}
                    </p>
  
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Cards
                    </p>
                  </div>
                </div>
  
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Share of Inventory
                    </p>
  
                    <p className="text-sm font-black text-green-300">
                      {sport.percentage.toFixed(1)}%
                    </p>
                  </div>
  
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-green-600"
                      style={{
                        width: `${Math.max(
                          sport.percentage,
                          sport.quantity > 0 ? 2 : 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>
  
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <p className="text-sm text-zinc-400">
                    Listed inventory value
                  </p>
  
                  <p className="font-black text-white">
                    {formatCurrency(sport.value)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    );
  }
  
  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }