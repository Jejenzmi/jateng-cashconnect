import { Request, Response } from 'express';
import { BpjsSyncService } from '../services/bpjs-sync.service';
import { BpjsLogService } from '../services/bpjs-log.service';
import { logger } from '../utils/logger.util';

export class BpjsSyncController {
  /**
   * Menyinkronkan data kunjungan ke BPJS
   */
  static async syncVisit(req: Request, res: Response) {
    try {
      const { visitId } = req.params;

      if (!visitId) {
        return res.status(400).json({
          success: false,
          message: 'Visit ID is required',
        });
      }

      const syncRecord = await BpjsSyncService.syncVisitToBpjs(visitId);

      // Log aktivitas
      await BpjsLogService.createLog({
        serviceType: 'sync',
        endpoint: `/sync/visit/${visitId}`,
        method: 'POST',
        requestBody: req.body,
        responseBody: { id: syncRecord.id, status: syncRecord.status },
        statusCode: 200,
      });

      res.status(200).json({
        success: true,
        message: 'Visit sync initiated successfully',
        data: {
          id: syncRecord.id,
          visitId: syncRecord.visitId,
          syncType: syncRecord.syncType,
          status: syncRecord.status,
          createdAt: syncRecord.createdAt,
        },
      });
    } catch (error) {
      logger.error('Error syncing visit:', error);

      // Log error
      await BpjsLogService.createLog({
        serviceType: 'sync',
        endpoint: `/sync/visit/${req.params.visitId}`,
        method: 'POST',
        requestBody: req.body,
        errorMessage: error.message,
        statusCode: 500,
      });

      res.status(500).json({
        success: false,
        message: 'Error syncing visit to BPJS',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Menyinkronkan data pendaftaran ke BPJS
   */
  static async syncRegistration(req: Request, res: Response) {
    try {
      const { visitId } = req.params;

      if (!visitId) {
        return res.status(400).json({
          success: false,
          message: 'Visit ID is required',
        });
      }

      const syncRecord = await BpjsSyncService.syncRegistrationToBpjs(visitId);

      // Log aktivitas
      await BpjsLogService.createLog({
        serviceType: 'sync',
        endpoint: `/sync/registration/${visitId}`,
        method: 'POST',
        requestBody: req.body,
        responseBody: { id: syncRecord.id, status: syncRecord.status },
        statusCode: 200,
      });

      res.status(200).json({
        success: true,
        message: 'Registration sync initiated successfully',
        data: {
          id: syncRecord.id,
          visitId: syncRecord.visitId,
          syncType: syncRecord.syncType,
          status: syncRecord.status,
          createdAt: syncRecord.createdAt,
        },
      });
    } catch (error) {
      logger.error('Error syncing registration:', error);

      // Log error
      await BpjsLogService.createLog({
        serviceType: 'sync',
        endpoint: `/sync/registration/${req.params.visitId}`,
        method: 'POST',
        requestBody: req.body,
        errorMessage: error.message,
        statusCode: 500,
      });

      res.status(500).json({
        success: false,
        message: 'Error syncing registration to BPJS',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Menyinkronkan data tindakan ke BPJS
   */
  static async syncTreatment(req: Request, res: Response) {
    try {
      const { visitId } = req.params;

      if (!visitId) {
        return res.status(400).json({
          success: false,
          message: 'Visit ID is required',
        });
      }

      const syncRecord = await BpjsSyncService.syncTreatmentToBpjs(visitId);

      // Log aktivitas
      await BpjsLogService.createLog({
        serviceType: 'sync',
        endpoint: `/sync/treatment/${visitId}`,
        method: 'POST',
        requestBody: req.body,
        responseBody: { id: syncRecord.id, status: syncRecord.status },
        statusCode: 200,
      });

      res.status(200).json({
        success: true,
        message: 'Treatment sync initiated successfully',
        data: {
          id: syncRecord.id,
          visitId: syncRecord.visitId,
          syncType: syncRecord.syncType,
          status: syncRecord.status,
          createdAt: syncRecord.createdAt,
        },
      });
    } catch (error) {
      logger.error('Error syncing treatment:', error);

      // Log error
      await BpjsLogService.createLog({
        serviceType: 'sync',
        endpoint: `/sync/treatment/${req.params.visitId}`,
        method: 'POST',
        requestBody: req.body,
        errorMessage: error.message,
        statusCode: 500,
      });

      res.status(500).json({
        success: false,
        message: 'Error syncing treatment to BPJS',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Mendapatkan riwayat sinkronisasi berdasarkan kunjungan
   */
  static async getSyncHistory(req: Request, res: Response) {
    try {
      const { visitId } = req.params;

      if (!visitId) {
        return res.status(400).json({
          success: false,
          message: 'Visit ID is required',
        });
      }

      const syncHistory = await BpjsSyncService.getSyncHistoryByVisit(visitId);

      // Log aktivitas
      await BpjsLogService.createLog({
        serviceType: 'sync',
        endpoint: `/sync/history/${visitId}`,
        method: 'GET',
        responseBody: { count: syncHistory.length },
        statusCode: 200,
      });

      res.status(200).json({
        success: true,
        message: 'Sync history retrieved successfully',
        data: syncHistory.map(record => ({
          id: record.id,
          visitId: record.visitId,
          syncType: record.syncType,
          status: record.status,
          bpjsReference: record.bpjsReference,
          errorMessage: record.errorMessage,
          syncedAt: record.syncedAt,
          createdAt: record.createdAt,
        })),
      });
    } catch (error) {
      logger.error('Error getting sync history:', error);

      // Log error
      await BpjsLogService.createLog({
        serviceType: 'sync',
        endpoint: `/sync/history/${req.params.visitId}`,
        method: 'GET',
        errorMessage: error.message,
        statusCode: 500,
      });

      res.status(500).json({
        success: false,
        message: 'Error retrieving sync history',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Memperbarui status sinkronisasi
   */
  static async updateSyncStatus(req: Request, res: Response) {
    try {
      const { syncRecordId } = req.params;
      const { status, bpjsResponse, errorMessage } = req.body;

      if (!syncRecordId) {
        return res.status(400).json({
          success: false,
          message: 'Sync record ID is required',
        });
      }

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required',
        });
      }

      const syncRecord = await BpjsSyncService.updateSyncStatus(syncRecordId, status, bpjsResponse, errorMessage);

      // Log aktivitas
      await BpjsLogService.createLog({
        serviceType: 'sync',
        endpoint: `/sync/status/${syncRecordId}`,
        method: 'PUT',
        requestBody: { status, bpjsResponse, errorMessage },
        responseBody: { id: syncRecord.id, status: syncRecord.status },
        statusCode: 200,
      });

      res.status(200).json({
        success: true,
        message: 'Sync status updated successfully',
        data: {
          id: syncRecord.id,
          visitId: syncRecord.visitId,
          syncType: syncRecord.syncType,
          status: syncRecord.status,
          bpjsReference: syncRecord.bpjsReference,
          errorMessage: syncRecord.errorMessage,
          syncedAt: syncRecord.syncedAt,
        },
      });
    } catch (error) {
      logger.error('Error updating sync status:', error);

      // Log error
      await BpjsLogService.createLog({
        serviceType: 'sync',
        endpoint: `/sync/status/${req.params.syncRecordId}`,
        method: 'PUT',
        requestBody: req.body,
        errorMessage: error.message,
        statusCode: 500,
      });

      res.status(500).json({
        success: false,
        message: 'Error updating sync status',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
}