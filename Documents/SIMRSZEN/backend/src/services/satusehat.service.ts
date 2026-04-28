import { PrismaClient, Patient, Visit, MedicalRecord } from '@prisma/client';
import axios from 'axios';
import { logger } from '../utils/logger.util';

const prisma = new PrismaClient();

interface SatuSehatAuth {
  id: string;
  clientId: string;
  clientSecret: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiry: Date;
  organizationId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SatuSehatResource {
  id: string;
  resourceId: string;
  resourceType: string;
  localId: string;
  localType: string;
  lastSynced: Date;
  syncStatus: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class SatuSehatService {
  private static baseURL = process.env.SATUSEHAT_BASE_URL || 'https://api-satusehat-dev.bpmn.io';
  private static clientId = process.env.SATUSEHAT_CLIENT_ID;
  private static clientSecret = process.env.SATUSEHAT_CLIENT_SECRET;
  private static organizationCode = process.env.SATUSEHAT_ORGANIZATION_CODE;

  /**
   * Otentikasi ke SATU SEHAT
   */
  static async authenticate(): Promise<string> {
    try {
      if (!this.clientId || !this.clientSecret) {
        throw new Error('Client credentials for SATU SEHAT not configured');
      }

      const authUrl = `${this.baseURL}/oauth2/token`;
      const authString = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

      const response = await axios.post(authUrl, {
        grant_type: 'client_credentials',
        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        client_assertion: '' // Harus diimplementasikan dengan JWT signing
      }, {
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data.access_token;
    } catch (error) {
      logger.error('Error authenticating with SATU SEHAT:', error);
      throw error;
    }
  }

  /**
   * Konversi data pasien ke format FHIR
   */
  static convertPatientToFHIR(patient: Patient): any {
    return {
      resourceType: 'Patient',
      id: patient.patientId,
      identifier: [
        {
          system: 'http://sys-ids.kemkes.go.id/patient',
          value: patient.patientId
        },
        ...(patient.nik ? [{
          system: 'https://fhir.kemkes.go.id/id/nik',
          value: patient.nik
        }] : []),
        ...(patient.noKartu ? [{
          system: 'https://fhir.kemkes.go.id/id/bpjs',
          value: patient.noKartu
        }] : [])
      ],
      name: [
        {
          use: 'official',
          text: patient.nama
        }
      ],
      gender: patient.jenisKelamin.toLowerCase() === 'l' ? 'male' : 'female',
      birthDate: patient.tanggalLahir ? patient.tanggalLahir.toISOString().split('T')[0] : undefined,
      address: patient.alamat ? [{
        text: patient.alamat
      }] : [],
      telecom: patient.noHp ? [{
        system: 'phone',
        value: patient.noHp
      }] : []
    };
  }

  /**
   * Konversi data kunjungan ke format FHIR Encounter
   */
  static convertVisitToFHIR(visit: Visit, patient: Patient): any {
    return {
      resourceType: 'Encounter',
      id: visit.visitId,
      status: visit.statusKunjungan === 'selesai' ? 'finished' : 'in-progress',
      class: {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'AMB',
        display: 'ambulatory'
      },
      type: [
        {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '185349003',
              display: 'Encounter for check up'
            }
          ]
        }
      ],
      subject: {
        reference: `Patient/${patient.patientId}`
      },
      period: {
        start: visit.tanggalPeriksa.toISOString(),
        end: visit.statusKunjungan === 'selesai' ? visit.updatedAt.toISOString() : undefined
      }
    };
  }

  /**
   * Kirim data pasien ke SATU SEHAT
   */
  static async sendPatientToSatuSehat(patientId: string): Promise<SatuSehatResource> {
    try {
      const patient = await prisma.patient.findUnique({
        where: { id: patientId }
      });

      if (!patient) {
        throw new Error(`Patient with ID ${patientId} not found`);
      }

      const token = await this.authenticate();
      const fhirPatient = this.convertPatientToFHIR(patient);

      const response = await axios.post(`${this.baseURL}/fhir-r4/Patient`, fhirPatient, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Simpan referensi resource
      const resourceRef = await prisma.$executeRaw`
        INSERT INTO "SatuSehatResource" (
          "id", "resourceId", "resourceType", "localId", "localType", 
          "lastSynced", "syncStatus", "created_at", "updated_at"
        ) VALUES (
          gen_random_uuid(), ${response.data.id}, 'Patient', ${patient.id}, 'Patient',
          NOW(), 'success', NOW(), NOW()
        )
        ON CONFLICT ("localId", "localType") 
        DO UPDATE SET 
          "resourceId" = EXCLUDED."resourceId",
          "lastSynced" = EXCLUDED."lastSynced",
          "syncStatus" = EXCLUDED."syncStatus",
          "updated_at" = EXCLUDED."updated_at"
      `;

      return {
        id: `ssr-${Date.now()}`,
        resourceId: response.data.id,
        resourceType: 'Patient',
        localId: patient.id,
        localType: 'Patient',
        lastSynced: new Date(),
        syncStatus: 'success',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error sending patient to SATU SEHAT:', error);
      
      // Simpan error
      await prisma.$executeRaw`
        INSERT INTO "SatuSehatResource" (
          "id", "resourceId", "resourceType", "localId", "localType", 
          "lastSynced", "syncStatus", "error_message", "created_at", "updated_at"
        ) VALUES (
          gen_random_uuid(), NULL, 'Patient', ${patientId}, 'Patient',
          NOW(), 'failed', ${error.message}, NOW(), NOW()
        )
        ON CONFLICT ("localId", "localType") 
        DO UPDATE SET 
          "lastSynced" = EXCLUDED."lastSynced",
          "syncStatus" = EXCLUDED."syncStatus",
          "error_message" = EXCLUDED."error_message",
          "updated_at" = EXCLUDED."updated_at"
      `;

      throw error;
    }
  }

  /**
   * Kirim data kunjungan ke SATU SEHAT
   */
  static async sendVisitToSatuSehat(visitId: string): Promise<SatuSehatResource> {
    try {
      const visit = await prisma.visit.findUnique({
        where: { id: visitId },
        include: {
          patient: true
        }
      });

      if (!visit) {
        throw new Error(`Visit with ID ${visitId} not found`);
      }

      const token = await this.authenticate();
      const fhirEncounter = this.convertVisitToFHIR(visit, visit.patient);

      const response = await axios.post(`${this.baseURL}/fhir-r4/Encounter`, fhirEncounter, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Simpan referensi resource
      await prisma.$executeRaw`
        INSERT INTO "SatuSehatResource" (
          "id", "resourceId", "resourceType", "localId", "localType", 
          "lastSynced", "syncStatus", "created_at", "updated_at"
        ) VALUES (
          gen_random_uuid(), ${response.data.id}, 'Encounter', ${visit.id}, 'Visit',
          NOW(), 'success', NOW(), NOW()
        )
        ON CONFLICT ("localId", "localType") 
        DO UPDATE SET 
          "resourceId" = EXCLUDED."resourceId",
          "lastSynced" = EXCLUDED."lastSynced",
          "syncStatus" = EXCLUDED."syncStatus",
          "updated_at" = EXCLUDED."updated_at"
      `;

      return {
        id: `ssr-${Date.now()}`,
        resourceId: response.data.id,
        resourceType: 'Encounter',
        localId: visit.id,
        localType: 'Visit',
        lastSynced: new Date(),
        syncStatus: 'success',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error sending visit to SATU SEHAT:', error);
      
      // Simpan error
      await prisma.$executeRaw`
        INSERT INTO "SatuSehatResource" (
          "id", "resourceId", "resourceType", "localId", "localType", 
          "lastSynced", "syncStatus", "error_message", "created_at", "updated_at"
        ) VALUES (
          gen_random_uuid(), NULL, 'Encounter', ${visitId}, 'Visit',
          NOW(), 'failed', ${error.message}, NOW(), NOW()
        )
        ON CONFLICT ("localId", "localType") 
        DO UPDATE SET 
          "lastSynced" = EXCLUDED."lastSynced",
          "syncStatus" = EXCLUDED."syncStatus",
          "error_message" = EXCLUDED."error_message",
          "updated_at" = EXCLUDED."updated_at"
      `;

      throw error;
    }
  }

  /**
   * Sinkronisasi batch data ke SATU SEHAT
   */
  static async syncBatchToSatuSehat(dataType: 'patient' | 'visit', ids: string[]): Promise<{ success: number, failed: number }> {
    let successCount = 0;
    let failedCount = 0;

    for (const id of ids) {
      try {
        if (dataType === 'patient') {
          await this.sendPatientToSatuSehat(id);
        } else if (dataType === 'visit') {
          await this.sendVisitToSatuSehat(id);
        }
        successCount++;
      } catch (error) {
        logger.error(`Failed to sync ${dataType} ${id}:`, error);
        failedCount++;
      }
    }

    return { success: successCount, failed: failedCount };
  }
}