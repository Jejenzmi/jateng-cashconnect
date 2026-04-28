import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { allModulesConfig, ModuleConfig } from '../../config/modules.config';
import { 
  getModulesForFaskesType, 
  getBpjsConfigForFaskesType, 
  FASKES_TYPES,
  FaskesType
} from '../../config/faskes-modules.config';

interface ModuleVisibilityContextType {
  visibleModules: ModuleConfig[];
  availableFaskesTypes: FaskesType[];
  currentFaskesType: string | null;
  setCurrentFaskesType: (typeId: string) => void;
  isModuleVisible: (moduleCode: string) => boolean;
  bpjsConfig: ReturnType<typeof getBpjsConfigForFaskesType>;
}

const ModuleVisibilityContext = createContext<ModuleVisibilityContextType | undefined>(undefined);

export const ModuleVisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentFaskesType, setCurrentFaskesType] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load faskes type from localStorage or set default
  useEffect(() => {
    const savedFaskesType = localStorage.getItem('faskesType');
    if (savedFaskesType) {
      setCurrentFaskesType(savedFaskesType);
    }
  }, []);

  // Update localStorage when faskes type changes
  useEffect(() => {
    if (currentFaskesType) {
      localStorage.setItem('faskesType', currentFaskesType);
    }
  }, [currentFaskesType]);

  const isModuleVisible = (moduleCode: string): boolean => {
    if (!currentFaskesType) return false;
    
    const allowedModules = getModulesForFaskesType(currentFaskesType);
    return allowedModules.includes(moduleCode);
  };

  const visibleModules = allModulesConfig.filter(module => isModuleVisible(module.moduleCode));

  const bpjsConfig = currentFaskesType ? getBpjsConfigForFaskesType(currentFaskesType) : null;

  return (
    <ModuleVisibilityContext.Provider
      value={{
        visibleModules,
        availableFaskesTypes: FASKES_TYPES,
        currentFaskesType,
        setCurrentFaskesType: (typeId: string) => setCurrentFaskesType(typeId),
        isModuleVisible,
        bpjsConfig
      }}
    >
      {children}
    </ModuleVisibilityContext.Provider>
  );
};

export const useModuleVisibility = (): ModuleVisibilityContextType => {
  const context = useContext(ModuleVisibilityContext);
  if (context === undefined) {
    throw new Error('useModuleVisibility must be used within a ModuleVisibilityProvider');
  }
  return context;
};

// Komponen untuk menampilkan modul-modul yang terlihat berdasarkan tipe faskes
export const VisibleModulesList: React.FC = () => {
  const { visibleModules } = useModuleVisibility();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {visibleModules.map((module) => (
        <div 
          key={module.moduleCode} 
          className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <h3 className="font-bold text-lg text-gray-800 mb-2">{module.moduleName}</h3>
          <p className="text-sm text-gray-600 mb-3">
            {module.features.length} fitur tersedia
          </p>
          <div className="flex flex-wrap gap-1">
            {module.features.slice(0, 3).map(feature => (
              <span 
                key={feature.id} 
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {feature.name}
              </span>
            ))}
            {module.features.length > 3 && (
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                +{module.features.length - 3} lainnya
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Komponen untuk memilih tipe faskes
export const FaskesTypeSelector: React.FC = () => {
  const { 
    currentFaskesType, 
    setCurrentFaskesType, 
    availableFaskesTypes,
    bpjsConfig
  } = useModuleVisibility();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Konfigurasi Fasilitas Kesehatan</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Tipe Fasilitas Kesehatan
        </label>
        <select
          value={currentFaskesType || ''}
          onChange={(e) => setCurrentFaskesType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">-- Pilih Tipe Faskes --</option>
          {availableFaskesTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name} - {type.description}
            </option>
          ))}
        </select>
      </div>

      {currentFaskesType && bpjsConfig && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-2">Konfigurasi Integrasi BPJS:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${bpjsConfig.pcareEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>PCare: {bpjsConfig.pcareEnabled ? 'Aktif' : 'Tidak Aktif'}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${bpjsConfig.vclaimEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>VClaim: {bpjsConfig.vclaimEnabled ? 'Aktif' : 'Tidak Aktif'}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${bpjsConfig.icareEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>iCare: {bpjsConfig.icareEnabled ? 'Aktif' : 'Tidak Aktif'}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${bpjsConfig.antreanEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Antrean Online: {bpjsConfig.antreanEnabled ? 'Aktif' : 'Tidak Aktif'}</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <p>Catatan: PCare hanya tersedia untuk Klinik dan Rumah Sakit, VClaim hanya untuk Rumah Sakit.</p>
          </div>
        </div>
      )}

      {currentFaskesType && (
        <div className="mt-4 text-sm text-gray-600">
          <p>Modul aktif untuk <strong>{availableFaskesTypes.find(t => t.id === currentFaskesType)?.name}</strong>: {useModuleVisibility().visibleModules.length} modul
          </p>
        </div>
      )}
    </div>
  );
};