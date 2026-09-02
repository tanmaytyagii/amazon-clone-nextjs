"use client";

import { useEffect, useRef } from "react";

import { useCartStore } from "@/components/providers/cart-store";

/** Order was just placed — the cart it was built from should no longer show as pending. */
export function ClearCartOnSuccess() {
  const clearCart = useCartStore((s) => s.clearCart);
  const cleared = useRef(false);

  useEffect(() => {
    if (cleared.current) return;
    cleared.current = true;
    clearCart();
  }, [clearCart]);

  return null;
}
