import { PrismaClient, Visit, Patient, MedicalRecord } from '@prisma/client';
import axios from 'axios';
import { logger } from '../utils/logger.util';

const prisma = new PrismaClient();

interface IdrgClassification {
  id: string;
  kodeKlasifikasi: string;
  namaKlasifikasi: string;
  tarif: number;
  coPayment: number;
  deductible: number;
  status: string;
}

export class IdrgService {
  private static baseURL = process.env.IDRG_BASE_URL || 'https://inacbg.bpjs-kesehatan.go.id';
  private static clientId = process.env.IDRG_CLIENT_ID;
  private static secret = process.env.IDRG_SECRET;

  /**
   * Klasifikasi INA-DRG berdasarkan data pelayanan
   */
  static async classifyInaDrg(visitId: string): Promise<IdrgClassification> {
    try {
      const visit = await prisma.visit.findUnique({
        where: { id: visitId },
        include: {
          patient: true,
          prescriptions: {
            include: {
              item: true
            }
          },
          laboratoryTests: true,
          radiologyExams: true,
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

      // Dapatkan data rekam medis terakhir untuk diagnosis dan prosedur
      const latestMedicalRecord = visit.medicalRecords.length > 0 
        ? visit.medicalRecords[visit.medicalRecords.length - 1] 
        : null;

      // Format data untuk klasifikasi IDRG
      const idrgData = {
        noKartu: visit.patient.noKartu || '',
        tglPelayanan: visit.tanggalPeriksa.toISOString().split('T')[0],
        jnsPelayanan: visit.statusKunjungan === 'rawat_inap' ? '1' : '2', // 1=Inap, 2=Jalan
        kodeDiagnosa: latestMedicalRecord?.icd10Diagnosa || 'A00.1',
        kodeProsedur: latestMedicalRecord?.icd9Prosedur || '',
        kodeKelasRawat: '1', // Default kelas 1
        kodeDokter: latestMedicalRecord?.dokter.kode || '000000',
        kodeRuangan: '0000', // Kode ruangan default
        lamaDirawat: 3, // Default 3 hari
        adlScore: '1', // Default ADL score
        status: '1' // Status pulang
      };

      // Di sini kita hanya mengembalikan hasil simulasi
      // Dalam implementasi nyata, kita akan mengirim ke server IDRG
      const simulatedResult: IdrgClassification = {
        id: `idrg-${Date.now()}`,
        kodeKlasifikasi: `IDRG-${Math.floor(Math.random() * 1000) + 1}`,
        namaKlasifikasi: 'Klasifikasi Simulasi IDRG',
        tarif: visit.totalBiaya ? Number(visit.totalBiaya) : 5000000,
        coPayment: 0,
        deductible: 0,
        status: 'success'
      };

      // Dalam implementasi nyata, kita akan menyimpan data ke entitas IdrgData
      /*
      await prisma.idrgData.create({
        data: {
          visitId: visit.id,
          patientId: visit.patientId,
          noKartu: idrgData.noKartu,
          kodeKlasifikasi: simulatedResult.kodeKlasifikasi,
          tglPelayanan: new Date(idrgData.tglPelayanan),
          jenisPelayanan: idrgData.jnsPelayanan,
          kodeDiagnosa: idrgData.kodeDiagnosa,
          kodeProsedur: idrgData.kodeProsedur || null,
          kodeKelasRawat: idrgData.kodeKelasRawat,
          kodeDokter: idrgData.kodeDokter,
          kodeRuangan: idrgData.kodeRuangan,
          lamaDirawat: idrgData.lamaDirawat,
          adlScore: idrgData.adlScore,
          tarifRs: simulatedResult.tarif,
          tarifPbyn: simulatedResult.tarif * 0.8, // 80% dari tarif RS
          jumlahHari: idrgData.lamaDirawat,
          biayaObatRs: 0,
          biayaObatPbyn: 0,
          biayaGiziRs: 0,
          biayaGiziPbyn: 0,
          biayaKamarRs: 0,
          biayaKamarPbyn: 0,
          biayaLabRs: 0,
          biayaLabPbyn: 0,
          biayaRadRs: 0,
          biayaRadPbyn: 0,
          biayaObatKronis: 0,
          status: 'processed'
        }
      });
      */

      return simulatedResult;
    } catch (error) {
      logger.error('Error classifying INA-DRG:', error);
      throw error;
    }
  }

  /**
   * Submit klaim IDRG ke server
   */
  static async submitClaim(visitId: string): Promise<any> {
    try {
      const classification = await this.classifyInaDrg(visitId);
      
      // Dalam implementasi nyata, kita akan mengirim ke server IDRG
      // dengan menggunakan API yang sesuai
      const claimData = {
        noKlaim: `KLAIM-${visitId.substring(0, 8)}-${Date.now()}`,
        kodeKlasifikasi: classification.kodeKlasifikasi,
        tarif: classification.tarif,
        status: 'submitted'
      };

      logger.info(`IDRG claim submitted for visit ${visitId}: ${claimData.noKlaim}`);

      return {
        success: true,
        claimNumber: claimData.noKlaim,
        classification: classification.kodeKlasifikasi,
        status: 'submitted',
        message: 'Klaim IDRG berhasil diajukan'
      };
    } catch (error) {
      logger.error('Error submitting IDRG claim:', error);
      throw error;
    }
  }

  /**
   * Cek status klaim
   */
  static async getClaimStatus(noKlaim: string): Promise<any> {
    try {
      // Dalam implementasi nyata, kita akan mengambil status dari server IDRG
      return {
        noKlaim,
        status: 'approved', // atau 'rejected', 'pending', 'in-process'
        approvedAmount: 4500000,
        message: 'Klaim disetujui',
        processedDate: new Date()
      };
    } catch (error) {
      logger.error('Error getting claim status:', error);
      throw error;
    }
  }

  /**
   * Hitung estimasi biaya berdasarkan klasifikasi IDRG
   */
  static calculateEstimate(kodeKlasifikasi: string, additionalProcedures: string[] = []): Promise<number> {
    // Dalam implementasi nyata, kita akan menghitung berdasarkan tarif yang sesuai
    return new Promise(resolve => {
      // Simulasi perhitungan biaya
      const baseRate = 5000000; // 5 juta IDR
      const procedureMultiplier = 1 + (additionalProcedures.length * 0.1); // 10% per prosedur tambahan
      
      resolve(Math.round(baseRate * procedureMultiplier));
    });
  }

  /**
   * Dapatkan riwayat klasifikasi IDRG untuk pasien
   */
  static async getPatientHistory(patientId: string): Promise<any[]> {
    try {
      // Dalam implementasi nyata, kita akan mengambil dari entitas IdrgData
      const visits = await prisma.visit.findMany({
        where: { patientId },
        include: {
          patient: true,
          medicalRecords: true
        }
      });

      // Simulasi data histori IDRG
      return visits.map(visit => ({
        id: `idrg-${visit.id}`,
        visitId: visit.id,
        visitDate: visit.tanggalPeriksa,
        patient: visit.patient.nama,
        diagnosis: visit.medicalRecords.length > 0 ? visit.medicalRecords[0].icd10Diagnosa : 'TBD',
        classification: `IDRG-${Math.floor(Math.random() * 1000) + 1}`,
        estimatedCost: 4500000 + Math.floor(Math.random() * 1000000),
        actualCost: 4700000 + Math.floor(Math.random() * 1000000),
        status: 'completed',
        claimNumber: `KLAIM-${visit.id.substring(0, 8)}`
      }));
    } catch (error) {
      logger.error('Error getting patient IDRG history:', error);
      throw error;
    }
  }
}