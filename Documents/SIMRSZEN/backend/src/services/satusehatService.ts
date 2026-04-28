import axios from 'axios';
import { SatuSehatAuthService } from './satusehatAuthService';
import { Patient } from '@prisma/client';
import { logger } from '../utils/logger';

export class SatuSehatService {
  private authService: SatuSehatAuthService;
  private baseURL: string;

  constructor() {
    this.authService = SatuSehatAuthService.getInstance();
    // Gunakan staging FHIR URL sesuai dengan referensi Postman Kemenkes (Satu Sehat Public)
    this.baseURL = process.env.SATUSEHAT_BASE_URL || 'https://api-satusehat-stg.dto.kemkes.go.id/fhir-r4/v1';
  }

  async createPatient(patient: Patient): Promise<any> {
    try {
      const token = await this.authService.getToken();
      
      // Format data pasien sesuai standar FHIR
      const patientData = {
        resourceType: 'Patient',
        id: patient.id,
        identifier: [
          {
            use: 'official',
            system: 'http://hl7.org/fhir/sid/nik',
            value: patient.nik || '', // Handle nullable field
          }
        ],
        name: [
          {
            use: 'official',
            family: patient.name.split(' ').slice(-1)[0] || patient.name, // Ambil kata terakhir sebagai nama belakang
            given: [patient.name.split(' ')[0]] // Ambil kata pertama sebagai nama depan
          }
        ],
        telecom: patient.phone ? [
          {
            system: 'phone',
            value: patient.phone,
          }
        ] : undefined,
        gender: patient.gender === 'Laki-laki' ? 'male' : 'female',
        birthDate: patient.dateOfBirth ? patient.dateOfBirth.toISOString().split('T')[0] : undefined,
        address: patient.address ? [
          {
            use: 'home',
            text: patient.address,
            line: [patient.address],
          }
        ] : undefined,
      };

      const response = await axios.post(
        `${this.baseURL}/Patient`,
        patientData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      logger.error('Error creating patient in Satu Sehat:', error.response?.data || error.message);
      throw new Error(`Failed to create patient in Satu Sehat: ${error.message}`);
    }
  }

  async getPatient(id: string): Promise<any> {
    try {
      const token = await this.authService.getToken();

      const response = await axios.get(
        `${this.baseURL}/Patient/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      logger.error('Error getting patient from Satu Sehat:', error.response?.data || error.message);
      throw new Error(`Failed to get patient from Satu Sehat: ${error.message}`);
    }
  }

  async updatePatient(patient: Patient): Promise<any> {
    try {
      const token = await this.authService.getToken();
      
      // Format data pasien sesuai standar FHIR
      const patientData = {
        resourceType: 'Patient',
        id: patient.id,
        identifier: [
          {
            use: 'official',
            system: 'http://hl7.org/fhir/sid/nik',
            value: patient.nik || '', // Handle nullable field
          }
        ],
        name: [
          {
            use: 'official',
            family: patient.name.split(' ').slice(-1)[0] || patient.name, // Ambil kata terakhir sebagai nama belakang
            given: [patient.name.split(' ')[0]] // Ambil kata pertama sebagai nama depan
          }
        ],
        telecom: patient.phone ? [ // Changed from phone to noHp
          {
            system: 'phone',
            value: patient.phone,
          }
        ] : undefined,
        gender: patient.gender === 'Laki-laki' ? 'male' : 'female', // Updated to match actual field
        birthDate: patient.dateOfBirth ? patient.dateOfBirth.toISOString().split('T')[0] : undefined, // Handle nullable field
        address: patient.address ? [ // Handle nullable field
          {
            use: 'home',
            text: patient.address,
            line: [patient.address],
          }
        ] : undefined,
        // ... other fields
      };

      const response = await axios.put(
        `${this.baseURL}/Patient/${patient.id}`,
        patientData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      logger.error('Error updating patient in Satu Sehat:', error.response?.data || error.message);
      throw new Error(`Failed to update patient in Satu Sehat: ${error.message}`);
    }
  }

  async createEncounter(encounterData: any): Promise<any> {
    try {
      const token = await this.authService.getToken();
      
      const response = await axios.post(
        `${this.baseURL}/Encounter`,
        encounterData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      logger.error('Error creating encounter in Satu Sehat:', error.response?.data || error.message);
      throw new Error(`Failed to create encounter in Satu Sehat: ${error.message}`);
    }
  }

  async createCondition(conditionData: any): Promise<any> {
    try {
      const token = await this.authService.getToken();
      
      const response = await axios.post(
        `${this.baseURL}/Condition`,
        conditionData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      logger.error('Error creating condition in Satu Sehat:', error.response?.data || error.message);
      throw new Error(`Failed to create condition in Satu Sehat: ${error.message}`);
    }
  }

  async createObservation(observationData: any): Promise<any> {
    try {
      const token = await this.authService.getToken();
      
      const response = await axios.post(
        `${this.baseURL}/Observation`,
        observationData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      logger.error('Error creating observation in Satu Sehat:', error.response?.data || error.message);
      throw new Error(`Failed to create observation in Satu Sehat: ${error.message}`);
    }
  }
}