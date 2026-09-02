import { getServerSession } from "next-auth";

import { AddressManager } from "@/components/dashboard/address-manager";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Saved Addresses"
};

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <DashboardShell title="Addresses">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-2xl font-black tracking-normal">Sign in to manage addresses</h2>
        </div>
      </DashboardShell>
    );
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
  });

  return (
    <DashboardShell title="Addresses">
      <AddressManager initialAddresses={addresses} />
    </DashboardShell>
  );
}
