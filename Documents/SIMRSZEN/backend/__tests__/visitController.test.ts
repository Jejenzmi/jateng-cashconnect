import { Request, Response } from 'express';
import { 
  getAllVisits, 
  getVisitById, 
  createVisit, 
  updateVisit, 
  deleteVisit,
  updateVisitStatus
} from '../src/controllers/visitController';
import prisma from '../src/config/db';
import { Decimal } from '@prisma/client/runtime/library';

// Mock prisma
jest.mock('../src/config/db');

// Definisikan tipe untuk mock Prisma
const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

// Define a type for our mock request
type MockRequest = Partial<Request> & {
  params?: any;
  body?: any;
};

// Mock response object
const createMockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

describe('Visit Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllVisits', () => {
    it('should return all visits', async () => {
      const mockVisits = [
        {
          id: '1',
          patientId: 'patient1',
          patient: {
            id: 'patient1',
            name: 'John Doe',
            nik: '1234567890',
            medicalRecordNumber: 'MRN-001',
          },
          doctorId: 'doctor1',
          doctor: {
            id: 'doctor1',
            fullName: 'Dr. Smith',
            specialization: 'Cardiology',
          },
          roomId: 'room1',
          room: {
            id: 'room1',
            name: 'Cardiology Room 1',
            type: 'Examination',
          },
          visitNumber: 'VIS-20230101-0001',
          visitDate: new Date(),
          chiefComplaint: 'Chest pain',
          diagnosis: 'Angina',
          notes: 'Patient needs rest',
          status: 'completed',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockedPrisma.visit.findMany = jest.fn().mockResolvedValue(mockVisits);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllVisits(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data kunjungan pasien',
        data: mockVisits
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.visit.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllVisits(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data kunjungan pasien',
        error: 'Database error'
      });
    });
  });

  describe('getVisitById', () => {
    it('should return visit by ID', async () => {
      const mockVisit = {
        id: '1',
        patientId: 'patient1',
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890',
          medicalRecordNumber: 'MRN-001',
          phone: '081234567890',
          address: 'Jl. Example No. 123'
        },
        doctorId: 'doctor1',
        doctor: {
          id: 'doctor1',
          fullName: 'Dr. Smith',
          specialization: 'Cardiology',
          phone: '081234567891',
          email: 'dr.smith@example.com'
        },
        roomId: 'room1',
        room: {
          id: 'room1',
          name: 'Cardiology Room 1',
          type: 'Examination',
        },
        visitNumber: 'VIS-20230101-0001',
        visitDate: new Date(),
        chiefComplaint: 'Chest pain',
        diagnosis: 'Angina',
        notes: 'Patient needs rest',
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
        prescriptions: [],
        laboratoryOrders: [],
        radiologyOrders: [],
      };

      mockedPrisma.visit.findUnique = jest.fn().mockResolvedValue(mockVisit);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getVisitById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data kunjungan pasien',
        data: mockVisit
      });
    });

    it('should return 404 if visit not found', async () => {
      mockedPrisma.visit.findUnique = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getVisitById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data kunjungan pasien tidak ditemukan'
      });
    });
  });

  describe('createVisit', () => {
    it('should create a new visit', async () => {
      const mockNewVisit = {
        id: '1',
        patientId: 'patient1',
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890',
          medicalRecordNumber: 'MRN-001',
        },
        doctorId: 'doctor1',
        doctor: {
          id: 'doctor1',
          fullName: 'Dr. Smith',
          specialization: 'Cardiology',
        },
        roomId: 'room1',
        room: {
          id: 'room1',
          name: 'Cardiology Room 1',
          type: 'Examination',
        },
        visitNumber: 'VIS-20230101-0001',
        visitDate: new Date(),
        chiefComplaint: 'Chest pain',
        diagnosis: 'Angina',
        notes: 'Patient needs rest',
        status: 'registered',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        body: {
          patientId: 'patient1',
          doctorId: 'doctor1',
          roomId: 'room1',
          visitDate: new Date().toISOString(),
          chiefComplaint: 'Chest pain',
          diagnosis: 'Angina',
          notes: 'Patient needs rest',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue({
        id: 'patient1',
        name: 'John Doe',
        nik: '1234567890',
        medicalRecordNumber: 'MRN-001',
      });
      
      mockedPrisma.doctor.findUnique = jest.fn().mockResolvedValue({
        id: 'doctor1',
        fullName: 'Dr. Smith',
        specialization: 'Cardiology',
      });
      
      mockedPrisma.room.findUnique = jest.fn().mockResolvedValue({
        id: 'room1',
        name: 'Cardiology Room 1',
        type: 'Examination',
      });
      
      mockedPrisma.visit.findFirst = jest.fn().mockResolvedValue(null);
      mockedPrisma.visit.create = jest.fn().mockResolvedValue(mockNewVisit);

      const res = createMockResponse();

      await createVisit(mockReq as Request, res);

      expect(mockedPrisma.visit.create).toHaveBeenCalledWith({
        data: {
          patientId: 'patient1',
          doctorId: 'doctor1',
          roomId: 'room1',
          visitDate: expect.any(String),
          chiefComplaint: 'Chest pain',
          diagnosis: 'Angina',
          notes: 'Patient needs rest',
          status: 'registered',
          visitNumber: expect.stringMatching(/^VIS-\d{8}-\d{4}$/),
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              nik: true,
              medicalRecordNumber: true,
            }
          },
          doctor: {
            select: {
              id: true,
              fullName: true,
              specialization: true,
            }
          },
          room: {
            select: {
              id: true,
              name: true,
              type: true,
            }
          }
        }
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan kunjungan pasien',
        data: mockNewVisit
      });
    });

    it('should return 404 if patient not found', async () => {
      const mockReq = {
        body: {
          patientId: 'nonexistent',
          doctorId: 'doctor1',
          roomId: 'room1',
          visitDate: new Date().toISOString(),
          chiefComplaint: 'Chest pain',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createVisit(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Pasien tidak ditemukan'
      });
    });

    it('should return 404 if doctor not found', async () => {
      const mockReq = {
        body: {
          patientId: 'patient1',
          doctorId: 'nonexistent',
          roomId: 'room1',
          visitDate: new Date().toISOString(),
          chiefComplaint: 'Chest pain',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue({
        id: 'patient1',
        name: 'John Doe',
        nik: '1234567890',
        medicalRecordNumber: 'MRN-001',
      });
      
      mockedPrisma.doctor.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createVisit(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Dokter tidak ditemukan'
      });
    });

    it('should return 404 if room not found', async () => {
      const mockReq = {
        body: {
          patientId: 'patient1',
          doctorId: 'doctor1',
          roomId: 'nonexistent',
          visitDate: new Date().toISOString(),
          chiefComplaint: 'Chest pain',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue({
        id: 'patient1',
        name: 'John Doe',
        nik: '1234567890',
        medicalRecordNumber: 'MRN-001',
      });
      
      mockedPrisma.doctor.findUnique = jest.fn().mockResolvedValue({
        id: 'doctor1',
        fullName: 'Dr. Smith',
        specialization: 'Cardiology',
      });
      
      mockedPrisma.room.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createVisit(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Ruangan tidak ditemukan'
      });
    });
  });

  describe('updateVisit', () => {
    it('should update an existing visit', async () => {
      const mockExistingVisit = {
        id: '1',
        patientId: 'patient1',
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890',
          medicalRecordNumber: 'MRN-001',
        },
        doctorId: 'doctor1',
        doctor: {
          id: 'doctor1',
          fullName: 'Dr. Smith',
          specialization: 'Cardiology',
        },
        roomId: 'room1',
        room: {
          id: 'room1',
          name: 'Cardiology Room 1',
          type: 'Examination',
        },
        visitNumber: 'VIS-20230101-0001',
        visitDate: new Date(),
        chiefComplaint: 'Chest pain',
        diagnosis: 'Angina',
        notes: 'Patient needs rest',
        status: 'registered',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedVisit = {
        ...mockExistingVisit,
        diagnosis: 'Updated diagnosis',
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          ...mockExistingVisit,
          diagnosis: 'Updated diagnosis',
        }
      } as MockRequest;

      mockedPrisma.visit.findUnique = jest.fn().mockResolvedValue(mockExistingVisit);
      mockedPrisma.visit.update = jest.fn().mockResolvedValue(mockUpdatedVisit);

      const res = createMockResponse();

      await updateVisit(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui kunjungan pasien',
        data: mockUpdatedVisit
      });
    });

    it('should return 404 if visit to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          patientId: 'patient1',
          doctorId: 'doctor1',
          roomId: 'room1',
          visitDate: new Date().toISOString(),
          chiefComplaint: 'Chest pain',
        }
      } as MockRequest;

      mockedPrisma.visit.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateVisit(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data kunjungan pasien tidak ditemukan'
      });
    });
  });

  describe('deleteVisit', () => {
    it('should delete a visit', async () => {
      const mockVisit = {
        id: '1',
        patientId: 'patient1',
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890',
          medicalRecordNumber: 'MRN-001',
        },
        doctorId: 'doctor1',
        doctor: {
          id: 'doctor1',
          fullName: 'Dr. Smith',
          specialization: 'Cardiology',
        },
        roomId: 'room1',
        room: {
          id: 'room1',
          name: 'Cardiology Room 1',
          type: 'Examination',
        },
        visitNumber: 'VIS-20230101-0001',
        visitDate: new Date(),
        chiefComplaint: 'Chest pain',
        diagnosis: 'Angina',
        notes: 'Patient needs rest',
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.visit.findUnique = jest.fn().mockResolvedValue(mockVisit);
      mockedPrisma.visit.delete = jest.fn().mockResolvedValue(mockVisit);

      const res = createMockResponse();

      await deleteVisit(mockReq as Request, res);

      expect(mockedPrisma.visit.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus kunjungan pasien'
      });
    });

    it('should return 404 if visit to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.visit.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await deleteVisit(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data kunjungan pasien tidak ditemukan'
      });
    });
  });

  describe('updateVisitStatus', () => {
    it('should update visit status', async () => {
      const mockVisit = {
        id: '1',
        patientId: 'patient1',
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890',
          medicalRecordNumber: 'MRN-001',
        },
        doctorId: 'doctor1',
        doctor: {
          id: 'doctor1',
          fullName: 'Dr. Smith',
          specialization: 'Cardiology',
        },
        roomId: 'room1',
        room: {
          id: 'room1',
          name: 'Cardiology Room 1',
          type: 'Examination',
        },
        visitNumber: 'VIS-20230101-0001',
        visitDate: new Date(),
        chiefComplaint: 'Chest pain',
        diagnosis: 'Angina',
        notes: 'Patient needs rest',
        status: 'in_progress',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          status: 'in_progress'
        }
      } as MockRequest;

      mockedPrisma.visit.findUnique = jest.fn().mockResolvedValue({
        id: '1',
        patientId: 'patient1',
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890',
          medicalRecordNumber: 'MRN-001',
        },
        doctorId: 'doctor1',
        doctor: {
          id: 'doctor1',
          fullName: 'Dr. Smith',
          specialization: 'Cardiology',
        },
        roomId: 'room1',
        room: {
          id: 'room1',
          name: 'Cardiology Room 1',
          type: 'Examination',
        },
        visitNumber: 'VIS-20230101-0001',
        visitDate: new Date(),
        chiefComplaint: 'Chest pain',
        diagnosis: 'Angina',
        notes: 'Patient needs rest',
        status: 'registered',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockedPrisma.visit.update = jest.fn().mockResolvedValue(mockVisit);

      const res = createMockResponse();

      await updateVisitStatus(mockReq as Request, res);

      expect(mockedPrisma.visit.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          status: 'in_progress',
          startedAt: expect.any(Date),
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              nik: true,
              medicalRecordNumber: true,
            }
          },
          doctor: {
            select: {
              id: true,
              fullName: true,
              specialization: true,
            }
          },
          room: {
            select: {
              id: true,
              name: true,
              type: true,
            }
          }
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui status kunjungan pasien',
        data: mockVisit
      });
    });

    it('should return 400 if invalid status is provided', async () => {
      const mockReq = {
        params: { id: '1' },
        body: {
          status: 'invalid_status'
        }
      } as MockRequest;

      const res = createMockResponse();

      await updateVisitStatus(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Status kunjungan tidak valid'
      });
    });

    it('should return 404 if visit to update status is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          status: 'completed'
        }
      } as MockRequest;

      mockedPrisma.visit.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateVisitStatus(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data kunjungan pasien tidak ditemukan'
      });
    });
  });
});