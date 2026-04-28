import { PrismaClient, Visit, Patient, MedicalRecord } from '@prisma/client';
import axios from 'axios';
import crypto from 'crypto';
import { logger } from '../utils/logger.util';

const prisma = new PrismaClient();

interface EClaimSubmission {
  id: string;
  noKlaim: string;
  status: string;
  response?: any;
  message?: string;
}

export class EClaimService {
  private static baseURL = process.env.ECLAIM_BASE_URL || 'https://new-api.bpjs-kesehatan.go.id';
  private static consId = process.env.BPJS_CONS_ID;
  private static secret = process.env.BPJS_SECRET;
  private static userKey = process.env.BPJS_USER_KEY;

  /**
   * Membuat timestamp untuk otentikasi
   */
  private static generateTimestamp(): string {
    return Math.floor(new Date().getTime() / 1000).toString();
  }

  /**
   * Membuat signature untuk otentikasi
   */
  private static generateSignature(timestamp: string): string {
    if (!this.secret) {
      throw new Error('BPJS Secret not configured');
    }
    return crypto.createHmac('sha256', this.secret)
      .update(this.consId + '&' + timestamp)
      .digest('base64');
  }

  /**
   * Membuat header otentikasi
   */
  private static getAuthHeaders(): any {
    const timestamp = this.generateTimestamp();
    const signature = this.generateSignature(timestamp);

    return {
      'X-cons-id': this.consId,
      'X-timestamp': timestamp,
      'X-signature': signature,
      'X-user-key': this.userKey,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Format data kunjungan ke format klaim E-Claim
   */
  static async formatClaimData(visitId: string): Promise<any> {
    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      include: {
        patient: true,
        poli: true,
        dokter: true,
        medicalRecords: {
          include: {
            dokter: true
          }
        }
      }
    });

    if (!visit) {
      throw new Error(`Visit with ID ${visitId} not found`);
    }

    const latestMedicalRecord = visit.medicalRecords.length > 0 
      ? visit.medicalRecords[visit.medicalRecords.length - 1] 
      : null;

    // Format data untuk klaim E-Claim
    const claimData = {
      request: {
        t_sep: {
          noKartu: visit.patient.noKartu || '',
          tglSep: visit.tanggalPeriksa.toISOString().split('T')[0],
          ppkPelayanan: process.env.BPJS_PPK_CODE || '00000',
          jnsPelayanan: visit.statusKunjungan === 'rawat_inap' ? '1' : '2', // 1=Inap, 2=Jalan
          klsRawat: {
            kls: '1' // Default kelas 1
          },
          noMR: visit.patient.patientId,
          rujukan: {
            asalRujukan: '2', // 2=RS
            tglRujukan: visit.tanggalPeriksa.toISOString().split('T')[0],
            noRujukan: `R-${visit.id.substring(0, 8)}`,
            ppkRujukan: process.env.BPJS_PPK_RUJUKAN_CODE || '00000'
          },
          catatan: visit.catatan || '',
          diagnosa: latestMedicalRecord?.icd10Diagnosa || 'A00.1',
          poli: {
            tujuan: visit.poli.kode,
            nama: visit.poli.nama
          },
          cob: {
            cob: '0'
          },
          katarak: {
            katarak: '0'
          },
          sepUser: process.env.BPJS_USER_NAME || 'SIMRSZEN',
          tglPlgPlan: new Date(visit.tanggalPeriksa.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          noTelepon: visit.patient.noHp || '',
          user: process.env.BPJS_USER_NAME || 'SIMRSZEN'
        }
      }
    };

    return claimData;
  }

  /**
   * Membuat Surat Eligibilitas Peserta (SEP)
   */
  static async createSEP(visitId: string): Promise<EClaimSubmission> {
    try {
      const claimData = await this.formatClaimData(visitId);
      const headers = this.getAuthHeaders();
      const url = `${this.baseURL}/vclaim-rest/SEP/1.1/insert`;

      const response = await axios.post(url, claimData, { headers });

      // Simulasi response - dalam implementasi nyata, ini akan dari server BPJS
      return {
        id: `eclaim-${Date.now()}`,
        noKlaim: `SEP-${visitId.substring(0, 8)}-${Date.now()}`,
        status: response.data?.metaData?.code === '200' ? 'success' : 'failed',
        response: response.data,
        message: response.data?.metaData?.message || 'SEP created successfully'
      };
    } catch (error) {
      logger.error('Error creating SEP:', error);
      
      if (error.response) {
        return {
          id: `eclaim-${Date.now()}`,
          noKlaim: `SEP-${visitId.substring(0, 8)}-ERROR`,
          status: 'failed',
          response: error.response.data,
          message: error.response.data?.metaData?.message || error.message
        };
      } else {
        throw error;
      }
    }
  }

  /**
   * Submit klaim E-Claim ke server BPJS
   */
  static async submitClaim(visitId: string, additionalData?: any): Promise<EClaimSubmission> {
    try {
      // Dalam implementasi nyata, kita akan mengirimkan data klaim ke server BPJS
      // Di sini kita hanya mensimulasikan prosesnya
      
      // Dapatkan data kunjungan
      const visit = await prisma.visit.findUnique({
        where: { id: visitId },
        include: {
          patient: true,
          medicalRecords: true
        }
      });

      if (!visit) {
        throw new Error(`Visit with ID ${visitId} not found`);
      }

      // Simulasi data klaim
      const claimPayload = {
        noKlaim: `KLAIM-${visitId.substring(0, 8)}-${Date.now()}`,
        jnsPelayanan: visit.statusKunjungan === 'rawat_inap' ? '1' : '2',
        catatan: visit.catatan || 'Klaim dari SIMRS ZEN',
        diagnosa: visit.medicalRecords.length > 0 ? visit.medicalRecords[0].icd10Diagnosa : 'A00.1',
        procedure: visit.medicalRecords.length > 0 ? visit.medicalRecords[0].icd9Prosedur : '',
        subKlaim: '1',
        estCost: Number(visit.totalBiaya || 5000000),
        flagProcedure: '1',
        kdPoli: 'INT',
        los: '3',
        admisi: '1',
        dischStat: '1',
        pnyTanggungJawab: visit.patient.nama
      };

      // Simulasi pengiriman ke server BPJS
      logger.info(`E-Claim submitted for visit ${visitId}: ${claimPayload.noKlaim}`);

      return {
        id: `eclaim-${Date.now()}`,
        noKlaim: claimPayload.noKlaim,
        status: 'submitted',
        response: {
          metaData: {
            code: '200',
            message: 'Klaim berhasil diajukan'
          },
          response: {
            noKlaim: claimPayload.noKlaim,
            status: 'Submitted'
          }
        },
        message: 'Klaim E-Claim berhasil diajukan'
      };
    } catch (error) {
      logger.error('Error submitting E-Claim:', error);
      
      return {
        id: `eclaim-${Date.now()}`,
        noKlaim: `KLAIM-${visitId.substring(0, 8)}-ERROR`,
        status: 'failed',
        message: error.message
      };
    }
  }

  /**
   * Update klaim E-Claim
   */
  static async updateClaim(noKlaim: string, updateData: any): Promise<EClaimSubmission> {
    try {
      // Dalam implementasi nyata, kita akan mengirimkan update ke server BPJS
      logger.info(`E-Claim updated for claim number ${noKlaim}`);

      return {
        id: `eclaim-${Date.now()}`,
        noKlaim,
        status: 'updated',
        response: {
          metaData: {
            code: '200',
            message: 'Klaim berhasil diperbarui'
          },
          response: {
            noKlaim,
            status: 'Updated'
          }
        },
        message: 'Klaim E-Claim berhasil diperbarui'
      };
    } catch (error) {
      logger.error('Error updating E-Claim:', error);
      
      return {
        id: `eclaim-${Date.now()}`,
        noKlaim,
        status: 'failed',
        message: error.message
      };
    }
  }

  /**
   * Cek status klaim
   */
  static async getClaimStatus(noKlaim: string): Promise<any> {
    try {
      // Dalam implementasi nyata, kita akan mengambil status dari server BPJS
      return {
        noKlaim,
        status: 'approved', // atau 'rejected', 'pending', 'in-process'
        approvedAmount: 4500000,
        message: 'Klaim disetujui',
        processedDate: new Date(),
        details: {
          admissionDate: new Date(),
          dischargeDate: new Date(),
          diagnosis: 'A00.1',
          procedure: '12345',
          provider: 'SIMRS ZEN'
        }
      };
    } catch (error) {
      logger.error('Error getting claim status:', error);
      throw error;
    }
  }

  /**
   * Cek eligibility peserta
   */
  static async checkEligibility(noKartu: string, tglRencanaKunjungan: string): Promise<any> {
    try {
      const timestamp = this.generateTimestamp();
      const signature = this.generateSignature(timestamp);
      const headers = {
        'X-cons-id': this.consId,
        'X-timestamp': timestamp,
        'X-signature': signature,
        'X-user-key': this.userKey,
        'Content-Type': 'application/json'
      };

      const url = `${this.baseURL}/vclaim-rest/Peserta/nokartu/${noKartu}/tglSEP/${tglRencanaKunjungan}`;

      // Dalam implementasi nyata, kita akan mengirim ke server BPJS
      // Di sini kita hanya mengembalikan data simulasi
      return {
        noKartu,
        peserta: {
          nama: 'JOHN DOE',
          nik: '1234567890123456',
          sex: 'L',
          tglLahir: '1990-01-01',
          kelasTanggungan: '1',
          ppkPelayanan: '0001',
          tglCetakKartu: '2020-01-01',
          tglTAT: '2025-12-31',
          batasPelayanan: null,
          jenisPeserta: 'PBI',
          nmJenisPeserta: 'PENERIMA BANTUAN IURAN'
        },
        meta: {
          code: 200,
          message: 'Success'
        }
      };
    } catch (error) {
      logger.error('Error checking eligibility:', error);
      throw error;
    }
  }
}