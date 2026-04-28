import { PrismaClient, Item, Prescription, Patient, Visit } from '@prisma/client';
import { BpjsSyncService } from './bpjs-sync.service';
import { logger } from '../utils/logger.util';

const prisma = new PrismaClient();

export class PharmacyService {
  /**
   * Mendapatkan stok obat
   */
  static async getStock(kodeObat: string): Promise<number> {
    try {
      const item = await prisma.item.findUnique({
        where: { kode: kodeObat }
      });

      if (!item) {
        throw new Error(`Obat dengan kode ${kodeObat} tidak ditemukan`);
      }

      return Number(item.stok);
    } catch (error) {
      logger.error('Error getting stock:', error);
      throw error;
    }
  }

  /**
   * Memperbarui stok obat
   */
  static async updateStock(kodeObat: string, jumlah: number, jenis: 'in' | 'out'): Promise<Item> {
    try {
      const item = await prisma.item.findUnique({
        where: { kode: kodeObat }
      });

      if (!item) {
        throw new Error(`Obat dengan kode ${kodeObat} tidak ditemukan`);
      }

      if (jenis === 'out' && Number(item.stok) < jumlah) {
        throw new Error(`Stok obat ${kodeObat} tidak mencukupi. Tersedia: ${item.stok}, Diminta: ${jumlah}`);
      }

      const updatedItem = await prisma.item.update({
        where: { kode: kodeObat },
        data: {
          stok: {
            increment: jenis === 'in' ? jumlah : -jumlah
          }
        }
      });

      return updatedItem;
    } catch (error) {
      logger.error('Error updating stock:', error);
      throw error;
    }
  }

  /**
   * Membuat resep baru
   */
  static async createPrescription(data: {
    visitId: string;
    patientId: string;
    itemId: string;
    jumlah: number;
    signaQty: string;
    signaDays: number;
    aturanPakai?: string;
    keterangan?: string;
  }): Promise<Prescription> {
    try {
      // Periksa stok
      const item = await prisma.item.findUnique({
        where: { id: data.itemId }
      });

      if (!item) {
        throw new Error(`Item dengan ID ${data.itemId} tidak ditemukan`);
      }

      if (Number(item.stok) < data.jumlah) {
        throw new Error(`Stok obat ${item.nama} tidak mencukupi. Tersedia: ${item.stok}, Diminta: ${data.jumlah}`);
      }

      // Buat resep
      const prescription = await prisma.prescription.create({
        data: {
          visitId: data.visitId,
          patientId: data.patientId,
          itemId: data.itemId,
          jumlah: data.jumlah,
          signaQty: data.signaQty,
          signaDays: data.signaDays,
          aturanPakai: data.aturanPakai || '',
          keterangan: data.keterangan || ''
        },
        include: {
          item: true,
          patient: true,
          visit: true
        }
      });

      // Kurangi stok
      await prisma.item.update({
        where: { id: data.itemId },
        data: {
          stok: {
            decrement: data.jumlah
          }
        }
      });

      return prescription;
    } catch (error) {
      logger.error('Error creating prescription:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan resep untuk kunjungan tertentu
   */
  static async getPrescriptionsByVisit(visitId: string): Promise<Prescription[]> {
    try {
      return await prisma.prescription.findMany({
        where: { visitId },
        include: {
          item: {
            select: {
              nama: true,
              kode: true,
              harga: true
            }
          },
          patient: {
            select: {
              nama: true,
              patientId: true
            }
          },
          visit: {
            select: {
              visitId: true,
              tanggalPeriksa: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      logger.error('Error getting prescriptions by visit:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan resep untuk pasien tertentu
   */
  static async getPrescriptionsByPatient(patientId: string): Promise<Prescription[]> {
    try {
      return await prisma.prescription.findMany({
        where: { patientId },
        include: {
          item: {
            select: {
              nama: true,
              kode: true,
              harga: true
            }
          },
          visit: {
            select: {
              visitId: true,
              tanggalPeriksa: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      logger.error('Error getting prescriptions by patient:', error);
      throw error;
    }
  }

  /**
   * Menambahkan obat ke inventory
   */
  static async addDrugToInventory(data: {
    kode: string;
    nama: string;
    satuan: string;
    harga: number;
    stok: number;
  }): Promise<Item> {
    try {
      // Cek apakah kode sudah digunakan
      const existingItem = await prisma.item.findUnique({
        where: { kode: data.kode }
      });

      if (existingItem) {
        throw new Error(`Kode obat ${data.kode} sudah digunakan`);
      }

      const newItem = await prisma.item.create({
        data: {
          kode: data.kode,
          nama: data.nama,
          jenis: 'obat',
          satuan: data.satuan,
          harga: data.harga,
          stok: data.stok
        }
      });

      return newItem;
    } catch (error) {
      logger.error('Error adding drug to inventory:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan daftar obat
   */
  static async getDrugs(filter: {
    searchTerm?: string;
    minStok?: number;
  } = {}): Promise<Item[]> {
    try {
      const whereClause: any = {
        jenis: 'obat'
      };

      if (filter.searchTerm) {
        whereClause.nama = {
          contains: filter.searchTerm,
          mode: 'insensitive'
        };
      }

      if (filter.minStok !== undefined) {
        whereClause.stok = {
          gte: filter.minStok
        };
      }

      return await prisma.item.findMany({
        where: whereClause,
        orderBy: { nama: 'asc' }
      });
    } catch (error) {
      logger.error('Error getting drugs:', error);
      throw error;
    }
  }

  /**
   * Mengecek expired date obat
   */
  static async checkExpiringDrugs(days: number = 30): Promise<Item[]> {
    try {
      // Note: We would need to add expired_date field to Item model to implement this properly
      // For now, this is a placeholder for future enhancement
      return [];
    } catch (error) {
      logger.error('Error checking expiring drugs:', error);
      throw error;
    }
  }
}