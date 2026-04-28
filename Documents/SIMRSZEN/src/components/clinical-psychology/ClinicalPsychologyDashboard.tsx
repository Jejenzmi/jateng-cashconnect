import React from 'react';

const ClinicalPsychologyDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Psikologi Klinis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Jadwal Terapi</h2>
          <p className="text-gray-600">Manajemen jadwal terapi psikologi</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Pasien Aktif</h2>
          <p className="text-gray-600">Daftar pasien dalam penanganan</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Laporan Terapi</h2>
          <p className="text-gray-600">Laporan hasil terapi psikologi</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Ringkasan Harian</h2>
        <p>Sistem manajemen layanan psikologi klinis untuk rumah sakit.</p>
      </div>
    </div>
  );
};

export default ClinicalPsychologyDashboard;