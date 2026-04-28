import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.util';

// Definisi role dan permission
export enum Role {
  ADMIN = 'admin',
  DOKTER = 'dokter',
  PERAWAT = 'perawat',
  APOTEKER = 'apoteker',
  BENDAHARA = 'bendahara',
  RECEPTIONIST = 'receptionist',
  LAB_TECHNICIAN = 'lab_technician',
  RADIOLOGIST = 'radiologist',
  IT_STAFF = 'it_staff',
  HR = 'hr',
  PROCUREMENT = 'procurement',
  DEPARTMENT_HEAD = 'department_head'
}

export enum Permission {
  // Patient management
  READ_PATIENT = 'read:patient',
  CREATE_PATIENT = 'create:patient',
  UPDATE_PATIENT = 'update:patient',
  DELETE_PATIENT = 'delete:patient',
  
  // Visit management
  READ_VISIT = 'read:visit',
  CREATE_VISIT = 'create:visit',
  UPDATE_VISIT = 'update:visit',
  DELETE_VISIT = 'delete:visit',
  
  // Medical records
  READ_MEDICAL_RECORD = 'read:medical_record',
  CREATE_MEDICAL_RECORD = 'create:medical_record',
  UPDATE_MEDICAL_RECORD = 'update:medical_record',
  DELETE_MEDICAL_RECORD = 'delete:medical_record',
  
  // Laboratory
  READ_LAB_RESULT = 'read:lab_result',
  CREATE_LAB_RESULT = 'create:lab_result',
  UPDATE_LAB_RESULT = 'update:lab_result',
  DELETE_LAB_RESULT = 'delete:lab_result',
  
  // Radiology
  READ_RADIOLOGY_RESULT = 'read:radiology_result',
  CREATE_RADIOLOGY_RESULT = 'create:radiology_result',
  UPDATE_RADIOLOGY_RESULT = 'update:radiology_result',
  DELETE_RADIOLOGY_RESULT = 'delete:radiology_result',
  
  // Pharmacy
  READ_PRESCRIPTION = 'read:prescription',
  CREATE_PRESCRIPTION = 'create:prescription',
  UPDATE_PRESCRIPTION = 'update:prescription',
  DELETE_PRESCRIPTION = 'delete:prescription',
  
  // Financial
  READ_BILLING = 'read:billing',
  CREATE_BILLING = 'create:billing',
  UPDATE_BILLING = 'update:billing',
  DELETE_BILLING = 'delete:billing',
  
  // HR Management
  READ_EMPLOYEE = 'read:employee',
  CREATE_EMPLOYEE = 'create:employee',
  UPDATE_EMPLOYEE = 'update:employee',
  DELETE_EMPLOYEE = 'delete:employee',
  READ_ATTENDANCE = 'read:attendance',
  CREATE_ATTENDANCE = 'create:attendance',
  UPDATE_ATTENDANCE = 'update:attendance',
  READ_PAYROLL = 'read:payroll',
  CREATE_PAYROLL = 'create:payroll',
  UPDATE_PAYROLL = 'update:payroll',
  
  // Purchasing Management
  READ_SUPPLIER = 'read:supplier',
  CREATE_SUPPLIER = 'create:supplier',
  UPDATE_SUPPLIER = 'update:supplier',
  DELETE_SUPPLIER = 'delete:supplier',
  READ_PURCHASE_REQUEST = 'read:purchase_request',
  CREATE_PURCHASE_REQUEST = 'create:purchase_request',
  UPDATE_PURCHASE_REQUEST = 'update:purchase_request',
  READ_PURCHASE_ORDER = 'read:purchase_order',
  CREATE_PURCHASE_ORDER = 'create:purchase_order',
  UPDATE_PURCHASE_ORDER = 'update:purchase_order',
  
  // Accounting
  READ_ACCOUNTING = 'read:accounting',
  CREATE_ACCOUNTING = 'create:accounting',
  UPDATE_ACCOUNTING = 'update:accounting',
  DELETE_ACCOUNTING = 'delete:accounting',
  
  // Purchasing (additional permissions)
  READ_PURCHASING = 'read:purchasing',
  CREATE_PURCHASING = 'create:purchasing',
  UPDATE_PURCHASING = 'update:purchasing',
  DELETE_PURCHASING = 'delete:purchasing',
  
  // CSSD (Central Sterile Supply Department)
  READ_CSSD = 'read:cssd',
  CREATE_CSSD = 'create:cssd',
  UPDATE_CSSD = 'update:cssd',
  DELETE_CSSD = 'delete:cssd',
  
  // Nutrition
  READ_NUTRITION = 'read:nutrition',
  CREATE_NUTRITION = 'create:nutrition',
  UPDATE_NUTRITION = 'update:nutrition',
  DELETE_NUTRITION = 'delete:nutrition',
  
  // Rehabilitation
  READ_REHABILITATION = 'read:rehabilitation',
  CREATE_REHABILITATION = 'create:rehabilitation',
  UPDATE_REHABILITATION = 'update:rehabilitation',
  DELETE_REHABILITATION = 'delete:rehabilitation',
  
  // Spiritual Care
  READ_SPIRITUAL_CARE = 'read:spiritual_care',
  CREATE_SPIRITUAL_CARE = 'create:spiritual_care',
  UPDATE_SPIRITUAL_CARE = 'update:spiritual_care',
  DELETE_SPIRITUAL_CARE = 'delete:spiritual_care',
  
  // Psychology
  READ_PSYCHOLOGY = 'read:psychology',
  CREATE_PSYCHOLOGY = 'create:psychology',
  UPDATE_PSYCHOLOGY = 'update:psychology',
  DELETE_PSYCHOLOGY = 'delete:psychology',
  
  // HR additional permissions
  READ_HR = 'read:hr',
  CREATE_HR = 'create:hr',
  UPDATE_HR = 'update:hr',
  DELETE_HR = 'delete:hr',
  
  // Shift Management
  READ_SHIFT = 'read:shift',
  CREATE_SHIFT = 'create:shift',
  UPDATE_SHIFT = 'update:shift',
  DELETE_SHIFT = 'delete:shift',
  
  // BPJS integration
  READ_BPJS_CONFIG = 'read:bpjs_config',
  CREATE_BPJS_CONFIG = 'create:bpjs_config',
  UPDATE_BPJS_CONFIG = 'update:bpjs_config',
  DELETE_BPJS_CONFIG = 'delete:bpjs_config',
  
  // System admin
  READ_USER = 'read:user',
  CREATE_USER = 'create:user',
  UPDATE_USER = 'update:user',
  DELETE_USER = 'delete:user',
  READ_LOG = 'read:log'
}

// Mapping role ke permissions
const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission),
  [Role.DOKTER]: [
    Permission.READ_PATIENT,
    Permission.CREATE_VISIT,
    Permission.UPDATE_VISIT,
    Permission.READ_VISIT,
    Permission.CREATE_MEDICAL_RECORD,
    Permission.UPDATE_MEDICAL_RECORD,
    Permission.READ_MEDICAL_RECORD,
    Permission.READ_LAB_RESULT,
    Permission.READ_RADIOLOGY_RESULT
  ],
  [Role.PERAWAT]: [
    Permission.READ_PATIENT,
    Permission.READ_VISIT,
    Permission.UPDATE_VISIT,
    Permission.READ_MEDICAL_RECORD,
    Permission.CREATE_MEDICAL_RECORD
  ],
  [Role.APOTEKER]: [
    Permission.READ_PATIENT,
    Permission.READ_VISIT,
    Permission.READ_PRESCRIPTION,
    Permission.CREATE_PRESCRIPTION,
    Permission.UPDATE_PRESCRIPTION
  ],
  [Role.BENDAHARA]: [
    Permission.READ_PATIENT,
    Permission.READ_BILLING,
    Permission.CREATE_BILLING,
    Permission.UPDATE_BILLING,
    Permission.READ_PAYROLL,
    Permission.CREATE_PAYROLL,
    Permission.UPDATE_PAYROLL
  ],
  [Role.RECEPTIONIST]: [
    Permission.READ_PATIENT,
    Permission.CREATE_PATIENT,
    Permission.UPDATE_PATIENT,
    Permission.READ_VISIT,
    Permission.CREATE_VISIT
  ],
  [Role.LAB_TECHNICIAN]: [
    Permission.READ_PATIENT,
    Permission.READ_VISIT,
    Permission.READ_MEDICAL_RECORD,
    Permission.CREATE_LAB_RESULT,
    Permission.UPDATE_LAB_RESULT,
    Permission.READ_LAB_RESULT
  ],
  [Role.RADIOLOGIST]: [
    Permission.READ_PATIENT,
    Permission.READ_VISIT,
    Permission.READ_MEDICAL_RECORD,
    Permission.CREATE_RADIOLOGY_RESULT,
    Permission.UPDATE_RADIOLOGY_RESULT,
    Permission.READ_RADIOLOGY_RESULT
  ],
  [Role.IT_STAFF]: [
    Permission.READ_LOG,
    Permission.READ_BPJS_CONFIG,
    Permission.UPDATE_BPJS_CONFIG
  ],
  [Role.HR]: [
    Permission.READ_PATIENT,
    Permission.READ_EMPLOYEE,
    Permission.CREATE_EMPLOYEE,
    Permission.UPDATE_EMPLOYEE,
    Permission.DELETE_EMPLOYEE,
    Permission.READ_ATTENDANCE,
    Permission.CREATE_ATTENDANCE,
    Permission.UPDATE_ATTENDANCE,
    Permission.READ_PAYROLL,
    Permission.CREATE_PAYROLL,
    Permission.UPDATE_PAYROLL
  ],
  [Role.PROCUREMENT]: [
    Permission.READ_SUPPLIER,
    Permission.CREATE_SUPPLIER,
    Permission.UPDATE_SUPPLIER,
    Permission.DELETE_SUPPLIER,
    Permission.READ_PURCHASE_REQUEST,
    Permission.CREATE_PURCHASE_REQUEST,
    Permission.UPDATE_PURCHASE_REQUEST,
    Permission.READ_PURCHASE_ORDER,
    Permission.CREATE_PURCHASE_ORDER,
    Permission.UPDATE_PURCHASE_ORDER
  ],
  [Role.DEPARTMENT_HEAD]: [
    Permission.READ_PATIENT,
    Permission.READ_PURCHASE_REQUEST,
    Permission.CREATE_PURCHASE_REQUEST,
    Permission.UPDATE_PURCHASE_REQUEST
  ]
};

// Middleware untuk memvalidasi role
export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Ambil role dari user (diasumsikan sudah diset di middleware sebelumnya)
      const userRole = req.body.userRole || req.query.userRole || (req as any).user?.role;
      
      if (!userRole) {
        return res.status(401).json({
          success: false,
          message: 'User role not found in request'
        });
      }
      
      if (!allowedRoles.includes(userRole as Role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Insufficient role'
        });
      }
      
      next();
    } catch (error) {
      logger.error('Error in requireRole middleware:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

// Middleware untuk memvalidasi permission
export const requirePermission = (...requiredPermissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Ambil role dari user (diasumsikan sudah diset di middleware sebelumnya)
      const userRole = req.body.userRole || req.query.userRole || (req as any).user?.role;
      
      if (!userRole) {
        return res.status(401).json({
          success: false,
          message: 'User role not found in request'
        });
      }
      
      const userPermissions = rolePermissions[userRole as Role] || [];
      
      const hasAllPermissions = requiredPermissions.every(permission => 
        userPermissions.includes(permission)
      );
      
      if (!hasAllPermissions) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Insufficient permissions'
        });
      }
      
      next();
    } catch (error) {
      logger.error('Error in requirePermission middleware:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

// Fungsi untuk mengecek apakah user memiliki role tertentu
export const hasRole = (userRole: Role, targetRole: Role): boolean => {
  return userRole === Role.ADMIN || userRole === targetRole;
};

// Fungsi untuk mengecek apakah user memiliki permission tertentu
export const hasPermission = (userRole: Role, permission: Permission): boolean => {
  if (userRole === Role.ADMIN) {
    return true; // Admin memiliki semua permissions
  }
  
  const userPermissions = rolePermissions[userRole] || [];
  return userPermissions.includes(permission);
};