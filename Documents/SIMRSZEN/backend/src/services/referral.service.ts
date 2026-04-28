import { PrismaClient, Patient, Visit, Dokter, Poli } from '@prisma/client';
import { BpjsSyncService } from './bpjs-sync.service';
import { logger } from '../utils/logger.util';

const prisma = new PrismaClient();

// Entitas untuk rujukan - karena belum ada di schema, kita gunakan model sementara
interface Referral {
  id: string;
  nomorRujukan: string;
  patientId: string;
  pengirimRsjId: string; // ID rumah sakit pengirim
  tujuanRsjId: string;   // ID rumah sakit tujuan
  dokterPengirimId: string;
  dokterTujuanId: string;
  poliAsalId: string;
  poliTujuanId: string;
  tanggalRujukan: Date;
  catatan: string;
  status: string; // pending, approved, rejected, completed
  createdAt: Date;
  updatedAt: Date;
}

export class ReferralService {
  /**
   * Membuat permintaan rujukan
   */
  static async createReferral(data: {
    patientId: string;
    pengirimRsjId: string;
    tujuanRsjId: string;
    dokterPengirimId: string;
    dokterTujuanId: string;
    poliAsalId: string;
    poliTujuanId: string;
    catatan: string;
  }): Promise<Referral> {
    try {
      // Dalam implementasi nyata, kita akan membuat entitas rujukan di database
      // Untuk sekarang kita hanya mensimulasikan pembuatan rujukan
      
      const referral: Referral = {
        id: `REF-${Date.now()}`,
        nomorRujukan: `RSJ-R-${Date.now()}`,
        patientId: data.patientId,
        pengirimRsjId: data.pengirimRsjId,
        tujuanRsjId: data.tujuanRsjId,
        dokterPengirimId: data.dokterPengirimId,
        dokterTujuanId: data.dokterTujuanId,
        poliAsalId: data.poliAsalId,
        poliTujuanId: data.poliTujuanId,
        tanggalRujukan: new Date(),
        catatan: data.catatan,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Dalam implementasi nyata, kita akan menyimpan ke database
      // await prisma.referral.create({...});

      // Sinkronisasi ke BPJS jika diperlukan
      // await BpjsSyncService.syncReferralToBpjs(referral.id);

      return referral;
    } catch (error) {
      logger.error('Error creating referral:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan daftar rujukan
   */
  static async getReferrals(filter: {
    patientId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    isInternal?: boolean; // true untuk rujukan internal, false untuk eksternal
  } = {}): Promise<Referral[]> {
    try {
      // Dalam implementasi nyata, kita akan mengambil dari database
      // Untuk sekarang kita kembalikan array kosong sebagai placeholder
      
      const referrals: Referral[] = [
        {
          id: 'REF-1',
          nomorRujukan: 'RSJ-R-001',
          patientId: 'PATIENT-1',
          pengirimRsjId: 'RSJ-001',
          tujuanRsjId: 'RSJ-002',
          dokterPengirimId: 'DOC-1',
          dokterTujuanId: 'DOC-2',
          poliAsalId: 'POLI-1',
          poliTujuanId: 'POLI-2',
          tanggalRujukan: new Date(),
          catatan: 'Pasien memerlukan pemeriksaan spesialis',
          status: 'approved',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      return referrals;
    } catch (error) {
      logger.error('Error getting referrals:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan detail rujukan
   */
  static async getReferralById(referralId: string): Promise<Referral | null> {
    try {
      // Dalam implementasi nyata, kita akan mengambil dari database
      // Untuk sekarang kita kembalikan contoh data
      
      return {
        id: referralId,
        nomorRujukan: `RSJ-R-${referralId}`,
        patientId: 'PATIENT-1',
        pengirimRsjId: 'RSJ-001',
        tujuanRsjId: 'RSJ-002',
        dokterPengirimId: 'DOC-1',
        dokterTujuanId: 'DOC-2',
        poliAsalId: 'POLI-1',
        poliTujuanId: 'POLI-2',
        tanggalRujukan: new Date(),
        catatan: 'Pasien memerlukan pemeriksaan spesialis',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error getting referral by ID:', error);
      throw error;
    }
  }

  /**
   * Menyetujui rujukan
   */
  static async approveReferral(referralId: string, approvalNotes?: string): Promise<Referral> {
    try {
      // Dalam implementasi nyata, kita akan mengupdate database
      // Untuk sekarang kita kembalikan contoh data dengan status diubah
      
      const referral: Referral = {
        id: referralId,
        nomorRujukan: `RSJ-R-${referralId}`,
        patientId: 'PATIENT-1',
        pengirimRsjId: 'RSJ-001',
        tujuanRsjId: 'RSJ-002',
        dokterPengirimId: 'DOC-1',
        dokterTujuanId: 'DOC-2',
        poliAsalId: 'POLI-1',
        poliTujuanId: 'POLI-2',
        tanggalRujukan: new Date(),
        catatan: 'Pasien memerlukan pemeriksaan spesialis',
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return referral;
    } catch (error) {
      logger.error('Error approving referral:', error);
      throw error;
    }
  }

  /**
   * Menolak rujukan
   */
  static async rejectReferral(referralId: string, rejectionReason: string): Promise<Referral> {
    try {
      // Dalam implementasi nyata, kita akan mengupdate database
      // Untuk sekarang kita kembalikan contoh data dengan status diubah
      
      const referral: Referral = {
        id: referralId,
        nomorRujukan: `RSJ-R-${referralId}`,
        patientId: 'PATIENT-1',
        pengirimRsjId: 'RSJ-001',
        tujuanRsjId: 'RSJ-002',
        dokterPengirimId: 'DOC-1',
        dokterTujuanId: 'DOC-2',
        poliAsalId: 'POLI-1',
        poliTujuanId: 'POLI-2',
        tanggalRujukan: new Date(),
        catatan: 'Pasien memerlukan pemeriksaan spesialis',
        status: 'rejected',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return referral;
    } catch (error) {
      logger.error('Error rejecting referral:', error);
      throw error;
    }
  }

  /**
   * Membatalkan rujukan
   */
  static async cancelReferral(referralId: string, cancellationReason: string): Promise<Referral> {
    try {
      // Dalam implementasi nyata, kita akan mengupdate database
      // Untuk sekarang kita kembalikan contoh data dengan status diubah
      
      const referral: Referral = {
        id: referralId,
        nomorRujukan: `RSJ-R-${referralId}`,
        patientId: 'PATIENT-1',
        pengirimRsjId: 'RSJ-001',
        tujuanRsjId: 'RSJ-002',
        dokterPengirimId: 'DOC-1',
        dokterTujuanId: 'DOC-2',
        poliAsalId: 'POLI-1',
        poliTujuanId: 'POLI-2',
        tanggalRujukan: new Date(),
        catatan: 'Pasien memerlukan pemeriksaan spesialis',
        status: 'cancelled',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return referral;
    } catch (error) {
      logger.error('Error cancelling referral:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan riwayat rujukan pasien
   */
  static async getPatientReferralHistory(patientId: string): Promise<Referral[]> {
    try {
      // Dalam implementasi nyata, kita akan mengambil dari database
      // Untuk sekarang kita kembalikan array kosong sebagai placeholder
      
      return [
        {
          id: 'REF-1',
          nomorRujukan: 'RSJ-R-001',
          patientId,
          pengirimRsjId: 'RSJ-001',
          tujuanRsjId: 'RSJ-002',
          dokterPengirimId: 'DOC-1',
          dokterTujuanId: 'DOC-2',
          poliAsalId: 'POLI-1',
          poliTujuanId: 'POLI-2',
          tanggalRujukan: new Date(Date.now() - 86400000 * 10), // 10 hari yang lalu
          catatan: 'Pasien memerlukan pemeriksaan spesialis',
          status: 'completed',
          createdAt: new Date(Date.now() - 86400000 * 12),
          updatedAt: new Date(Date.now() - 86400000 * 8)
        }
      ];
    } catch (error) {
      logger.error('Error getting patient referral history:', error);
      throw error;
    }
  }
}