"use client";

import { Heart, Lock, ShoppingCart, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { useCartStore } from "@/components/providers/cart-store";
import { useWishlistStore } from "@/components/providers/wishlist-store";
import type { Product } from "@/types";

export function ProductActions({ product, compact = false }: { product: Product; compact?: boolean }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));

  function addToCart() {
    addItem(product, quantity);
    toast.success("Added to cart", { description: `${quantity} × ${product.title}` });
  }

  const maxQuantity = Math.max(1, Math.min(product.stock, 10));

  return (
    <div className={compact ? "" : "rounded border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900"}>
      {!compact && (
        <>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-950 dark:text-white">
              {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(product.price)}
            </span>
          </div>
          {product.discount > 0 && <p className="mt-0.5 text-sm text-amazon-red">({product.discount}% off)</p>}

          <p className={`mt-3 text-sm font-bold ${product.stock > 0 ? "text-amazon-green" : "text-amazon-red"}`}>
            {product.stock > 0 ? "In stock" : "Out of stock"}
          </p>
        </>
      )}

      {product.stock > 0 && (
        <label className="mt-3 block">
          <span className="text-sm text-slate-600 dark:text-slate-300">Quantity:</span>
          <select
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="ml-2 h-8 rounded border border-slate-300 bg-slate-50 px-2 text-sm outline-none focus:border-amazon-orange dark:border-white/10 dark:bg-slate-800"
          >
            {Array.from({ length: maxQuantity }).map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={addToCart}
          disabled={product.stock <= 0}
          className="flex h-10 items-center justify-center gap-2 rounded-full bg-amazon-gold text-sm font-bold text-slate-950 shadow-sm transition hover:bg-[#f5c078] disabled:pointer-events-none disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
        <Link
          href="/checkout"
          onClick={() => addItem(product, quantity)}
          className="flex h-10 items-center justify-center gap-2 rounded-full bg-amazon-orange text-sm font-bold text-slate-950 shadow-sm transition hover:bg-[#ed8c00]"
        >
          <Zap className="h-4 w-4" />
          Buy Now
        </Link>
        <button
          type="button"
          onClick={() => {
            toggleWishlist(product);
            toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
          }}
          className="flex h-10 items-center justify-center gap-2 rounded-full border border-slate-300 text-sm font-bold text-slate-800 transition hover:bg-slate-50 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/5"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
          {isWishlisted ? "In wishlist" : "Add to Wish List"}
        </button>
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
        <Lock className="h-3.5 w-3.5" />
        Secure transaction
      </p>
    </div>
  );
}
