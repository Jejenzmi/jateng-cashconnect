import { Request, Response } from 'express';
import { IDRGLService, IDRGRuleInput, IDRGPatientCaseInput } from '../services/idrgService';

export class IDRGLController {
  /**
   * Membuat aturan iDRG baru
   */
  static async createIDRGRule(req: Request, res: Response): Promise<void> {
    try {
      const input: IDRGRuleInput = req.body;
      
      const rule = await IDRGLService.createIDRGRule(input);
      
      res.status(201).json({
        success: true,
        message: 'Aturan iDRG berhasil dibuat',
        data: rule
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
   * Mendapatkan semua aturan iDRG
   */
  static async getIDRGRules(req: Request, res: Response): Promise<void> {
    try {
      const { isActive } = req.query;
      const isActiveBool = isActive === 'true' || isActive === '1';
      const includeInactive = isActive === 'false' || isActive === '0' ? false : undefined;
      
      const rules = await IDRGLService.getIDRGRules(includeInactive);
      
      res.status(200).json({
        success: true,
        message: 'Aturan iDRG berhasil diambil',
        data: rules
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
   * Mendapatkan aturan iDRG berdasarkan ID
   */
  static async getIDRGRuleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const rule = await IDRGLService.getIDRGRuleById(id);
      
      if (!rule) {
        res.status(404).json({
          success: false,
          message: 'Aturan iDRG tidak ditemukan',
          data: null
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Aturan iDRG berhasil diambil',
        data: rule
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
   * Memperbarui aturan iDRG
   */
  static async updateIDRGRule(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input: Partial<IDRGRuleInput> = req.body;
      
      const rule = await IDRGLService.updateIDRGRule(id, input);
      
      res.status(200).json({
        success: true,
        message: 'Aturan iDRG berhasil diperbarui',
        data: rule
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
   * Menghapus aturan iDRG
   */
  static async deleteIDRGRule(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const result = await IDRGLService.deleteIDRGRule(id);
      
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Aturan iDRG berhasil dihapus',
          data: null
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Gagal menghapus aturan iDRG',
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
   * Membuat kasus pasien iDRG baru
   */
  static async createIDRGPatientCase(req: Request, res: Response): Promise<void> {
    try {
      const input: IDRGPatientCaseInput = req.body;
      
      const patientCase = await IDRGLService.createIDRGPatientCase(input);
      
      res.status(201).json({
        success: true,
        message: 'Kasus pasien iDRG berhasil dibuat',
        data: patientCase
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
   * Mendapatkan semua kasus pasien iDRG
   */
  static async getIDRGPatientCases(req: Request, res: Response): Promise<void> {
    try {
      const { status, patientId } = req.query;
      
      const cases = await IDRGLService.getIDRGPatientCases(
        status as string, 
        patientId as string
      );
      
      res.status(200).json({
        success: true,
        message: 'Kasus pasien iDRG berhasil diambil',
        data: cases
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
   * Mendapatkan kasus pasien iDRG berdasarkan ID
   */
  static async getIDRGPatientCaseById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const patientCase = await IDRGLService.getIDRGPatientCaseById(id);
      
      if (!patientCase) {
        res.status(404).json({
          success: false,
          message: 'Kasus pasien iDRG tidak ditemukan',
          data: null
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Kasus pasien iDRG berhasil diambil',
        data: patientCase
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
   * Memperbarui status kasus pasien iDRG
   */
  static async updateIDRGPatientCaseStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      
      const patientCase = await IDRGLService.updateIDRGPatientCaseStatus(id, status, notes);
      
      res.status(200).json({
        success: true,
        message: 'Status kasus pasien iDRG berhasil diperbarui',
        data: patientCase
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
   * Menghitung ulang biaya untuk kasus pasien iDRG
   */
  static async recalculateIDRGCost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const patientCase = await IDRGLService.recalculateIDRGCost(id);
      
      res.status(200).json({
        success: true,
        message: 'Biaya iDRG berhasil dihitung ulang',
        data: patientCase
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }
}