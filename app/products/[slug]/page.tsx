import RecentlyViewed from "@/components/product/RecentlyViewed";
import TrackView from "@/components/product/TrackView";
import { ChevronRight, RotateCcw, Share2, ShieldCheck, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeliveryChecker } from "@/components/product/delivery-checker";
import { ProductActions } from "@/components/product/product-actions";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductTabs } from "@/components/product/product-tabs";
import { Badge } from "@/components/ui/badge";
import { PrimeBadge } from "@/components/ui/prime-badge";
import { Rating } from "@/components/ui/rating";
import { SectionHeading } from "@/components/ui/section-heading";
import { getOtherProducts, getProductBySlug, getProductsByBrand, getRelatedProducts } from "@/lib/products";
import { getProductReviews } from "@/lib/reviews";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images.slice(0, 1)
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [related, alsoBought, similar, reviews] = await Promise.all([
    getRelatedProducts(product, 5),
    getOtherProducts(product, 4),
    getProductsByBrand(product, 4),
    getProductReviews(product.id)
  ]);
  const bundle = [product, ...related.slice(0, 2)];

  return (
    <div className="mx-auto max-w-[1500px] px-3 py-3 sm:px-4 sm:py-4">
      <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-amazon-orange hover:underline">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/search?category=${encodeURIComponent(product.category)}`} className="hover:text-amazon-orange hover:underline">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="line-clamp-1 text-slate-700 dark:text-slate-300">{product.title}</span>
      </nav>

      <TrackView product={product} />

      <section className="rounded border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900 sm:p-5">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)_280px] lg:gap-8">
          <ProductGallery images={product.images} title={product.title} />

          <div className="lg:border-l lg:border-slate-100 lg:pl-6 dark:lg:border-white/10">
            <h1 className="text-xl font-normal leading-snug text-slate-950 dark:text-white sm:text-2xl">{product.title}</h1>
            <p className="mt-1 text-sm text-amazon-teal">
              Brand: <Link href={`/search?q=${encodeURIComponent(product.brand)}`} className="hover:text-amazon-orange hover:underline">{product.brand}</Link>
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Rating value={product.rating} count={product.reviewCount} />
              {product.rating >= 4.3 && <Badge tone="success">Amazon&apos;s Choice</Badge>}
            </div>

            <div className="mt-3 border-y border-slate-200 py-3 dark:border-white/10">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-3xl font-medium text-slate-950 dark:text-white">{formatPrice(product.price)}</span>
                {product.discount > 0 && <span className="text-sm text-amazon-red">-{product.discount}%</span>}
              </div>
              <p className="text-sm text-slate-500">M.R.P.: <span className="line-through">{formatPrice(product.mrp)}</span></p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Inclusive of all taxes. EMI from {formatPrice(Math.ceil(product.price / 12))}/mo</p>
              {product.isPrime && <PrimeBadge className="mt-2" />}
            </div>

            <div className="mt-3 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
              <p className="flex items-center gap-2">
                <Truck className="h-4 w-4 shrink-0 text-amazon-teal" />
                <span className="text-amazon-green">FREE delivery</span> available — see options below
              </p>
              <p className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 shrink-0 text-amazon-teal" />
                10 day replacement / easy returns
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-amazon-teal" />
                Secure transaction, encrypted payments
              </p>
            </div>

            <div className="mt-4 lg:hidden">
              <ProductActions product={product} compact />
            </div>

            <button
              type="button"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-amazon-teal hover:text-amazon-orange"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
          </div>

          <div className="hidden space-y-3 lg:block">
            <ProductActions product={product} />
            <div className="rounded border border-slate-200 p-3 text-sm dark:border-white/10">
              <p className="text-slate-600 dark:text-slate-300">
                Ships from and sold by <span className="font-medium text-slate-900 dark:text-white">{product.seller ?? "Amazon Fulfilment India"}</span>
              </p>
              <DeliveryChecker isPrime={product.isPrime} />
              {product.warranty && <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">Warranty: {product.warranty}</p>}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 rounded border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900 sm:p-5">
        <ProductTabs product={product} reviews={reviews} />
      </div>

      {bundle.length > 1 && (
        <section className="mt-6 rounded border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900 sm:p-5">
          <SectionHeading title="Frequently bought together" />
          <div className="flex flex-wrap items-center gap-3">
            {bundle.map((item, i) => (
              <div key={item.id} className="flex items-center gap-3">
                {i > 0 && <span className="text-xl text-slate-300">+</span>}
                <Link href={`/products/${item.slug}`} className="w-36 rounded border border-slate-200 p-2 text-center text-xs hover:border-amazon-orange dark:border-white/10">
                  <span className="line-clamp-2">{item.title}</span>
                  <p className="mt-1.5 font-bold text-slate-950 dark:text-white">{formatPrice(item.price)}</p>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className="mt-6 rounded border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900 sm:p-5">
          <SectionHeading title="Similar products" href={`/search?q=${encodeURIComponent(product.brand)}`} />
          <ProductGrid products={similar} />
        </section>
      )}

      {alsoBought.length > 0 && (
        <section className="mt-6 rounded border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900 sm:p-5">
          <SectionHeading title="Customers also bought" href="/search" />
          <ProductGrid products={alsoBought} />
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-6 rounded border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900 sm:p-5">
          <SectionHeading title="Related products" href={`/search?category=${encodeURIComponent(product.category)}`} />
          <ProductGrid products={related} />
        </section>
      )}

      <RecentlyViewed />
    </div>
  );
}
