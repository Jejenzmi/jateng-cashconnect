import { PrismaClient, MedicalRecord, Patient, Visit, Dokter } from '@prisma/client';
import { BpjsSyncService } from './bpjs-sync.service';
import { logger } from '../utils/logger.util';

const prisma = new PrismaClient();

export class MedicalRecordService {
  /**
   * Membuat rekam medis baru
   */
  static async createMedicalRecord(data: {
    patientId: string;
    visitId: string;
    dokterId: string;
    pegawaiId: string;
    subjectif?: string;
    objektif?: string;
    asesmen?: string;
    planning?: string;
    icd10Diagnosa?: string;
    icd9Prosedur?: string;
    catatan?: string;
  }): Promise<MedicalRecord> {
    try {
      const medicalRecord = await prisma.medicalRecord.create({
        data: {
          patientId: data.patientId,
          visitId: data.visitId,
          dokterId: data.dokterId,
          pegawaiId: data.pegawaiId,
          subjectif: data.subjectif || '',
          objektif: data.objektif || '',
          asesmen: data.asesmen || '',
          planning: data.planning || '',
          icd10Diagnosa: data.icd10Diagnosa || '',
          icd9Prosedur: data.icd9Prosedur || '',
          catatan: data.catatan || ''
        },
        include: {
          patient: {
            select: {
              nama: true,
              patientId: true,
              jenisKelamin: true,
              tanggalLahir: true
            }
          },
          visit: {
            select: {
              visitId: true,
              tanggalPeriksa: true
            }
          },
          dokter: {
            select: {
              nama: true,
              kode: true
            }
          }
        }
      });

      // Sinkronisasi ke BPJS jika diperlukan
      // await BpjsSyncService.syncMedicalRecordToBpjs(medicalRecord.id);

      return medicalRecord;
    } catch (error) {
      logger.error('Error creating medical record:', error);
      throw error;
    }
  }

  /**
   * Memperbarui rekam medis
   */
  static async updateMedicalRecord(recordId: string, data: Partial<{
    subjectif: string;
    objektif: string;
    asesmen: string;
    planning: string;
    icd10Diagnosa: string;
    icd9Prosedur: string;
    catatan: string;
  }>): Promise<MedicalRecord> {
    try {
      const medicalRecord = await prisma.medicalRecord.update({
        where: { id: recordId },
        data,
        include: {
          patient: {
            select: {
              nama: true,
              patientId: true,
              jenisKelamin: true,
              tanggalLahir: true
            }
          },
          visit: {
            select: {
              visitId: true,
              tanggalPeriksa: true
            }
          },
          dokter: {
            select: {
              nama: true,
              kode: true
            }
          }
        }
      });

      return medicalRecord;
    } catch (error) {
      logger.error('Error updating medical record:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan rekam medis berdasarkan ID
   */
  static async getMedicalRecordById(recordId: string): Promise<MedicalRecord | null> {
    try {
      return await prisma.medicalRecord.findUnique({
        where: { id: recordId },
        include: {
          patient: {
            select: {
              nama: true,
              patientId: true,
              jenisKelamin: true,
              tanggalLahir: true
            }
          },
          visit: {
            select: {
              visitId: true,
              tanggalPeriksa: true
            }
          },
          dokter: {
            select: {
              nama: true,
              kode: true
            }
          }
        }
      });
    } catch (error) {
      logger.error('Error getting medical record by ID:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan riwayat rekam medis pasien
   */
  static async getPatientMedicalHistory(patientId: string): Promise<MedicalRecord[]> {
    try {
      return await prisma.medicalRecord.findMany({
        where: { patientId },
        include: {
          visit: {
            select: {
              visitId: true,
              tanggalPeriksa: true
            }
          },
          dokter: {
            select: {
              nama: true,
              kode: true
            }
          }
        },
        orderBy: { tanggal: 'desc' }
      });
    } catch (error) {
      logger.error('Error getting patient medical history:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan rekam medis berdasarkan kunjungan
   */
  static async getMedicalRecordsByVisit(visitId: string): Promise<MedicalRecord[]> {
    try {
      return await prisma.medicalRecord.findMany({
        where: { visitId },
        include: {
          patient: {
            select: {
              nama: true,
              patientId: true
            }
          },
          dokter: {
            select: {
              nama: true,
              kode: true
            }
          }
        },
        orderBy: { tanggal: 'desc' }
      });
    } catch (error) {
      logger.error('Error getting medical records by visit:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan daftar rekam medis
   */
  static async getMedicalRecords(filter: {
    patientId?: string;
    dokterId?: string;
    startDate?: Date;
    endDate?: Date;
    searchTerm?: string;
  } = {}): Promise<MedicalRecord[]> {
    try {
      const whereClause: any = {};

      if (filter.patientId) whereClause.patientId = filter.patientId;
      if (filter.dokterId) whereClause.dokterId = filter.dokterId;

      if (filter.startDate || filter.endDate) {
        whereClause.tanggal = {};
        if (filter.startDate) whereClause.tanggal.gte = filter.startDate;
        if (filter.endDate) whereClause.tanggal.lte = filter.endDate;
      }

      if (filter.searchTerm) {
        whereClause.OR = [
          { subjectif: { contains: filter.searchTerm, mode: 'insensitive' } },
          { objektif: { contains: filter.searchTerm, mode: 'insensitive' } },
          { asesmen: { contains: filter.searchTerm, mode: 'insensitive' } },
          { planning: { contains: filter.searchTerm, mode: 'insensitive' } },
          { catatan: { contains: filter.searchTerm, mode: 'insensitive' } }
        ];
      }

      return await prisma.medicalRecord.findMany({
        where: whereClause,
        include: {
          patient: {
            select: {
              nama: true,
              patientId: true
            }
          },
          visit: {
            select: {
              visitId: true,
              tanggalPeriksa: true
            }
          },
          dokter: {
            select: {
              nama: true,
              kode: true
            }
          }
        },
        orderBy: { tanggal: 'desc' }
      });
    } catch (error) {
      logger.error('Error getting medical records:', error);
      throw error;
    }
  }

  /**
   * Mencari kode ICD-10
   */
  static async searchICD10(searchTerm: string): Promise<Array<{ kode: string; nama: string }>> {
    // Ini hanya contoh data dummy - dalam implementasi nyata, ini akan terhubung ke database ICD-10
    const icd10Codes = [
      { kode: 'A00', nama: 'Kolera' },
      { kode: 'A01', nama: 'Tipes dan paratifus' },
      { kode: 'I20', nama: 'Angina pektoris' },
      { kode: 'I21', nama: 'Infark miokard akut' },
      { kode: 'J44', nama: 'Penyakit paru obstruktif kronik' },
      { kode: 'E11', nama: 'Diabetes mellitus tipe 2' },
      { kode: 'F32', nama: 'Gangguan depresi' },
      { kode: 'K25', nama: 'Tukak lambung' },
      { kode: 'M54', nama: 'Nyeri pinggang dan tulang belakang lainnya' },
      { kode: 'N39', nama: 'Infeksi saluran kemih lainnya' },
    ];

    return icd10Codes.filter(icd => 
      icd.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icd.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  /**
   * Mencari kode ICD-9
   */
  static async searchICD9(searchTerm: string): Promise<Array<{ kode: string; nama: string }>> {
    // Ini hanya contoh data dummy - dalam implementasi nyata, ini akan terhubung ke database ICD-9
    const icd9Codes = [
      { kode: '1', nama: 'Operasi insisi' },
      { kode: '1.0', nama: 'Insisi incisional' },
      { kode: '1.2', nama: 'Insisi eksplorasi' },
      { kode: '1.4', nama: 'Insisi drainase' },
      { kode: '86.6', nama: 'Rekonstruksi payudara' },
      { kode: '86.7', nama: 'Reduksi mammaplasti' },
      { kode: '86.8', nama: 'Augmentasi mammaplasti' },
      { kode: '86.9', nama: 'Operasi estetik lainnya pada payudara' },
      { kode: '87.0', nama: 'Aspirasi dari dinding tubuh' },
      { kode: '96.0', nama: 'Infus cairan' },
    ];

    return icd9Codes.filter(icd => 
      icd.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icd.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}