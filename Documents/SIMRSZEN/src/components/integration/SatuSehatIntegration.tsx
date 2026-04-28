import React, { useState } from 'react';

interface SyncResult {
  id: string;
  resourceId: string;
  resourceType: string;
  localId: string;
  localType: string;
  lastSynced: Date;
  syncStatus: string;
  errorMessage?: string;
}

const SatuSehatIntegration: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedVisit, setSelectedVisit] = useState<string>('');

  const handlePatientSync = async () => {
    if (!selectedPatient) {
      alert('Silakan pilih pasien terlebih dahulu');
      return;
    }

    setSyncStatus('syncing');
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result: SyncResult = {
        id: `ss-${Date.now()}`,
        resourceId: `fhir-${Math.random().toString(36).substring(2, 9)}`,
        resourceType: 'Patient',
        localId: selectedPatient,
        localType: 'Patient',
        lastSynced: new Date(),
        syncStatus: 'success'
      };
      
      setSyncResult(result);
      setSyncStatus('success');
    } catch (error) {
      setSyncStatus('error');
      console.error('Sync error:', error);
    }
  };

  const handleVisitSync = async () => {
    if (!selectedVisit) {
      alert('Silakan pilih kunjungan terlebih dahulu');
      return;
    }

    setSyncStatus('syncing');
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result: SyncResult = {
        id: `ss-${Date.now()}`,
        resourceId: `fhir-${Math.random().toString(36).substring(2, 9)}`,
        resourceType: 'Encounter',
        localId: selectedVisit,
        localType: 'Visit',
        lastSynced: new Date(),
        syncStatus: 'success'
      };
      
      setSyncResult(result);
      setSyncStatus('success');
    } catch (error) {
      setSyncStatus('error');
      console.error('Sync error:', error);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Integrasi SATU SEHAT</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Sinkronisasi data pasien dan kunjungan ke sistem SATU SEHAT
        </p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="patient-select" className="block text-sm font-medium text-gray-700">
              Pilih Pasien
            </label>
            <select
              id="patient-select"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Pilih pasien...</option>
              <option value="patient-1">Andi Prasetyo (P001)</option>
              <option value="patient-2">Siti Nurhaliza (P002)</option>
              <option value="patient-3">Budi Santoso (P003)</option>
            </select>
            <button
              type="button"
              onClick={handlePatientSync}
              disabled={syncStatus === 'syncing' || !selectedPatient}
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {syncStatus === 'syncing' ? 'Mengirim...' : 'Kirim ke SATU SEHAT'}
            </button>
          </div>
          
          <div>
            <label htmlFor="visit-select" className="block text-sm font-medium text-gray-700">
              Pilih Kunjungan
            </label>
            <select
              id="visit-select"
              value={selectedVisit}
              onChange={(e) => setSelectedVisit(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Pilih kunjungan...</option>
              <option value="visit-1">Kunjungan Rawat Jalan (V001)</option>
              <option value="visit-2">Kunjungan Rawat Inap (V002)</option>
              <option value="visit-3">Kunjungan IGD (V003)</option>
            </select>
            <button
              type="button"
              onClick={handleVisitSync}
              disabled={syncStatus === 'syncing' || !selectedVisit}
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {syncStatus === 'syncing' ? 'Mengirim...' : 'Kirim ke SATU SEHAT'}
            </button>
          </div>
        </div>

        {syncStatus === 'syncing' && (
          <div className="mt-6 rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Proses Sinkronisasi</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Data sedang dikirim ke server SATU SEHAT...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {syncStatus === 'success' && syncResult && (
          <div className="mt-6 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Sinkronisasi Berhasil</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>ID Resource: {syncResult.resourceId}</p>
                  <p>Tipe: {syncResult.resourceType}</p>
                  <p>Status: {syncResult.syncStatus}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {syncStatus === 'error' && (
          <div className="mt-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Sinkronisasi Gagal</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Terjadi kesalahan saat mengirim data ke SATU SEHAT. Silakan coba lagi.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SatuSehatIntegration;