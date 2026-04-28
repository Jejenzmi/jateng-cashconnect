import React, { useState } from 'react';
import axios from 'axios';
import BPJSConfigForm from '../components/settings/BPJSConfigForm';
import BPJSConfigList from '../components/settings/BPJSConfigList';

const BPJSConfigPage: React.FC = () => {
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      let response;
      if (editingConfig) {
        // Update existing config
        response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/bpjs/configs/${editingConfig.name}`, 
          data
        );
      } else {
        // Create new config
        response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/bpjs/configs`, data);
      }

      setMessage({ type: 'success', text: response.data.message });
      setEditingConfig(null);
      // Refresh the list by reloading the page or calling a refetch function
      window.location.reload();
    } catch (error: any) {
      console.error('Error saving BPJS config:', error);
      const errorMsg = error.response?.data?.message || 'Gagal menyimpan konfigurasi BPJS';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (config: any) => {
    setEditingConfig(config);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus konfigurasi ini?')) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/bpjs/configs/${id}`);
      setMessage({ type: 'success', text: 'Konfigurasi BPJS berhasil dihapus' });
      // Refresh the list by reloading the page
      window.location.reload();
    } catch (error: any) {
      console.error('Error deleting BPJS config:', error);
      const errorMsg = error.response?.data?.message || 'Gagal menghapus konfigurasi BPJS';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const handleCancelEdit = () => {
    setEditingConfig(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pengaturan Integrasi BPJS</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800' 
            : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:items-center md:justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {editingConfig ? 'Edit Konfigurasi' : 'Tambah Konfigurasi Baru'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {editingConfig 
                    ? 'Ubah detail konfigurasi BPJS yang dipilih' 
                    : 'Tambahkan konfigurasi baru untuk layanan BPJS'}
                </p>
              </div>
              {editingConfig && (
                <button
                  onClick={handleCancelEdit}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Batal
                </button>
              )}
            </div>
          </div>

          <div className="mt-6">
            <BPJSConfigForm 
              onSubmit={handleSubmit}
              initialData={editingConfig || undefined}
              isLoading={isSubmitting}
            />
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Daftar Konfigurasi</h2>
            <p className="mt-1 text-sm text-gray-500">
              Konfigurasi yang tersedia untuk layanan BPJS
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <BPJSConfigList 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BPJSConfigPage;