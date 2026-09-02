import { PackageSearch } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { ProductGrid } from "@/components/product/product-grid";
import { SearchSidebar } from "@/components/product/search-sidebar";
import { SortSelect } from "@/components/product/sort-select";
import { queryProducts } from "@/lib/products";
import type { SearchParams } from "@/types";

type SearchPageProps = {
  searchParams: Promise<SearchParams>;
};

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search Products",
  description: "Search, sort, and filter products across the Amazon India-inspired marketplace."
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const { items, total, page, totalPages } = await queryProducts(params, 12);

  function pageHref(nextPage: number) {
    const next = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) next.set(key, String(value));
    });
    next.set("page", String(nextPage));
    return `/search?${next.toString()}`;
  }

  return (
    <div className="mx-auto max-w-[1500px] px-3 py-4 sm:px-4">
      <div className="mb-3 rounded border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {total > 0 ? (
            <>
              {total} result{total === 1 ? "" : "s"}
              {params.q ? (
                <>
                  {" "}
                  for <span className="font-bold text-slate-950 dark:text-white">&ldquo;{params.q}&rdquo;</span>
                </>
              ) : null}
              {params.category && params.category !== "All" ? (
                <>
                  {" "}
                  in <span className="font-bold text-slate-950 dark:text-white">{params.category}</span>
                </>
              ) : null}
            </>
          ) : (
            "No results found"
          )}
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <SearchSidebar params={params} />

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex items-center justify-end">
            <Suspense fallback={<div className="h-9 w-40" />}>
              <SortSelect />
            </Suspense>
          </div>

          {items.length > 0 ? (
            <ProductGrid products={items} />
          ) : (
            <div className="rounded border border-slate-200 bg-white p-10 text-center shadow-card dark:border-white/10 dark:bg-slate-900">
              <PackageSearch className="mx-auto h-10 w-10 text-slate-400" />
              <h2 className="mt-3 text-xl font-bold">No products found</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try a broader search term or remove a filter.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href={pageHref(Math.max(1, page - 1))}
                aria-disabled={page <= 1}
                className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-bold aria-disabled:pointer-events-none aria-disabled:opacity-40 dark:border-white/10 dark:bg-slate-900"
              >
                Previous
              </Link>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                Page {page} of {totalPages}
              </span>
              <Link
                href={pageHref(Math.min(totalPages, page + 1))}
                aria-disabled={page >= totalPages}
                className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-bold aria-disabled:pointer-events-none aria-disabled:opacity-40 dark:border-white/10 dark:bg-slate-900"
              >
                Next
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
