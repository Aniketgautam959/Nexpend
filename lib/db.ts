import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  return new PrismaClient();
}

function getClient() {
  const existing = globalForPrisma.prisma;
  // After `prisma generate`, an old cached client may miss new models
  if (existing && 'recurringExpense' in existing) {
    return existing;
  }
  const client = createClient();
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }
  return client;
}

export const db = getClient();
