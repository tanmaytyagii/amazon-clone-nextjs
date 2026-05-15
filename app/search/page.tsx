import Link from "next/link";
import { Suspense } from "react";

import { InfiniteProductGrid } from "@/components/product/infinite-product-grid";
import { SearchControls } from "@/components/product/search-controls";
import Spinner from "@/components/product/spinner";
import { searchProducts } from "@/lib/products";
import type { SearchParams } from "@/types";

type SearchPageProps = {
  searchParams: Promise<SearchParams>;
};

export const metadata = {
  title: "Search Products",
  description: "Search, sort, and filter products across the Amazon India-inspired marketplace."
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const results = searchProducts(params);
  const page = Number(params.page ?? 1);
  const perPage = 8;
  const totalPages = Math.max(1, Math.ceil(results.length / perPage));
  const items = results.slice((page - 1) * perPage, page * perPage);

  function pageHref(nextPage: number) {
    const next = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) next.set(key, String(value));
    });
    next.set("page", String(nextPage));
    return `/search?${next.toString()}`;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-5">
      <div>
        <h1 className="text-3xl font-black tracking-normal text-slate-950 dark:text-white">Search results</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          {results.length} products found{params.q ? ` for "${params.q}"` : ""}.
        </p>
      </div>

      <Suspense fallback={<Spinner />}>
        <SearchControls />
      </Suspense>

      {items.length > 0 ? (
        <Suspense fallback={<Spinner />}>
  <InfiniteProductGrid products={results} batchSize={8} />
</Suspense>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-2xl font-black tracking-normal">No products found</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Try a broader search term or remove a filter.</p>
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        <Link
          href={pageHref(Math.max(1, page - 1))}
          aria-disabled={page <= 1}
          className="rounded-md border border-slate-200 px-4 py-2 text-sm font-bold aria-disabled:pointer-events-none aria-disabled:opacity-40 dark:border-white/10"
        >
          Previous
        </Link>
        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
          Page {page} of {totalPages}
        </span>
        <Link
          href={pageHref(Math.min(totalPages, page + 1))}
          aria-disabled={page >= totalPages}
          className="rounded-md border border-slate-200 px-4 py-2 text-sm font-bold aria-disabled:pointer-events-none aria-disabled:opacity-40 dark:border-white/10"
        >
          Next
        </Link>
      </div>
    </div>
  );
}
