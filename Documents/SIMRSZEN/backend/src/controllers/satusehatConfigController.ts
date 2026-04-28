import { Request, Response } from 'express';
import { SatuSehatConfigService, SatuSehatConfigInput } from '../services/satusehatConfigService';

export class SatuSehatConfigController {
  /**
   * Membuat atau memperbarui konfigurasi Satu Sehat
   */
  static async createOrUpdate(req: Request, res: Response): Promise<void> {
    try {
      const input: SatuSehatConfigInput = req.body;
      
      const config = await SatuSehatConfigService.createOrUpdate(input);
      
      res.status(200).json({
        success: true,
        message: 'Konfigurasi Satu Sehat berhasil disimpan',
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
   * Mendapatkan konfigurasi Satu Sehat
   */
  static async getConfig(req: Request, res: Response): Promise<void> {
    try {
      const config = await SatuSehatConfigService.getConfig();
      
      if (!config) {
        res.status(404).json({
          success: false,
          message: 'Konfigurasi Satu Sehat belum disetel',
          data: null
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Konfigurasi Satu Sehat berhasil diambil',
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
   * Menghapus konfigurasi Satu Sehat
   */
  static async deleteConfig(req: Request, res: Response): Promise<void> {
    try {
      const result = await SatuSehatConfigService.deleteConfig();
      
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Konfigurasi Satu Sehat berhasil dihapus',
          data: null
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Gagal menghapus konfigurasi Satu Sehat',
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