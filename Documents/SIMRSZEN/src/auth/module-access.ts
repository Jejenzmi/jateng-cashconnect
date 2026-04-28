// Definisi peran dan izin berdasarkan modul SIMRS ZEN
export interface ModulePermission {
  moduleId: string;
  moduleName: string;
  permissions: string[];
  roles: string[];
}

// Daftar izin per modul
export const MODULE_PERMISSIONS: Record<string, ModulePermission> = {
  INPATIENT: {
    moduleId: 'INPATIENT',
    moduleName: 'Rawat Inap',
    permissions: [
      'inpatient.view',
      'inpatient.create',
      'inpatient.update',
      'inpatient.delete',
      'bed_management.access',
      'patient_monitoring.access',
      'icu_management.access'
    ],
    roles: ['admin', 'dokter', 'perawat_inap', 'resepsionis']
  },
  PHARMACY: {
    moduleId: 'PHARMACY',
    moduleName: 'Farmasi',
    permissions: [
      'pharmacy.view',
      'pharmacy.create',
      'pharmacy.update',
      'pharmacy.delete',
      'prescription_management.access',
      'inventory_management.access',
      'expired_medicines.access',
      'drug_reconciliation.access'
    ],
    roles: ['admin', 'apoteker', 'farmasi_staff']
  },
  RADIOLOGY: {
    moduleId: 'RADIOLOGY',
    moduleName: 'Radiologi',
    permissions: [
      'radiology.view',
      'radiology.create',
      'radiology.update',
      'radiology.delete',
      'request_management.access',
      'equipment_management.access',
      'pacs_integration.access'
    ],
    roles: ['admin', 'radiologist', 'radiology_tech', 'radiology_staff']
  },
  FINANCE: {
    moduleId: 'FINANCE',
    moduleName: 'Keuangan & Akunting',
    permissions: [
      'finance.view',
      'finance.create',
      'finance.update',
      'finance.delete',
      'financial_reports.access',
      'payroll_management.access',
      'cost_center.access',
      'transaction_log.access'
    ],
    roles: ['admin', 'keuangan', 'bendahara', 'akuntan']
  },
  LABORATORIUM: {
    moduleId: 'LABORATORIUM',
    moduleName: 'Laboratorium',
    permissions: [
      'laboratory.view',
      'laboratory.create',
      'laboratory.update',
      'laboratory.delete',
      'lab_result_input.access',
      'lab_request_management.access',
      'lab_inventory.access'
    ],
    roles: ['admin', 'laboran', 'teknisi_lab', 'dokter']
  },
  RAWAT_JALAN: {
    moduleId: 'RAWAT_JALAN',
    moduleName: 'Rawat Jalan',
    permissions: [
      'outpatient.view',
      'outpatient.create',
      'outpatient.update',
      'outpatient.delete',
      'appointment_management.access',
      'medical_record.access'
    ],
    roles: ['admin', 'dokter', 'perawat', 'resepsionis']
  }
};

// Fungsi untuk memeriksa akses ke modul
export const hasModuleAccess = (userPermissions: string[], moduleId: string): boolean => {
  const module = MODULE_PERMISSIONS[moduleId];
  if (!module) return false;

  // Periksa apakah pengguna memiliki salah satu dari izin yang diperlukan untuk modul ini
  return module.permissions.some(permission => userPermissions.includes(permission));
};

// Fungsi untuk mendapatkan izin berdasarkan peran
export const getPermissionsByRole = (role: string): string[] => {
  let permissions: string[] = [];
  
  Object.values(MODULE_PERMISSIONS).forEach(module => {
    if (module.roles.includes(role)) {
      permissions = [...permissions, ...module.permissions];
    }
  });
  
  return [...new Set(permissions)]; // hapus duplikat
};

// Fungsi untuk mendapatkan modul yang dapat diakses oleh pengguna
export const getAccessibleModules = (userPermissions: string[]): string[] => {
  const accessibleModules: string[] = [];
  
  Object.entries(MODULE_PERMISSIONS).forEach(([moduleId, module]) => {
    if (module.permissions.some(permission => userPermissions.includes(permission))) {
      accessibleModules.push(moduleId);
    }
  });
  
  return accessibleModules;
};