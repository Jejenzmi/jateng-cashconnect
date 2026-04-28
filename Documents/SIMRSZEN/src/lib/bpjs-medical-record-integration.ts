import axios, { AxiosRequestConfig } from 'axios';
import { deflate, inflate } from 'zlib';
import { promisify } from 'util';

const deflateAsync = promisify(deflate);
const inflateAsync = promisify(inflate);

export interface BpjsMedicalRecordConfig {
  consumerId: string;
  consumerSecret: string;
  userKey: string;
  baseUrl: string;
  serviceName: string;
}

export interface InsertMedicalRecordRequest {
  noSep: string;
  jnsPelayanan: string; // 1 = rawat inap, 2 = rawat jalan
  bulan: string;
  tahun: string;
  dataMR: string; // compressed and encrypted data
}

export interface InsertMedicalRecordResponse {
  metadata: {
    code: string;
    message: string;
  };
  response: any;
}

export interface MedicalRecordResource {
  resourceType: string;
  [key: string]: any;
}

export class BpjsMedicalRecordIntegration {
  private config: BpjsMedicalRecordConfig;

  constructor(config: BpjsMedicalRecordConfig) {
    this.config = config;
  }

  /**
   * Menghasilkan timestamp dalam format Unix (detik sejak 1 Januari 1970)
   */
  private getUnixTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Membuat signature menggunakan HMAC-SHA256
   */
  private generateSignature(timestamp: number): string {
    const dataToSign = `${this.config.consumerId}&${timestamp}`;
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', this.config.consumerSecret);
    hmac.update(dataToSign);
    return hmac.digest('base64');
  }

  /**
   * Membuat konfigurasi header untuk permintaan ke layanan BPJS
   */
  private createHeaders(): Record<string, string> {
    const timestamp = this.getUnixTimestamp();
    const signature = this.generateSignature(timestamp);

    return {
      'X-cons-id': this.config.consumerId,
      'X-timestamp': timestamp.toString(),
      'X-signature': signature,
      'user_key': this.config.userKey,
      'Content-Type': 'application/json; charset=utf-8',
    };
  }

  /**
   * Melakukan kompresi data menggunakan gzip
   */
  async compressData(data: string): Promise<string> {
    const buffer = await deflateAsync(data);
    return buffer.toString('base64');
  }

  /**
   * Membuat data MR terenkripsi
   * Encrypt menggunakan key dengan kombinasi consid + secretkey + koders
   */
  async encryptData(data: string, koders: string): Promise<string> {
    // Kombinasi key: consid + secretkey + koders
    const key = this.config.consumerId + this.config.consumerSecret + koders;
    
    // Kita akan menggunakan base64 encoding sebagai simulasi enkripsi untuk saat ini
    // Implementasi sebenarnya akan memerlukan algoritma enkripsi yang sesuai
    const compressed = await this.compressData(data);
    
    // Dalam implementasi sebenarnya, Anda akan menggunakan algoritma enkripsi
    // seperti AES-256-CBC di sini
    return compressed;
  }

  /**
   * Melakukan permintaan POST ke layanan BPJS dengan header otentikasi
   */
  private async makePostRequest(endpoint: string, data: any): Promise<any> {
    const headers = this.createHeaders();
    const url = `${this.config.baseUrl}/${this.config.serviceName}/${endpoint}`;

    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error during BPJS Medical Record request:', error);
      throw error;
    }
  }

  /**
   * Menyisipkan rekam medis ke sistem BPJS
   */
  async insertMedicalRecord(request: InsertMedicalRecordRequest): Promise<InsertMedicalRecordResponse> {
    const endpoint = 'eclaim/rekammedis/insert';
    
    // Struktur permintaan harus sesuai dengan spesifikasi
    const payload = {
      request: request
    };

    return this.makePostRequest(endpoint, payload);
  }

  /**
   * Membuat dan menyisipkan rekam medis lengkap dari data FHIR
   */
  async insertCompleteMedicalRecord(
    noSep: string,
    jnsPelayanan: string,
    bulan: string,
    tahun: string,
    koders: string, // untuk enkripsi
    medicalRecordData: MedicalRecordResource[]
  ): Promise<InsertMedicalRecordResponse> {
    // Membuat bundle FHIR dari data rekam medis
    const bundle: MedicalRecordResource = {
      resourceType: 'Bundle',
      id: `bundle-${Date.now()}`,
      meta: {
        lastUpdated: new Date().toISOString()
      },
      identifier: {
        system: 'sep',
        value: noSep
      },
      type: 'document',
      entry: medicalRecordData.map(resource => ({ resource }))
    };

    // Konversi bundle ke string JSON
    const jsonData = JSON.stringify(bundle);

    // Enkripsi data
    const encryptedData = await this.encryptData(jsonData, koders);

    // Buat request
    const request: InsertMedicalRecordRequest = {
      noSep,
      jnsPelayanan,
      bulan,
      tahun,
      dataMR: encryptedData
    };

    return this.insertMedicalRecord(request);
  }

  /**
   * Membuat resource Composition FHIR
   */
  createCompositionResource(
    id: string,
    patientReference: string,
    encounterReference: string,
    practitionerReference: string,
    date: string
  ): MedicalRecordResource {
    return {
      resourceType: 'Composition',
      id,
      status: 'final',
      type: {
        coding: [
          {
            system: 'http://loinc.org',
            code: '81218-0'
          }
        ],
        text: 'Discharge Summary'
      },
      subject: {
        reference: patientReference,
        display: 'Patient Name'
      },
      encounter: {
        reference: encounterReference
      },
      date,
      author: [
        {
          reference: practitionerReference,
          display: 'Doctor Name'
        }
      ],
      title: 'Discharge Summary',
      confidentiality: 'N',
      section: []
    };
  }

  /**
   * Membuat resource Patient FHIR
   */
  createPatientResource(
    id: string,
    name: string,
    gender: 'male' | 'female',
    birthDate: string,
    address: string
  ): MedicalRecordResource {
    return {
      resourceType: 'Patient',
      id,
      identifier: [
        {
          use: 'usual',
          type: {
            coding: [
              {
                system: 'http://hl7.org/fhir/v2/0203',
                code: 'MR'
              }
            ]
          },
          value: '12345',
          assigner: {
            display: 'RSUPN DR CIPTO'
          }
        }
      ],
      active: true,
      name: [
        {
          use: 'official',
          text: name
        }
      ],
      gender,
      birthDate,
      deceasedBoolean: false,
      address: [
        {
          line: [address],
          use: 'home',
          type: 'both'
        }
      ],
      managingOrganization: {
        reference: 'Organization/' + id,
        display: 'Hospital Name'
      }
    };
  }

  /**
   * Membuat resource Encounter FHIR
   */
  createEncounterResource(
    id: string,
    patientReference: string,
    startDate: string,
    endDate: string,
    reason: string
  ): MedicalRecordResource {
    return {
      resourceType: 'Encounter',
      id,
      identifier: [
        {
          system: 'http://api.bpjs-kesehatan.go.id:8080/Vclaim-rest/SEP/',
          value: '0901R0022818V028012'
        }
      ],
      subject: {
        reference: patientReference,
        display: 'Patient Name',
        noSep: '0901R0012218V028012'
      },
      class: {
        system: 'http://hl7.org/fhir/v3/ActCode',
        code: 'IMP',
        display: 'inpatient encounter'
      },
      reason: [
        {
          coding: [
            {
              code: '',
              display: null,
              system: 'http://hl7.org/fhir/sid/icd-10'
            }
          ],
          text: reason
        }
      ],
      period: {
        start: startDate,
        end: endDate
      },
      status: 'finished'
    };
  }
}