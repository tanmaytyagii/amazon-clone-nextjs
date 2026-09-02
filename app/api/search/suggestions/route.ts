import { NextResponse } from "next/server";

import { products as staticProducts } from "@/lib/data";
import { logDbFallback } from "@/lib/db-fallback";
import { trendingSearches } from "@/lib/design-tokens";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize-product";
import type { Product } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json({ products: [], queries: trendingSearches.slice(0, 6) });
  }

  let matched: Product[];
  try {
    const items = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { brand: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
          { tags: { has: q } }
        ]
      },
      take: 6
    });
    matched = items.map(serializeProduct);
  } catch {
    logDbFallback("api/search/suggestions");
    const lower = q.toLowerCase();
    matched = staticProducts
      .filter(
        (product) =>
          product.title.toLowerCase().includes(lower) ||
          product.brand.toLowerCase().includes(lower) ||
          product.category.toLowerCase().includes(lower) ||
          product.tags.some((tag) => tag.toLowerCase().includes(lower))
      )
      .slice(0, 6);
  }

  const lower = q.toLowerCase();
  const queries = [
    ...trendingSearches.filter((term) => term.toLowerCase().includes(lower)),
    ...matched
      .map((p) => p.brand)
      .filter((brand, index, arr) => brand.toLowerCase().includes(lower) && arr.indexOf(brand) === index)
  ].slice(0, 6);

  return NextResponse.json({ products: matched, queries });
}
