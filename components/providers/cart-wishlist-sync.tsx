"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

import { hydrateCartFromServer, setCartSyncUser } from "@/components/providers/cart-store";
import { hydrateWishlistFromServer, setWishlistSyncUser } from "@/components/providers/wishlist-store";

/** Bridges the guest (localStorage) cart/wishlist stores to the database once a session exists. */
export function CartWishlistSync() {
  const { data: session, status } = useSession();
  const hydratedFor = useRef<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) {
      setCartSyncUser(null);
      setWishlistSyncUser(null);
      hydratedFor.current = null;
      return;
    }

    const userId = session.user.id;

    if (hydratedFor.current === userId) {
      setCartSyncUser(userId);
      setWishlistSyncUser(userId);
      return;
    }

    hydratedFor.current = userId;
    void hydrateCartFromServer(userId);
    void hydrateWishlistFromServer(userId);
  }, [status, session?.user?.id]);

  return null;
}
