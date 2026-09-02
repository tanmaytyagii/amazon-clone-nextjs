import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function DealShelf({ products, title = "Lightning deals" }: { products: Product[]; title?: string }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1500px] px-3 sm:px-4">
      <div className="rounded border border-slate-200 bg-white p-4 shadow-card dark:border-white/10 dark:bg-slate-900 sm:p-5">
        <SectionHeading title={title} subtitle="Deep, time-limited discounts refreshed regularly." href="/search?sort=discount" />
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {products
            .slice()
            .sort((a, b) => b.discount - a.discount)
            .slice(0, 8)
            .map((product) => (
              <Link
                href={`/products/${product.slug}`}
                key={product.id}
                className="group w-40 shrink-0 overflow-hidden rounded border border-slate-200 bg-white transition hover:border-amazon-orange/60 dark:border-white/10 dark:bg-slate-900 sm:w-48"
              >
                <div className="relative aspect-square bg-slate-50">
                  <Image src={product.images[0]} alt={product.title} fill sizes="200px" className="object-contain p-3 transition group-hover:scale-105" />
                </div>
                <div className="p-3">
                  <Badge tone="deal">{product.discount}% off</Badge>
                  <h3 className="mt-2 line-clamp-2 min-h-9 text-sm font-medium text-slate-950 dark:text-white">{product.title}</h3>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-base font-bold">{formatPrice(product.price)}</span>
                    <span className="text-xs text-slate-500 line-through">{formatPrice(product.mrp)}</span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
