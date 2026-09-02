"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getRecentlyViewed, type RecentlyViewedEntry } from "@/lib/recentlyViewed";
import { formatPrice } from "@/lib/utils";

export default function RecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedEntry[]>([]);

  useEffect(() => {
    setItems(getRecentlyViewed());
  }, []);

  if (!items.length) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-4">Recently Viewed</h2>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {items.map((item) => (
          <Link key={item.id} href={`/products/${item.slug}`}>
            <div className="group rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-amber-200 hover:shadow-soft dark:border-white/10 dark:bg-slate-900 cursor-pointer">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <p className="text-sm font-semibold mt-3 line-clamp-2 text-slate-950 dark:text-white group-hover:text-amazon-teal">{item.title}</p>
              <p className="font-black mt-2 text-slate-950 dark:text-white">{formatPrice(item.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
