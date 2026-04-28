import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ClearSession = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Hapus semua session dan data autentikasi
    localStorage.removeItem('auth-session');
    localStorage.removeItem('auth-user');
    localStorage.removeItem('faskesProfile');
    localStorage.removeItem('userPermissions');
    
    console.log('Session telah dibersihkan');
    
    // Redirect ke home untuk memulai flow dari awal
    setTimeout(() => {
      navigate('/');
    }, 1000);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">Membersihkan Session...</h2>
        <p className="text-gray-600 mt-2">Harap tunggu sebentar.</p>
      </div>
    </div>
  );
};

export default ClearSession;