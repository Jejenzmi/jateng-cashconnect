import React from 'react';

const SatusehatPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Integrasi SATU SEHAT</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Fitur Belum Tersedia</h3>
          <p className="mt-1 text-sm text-gray-500">
            Modul integrasi SATU SEHAT belum diimplementasikan. Silakan hubungi administrator untuk informasi lebih lanjut.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Implementasi Diperlukan</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Untuk menyelesaikan integrasi SATU SEHAT, tim pengembang perlu:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Membuat servis integrasi SATU SEHAT sesuai spesifikasi Kementerian Kesehatan</li>
                    <li>Menyesuaikan data pasien dan pelayanan kesehatan dengan format FHIR R4</li>
                    <li>Menangani otentikasi dan otorisasi dengan server SATU SEHAT</li>
                    <li>Menerapkan mekanisme sinkronisasi data secara real-time atau periodik</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatusehatPage;