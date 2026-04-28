import prisma from '../config/db';
import logger from './logger';

export interface AuditLogData {
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Creates an audit log entry
 */
export const createAuditLog = async (logData: AuditLogData): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: logData.userId,
        action: logData.action,
        resourceType: logData.resourceType,
        resourceId: logData.resourceId,
        oldValue: logData.oldValue || undefined, // Gunakan undefined daripada null
        newValue: logData.newValue || undefined, // Gunakan undefined daripada null
        ipAddress: logData.ipAddress || undefined,
        userAgent: logData.userAgent || undefined,
      },
    });

    logger.info('Audit log created', {
      userId: logData.userId,
      action: logData.action,
      resourceType: logData.resourceType,
      resourceId: logData.resourceId,
    });
  } catch (error) {
    logger.error('Failed to create audit log', {
      error: (error as Error).message,
      userId: logData.userId,
      action: logData.action,
    });
  }
};

/**
 * Retrieves audit logs for a specific resource
 */
export const getResourceAuditLogs = async (
  resourceType: string,
  resourceId: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const skip = (page - 1) * limit;

    const logs = await prisma.auditLog.findMany({
      where: {
        resourceType,
        resourceId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    const total = await prisma.auditLog.count({
      where: {
        resourceType,
        resourceId,
      },
    });

    logger.info('Retrieved audit logs', {
      resourceType,
      resourceId,
      count: logs.length,
      page,
      totalPages: Math.ceil(total / limit),
    });

    return {
      data: logs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    logger.error('Failed to retrieve audit logs', {
      error: (error as Error).message,
      resourceType,
      resourceId,
    });

    throw error;
  }
};

/**
 * Retrieves audit logs for a specific user
 */
export const getUserAuditLogs = async (
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const skip = (page - 1) * limit;

    const logs = await prisma.auditLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    const total = await prisma.auditLog.count({
      where: {
        userId,
      },
    });

    logger.info('Retrieved user audit logs', {
      userId,
      count: logs.length,
      page,
      totalPages: Math.ceil(total / limit),
    });

    return {
      data: logs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    logger.error('Failed to retrieve user audit logs', {
      error: (error as Error).message,
      userId,
    });

    throw error;
  }
};