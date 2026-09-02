"use client";

import { motion } from "framer-motion";

import { formatPrice } from "@/lib/utils";

type AnalyticsDashboardProps = {
  revenue: number;
  orderCount: number;
  userCount: number;
  avgOrderValue: number;
  dailyRevenue: { label: string; value: number }[];
  topProducts: { title: string; quantity: number }[];
};

export function AnalyticsDashboard({
  revenue,
  orderCount,
  userCount,
  avgOrderValue,
  dailyRevenue,
  topProducts
}: AnalyticsDashboardProps) {
  const metrics = [
    { label: "Revenue (paid)", value: formatPrice(revenue), color: "bg-amazon-orange" },
    { label: "Orders", value: String(orderCount), color: "bg-amazon-teal" },
    { label: "Users", value: String(userCount), color: "bg-blue-600" },
    { label: "Avg. order value", value: formatPrice(avgOrderValue), color: "bg-amazon-green" }
  ];

  const maxDaily = Math.max(1, ...dailyRevenue.map((day) => day.value));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="amazon-card"
          >
            <p className="text-sm text-slate-500">{m.label}</p>
            <p className="mt-1 text-2xl font-bold">{m.value}</p>
            <div className={`mt-3 h-1.5 w-full rounded-full ${m.color} opacity-80`} />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="amazon-card">
          <h3 className="font-bold">Sales (last 7 days)</h3>
          {dailyRevenue.every((day) => day.value === 0) ? (
            <p className="mt-4 text-sm text-slate-500">No orders in the last 7 days yet.</p>
          ) : (
            <div className="mt-4 flex h-40 items-end gap-2">
              {dailyRevenue.map((day) => (
                <div key={day.label} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-amazon-orange/80"
                    style={{ height: `${Math.max(4, (day.value / maxDaily) * 100)}%` }}
                    title={formatPrice(day.value)}
                  />
                  <span className="text-[10px] text-slate-500">{day.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="amazon-card">
          <h3 className="font-bold">Top products</h3>
          {topProducts.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No sales recorded yet.</p>
          ) : (
            <ul className="mt-4 space-y-3 text-sm">
              {topProducts.map((product) => (
                <li key={product.title} className="flex justify-between gap-4">
                  <span className="line-clamp-1">{product.title}</span>
                  <span className="shrink-0 font-bold">{product.quantity} sold</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
