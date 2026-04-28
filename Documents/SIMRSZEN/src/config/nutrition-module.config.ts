/**
 * Konfigurasi Modul Gizi Klinik
 * Mendefinisikan struktur dan fitur-fitur dalam modul Gizi Klinik
 */

export interface NutritionModuleConfig {
  moduleName: string;
  moduleCode: string;
  features: NutritionFeature[];
  permissions: NutritionPermission[];
}

export interface NutritionFeature {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  enabled: boolean;
}

export interface NutritionPermission {
  id: string;
  name: string;
  description: string;
  actions: string[];
}

export const nutritionModuleConfig: NutritionModuleConfig = {
  moduleName: 'Gizi Klinik',
  moduleCode: 'NUTRITION',
  features: [
    {
      id: 'menu-planning',
      name: 'Perencanaan Menu',
      description: 'Perencanaan menu sesuai kondisi medis pasien',
      route: '/nutrition/menu-planning',
      icon: 'Utensils',
      enabled: true
    },
    {
      id: 'patient-nutrition-monitoring',
      name: 'Monitoring Intake Nutrisi',
      description: 'Monitoring intake nutrisi pasien',
      route: '/nutrition/patient-nutrition-monitoring',
      icon: 'Activity',
      enabled: true
    },
    {
      id: 'diet-reconciliation',
      name: 'Rekonsiliasi Diet',
      description: 'Rekonsiliasi diet dengan dokter',
      route: '/nutrition/diet-reconciliation',
      icon: 'FileText',
      enabled: true
    }
  ],
  permissions: [
    {
      id: 'menu_planning_access',
      name: 'Akses Perencanaan Menu',
      description: 'Akses ke fitur perencanaan menu',
      actions: ['view', 'create', 'update', 'delete']
    },
    {
      id: 'nutrition_monitoring_access',
      name: 'Akses Monitoring Nutrisi',
      description: 'Akses ke fitur monitoring intake nutrisi pasien',
      actions: ['view', 'create', 'update']
    },
    {
      id: 'diet_reconciliation_access',
      name: 'Akses Rekonsiliasi Diet',
      description: 'Akses ke fitur rekonsiliasi diet',
      actions: ['view', 'update']
    }
  ]
};