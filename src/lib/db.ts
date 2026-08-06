import { PrismaClient } from "@prisma/client";

// Prevents exhausting the Postgres connection pool during Next.js
// dev-mode hot reloads by reusing a single PrismaClient instance.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
