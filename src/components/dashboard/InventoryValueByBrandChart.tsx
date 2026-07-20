"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type BrandChartItem = {
  brand: string;
  value: number;
};

type InventoryValueByBrandChartProps = {
  data: BrandChartItem[];
};

export default function InventoryValueByBrandChart({
  data,
}: InventoryValueByBrandChartProps) {
  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
          Dealer Analytics
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          Inventory Value by Brand
        </h2>

        <p className="mt-2 text-zinc-400">
          Compare the total inventory value across each card brand.
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />

            <XAxis
              dataKey="brand"
              stroke="#d4d4d8"
              interval={0}
              angle={-20}
              textAnchor="end"
              height={70}
            />

            <YAxis
              stroke="#d4d4d8"
              tickFormatter={(value) => `$${Number(value)}`}
            />

            <Tooltip
              formatter={(value) => [
                `$${Number(value ?? 0).toLocaleString()}`,
                "Inventory Value",
              ]}
            />

            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              fill="#22c55e"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}