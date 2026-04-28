import { PrismaClient, BpjsConfig } from '@prisma/client';
import { encrypt, decrypt } from '../utils/encryption.util';

const prisma = new PrismaClient();

export class BpjsConfigService {
  /**
   * Membuat konfigurasi BPJS baru
   */
  static async createConfig(data: {
    name: string;
    consumerId: string;
    consumerSecret: string;
    username: string;
    password: string;
    userKey: string;
    baseUrl: string;
    serviceName: string;
  }): Promise<BpjsConfig> {
    const encryptedData = {
      ...data,
      consumerSecret: encrypt(data.consumerSecret),
      password: encrypt(data.password),
    };

    return await prisma.bpjsConfig.create({
      data: encryptedData,
    });
  }

  /**
   * Mendapatkan konfigurasi BPJS berdasarkan nama
   */
  static async getConfigByName(name: string): Promise<BpjsConfig | null> {
    const config = await prisma.bpjsConfig.findUnique({
      where: { name },
    });

    if (!config) return null;

    // Decrypt data sensitif sebelum dikembalikan
    return {
      ...config,
      consumerSecret: decrypt(config.consumerSecret),
      password: decrypt(config.password),
    };
  }

  /**
   * Mendapatkan semua konfigurasi BPJS
   */
  static async getAllConfigs(): Promise<BpjsConfig[]> {
    const configs = await prisma.bpjsConfig.findMany();

    return configs.map(config => ({
      ...config,
      consumerSecret: decrypt(config.consumerSecret),
      password: decrypt(config.password),
    }));
  }

  /**
   * Memperbarui konfigurasi BPJS
   */
  static async updateConfig(
    name: string,
    data: Partial<BpjsConfig>
  ): Promise<BpjsConfig> {
    // Jika data sensitif diperbarui, lakukan enkripsi
    const updatedData = { ...data };
    
    if (data.consumerSecret) {
      updatedData.consumerSecret = encrypt(data.consumerSecret);
    }
    
    if (data.password) {
      updatedData.password = encrypt(data.password);
    }

    const updatedConfig = await prisma.bpjsConfig.update({
      where: { name },
      data: updatedData,
    });

    // Decrypt data sensitif sebelum dikembalikan
    return {
      ...updatedConfig,
      consumerSecret: decrypt(updatedConfig.consumerSecret),
      password: decrypt(updatedConfig.password),
    };
  }

  /**
   * Menghapus konfigurasi BPJS
   */
  static async deleteConfig(name: string): Promise<BpjsConfig> {
    return await prisma.bpjsConfig.delete({
      where: { name },
    });
  }

  /**
   * Mengaktifkan atau menonaktifkan konfigurasi BPJS
   */
  static async toggleConfigStatus(name: string, isActive: boolean): Promise<BpjsConfig> {
    return await prisma.bpjsConfig.update({
      where: { name },
      data: { isActive },
    });
  }

  /**
   * Mendapatkan konfigurasi aktif
   */
  static async getActiveConfigs(): Promise<BpjsConfig[]> {
    const configs = await prisma.bpjsConfig.findMany({
      where: { isActive: true },
    });

    return configs.map(config => ({
      ...config,
      consumerSecret: decrypt(config.consumerSecret),
      password: decrypt(config.password),
    }));
  }
}