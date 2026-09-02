"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
      <AlertTriangle className="h-16 w-16 text-amazon-red" />
      <h1 className="mt-6 text-3xl font-black tracking-normal text-slate-950 dark:text-white">
        Something went wrong
      </h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        An unexpected error occurred while loading this page. You can try again or head back to the homepage.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="amazon-btn-primary inline-flex h-11 items-center px-5">
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-800 hover:bg-slate-50 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/5"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  );
}
