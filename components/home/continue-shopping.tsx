"use client";

import { ProductShowcase } from "@/components/home/product-showcase";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Product } from "@/types";

export function ContinueShoppingClient({ products }: { products: Product[] }) {
  const [recent, , hydrated] = useLocalStorage<string[]>("amazon-continue-shopping", []);

  if (!hydrated || recent.length === 0) return null;

  const matched = recent
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p))
    .slice(0, 5);

  if (matched.length === 0) return null;

  return (
    <ProductShowcase
      title="Continue shopping"
      subtitle="Items you recently viewed."
      products={matched}
      href="/search"
    />
  );
}
