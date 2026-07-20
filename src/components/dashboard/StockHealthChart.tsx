"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

type StockHealthChartProps = {
  healthy: number;
  lowStock: number;
  outOfStock: number;
};

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

export default function StockHealthChart({
  healthy,
  lowStock,
  outOfStock,
}: StockHealthChartProps) {
  const data = [
    {
      name: "Healthy Stock",
      value: healthy,
    },
    {
      name: "Low Stock",
      value: lowStock,
    },
    {
      name: "Out of Stock",
      value: outOfStock,
    },
  ];

  const total = healthy + lowStock + outOfStock;

  return (
    <section className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
          Inventory Health
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          Stock Health Breakdown
        </h2>

        <p className="mt-2 text-zinc-400">
          See how your listings are distributed across stock levels.
        </p>
      </div>

      {total > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={105}
                paddingAngle={4}
              >
                {data.map((item, index) => (
                  <Cell
                    key={item.name}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value: number) => [
                  value,
                  "Listings",
                ]}
              />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20 p-6">
          <p className="text-center text-zinc-400">
            Stock health data will appear once inventory is added.
          </p>
        </div>
      )}
    </section>
  );
}