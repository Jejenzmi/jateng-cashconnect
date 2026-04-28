import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { setupService } from '@/services/setupService';

interface ClearSessionProviderProps {
  children: React.ReactNode;
}

const ClearSessionProvider: React.FC<ClearSessionProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Hanya membersihkan session jika bukan di halaman setup
    if (location.pathname !== '/setup') {
      // Hapus session yang mungkin tersimpan
      localStorage.removeItem('auth-session');
      localStorage.removeItem('auth-user');
      localStorage.removeItem('faskesProfile');
      localStorage.removeItem('userPermissions');
    }
  }, [location.pathname]);

  return <>{children}</>;
};

export default ClearSessionProvider;