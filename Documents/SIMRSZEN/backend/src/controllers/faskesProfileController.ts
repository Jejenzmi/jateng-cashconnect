import { Request, Response } from 'express';
import { FaskesProfileService, FaskesProfileInput } from '../services/faskesProfileService';

export class FaskesProfileController {
  /**
   * Membuat atau memperbarui profil faskes
   */
  static async createOrUpdate(req: Request, res: Response): Promise<void> {
    try {
      const input: FaskesProfileInput = req.body;
      
      const profile = await FaskesProfileService.createOrUpdate(input);
      
      res.status(200).json({
        success: true,
        message: 'Profil faskes berhasil disimpan',
        data: profile
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
   * Mendapatkan profil faskes
   */
  static async getProfile(_req: Request, res: Response): Promise<void> {
    try {
      const profile = await FaskesProfileService.getProfile();
      
      if (!profile) {
        res.status(404).json({
          success: false,
          message: 'Profil faskes belum disetel',
          data: null
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Profil faskes berhasil diambil',
        data: profile
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
   * Mengecek apakah profil faskes sudah ada
   */
  static async checkProfile(_req: Request, res: Response): Promise<void> {
    try {
      const profile = await FaskesProfileService.getProfile();
      
      res.status(200).json({
        success: true,
        exists: !!profile,
        message: profile ? 'Profil faskes sudah ada' : 'Profil faskes belum ada'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        exists: false,
        message: error.message
      });
    }
  }
}