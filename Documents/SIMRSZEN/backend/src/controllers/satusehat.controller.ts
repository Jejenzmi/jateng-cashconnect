import { Request, Response } from 'express';
import { SatuSehatService } from '../services/satusehat.service';
import { logger } from '../utils/logger.util';

export class SatuSehatController {
  /**
   * Mengirim data pasien ke SATU SEHAT
   */
  static async sendPatient(req: Request, res: Response) {
    try {
      const { patientId } = req.params;

      if (!patientId) {
        return res.status(400).json({
          success: false,
          message: 'Patient ID is required',
        });
      }

      const result = await SatuSehatService.sendPatientToSatuSehat(patientId);

      res.status(200).json({
        success: true,
        message: 'Patient data sent to SATU SEHAT successfully',
        data: result
      });
    } catch (error) {
      logger.error('Error sending patient to SATU SEHAT:', error);

      res.status(500).json({
        success: false,
        message: 'Error sending patient data to SATU SEHAT',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Mengirim data kunjungan ke SATU SEHAT
   */
  static async sendVisit(req: Request, res: Response) {
    try {
      const { visitId } = req.params;

      if (!visitId) {
        return res.status(400).json({
          success: false,
          message: 'Visit ID is required',
        });
      }

      const result = await SatuSehatService.sendVisitToSatuSehat(visitId);

      res.status(200).json({
        success: true,
        message: 'Visit data sent to SATU SEHAT successfully',
        data: result
      });
    } catch (error) {
      logger.error('Error sending visit to SATU SEHAT:', error);

      res.status(500).json({
        success: false,
        message: 'Error sending visit data to SATU SEHAT',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Sinkronisasi batch data ke SATU SEHAT
   */
  static async syncBatch(req: Request, res: Response) {
    try {
      const { dataType, ids } = req.body;

      if (!dataType || !ids || !Array.isArray(ids)) {
        return res.status(400).json({
          success: false,
          message: 'Data type and array of IDs are required',
        });
      }

      const result = await SatuSehatService.syncBatchToSatuSehat(dataType, ids);

      res.status(200).json({
        success: true,
        message: 'Batch sync completed',
        data: result
      });
    } catch (error) {
      logger.error('Error syncing batch to SATU SEHAT:', error);

      res.status(500).json({
        success: false,
        message: 'Error syncing batch to SATU SEHAT',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
}