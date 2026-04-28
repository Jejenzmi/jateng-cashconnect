import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallbackPath = '/login'
}) => {
  const { isAuthenticated, hasPermission, hasRole } = useAuth();

  // Jika tidak terotentikasi, arahkan ke halaman login
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Cek apakah pengguna memiliki izin yang diperlukan
  const hasRequiredPermissions = requiredPermissions.length === 0 || 
    requiredPermissions.every(permission => hasPermission(permission));

  // Cek apakah pengguna memiliki peran yang diperlukan
  const hasRequiredRoles = requiredRoles.length === 0 || 
    requiredRoles.some(role => hasRole(role));

  // Jika tidak memiliki izin atau peran yang diperlukan, arahkan ke halaman tidak sah
  if (!hasRequiredPermissions || !hasRequiredRoles) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Jika semua syarat terpenuhi, tampilkan komponen anak
  return <>{children}</>;
};