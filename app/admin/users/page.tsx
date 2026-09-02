import { AdminShell } from "@/components/admin/admin-shell";
import { UserManager } from "@/components/admin/user-manager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Users"
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <AdminShell title="Users">
      <UserManager initialUsers={users} />
    </AdminShell>
  );
}
