"use client";

import { Menu, Moon, Search, ShoppingCart, Sun, UserRound, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { useCartStore } from "@/components/providers/cart-store";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/data";

export function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const cartCount = useCartStore((state) => state.count());
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => setMounted(true), []);

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <header className="sticky top-0 z-50 bg-amazon-navy text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 sm:px-5">
        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="rounded-md p-2 hover:bg-white/10 lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="flex shrink-0 items-end gap-1" aria-label="Amazon India clone home">
          <span className="text-2xl font-black tracking-normal">amazon</span>
          <span className="mb-0.5 text-sm font-bold text-amazon-gold">.in</span>
        </Link>

        <form onSubmit={onSearch} className="hidden flex-1 overflow-hidden rounded-md border-2 border-transparent bg-white focus-within:border-amazon-orange md:flex">
          <select
            aria-label="Search category"
            className="w-28 border-r border-slate-200 bg-slate-100 px-2 text-sm font-medium text-slate-700 outline-none"
            onChange={(event) => {
              if (event.target.value !== "All") {
                router.push(`/search?category=${encodeURIComponent(event.target.value)}`);
              }
            }}
          >
            <option>All</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Amazon.in"
            className="min-w-0 flex-1 px-4 text-slate-950 outline-none"
            aria-label="Search products"
          />
          <button type="submit" className="flex w-12 items-center justify-center bg-amazon-gold text-slate-950 hover:bg-[#f5a742]" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
        </form>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden rounded-md p-2 hover:bg-white/10 sm:inline-flex"
            aria-label="Toggle dark mode"
          >
            {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {session?.user ? (
            <div className="group relative hidden sm:block">
              <Link href="/dashboard/orders" className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-white/10">
                <UserRound className="h-5 w-5" />
                <span className="text-xs leading-tight">
                  Hello, {session.user.name?.split(" ")[0] ?? "there"}
                  <strong className="block text-sm">Account</strong>
                </span>
              </Link>
              <div className="invisible absolute right-0 top-full w-44 translate-y-2 rounded-md border border-slate-200 bg-white p-2 text-slate-900 opacity-0 shadow-glow transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-white/10 dark:bg-slate-900 dark:text-white">
                <Link className="block rounded px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-white/10" href="/dashboard/profile">
                  Profile
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link className="block rounded px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-white/10" href="/admin">
                    Admin panel
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="hidden rounded-md px-3 py-2 text-sm font-semibold hover:bg-white/10 sm:block">
              Sign in
            </Link>
          )}

          <Link href="/cart" className="relative flex items-center gap-1 rounded-md px-2 py-2 font-semibold hover:bg-white/10" aria-label="Cart">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-1 left-5 rounded-full bg-amazon-gold px-1.5 text-xs font-black text-slate-950">
              {cartCount}
            </span>
            <span className="hidden sm:inline">Cart</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 bg-amazon-blue">
        <nav className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-4 py-2 text-sm font-semibold sm:px-5">
          <Link href="/search" className="flex shrink-0 items-center gap-1 hover:text-amazon-gold">
            <Menu className="h-4 w-4" />
            All
          </Link>
          {categories.map((category) => (
            <Link key={category} href={`/search?category=${encodeURIComponent(category)}`} className="shrink-0 hover:text-amazon-gold">
              {category}
            </Link>
          ))}
          <Link href="/dashboard/orders" className="shrink-0 hover:text-amazon-gold">
            Orders
          </Link>
          <Link href="/admin" className="shrink-0 hover:text-amazon-gold">
            Sell
          </Link>
        </nav>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-amazon-navy p-4 lg:hidden">
          <form onSubmit={onSearch} className="mb-4 flex overflow-hidden rounded-md bg-white">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Amazon.in"
              className="min-w-0 flex-1 px-4 py-3 text-slate-950 outline-none"
              aria-label="Search products"
            />
            <button type="submit" className="w-12 bg-amazon-gold text-slate-950" aria-label="Search">
              <Search className="mx-auto h-5 w-5" />
            </button>
          </form>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {session?.user ? (
              <>
                <Link href="/dashboard/profile" className="rounded-md bg-white/10 px-3 py-2">
                  Profile
                </Link>
                <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="rounded-md bg-white/10 px-3 py-2 text-left">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="rounded-md bg-white/10 px-3 py-2">
                Sign in
              </Link>
            )}
            <Link href="/dashboard/orders" className="rounded-md bg-white/10 px-3 py-2">
              Your orders
            </Link>
            <Button
              variant="ghost"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="justify-start bg-white/10 text-white hover:bg-white/20"
            >
              {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              Theme
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
