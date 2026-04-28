import { inpatientModuleConfig } from './inpatient-module.config';
import { cssdModuleConfig } from './cssd-module.config';
import { nutritionModuleConfig } from './nutrition-module.config';
import { maintenanceModuleConfig } from './maintenance-module.config';
import { clinicalPsychologyModuleConfig } from './clinical-psychology-module.config';
import { spiritualCareModuleConfig } from './spiritual-care-module.config';
import { hrModuleConfig } from './hr-module.config';
import { purchasingModuleConfig } from './purchasing-module.config';

/**
 * Konfigurasi Modul SIMRS ZEN
 * Mengelompokkan semua modul SIMRS dengan fitur dan izin masing-masing
 */

export interface ModuleConfig {
  moduleName: string;
  moduleCode: string;
  features: Feature[];
  permissions: Permission[];
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  enabled: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  actions: string[];
}

export const moduleConfigs: ModuleConfig[] = [
  {
    moduleName: 'Manajemen Modul dan Hak Akses',
    moduleCode: 'MODULE_MGMT',
    features: [
      {
        id: 'module-management',
        name: 'Manajemen Modul',
        description: 'Manajemen modul dan izin akses',
        route: '/module-management',
        icon: 'Settings',
        enabled: true
      },
      {
        id: 'faskes-config',
        name: 'Konfigurasi Faskes',
        description: 'Manajemen konfigurasi modul berdasarkan tipe faskes',
        route: '/faskes-config',
        icon: 'Building',
        enabled: true
      }
    ],
    permissions: [
      {
        id: 'module_management_access',
        name: 'Akses Manajemen Modul',
        description: 'Akses ke fitur manajemen modul dan izin',
        actions: ['view', 'create', 'update', 'delete']
      },
      {
        id: 'faskes_config_access',
        name: 'Akses Konfigurasi Faskes',
        description: 'Akses ke fitur konfigurasi modul berdasarkan tipe faskes',
        actions: ['view', 'create', 'update', 'delete']
      }
    ]
  },
  {
    moduleName: 'Manajemen Pasien',
    moduleCode: 'PATIENT',
    features: [
      {
        id: 'patient-registration',
        name: 'Pendaftaran Pasien',
        description: 'Registrasi pasien baru dan manajemen data pasien',
        route: '/patient/registration',
        icon: 'UserPlus',
        enabled: true
      },
      {
        id: 'patient-search',
        name: 'Pencarian Pasien',
        description: 'Pencarian data pasien berdasarkan berbagai kriteria',
        route: '/patient/search',
        icon: 'Search',
        enabled: true
      },
      {
        id: 'patient-history',
        name: 'Riwayat Pasien',
        description: 'Riwayat kunjungan dan pengobatan pasien',
        route: '/patient/history',
        icon: 'History',
        enabled: true
      }
    ],
    permissions: [
      {
        id: 'patient_registration_access',
        name: 'Akses Pendaftaran',
        description: 'Akses ke fitur pendaftaran pasien',
        actions: ['view', 'create', 'update', 'delete']
      },
      {
        id: 'patient_data_access',
        name: 'Akses Data Pasien',
        description: 'Akses ke data dan riwayat pasien',
        actions: ['view', 'update']
      }
    ]
  },
  {
    moduleName: 'Rawat Jalan',
    moduleCode: 'OUTPATIENT',
    features: [
      {
        id: 'outpatient-appointment',
        name: 'Janji Temu',
        description: 'Pembuatan dan manajemen janji temu pasien rawat jalan',
        route: '/outpatient/appointment',
        icon: 'Calendar',
        enabled: true
      },
      {
        id: 'outpatient-examination',
        name: 'Pemeriksaan',
        description: 'Pemeriksaan klinis pasien rawat jalan',
        route: '/outpatient/examination',
        icon: 'Stethoscope',
        enabled: true
      },
      {
        id: 'outpatient-billing',
        name: 'Tagihan Rawat Jalan',
        description: 'Pembuatan dan manajemen tagihan rawat jalan',
        route: '/outpatient/billing',
        icon: 'Receipt',
        enabled: true
      }
    ],
    permissions: [
      {
        id: 'outpatient_appointment_access',
        name: 'Akses Janji Temu',
        description: 'Akses ke fitur manajemen janji temu',
        actions: ['view', 'create', 'update', 'delete']
      },
      {
        id: 'outpatient_examination_access',
        name: 'Akses Pemeriksaan',
        description: 'Akses ke fitur pemeriksaan pasien',
        actions: ['view', 'create', 'update']
      }
    ]
  },
  {
    moduleName: 'Farmasi',
    moduleCode: 'PHARMACY',
    features: [
      {
        id: 'prescription-management',
        name: 'Manajemen Resep',
        description: 'Sistem resep digital dari dokter, verifikasi oleh apoteker, distribusi obat',
        route: '/pharmacy/prescription-management',
        icon: 'FileText',
        enabled: true
      },
      {
        id: 'medicine-inventory',
        name: 'Inventaris Obat',
        description: 'Pengelolaan stok obat dan informasi produk',
        route: '/pharmacy/medicine-inventory',
        icon: 'Package',
        enabled: true
      },
      {
        id: 'expired-medicines',
        name: 'Pengelolaan Obat Kadaluarsa',
        description: 'Notifikasi dan manajemen obat yang akan kadaluarsa',
        route: '/pharmacy/expired-medicines',
        icon: 'Clock',
        enabled: true
      },
      {
        id: 'drug-reconciliation',
        name: 'Rekonsiliasi Obat',
        description: 'Pembandingan obat sebelum dan sesudah rawat inap',
        route: '/pharmacy/drug-reconciliation',
        icon: 'FileText',
        enabled: true
      }
    ],
    permissions: [
      {
        id: 'prescription_management_access',
        name: 'Akses Manajemen Resep',
        description: 'Akses ke fitur manajemen resep dan distribusi obat',
        actions: ['view', 'create', 'update', 'delete']
      },
      {
        id: 'inventory_management_access',
        name: 'Akses Inventaris',
        description: 'Akses ke fitur manajemen inventaris obat',
        actions: ['view', 'create', 'update']
      }
    ]
  },
  // ... (modul-modul lainnya tetap sama)
  inpatientModuleConfig,
  cssdModuleConfig,
  nutritionModuleConfig,
  maintenanceModuleConfig,
  clinicalPsychologyModuleConfig,
  spiritualCareModuleConfig,
  hrModuleConfig,
  purchasingModuleConfig
];

export const allModulesConfig = moduleConfigs;