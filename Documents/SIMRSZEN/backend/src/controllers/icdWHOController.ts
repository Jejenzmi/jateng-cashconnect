import { Request, Response } from 'express';
import { ICDWHOService } from '../services/icdWHOService';

export class ICDWHOController {
  /**
   * Mengatur kredensial ICD WHO
   */
  static async setCredentials(req: Request, res: Response): Promise<void> {
    try {
      const { clientId, clientSecret } = req.body;

      if (!clientId || !clientSecret) {
        res.status(400).json({
          success: false,
          message: 'ClientId dan ClientSecret wajib diisi',
          data: null
        });
        return;
      }

      await ICDWHOService.setCredentials(clientId, clientSecret);

      res.status(200).json({
        success: true,
        message: 'Kredensial ICD WHO berhasil diatur',
        data: null
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
   * Mencari kode ICD
   */
  static async searchICDCodes(req: Request, res: Response): Promise<void> {
    try {
      const { searchTerm, limit = 10 } = req.query;

      if (!searchTerm) {
        res.status(400).json({
          success: false,
          message: 'Parameter searchTerm wajib disediakan',
          data: null
        });
        return;
      }

      const results = await ICDWHOService.searchICDCodes(searchTerm as string, parseInt(limit as string));

      res.status(200).json({
        success: true,
        message: 'Pencarian kode ICD berhasil',
        data: results
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
   * Mendapatkan detail kode ICD
   */
  static async getICDDetails(req: Request, res: Response): Promise<void> {
    try {
      const { codeId } = req.params;

      if (!codeId) {
        res.status(400).json({
          success: false,
          message: 'Parameter codeId wajib disediakan',
          data: null
        });
        return;
      }

      const details = await ICDWHOService.getICDDetails(codeId);

      res.status(200).json({
        success: true,
        message: 'Detail kode ICD berhasil diambil',
        data: details
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
   * Mendapatkan chapter ICD
   */
  static async getICDChapters(req: Request, res: Response): Promise<void> {
    try {
      const chapters = await ICDWHOService.getICDChapters();

      res.status(200).json({
        success: true,
        message: 'Chapter ICD berhasil diambil',
        data: chapters
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }
}