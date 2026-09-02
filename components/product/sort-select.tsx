"use client";

import { useRouter, useSearchParams } from "next/navigation";

const options = [
  { value: "", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Avg. Customer Review" },
  { value: "discount", label: "Discount" },
  { value: "newest", label: "Newest Arrivals" }
];

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("sort", value);
    else params.delete("sort");
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  }

  return (
    <label className="flex items-center gap-1.5 text-sm">
      <span className="hidden text-slate-600 dark:text-slate-300 sm:inline">Sort by:</span>
      <select
        value={searchParams.get("sort") ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 rounded border border-slate-300 bg-white px-2 text-sm font-bold text-slate-900 outline-none focus:border-amazon-orange dark:border-white/10 dark:bg-slate-900 dark:text-white"
        aria-label="Sort results"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
