/**
 * Konfigurasi Modul Psikologi Klinis
 * Mendefinisikan struktur dan fitur-fitur dalam modul Psikologi Klinis
 */

export interface ClinicalPsychologyModuleConfig {
  moduleName: string;
  moduleCode: string;
  features: ClinicalPsychologyFeature[];
  permissions: ClinicalPsychologyPermission[];
}

export interface ClinicalPsychologyFeature {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  enabled: boolean;
}

export interface ClinicalPsychologyPermission {
  id: string;
  name: string;
  description: string;
  actions: string[];
}

export const clinicalPsychologyModuleConfig: ClinicalPsychologyModuleConfig = {
  moduleName: 'Psikologi Klinis',
  moduleCode: 'PSYCHOLOGY',
  features: [
    {
      id: 'psychology-dashboard',
      name: 'Dashboard Psikologi',
      description: 'Tampilan utama modul psikologi klinis',
      route: '/clinical-psychology/dashboard',
      icon: 'LayoutDashboard',
      enabled: true
    },
    {
      id: 'psychology-patient-list',
      name: 'Daftar Pasien',
      description: 'Daftar pasien dalam penanganan psikologis',
      route: '/clinical-psychology/patient-list',
      icon: 'Users',
      enabled: true
    },
    {
      id: 'psychology-session-form',
      name: 'Formulir Sesi Terapi',
      description: 'Formulir untuk mencatat hasil sesi terapi',
      route: '/clinical-psychology/session-form',
      icon: 'FileEdit',
      enabled: true
    },
    {
      id: 'psychology-reports',
      name: 'Laporan Terapi',
      description: 'Laporan hasil terapi dan statistik layanan',
      route: '/clinical-psychology/reports',
      icon: 'FileBarChart',
      enabled: true
    }
  ],
  permissions: [
    {
      id: 'psychology_dashboard_access',
      name: 'Akses Dashboard',
      description: 'Akses ke fitur dashboard psikologi klinis',
      actions: ['view']
    },
    {
      id: 'psychology_patient_list_access',
      name: 'Akses Daftar Pasien',
      description: 'Akses ke fitur manajemen daftar pasien',
      actions: ['view', 'create', 'update', 'delete']
    },
    {
      id: 'psychology_session_form_access',
      name: 'Akses Formulir Terapi',
      description: 'Akses ke fitur formulir sesi terapi',
      actions: ['view', 'create', 'update']
    },
    {
      id: 'psychology_reports_access',
      name: 'Akses Laporan',
      description: 'Akses ke fitur laporan terapi',
      actions: ['view', 'create']
    }
  ]
};