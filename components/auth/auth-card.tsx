"use client";

import { motion } from "framer-motion";
import { Chrome, Eye, EyeOff, Loader2, Lock, Mail, UserRound } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function AuthCard({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    try {
      if (mode === "signup") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: String(formData.get("name")),
            email,
            password
          })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message ?? "Unable to create account.");
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl
      });

      if (result?.error) {
        throw new Error("Invalid email or password.");
      }

      toast.success(mode === "signup" ? "Account created" : "Welcome back");
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-glow dark:border-white/10 dark:bg-slate-900"
    >
      <div className="mb-6 text-center">
        <Link href="/" className="inline-flex items-end text-3xl font-black text-slate-950 dark:text-white">
          amazon<span className="text-amazon-orange">.in</span>
        </Link>
        <h1 className="mt-5 text-2xl font-black tracking-normal text-slate-950 dark:text-white">
          {mode === "signup" ? "Create account" : "Sign in"}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {mode === "signup" ? "Start shopping with fast checkout and saved addresses." : "Access orders, wishlist, cart sync, and admin tools."}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => signIn("google", { callbackUrl })}
      >
        <Chrome className="h-4 w-4" />
        Continue with Google
      </Button>

      <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
        or
        <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        {mode === "signup" && (
          <label className="block">
            <span className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-200">Your name</span>
            <span className="flex items-center gap-2 rounded-md border border-slate-200 px-3 focus-within:border-amazon-orange dark:border-white/10">
              <UserRound className="h-4 w-4 text-slate-400" />
              <input name="name" required minLength={2} className="h-11 flex-1 bg-transparent outline-none" />
            </span>
          </label>
        )}

        <label className="block">
          <span className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-200">Email</span>
          <span className="flex items-center gap-2 rounded-md border border-slate-200 px-3 focus-within:border-amazon-orange dark:border-white/10">
            <Mail className="h-4 w-4 text-slate-400" />
            <input name="email" type="email" required className="h-11 flex-1 bg-transparent outline-none" />
          </span>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-200">Password</span>
          <span className="flex items-center gap-2 rounded-md border border-slate-200 px-3 focus-within:border-amazon-orange dark:border-white/10">
            <Lock className="h-4 w-4 text-slate-400" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              minLength={6}
              required
              className="h-11 flex-1 bg-transparent outline-none"
            />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility">
              {showPassword ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
            </button>
          </span>
        </label>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "signup" ? "Create account" : "Sign in"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
        {mode === "signup" ? "Already have an account?" : "New to Amazon?"}{" "}
        <Link href={`${mode === "signup" ? "/login" : "/signup"}?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-bold text-amazon-teal hover:text-amazon-orange">
          {mode === "signup" ? "Sign in" : "Create your account"}
        </Link>
      </p>
    </motion.div>
  );
}
