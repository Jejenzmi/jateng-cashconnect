import { Request, Response } from 'express';
import { BpjsConfigService } from '../services/bpjs-config.service';
import { BpjsLogService } from '../services/bpjs-log.service';
import { logger } from '../utils/logger.util';

export class BpjsConfigController {
  /**
   * Membuat konfigurasi BPJS baru
   */
  static async createConfig(req: Request, res: Response) {
    try {
      const {
        name,
        consumerId,
        consumerSecret,
        username,
        password,
        userKey,
        baseUrl,
        serviceName
      } = req.body;

      // Validasi input
      if (!name || !consumerId || !consumerSecret || !username || !password || !userKey || !baseUrl || !serviceName) {
        return res.status(400).json({
          success: false,
          message: 'Semua field wajib diisi',
        });
      }

      const config = await BpjsConfigService.createConfig({
        name,
        consumerId,
        consumerSecret,
        username,
        password,
        userKey,
        baseUrl,
        serviceName
      });

      // Log aktivitas
      await BpjsLogService.createLog({
        serviceType: 'config',
        endpoint: '/bpjs/config',
        method: 'POST',
        requestBody: req.body,
        responseBody: { id: config.id, name: config.name },
        statusCode: 201,
      });

      res.status(201).json({
        success: true,
        message: 'Konfigurasi BPJS berhasil dibuat',
        data: {
          id: config.id,
          name: config.name,
          baseUrl: config.baseUrl,
          serviceName: config.serviceName,
          isActive: config.isActive,
          createdAt: config.createdAt,
        },
      });
    } catch (error) {
      logger.error('Error creating BPJS config:', error);
      
      // Log error
      await BpjsLogService.createLog({
        serviceType: 'config',
        endpoint: '/bpjs/config',
        method: 'POST',
        requestBody: req.body,
        errorMessage: error.message,
        statusCode: 500,
      });

      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat membuat konfigurasi BPJS',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Mendapatkan konfigurasi BPJS berdasarkan nama
   */
  static async getConfigByName(req: Request, res: Response) {
    try {
      const { name } = req.params;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Nama konfigurasi wajib diisi',
        });
      }

      const config = await BpjsConfigService.getConfigByName(name);

      if (!config) {
        return res.status(404).json({
          success: false,
          message: 'Konfigurasi tidak ditemukan',
        });
      }

      // Log aktivitas
      await BpjsLogService.createLog({
        serviceType: 'config',
        endpoint: `/bpjs/config/${name}`,
        method: 'GET',
        responseBody: { id: config.id, name: config.name },
        statusCode: 200,
      });

      res.status(200).json({
        success: true,
        message: 'Konfigurasi BPJS ditemukan',
        data: {
          id: config.id,
          name: config.name,
          baseUrl: config.baseUrl,
          serviceName: config.serviceName,
          isActive: config.isActive,
          createdAt: config.createdAt,
          updatedAt: config.updatedAt,
        },
      });
    } catch (error) {
      logger.error('Error getting BPJS config:', error);
      
      // Log error
      await BpjsLogService.createLog({
        serviceType: 'config',
        endpoint: `/bpjs/config/${req.params.name}`,
        method: 'GET',
        errorMessage: error.message,
        statusCode: 500,
      });

      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil konfigurasi BPJS',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Mendapatkan semua konfigurasi BPJS
   */
  static async getAllConfigs(req: Request, res: Response) {
    try {
      const configs = await BpjsConfigService.getAllConfigs();

      // Log aktivitas
      await BpjsLogService.createLog({
        serviceType: 'config',
        endpoint: '/bpjs/config',
        method: 'GET',
        responseBody: { count: configs.length },
        statusCode: 200,
      });

      res.status(200).json({
        success: true,
        message: 'Daftar konfigurasi BPJS berhasil diambil',
        data: configs.map(config => ({
          id: config.id,
          name: config.name,
          baseUrl: config.baseUrl,
          serviceName: config.serviceName,
          isActive: config.isActive,
          createdAt: config.createdAt,
          updatedAt: config.updatedAt,
        })),
      });
    } catch (error) {
      logger.error('Error getting all BPJS configs:', error);
      
      // Log error
      await BpjsLogService.createLog({
        serviceType: 'config',
        endpoint: '/bpjs/config',
        method: 'GET',
        errorMessage: error.message,
        statusCode: 500,
      });

      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil daftar konfigurasi BPJS',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Memperbarui konfigurasi BPJS
   */
  static async updateConfig(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const updateData = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Nama konfigurasi wajib diisi',
        });
      }

      const config = await BpjsConfigService.updateConfig(name, updateData);

      // Log aktivitas
      await BpjsLogService.createLog({
        serviceType: 'config',
        endpoint: `/bpjs/config/${name}`,
        method: 'PUT',
        requestBody: updateData,
        responseBody: { id: config.id, name: config.name },
        statusCode: 200,
      });

      res.status(200).json({
        success: true,
        message: 'Konfigurasi BPJS berhasil diperbarui',
        data: {
          id: config.id,
          name: config.name,
          baseUrl: config.baseUrl,
          serviceName: config.serviceName,
          isActive: config.isActive,
          createdAt: config.createdAt,
          updatedAt: config.updatedAt,
        },
      });
    } catch (error) {
      logger.error('Error updating BPJS config:', error);
      
      // Log error
      await BpjsLogService.createLog({
        serviceType: 'config',
        endpoint: `/bpjs/config/${req.params.name}`,
        method: 'PUT',
        requestBody: req.body,
        errorMessage: error.message,
        statusCode: 500,
      });

      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat memperbarui konfigurasi BPJS',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Menghapus konfigurasi BPJS
   */
  static async deleteConfig(req: Request, res: Response) {
    try {
      const { name } = req.params;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Nama konfigurasi wajib diisi',
        });
      }

      const config = await BpjsConfigService.deleteConfig(name);

      // Log aktivitas
      await BpjsLogService.createLog({
        serviceType: 'config',
        endpoint: `/bpjs/config/${name}`,
        method: 'DELETE',
        responseBody: { id: config.id, name: config.name },
        statusCode: 200,
      });

      res.status(200).json({
        success: true,
        message: 'Konfigurasi BPJS berhasil dihapus',
        data: {
          id: config.id,
          name: config.name,
        },
      });
    } catch (error) {
      logger.error('Error deleting BPJS config:', error);
      
      // Log error
      await BpjsLogService.createLog({
        serviceType: 'config',
        endpoint: `/bpjs/config/${req.params.name}`,
        method: 'DELETE',
        errorMessage: error.message,
        statusCode: 500,
      });

      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat menghapus konfigurasi BPJS',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Mengaktifkan atau menonaktifkan konfigurasi BPJS
   */
  static async toggleConfigStatus(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const { isActive } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Nama konfigurasi wajib diisi',
        });
      }

      if (isActive === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Status aktif wajib diisi (true/false)',
        });
      }

      const config = await BpjsConfigService.toggleConfigStatus(name, isActive);

      // Log aktivitas
      await BpjsLogService.createLog({
        serviceType: 'config',
        endpoint: `/bpjs/config/${name}/toggle`,
        method: 'PATCH',
        requestBody: { isActive },
        responseBody: { id: config.id, name: config.name, isActive: config.isActive },
        statusCode: 200,
      });

      res.status(200).json({
        success: true,
        message: `Konfigurasi BPJS berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
        data: {
          id: config.id,
          name: config.name,
          isActive: config.isActive,
        },
      });
    } catch (error) {
      logger.error('Error toggling BPJS config status:', error);
      
      // Log error
      await BpjsLogService.createLog({
        serviceType: 'config',
        endpoint: `/bpjs/config/${req.params.name}/toggle`,
        method: 'PATCH',
        requestBody: req.body,
        errorMessage: error.message,
        statusCode: 500,
      });

      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengubah status konfigurasi BPJS',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
}