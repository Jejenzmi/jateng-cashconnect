import React from 'react';

const SpiritualCareDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Pelayanan Rohani</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Permohonan Pelayanan</h2>
          <p className="text-gray-600">Daftar permintaan pelayanan rohani</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Petugas Rohani</h2>
          <p className="text-gray-600">Daftar petugas pelayanan rohani</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Laporan Kegiatan</h2>
          <p className="text-gray-600">Laporan pelayanan rohani harian</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Deskripsi Modul</h2>
        <p>Sistem manajemen pelayanan rohani untuk memberikan dukungan spiritual kepada pasien dan keluarga selama proses perawatan di rumah sakit.</p>
      </div>
    </div>
  );
};

export default SpiritualCareDashboard;