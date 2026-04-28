import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface BPJSConfig {
  id: string;
  name: string;
  baseUrl: string;
  serviceName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BPJSConfigListProps {
  onEdit: (config: BPJSConfig) => void;
  onDelete: (id: string) => void;
}

const BPJSConfigList: React.FC<BPJSConfigListProps> = ({ onEdit, onDelete }) => {
  const [configs, setConfigs] = useState<BPJSConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch configs
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/bpjs/configs`);
        setConfigs(response.data.data);
      } catch (err) {
        setError('Gagal mengambil daftar konfigurasi BPJS');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfigs();
  }, []);

  const toggleConfigStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/bpjs/configs/${id}/toggle`,
        { isActive: !currentStatus }
      );

      // Update local state
      setConfigs(configs.map(config => 
        config.id === id ? { ...config, isActive: !currentStatus } : config
      ));

      alert(`Konfigurasi berhasil ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`);
    } catch (err) {
      console.error('Error toggling config status:', err);
      alert('Gagal mengubah status konfigurasi');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Layanan
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Base URL
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dibuat
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {configs.map((config) => (
            <tr key={config.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{config.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{config.serviceName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {config.baseUrl}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  config.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {config.isActive ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(config.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(config)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Sunting
                </button>
                <button
                  onClick={() => toggleConfigStatus(config.id, config.isActive)}
                  className={`mr-3 ${
                    config.isActive 
                      ? 'text-yellow-600 hover:text-yellow-900' 
                      : 'text-green-600 hover:text-green-900'
                  }`}
                >
                  {config.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
                <button
                  onClick={() => onDelete(config.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {configs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Belum ada konfigurasi BPJS. Silakan tambahkan konfigurasi baru.
        </div>
      )}
    </div>
  );
};

export default BPJSConfigList;