import { Prisma } from '@prisma/client';
import prisma from '../config/db';

interface PatientFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | undefined;
  searchQuery?: string;
}

interface CreatePatientInput {
  fullName: string;
  nik?: string;
  birthDate: Date;
  gender: string;
  phone?: string;
  address?: string;
  bpjsNumber?: string;
  medicalRecordNo?: string;
}

interface UpdatePatientInput {
  fullName?: string;
  nik?: string;
  birthDate?: Date;
  gender?: string;
  phone?: string;
  address?: string;
  bpjsNumber?: string;
}

export class PatientService {
  // Get all patients with pagination and filtering
  static async getAll(filters: PatientFilters = {}) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;
    
    // Determine sort field and direction
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';

    const sortByMap: Record<string, string> = {
      fullName: 'nama',
      bpjsNumber: 'noKartu',
      medicalRecordNo: 'patientId',
      birthDate: 'tanggalLahir',
      gender: 'jenisKelamin',
      phone: 'noHp',
      address: 'alamat',
    };
    const sortByField = sortByMap[sortBy] || sortBy;
    
    // Build where clause for search
    let whereClause: Prisma.PatientWhereInput = {};
    
    if (filters.searchQuery) {
      whereClause.OR = [
        {
          nama: {
            contains: filters.searchQuery,
            mode: 'insensitive',
          },
        },
        {
          nik: {
            contains: filters.searchQuery,
            mode: 'insensitive',
          },
        },
        {
          noKartu: {
            contains: filters.searchQuery,
            mode: 'insensitive',
          },
        },
        {
          patientId: {
            contains: filters.searchQuery,
            mode: 'insensitive',
          },
        },
      ];
    }

    const patients = await prisma.patient.findMany({
      where: whereClause,
      skip: offset,
      take: limit,
      orderBy: {
        [sortByField]: sortOrder,
      },
    });

    const total = await prisma.patient.count({
      where: whereClause
    });

    return {
      data: patients,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  // Get patient by ID
  static async getById(id: string) {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        visits: {
          orderBy: {
            tanggalPeriksa: 'desc',
          }
        }
      },
    });

    return patient;
  }

  // Create a new patient
  static async create(data: CreatePatientInput) {
    // Generate medical record number if not provided
    const recordNo = data.medicalRecordNo || `MR-${Date.now()}`;

    const patient = await prisma.patient.create({
      data: {
        nama: data.fullName,
        nik: data.nik,
        tanggalLahir: data.birthDate,
        jenisKelamin: data.gender,
        noHp: data.phone,
        alamat: data.address,
        noKartu: data.bpjsNumber,
        patientId: recordNo,
      },
    });

    return patient;
  }

  // Update patient
  static async update(id: string, data: UpdatePatientInput) {
    const patient = await prisma.patient.update({
      where: { id },
      data: {
        nama: data.fullName,
        nik: data.nik,
        tanggalLahir: data.birthDate,
        jenisKelamin: data.gender,
        noHp: data.phone,
        alamat: data.address,
        noKartu: data.bpjsNumber,
      },
    });

    return patient;
  }

  // Delete patient
  static async delete(id: string) {
    // Check if patient has related records before deletion
    const visitCount = await prisma.visit.count({
      where: { patientId: id },
    });

    if (visitCount > 0) {
      throw new Error('Cannot delete patient with existing visits');
    }

    const patient = await prisma.patient.delete({
      where: { id },
    });

    return patient;
  }

  // Search patients by multiple criteria
  static async search(criteria: {
    fullName?: string;
    nik?: string;
    bpjsNumber?: string;
    medicalRecordNo?: string;
  }) {
    const whereClause: Prisma.PatientWhereInput = {
      OR: [],
    };

    if (criteria.fullName) {
      (whereClause.OR as Prisma.PatientWhereInput[]).push({
        nama: {
          contains: criteria.fullName,
          mode: 'insensitive',
        },
      });
    }

    if (criteria.nik) {
      (whereClause.OR as Prisma.PatientWhereInput[]).push({
        nik: {
          contains: criteria.nik,
          mode: 'insensitive',
        },
      });
    }

    if (criteria.bpjsNumber) {
      (whereClause.OR as Prisma.PatientWhereInput[]).push({
        noKartu: {
          contains: criteria.bpjsNumber,
          mode: 'insensitive',
        },
      });
    }

    if (criteria.medicalRecordNo) {
      (whereClause.OR as Prisma.PatientWhereInput[]).push({
        patientId: {
          contains: criteria.medicalRecordNo,
          mode: 'insensitive',
        },
      });
    }

    // If no search criteria, return empty array
    if ((whereClause.OR as Prisma.PatientWhereInput[]).length === 0) {
      return [];
    }

    const patients = await prisma.patient.findMany({
      where: whereClause,
      orderBy: {
        nama: 'asc',
      },
    });

    return patients;
  }
}