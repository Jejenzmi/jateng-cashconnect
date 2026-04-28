import { Request, Response } from 'express';
import { SatuSehatService } from '../services/satusehatService';
import { PatientService } from '../services/patientService';

const satusehatService = new SatuSehatService();

// Interface untuk konfigurasi Satu Sehat
interface SatuSehatConfig {
  active: boolean;
  organizationId: string;
  clientId: string;
  clientSecret: string;
}

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class SatuSehatController {
  static async syncPatient(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;
      
      // Ambil data pasien dari database lokal
      const patient = await PatientService.getById(patientId);
      
      if (!patient) {
        res.status(404).json({
          success: false,
          message: 'Pasien tidak ditemukan',
        });
        return;
      }

      // Sinkronkan ke Satu Sehat
      const result = await satusehatService.createPatient(patient);
      
      res.status(200).json({
        success: true,
        message: 'Pasien berhasil disinkronkan ke Satu Sehat',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  static async getPatient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const result = await satusehatService.getPatient(id);
      
      res.status(200).json({
        success: true,
        message: 'Data pasien berhasil diambil dari Satu Sehat',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  static async updatePatient(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;
      
      // Ambil data pasien dari database lokal
      const patient = await PatientService.getById(patientId);
      
      if (!patient) {
        res.status(404).json({
          success: false,
          message: 'Pasien tidak ditemukan',
        });
        return;
      }

      // Update di Satu Sehat
      const result = await satusehatService.updatePatient(patient);
      
      res.status(200).json({
        success: true,
        message: 'Pasien berhasil diperbarui di Satu Sehat',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  static async createEncounter(req: Request, res: Response): Promise<void> {
    try {
      const encounterData = req.body;
      
      const result = await satusehatService.createEncounter(encounterData);
      
      res.status(200).json({
        success: true,
        message: 'Encounter berhasil dibuat di Satu Sehat',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  static async createCondition(req: Request, res: Response): Promise<void> {
    try {
      const conditionData = req.body;
      
      const result = await satusehatService.createCondition(conditionData);
      
      res.status(200).json({
        success: true,
        message: 'Condition berhasil dibuat di Satu Sehat',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  static async createObservation(req: Request, res: Response): Promise<void> {
    try {
      const observationData = req.body;
      
      const result = await satusehatService.createObservation(observationData);
      
      res.status(200).json({
        success: true,
        message: 'Observation berhasil dibuat di Satu Sehat',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  static async getTokenInfo(_req: Request, res: Response): Promise<void> {
    try {
      const authService = await import('../services/satusehatAuthService').then(
        module => module.SatuSehatAuthService.getInstance()
      );
      const info = authService.getTokenInfo();
      
      res.status(200).json({
        success: true,
        message: 'Informasi token Satu Sehat',
        data: info,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  static async saveSettings(req: Request, res: Response) {
    try {
      const { active, organizationId, clientId, clientSecret, environment } = req.body;

      // Validasi input
      if (!organizationId || !clientId || !clientSecret) {
        res.status(400).json({
          error: 'Organization ID, Client ID, dan Client Secret wajib diisi'
        });
        return;
      }

      // Dalam implementasi nyata, kita akan menyimpan ke database
      const existingConfig = await prisma.satusehatConfig.findFirst();
      
      if (existingConfig) {
        await prisma.satusehatConfig.update({
          where: { id: existingConfig.id },
          data: { 
            active: active ?? existingConfig.active, 
            organizationId, 
            clientId, 
            clientSecret,
            environment: environment || existingConfig.environment
          }
        });
      } else {
        await prisma.satusehatConfig.create({
          data: { 
            active: active ?? false, 
            organizationId, 
            clientId, 
            clientSecret,
            environment: environment || 'staging'
          }
        });
      }

      res.status(200).json({
        message: 'Konfigurasi integrasi Satu Sehat berhasil disimpan ke database',
        success: true
      });
    } catch (error) {
      console.error('Error saving Satu Sehat settings:', error);
      res.status(500).json({
        error: 'Terjadi kesalahan saat menyimpan konfigurasi Satu Sehat'
      });
    }
  }

  static async getSettings(_req: Request, res: Response) {
    try {
      const config = await prisma.satusehatConfig.findFirst();
      
      let currentConfig;
      if (config) {
        currentConfig = {
          active: config.active,
          organizationId: config.organizationId,
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          environment: config.environment
        };
      } else {
        currentConfig = {
          active: process.env.SATUSEHAT_ACTIVE === 'true',
          organizationId: process.env.SATUSEHAT_ORGANIZATION_CODE || 'b1eb0d2d-feb8-44da-b0ab-a32c8e7fa5a3',
          clientId: process.env.SATUSEHAT_CLIENT_ID || 'QzABfhf3NaJbrB2ZZEBNVKvuYiQfPINAtEybmn4Q9tueFOe1',
          clientSecret: process.env.SATUSEHAT_CLIENT_SECRET || 'sMcm1O30cbpyBy7iKmAUYoSu4AUY1G6K6o0ExX5eii5ycjxyuV1L620vG6AlwWOg',
          environment: 'staging'
        };
      }
      
      res.status(200).json({
        config: currentConfig,
        success: true
      });
    } catch (error) {
      console.error('Error getting Satu Sehat settings:', error);
      res.status(500).json({
        error: 'Terjadi kesalahan saat mengambil konfigurasi Satu Sehat'
      });
    }
  }

  static async testConnection(req: Request, res: Response) {
    try {
      const { organizationId, clientId, clientSecret } = req.body;
      
      // Validasi input
      if (!organizationId || !clientId || !clientSecret) {
        res.status(400).json({
          connected: false,
          message: 'Organization ID, Client ID, dan Client Secret diperlukan untuk pengujian koneksi'
        });
        return;
      }
      
      const axios = require('axios');
      // Gunakan environment staging/sandbox URL
      const authUrl = 'https://api-satusehat-stg.dto.kemkes.go.id/oauth2/v1/accesstoken?grant_type=client_credentials';
      
      try {
        const response = await axios.post(
          authUrl,
          new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret
          }).toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );

        if (response.data && response.data.access_token) {
          res.status(200).json({
            connected: true,
            message: 'Berhasil terhubung ke layanan Satu Sehat dan token divalidasi',
            organizationId
          });
        } else {
          res.status(200).json({
            connected: false,
            message: 'Terhubung ke endpoint API, namun gagal mendapatkan access token valid'
          });
        }
      } catch (authError: any) {
        console.error('SATU SEHAT Auth Error:', authError.response?.data || authError.message);
        res.status(200).json({
          connected: false,
          message: 'Gagal terhubung ke layanan Satu Sehat. Pastikan kredensial benar. ' + (authError.response?.data?.issue?.[0]?.diagnostics || authError.message)
        });
      }
    } catch (error) {
      console.error('Error testing Satu Sehat connection:', error);
      res.status(500).json({
        connected: false,
        error: 'Terjadi kesalahan internal saat menguji koneksi ke layanan Satu Sehat'
      });
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      const patientCount = await prisma.patient.count();
      const doctorCount = await prisma.doctor.count();
      const visitCount = await prisma.visit.count();
      
      const stats = [
        {
          id: 'pasien',
          title: 'Total Pasien',
          total: patientCount,
          synced: 0,
          failed: 0,
          pending: patientCount,
          lastSync: new Date().toISOString()
        },
        {
          id: 'dokter',
          title: 'Total Praktisi',
          total: doctorCount,
          synced: 0,
          failed: 0,
          pending: doctorCount,
          lastSync: new Date().toISOString()
        },
        {
          id: 'kunjungan',
          title: 'Total Kunjungan',
          total: visitCount,
          synced: 0,
          failed: 0,
          pending: visitCount,
          lastSync: new Date().toISOString()
        }
      ];
      res.status(200).json({ stats, success: true });
    } catch (e) {
      console.error('Error fetching Satu Sehat stats:', e);
      res.status(500).json({ error: 'Gagal mengambil statistik Satu Sehat' });
    }
  }

  static async batchSync(req: Request, res: Response) {
    try {
      const { SatuSehatService } = require('../services/satusehatService');
      const satusehatService = new SatuSehatService();
      
      // Ambil 5 pasien teratas yang belum dihapus untuk disinkronkan
      const patients = await prisma.patient.findMany({
        where: { isDeleted: false },
        take: 5
      });

      if (!patients || patients.length === 0) {
        res.status(404).json({ success: false, message: 'Tidak ada data pasien untuk disinkronkan.' });
        return;
      }

      let successCount = 0;
      let failCount = 0;
      let errors: any[] = [];

      for (const patient of patients) {
        try {
          await satusehatService.createPatient(patient);
          successCount++;
        } catch (error: any) {
          failCount++;
          errors.push({
            patientName: patient.name,
            error: error.message || 'Unknown error'
          });
        }
      }

      res.status(200).json({ 
        success: true, 
        message: `Sinkronisasi batch selesai. Sukses: ${successCount}, Gagal: ${failCount}`,
        details: { successCount, failCount, errors }
      });
    } catch (e: any) {
      console.error('Error during batch sync:', e);
      res.status(500).json({ error: 'Gagal melakukan sinkronisasi batch', details: e.message });
    }
  }

  static async getLogs(req: Request, res: Response) {
    try {
      res.status(200).json({ logs: [], success: true });
    } catch (e) {
      console.error('Error fetching Satu Sehat logs:', e);
      res.status(500).json({ error: 'Gagal mengambil log Satu Sehat' });
    }
  }
}