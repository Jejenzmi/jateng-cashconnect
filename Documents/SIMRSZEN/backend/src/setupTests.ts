// Setup testing utilities
import { jest } from '@jest/globals';

// Mock environment variables for tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.DB_URL = process.env.DB_URL || 'postgresql://test:test@localhost:5432/test_db';
process.env.SATUSEHAT_CLIENT_ID = process.env.SATUSEHAT_CLIENT_ID || 'test-client-id';
process.env.SATUSEHAT_CLIENT_SECRET = process.env.SATUSEHAT_CLIENT_SECRET || 'test-client-secret';

// Mock Prisma client for testing
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    satuSehatConfig: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    // Tambahkan model lain sesuai kebutuhan
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});