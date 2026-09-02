"use client";

import { Star, ThumbsUp } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Rating } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product, ReviewItem } from "@/types";

type SortKey = "helpful" | "recent" | "rating-high" | "rating-low";

export function ProductReviews({ product, initialReviews }: { product: Product; initialReviews: ReviewItem[] }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [sort, setSort] = useState<SortKey>("helpful");
  const [filter, setFilter] = useState<number | "all">("all");
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);

  let filtered = [...reviews];
  if (filter !== "all") filtered = filtered.filter((r) => r.rating === filter);

  filtered.sort((a, b) => {
    switch (sort) {
      case "rating-high":
        return b.rating - a.rating;
      case "rating-low":
        return a.rating - b.rating;
      case "recent":
        return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
      default:
        return (b.helpfulVotes ?? 0) - (a.helpfulVotes ?? 0);
    }
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session?.user) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();
    const comment = String(formData.get("comment") ?? "").trim();

    setSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, rating, title, comment })
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message ?? "Unable to submit review.");
      }

      const saved: ReviewItem = {
        id: data.review.id,
        name: data.review.user?.name ?? session.user.name ?? "You",
        rating: data.review.rating,
        title: data.review.title,
        comment: data.review.comment,
        helpfulVotes: data.review.helpfulVotes,
        verifiedPurchase: data.review.verifiedPurchase,
        createdAt: data.review.createdAt
      };

      setReviews((items) => [saved, ...items.filter((item) => item.id !== saved.id)]);
      setShowForm(false);
      form.reset();
      setRating(5);
      toast.success("Review submitted");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Customer reviews</h3>
          <Rating value={product.rating} count={product.reviewCount} className="mt-1" />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded border border-slate-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
            aria-label="Sort reviews"
          >
            <option value="helpful">Most helpful</option>
            <option value="recent">Most recent</option>
            <option value="rating-high">Highest rating</option>
            <option value="rating-low">Lowest rating</option>
          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="rounded border border-slate-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
            aria-label="Filter by rating"
          >
            <option value="all">All stars</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        {session?.user ? (
          showForm ? (
            <form onSubmit={onSubmit} className="rounded border border-slate-200 p-4 dark:border-white/10">
              <p className="text-sm font-bold">Your rating</p>
              <div className="mt-1 flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} star`}>
                    <Star className={cn("h-6 w-6", value <= rating ? "fill-amazon-orange text-amazon-orange" : "text-slate-300")} />
                  </button>
                ))}
              </div>
              <label className="mt-3 block">
                <span className="mb-1 block text-sm font-bold">Review title</span>
                <input
                  name="title"
                  required
                  minLength={3}
                  maxLength={120}
                  className="h-10 w-full rounded border border-slate-200 px-3 text-sm dark:border-white/10 dark:bg-slate-950"
                />
              </label>
              <label className="mt-3 block">
                <span className="mb-1 block text-sm font-bold">Review</span>
                <textarea
                  name="comment"
                  required
                  minLength={10}
                  maxLength={2000}
                  className="min-h-24 w-full rounded border border-slate-200 p-3 text-sm dark:border-white/10 dark:bg-slate-950"
                />
              </label>
              <div className="mt-3 flex gap-2">
                <Button type="submit" size="sm" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit review"}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(true)}>
              Write a review
            </Button>
          )
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            <Link href="/login" className="amazon-link">
              Sign in
            </Link>{" "}
            to write a review.
          </p>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          No reviews yet for this product. Be the first to share your experience.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((review) => (
            <article key={review.id} className="rounded border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <Rating value={review.rating} />
                {review.verifiedPurchase && (
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amazon-orange dark:bg-white/10">
                    Verified Purchase
                  </span>
                )}
              </div>
              <h4 className="mt-2 font-bold">{review.title}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{review.comment}</p>
              <p className="mt-3 text-xs font-bold text-slate-500">{review.name}</p>
              {review.reply && (
                <p className="mt-3 rounded bg-slate-50 p-3 text-xs text-slate-600 dark:bg-white/5 dark:text-slate-300">
                  <strong>Seller reply:</strong> {review.reply}
                </p>
              )}
              <button
                type="button"
                onClick={() => setVotes((v) => ({ ...v, [review.id]: (v[review.id] ?? 0) + 1 }))}
                className="mt-3 inline-flex items-center gap-1 text-xs text-slate-600 hover:text-amazon-teal"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                Helpful ({(review.helpfulVotes ?? 0) + (votes[review.id] ?? 0)})
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
