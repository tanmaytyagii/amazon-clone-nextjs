import { Star, X } from "lucide-react";
import Link from "next/link";

import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { SearchParams } from "@/types";

const ratingOptions = [4.5, 4, 3, 2, 1];

export function SearchSidebar({ params }: { params: SearchParams }) {
  const activeCategory = params.category && params.category !== "All" ? params.category : null;
  const activeRating = params.rating ? Number(params.rating) : null;

  function withParams(overrides: Partial<Record<"category" | "rating", string | undefined>>) {
    const next = new URLSearchParams();
    if (params.q) next.set("q", params.q);
    if (params.sort) next.set("sort", params.sort);

    const category = "category" in overrides ? overrides.category : params.category;
    const rating = "rating" in overrides ? overrides.rating : params.rating;
    if (category && category !== "All") next.set("category", category);
    if (rating) next.set("rating", rating);

    const query = next.toString();
    return `/search${query ? `?${query}` : ""}`;
  }

  const hasFilters = Boolean(activeCategory || activeRating);

  return (
    <aside className="w-full shrink-0 lg:w-56">
      <div className="rounded border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-950 dark:text-white">Filters</h2>
          {hasFilters && (
            <Link href="/search" className="flex items-center gap-1 text-xs font-bold text-amazon-teal hover:underline">
              <X className="h-3 w-3" />
              Clear
            </Link>
          )}
        </div>

        <div className="border-t border-slate-100 py-3 dark:border-white/10">
          <h3 className="mb-2 text-sm font-bold text-slate-950 dark:text-white">Category</h3>
          <ul className="space-y-1.5 text-sm">
            <li>
              <Link
                href={withParams({ category: undefined })}
                className={cn(
                  "block text-slate-700 hover:text-amazon-orange hover:underline dark:text-slate-300",
                  !activeCategory && "font-bold text-slate-950 dark:text-white"
                )}
              >
                All categories
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={withParams({ category })}
                  className={cn(
                    "block text-slate-700 hover:text-amazon-orange hover:underline dark:text-slate-300",
                    activeCategory === category && "font-bold text-slate-950 dark:text-white"
                  )}
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-slate-100 py-3 dark:border-white/10">
          <h3 className="mb-2 text-sm font-bold text-slate-950 dark:text-white">Customer Review</h3>
          <ul className="space-y-1.5">
            {ratingOptions.map((rating) => (
              <li key={rating}>
                <Link
                  href={withParams({ rating: activeRating === rating ? undefined : String(rating) })}
                  className={cn(
                    "flex items-center gap-1.5 rounded px-1 py-0.5 text-sm hover:bg-amber-50 dark:hover:bg-white/5",
                    activeRating === rating && "bg-amber-50 dark:bg-white/10"
                  )}
                >
                  <span className="flex items-center">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={cn(
                          "h-3.5 w-3.5",
                          index + 1 <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
                        )}
                      />
                    ))}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">& Up</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
