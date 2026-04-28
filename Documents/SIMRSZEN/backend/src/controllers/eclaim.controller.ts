import { Request, Response } from 'express';
import { EClaimService } from '../services/eclaim.service';
import { logger } from '../utils/logger.util';

export class EClaimController {
  /**
   * Membuat SEP (Surat Eligibilitas Peserta)
   */
  static async createSEP(req: Request, res: Response) {
    try {
      const { visitId } = req.params;

      if (!visitId) {
        return res.status(400).json({
          success: false,
          message: 'Visit ID is required',
        });
      }

      const result = await EClaimService.createSEP(visitId);

      res.status(200).json({
        success: true,
        message: 'SEP created successfully',
        data: result
      });
    } catch (error) {
      logger.error('Error creating SEP:', error);

      res.status(500).json({
        success: false,
        message: 'Error creating SEP',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Submit klaim E-Claim ke server BPJS
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

      const result = await EClaimService.submitClaim(visitId);

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
   * Update klaim E-Claim
   */
  static async updateClaim(req: Request, res: Response) {
    try {
      const { noKlaim } = req.params;
      const updateData = req.body;

      if (!noKlaim) {
        return res.status(400).json({
          success: false,
          message: 'Claim number is required',
        });
      }

      const result = await EClaimService.updateClaim(noKlaim, updateData);

      res.status(200).json({
        success: true,
        message: 'Claim updated successfully',
        data: result
      });
    } catch (error) {
      logger.error('Error updating claim:', error);

      res.status(500).json({
        success: false,
        message: 'Error updating claim',
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

      const result = await EClaimService.getClaimStatus(noKlaim);

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
   * Cek eligibility peserta
   */
  static async checkEligibility(req: Request, res: Response) {
    try {
      const { noKartu, tglKunjungan } = req.query;

      if (!noKartu || !tglKunjungan) {
        return res.status(400).json({
          success: false,
          message: 'No Kartu and Tanggal Kunjungan are required',
        });
      }

      const result = await EClaimService.checkEligibility(noKartu as string, tglKunjungan as string);

      res.status(200).json({
        success: true,
        message: 'Eligibility checked successfully',
        data: result
      });
    } catch (error) {
      logger.error('Error checking eligibility:', error);

      res.status(500).json({
        success: false,
        message: 'Error checking eligibility',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
}