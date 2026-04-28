import React, { useState } from 'react';

interface ClassificationResult {
  id: string;
  kodeKlasifikasi: string;
  namaKlasifikasi: string;
  tarif: number;
  coPayment: number;
  deductible: number;
  status: string;
}

const IdrgIntegration: React.FC = () => {
  const [classificationStatus, setClassificationStatus] = useState<'idle' | 'classifying' | 'success' | 'error'>('idle');
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null);
  const [claimStatus, setClaimStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [claimResult, setClaimResult] = useState<any>(null);
  const [selectedVisit, setSelectedVisit] = useState<string>('');

  const handleClassify = async () => {
    if (!selectedVisit) {
      alert('Silakan pilih kunjungan terlebih dahulu');
      return;
    }

    setClassificationStatus('classifying');
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result: ClassificationResult = {
        id: `idrg-${Date.now()}`,
        kodeKlasifikasi: `IDRG-${Math.floor(Math.random() * 1000) + 1}`,
        namaKlasifikasi: 'Klasifikasi Simulasi IDRG',
        tarif: 5250000,
        coPayment: 0,
        deductible: 0,
        status: 'success'
      };
      
      setClassificationResult(result);
      setClassificationStatus('success');
    } catch (error) {
      setClassificationStatus('error');
      console.error('Classification error:', error);
    }
  };

  const handleSubmitClaim = async () => {
    if (!classificationResult) {
      alert('Silakan lakukan klasifikasi terlebih dahulu');
      return;
    }

    setClaimStatus('submitting');
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = {
        success: true,
        claimNumber: `KLAIM-${selectedVisit.substring(0, 8)}-${Date.now()}`,
        classification: classificationResult.kodeKlasifikasi,
        status: 'submitted',
        message: 'Klaim IDRG berhasil diajukan'
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
        <h3 className="text-lg leading-6 font-medium text-gray-900">Integrasi IDRG (INA-DRG)</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Klasifikasi diagnosis dan penentuan biaya berdasarkan INA-DRG
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

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleClassify}
            disabled={classificationStatus === 'classifying' || !selectedVisit}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {classificationStatus === 'classifying' ? 'Mengklasifikasikan...' : 'Klasifikasikan IDRG'}
          </button>
          
          <button
            type="button"
            onClick={handleSubmitClaim}
            disabled={claimStatus === 'submitting' || !classificationResult}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {claimStatus === 'submitting' ? 'Mengirim Klaim...' : 'Ajukan Klaim'}
          </button>
        </div>

        {classificationStatus === 'classifying' && (
          <div className="mt-6 rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Proses Klasifikasi</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Sedang mengklasifikasikan data kunjungan ke dalam sistem IDRG...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {classificationStatus === 'success' && classificationResult && (
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Hasil Klasifikasi IDRG</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Kode Klasifikasi</dt>
                  <dd className="mt-1 text-sm text-gray-900">{classificationResult.kodeKlasifikasi}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Nama Klasifikasi</dt>
                  <dd className="mt-1 text-sm text-gray-900">{classificationResult.namaKlasifikasi}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Tarif</dt>
                  <dd className="mt-1 text-sm text-gray-900">Rp {classificationResult.tarif.toLocaleString()}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      classificationResult.status === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {classificationResult.status}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {claimStatus === 'submitting' && (
          <div className="mt-6 rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Pengajuan Klaim</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Sedang mengajukan klaim ke server IDRG...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {claimStatus === 'success' && claimResult && (
          <div className="mt-6 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Klaim Berhasil Diajukan</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Nomor Klaim: {claimResult.claimNumber}</p>
                  <p>Klasifikasi: {claimResult.classification}</p>
                  <p>Status: {claimResult.status}</p>
                  <p>Pesan: {claimResult.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {classificationStatus === 'error' && (
          <div className="mt-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Klasifikasi Gagal</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Terjadi kesalahan saat melakukan klasifikasi IDRG. Silakan coba lagi.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {claimStatus === 'error' && (
          <div className="mt-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Pengajuan Klaim Gagal</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Terjadi kesalahan saat mengajukan klaim IDRG. Silakan coba lagi.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdrgIntegration;