/**
 * Konfigurasi Modul Maintenance dan Engineering
 * Mendefinisikan struktur dan fitur-fitur dalam modul Maintenance dan Engineering
 */

export interface MaintenanceModuleConfig {
  moduleName: string;
  moduleCode: string;
  features: MaintenanceFeature[];
  permissions: MaintenancePermission[];
}

export interface MaintenanceFeature {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  enabled: boolean;
}

export interface MaintenancePermission {
  id: string;
  name: string;
  description: string;
  actions: string[];
}

export const maintenanceModuleConfig: MaintenanceModuleConfig = {
  moduleName: 'Maintenance dan Engineering',
  moduleCode: 'MAINTENANCE',
  features: [
    {
      id: 'preventive-maintenance',
      name: 'Jadwal Pemeliharaan Preventif',
      description: 'Jadwal pemeliharaan preventif peralatan rumah sakit',
      route: '/maintenance/preventive-maintenance',
      icon: 'Wrench',
      enabled: true
    },
    {
      id: 'repair-tickets',
      name: 'Tiket Perbaikan',
      description: 'Manajemen tiket perbaikan peralatan',
      route: '/maintenance/repair-tickets',
      icon: 'Ticket',
      enabled: true
    },
    {
      id: 'spare-parts',
      name: 'Manajemen Spare Part',
      description: 'Manajemen spare part peralatan',
      route: '/maintenance/spare-parts',
      icon: 'Package',
      enabled: true
    },
    {
      id: 'equipment-performance',
      name: 'Monitoring Kinerja Peralatan',
      description: 'Monitoring kinerja peralatan rumah sakit',
      route: '/maintenance/equipment-performance',
      icon: 'Activity',
      enabled: true
    }
  ],
  permissions: [
    {
      id: 'preventive_maintenance_access',
      name: 'Akses Jadwal Pemeliharaan',
      description: 'Akses ke fitur jadwal pemeliharaan preventif',
      actions: ['view', 'create', 'update', 'delete']
    },
    {
      id: 'repair_tickets_access',
      name: 'Akses Tiket Perbaikan',
      description: 'Akses ke fitur manajemen tiket perbaikan',
      actions: ['view', 'create', 'update']
    },
    {
      id: 'spare_parts_access',
      name: 'Akses Spare Part',
      description: 'Akses ke fitur manajemen spare part',
      actions: ['view', 'create', 'update', 'delete']
    }
  ]
};