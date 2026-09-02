"use client";

import {
  ChevronDown,
  Globe,
  MapPin,
  Menu,
  Moon,
  Package,
  ShoppingCart,
  Sun,
  X
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { SearchBar } from "@/components/layout/search-bar";
import { useCartStore } from "@/components/providers/cart-store";
import { useDeliveryStore } from "@/components/providers/delivery-store";
import { categories } from "@/lib/data";

export function Navbar() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const cartCount = useCartStore((s) => s.count());
  const { pincode, city, setLocation } = useDeliveryStore();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [lang, setLang] = useState("EN");

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 bg-amazon-navy text-white shadow-sticky transition-shadow">
      <div className="mx-auto flex max-w-[1500px] items-center gap-2 px-2 py-2.5 sm:gap-3 sm:px-3">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-sm p-2 hover:outline hover:outline-1 hover:outline-white/80 lg:hidden"
          aria-label="Open menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="flex shrink-0 items-end border border-transparent px-1 py-1 hover:border-white" aria-label="Amazon.in home">
          <span className="text-2xl font-extrabold tracking-tight sm:text-[28px]">amazon</span>
          <span className="mb-1 text-xs font-bold text-amazon-gold sm:text-sm">.in</span>
        </Link>

        <div className="relative hidden lg:block">
          <button
            type="button"
            onClick={() => setLocationOpen((v) => !v)}
            className="flex max-w-[140px] flex-col rounded-sm border border-transparent px-1 py-0.5 text-left hover:border-white"
          >
            <span className="flex items-center gap-0.5 text-[11px] text-slate-300">
              <MapPin className="h-3 w-3" />
              Deliver to
            </span>
            <span className="truncate text-sm font-bold">{city} {pincode}</span>
          </button>
          {locationOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-md border border-slate-200 bg-white p-4 text-slate-900 shadow-dropdown">
              <p className="text-sm font-bold">Choose your location</p>
              <p className="mt-1 text-xs text-slate-600">Delivery options may vary</p>
              <div className="mt-3 space-y-1">
                {[
                  { pincode: "110001", city: "New Delhi" },
                  { pincode: "400001", city: "Mumbai" },
                  { pincode: "560001", city: "Bengaluru" },
                  { pincode: "600001", city: "Chennai" }
                ].map((loc) => (
                  <button
                    key={loc.pincode}
                    type="button"
                    className="block w-full rounded px-2 py-2 text-left text-sm hover:bg-amber-50"
                    onClick={() => {
                      setLocation(loc.pincode, loc.city);
                      setLocationOpen(false);
                    }}
                  >
                    {loc.city} — {loc.pincode}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <SearchBar className="hidden md:flex" initialQuery={searchParams.get("q") ?? ""} />

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          <button
            type="button"
            onClick={() => setLang((l) => (l === "EN" ? "HI" : "EN"))}
            className="hidden items-center gap-0.5 rounded-sm border border-transparent px-2 py-1 text-xs hover:border-white lg:flex"
            aria-label="Change language"
          >
            <Globe className="h-4 w-4" />
            <span className="font-bold">{lang}</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden rounded-sm border border-transparent p-2 hover:border-white sm:inline-flex"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="group relative hidden lg:block">
            <Link href={session ? "/dashboard/profile" : "/login"} className="block rounded-sm border border-transparent px-1 py-0.5 hover:border-white">
              <span className="text-[11px] text-slate-300">Hello, {session?.user?.name?.split(" ")[0] ?? "sign in"}</span>
              <span className="flex items-center gap-0.5 text-sm font-bold">
                Account & Lists
                <ChevronDown className="h-3 w-3" />
              </span>
            </Link>
            <div className="invisible absolute right-0 top-full w-52 translate-y-1 rounded-md border border-slate-200 bg-white p-2 text-slate-900 opacity-0 shadow-dropdown transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-white/10 dark:bg-slate-900 dark:text-white">
              {session ? (
                <>
                  <Link className="block rounded px-3 py-2 text-sm hover:bg-amber-50 dark:hover:bg-white/10" href="/dashboard/profile">Your Account</Link>
                  <Link className="block rounded px-3 py-2 text-sm hover:bg-amber-50 dark:hover:bg-white/10" href="/dashboard/orders">Your Orders</Link>
                  <Link className="block rounded px-3 py-2 text-sm hover:bg-amber-50 dark:hover:bg-white/10" href="/dashboard/wishlist">Wishlist</Link>
                  <Link className="block rounded px-3 py-2 text-sm hover:bg-amber-50 dark:hover:bg-white/10" href="/prime">Prime</Link>
                  {session.user.role === "ADMIN" && (
                    <Link className="block rounded px-3 py-2 text-sm hover:bg-amber-50 dark:hover:bg-white/10" href="/admin">Admin</Link>
                  )}
                  <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-amber-50 dark:hover:bg-white/10">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block rounded bg-amazon-orange px-3 py-2 text-center text-sm font-bold text-slate-950 hover:bg-[#f5a742]">Sign in</Link>
                  <p className="mt-2 px-3 text-xs text-slate-600 dark:text-slate-400">New customer? <Link href="/signup" className="text-amazon-teal hover:underline">Start here</Link></p>
                </>
              )}
            </div>
          </div>

          <Link href="/dashboard/orders" className="hidden rounded-sm border border-transparent px-1 py-0.5 hover:border-white lg:block">
            <span className="text-[11px] text-slate-300">Returns</span>
            <span className="block text-sm font-bold">& Orders</span>
          </Link>

          <Link href="/prime" className="hidden rounded-sm border border-transparent px-1 py-0.5 hover:border-white xl:block">
            <span className="text-sm font-bold text-amazon-gold">prime</span>
          </Link>

          <Link
            href="/cart"
            className="relative flex items-end gap-1 rounded-sm border border-transparent px-1 py-0.5 hover:border-white"
            aria-label={`Cart, ${cartCount} items`}
          >
            <div className="relative">
              <ShoppingCart className="h-8 w-8" />
              <span className="absolute -top-1 left-4 min-w-[18px] rounded-full bg-amazon-orange px-1 text-center text-xs font-bold text-slate-950">
                {cartCount}
              </span>
            </div>
            <span className="hidden pb-1 text-sm font-bold sm:inline">Cart</span>
          </Link>
        </div>
      </div>

      <div className="px-2 pb-2 md:hidden">
        <SearchBar compact initialQuery={searchParams.get("q") ?? ""} />
      </div>

      <div className="hidden bg-amazon-blue lg:block">
        <nav className="mx-auto flex max-w-[1500px] items-center gap-0 px-2 text-[13px]">
          <Link href="/search" className="flex shrink-0 items-center gap-1 rounded-sm border border-transparent px-2 py-1.5 font-bold hover:border-white">
            <Menu className="h-4 w-4" />
            All
          </Link>
          {categories.slice(0, 9).map((category) => (
            <Link
              key={category}
              href={`/search?category=${encodeURIComponent(category)}`}
              className="shrink-0 rounded-sm border border-transparent px-2 py-1.5 hover:border-white"
            >
              {category}
            </Link>
          ))}
          <Link href="/search?deal=flash" className="shrink-0 rounded-sm border border-transparent px-2 py-1.5 text-amazon-gold hover:border-white">
            Today&apos;s Deals
          </Link>
          <Link href="/prime" className="shrink-0 rounded-sm border border-transparent px-2 py-1.5 hover:border-white">
            Prime
          </Link>
          <Link href="/compare" className="shrink-0 rounded-sm border border-transparent px-2 py-1.5 hover:border-white">
            Compare
          </Link>
        </nav>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-amazon-navy p-4 lg:hidden">
          <div className="mb-3 flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            Deliver to {city} {pincode}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link href="/search" className="rounded bg-white/10 px-3 py-2" onClick={() => setMenuOpen(false)}>All categories</Link>
            <Link href="/search?deal=flash" className="rounded bg-white/10 px-3 py-2" onClick={() => setMenuOpen(false)}>Deals</Link>
            {session ? (
              <>
                <Link href="/dashboard/profile" className="rounded bg-white/10 px-3 py-2">Account</Link>
                <Link href="/dashboard/orders" className="rounded bg-white/10 px-3 py-2">Orders</Link>
                <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="rounded bg-white/10 px-3 py-2 text-left">
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login" className="col-span-2 rounded bg-amazon-orange px-3 py-2 text-center font-bold text-slate-950">
                Sign in
              </Link>
            )}
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-2 rounded bg-white/10 px-3 py-2"
            >
              {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              Theme
            </button>
            <Link href="/prime" className="flex items-center gap-2 rounded bg-white/10 px-3 py-2 text-amazon-gold">
              <Package className="h-4 w-4" />
              Prime
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
