import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, loading, faskesProfileExists } = useAuth();
  const location = useLocation();

  // Jika sedang di halaman setup, biarkan akses tanpa proteksi dan tanpa MainLayout
  if (location.pathname === '/setup') {
    return <>{children}</>;
  }

  // Jika masih loading, tampilkan loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
      </div>
    );
  }

  // Jika user tidak login, arahkan ke login
  if (!user || !session) {
    return <Navigate to="/login" replace />;
  }

  // Jika user login tapi belum setup, arahkan ke setup
  if (faskesProfileExists === false) {
    return <Navigate to="/setup" replace />;
  }

  // Jika user login dan sudah setup, tampilkan child komponen
  return <>{children}</>;
};