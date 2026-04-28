/**
 * Konfigurasi Modul Pelayanan Rohani
 * Mendefinisikan struktur dan fitur-fitur dalam modul Pelayanan Rohani
 */

export interface SpiritualCareModuleConfig {
  moduleName: string;
  moduleCode: string;
  features: SpiritualCareFeature[];
  permissions: SpiritualCarePermission[];
}

export interface SpiritualCareFeature {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  enabled: boolean;
}

export interface SpiritualCarePermission {
  id: string;
  name: string;
  description: string;
  actions: string[];
}

export const spiritualCareModuleConfig: SpiritualCareModuleConfig = {
  moduleName: 'Pelayanan Rohani',
  moduleCode: 'SPIRITUAL_CARE',
  features: [
    {
      id: 'spiritual-care-dashboard',
      name: 'Dashboard Pelayanan Rohani',
      description: 'Tampilan utama modul pelayanan rohani',
      route: '/spiritual-care/dashboard',
      icon: 'LayoutDashboard',
      enabled: true
    },
    {
      id: 'spiritual-service-requests',
      name: 'Permohonan Pelayanan',
      description: 'Daftar permintaan pelayanan rohani dari pasien',
      route: '/spiritual-care/service-requests',
      icon: 'HandHeart',
      enabled: true
    },
    {
      id: 'spiritual-clergy-list',
      name: 'Daftar Petugas Rohani',
      description: 'Daftar petugas pelayanan rohani beserta ketersediaannya',
      route: '/spiritual-care/clergy-list',
      icon: 'Users',
      enabled: true
    },
    {
      id: 'spiritual-care-reports',
      name: 'Laporan Pelayanan',
      description: 'Laporan hasil layanan dan statistik kegiatan',
      route: '/spiritual-care/reports',
      icon: 'FileBarChart',
      enabled: true
    }
  ],
  permissions: [
    {
      id: 'spiritual_care_dashboard_access',
      name: 'Akses Dashboard',
      description: 'Akses ke fitur dashboard pelayanan rohani',
      actions: ['view']
    },
    {
      id: 'spiritual_service_requests_access',
      name: 'Akses Permohonan Pelayanan',
      description: 'Akses ke fitur manajemen permintaan pelayanan rohani',
      actions: ['view', 'create', 'update', 'delete']
    },
    {
      id: 'spiritual_clergy_list_access',
      name: 'Akses Daftar Petugas',
      description: 'Akses ke fitur manajemen petugas pelayanan rohani',
      actions: ['view', 'create', 'update', 'delete']
    },
    {
      id: 'spiritual_care_reports_access',
      name: 'Akses Laporan',
      description: 'Akses ke fitur laporan pelayanan rohani',
      actions: ['view', 'create']
    }
  ]
};