import React from 'react';
import { Helmet } from 'react-helmet-async';
import SatuSehatSettings from '@/components/integration/SatuSehatSettings';

const SatuSehatSetting: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Pengaturan Integrasi Satu Sehat | SIMRS ZEN</title>
        <meta name="description" content="Halaman pengaturan integrasi dengan platform Satu Sehat milik Kementerian Kesehatan RI" />
      </Helmet>
      
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan Integrasi Satu Sehat</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola konfigurasi koneksi dan sinkronisasi data dengan platform Satu Sehat
          </p>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <SatuSehatSettings />
        </div>
      </main>
    </div>
  );
};

export default SatuSehatSetting;