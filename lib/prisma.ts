import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // In development every DB-backed call already has its own try/catch with a
    // concise fallback log (see lib/db-fallback.ts), so Prisma's own per-query
    // "error" event is redundant and, when the DB is unreachable, floods the
    // terminal with a full connection stack trace on every request. Genuinely
    // uncaught errors still surface via Next.js's own dev error reporting.
    log: process.env.NODE_ENV === "development" ? ["warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
