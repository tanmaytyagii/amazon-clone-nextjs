"use client";

import { BarChart2, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useCartStore } from "@/components/providers/cart-store";
import { useCompareStore } from "@/components/providers/compare-store";
import { useWishlistStore } from "@/components/providers/wishlist-store";
import { Button } from "@/components/ui/button";
import { PrimeBadge } from "@/components/ui/prime-badge";
import { Rating } from "@/components/ui/rating";
import { estimateDeliveryDate } from "@/lib/delivery";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  compact?: boolean;
  sponsored?: boolean;
};

export function ProductCard({ product, compact = false, sponsored = false }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const addCompare = useCompareStore((s) => s.add);
  const [adding, setAdding] = useState(false);

  const savings = product.mrp - product.price;
  const inStock = product.stock > 0;
  const deliveryDate = estimateDeliveryDate(undefined, product.isPrime);

  function addToCart() {
    setAdding(true);
    addItem(product, 1);
    toast.success("Added to cart", { description: product.title });
    setTimeout(() => setAdding(false), 400);
  }

  function buyNow() {
    addItem(product, 1);
    router.push("/checkout");
  }

  return (
    <article className="group relative flex h-full flex-col rounded border border-slate-200 bg-white p-2.5 transition hover:border-slate-300 hover:shadow-cardHover dark:border-white/10 dark:bg-slate-900 sm:p-3">
      {(sponsored || product.isSponsored) && (
        <p className="mb-1 text-[10px] text-slate-400">Sponsored</p>
      )}

      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden rounded bg-white">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 18vw"
          className="object-contain p-2 transition duration-300 group-hover:scale-[1.03]"
        />
        {product.discount > 0 && (
          <span className="absolute left-0 top-0 rounded-br bg-amazon-red px-1.5 py-0.5 text-[11px] font-bold text-white">
            -{product.discount}%
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
            toast.success(isWishlisted ? "Removed from wishlist" : "Saved to wishlist");
          }}
          className={cn(
            "absolute right-0 top-0 rounded-bl bg-white/90 p-1.5 opacity-0 shadow-sm transition group-hover:opacity-100 dark:bg-slate-900/90",
            isWishlisted && "text-red-500 opacity-100"
          )}
          aria-label="Wishlist"
        >
          <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
        </button>
      </Link>

      <div className="mt-2 flex flex-1 flex-col">
        <p className="text-[11px] uppercase tracking-wide text-slate-500">{product.brand}</p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-0.5 line-clamp-2 min-h-[2.5em] text-sm leading-snug text-slate-900 hover:text-amazon-orange hover:underline dark:text-white"
        >
          {product.title}
        </Link>
        <Rating value={product.rating} count={product.reviewCount} className="mt-1 text-xs" />

        <div className="mt-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-slate-950 dark:text-white">{formatPrice(product.price)}</span>
            {savings > 0 && <span className="text-xs text-slate-500 line-through">{formatPrice(product.mrp)}</span>}
          </div>
          <div className="mt-1 flex items-center gap-2">
            {product.isPrime && <PrimeBadge />}
            {product.isFlashDeal && <span className="text-[11px] font-bold text-amazon-red">⚡ Deal</span>}
          </div>
          <p className={cn("mt-1 text-xs", inStock ? "text-slate-600 dark:text-slate-300" : "text-amazon-red")}>
            {inStock ? (
              <>
                <span className="text-amazon-green">FREE delivery</span> {deliveryDate}
              </>
            ) : (
              "Currently unavailable"
            )}
          </p>
        </div>

        {!compact && (
          <div className="mt-2 flex items-center gap-1.5 pt-1">
            <Button onClick={addToCart} className="h-8 flex-1 rounded-[4px] px-2 text-xs" disabled={!inStock || adding}>
              <ShoppingCart className="h-3.5 w-3.5" />
              Add to cart
            </Button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const ok = addCompare(product);
                toast[ok ? "success" : "error"](ok ? "Added to compare" : "Compare list full (max 4)");
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border border-slate-200 text-slate-500 hover:border-amazon-orange hover:text-amazon-orange dark:border-white/10"
              aria-label="Compare"
              title="Compare"
            >
              <BarChart2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        {!compact && (
          <button
            type="button"
            onClick={buyNow}
            disabled={!inStock}
            className="mt-1.5 h-8 w-full rounded-[4px] bg-amazon-orange text-xs font-bold text-slate-950 shadow-sm transition hover:bg-[#ed8c00] disabled:pointer-events-none disabled:opacity-50"
          >
            Buy Now
          </button>
        )}
      </div>
    </article>
  );
}
