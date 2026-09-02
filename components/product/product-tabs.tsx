"use client";

import { useState } from "react";

import { ProductReviews } from "@/components/product/product-reviews";
import type { Product, ReviewItem } from "@/types";

const tabs = ["Description", "Specifications", "Reviews", "Q&A"] as const;

export function ProductTabs({ product, reviews }: { product: Product; reviews: ReviewItem[] }) {
  const [active, setActive] = useState<(typeof tabs)[number]>("Description");

  const specs: Record<string, string> = product.specifications ?? {
    Brand: product.brand,
    Category: product.category,
    "Item model": product.slug,
    Warranty: product.warranty ?? "1 Year Manufacturer Warranty",
    Seller: product.seller ?? "Amazon Fulfilment India"
  };

  return (
    <section>
      <div className="flex gap-0 overflow-x-auto border-b border-slate-200 dark:border-white/10 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-bold transition ${
              active === tab
                ? "border-amazon-orange text-amazon-orange"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {active === "Description" && (
          <div className="prose max-w-none text-slate-700 dark:text-slate-300">
            <p className="leading-7">{product.description}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5">
              {product.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        )}

        {active === "Specifications" && (
          <table className="w-full max-w-2xl text-sm">
            <tbody>
              {Object.entries(specs).map(([key, value]) => (
                <tr key={key} className="border-b border-slate-100 dark:border-white/10">
                  <th className="py-3 pr-4 text-left font-bold text-slate-600 dark:text-slate-400">{key}</th>
                  <td className="py-3 text-slate-900 dark:text-white">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {active === "Reviews" && <ProductReviews product={product} initialReviews={reviews} />}

        {active === "Q&A" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">Have a question? Search for answers.</p>
            {[
              { q: "Is this product genuine?", a: "Yes, sold by authorized sellers with invoice." },
              { q: "What is the return policy?", a: "7-30 day return depending on category. See product page." },
              { q: "Does Prime apply?", a: product.isPrime ? "Yes, eligible for Prime FREE delivery." : "Standard delivery applies." }
            ].map((item) => (
              <article key={item.q} className="rounded border border-slate-200 p-4 dark:border-white/10">
                <p className="font-bold text-slate-950 dark:text-white">Q: {item.q}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">A: {item.a}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
