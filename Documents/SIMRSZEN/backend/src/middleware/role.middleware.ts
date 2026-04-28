import { Request, Response, NextFunction } from 'express';

export const ROLES = {
  ADMIN: 'admin',
  DOKTER: 'dokter',
  PERAWAT: 'perawat',
  APOTEKER: 'apoteker',
  HR: 'hr',
  FINANCE: 'finance',
  PROCUREMENT: 'procurement',
  DEPARTMENT_HEAD: 'department_head'
} as const;

type RoleValue = (typeof ROLES)[keyof typeof ROLES] | string;

export const requireRole = (allowedRoles: ReadonlyArray<RoleValue>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req as any).user?.role ?? (req as any).userRole ?? req.body?.userRole ?? req.query?.userRole;

    if (!role) {
      return res.status(401).json({
        success: false,
        message: 'User role not found'
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient role'
      });
    }

    next();
  };
};
