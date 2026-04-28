import { PrismaClient, Patient, Visit, Kamar, InpatientStay } from '@prisma/client';
import { logger } from '../utils/logger.util';

const prisma = new PrismaClient();

// Interfaces untuk modul penunjang medis
interface EmergencyCase {
  id: string;
  patientId: string;
  visitId: string;
  triageLevel: number; // 1-5 (1 = emergensi tertinggi)
  chiefComplaint: string;
  arrivalTime: Date;
  disposition: string; // rawat_inap, rawat_jalan, pulang, rujuk
  status: string; // registered, examined, treated, discharged
  createdAt: Date;
  updatedAt: Date;
}

interface IcuStay {
  id: string;
  patientId: string;
  inpatientStayId: string;
  kamarId: string;
  icuTypeId: string; // icu, hcu, nicu, picu, iccu
  admissionDateTime: Date;
  dischargeDateTime?: Date;
  status: string; // active, discharged, transferred
  createdAt: Date;
  updatedAt: Date;
}

interface BloodDonation {
  id: string;
  donorId: string; // bisa berupa patientId atau pendonor luar
  donationDate: Date;
  bloodType: string; // A, B, AB, O +/-
  amount: number; // dalam ml
  bloodComponents: string[]; // whole_blood, plasma, platelets, etc
  status: string; // pending, processed, tested, stored, issued
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BloodComponent {
  id: string;
  donationId: string;
  componentType: string; // whole_blood, plasma, platelets, rbc
  expiryDate: Date;
  status: string; // stored, reserved, issued, discarded
  patientId?: string; // jika sudah dikeluarkan untuk pasien
  createdAt: Date;
  updatedAt: Date;
}

export class SupportingServicesService {
  /**
   * Mendaftarkan kasus gawat darurat
   */
  static async registerEmergencyCase(data: {
    patientId: string;
    visitId: string;
    triageLevel: number;
    chiefComplaint: string;
    arrivalTime?: Date;
  }): Promise<EmergencyCase> {
    try {
      const emergencyCase = await prisma.$executeRaw`
        INSERT INTO "EmergencyCase" (
          "id", "patient_id", "visit_id", "triage_level", 
          "chief_complaint", "arrival_time", "status", 
          "created_at", "updated_at"
        ) VALUES (
          gen_random_uuid(), 
          ${data.patientId},
          ${data.visitId},
          ${data.triageLevel},
          ${data.chiefComplaint},
          ${data.arrivalTime || new Date()},
          'registered',
          NOW(),
          NOW()
        )
      `;

      return {
        id: `emg-${Date.now()}`,
        patientId: data.patientId,
        visitId: data.visitId,
        triageLevel: data.triageLevel,
        chiefComplaint: data.chiefComplaint,
        arrivalTime: data.arrivalTime || new Date(),
        disposition: '',
        status: 'registered',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error registering emergency case:', error);
      throw error;
    }
  }

  /**
   * Memperbarui status kasus gawat darurat
   */
  static async updateEmergencyCaseStatus(caseId: string, status: string, disposition?: string): Promise<EmergencyCase> {
    try {
      // Dalam implementasi nyata, kita akan mengupdate database
      // Untuk sekarang kita kembalikan data dummy
      return {
        id: caseId,
        patientId: 'patient-1',
        visitId: 'visit-1',
        triageLevel: 2,
        chiefComplaint: 'Sesak napas',
        arrivalTime: new Date(),
        disposition: disposition || '',
        status,
        createdAt: new Date(Date.now() - 3600000), // 1 jam yang lalu
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error updating emergency case status:', error);
      throw error;
    }
  }

  /**
   * Mendaftarkan pasien ke ICU
   */
  static async admitToIcu(data: {
    patientId: string;
    inpatientStayId: string;
    kamarId: string;
    icuTypeId: string;
    admissionDateTime?: Date;
  }): Promise<IcuStay> {
    try {
      // Dalam implementasi nyata, kita akan membuat entitas di database
      // Untuk sekarang kita kembalikan data dummy
      return {
        id: `icu-${Date.now()}`,
        patientId: data.patientId,
        inpatientStayId: data.inpatientStayId,
        kamarId: data.kamarId,
        icuTypeId: data.icuTypeId,
        admissionDateTime: data.admissionDateTime || new Date(),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error admitting patient to ICU:', error);
      throw error;
    }
  }

  /**
   * Memindahkan pasien dari ICU
   */
  static async dischargeFromIcu(icuStayId: string, dischargeDateTime?: Date): Promise<IcuStay> {
    try {
      // Dalam implementasi nyata, kita akan mengupdate database
      // Untuk sekarang kita kembalikan data dummy
      return {
        id: icuStayId,
        patientId: 'patient-1',
        inpatientStayId: 'inpatient-1',
        kamarId: 'kamar-1',
        icuTypeId: 'icu',
        admissionDateTime: new Date(Date.now() - 86400000), // 1 hari yang lalu
        dischargeDateTime: dischargeDateTime || new Date(),
        status: 'discharged',
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error discharging patient from ICU:', error);
      throw error;
    }
  }

  /**
   * Mencatat donasi darah
   */
  static async recordBloodDonation(data: {
    donorId: string;
    donationDate: Date;
    bloodType: string;
    amount: number;
    bloodComponents: string[];
    notes: string;
  }): Promise<BloodDonation> {
    try {
      // Dalam implementasi nyata, kita akan membuat entitas di database
      // Untuk sekarang kita kembalikan data dummy
      return {
        id: `donation-${Date.now()}`,
        donorId: data.donorId,
        donationDate: data.donationDate,
        bloodType: data.bloodType,
        amount: data.amount,
        bloodComponents: data.bloodComponents,
        status: 'stored',
        notes: data.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error recording blood donation:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan stok darah
   */
  static async getBloodStock(): Promise<Record<string, number>> {
    try {
      // Dalam implementasi nyata, kita akan mengambil dari database
      // Untuk sekarang kita kembalikan data dummy
      return {
        'A+': 15,
        'A-': 5,
        'B+': 12,
        'B-': 3,
        'AB+': 8,
        'AB-': 2,
        'O+': 20,
        'O-': 7
      };
    } catch (error) {
      logger.error('Error getting blood stock:', error);
      throw error;
    }
  }

  /**
   * Mengeluarkan komponen darah untuk pasien
   */
  static async issueBloodComponent(componentId: string, patientId: string): Promise<BloodComponent> {
    try {
      // Dalam implementasi nyata, kita akan mengupdate database
      // Untuk sekarang kita kembalikan data dummy
      return {
        id: componentId,
        donationId: 'donation-1',
        componentType: 'whole_blood',
        expiryDate: new Date(Date.now() + 2592000000), // 30 hari dari sekarang
        status: 'issued',
        patientId,
        createdAt: new Date(Date.now() - 86400000), // 1 hari yang lalu
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error issuing blood component:', error);
      throw error;
    }
  }
}