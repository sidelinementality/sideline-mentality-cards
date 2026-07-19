type DashboardStat = {
    label: string;
    value: string | number;
    description: string;
  };
  
  type DashboardStatsProps = {
    stats: DashboardStat[];
  };
  
  export default function DashboardStats({
    stats,
  }: DashboardStatsProps) {
    return (
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <p className="text-sm font-semibold text-zinc-400">
              {stat.label}
            </p>
  
            <p className="mt-3 text-3xl font-black text-white">
              {stat.value}
            </p>
  
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              {stat.description}
            </p>
          </article>
        ))}
      </section>
    );
  }