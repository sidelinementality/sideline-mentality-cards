type BrandSummary = {
    brand: string;
    listings: number;
    quantity: number;
    value: number;
    percentage: number;
  };
  
  type InventoryByBrandProps = {
    inventoryByBrand: BrandSummary[];
    topBrand: BrandSummary | null;
  };
  
  export default function InventoryByBrand({
    inventoryByBrand,
    topBrand,
  }: InventoryByBrandProps) {
    return (
      <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
              Brand Analytics
            </p>
  
            <h2 className="mt-2 text-2xl font-black text-white">
              Inventory by Brand
            </h2>
  
            <p className="mt-2 text-zinc-400">
              Review which card manufacturers make up the largest portions of
              your available inventory.
            </p>
          </div>
  
          {topBrand && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-3">
              <p className="text-xs font-bold uppercase tracking-wide text-green-300">
                Largest Brand
              </p>
  
              <p className="mt-1 text-lg font-black text-white">
                {topBrand.brand}
              </p>
            </div>
          )}
        </div>
  
        {inventoryByBrand.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-semibold text-white">
              No brand information is available yet.
            </p>
  
            <p className="mt-2 text-sm text-zinc-400">
              Add a brand to your card listings to begin viewing this report.
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="overflow-hidden rounded-xl border border-white/10">
              <div className="hidden grid-cols-[1.4fr_0.7fr_0.7fr_1fr] gap-4 border-b border-white/10 bg-black/30 px-5 py-4 text-xs font-bold uppercase tracking-wide text-zinc-500 md:grid">
                <p>Brand</p>
                <p>Listings</p>
                <p>Quantity</p>
                <p className="text-right">Listed Value</p>
              </div>
  
              <div className="divide-y divide-white/10">
                {inventoryByBrand.map((brand) => (
                  <article
                    key={brand.brand}
                    className="grid gap-4 bg-black/10 p-5 md:grid-cols-[1.4fr_0.7fr_0.7fr_1fr] md:items-center"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-black text-white">{brand.brand}</h3>
  
                        <p className="text-sm font-black text-green-300 md:hidden">
                          {brand.percentage.toFixed(1)}%
                        </p>
                      </div>
  
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-green-600"
                          style={{
                            width: `${Math.max(
                              brand.percentage,
                              brand.quantity > 0 ? 2 : 0
                            )}%`,
                          }}
                        />
                      </div>
  
                      <p className="mt-2 hidden text-xs text-zinc-500 md:block">
                        {brand.percentage.toFixed(1)}% of available cards
                      </p>
                    </div>
  
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 md:hidden">
                        Listings
                      </p>
  
                      <p className="mt-1 font-bold text-white md:mt-0">
                        {brand.listings}
                      </p>
                    </div>
  
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 md:hidden">
                        Quantity
                      </p>
  
                      <p className="mt-1 font-bold text-white md:mt-0">
                        {brand.quantity}
                      </p>
                    </div>
  
                    <div className="md:text-right">
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 md:hidden">
                        Listed Value
                      </p>
  
                      <p className="mt-1 font-black text-white md:mt-0">
                        {formatCurrency(brand.value)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
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