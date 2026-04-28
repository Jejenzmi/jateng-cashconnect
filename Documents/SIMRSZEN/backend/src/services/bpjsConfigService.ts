import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface BpjsConfig {
  consId: string;
  secretKey: string;
  userKey: string;
  baseUrl: string;
  environment: 'staging' | 'production';
}

export class BpjsConfigService {
  /**
   * Mengambil konfigurasi BPJS dari database (tabel HospitalProfile)
   */
  static async getConfig(): Promise<BpjsConfig> {
    const profile = await prisma.hospitalProfile.findFirst();
    
    if (!profile || !profile.bpjsConfig) {
      // Return default empty config if not set
      return {
        consId: '',
        secretKey: '',
        userKey: '',
        baseUrl: 'https://apijkn-dev.bpjs-kesehatan.go.id/vclaim-rest-dev',
        environment: 'staging'
      };
    }

    const config = profile.bpjsConfig as any;
    return {
      consId: config.consId || '',
      secretKey: config.secretKey || '',
      userKey: config.userKey || '',
      baseUrl: config.baseUrl || 'https://apijkn-dev.bpjs-kesehatan.go.id/vclaim-rest-dev',
      environment: config.environment || 'staging'
    };
  }

  /**
   * Menyimpan konfigurasi BPJS ke database
   */
  static async saveConfig(config: BpjsConfig): Promise<any> {
    const profile = await prisma.hospitalProfile.findFirst();
    
    if (profile) {
      return await prisma.hospitalProfile.update({
        where: { id: profile.id },
        data: {
          bpjsConfig: config as any
        }
      });
    } else {
      // Jika profil belum ada, buat profil dummy sementara untuk menampung config
      return await prisma.hospitalProfile.create({
        data: {
          name: 'SIMRS ZEN Hospital',
          address: '-',
          phone: '-',
          email: '-',
          satusehatId: '-',
          bpjsConfig: config as any
        }
      });
    }
  }
}
