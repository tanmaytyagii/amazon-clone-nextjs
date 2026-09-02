import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Product } from "@/types";

export function ProductShowcase({
  title,
  subtitle,
  products,
  href
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  href?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1500px] px-3 sm:px-4">
      <div className="rounded border border-slate-200 bg-white p-4 shadow-card dark:border-white/10 dark:bg-slate-900 sm:p-5">
        <SectionHeading title={title} subtitle={subtitle} href={href} />
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
