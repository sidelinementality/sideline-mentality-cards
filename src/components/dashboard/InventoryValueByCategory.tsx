type ValueCategory = {
    label: string;
    quantity: number;
    value: number;
  };
  
  type InventoryValueByCategoryProps = {
    valueCategories: ValueCategory[];
  };
  
  export default function InventoryValueByCategory({
    valueCategories,
  }: InventoryValueByCategoryProps) {
    return (
      <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
            Value Analytics
          </p>
  
          <h2 className="mt-2 text-2xl font-black text-white">
            Inventory Value by Category
          </h2>
  
          <p className="mt-2 text-zinc-400">
            Review how much inventory value is held in each pricing range.
          </p>
        </div>
  
        {valueCategories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-semibold text-white">
              No inventory value information is available.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-4">
            {valueCategories.map((category) => (
              <ValueCategoryCard
                key={category.label}
                label={category.label}
                quantity={category.quantity}
                value={category.value}
              />
            ))}
          </div>
        )}
      </section>
    );
  }
  
  function ValueCategoryCard({
    label,
    quantity,
    value,
  }: ValueCategory) {
    return (
      <article className="rounded-xl border border-white/10 bg-black/20 p-5">
        <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
          {label}
        </p>
  
        <p className="mt-4 text-3xl font-black text-white">
          {quantity}
        </p>
  
        <p className="mt-1 text-sm text-zinc-400">
          {quantity === 1 ? "card" : "cards"}
        </p>
  
        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Listed Value
          </p>
  
          <p className="mt-2 text-xl font-black text-green-300">
            {formatCurrency(value)}
          </p>
        </div>
      </article>
    );
  }
  
  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }