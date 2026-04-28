import { jest } from '@jest/globals';
import { db } from '../config/database';

// Mock database connection
jest.mock('../config/database', () => ({
  db: {
    ...jest.requireActual('../config/database').db,
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  },
}));

beforeAll(async () => {
  await db.$connect();
});

afterAll(async () => {
  await db.$disconnect();
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});