import { ModuleConfig } from './modules.config';
import { FaskesType } from '../types/faskes';

/**
 * Konfigurasi Modul berdasarkan Tipe Fasilitas Kesehatan (Faskes)
 * Menentukan modul-modul yang akan muncul sesuai dengan tipe faskes
 */

export interface FaskesModuleConfig {
  faskesType: FaskesType;
  allowedModules: string[]; // Array kode modul yang diizinkan
  bpjsIntegrations: BpjsIntegrationConfig; // Konfigurasi integrasi BPJS berdasarkan tipe faskes
}

export interface BpjsIntegrationConfig {
  pcareEnabled: boolean; // Hanya untuk Klinik dan Puskesmas
  vclaimEnabled: boolean; // Hanya untuk Rumah Sakit
  icareEnabled: boolean; // Untuk semua tipe faskes yang terdaftar di BPJS
  antreanEnabled: boolean; // Untuk semua tipe faskes yang melayani pasien
}

// Definisi tipe faskes
export const FASKES_TYPES: FaskesType[] = [
  {
    id: 'rumah_sakit',
    name: 'Rumah Sakit',
    description: 'Fasilitas kesehatan tingkat lanjut',
    level: 'tersier',
    category: 'rumah_sakit',
    isActive: true
  },
  {
    id: 'puskesmas',
    name: 'Puskesmas',
    description: 'Fasilitas kesehatan tingkat pertama',
    level: 'primer',
    category: 'puskesmas',
    isActive: true
  },
  {
    id: 'klinik',
    name: 'Klinik',
    description: 'Fasilitas kesehatan tingkat pertama atau sekunder',
    level: 'primer',
    category: 'klinik',
    isActive: true
  },
  {
    id: 'laboratorium',
    name: 'Laboratorium',
    description: 'Fasilitas pemeriksaan laboratorium',
    level: 'primer',
    category: 'laboratorium',
    isActive: true
  },
  {
    id: 'radiologi',
    name: 'Radiologi',
    description: 'Fasilitas pemeriksaan radiologi',
    level: 'primer',
    category: 'radiologi',
    isActive: true
  }
];

// Konfigurasi modul berdasarkan tipe faskes
export const FASKES_MODULE_CONFIGS: FaskesModuleConfig[] = [
  // Konfigurasi untuk Rumah Sakit
  {
    faskesType: FASKES_TYPES[0], // Rumah Sakit
    allowedModules: [
      'MODULE_MGMT',         // Manajemen modul dan hak akses
      'PATIENT',             // Manajemen pasien
      'INPATIENT',           // Rawat inap
      'OUTPATIENT',          // Rawat jalan
      'EMERGENCY',           // IGD
      'PHARMACY',            // Farmasi
      'LABORATORY',          // Laboratorium
      'RADIOLOGY',           // Radiologi
      'BLOOD_BANK',          // Bank darah
      'NUTRITION',           // Gizi klinis
      'REHABILITATION',     // Rehab medik
      'ICU',                // ICU
      'DIALYSIS',           // Hemodialisis
      'BILLING',            // Billing dan keuangan
      'HR',                 // SDM
      'INVENTORY',          // Inventaris
      'MAINTENANCE',        // Pemeliharaan
      'CSSD',               // CSSD
      'MEDICAL_RECORD',     // Rekam medis
      'QUEUE',              // Antrian
      'REPORTS',            // Laporan
      'ACCOUNTING',         // Akuntansi
      'SURGERY',            // Bedah
      'DENTAL',             // Gigi
      'MATERNITY',          // Kebidanan
      'PSYCHOLOGY',         // Psikologi klinis
      'SPIRITUAL_CARE'      // Pelayanan rohani
    ],
    bpjsIntegrations: {
      pcareEnabled: false,     // RS tidak pakai PCare
      vclaimEnabled: true,     // RS punya VClaim
      icareEnabled: true,      // RS punya iCare
      antreanEnabled: true     // RS pakai antrean online
    }
  },

  // Konfigurasi untuk Puskesmas
  {
    faskesType: FASKES_TYPES[1], // Puskesmas
    allowedModules: [
      'MODULE_MGMT',         // Manajemen modul dan hak akses
      'PATIENT',             // Manajemen pasien
      'OUTPATIENT',          // Rawat jalan
      'PHARMACY',            // Farmasi (obat)
      'LABORATORY',          // Laboratorium
      'RADIOLOGY',           // Radiologi (jika tersedia)
      'NUTRITION',           // Gizi (promotif preventif)
      'MEDICAL_RECORD',      // Rekam medis
      'QUEUE',               // Antrian
      'REPORTS',             // Laporan (termasuk RL)
      'INVENTORY',           // Inventaris
      'PSYCHOLOGY',          // Psikologi (jika ada layanan)
      'SPIRITUAL_CARE'       // Pelayanan rohani (jika ada)
    ],
    bpjsIntegrations: {
      pcareEnabled: true,      // Puskesmas bisa akses PCare
      vclaimEnabled: false,    // Puskesmas tidak pakai VClaim
      icareEnabled: true,      // Puskesmas bisa pakai iCare
      antreanEnabled: true     // Puskesmas bisa pakai antrean online
    }
  },

  // Konfigurasi untuk Klinik
  {
    faskesType: FASKES_TYPES[2], // Klinik
    allowedModules: [
      'MODULE_MGMT',         // Manajemen modul dan hak akses
      'PATIENT',             // Manajemen pasien
      'OUTPATIENT',          // Rawat jalan
      'PHARMACY',            // Farmasi
      'LABORATORY',          // Laboratorium (jika ada)
      'RADIOLOGY',           // Radiologi (jika ada)
      'MEDICAL_RECORD',      // Rekam medis
      'QUEUE',               // Antrian
      'REPORTS',             // Laporan
      'INVENTORY',           // Inventaris
      'PSYCHOLOGY',          // Psikologi (jika ada layanan)
      'SPIRITUAL_CARE'       // Pelayanan rohani (jika ada)
    ],
    bpjsIntegrations: {
      pcareEnabled: true,      // Klinik bisa akses PCare
      vclaimEnabled: false,    // Klinik tidak pakai VClaim
      icareEnabled: true,      // Klinik bisa pakai iCare
      antreanEnabled: true     // Klinik bisa pakai antrean online
    }
  },

  // Konfigurasi untuk Laboratorium
  {
    faskesType: FASKES_TYPES[3], // Laboratorium
    allowedModules: [
      'MODULE_MGMT',         // Manajemen modul dan hak akses
      'PATIENT',             // Manajemen pasien
      'LABORATORY',          // Laboratorium
      'MEDICAL_RECORD',      // Rekam medis
      'REPORTS',             // Laporan
      'INVENTORY'            // Inventaris
    ],
    bpjsIntegrations: {
      pcareEnabled: false,     // Lab tidak pakai PCare
      vclaimEnabled: false,    // Lab tidak pakai VClaim
      icareEnabled: true,      // Lab bisa pakai iCare
      antreanEnabled: false    // Lab biasanya tidak pakai antrean online
    }
  },

  // Konfigurasi untuk Radiologi
  {
    faskesType: FASKES_TYPES[4], // Radiologi
    allowedModules: [
      'MODULE_MGMT',         // Manajemen modul dan hak akses
      'PATIENT',             // Manajemen pasien
      'RADIOLOGY',           // Radiologi
      'MEDICAL_RECORD',      // Rekam medis
      'REPORTS',             // Laporan
      'INVENTORY'            // Inventaris
    ],
    bpjsIntegrations: {
      pcareEnabled: false,     // Rad tidak pakai PCare
      vclaimEnabled: false,    // Rad tidak pakai VClaim
      icareEnabled: true,      // Rad bisa pakai iCare
      antreanEnabled: false    // Rad biasanya tidak pakai antrean online
    }
  }
];

/**
 * Fungsi untuk mendapatkan konfigurasi modul berdasarkan tipe faskes
 */
export const getModulesForFaskesType = (faskesTypeId: string): string[] => {
  const config = FASKES_MODULE_CONFIGS.find(item => item.faskesType.id === faskesTypeId);
  return config ? config.allowedModules : [];
};

/**
 * Fungsi untuk mendapatkan konfigurasi BPJS berdasarkan tipe faskes
 */
export const getBpjsConfigForFaskesType = (faskesTypeId: string): BpjsIntegrationConfig | null => {
  const config = FASKES_MODULE_CONFIGS.find(item => item.faskesType.id === faskesTypeId);
  return config ? config.bpjsIntegrations : null;
};

/**
 * Fungsi untuk mengecek apakah modul tertentu diizinkan untuk tipe faskes tertentu
 */
export const isModuleAllowedForFaskes = (moduleCode: string, faskesTypeId: string): boolean => {
  const allowedModules = getModulesForFaskesType(faskesTypeId);
  return allowedModules.includes(moduleCode);
};

/**
 * Fungsi untuk mengecek apakah integrasi BPJS tertentu diizinkan untuk tipe faskes tertentu
 */
export const isBpjsIntegrationAllowed = (integration: keyof BpjsIntegrationConfig, faskesTypeId: string): boolean => {
  const bpjsConfig = getBpjsConfigForFaskesType(faskesTypeId);
  return bpjsConfig ? bpjsConfig[integration] : false;
};