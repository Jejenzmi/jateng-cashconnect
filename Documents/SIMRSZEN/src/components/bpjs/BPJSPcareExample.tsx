import React, { useState, useEffect } from 'react';
import { useBPJSPcare } from '../../hooks/useBPJSPcare';

interface DiagnosaItem {
  kdDiag: string;
  nmDiag: string;
  nonSpesialis: boolean;
}

const BPJSPcareExample: React.FC = () => {
  const {
    bpjsClient,
    loading,
    error,
    initializeClient,
    getDiagnosa,
    getDokter,
    getKunjunganByNoKunjungan,
    getRiwayatKunjungan
  } = useBPJSPcare();

  const [config, setConfig] = useState({
    consumerId: '',
    consumerSecret: '',
    username: '',
    password: '',
    kdAplikasi: '095',
    userKey: '',
    baseUrl: 'https://pcare.bpjs-kesehatan.go.id'
  });

  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('init');

  // Initialize client with default values if available in localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('bpjsPcareConfig');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      setConfig(parsedConfig);
      initializeClient(parsedConfig);
    }
  }, []);

  const handleInitialize = () => {
    localStorage.setItem('bpjsPcareConfig', JSON.stringify(config));
    initializeClient(config);
    alert('BPJS Client Initialized!');
  };

  const handleGetDiagnosa = async () => {
    try {
      const result = await getDiagnosa('A001', '0', '10');
      setResults(result);
    } catch (err) {
      console.error('Error getting diagnosa:', err);
    }
  };

  const handleGetDokter = async () => {
    try {
      const result = await getDokter('0', '10');
      setResults(result);
    } catch (err) {
      console.error('Error getting doctors:', err);
    }
  };

  const handleGetKunjungan = async () => {
    try {
      // Using a placeholder visit number
      const result = await getKunjunganByNoKunjungan('00000123456');
      setResults(result);
    } catch (err) {
      console.error('Error getting visit:', err);
    }
  };

  const handleGetRiwayatKunjungan = async () => {
    try {
      // Using a placeholder card number
      const result = await getRiwayatKunjungan('0000012345678');
      setResults(result);
    } catch (err) {
      console.error('Error getting visit history:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Contoh Integrasi BPJS PCare</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'init' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('init')}
        >
          Konfigurasi
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'diagnosa' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('diagnosa')}
          disabled={!bpjsClient}
        >
          Diagnosa
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'dokter' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('dokter')}
          disabled={!bpjsClient}
        >
          Dokter
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'kunjungan' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('kunjungan')}
          disabled={!bpjsClient}
        >
          Kunjungan
        </button>
      </div>

      {activeTab === 'init' && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl mb-4">Konfigurasi BPJS PCare</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="consumerId">
              Consumer ID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="consumerId"
              type="text"
              value={config.consumerId}
              onChange={(e) => setConfig({...config, consumerId: e.target.value})}
              placeholder="Consumer ID"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="consumerSecret">
              Consumer Secret
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="consumerSecret"
              type="password"
              value={config.consumerSecret}
              onChange={(e) => setConfig({...config, consumerSecret: e.target.value})}
              placeholder="Consumer Secret"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              value={config.username}
              onChange={(e) => setConfig({...config, username: e.target.value})}
              placeholder="Username"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              value={config.password}
              onChange={(e) => setConfig({...config, password: e.target.value})}
              placeholder="Password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userKey">
              User Key
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="userKey"
              type="text"
              value={config.userKey}
              onChange={(e) => setConfig({...config, userKey: e.target.value})}
              placeholder="User Key"
            />
          </div>

          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleInitialize}
          >
            Inisialisasi Client
          </button>
        </div>
      )}

      {activeTab === 'diagnosa' && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl mb-4">Data Diagnosa</h2>
          
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mb-4"
            onClick={handleGetDiagnosa}
            disabled={loading}
          >
            {loading ? 'Memuat...' : 'Ambil Data Diagnosa'}
          </button>

          {results && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Hasil:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {activeTab === 'dokter' && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl mb-4">Data Dokter</h2>
          
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mb-4"
            onClick={handleGetDokter}
            disabled={loading}
          >
            {loading ? 'Memuat...' : 'Ambil Data Dokter'}
          </button>

          {results && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Hasil:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {activeTab === 'kunjungan' && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl mb-4">Data Kunjungan</h2>
          
          <div className="space-y-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2"
              onClick={handleGetKunjungan}
              disabled={loading}
            >
              {loading ? 'Memuat...' : 'Ambil Kunjungan by No'}
            </button>
            
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2"
              onClick={handleGetRiwayatKunjungan}
              disabled={loading}
            >
              {loading ? 'Memuat...' : 'Ambil Riwayat Kunjungan'}
            </button>
          </div>

          {results && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Hasil:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BPJSPcareExample;