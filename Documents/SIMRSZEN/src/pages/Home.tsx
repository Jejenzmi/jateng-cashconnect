import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupService } from '@/services/setupService';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isMounted = useRef(true);

    const checkSetupAndRedirect = async () => {
      // Membersihkan session yang mungkin tersimpan sebelum mengecek status setup
      localStorage.removeItem('auth-session');
      localStorage.removeItem('auth-user');
      
      try {
        const status = await setupService.checkSetupStatus();
        
        if (isMounted.current) {
          if (status.setupCompleted) {
            // Jika setup sudah selesai, arahkan ke login
            navigate('/login');
          } else {
            // Jika setup belum selesai, arahkan ke setup
            navigate('/setup');
          }
        }
      } catch (error) {
        if (isMounted.current) {
          console.error('Error checking setup status:', error);
          // Jika terjadi error, arahkan ke setup sebagai fallback
          navigate('/setup');
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    checkSetupAndRedirect();

    return () => {
      isMounted.current = false;
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg">Memeriksa status setup...</p>
        </div>
      </div>
    );
  }

  return null; // Komponen tidak merender layout lain untuk memastikan tidak ada tampilan selain loading saat redirect
};

export default Home;