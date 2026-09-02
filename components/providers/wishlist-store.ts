"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { serializeProduct } from "@/lib/serialize-product";
import type { Product } from "@/types";

type WishlistState = {
  items: Product[];
  toggle: (product: Product) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
};

let syncUserId: string | null = null;

export function setWishlistSyncUser(userId: string | null) {
  syncUserId = userId;
}

async function syncAdd(productId: string) {
  if (!syncUserId) return;
  try {
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId })
    });
  } catch {
    // best-effort sync
  }
}

async function syncRemove(productId: string) {
  if (!syncUserId) return;
  try {
    await fetch("/api/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId })
    });
  } catch {
    // ignore network errors
  }
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const exists = get().items.some((item) => item.id === product.id);
        if (exists) {
          set({ items: get().items.filter((item) => item.id !== product.id) });
          void syncRemove(product.id);
          return;
        }
        set({ items: [...get().items, product] });
        void syncAdd(product.id);
      },
      remove: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
        void syncRemove(productId);
      },
      has: (productId) => get().items.some((item) => item.id === productId)
    }),
    { name: "amazon-india-wishlist" }
  )
);

type ServerWishlistRow = { productId: string; product: Parameters<typeof serializeProduct>[0] };

/** Called on sign-in: merges the guest wishlist already in localStorage with the user's saved wishlist. */
export async function hydrateWishlistFromServer(userId: string) {
  try {
    const response = await fetch("/api/wishlist");
    if (!response.ok) {
      setWishlistSyncUser(userId);
      return;
    }

    const data = (await response.json()) as { items: ServerWishlistRow[] };
    const serverItems = data.items.map((row) => serializeProduct(row.product));

    const localItems = useWishlistStore.getState().items;
    const merged = new Map<string, Product>();
    for (const product of serverItems) merged.set(product.id, product);
    for (const product of localItems) if (!merged.has(product.id)) merged.set(product.id, product);

    const mergedItems = Array.from(merged.values());
    useWishlistStore.setState({ items: mergedItems });
    setWishlistSyncUser(userId);

    const localOnly = mergedItems.filter((product) => !serverItems.some((item) => item.id === product.id));
    await Promise.all(localOnly.map((product) => syncAdd(product.id)));
  } catch {
    setWishlistSyncUser(userId);
  }
}
