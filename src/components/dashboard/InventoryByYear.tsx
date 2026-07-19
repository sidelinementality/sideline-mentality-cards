type YearSummary = {
    year: string;
    listings: number;
    quantity: number;
    value: number;
  };
  
  type InventoryByYearProps = {
    inventoryByYear: YearSummary[];
  };
  
  export default function InventoryByYear({
    inventoryByYear,
  }: InventoryByYearProps) {
    return (
      <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
            Year Analytics
          </p>
  
          <h2 className="mt-2 text-2xl font-black text-white">
            Inventory by Year
          </h2>
  
          <p className="mt-2 text-zinc-400">
            See how your inventory is distributed across release years.
          </p>
        </div>
  
        {inventoryByYear.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-semibold text-white">
              No release year information is available.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
            {inventoryByYear.map((year) => (
              <article
                key={year.year}
                className="rounded-xl border border-white/10 bg-black/20 p-5"
              >
                <h3 className="text-2xl font-black text-white">
                  {year.year}
                </h3>
  
                <div className="mt-5 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Listings</span>
                    <span className="font-bold text-white">
                      {year.listings}
                    </span>
                  </div>
  
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Cards</span>
                    <span className="font-bold text-white">
                      {year.quantity}
                    </span>
                  </div>
  
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Value</span>
                    <span className="font-black text-green-300">
                      {formatCurrency(year.value)}
                    </span>
                  </div>
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