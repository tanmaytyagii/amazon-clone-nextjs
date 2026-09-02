"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { serializeProduct } from "@/lib/serialize-product";
import type { CartItem, Product } from "@/types";

type CartState = {
  items: CartItem[];
  savedItems: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  moveToWishlist: (productId: string) => void;
  applyCoupon: (code: string, discount: number) => void;
  clearCoupon: () => void;
  clearCart: () => void;
  subtotal: () => number;
  count: () => number;
};

let syncUserId: string | null = null;

export function setCartSyncUser(userId: string | null) {
  syncUserId = userId;
}

async function syncUpsert(productId: string, quantity: number) {
  if (!syncUserId) return;
  try {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity })
    });
  } catch {
    // best-effort sync; local state remains the source of truth for the UI
  }
}

async function syncRemove(productId: string) {
  if (!syncUserId) return;
  try {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId })
    });
  } catch {
    // ignore network errors
  }
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
      couponCode: null,
      couponDiscount: 0,
      addItem: (product, quantity = 1) => {
        const saved = get().savedItems.find((item) => item.product.id === product.id);
        if (saved) {
          const nextQuantity = Math.min(saved.quantity + quantity, 20);
          set({
            savedItems: get().savedItems.filter((item) => item.product.id !== product.id),
            items: [...get().items, { product, quantity: nextQuantity }]
          });
          void syncUpsert(product.id, nextQuantity);
          return;
        }

        const items = get().items;
        const current = items.find((item) => item.product.id === product.id);

        if (current) {
          const nextQuantity = Math.min(current.quantity + quantity, 20);
          set({
            items: items.map((item) =>
              item.product.id === product.id ? { ...item, quantity: nextQuantity } : item
            )
          });
          void syncUpsert(product.id, nextQuantity);
          return;
        }

        set({ items: [...items, { product, quantity }] });
        void syncUpsert(product.id, quantity);
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId)
        });
        void syncRemove(productId);
      },
      updateQuantity: (productId, quantity) => {
        const clamped = Math.max(1, Math.min(quantity, 20));
        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity: clamped } : item
          )
        });
        void syncUpsert(productId, clamped);
      },
      saveForLater: (productId) => {
        const item = get().items.find((i) => i.product.id === productId);
        if (!item) return;
        set({
          items: get().items.filter((i) => i.product.id !== productId),
          savedItems: [...get().savedItems.filter((i) => i.product.id !== productId), item]
        });
        void syncRemove(productId);
      },
      moveToCart: (productId) => {
        const item = get().savedItems.find((i) => i.product.id === productId);
        if (!item) return;
        get().addItem(item.product, item.quantity);
        set({ savedItems: get().savedItems.filter((i) => i.product.id !== productId) });
      },
      moveToWishlist: (productId) => {
        set({
          items: get().items.filter((i) => i.product.id !== productId),
          savedItems: get().savedItems.filter((i) => i.product.id !== productId)
        });
        void syncRemove(productId);
      },
      applyCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),
      clearCoupon: () => set({ couponCode: null, couponDiscount: 0 }),
      clearCart: () => {
        const productIds = get().items.map((item) => item.product.id);
        set({ items: [], couponCode: null, couponDiscount: 0 });
        productIds.forEach((productId) => void syncRemove(productId));
      },
      subtotal: () => get().items.reduce((total, item) => total + item.product.price * item.quantity, 0),
      count: () => get().items.reduce((total, item) => total + item.quantity, 0)
    }),
    {
      name: "amazon-india-cart"
    }
  )
);

type ServerCartRow = { productId: string; quantity: number; product: Parameters<typeof serializeProduct>[0] };

/** Called on sign-in: merges the guest cart already in localStorage with the user's saved cart. */
export async function hydrateCartFromServer(userId: string) {
  try {
    const response = await fetch("/api/cart");
    if (!response.ok) {
      setCartSyncUser(userId);
      return;
    }

    const data = (await response.json()) as { items: ServerCartRow[] };
    const serverItems: CartItem[] = data.items.map((row) => ({
      product: serializeProduct(row.product),
      quantity: row.quantity
    }));

    const localItems = useCartStore.getState().items;
    const merged = new Map<string, CartItem>();
    for (const item of serverItems) merged.set(item.product.id, item);
    for (const item of localItems) {
      const existing = merged.get(item.product.id);
      merged.set(item.product.id, existing
        ? { product: existing.product, quantity: Math.min(20, existing.quantity + item.quantity) }
        : item);
    }

    const mergedItems = Array.from(merged.values());
    useCartStore.setState({ items: mergedItems });
    setCartSyncUser(userId);

    await Promise.all(
      mergedItems
        .filter((item) => {
          const serverItem = serverItems.find((s) => s.product.id === item.product.id);
          return !serverItem || serverItem.quantity !== item.quantity;
        })
        .map((item) => syncUpsert(item.product.id, item.quantity))
    );
  } catch {
    setCartSyncUser(userId);
  }
}
