import React, { useState } from 'react';
import BPJSConfigForm from '../settings/BPJSConfigForm';
import BPJSConfigList from '../settings/BPJSConfigList';
import BPJSLogViewer from '../logs/BPJSLogViewer';
import BPJSQueueManager from '../queue/BPJSQueueManager';
import BPJSCacheManager from '../cache/BPJSCacheManager';
import PatientManager from '../patient/PatientManager';
import VisitManager from '../visit/VisitManager';
import SatuSehatIntegration from './SatuSehatIntegration';
import IdrgIntegration from './IdrgIntegration';
import EClaimIntegration from './EClaimIntegration';
import { useNavigate } from 'react-router-dom';

const BPJSIntegrationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('config');
  const navigate = useNavigate();

  const handleConfigSubmit = (data: any) => {
    console.log('Config submitted:', data);
    // Handle config submission
  };

  const handleConfigEdit = (config: any) => {
    console.log('Config to edit:', config);
    // Handle config edit
  };

  const handleConfigDelete = (id: string) => {
    console.log('Config to delete:', id);
    // Handle config deletion
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Integrasi BPJS</h1>
      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { id: 'config', name: 'Konfigurasi' },
            { id: 'patients', name: 'Manajemen Pasien' },
            { id: 'visits', name: 'Kunjungan Pasien' },
            { id: 'logs', name: 'Log Aktivitas' },
            { id: 'cache', name: 'Manajemen Cache' },
            { id: 'queue', name: 'Antrian Proses' },
            { id: 'satusehat', name: 'SATU SEHAT' },
            { id: 'idrg', name: 'IDRG (INA-DRG)' },
            { id: 'eclaim', name: 'E-Claim' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'config' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Konfigurasi BPJS</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Tambah atau ubah konfigurasi untuk layanan BPJS
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <BPJSConfigForm onSubmit={handleConfigSubmit} />
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
                    onEdit={handleConfigEdit} 
                    onDelete={handleConfigDelete} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <PatientManager />
        )}

        {activeTab === 'visits' && (
          <VisitManager />
        )}

        {activeTab === 'logs' && (
          <BPJSLogViewer />
        )}

        {activeTab === 'cache' && (
          <BPJSCacheManager />
        )}

        {activeTab === 'queue' && (
          <BPJSQueueManager />
        )}

        {activeTab === 'satusehat' && (
          <SatuSehatIntegration />
        )}

        {activeTab === 'idrg' && (
          <IdrgIntegration />
        )}

        {activeTab === 'eclaim' && (
          <EClaimIntegration />
        )}
      </div>
    </div>
  );
};

export default BPJSIntegrationDashboard;