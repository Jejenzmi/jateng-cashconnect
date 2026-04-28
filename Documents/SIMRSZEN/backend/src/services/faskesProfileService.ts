import { PrismaClient, FaskesProfile } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schema validasi untuk input
const FaskesProfileSchema = z.object({
  name: z.string().min(1, { message: 'Nama faskes wajib diisi' }),
  type: z.enum(['A', 'B', 'C', 'D', 'FKTP', 'KLINIK', 'PUSKESMAS']).transform(val => val as string),
  address: z.string().min(1, { message: 'Alamat wajib diisi' }),
  city: z.string().min(1, { message: 'Kota wajib diisi' }),
  province: z.string().min(1, { message: 'Provinsi wajib diisi' }),
  phone: z.string().min(1, { message: 'Nomor telepon wajib diisi' }),
  email: z.string().email({ message: 'Format email tidak valid' }),
  licenseNumber: z.string().min(1, { message: 'Nomor izin operasional wajib diisi' }),
  operationalSince: z.string().refine(value => !isNaN(Date.parse(value)), {
    message: 'Tanggal operasional tidak valid'
  }),
  capacity: z.number().nonnegative({ message: 'Kapasitas harus angka positif' }).optional(),
  director: z.string().min(1, { message: 'Nama direktur wajib diisi' }),
  description: z.string().optional()
});

export type FaskesProfileInput = z.infer<typeof FaskesProfileSchema>;

export class FaskesProfileService {
  /**
   * Membuat atau memperbarui profil faskes
   */
  static async createOrUpdate(input: FaskesProfileInput): Promise<FaskesProfile> {
    try {
      // Validasi input
      const validatedInput = FaskesProfileSchema.parse(input);
      
      // Ubah operationalSince menjadi Date
      const parsedDate = new Date(validatedInput.operationalSince);
      
      // Cek apakah sudah ada profil faskes
      const existingProfile = await prisma.faskesProfile.findFirst();
      
      if (existingProfile) {
        // Update profil yang sudah ada
        return await prisma.faskesProfile.update({
          where: { id: existingProfile.id },
          data: {
            ...validatedInput,
            operationalSince: parsedDate,
            capacity: validatedInput.capacity || 0
          }
        });
      } else {
        // Buat profil baru
        return await prisma.faskesProfile.create({
          data: {
            ...validatedInput,
            operationalSince: parsedDate,
            capacity: validatedInput.capacity || 0
          }
        });
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validasi gagal: ${error.issues.map((issue: any) => issue.message).join(', ')}`);
      }
      throw new Error(`Gagal menyimpan profil faskes: ${error.message}`);
    }
  }

  /**
   * Mendapatkan profil faskes
   */
  static async getProfile(): Promise<FaskesProfile | null> {
    try {
      return await prisma.faskesProfile.findFirst();
    } catch (error: any) {
      throw new Error(`Gagal mengambil profil faskes: ${error.message}`);
    }
  }
}