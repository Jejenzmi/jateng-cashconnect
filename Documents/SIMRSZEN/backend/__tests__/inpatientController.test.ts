import { Request, Response } from 'express';
import { 
  getAllInpatients, 
  getInpatientById, 
  createInpatient, 
  updateInpatient, 
  deleteInpatient,
  transferPatient
} from '../src/controllers/inpatientController';
import prisma from '../src/config/db';

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

describe('Inpatient Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllInpatients', () => {
    it('should return all inpatients', async () => {
      const mockInpatients = [
        {
          id: '1',
          patientId: 'patient1',
          patient: {
            id: 'patient1',
            name: 'John Doe',
            nik: '1234567890',
            medicalRecordNumber: 'MRN-001',
          },
          visitId: 'visit1',
          visit: {
            id: 'visit1',
            visitNumber: 'VIS-20230101-0001',
            chiefComplaint: 'Fever',
          },
          roomId: 'room1',
          room: {
            id: 'room1',
            name: 'ICU 101',
            type: 'Intensive Care',
          },
          bedId: 'bed1',
          bed: {
            id: 'bed1',
            name: 'Bed 1',
            roomNumber: '101A',
          },
          attendingDoctorId: 'doc1',
          attendingDoctor: {
            id: 'doc1',
            fullName: 'Dr. Smith',
            specialization: 'Internal Medicine',
          },
          admissionDate: new Date(),
          admissionReason: 'Severe pneumonia',
          notes: 'Patient requires close monitoring',
          status: 'admitted',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockedPrisma.inpatient.findMany = jest.fn().mockResolvedValue(mockInpatients);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllInpatients(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data rawat inap',
        data: mockInpatients
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.inpatient.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllInpatients(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data rawat inap',
        error: 'Database error'
      });
    });
  });

  describe('getInpatientById', () => {
    it('should return inpatient by ID', async () => {
      const mockInpatient = {
        id: '1',
        patientId: 'patient1',
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890',
          medicalRecordNumber: 'MRN-001',
          phone: '081234567890',
          address: 'Jl. Example 123',
        },
        visitId: 'visit1',
        visit: {
          id: 'visit1',
          visitNumber: 'VIS-20230101-0001',
          chiefComplaint: 'Fever',
        },
        roomId: 'room1',
        room: {
          id: 'room1',
          name: 'ICU 101',
          type: 'Intensive Care',
        },
        bedId: 'bed1',
        bed: {
          id: 'bed1',
          name: 'Bed 1',
          roomNumber: '101A',
        },
        attendingDoctorId: 'doc1',
        attendingDoctor: {
          id: 'doc1',
          fullName: 'Dr. Smith',
          specialization: 'Internal Medicine',
          phone: '081234567891',
          email: 'dr.smith@example.com',
        },
        admissionDate: new Date(),
        admissionReason: 'Severe pneumonia',
        notes: 'Patient requires close monitoring',
        status: 'admitted',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.inpatient.findUnique = jest.fn().mockResolvedValue(mockInpatient);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getInpatientById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data rawat inap',
        data: mockInpatient
      });
    });

    it('should return 404 if inpatient not found', async () => {
      mockedPrisma.inpatient.findUnique = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getInpatientById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data rawat inap tidak ditemukan'
      });
    });
  });

  describe('createInpatient', () => {
    it('should create a new inpatient', async () => {
      const mockNewInpatient = {
        id: '1',
        patientId: 'patient1',
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890',
          medicalRecordNumber: 'MRN-001',
        },
        visitId: 'visit1',
        visit: {
          id: 'visit1',
          visitNumber: 'VIS-20230101-0001',
          chiefComplaint: 'Fever',
        },
        roomId: 'room1',
        room: {
          id: 'room1',
          name: 'ICU 101',
          type: 'Intensive Care',
        },
        bedId: 'bed1',
        bed: {
          id: 'bed1',
          name: 'Bed 1',
          roomNumber: '101A',
        },
        attendingDoctorId: 'doc1',
        attendingDoctor: {
          id: 'doc1',
          fullName: 'Dr. Smith',
          specialization: 'Internal Medicine',
        },
        admissionDate: new Date(),
        admissionReason: 'Severe pneumonia',
        notes: 'Patient requires close monitoring',
        status: 'admitted',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        body: {
          patientId: 'patient1',
          visitId: 'visit1',
          roomId: 'room1',
          bedId: 'bed1',
          attendingDoctorId: 'doc1',
          admissionDate: new Date().toISOString(),
          admissionReason: 'Severe pneumonia',
          notes: 'Patient requires close monitoring',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue({
        id: 'patient1',
        name: 'John Doe',
        nik: '1234567890',
        medicalRecordNumber: 'MRN-001',
      });
      
      mockedPrisma.visit.findUnique = jest.fn().mockResolvedValue({
        id: 'visit1',
        visitNumber: 'VIS-20230101-0001',
        chiefComplaint: 'Fever',
      });
      
      mockedPrisma.room.findUnique = jest.fn().mockResolvedValue({
        id: 'room1',
        name: 'ICU 101',
        type: 'Intensive Care',
      });
      
      mockedPrisma.bed.findUnique = jest.fn().mockResolvedValue({
        id: 'bed1',
        name: 'Bed 1',
        roomNumber: '101A',
        status: 'available',
      });
      
      mockedPrisma.doctor.findUnique = jest.fn().mockResolvedValue({
        id: 'doc1',
        fullName: 'Dr. Smith',
        specialization: 'Internal Medicine',
      });
      
      mockedPrisma.inpatient.findFirst = jest.fn().mockResolvedValue(null);
      mockedPrisma.inpatient.create = jest.fn().mockResolvedValue(mockNewInpatient);
      mockedPrisma.bed.update = jest.fn().mockResolvedValue({});

      const res = createMockResponse();

      await createInpatient(mockReq as Request, res);

      expect(mockedPrisma.inpatient.create).toHaveBeenCalledWith({
        data: {
          patientId: 'patient1',
          visitId: 'visit1',
          roomId: 'room1',
          bedId: 'bed1',
          attendingDoctorId: 'doc1',
          admissionDate: expect.any(Date),
          admissionReason: 'Severe pneumonia',
          notes: 'Patient requires close monitoring',
          status: 'admitted',
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
          visit: {
            select: {
              id: true,
              visitNumber: true,
              chiefComplaint: true,
            }
          },
          room: {
            select: {
              id: true,
              name: true,
              type: true,
            }
          },
          bed: {
            select: {
              id: true,
              name: true,
              roomNumber: true,
            }
          },
          attendingDoctor: {
            select: {
              id: true,
              fullName: true,
              specialization: true,
            }
          }
        }
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan data rawat inap',
        data: mockNewInpatient
      });
    });

    it('should return 404 if patient not found', async () => {
      const mockReq = {
        body: {
          patientId: 'nonexistent',
          visitId: 'visit1',
          roomId: 'room1',
          bedId: 'bed1',
          attendingDoctorId: 'doc1',
          admissionDate: new Date().toISOString(),
          admissionReason: 'Severe pneumonia',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createInpatient(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Pasien tidak ditemukan'
      });
    });

    it('should return 400 if bed is occupied', async () => {
      const mockReq = {
        body: {
          patientId: 'patient1',
          visitId: 'visit1',
          roomId: 'room1',
          bedId: 'bed1',
          attendingDoctorId: 'doc1',
          admissionDate: new Date().toISOString(),
          admissionReason: 'Severe pneumonia',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue({
        id: 'patient1',
        name: 'John Doe',
        nik: '1234567890',
        medicalRecordNumber: 'MRN-001',
      });
      
      mockedPrisma.visit.findUnique = jest.fn().mockResolvedValue({
        id: 'visit1',
        visitNumber: 'VIS-20230101-0001',
        chiefComplaint: 'Fever',
      });
      
      mockedPrisma.room.findUnique = jest.fn().mockResolvedValue({
        id: 'room1',
        name: 'ICU 101',
        type: 'Intensive Care',
      });
      
      mockedPrisma.bed.findUnique = jest.fn().mockResolvedValue({
        id: 'bed1',
        name: 'Bed 1',
        roomNumber: '101A',
      });
      
      mockedPrisma.doctor.findUnique = jest.fn().mockResolvedValue({
        id: 'doc1',
        fullName: 'Dr. Smith',
        specialization: 'Internal Medicine',
      });
      
      mockedPrisma.inpatient.findFirst = jest.fn().mockResolvedValue({
        id: 'existing',
        bedId: 'bed1',
        dischargeDate: null,
        status: 'admitted',
      });

      const res = createMockResponse();

      await createInpatient(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Tempat tidur sedang digunakan oleh pasien lain'
      });
    });
  });

  describe('updateInpatient', () => {
    it('should update an existing inpatient', async () => {
      const mockExistingInpatient = {
        id: '1',
        patientId: 'patient1',
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890',
          medicalRecordNumber: 'MRN-001',
        },
        visitId: 'visit1',
        visit: {
          id: 'visit1',
          visitNumber: 'VIS-20230101-0001',
          chiefComplaint: 'Fever',
        },
        roomId: 'room1',
        room: {
          id: 'room1',
          name: 'ICU 101',
          type: 'Intensive Care',
        },
        bedId: 'bed1',
        bed: {
          id: 'bed1',
          name: 'Bed 1',
          roomNumber: '101A',
        },
        attendingDoctorId: 'doc1',
        attendingDoctor: {
          id: 'doc1',
          fullName: 'Dr. Smith',
          specialization: 'Internal Medicine',
        },
        admissionDate: new Date(),
        admissionReason: 'Severe pneumonia',
        notes: 'Patient requires close monitoring',
        status: 'admitted',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedInpatient = {
        ...mockExistingInpatient,
        notes: 'Updated notes',
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          ...mockExistingInpatient,
          notes: 'Updated notes',
        }
      } as MockRequest;

      mockedPrisma.inpatient.findUnique = jest.fn().mockResolvedValue(mockExistingInpatient);
      mockedPrisma.inpatient.update = jest.fn().mockResolvedValue(mockUpdatedInpatient);

      const res = createMockResponse();

      await updateInpatient(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui data rawat inap',
        data: mockUpdatedInpatient
      });
    });

    it('should return 404 if inpatient to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          patientId: 'patient1',
          visitId: 'visit1',
          roomId: 'room1',
          bedId: 'bed1',
          attendingDoctorId: 'doc1',
          admissionDate: new Date().toISOString(),
          admissionReason: 'Severe pneumonia',
        }
      } as MockRequest;

      mockedPrisma.inpatient.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateInpatient(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data rawat inap tidak ditemukan'
      });
    });
  });

  describe('deleteInpatient', () => {
    it('should delete an inpatient', async () => {
      const mockInpatient = {
        id: '1',
        patientId: 'patient1',
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890',
          medicalRecordNumber: 'MRN-001',
        },
        visitId: 'visit1',
        visit: {
          id: 'visit1',
          visitNumber: 'VIS-20230101-0001',
          chiefComplaint: 'Fever',
        },
        roomId: 'room1',
        room: {
          id: 'room1',
          name: 'ICU 101',
          type: 'Intensive Care',
        },
        bedId: 'bed1',
        bed: {
          id: 'bed1',
          name: 'Bed 1',
          roomNumber: '101A',
        },
        attendingDoctorId: 'doc1',
        attendingDoctor: {
          id: 'doc1',
          fullName: 'Dr. Smith',
          specialization: 'Internal Medicine',
        },
        admissionDate: new Date(),
        admissionReason: 'Severe pneumonia',
        notes: 'Patient requires close monitoring',
        status: 'admitted',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.inpatient.findUnique = jest.fn().mockResolvedValue(mockInpatient);
      mockedPrisma.inpatient.delete = jest.fn().mockResolvedValue(mockInpatient);

      const res = createMockResponse();

      await deleteInpatient(mockReq as Request, res);

      expect(mockedPrisma.inpatient.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus data rawat inap'
      });
    });

    it('should return 404 if inpatient to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.inpatient.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await deleteInpatient(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data rawat inap tidak ditemukan'
      });
    });
  });

  describe('transferPatient', () => {
    it('should transfer a patient to a new room and bed', async () => {
      const mockInpatient = {
        id: '1',
        patientId: 'patient1',
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890',
          medicalRecordNumber: 'MRN-001',
        },
        visitId: 'visit1',
        visit: {
          id: 'visit1',
          visitNumber: 'VIS-20230101-0001',
          chiefComplaint: 'Fever',
        },
        roomId: 'room1',
        room: {
          id: 'room1',
          name: 'ICU 101',
          type: 'Intensive Care',
        },
        bedId: 'bed1',
        bed: {
          id: 'bed1',
          name: 'Bed 1',
          roomNumber: '101A',
        },
        attendingDoctorId: 'doc1',
        attendingDoctor: {
          id: 'doc1',
          fullName: 'Dr. Smith',
          specialization: 'Internal Medicine',
        },
        admissionDate: new Date(),
        admissionReason: 'Severe pneumonia',
        notes: 'Patient requires close monitoring',
        status: 'admitted',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          roomId: 'room2',
          bedId: 'bed2',
          reason: 'Patient condition improved'
        }
      } as MockRequest;

      mockedPrisma.inpatient.findUnique = jest.fn().mockResolvedValue(mockInpatient);
      mockedPrisma.bed.findUnique = jest.fn().mockResolvedValue({
        id: 'bed2',
        name: 'Bed 2',
        roomNumber: '102A',
      });
      mockedPrisma.inpatient.findFirst = jest.fn().mockResolvedValue(null);
      mockedPrisma.inpatient.update = jest.fn().mockResolvedValue({
        ...mockInpatient,
        roomId: 'room2',
        bedId: 'bed2',
        status: 'transferred',
        notes: 'Patient requires close monitoring\nPemindahan: Patient condition improved pada ' + new Date().toISOString()
      });

      const res = createMockResponse();

      await transferPatient(mockReq as Request, res);

      expect(mockedPrisma.inpatient.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          roomId: 'room2',
          bedId: 'bed2',
          status: 'transferred',
          notes: expect.stringContaining('Pemindahan:')
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
          visit: {
            select: {
              id: true,
              visitNumber: true,
              chiefComplaint: true,
            }
          },
          room: {
            select: {
              id: true,
              name: true,
              type: true,
            }
          },
          bed: {
            select: {
              id: true,
              name: true,
              roomNumber: true,
            }
          },
          attendingDoctor: {
            select: {
              id: true,
              fullName: true,
              specialization: true,
            }
          }
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memindahkan pasien',
        data: expect.objectContaining({
          roomId: 'room2',
          bedId: 'bed2',
          status: 'transferred'
        })
      });
    });

    it('should return 404 if inpatient to transfer is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          roomId: 'room2',
          bedId: 'bed2',
          reason: 'Patient condition improved'
        }
      } as MockRequest;

      mockedPrisma.inpatient.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await transferPatient(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data rawat inap tidak ditemukan'
      });
    });
  });
});