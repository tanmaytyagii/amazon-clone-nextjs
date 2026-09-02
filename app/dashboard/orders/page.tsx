import { PackageSearch } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Order History"
};

async function getOrders(userId: string) {
  try {
    return await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" }
    });
  } catch {
    return [];
  }
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <DashboardShell title="Orders">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-2xl font-black tracking-normal">Sign in to view orders</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Your order history, invoices, and shipping updates live here.</p>
          <Link href="/login?callbackUrl=/dashboard/orders" className="mt-5 inline-flex h-11 items-center rounded-md bg-amazon-gold px-5 text-sm font-bold text-slate-950">
            Sign in
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const orders = await getOrders(session.user.id);

  if (orders.length === 0) {
    return (
      <DashboardShell title="Orders">
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
          <PackageSearch className="mx-auto h-12 w-12 text-slate-400" />
          <h2 className="mt-4 text-2xl font-black tracking-normal">No orders yet</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">When you place an order, it will show up here.</p>
          <Link href="/search" className="mt-5 inline-flex h-11 items-center rounded-md bg-amazon-gold px-5 text-sm font-bold text-slate-950">
            Start shopping
          </Link>
        </div>
      </DashboardShell>
    );
  }

  type OrderView = (typeof orders)[number];

  return (
    <DashboardShell title="Orders">
      <div className="space-y-5">
        {orders.map((order: OrderView) => (
          <article key={order.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="grid gap-3 bg-slate-100 px-5 py-4 text-sm dark:bg-white/10 sm:grid-cols-4">
              <div>
                <p className="text-xs font-black uppercase text-slate-500">Order placed</p>
                <p className="font-bold">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-slate-500">Total</p>
                <p className="font-bold">{formatPrice(order.total)}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-slate-500">Status</p>
                <Badge tone={order.status === "DELIVERED" ? "success" : "prime"}>{order.status}</Badge>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-slate-500">Order ID</p>
                <p className="truncate font-bold">{order.id}</p>
              </div>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-white/10">
              {order.items.map((item: OrderView["items"][number]) => (
                <div key={item.id} className="flex gap-4 p-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100">
                    <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-950 dark:text-white">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Qty {item.quantity} • {formatPrice(item.price)}</p>
                    <Link href="/search" className="mt-3 inline-flex text-sm font-bold text-amazon-teal hover:text-amazon-orange">
                      Buy it again
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
