import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const db: PrismaClient = global.prisma || new PrismaClient({
  log: ['info', 'warn', 'error'], // Hapus 'query' untuk menghindari masalah tipe
  errorFormat: 'pretty'
});

if (process.env.NODE_ENV === 'development') {
  global.prisma = db;
}

// Initialize the database connection
export async function initializeDbConnection(): Promise<void> {
  try {
    await db.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}