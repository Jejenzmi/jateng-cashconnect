import { PrismaClient, Patient, Visit } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.util';

const prisma = new PrismaClient();

interface DicomFile {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  filePath: string;
  studyId: string;
  seriesId: string;
  instanceId: string;
  patientId: string;
  visitId: string;
  createdAt: Date;
}

export class PacsService {
  private static readonly STORAGE_PATH = process.env.PACS_STORAGE_PATH || './storage/dicom';
  
  /**
   * Upload file DICOM
   */
  static async uploadDicom(file: Express.Multer.File, patientId: string, visitId: string): Promise<DicomFile> {
    try {
      // Validasi ekstensi file
      if (!file.originalname.toLowerCase().endsWith('.dcm')) {
        throw new Error('File harus dalam format DICOM (.dcm)');
      }

      // Membuat direktori jika belum ada
      if (!fs.existsSync(this.STORAGE_PATH)) {
        fs.mkdirSync(this.STORAGE_PATH, { recursive: true });
      }

      // Membuat struktur direktori berdasarkan patientId
      const patientDir = path.join(this.STORAGE_PATH, patientId);
      if (!fs.existsSync(patientDir)) {
        fs.mkdirSync(patientDir, { recursive: true });
      }

      // Generate unique filename
      const fileName = `${Date.now()}_${file.originalname}`;
      const filePath = path.join(patientDir, fileName);

      // Menyimpan file
      fs.writeFileSync(filePath, file.buffer);

      // Ekstrak informasi dari file (dalam implementasi nyata, kita akan membaca header DICOM)
      const studyId = `STUDY_${Date.now()}`;
      const seriesId = `SERIES_${Date.now()}`;
      const instanceId = `INSTANCE_${Date.now()}`;

      // Simpan metadata ke database
      const dicomFile = await prisma.$executeRaw`
        INSERT INTO "ImagingInstance" (
          "id", "imaging_series_id", "sop_instance_uid", "instance_number", 
          "content_type", "url", "size_in_bytes", "created_at", "updated_at"
        ) VALUES (
          gen_random_uuid(), 
          (SELECT id FROM "ImagingSeries" LIMIT 1), -- Dalam implementasi nyata, ini akan dibuat baru
          ${instanceId},
          1,
          ${file.mimetype},
          ${filePath},
          ${file.size},
          NOW(),
          NOW()
        )
      `;

      return {
        id: `dicom-${Date.now()}`,
        fileName,
        fileSize: file.size,
        mimeType: file.mimetype,
        filePath,
        studyId,
        seriesId,
        instanceId,
        patientId,
        visitId,
        createdAt: new Date()
      };
    } catch (error) {
      logger.error('Error uploading DICOM file:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan file DICOM berdasarkan ID
   */
  static async getDicomFile(instanceId: string): Promise<DicomFile | null> {
    try {
      // Dalam implementasi nyata, kita akan mengambil dari database
      // Untuk sekarang kita kembalikan data dummy
      return {
        id: instanceId,
        fileName: 'sample.dcm',
        fileSize: 1024000, // 1MB
        mimeType: 'application/dicom',
        filePath: path.join(this.STORAGE_PATH, 'patient-1', 'sample.dcm'),
        studyId: 'STUDY_12345',
        seriesId: 'SERIES_67890',
        instanceId,
        patientId: 'patient-1',
        visitId: 'visit-1',
        createdAt: new Date()
      };
    } catch (error) {
      logger.error('Error getting DICOM file:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan daftar file DICOM untuk pasien
   */
  static async getPatientDicomFiles(patientId: string): Promise<DicomFile[]> {
    try {
      // Dalam implementasi nyata, kita akan mengambil dari database
      // Untuk sekarang kita kembalikan data dummy
      return [
        {
          id: `dicom-${Date.now()}-1`,
          fileName: 'chest_xray.dcm',
          fileSize: 2048000, // 2MB
          mimeType: 'application/dicom',
          filePath: path.join(this.STORAGE_PATH, patientId, 'chest_xray.dcm'),
          studyId: 'STUDY_11111',
          seriesId: 'SERIES_22222',
          instanceId: 'INSTANCE_33333',
          patientId,
          visitId: 'visit-1',
          createdAt: new Date(Date.now() - 86400000) // 1 hari yang lalu
        },
        {
          id: `dicom-${Date.now()}-2`,
          fileName: 'mri_brain.dcm',
          fileSize: 15360000, // 15MB
          mimeType: 'application/dicom',
          filePath: path.join(this.STORAGE_PATH, patientId, 'mri_brain.dcm'),
          studyId: 'STUDY_44444',
          seriesId: 'SERIES_55555',
          instanceId: 'INSTANCE_66666',
          patientId,
          visitId: 'visit-2',
          createdAt: new Date(Date.now() - 172800000) // 2 hari yang lalu
        }
      ];
    } catch (error) {
      logger.error('Error getting patient DICOM files:', error);
      throw error;
    }
  }

  /**
   * Menghapus file DICOM
   */
  static async deleteDicomFile(instanceId: string): Promise<boolean> {
    try {
      // Dalam implementasi nyata, kita akan menghapus dari database dan filesystem
      // Untuk sekarang kita hanya mensimulasikan
      return true;
    } catch (error) {
      logger.error('Error deleting DICOM file:', error);
      throw error;
    }
  }

  /**
   * Membuat study baru
   */
  static async createStudy(data: {
    patientId: string;
    visitId: string;
    studyDate: Date;
    studyDescription: string;
    modality: string;
    referringPhysician: string;
  }): Promise<any> {
    try {
      // Dalam implementasi nyata, kita akan membuat entitas Study dan Series di database
      // Untuk sekarang kita kembalikan data dummy
      return {
        id: `study-${Date.now()}`,
        studyInstanceUid: `STUDY_UID_${Date.now()}`,
        patientId: data.patientId,
        visitId: data.visitId,
        studyDate: data.studyDate,
        studyDescription: data.studyDescription,
        modality: data.modality,
        referringPhysician: data.referringPhysician,
        status: 'completed',
        createdAt: new Date()
      };
    } catch (error) {
      logger.error('Error creating study:', error);
      throw error;
    }
  }
}