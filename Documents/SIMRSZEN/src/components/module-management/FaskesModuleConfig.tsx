import React, { useState, useEffect } from 'react';

interface FaskesType {
  id: string;
  name: string;
  description: string;
  level: string;
  category: string;
  isActive: boolean;
}

interface Module {
  id: string;
  moduleCode: string;
  moduleName: string;
  description: string;
  isActive: boolean;
}

interface FaskesModuleConfig {
  id: string;
  faskesTypeId: string;
  moduleId: string;
  isEnabled: boolean;
  bpjsConfig: any;
}

const FaskesModuleConfig: React.FC = () => {
  const [faskesTypes, setFaskesTypes] = useState<FaskesType[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [configs, setConfigs] = useState<FaskesModuleConfig[]>([]);
  const [newConfig, setNewConfig] = useState({
    faskesTypeId: '',
    moduleId: '',
    isEnabled: true
  });
  
  // Fetch data from API
  useEffect(() => {
    // Fetch faskes types
    fetch('/api/modules/faskes-types')
      .then(res => res.json())
      .then(data => setFaskesTypes(data.data))
      .catch(err => console.error('Error fetching faskes types:', err));

    // Fetch modules
    fetch('/api/modules/modules')
      .then(res => res.json())
      .then(data => setModules(data.data))
      .catch(err => console.error('Error fetching modules:', err));

    // Fetch configs
    fetch('/api/modules/faskes-module-configs')
      .then(res => res.json())
      .then(data => setConfigs(data.data))
      .catch(err => console.error('Error fetching configs:', err));
  }, []);

  const handleAddConfig = (e: React.FormEvent) => {
    e.preventDefault();
    
    fetch('/api/modules/faskes-module-configs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        faskesTypeId: newConfig.faskesTypeId,
        moduleId: newConfig.moduleId,
        isEnabled: newConfig.isEnabled
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setConfigs([...configs, data.data]);
        setNewConfig({
          faskesTypeId: '',
          moduleId: '',
          isEnabled: true
        });
        alert('Configuration added successfully');
      } else {
        alert(data.message || 'Failed to add configuration');
      }
    })
    .catch(err => {
      console.error('Error adding configuration:', err);
      alert('Error adding configuration');
    });
  };

  const toggleConfig = (id: string, isEnabled: boolean) => {
    const config = configs.find(c => c.id === id);
    if (!config) return;
    
    fetch(`/api/modules/faskes-module-configs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isEnabled: !isEnabled
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setConfigs(configs.map(c => 
          c.id === id ? { ...c, isEnabled: !isEnabled } : c
        ));
      } else {
        alert(data.message || 'Failed to update configuration');
      }
    })
    .catch(err => {
      console.error('Error updating configuration:', err);
      alert('Error updating configuration');
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Konfigurasi Modul Berdasarkan Tipe Faskes</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tambah Konfigurasi Baru</h2>
          <form onSubmit={handleAddConfig}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Tipe Faskes</label>
              <select
                value={newConfig.faskesTypeId}
                onChange={(e) => setNewConfig({...newConfig, faskesTypeId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Pilih Tipe Faskes</option>
                {faskesTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Modul</label>
              <select
                value={newConfig.moduleId}
                onChange={(e) => setNewConfig({...newConfig, moduleId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Pilih Modul</option>
                {modules.filter(m => m.isActive).map(mod => (
                  <option key={mod.id} value={mod.id}>{mod.moduleName}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newConfig.isEnabled}
                  onChange={(e) => setNewConfig({...newConfig, isEnabled: e.target.checked})}
                  className="rounded text-blue-600"
                />
                <span className="ml-2 text-gray-700">Aktifkan Modul</span>
              </label>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Tambah Konfigurasi
            </button>
          </form>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Daftar Konfigurasi</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe Faskes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modul</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {configs.map((config) => {
                  const faskesType = faskesTypes.find(ft => ft.id === config.faskesTypeId);
                  const module = modules.find(m => m.id === config.moduleId);
                  
                  return (
                    <tr key={config.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{faskesType?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{module?.moduleName || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          config.isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {config.isEnabled ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleConfig(config.id, config.isEnabled)}
                          className={`px-3 py-1 rounded text-sm ${
                            config.isEnabled 
                              ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {config.isEnabled ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Daftar Tipe Faskes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {faskesTypes.map((type) => (
                <tr key={type.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{type.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{type.level}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{type.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{type.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      type.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {type.isActive ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FaskesModuleConfig;