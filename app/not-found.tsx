import { PackageSearch } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Page Not Found"
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
      <PackageSearch className="h-16 w-16 text-amazon-orange" />
      <h1 className="mt-6 text-3xl font-black tracking-normal text-slate-950 dark:text-white">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        The page you&apos;re looking for may have been moved or doesn&apos;t exist. Let&apos;s get you back to shopping.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="amazon-btn-primary inline-flex h-11 items-center px-5">
          Go to homepage
        </Link>
        <Link
          href="/search"
          className="inline-flex h-11 items-center rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-800 hover:bg-slate-50 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/5"
        >
          Browse products
        </Link>
      </div>
    </div>
  );
}
