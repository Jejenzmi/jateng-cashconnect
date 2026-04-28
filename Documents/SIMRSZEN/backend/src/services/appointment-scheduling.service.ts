import { PrismaClient, Patient, Dokter, Poli, Visit } from '@prisma/client';
import { logger } from '../utils/logger.util';

const prisma = new PrismaClient();

// Interfaces untuk modul antrian dan jadwal
interface DoctorSchedule {
  id: string;
  doctorId: string;
  poliId: string;
  dayOfWeek: number; // 0 = Minggu, 1 = Senin, dst
  startTime: string; // Format HH:mm
  endTime: string; // Format HH:mm
  maxPatients: number;
  currentPatients: number;
  status: string; // active, inactive, holiday
  createdAt: Date;
  updatedAt: Date;
}

interface Appointment {
  id: string;
  patientId: string;
  doctorScheduleId: string;
  appointmentDate: Date;
  appointmentNumber: number;
  status: string; // scheduled, visited, canceled, no_show
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface QueueNumber {
  id: string;
  appointmentId: string;
  queueNumber: number;
  poliId: string;
  called: boolean;
  served: boolean;
  calledAt?: Date;
  servedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class AppointmentSchedulingService {
  /**
   * Membuat jadwal dokter
   */
  static async createDoctorSchedule(data: {
    doctorId: string;
    poliId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    maxPatients: number;
  }): Promise<DoctorSchedule> {
    try {
      // Dalam implementasi nyata, kita akan membuat entitas di database
      // Untuk sekarang kita kembalikan data dummy
      return {
        id: `sched-${Date.now()}`,
        doctorId: data.doctorId,
        poliId: data.poliId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        maxPatients: data.maxPatients,
        currentPatients: 0,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error creating doctor schedule:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan jadwal dokter untuk tanggal tertentu
   */
  static async getDoctorSchedules(doctorId: string, date: Date): Promise<DoctorSchedule[]> {
    try {
      // Dalam implementasi nyata, kita akan mengambil dari database
      // Untuk sekarang kita kembalikan data dummy
      return [
        {
          id: `sched-${Date.now()}-morning`,
          doctorId,
          poliId: 'poli-internal',
          dayOfWeek: date.getDay(),
          startTime: '08:00',
          endTime: '12:00',
          maxPatients: 20,
          currentPatients: 15,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: `sched-${Date.now()}-afternoon`,
          doctorId,
          poliId: 'poli-internal',
          dayOfWeek: date.getDay(),
          startTime: '13:00',
          endTime: '16:00',
          maxPatients: 15,
          currentPatients: 8,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
    } catch (error) {
      logger.error('Error getting doctor schedules:', error);
      throw error;
    }
  }

  /**
   * Membuat janji temu
   */
  static async createAppointment(data: {
    patientId: string;
    doctorScheduleId: string;
    appointmentDate: Date;
    notes?: string;
  }): Promise<Appointment> {
    try {
      // Dapatkan jadwal dokter
      const schedule = await prisma.$executeRaw`
        SELECT * FROM "DoctorSchedule" WHERE id = ${data.doctorScheduleId}
      `;
      
      // Dalam implementasi nyata, kita akan membuat entitas di database
      // Untuk sekarang kita kembalikan data dummy
      return {
        id: `apt-${Date.now()}`,
        patientId: data.patientId,
        doctorScheduleId: data.doctorScheduleId,
        appointmentDate: data.appointmentDate,
        appointmentNumber: 10, // Dalam implementasi nyata, ini akan dihitung
        status: 'scheduled',
        notes: data.notes || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error creating appointment:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan antrian untuk poli tertentu
   */
  static async getCurrentQueue(poliId: string): Promise<QueueNumber[]> {
    try {
      // Dalam implementasi nyata, kita akan mengambil dari database
      // Untuk sekarang kita kembalikan data dummy
      return [
        {
          id: `queue-${Date.now()}-1`,
          appointmentId: 'apt-1',
          queueNumber: 1,
          poliId,
          called: true,
          served: true,
          calledAt: new Date(Date.now() - 1200000), // 20 menit yang lalu
          servedAt: new Date(Date.now() - 600000), // 10 menit yang lalu
          createdAt: new Date(Date.now() - 1800000), // 30 menit yang lalu
          updatedAt: new Date()
        },
        {
          id: `queue-${Date.now()}-2`,
          appointmentId: 'apt-2',
          queueNumber: 2,
          poliId,
          called: true,
          served: false,
          calledAt: new Date(Date.now() - 600000), // 10 menit yang lalu
          createdAt: new Date(Date.now() - 1200000), // 20 menit yang lalu
          updatedAt: new Date()
        },
        {
          id: `queue-${Date.now()}-3`,
          appointmentId: 'apt-3',
          queueNumber: 3,
          poliId,
          called: false,
          served: false,
          createdAt: new Date(Date.now() - 600000), // 10 menit yang lalu
          updatedAt: new Date()
        }
      ];
    } catch (error) {
      logger.error('Error getting current queue:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan nomor antrian berikutnya
   */
  static async getNextQueueNumber(poliId: string): Promise<number> {
    try {
      // Dalam implementasi nyata, kita akan menghitung dari database
      // Untuk sekarang kita kembalikan angka dummy
      return 4;
    } catch (error) {
      logger.error('Error getting next queue number:', error);
      throw error;
    }
  }

  /**
   * Memanggil antrian
   */
  static async callNextQueue(poliId: string): Promise<QueueNumber | null> {
    try {
      // Dalam implementasi nyata, kita akan mengupdate database
      // Untuk sekarang kita kembalikan data dummy
      return {
        id: `queue-${Date.now()}-next`,
        appointmentId: 'apt-next',
        queueNumber: 3,
        poliId,
        called: true,
        served: false,
        calledAt: new Date(),
        createdAt: new Date(Date.now() - 60000), // 1 menit yang lalu
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error calling next queue:', error);
      throw error;
    }
  }

  /**
   * Menandai antrian telah dilayani
   */
  static async markQueueAsServed(queueId: string): Promise<QueueNumber> {
    try {
      // Dalam implementasi nyata, kita akan mengupdate database
      // Untuk sekarang kita kembalikan data dummy
      return {
        id: queueId,
        appointmentId: 'apt-2',
        queueNumber: 2,
        poliId: 'poli-internal',
        called: true,
        served: true,
        calledAt: new Date(Date.now() - 600000), // 10 menit yang lalu
        servedAt: new Date(),
        createdAt: new Date(Date.now() - 1200000), // 20 menit yang lalu
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error marking queue as served:', error);
      throw error;
    }
  }

  /**
   * Membatalkan janji temu
   */
  static async cancelAppointment(appointmentId: string, reason: string): Promise<Appointment> {
    try {
      // Dalam implementasi nyata, kita akan mengupdate database
      // Untuk sekarang kita kembalikan data dummy
      return {
        id: appointmentId,
        patientId: 'patient-1',
        doctorScheduleId: 'sched-1',
        appointmentDate: new Date(Date.now() + 86400000), // besok
        appointmentNumber: 5,
        status: 'canceled',
        notes: reason,
        createdAt: new Date(Date.now() - 86400000), // kemarin
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error canceling appointment:', error);
      throw error;
    }
  }
}