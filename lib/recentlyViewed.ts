import type { Product } from "@/types";

export type RecentlyViewedEntry = {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
};

export const getRecentlyViewed = (): RecentlyViewedEntry[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("recentlyViewed") ?? "[]") as RecentlyViewedEntry[];
  } catch {
    return [];
  }
};

export const addRecentlyViewed = (product: Product) => {
  if (typeof window === "undefined") return;

  let items = getRecentlyViewed();

  items = items.filter((item) => item.id !== product.id);

  items.unshift({
    id: product.id,
    slug: product.slug,
    title: product.title,
    image: product.images?.[0],
    price: product.price
  });

  items = items.slice(0, 5);

  localStorage.setItem("recentlyViewed", JSON.stringify(items));
};
