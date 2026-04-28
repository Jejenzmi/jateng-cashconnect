import { PrismaClient, Visit, BpjsSyncRecord, Patient, BpjsPatientData } from '@prisma/client';
import { BpjsQueueService } from './bpjs-queue.service';
import { BpjsLogService } from './bpjs-log.service';
import { logger } from '../utils/logger.util';

const prisma = new PrismaClient();

export class BpjsSyncService {
  /**
   * Menyinkronkan data kunjungan ke BPJS
   */
  static async syncVisitToBpjs(visitId: string) {
    try {
      // Ambil data kunjungan
      const visit = await prisma.visit.findUnique({
        where: { id: visitId },
        include: {
          patient: true,
          poli: true,
          dokter: true,
          prescriptions: {
            include: {
              item: true
            }
          }
        }
      });

      if (!visit) {
        throw new Error(`Visit with ID ${visitId} not found`);
      }

      // Ambil data pasien BPJS
      const bpjsPatientData = await prisma.bpjsPatientData.findFirst({
        where: { patientId: visit.patientId }
      });

      if (!bpjsPatientData) {
        throw new Error(`BPJS patient data not found for patient ID ${visit.patientId}`);
      }

      // Kirim data ke antrian untuk diproses
      const queueData = {
        serviceType: 'antrean',
        endpoint: '/antrean/add',
        method: 'POST',
        payload: {
          kodebooking: `BK-${visitId.substring(0, 8).toUpperCase()}-${new Date().getTime()}`,
          tanggaloperasi: visit.tanggalPeriksa,
          jenispelaporan: 'offline', // atau 'online' tergantung kebijakan
          kodedokter: visit.dokter.kode,
          namadokter: visit.dokter.nama,
          kodepoli: visit.poli.kode,
          namapoli: visit.poli.nama,
          tanggalsubmission: new Date(),
          judulklaim: 'Rawat Jalan',
          diagnosis: 'Z53.8', // Contoh diagnosis sementara
          procedure: '', // Prosedur jika ada
          sisafklaim: visit.totalBiaya.toString(), // Biaya sisa klaim
          klaimtotal: visit.totalBiaya.toString(), // Total klaim
          informasitambahan: visit.catatan || '',
          jumlahpeserta: 1,
          peserta: [
            {
              nocm: bpjsPatientData.nik,
              nomorkartu: bpjsPatientData.noKartu,
              nmpeserta: bpjsPatientData.nama,
              jenis_kelamin: bpjsPatientData.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan',
              tgl_lahir: bpjsPatientData.tanggalLahir.toISOString().split('T')[0],
              peserta: bpjsPatientData.jenisPeserta,
              jeniskelamin: bpjsPatientData.jenisKelamin,
              nohppeserta: visit.patient.noHp || '',
            }
          ]
        }
      };

      // Tambahkan ke antrian
      const queueItem = await BpjsQueueService.addToQueue(queueData);

      // Buat record sinkronisasi
      const syncRecord = await prisma.bpjsSyncRecord.create({
        data: {
          visitId: visit.id,
          syncType: 'registration',
          status: 'pending',
          bpjsReference: queueItem.id,
        }
      });

      // Log aktivitas
      await BpjsLogService.createLog({
        serviceType: 'sync',
        endpoint: '/antrean/add',
        method: 'POST',
        requestBody: queueData.payload,
        responseBody: { queueId: queueItem.id },
        statusCode: 200,
        duration: 0,
      });

      return syncRecord;
    } catch (error) {
      logger.error('Error syncing visit to BPJS:', error);

      // Log error
      await BpjsLogService.createLog({
        serviceType: 'sync',
        endpoint: '/antrean/add',
        method: 'POST',
        errorMessage: error.message,
        statusCode: 500,
      });

      throw error;
    }
  }

  /**
   * Menyinkronkan data pendaftaran ke BPJS
   */
  static async syncRegistrationToBpjs(visitId: string) {
    try {
      // Ambil data kunjungan
      const visit = await prisma.visit.findUnique({
        where: { id: visitId },
        include: {
          patient: true,
          poli: true,
          dokter: true
        }
      });

      if (!visit) {
        throw new Error(`Visit with ID ${visitId} not found`);
      }

      // Ambil data pasien BPJS
      const bpjsPatientData = await prisma.bpjsPatientData.findFirst({
        where: { patientId: visit.patientId }
      });

      if (!bpjsPatientData) {
        throw new Error(`BPJS patient data not found for patient ID ${visit.patientId}`);
      }

      // Kirim data ke antrian untuk diproses
      const queueData = {
        serviceType: 'antrean',
        endpoint: '/antrean/updatewaktu',
        method: 'PUT',
        payload: {
          kodebooking: `BK-${visitId.substring(0, 8).toUpperCase()}-${new Date().getTime()}`,
          waktu: visit.tanggalPeriksa,
          status: '1' // 1=check-in, 2=selesai
        }
      };

      // Tambahkan ke antrian
      const queueItem = await BpjsQueueService.addToQueue(queueData);

      // Buat record sinkronisasi
      const syncRecord = await prisma.bpjsSyncRecord.create({
        data: {
          visitId: visit.id,
          syncType: 'registration',
          status: 'pending',
          bpjsReference: queueItem.id,
        }
      });

      // Log aktivitas
      await BpjsLogService.createLog({
        serviceType: 'sync',
        endpoint: '/antrean/updatewaktu',
        method: 'PUT',
        requestBody: queueData.payload,
        responseBody: { queueId: queueItem.id },
        statusCode: 200,
        duration: 0,
      });

      return syncRecord;
    } catch (error) {
      logger.error('Error syncing registration to BPJS:', error);

      // Log error
      await BpjsLogService.createLog({
        serviceType: 'sync',
        endpoint: '/antrean/updatewaktu',
        method: 'PUT',
        errorMessage: error.message,
        statusCode: 500,
      });

      throw error;
    }
  }

  /**
   * Menyinkronkan data tindakan ke BPJS
   */
  static async syncTreatmentToBpjs(visitId: string) {
    try {
      // Ambil data kunjungan
      const visit = await prisma.visit.findUnique({
        where: { id: visitId },
        include: {
          patient: true,
          poli: true,
          dokter: true,
          prescriptions: {
            include: {
              item: true
            }
          }
        }
      });

      if (!visit) {
        throw new Error(`Visit with ID ${visitId} not found`);
      }

      // Ambil data pasien BPJS
      const bpjsPatientData = await prisma.bpjsPatientData.findFirst({
        where: { patientId: visit.patientId }
      });

      if (!bpjsPatientData) {
        throw new Error(`BPJS patient data not found for patient ID ${visit.patientId}`);
      }

      // Kirim data ke antrian untuk diproses
      const queueData = {
        serviceType: 'vclaim',
        endpoint: '/SEP/SubmitionSEP',
        method: 'POST',
        payload: {
          request: {
            t_sep: {
              noKartu: bpjsPatientData.noKartu,
              tglSep: visit.tanggalPeriksa.toISOString().split('T')[0],
              ppkPelayanan: process.env.BPJS_PPK_CODE, // Kode PPK dari konfigurasi
              jnsPelayanan: '2', // 1=Rawat Inap, 2=Rawat Jalan
              klsRawat: {
                kls: bpjsPatientData.kelasTanggungan
              },
              noMR: visit.patient.patientId,
              rujukan: {
                asalRujukan: '2', // 1=Faskes 1, 2=Faskes 2(RS)
                tglRujukan: visit.tanggalPeriksa.toISOString().split('T')[0],
                noRujukan: `RUJ-${visitId.substring(0, 8).toUpperCase()}`,
                ppkRujukan: process.env.BPJS_PPK_RUJUKAN_CODE
              },
              catatan: visit.catatan || '',
              diagnosa: 'Z53.8', // Diisi dengan kode ICD-10 sesuai diagnosa
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
              tglPlgPlan: new Date(new Date(visit.tanggalPeriksa).setDate(visit.tanggalPeriksa.getDate() + 7)).toISOString().split('T')[0], // Estimasi pulang 7 hari dari tanggal periksa
              noTelepon: visit.patient.noHp || '',
              user: process.env.BPJS_USER_NAME || 'SIMRSZEN'
            }
          }
        }
      };

      // Tambahkan ke antrian
      const queueItem = await BpjsQueueService.addToQueue(queueData);

      // Buat record sinkronisasi
      const syncRecord = await prisma.bpjsSyncRecord.create({
        data: {
          visitId: visit.id,
          syncType: 'treatment',
          status: 'pending',
          bpjsReference: queueItem.id,
        }
      });

      // Log aktivitas
      await BpjsLogService.createLog({
        serviceType: 'sync',
        endpoint: '/SEP/SubmitionSEP',
        method: 'POST',
        requestBody: queueData.payload,
        responseBody: { queueId: queueItem.id },
        statusCode: 200,
        duration: 0,
      });

      return syncRecord;
    } catch (error) {
      logger.error('Error syncing treatment to BPJS:', error);

      // Log error
      await BpjsLogService.createLog({
        serviceType: 'sync',
        endpoint: '/SEP/SubmitionSEP',
        method: 'POST',
        errorMessage: error.message,
        statusCode: 500,
      });

      throw error;
    }
  }

  /**
   * Memperbarui status sinkronisasi
   */
  static async updateSyncStatus(syncRecordId: string, status: string, bpjsResponse?: any, errorMessage?: string) {
    try {
      const updateData: any = { status };
      
      if (bpjsResponse) {
        updateData.bpjsResponse = bpjsResponse;
      }
      
      if (errorMessage) {
        updateData.errorMessage = errorMessage;
      }

      const syncRecord = await prisma.bpjsSyncRecord.update({
        where: { id: syncRecordId },
        data: updateData
      });

      return syncRecord;
    } catch (error) {
      logger.error('Error updating sync status:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan riwayat sinkronisasi berdasarkan kunjungan
   */
  static async getSyncHistoryByVisit(visitId: string) {
    try {
      return await prisma.bpjsSyncRecord.findMany({
        where: { visitId },
        orderBy: { syncedAt: 'desc' }
      });
    } catch (error) {
      logger.error('Error getting sync history by visit:', error);
      throw error;
    }
  }
}