import type { Metadata } from "next";
import { Suspense } from "react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AiShoppingAssistant } from "@/components/ai/shopping-assistant";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Amazon India Clone | Educational Full-Stack Marketplace",
    template: "%s | Amazon India Clone"
  },
  description:
    "An educational full-stack Amazon.in-inspired e-commerce clone built with Next.js, TypeScript, Tailwind CSS, MongoDB, Prisma, NextAuth, and Stripe. Not affiliated with Amazon.com, Inc.",
  keywords: ["Amazon clone", "Next.js ecommerce", "MongoDB Prisma", "Stripe checkout", "NextAuth", "portfolio project"],
  authors: [{ name: "Tanmay Tyagi" }],
  openGraph: {
    title: "Amazon India Clone",
    description: "An educational full-stack Amazon.in-inspired marketplace with cart, checkout, dashboard, admin panel, and a responsive UI.",
    type: "website",
    images: ["/hero/1.jpg"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <AppProviders>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <main className="flex-1 bg-amazon-page dark:bg-slate-950">{children}</main>
          <Footer />
          <AiShoppingAssistant />
        </AppProviders>
      </body>
    </html>
  );
}
