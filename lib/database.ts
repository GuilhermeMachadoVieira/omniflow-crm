import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Global para evitar múltiplas conexões
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

/**
 * Production-ready Prisma Client
 * - Lazy initialization
 * - Environment-aware
 * - Connection pooling
 */
export function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  const adapter = new PrismaPg({ 
    connectionString: databaseUrl,
    // Connection pooling para production
    poolSize: process.env.NODE_ENV === "production" ? 10 : 1,
  });

  const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    // Error handling robusto
    errorFormat: "pretty",
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }

  return prisma;
}

// Export singleton
export const prisma = getPrismaClient();
