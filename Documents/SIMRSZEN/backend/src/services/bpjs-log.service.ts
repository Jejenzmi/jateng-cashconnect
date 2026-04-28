import { PrismaClient, BpjsLog } from '@prisma/client';

const prisma = new PrismaClient();

export class BpjsLogService {
  /**
   * Membuat log aktivitas integrasi BPJS
   */
  static async createLog(data: {
    serviceType: string;
    endpoint: string;
    method: string;
    requestBody?: any;
    responseBody?: any;
    statusCode?: number;
    errorMessage?: string;
    duration?: number;
  }): Promise<BpjsLog> {
    return await prisma.bpjsLog.create({
      data: {
        serviceType: data.serviceType,
        endpoint: data.endpoint,
        method: data.method,
        requestBody: data.requestBody || null,
        responseBody: data.responseBody || null,
        statusCode: data.statusCode || null,
        errorMessage: data.errorMessage || null,
        duration: data.duration || null,
      },
    });
  }

  /**
   * Mendapatkan log berdasarkan where clause
   */
  static async getLogs(whereClause: any, limit: number = 50, offset: number = 0): Promise<BpjsLog[]> {
    return await prisma.bpjsLog.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });
  }

  /**
   * Mendapatkan log berdasarkan tipe layanan
   */
  static async getLogsByServiceType(serviceType: string, limit: number = 50, offset: number = 0): Promise<BpjsLog[]> {
    const whereClause = serviceType ? { serviceType } : {};
    return await this.getLogs(whereClause, limit, offset);
  }

  /**
   * Mendapatkan log berdasarkan endpoint
   */
  static async getLogsByEndpoint(endpoint: string, limit: number = 50, offset: number = 0): Promise<BpjsLog[]> {
    return await prisma.bpjsLog.findMany({
      where: { endpoint },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });
  }

  /**
   * Mendapatkan log error
   */
  static async getErrorLogs(limit: number = 50, offset: number = 0): Promise<BpjsLog[]> {
    return await prisma.bpjsLog.findMany({
      where: { errorMessage: { not: null } },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });
  }

  /**
   * Menghitung jumlah total log
   */
  static async countLogs(serviceType?: string): Promise<number> {
    const whereClause = serviceType ? { serviceType } : {};
    return await prisma.bpjsLog.count({ where: whereClause });
  }

  /**
   * Menghapus log lama berdasarkan rentang waktu
   */
  static async deleteOldLogs(days: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await prisma.bpjsLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return result.count;
  }

  /**
   * Mendapatkan statistik error berdasarkan tipe layanan
   */
  static async getErrorStats(serviceType?: string): Promise<{ [key: string]: number }> {
    const whereClause = serviceType ? { 
      serviceType, 
      errorMessage: { not: null } 
    } : { errorMessage: { not: null } };

    const logs = await prisma.bpjsLog.findMany({
      where: whereClause,
      select: {
        errorMessage: true,
        serviceType: true,
      },
    });

    const stats: { [key: string]: number } = {};

    logs.forEach(log => {
      const key = log.serviceType + ': ' + (log.errorMessage || 'Unknown Error');
      stats[key] = (stats[key] || 0) + 1;
    });

    return stats;
  }
}