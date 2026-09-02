"use client";

import { useEffect } from "react";

import { addRecentlyViewed } from "@/lib/recentlyViewed";
import type { Product } from "@/types";

export default function TrackView({ product }: { product: Product }) {
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product]);

  return null;
}
