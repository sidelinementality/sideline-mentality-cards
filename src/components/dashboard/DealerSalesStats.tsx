type SalesStat = {
    label: string;
    value: string | number;
    description: string;
  };
  
  type DealerSalesStatsProps = {
    stats: SalesStat[];
  };
  
  export default function DealerSalesStats({
    stats,
  }: DealerSalesStatsProps) {
    return (
      <section className="mb-8">
        <div className="mb-5">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-green-400">
            Sales Performance
          </p>
  
          <h2 className="mt-2 text-2xl font-black text-white">
            Dealer Sales Dashboard
          </h2>
  
          <p className="mt-2 text-sm text-zinc-400">
            Track revenue, completed payments, and order performance.
          </p>
        </div>
  
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl"
            >
              <p className="text-sm font-semibold text-zinc-400">
                {stat.label}
              </p>
  
              <p className="mt-3 text-3xl font-black text-white">
                {stat.value}
              </p>
  
              <p className="mt-2 text-sm text-zinc-500">
                {stat.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    );
  }