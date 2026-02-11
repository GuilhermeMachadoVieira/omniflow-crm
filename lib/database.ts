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
  });

  const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    // Error handling robusto
    errorFormat: "pretty",
  });

  globalForPrisma.prisma = prisma;

  return prisma;
}

// Export singleton (lazy) para evitar crash no build quando DATABASE_URL não está disponível.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    return Reflect.get(client as any, prop, receiver);
  },
});
