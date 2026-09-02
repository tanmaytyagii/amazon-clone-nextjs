import { AdminShell } from "@/components/admin/admin-shell";
import { OrderManager } from "@/components/admin/order-manager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Orders"
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true, user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <AdminShell title="Orders">
      <OrderManager initialOrders={orders} />
    </AdminShell>
  );
}
