/**
 * Konfigurasi Modul CSSD (Central Sterile Supply Department)
 * Mendefinisikan struktur dan fitur-fitur dalam modul CSSD
 */

export interface CSSDModuleConfig {
  moduleName: string;
  moduleCode: string;
  features: CSSDFeature[];
  permissions: CSSDPermission[];
}

export interface CSSDFeature {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  enabled: boolean;
}

export interface CSSDPermission {
  id: string;
  name: string;
  description: string;
  actions: string[];
}

export const cssdModuleConfig: CSSDModuleConfig = {
  moduleName: 'CSSD (Central Sterile Supply Department)',
  moduleCode: 'CSSD',
  features: [
    {
      id: 'instrument-tracking',
      name: 'Pelacakan Alat',
      description: 'Pelacakan alat yang akan disterilkan',
      route: '/cssd/instrument-tracking',
      icon: 'Scalpel',
      enabled: true
    },
    {
      id: 'sterilization-process',
      name: 'Proses Sterilisasi',
      description: 'Monitoring proses sterilisasi',
      route: '/cssd/sterilization-process',
      icon: 'FlaskConical',
      enabled: true
    },
    {
      id: 'sterile-inventory',
      name: 'Persediaan Alat Steril',
      description: 'Manajemen persediaan alat steril',
      route: '/cssd/sterile-inventory',
      icon: 'Package',
      enabled: true
    },
    {
      id: 'batch-records',
      name: 'Catatan Batch Sterilisasi',
      description: 'Catatan batch sterilisasi',
      route: '/cssd/batch-records',
      icon: 'FileText',
      enabled: true
    }
  ],
  permissions: [
    {
      id: 'instrument_tracking_access',
      name: 'Akses Pelacakan Alat',
      description: 'Akses ke fitur pelacakan alat',
      actions: ['view', 'create', 'update', 'delete']
    },
    {
      id: 'sterilization_process_access',
      name: 'Akses Proses Sterilisasi',
      description: 'Akses ke fitur monitoring proses sterilisasi',
      actions: ['view', 'create', 'update']
    },
    {
      id: 'sterile_inventory_access',
      name: 'Akses Persediaan Steril',
      description: 'Akses ke fitur manajemen persediaan alat steril',
      actions: ['view', 'create', 'update', 'delete']
    }
  ]
};