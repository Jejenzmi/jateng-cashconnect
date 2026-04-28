import { Request, Response } from 'express';
import { ShiftService, CreateShiftInput, UpdateShiftInput } from '../services/shiftService';

export class ShiftController {
  static async getAllShifts(_: Request, res: Response): Promise<void> {
    try {
      const shifts = await ShiftService.getAllShifts();
      res.status(200).json({
        success: true,
        message: 'Successfully retrieved all shifts',
        data: shifts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get shifts',
      });
    }
  }

  static async getShiftById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const shift = await ShiftService.getShiftById(id);
      if (!shift) {
        res.status(404).json({
          success: false,
          message: 'Shift not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Successfully retrieved shift',
        data: shift
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get shift',
      });
    }
  }

  static async createShift(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, startTime, endTime, breakStartTime, breakEndTime, 
              isActive, isOvertimeAllowed, maxConsecutiveDays, minRestHoursAfterShift, 
              weekendPattern, holidayWorking }: CreateShiftInput = req.body;

      // Validasi input
      if (!name || !startTime || !endTime) {
        res.status(400).json({
          success: false,
          message: 'Name, start time, and end time are required',
        });
        return;
      }

      // Validasi bahwa startTime sebelum endTime
      if (new Date(startTime) >= new Date(endTime)) {
        res.status(400).json({
          success: false,
          message: 'Start time must be before end time',
        });
        return;
      }

      // Jika break time ditentukan, validasi bahwa breakStartTime sebelum breakEndTime
      if (breakStartTime && breakEndTime && new Date(breakStartTime) >= new Date(breakEndTime)) {
        res.status(400).json({
          success: false,
          message: 'Break start time must be before break end time',
        });
        return;
      }

      const newShift = await ShiftService.createShift({
        name,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        breakStartTime: breakStartTime ? new Date(breakStartTime) : undefined,
        breakEndTime: breakEndTime ? new Date(breakEndTime) : undefined,
        isActive,
        isOvertimeAllowed,
        maxConsecutiveDays,
        minRestHoursAfterShift,
        weekendPattern,
        holidayWorking
      });

      res.status(201).json({
        success: true,
        message: 'Shift created successfully',
        data: newShift
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create shift',
      });
    }
  }

  static async updateShift(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, startTime, endTime, breakStartTime, breakEndTime, 
              isActive, isOvertimeAllowed, maxConsecutiveDays, minRestHoursAfterShift, 
              weekendPattern, holidayWorking }: UpdateShiftInput = req.body;

      // Validasi bahwa startTime sebelum endTime jika keduanya disediakan
      if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
        res.status(400).json({
          success: false,
          message: 'Start time must be before end time',
        });
        return;
      }

      // Jika break time ditentukan, validasi bahwa breakStartTime sebelum breakEndTime
      if (breakStartTime && breakEndTime && new Date(breakStartTime) >= new Date(breakEndTime)) {
        res.status(400).json({
          success: false,
          message: 'Break start time must be before break end time',
        });
        return;
      }

      const updatedShift = await ShiftService.updateShift(id, {
        name,
        description,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        breakStartTime: breakStartTime ? new Date(breakStartTime) : undefined,
        breakEndTime: breakEndTime ? new Date(breakEndTime) : undefined,
        isActive,
        isOvertimeAllowed,
        maxConsecutiveDays,
        minRestHoursAfterShift,
        weekendPattern,
        holidayWorking
      });

      if (!updatedShift) {
        res.status(404).json({
          success: false,
          message: 'Shift not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Shift updated successfully',
        data: updatedShift
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update shift',
      });
    }
  }

  static async deleteShift(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deletedShift = await ShiftService.deleteShift(id);

      if (!deletedShift) {
        res.status(404).json({
          success: false,
          message: 'Shift not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Shift deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete shift',
      });
    }
  }
}