import type { Product } from "@/types";

type DbProductLike = {
  id: string;
  title: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  specifications?: unknown;
  images: string[];
  price: number;
  mrp: number;
  discount: number;
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isPrime: boolean;
  isFeatured: boolean;
  isSponsored?: boolean;
  isFlashDeal?: boolean;
  flashEndsAt?: Date | string | null;
  seller?: string | null;
  warranty?: string | null;
};

export function serializeProduct(product: DbProductLike): Product {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    brand: product.brand,
    category: product.category,
    description: product.description,
    specifications: (product.specifications as Record<string, string> | null | undefined) ?? undefined,
    images: product.images,
    price: product.price,
    mrp: product.mrp,
    discount: product.discount,
    stock: product.stock,
    rating: product.rating,
    reviewCount: product.reviewCount,
    tags: product.tags,
    isPrime: product.isPrime,
    isFeatured: product.isFeatured,
    isSponsored: product.isSponsored ?? false,
    isFlashDeal: product.isFlashDeal ?? false,
    flashEndsAt: product.flashEndsAt ? new Date(product.flashEndsAt).toISOString() : undefined,
    seller: product.seller ?? undefined,
    warranty: product.warranty ?? undefined
  };
}
