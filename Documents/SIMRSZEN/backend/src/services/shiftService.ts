import { PrismaClient, Shift } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateShiftInput {
  name: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  breakStartTime?: Date;
  breakEndTime?: Date;
  isActive?: boolean;
  isOvertimeAllowed?: boolean;
  maxConsecutiveDays?: number;
  minRestHoursAfterShift?: number;
  weekendPattern?: string;
  holidayWorking?: boolean;
}

export interface UpdateShiftInput {
  name?: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  breakStartTime?: Date;
  breakEndTime?: Date;
  isActive?: boolean;
  isOvertimeAllowed?: boolean;
  maxConsecutiveDays?: number;
  minRestHoursAfterShift?: number;
  weekendPattern?: string;
  holidayWorking?: boolean;
}

export class ShiftService {
  static async getAllShifts(): Promise<Shift[]> {
    try {
      return await prisma.shift.findMany({
        orderBy: {
          startTime: 'asc'
        }
      });
    } catch (error) {
      throw new Error(`Error fetching shifts: ${error}`);
    }
  }

  static async getShiftById(id: string): Promise<Shift | null> {
    try {
      return await prisma.shift.findUnique({
        where: { id }
      });
    } catch (error) {
      throw new Error(`Error fetching shift: ${error}`);
    }
  }

  static async createShift(data: CreateShiftInput): Promise<Shift> {
    try {
      return await prisma.shift.create({
        data: {
          name: data.name,
          description: data.description || '',
          startTime: data.startTime,
          endTime: data.endTime,
          breakStartTime: data.breakStartTime,
          breakEndTime: data.breakEndTime,
          isActive: data.isActive ?? true,
          isOvertimeAllowed: data.isOvertimeAllowed ?? false,
          maxConsecutiveDays: data.maxConsecutiveDays,
          minRestHoursAfterShift: data.minRestHoursAfterShift,
          weekendPattern: data.weekendPattern,
          holidayWorking: data.holidayWorking ?? false,
        }
      });
    } catch (error) {
      throw new Error(`Error creating shift: ${error}`);
    }
  }

  static async updateShift(id: string, data: UpdateShiftInput): Promise<Shift | null> {
    try {
      return await prisma.shift.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          startTime: data.startTime,
          endTime: data.endTime,
          breakStartTime: data.breakStartTime,
          breakEndTime: data.breakEndTime,
          isActive: data.isActive,
          isOvertimeAllowed: data.isOvertimeAllowed,
          maxConsecutiveDays: data.maxConsecutiveDays,
          minRestHoursAfterShift: data.minRestHoursAfterShift,
          weekendPattern: data.weekendPattern,
          holidayWorking: data.holidayWorking,
        }
      });
    } catch (error) {
      throw new Error(`Error updating shift: ${error}`);
    }
  }

  static async deleteShift(id: string): Promise<Shift | null> {
    try {
      return await prisma.shift.delete({
        where: { id }
      });
    } catch (error) {
      throw new Error(`Error deleting shift: ${error}`);
    }
  }
}