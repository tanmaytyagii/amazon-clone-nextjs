"use client";

import type { Prisma } from "@prisma/client";
import { PackageCheck, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

type AdminOrder = Prisma.OrderGetPayload<{
  include: { items: true; user: { select: { name: true; email: true } } };
}>;

const statuses: AdminOrder["status"][] = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED"
];

export function OrderManager({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);

  async function updateStatus(orderId: string, status: AdminOrder["status"]) {
    const previous = orders;
    setOrders((items) => items.map((item) => (item.id === orderId ? { ...item, status } : item)));

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error("Unable to update order status.");
      toast.success("Order status updated");
    } catch (error) {
      setOrders(previous);
      toast.error(error instanceof Error ? error.message : "Unable to update order status.");
    }
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
        <p className="font-bold">No orders yet</p>
        <p className="mt-1 text-sm text-slate-500">Orders placed by customers will show up here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <PackageCheck className="h-6 w-6 text-amazon-teal" />
          <p className="mt-3 text-xs font-black uppercase text-slate-500">Total orders</p>
          <p className="mt-1 text-3xl font-black tracking-normal">{orders.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <Truck className="h-6 w-6 text-amazon-orange" />
          <p className="mt-3 text-xs font-black uppercase text-slate-500">Shipping queue</p>
          <p className="mt-1 text-3xl font-black tracking-normal">
            {orders.filter((order) => order.status === "PROCESSING" || order.status === "PAID" || order.status === "PACKED").length}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <p className="text-xs font-black uppercase text-slate-500">Revenue</p>
          <p className="mt-3 text-3xl font-black tracking-normal">{formatPrice(orders.reduce((sum, order) => sum + order.total, 0))}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-white/10">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-4">
                    <p className="font-black text-slate-950 dark:text-white">{order.id}</p>
                    <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-bold">{order.user?.name ?? "Unknown"}</p>
                    <p className="text-xs text-slate-500">{order.user?.email ?? order.shippingPhone}</p>
                  </td>
                  <td className="px-4 py-4">{order.items.length}</td>
                  <td className="px-4 py-4 font-bold">{formatPrice(order.total)}</td>
                  <td className="px-4 py-4">
                    <Badge tone={order.status === "DELIVERED" ? "success" : order.status === "CANCELLED" || order.status === "RETURNED" ? "deal" : "prime"}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={order.status}
                      onChange={(event) => updateStatus(order.id, event.target.value as AdminOrder["status"])}
                      className="h-10 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10"
                    >
                      {statuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
