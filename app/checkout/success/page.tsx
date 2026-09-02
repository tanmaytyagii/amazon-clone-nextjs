import { CheckCircle2, PackageCheck } from "lucide-react";
import Link from "next/link";

import { ClearCartOnSuccess } from "@/components/cart/clear-cart-on-success";

export const metadata = {
  title: "Order Success"
};

export default async function CheckoutSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <ClearCartOnSuccess />
      <div className="rounded border border-slate-200 bg-white p-8 text-center shadow-card dark:border-white/10 dark:bg-slate-900">
        <CheckCircle2 className="mx-auto h-16 w-16 text-amazon-green" />
        <h1 className="mt-5 text-3xl font-black tracking-normal text-slate-950 dark:text-white">Order placed successfully</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Thanks for shopping. Stripe will confirm payment through the webhook and the order will appear in your dashboard.
        </p>
        {orderId && (
          <p className="mt-4 rounded-md bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-white/10">
            Order ID: {orderId}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/orders" className="inline-flex h-11 items-center gap-2 rounded-md bg-amazon-gold px-5 text-sm font-bold text-slate-950">
            <PackageCheck className="h-4 w-4" />
            View orders
          </Link>
          <Link href="/search" className="inline-flex h-11 items-center rounded-md border border-slate-200 px-5 text-sm font-bold dark:border-white/10">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
