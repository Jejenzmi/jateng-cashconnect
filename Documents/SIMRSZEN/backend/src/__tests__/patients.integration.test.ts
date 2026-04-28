import request from 'supertest';
import app from '../app';
import { db } from '../config/database';
import jwt from 'jsonwebtoken';

// Mock database
jest.mock('../config/database', () => ({
  db: {
    patient: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('Patients Integration Tests', () => {
  let authToken: string;

  beforeAll(() => {
    // Generate a valid JWT token for testing
    authToken = jwt.sign(
      { userId: 'testuser123', role: 'ADMIN' },
      process.env.JWT_SECRET || 'fallback_secret'
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/patients', () => {
    it('should return list of patients for authenticated user', async () => {
      const mockPatients = [
        {
          id: 'pat123',
          nik: '1234567890123456',
          name: 'John Doe',
          dateOfBirth: new Date('1990-01-01'),
          gender: 'MALE',
          phone: '+6281234567890',
          address: 'Jl. Example 123',
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (db.patient.findMany as jest.MockedFunction<any>).mockResolvedValue(mockPatients);

      const response = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('John Doe');
    });

    it('should return 401 for unauthenticated user', async () => {
      await request(app)
        .get('/api/patients')
        .expect(401);
    });
  });

  describe('POST /api/patients', () => {
    it('should create a new patient', async () => {
      const newPatient = {
        nik: '1234567890123457',
        name: 'Jane Smith',
        dateOfBirth: '1995-05-15',
        gender: 'FEMALE',
        phone: '+6281234567891',
        address: 'Jl. Example 456',
      };

      const createdPatient = {
        id: 'pat456',
        ...newPatient,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.patient.create as jest.MockedFunction<any>).mockResolvedValue(createdPatient);

      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newPatient)
        .expect(201);

      expect(response.body.name).toBe('Jane Smith');
      expect(response.body.nik).toBe('1234567890123457');
    });
  });

  describe('GET /api/patients/:id', () => {
    it('should return a specific patient', async () => {
      const mockPatient = {
        id: 'pat123',
        nik: '1234567890123456',
        name: 'John Doe',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'MALE',
        phone: '+6281234567890',
        address: 'Jl. Example 123',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.patient.findUnique as jest.MockedFunction<any>).mockResolvedValue(mockPatient);

      const response = await request(app)
        .get('/api/patients/pat123')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.name).toBe('John Doe');
    });
  });

  describe('PUT /api/patients/:id', () => {
    it('should update a patient', async () => {
      const updatedPatient = {
        id: 'pat123',
        nik: '1234567890123456',
        name: 'John Doe Updated',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'MALE',
        phone: '+6281234567890',
        address: 'Jl. Example 123 Updated',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.patient.update as jest.MockedFunction<any>).mockResolvedValue(updatedPatient);

      const response = await request(app)
        .put('/api/patients/pat123')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'John Doe Updated',
          address: 'Jl. Example 123 Updated',
        })
        .expect(200);

      expect(response.body.name).toBe('John Doe Updated');
    });
  });

  describe('DELETE /api/patients/:id', () => {
    it('should soft delete a patient', async () => {
      const deletedPatient = {
        id: 'pat123',
        nik: '1234567890123456',
        name: 'John Doe',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'MALE',
        phone: '+6281234567890',
        address: 'Jl. Example 123',
        isDeleted: true,
        deletedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.patient.update as jest.MockedFunction<any>).mockResolvedValue(deletedPatient);

      const response = await request(app)
        .delete('/api/patients/pat123')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.isDeleted).toBe(true);
    });
  });
});

