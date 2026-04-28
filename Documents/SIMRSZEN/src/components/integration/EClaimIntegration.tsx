import React, { useState } from 'react';

interface ClaimResult {
  id: string;
  noKlaim: string;
  status: string;
  response?: any;
  message?: string;
}

const EClaimIntegration: React.FC = () => {
  const [claimStatus, setClaimStatus] = useState<'idle' | 'creating' | 'submitting' | 'success' | 'error'>('idle');
  const [claimResult, setClaimResult] = useState<ClaimResult | null>(null);
  const [sepStatus, setSepStatus] = useState<'idle' | 'creating' | 'success' | 'error'>('idle');
  const [sepResult, setSepResult] = useState<any>(null);
  const [selectedVisit, setSelectedVisit] = useState<string>('');

  const handleCreateSEP = async () => {
    if (!selectedVisit) {
      alert('Silakan pilih kunjungan terlebih dahulu');
      return;
    }

    setSepStatus('creating');
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = {
        success: true,
        noKlaim: `SEP-${selectedVisit.substring(0, 8)}-${Date.now()}`,
        status: 'success',
        message: 'SEP berhasil dibuat',
        data: {
          noSep: `SEP-${selectedVisit.substring(0, 8)}-${Date.now()}`,
          tglSep: new Date().toISOString().split('T')[0],
          jnsPelayanan: '2',
          kelasRawat: '1',
          noMr: 'MR001',
          catatan: 'Klaim dari SIMRS ZEN',
          diagAwal: 'A00.1',
          poliTujuan: 'INT',
          dpjp: 'Dr. John Doe'
        }
      };
      
      setSepResult(result);
      setSepStatus('success');
    } catch (error) {
      setSepStatus('error');
      console.error('SEP creation error:', error);
    }
  };

  const handleSubmitClaim = async () => {
    if (!selectedVisit) {
      alert('Silakan pilih kunjungan terlebih dahulu');
      return;
    }

    setClaimStatus('submitting');
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result: ClaimResult = {
        id: `eclaim-${Date.now()}`,
        noKlaim: `KLAIM-${selectedVisit.substring(0, 8)}-${Date.now()}`,
        status: 'submitted',
        message: 'Klaim E-Claim berhasil diajukan'
      };
      
      setClaimResult(result);
      setClaimStatus('success');
    } catch (error) {
      setClaimStatus('error');
      console.error('Claim submission error:', error);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Integrasi E-Claim BPJS</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Pengajuan klaim elektronik ke BPJS Kesehatan
        </p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="mb-6">
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
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Buat SEP (Surat Eligibilitas Peserta)</h4>
            <button
              type="button"
              onClick={handleCreateSEP}
              disabled={sepStatus === 'creating' || !selectedVisit}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {sepStatus === 'creating' ? 'Membuat SEP...' : 'Buat SEP'}
            </button>
            
            {sepStatus === 'creating' && (
              <div className="mt-4 rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Membuat SEP</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>Sedang membuat Surat Eligibilitas Peserta...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {sepStatus === 'success' && sepResult && (
              <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Detail SEP</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">No. SEP</dt>
                      <dd className="mt-1 text-sm text-gray-900">{sepResult.data.noSep}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Tanggal SEP</dt>
                      <dd className="mt-1 text-sm text-gray-900">{sepResult.data.tglSep}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Jenis Pelayanan</dt>
                      <dd className="mt-1 text-sm text-gray-900">{sepResult.data.jnsPelayanan === '1' ? 'Rawat Inap' : 'Rawat Jalan'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Kelas Rawat</dt>
                      <dd className="mt-1 text-sm text-gray-900">Kelas {sepResult.data.kelasRawat}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Catatan</dt>
                      <dd className="mt-1 text-sm text-gray-900">{sepResult.data.catatan}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {sepStatus === 'error' && (
              <div className="mt-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Pembuatan SEP Gagal</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>Terjadi kesalahan saat membuat SEP. Silakan coba lagi.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Ajukan Klaim E-Claim</h4>
            <button
              type="button"
              onClick={handleSubmitClaim}
              disabled={claimStatus === 'submitting' || !selectedVisit}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {claimStatus === 'submitting' ? 'Mengirim Klaim...' : 'Ajukan Klaim'}
            </button>
            
            {claimStatus === 'submitting' && (
              <div className="mt-4 rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Pengajuan Klaim</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>Sedang mengajukan klaim ke server E-Claim BPJS...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {claimStatus === 'success' && claimResult && (
              <div className="mt-4 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Klaim Berhasil Diajukan</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Nomor Klaim: {claimResult.noKlaim}</p>
                      <p>Status: {claimResult.status}</p>
                      <p>Pesan: {claimResult.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {claimStatus === 'error' && (
              <div className="mt-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Pengajuan Klaim Gagal</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>Terjadi kesalahan saat mengajukan klaim E-Claim. Silakan coba lagi.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EClaimIntegration;