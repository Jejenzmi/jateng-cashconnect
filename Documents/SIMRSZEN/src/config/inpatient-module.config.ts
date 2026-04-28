/**
 * Konfigurasi Modul Rawat Inap
 * Mendefinisikan struktur dan fitur-fitur dalam modul Rawat Inap
 */

export interface InpatientModuleConfig {
  moduleName: string;
  moduleCode: string;
  features: InpatientFeature[];
  permissions: InpatientPermission[];
}

export interface InpatientFeature {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  enabled: boolean;
}

export interface InpatientPermission {
  id: string;
  name: string;
  description: string;
  actions: string[];
}

export const inpatientModuleConfig: InpatientModuleConfig = {
  moduleName: 'Rawat Inap',
  moduleCode: 'INPATIENT',
  features: [
    {
      id: 'bed-management',
      name: 'Manajemen Kamar dan Tempat Tidur',
      description: 'Pengelolaan kapasitas tempat tidur dan status ketersediaan kamar',
      route: '/inpatient/bed-management',
      icon: 'Bed',
      enabled: true
    },
    {
      id: 'patient-monitoring',
      name: 'Monitoring Pasien Rawat Inap',
      description: 'Dashboard real-time untuk kondisi pasien dan monitoring vital signs',
      route: '/inpatient/patient-monitoring',
      icon: 'HeartPulse',
      enabled: true
    },
    {
      id: 'icu-management',
      name: 'ICU/CCU Management',
      description: 'Manajemen pasien dan peralatan di unit perawatan intensif',
      route: '/inpatient/icu-management',
      icon: 'Monitor',
      enabled: true
    },
    {
      id: 'schedule-management',
      name: 'Penjadwalan Perawatan',
      description: 'Jadwal pemeriksaan, obat, dan perawatan pasien',
      route: '/inpatient/schedule-management',
      icon: 'Calendar',
      enabled: true
    }
  ],
  permissions: [
    {
      id: 'bed_management_access',
      name: 'Akses Manajemen Kamar',
      description: 'Akses ke fitur manajemen kamar dan tempat tidur',
      actions: ['view', 'create', 'update', 'delete']
    },
    {
      id: 'patient_monitoring_access',
      name: 'Akses Monitoring Pasien',
      description: 'Akses ke fitur monitoring pasien rawat inap',
      actions: ['view', 'update']
    },
    {
      id: 'icu_management_access',
      name: 'Akses ICU/CCU',
      description: 'Akses ke fitur manajemen unit perawatan intensif',
      actions: ['view', 'create', 'update']
    }
  ]
};