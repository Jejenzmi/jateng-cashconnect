/**
 * Preload utility untuk meningkatkan performa navigasi antar menu
 */

// Fungsi untuk preload komponen saat hover atau sebelum navigasi
export const preloadComponent = async (componentPromise: Promise<any>) => {
  try {
    // Load komponen sebelum navigasi sebenarnya terjadi
    await componentPromise;
    console.log('Preload successful');
  } catch (error) {
    console.error('Preload failed:', error);
  }
};

// Predefined preload functions untuk komponen-komponen utama
export const preloadPages = {
  dashboard: () => import('@/pages/Dashboard'),
  patient: () => import('@/pages/Pasien'),
  queue: () => import('@/pages/Antrian'),
  medicalRecord: () => import('@/pages/RekamMedis'),
  pharmacy: () => import('@/pages/Farmasi'),
  laboratory: () => import('@/pages/Laboratorium'),
  radiology: () => import('@/pages/Radiologi'),
  billing: () => import('@/pages/Billing'),
  settings: () => import('@/pages/Pengaturan'),
  kiosk: () => import('@/pages/Kioska'),
  smartDisplay: () => import('@/pages/SmartDisplay'),
  auth: () => import('@/pages/Auth'),
};

// Hook untuk preload komponen saat mouse enter ke link
export const usePreloadOnHover = (pageName: keyof typeof preloadPages) => {
  const preload = () => {
    const pageLoader = preloadPages[pageName];
    if (pageLoader) {
      // Preload dengan delay kecil agar tidak terlalu banyak request
      setTimeout(() => {
        preloadComponent(pageLoader());
      }, 200);
    }
  };

  return { preload };
};