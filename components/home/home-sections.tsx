import Link from "next/link";

import { DealShelf } from "@/components/home/deal-shelf";
import { ProductShowcase } from "@/components/home/product-showcase";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Product } from "@/types";

type SectionProps = { products: Product[] };

function sliceProducts(products: Product[], filter: (p: Product) => boolean, limit = 5) {
  return products.filter(filter).slice(0, limit);
}

export function TodaysDeals({ products }: SectionProps) {
  const deals = sliceProducts(products, (p) => p.discount >= 10, 10);
  return (
    <ProductShowcase
      title="Today's Deals"
      subtitle="Limited-time offers refreshed throughout the day."
      products={deals}
      href="/search?deal=today"
    />
  );
}

export function LightningDeals({ products }: SectionProps) {
  const deals = sliceProducts(products, (p) => p.discount >= 20, 6);
  return <DealShelf products={deals} title="Lightning Deals" />;
}

export function TrendingProducts({ products }: SectionProps) {
  const trending = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);
  return (
    <ProductShowcase title="Trending now" subtitle="What Indian shoppers are buying this week." products={trending} href="/search?sort=popular" />
  );
}

export function BestSellers({ products }: SectionProps) {
  const best = [...products].sort((a, b) => b.rating - a.rating).slice(0, 5);
  return <ProductShowcase title="Best Sellers" subtitle="Top-rated products across categories." products={best} href="/search?sort=rating" />;
}

export function NewArrivals({ products }: SectionProps) {
  const newest = products.slice(-5).reverse();
  return <ProductShowcase title="New Arrivals" subtitle="Fresh launches and latest additions." products={newest} href="/search?sort=newest" />;
}

export function RecommendedForYou({ products }: SectionProps) {
  const featured = products.slice(0, 5);
  return (
    <ProductShowcase
      title="Recommended for you"
      subtitle="Personalized picks based on browsing patterns."
      products={featured}
      href="/search"
    />
  );
}

export function PrimeExclusiveDeals({ products }: SectionProps) {
  const prime = sliceProducts(products, (p) => p.isPrime && p.discount > 0, 5);

  if (prime.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1500px] px-3 sm:px-4">
      <div className="rounded border border-slate-200 bg-white p-4 shadow-card dark:border-white/10 dark:bg-slate-900 sm:p-5">
        <SectionHeading title="Prime Exclusive Deals" href="/prime" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {prime.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function SponsoredProducts({ products }: SectionProps) {
  const sponsored = sliceProducts(products, (p) => p.isFeatured, 4);

  if (sponsored.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1500px] px-3 sm:px-4">
      <div className="rounded border border-slate-200 bg-white p-4 shadow-card dark:border-white/10 dark:bg-slate-900 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white sm:text-xl">Sponsored products</h2>
          <span className="text-xs text-slate-400">Sponsored</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {sponsored.map((product) => (
            <ProductCard key={product.id} product={product} sponsored />
          ))}
        </div>
      </div>
    </section>
  );
}

export function SeasonalOffers() {
  const offers = [
    { title: "Great Indian Festival", subtitle: "Up to 80% off electronics & fashion", href: "/search?deal=flash", accent: "bg-amazon-red" },
    { title: "Electronics Upgrade", subtitle: "New launches, top brands", href: "/search?category=Electronics", accent: "bg-blue-700" },
    { title: "Home & Kitchen", subtitle: "Refresh your space for less", href: "/search?category=Home%20%26%20Kitchen", accent: "bg-amazon-green" }
  ];

  return (
    <section className="amazon-section">
      <div className="grid gap-4 md:grid-cols-3">
        {offers.map((offer) => (
          <Link
            key={offer.title}
            href={offer.href}
            className="group overflow-hidden rounded border border-slate-200 bg-white shadow-card transition hover:shadow-cardHover dark:border-white/10 dark:bg-slate-900"
          >
            <div className={`h-1.5 w-full ${offer.accent}`} />
            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">{offer.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{offer.subtitle}</p>
              <span className="mt-3 inline-block text-sm font-bold text-amazon-teal group-hover:underline">Shop now</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ContinueShopping({ products }: SectionProps) {
  const picks = products.slice(0, 4);
  return (
    <ProductShowcase title="Continue shopping" subtitle="Pick up where you left off." products={picks} href="/search" />
  );
}
