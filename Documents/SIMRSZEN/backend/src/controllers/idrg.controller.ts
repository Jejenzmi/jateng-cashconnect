import { Request, Response } from 'express';
import { IdrgService } from '../services/idrg.service';
import { logger } from '../utils/logger.util';

export class IdrgController {
  /**
   * Klasifikasi INA-DRG untuk kunjungan tertentu
   */
  static async classify(req: Request, res: Response) {
    try {
      const { visitId } = req.params;

      if (!visitId) {
        return res.status(400).json({
          success: false,
          message: 'Visit ID is required',
        });
      }

      const result = await IdrgService.classifyInaDrg(visitId);

      res.status(200).json({
        success: true,
        message: 'Patient classified successfully',
        data: result
      });
    } catch (error) {
      logger.error('Error classifying patient:', error);

      res.status(500).json({
        success: false,
        message: 'Error classifying patient',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Submit klaim IDRG ke server
   */
  static async submitClaim(req: Request, res: Response) {
    try {
      const { visitId } = req.params;

      if (!visitId) {
        return res.status(400).json({
          success: false,
          message: 'Visit ID is required',
        });
      }

      const result = await IdrgService.submitClaim(visitId);

      res.status(200).json({
        success: true,
        message: 'Claim submitted successfully',
        data: result
      });
    } catch (error) {
      logger.error('Error submitting claim:', error);

      res.status(500).json({
        success: false,
        message: 'Error submitting claim',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Cek status klaim
   */
  static async getClaimStatus(req: Request, res: Response) {
    try {
      const { noKlaim } = req.params;

      if (!noKlaim) {
        return res.status(400).json({
          success: false,
          message: 'Claim number is required',
        });
      }

      const result = await IdrgService.getClaimStatus(noKlaim);

      res.status(200).json({
        success: true,
        message: 'Claim status retrieved successfully',
        data: result
      });
    } catch (error) {
      logger.error('Error getting claim status:', error);

      res.status(500).json({
        success: false,
        message: 'Error getting claim status',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Dapatkan riwayat klasifikasi IDRG untuk pasien
   */
  static async getPatientHistory(req: Request, res: Response) {
    try {
      const { patientId } = req.params;

      if (!patientId) {
        return res.status(400).json({
          success: false,
          message: 'Patient ID is required',
        });
      }

      const result = await IdrgService.getPatientHistory(patientId);

      res.status(200).json({
        success: true,
        message: 'Patient history retrieved successfully',
        data: result
      });
    } catch (error) {
      logger.error('Error getting patient history:', error);

      res.status(500).json({
        success: false,
        message: 'Error getting patient history',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
}