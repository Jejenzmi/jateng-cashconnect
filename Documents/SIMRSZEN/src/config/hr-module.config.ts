/**
 * Konfigurasi Modul HR & Remunerasi
 * Berisi konfigurasi fitur-fitur untuk manajemen karyawan, absensi, dan penggajian
 */

import { ModuleConfig } from './modules.config';

export const hrModuleConfig: ModuleConfig = {
  moduleName: 'HR & Remunerasi',
  moduleCode: 'HR_REMUNERASI',
  features: [
    {
      id: 'employee-management',
      name: 'Manajemen Karyawan',
      description: 'Manajemen data karyawan, posisi, departemen',
      route: '/hr/employees',
      icon: 'Users',
      enabled: true
    },
    {
      id: 'attendance-tracking',
      name: 'Absensi Karyawan',
      description: 'Pencatatan dan pelacakan kehadiran karyawan',
      route: '/hr/attendance',
      icon: 'CalendarCheck',
      enabled: true
    },
    {
      id: 'shift-management',
      name: 'Manajemen Shift',
      description: 'Pengaturan dan penjadwalan shift kerja',
      route: '/hr/shifts',
      icon: 'Clock',
      enabled: true
    },
    {
      id: 'schedule-roster',
      name: 'Jadwal & Roster',
      description: 'Penjadwalan shift dan roster karyawan',
      route: '/hr/schedule',
      icon: 'Calendar',
      enabled: true
    },
    {
      id: 'payroll-processing',
      name: 'Penggajian',
      description: 'Perhitungan dan pemrosesan gaji karyawan',
      route: '/hr/payroll',
      icon: 'CreditCard',
      enabled: true
    },
    {
      id: 'performance-evaluation',
      name: 'Evaluasi Kinerja',
      description: 'Evaluasi dan manajemen kinerja karyawan',
      route: '/hr/performance',
      icon: 'TrendingUp',
      enabled: true
    }
  ],
  permissions: [
    {
      id: 'employee_management_access',
      name: 'Akses Manajemen Karyawan',
      description: 'Akses ke fitur manajemen data karyawan',
      actions: ['view', 'create', 'update', 'delete']
    },
    {
      id: 'attendance_tracking_access',
      name: 'Akses Absensi',
      description: 'Akses ke fitur pelacakan kehadiran',
      actions: ['view', 'create', 'update']
    },
    {
      id: 'shift_management_access',
      name: 'Akses Manajemen Shift',
      description: 'Akses ke fitur pengaturan shift',
      actions: ['view', 'create', 'update', 'delete']
    },
    {
      id: 'schedule_management_access',
      name: 'Akses Jadwal & Roster',
      description: 'Akses ke fitur penjadwalan shift',
      actions: ['view', 'create', 'update', 'delete']
    },
    {
      id: 'payroll_processing_access',
      name: 'Akses Penggajian',
      description: 'Akses ke fitur pemrosesan gaji',
      actions: ['view', 'create', 'update']
    }
  ]
};