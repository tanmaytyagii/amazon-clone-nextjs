"use client";

import { ShieldCheck, UserCog, UsersRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";

type AdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "ADMIN";
  createdAt: Date;
  _count: { orders: number };
};

export function UserManager({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);

  async function updateRole(userId: string, role: AdminUser["role"]) {
    const previous = users;
    setUsers((items) => items.map((item) => (item.id === userId ? { ...item, role } : item)));

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      });
      if (!response.ok) throw new Error("Unable to update role.");
      toast.success("Role updated");
    } catch (error) {
      setUsers(previous);
      toast.error(error instanceof Error ? error.message : "Unable to update role.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <UsersRound className="h-6 w-6 text-amazon-teal" />
          <p className="mt-3 text-xs font-black uppercase text-slate-500">Users</p>
          <p className="mt-1 text-3xl font-black tracking-normal">{users.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <ShieldCheck className="h-6 w-6 text-amazon-orange" />
          <p className="mt-3 text-xs font-black uppercase text-slate-500">Admins</p>
          <p className="mt-1 text-3xl font-black tracking-normal">{users.filter((user) => user.role === "ADMIN").length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <UserCog className="h-6 w-6 text-amazon-green" />
          <p className="mt-3 text-xs font-black uppercase text-slate-500">Total orders</p>
          <p className="mt-1 text-3xl font-black tracking-normal">{users.reduce((sum, user) => sum + user._count.orders, 0)}</p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
          <p className="font-bold">No users yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-white/10">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-4">
                      <p className="font-black text-slate-950 dark:text-white">{user.name ?? "Unnamed"}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <Badge tone={user.role === "ADMIN" ? "success" : "default"}>{user.role}</Badge>
                    </td>
                    <td className="px-4 py-4">{user._count.orders}</td>
                    <td className="px-4 py-4">{new Date(user.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-4 py-4">
                      <select
                        value={user.role}
                        onChange={(event) => updateRole(user.id, event.target.value as AdminUser["role"])}
                        className="h-10 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10"
                      >
                        <option>USER</option>
                        <option>ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
