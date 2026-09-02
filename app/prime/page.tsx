import Link from "next/link";

import { ProductGrid } from "@/components/product/product-grid";
import { getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Amazon Prime",
  description: "Prime membership benefits, exclusive deals, and fast delivery."
};

export default async function PrimePage() {
  const products = await getAllProducts();
  const primeProducts = products.filter((p) => p.isPrime).slice(0, 8);

  return (
    <div>
      <section className="bg-gradient-to-r from-sky-900 via-blue-900 to-slate-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-amazon">
          <p className="text-2xl font-bold text-amazon-gold">prime</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Enjoy faster delivery and exclusive benefits</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-200">
            Join Prime for FREE fast delivery, early access to deals, Prime Video, and member-only offers across Amazon.in.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button type="button" className="amazon-btn-primary">
              Start 30-day free trial
            </button>
            <Link href="/search" className="inline-flex h-11 items-center rounded-full border border-white/40 px-6 text-sm font-bold hover:bg-white/10">
              Shop Prime deals
            </Link>
          </div>
        </div>
      </section>

      <section className="amazon-section">
        <h2 className="text-2xl font-bold">Prime Exclusive Deals</h2>
        <div className="mt-6">
          <ProductGrid products={primeProducts} />
        </div>
      </section>
    </div>
  );
}
