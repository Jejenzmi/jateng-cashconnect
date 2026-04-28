import { Request, Response } from 'express';
import { PacsService } from '../services/pacs.service';
import { logger } from '../utils/logger.util';

export class PacsController {
  /**
   * Upload file DICOM
   */
  static async uploadDicom(req: Request, res: Response) {
    try {
      const { patientId, visitId } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'File DICOM harus disertakan',
        });
      }

      if (!patientId || !visitId) {
        return res.status(400).json({
          success: false,
          message: 'Patient ID dan Visit ID harus disertakan',
        });
      }

      const result = await PacsService.uploadDicom(file, patientId, visitId);

      res.status(200).json({
        success: true,
        message: 'File DICOM berhasil diupload',
        data: result
      });
    } catch (error) {
      logger.error('Error uploading DICOM:', error);

      res.status(500).json({
        success: false,
        message: 'Error uploading DICOM file',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Mendapatkan file DICOM berdasarkan ID
   */
  static async getDicomFile(req: Request, res: Response) {
    try {
      const { instanceId } = req.params;

      if (!instanceId) {
        return res.status(400).json({
          success: false,
          message: 'Instance ID harus disertakan',
        });
      }

      const result = await PacsService.getDicomFile(instanceId);

      res.status(200).json({
        success: true,
        message: 'File DICOM ditemukan',
        data: result
      });
    } catch (error) {
      logger.error('Error getting DICOM file:', error);

      res.status(500).json({
        success: false,
        message: 'Error retrieving DICOM file',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Mendapatkan daftar file DICOM untuk pasien
   */
  static async getPatientDicomFiles(req: Request, res: Response) {
    try {
      const { patientId } = req.params;

      if (!patientId) {
        return res.status(400).json({
          success: false,
          message: 'Patient ID harus disertakan',
        });
      }

      const result = await PacsService.getPatientDicomFiles(patientId);

      res.status(200).json({
        success: true,
        message: 'Daftar file DICOM ditemukan',
        data: result,
        count: result.length
      });
    } catch (error) {
      logger.error('Error getting patient DICOM files:', error);

      res.status(500).json({
        success: false,
        message: 'Error retrieving patient DICOM files',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Menghapus file DICOM
   */
  static async deleteDicomFile(req: Request, res: Response) {
    try {
      const { instanceId } = req.params;

      if (!instanceId) {
        return res.status(400).json({
          success: false,
          message: 'Instance ID harus disertakan',
        });
      }

      const result = await PacsService.deleteDicomFile(instanceId);

      res.status(200).json({
        success: result,
        message: result ? 'File DICOM berhasil dihapus' : 'Gagal menghapus file DICOM'
      });
    } catch (error) {
      logger.error('Error deleting DICOM file:', error);

      res.status(500).json({
        success: false,
        message: 'Error deleting DICOM file',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Membuat study baru
   */
  static async createStudy(req: Request, res: Response) {
    try {
      const { patientId, visitId, studyDate, studyDescription, modality, referringPhysician } = req.body;

      if (!patientId || !visitId || !studyDate || !studyDescription || !modality) {
        return res.status(400).json({
          success: false,
          message: 'Semua field wajib harus disertakan: patientId, visitId, studyDate, studyDescription, modality',
        });
      }

      const result = await PacsService.createStudy({
        patientId,
        visitId,
        studyDate: new Date(studyDate),
        studyDescription,
        modality,
        referringPhysician: referringPhysician || ''
      });

      res.status(200).json({
        success: true,
        message: 'Study DICOM berhasil dibuat',
        data: result
      });
    } catch (error) {
      logger.error('Error creating DICOM study:', error);

      res.status(500).json({
        success: false,
        message: 'Error creating DICOM study',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
}