import { Boxes, IndianRupee, PackageCheck, UsersRound } from "lucide-react";

import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Overview"
};

async function getOverviewData() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [productCount, orderCount, userCount, paidRevenue, recentOrders, orderItems] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
    prisma.order.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { total: true, createdAt: true }
    }),
    prisma.orderItem.findMany({ select: { productId: true, title: true, quantity: true } })
  ]);

  const revenue = paidRevenue._sum.total ?? 0;

  const dailyRevenue: { label: string; value: number }[] = Array.from({ length: 7 }).map((_, index) => {
    const day = new Date(sevenDaysAgo);
    day.setDate(sevenDaysAgo.getDate() + index);
    const label = day.toLocaleDateString("en-IN", { weekday: "short" });
    const total = recentOrders
      .filter((order) => new Date(order.createdAt).toDateString() === day.toDateString())
      .reduce((sum, order) => sum + order.total, 0);
    return { label, value: total };
  });

  const productTotals = new Map<string, { title: string; quantity: number }>();
  for (const item of orderItems) {
    const existing = productTotals.get(item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      productTotals.set(item.productId, { title: item.title, quantity: item.quantity });
    }
  }
  const topProducts = Array.from(productTotals.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 4);

  return { productCount, orderCount, userCount, revenue, dailyRevenue, topProducts };
}

export default async function AdminPage() {
  const { productCount, orderCount, userCount, revenue, dailyRevenue, topProducts } = await getOverviewData();
  const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0;

  return (
    <AdminShell title="Overview">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Products", value: productCount, icon: Boxes },
            { label: "Orders", value: orderCount, icon: PackageCheck },
            { label: "Users", value: userCount, icon: UsersRound },
            { label: "Revenue (paid)", value: formatPrice(revenue), icon: IndianRupee }
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <Icon className="h-6 w-6 text-amazon-orange" />
                <p className="mt-3 text-xs font-black uppercase text-slate-500">{stat.label}</p>
                <p className="mt-1 text-3xl font-black tracking-normal text-slate-950 dark:text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>
        <AnalyticsDashboard
          revenue={revenue}
          orderCount={orderCount}
          userCount={userCount}
          avgOrderValue={avgOrderValue}
          dailyRevenue={dailyRevenue}
          topProducts={topProducts}
        />
      </div>
    </AdminShell>
  );
}
