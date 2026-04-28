import { Request, Response } from 'express';
import { KYCDicomService, KYCDocumentInput, DICOMConfigInput } from '../services/kycDicomService';

export class KYCDicomController {
  /**
   * Membuat dokumen KYC baru
   */
  static async createKYCDocument(req: Request, res: Response): Promise<void> {
    try {
      const input: KYCDocumentInput = req.body;
      
      const document = await KYCDicomService.createKYCDocument(input);
      
      res.status(201).json({
        success: true,
        message: 'Dokumen KYC berhasil dibuat',
        data: document
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Mendapatkan semua dokumen KYC untuk suatu faskes
   */
  static async getKYCDocuments(req: Request, res: Response): Promise<void> {
    try {
      const { faskesProfileId } = req.params;
      
      const documents = await KYCDicomService.getKYCDocuments(faskesProfileId);
      
      res.status(200).json({
        success: true,
        message: 'Dokumen KYC berhasil diambil',
        data: documents
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Memperbarui status dokumen KYC
   */
  static async updateKYCStatus(req: Request, res: Response): Promise<void> {
    try {
      const { documentId } = req.params;
      const { status, notes } = req.body;
      
      const document = await KYCDicomService.updateKYCStatus(documentId, status, notes);
      
      res.status(200).json({
        success: true,
        message: 'Status dokumen KYC berhasil diperbarui',
        data: document
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Menghapus dokumen KYC
   */
  static async deleteKYCDocument(req: Request, res: Response): Promise<void> {
    try {
      const { documentId } = req.params;
      
      const result = await KYCDicomService.deleteKYCDocument(documentId);
      
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Dokumen KYC berhasil dihapus',
          data: null
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Gagal menghapus dokumen KYC',
          data: null
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Membuat atau memperbarui konfigurasi DICOM
   */
  static async createOrUpdateDICOMConfig(req: Request, res: Response): Promise<void> {
    try {
      const input: DICOMConfigInput = req.body;
      
      const config = await KYCDicomService.createOrUpdateDICOMConfig(input);
      
      res.status(200).json({
        success: true,
        message: 'Konfigurasi DICOM berhasil disimpan',
        data: config
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Mendapatkan konfigurasi DICOM untuk suatu faskes
   */
  static async getDICOMConfig(req: Request, res: Response): Promise<void> {
    try {
      const { faskesProfileId } = req.params;
      
      const config = await KYCDicomService.getDICOMConfig(faskesProfileId);
      
      if (!config) {
        res.status(404).json({
          success: false,
          message: 'Konfigurasi DICOM tidak ditemukan',
          data: null
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Konfigurasi DICOM berhasil diambil',
        data: config
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Mengaktifkan atau menonaktifkan konfigurasi DICOM
   */
  static async toggleDICOMConfig(req: Request, res: Response): Promise<void> {
    try {
      const { configId } = req.params;
      const { isEnabled } = req.body;
      
      const config = await KYCDicomService.toggleDICOMConfig(configId, isEnabled);
      
      res.status(200).json({
        success: true,
        message: `Konfigurasi DICOM berhasil ${isEnabled ? 'diaktifkan' : 'dinonaktifkan'}`,
        data: config
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Menghapus konfigurasi DICOM
   */
  static async deleteDICOMConfig(req: Request, res: Response): Promise<void> {
    try {
      const { configId } = req.params;
      
      const result = await KYCDicomService.deleteDICOMConfig(configId);
      
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Konfigurasi DICOM berhasil dihapus',
          data: null
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Gagal menghapus konfigurasi DICOM',
          data: null
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }
}