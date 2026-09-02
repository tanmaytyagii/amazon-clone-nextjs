"use client";

import { useEffect, useState } from "react";

import { ProductShowcase } from "@/components/home/product-showcase";
import type { Product } from "@/types";

export function RecentlyViewedHome({ products }: { products: Product[] }) {
  const [viewed, setViewed] = useState<Product[]>([]);

  useEffect(() => {
    let slugs: string[] = [];
    try {
      const stored = JSON.parse(localStorage.getItem("recentlyViewed") ?? "[]") as Array<{ slug?: string } | string>;
      slugs = stored.map((entry) => (typeof entry === "string" ? entry : entry.slug ?? "")).filter(Boolean);
    } catch {
      slugs = [];
    }

    setViewed(
      slugs
        .map((slug) => products.find((p) => p.slug === slug))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 5)
    );
  }, [products]);

  if (viewed.length === 0) return null;

  return (
    <ProductShowcase
      title="Recently viewed"
      subtitle="Products you looked at recently."
      products={viewed}
      href="/search"
    />
  );
}
