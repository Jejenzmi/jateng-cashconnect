import request from 'supertest';
import app from '../app';
import { db } from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock database
jest.mock('../config/database', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('Auth Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should login user with valid credentials', async () => {
      const mockUser = {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Test User',
        role: 'ADMIN',
        isActive: true,
      };

      (db.user.findUnique as jest.MockedFunction<any>).mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.username).toBe('testuser');
    });

    it('should return 401 for invalid credentials', async () => {
      (db.user.findUnique as jest.MockedFunction<any>).mockResolvedValue(null);

      await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should return 400 for missing credentials', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const newUser = {
        id: 'user456',
        username: 'newuser',
        email: 'new@example.com',
        password: 'hashed_password',
        fullName: 'New User',
        role: 'USER',
        isActive: true,
      };

      (db.user.create as jest.MockedFunction<any>).mockResolvedValue(newUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123',
          fullName: 'New User',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe('newuser');
    });

    it('should return 400 for missing registration data', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user and blacklist token', async () => {
      const validToken = jwt.sign({ userId: 'user123' }, process.env.JWT_SECRET || 'secret');

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.message).toBe('Successfully logged out');
    });
  });
});