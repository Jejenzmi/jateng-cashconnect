import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useState, useEffect } from 'react';
interface ModuleConfig {
  id: string;
  module_name: string;
  is_enabled: boolean;
  config_data: any;
  created_at: string;
  updated_at: string;
}

const useModuleConfigurationHook = () => {
  const [modules, setModules] = useState<ModuleConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = async () => {
    try {
      const result = await getApi<ModuleConfig[]>`
        SELECT 
          id,
          module_name,
          is_enabled,
          config_data,
          created_at,
          updated_at
        FROM module_configurations
        ORDER BY module_name
      `;
      
      setModules(result);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat konfigurasi modul');
      console.error('Error fetching module configurations:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateModuleStatus = async (moduleId: string, isEnabled: boolean) => {
    try {
      const result = await getApi<ModuleConfig[]>`
        UPDATE module_configurations
        SET is_enabled = ${isEnabled}, updated_at = NOW()
        WHERE id = ${moduleId}
        RETURNING 
          id,
          module_name,
          is_enabled,
          config_data,
          created_at,
          updated_at
      `;
      
      // Update local state
      setModules(modules.map(m => 
        m.id === moduleId ? result[0] : m
      ));
      
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui status modul');
      console.error('Error updating module status:', err);
      throw err;
    }
  };

  const updateModuleConfig = async (moduleId: string, configData: any) => {
    try {
      const result = await getApi<ModuleConfig[]>`
        UPDATE module_configurations
        SET config_data = ${JSON.stringify(configData)}, updated_at = NOW()
        WHERE id = ${moduleId}
        RETURNING 
          id,
          module_name,
          is_enabled,
          config_data,
          created_at,
          updated_at
      `;
      
      // Update local state
      setModules(modules.map(m => 
        m.id === moduleId ? result[0] : m
      ));
      
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui konfigurasi modul');
      console.error('Error updating module config:', err);
      throw err;
    }
  };

  const addModule = async (moduleName: string, isEnabled: boolean = true, configData: any = {}) => {
    try {
      const result = await getApi<ModuleConfig[]>`
        INSERT INTO module_configurations (
          module_name,
          is_enabled,
          config_data
        ) VALUES (
          ${moduleName},
          ${isEnabled},
          ${JSON.stringify(configData)}
        )
        RETURNING 
          id,
          module_name,
          is_enabled,
          config_data,
          created_at,
          updated_at
      `;
      
      setModules([...modules, result[0]]);
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal menambahkan modul');
      console.error('Error adding module:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const refreshModules = () => {
    setLoading(true);
    fetchModules();
  };

  return {
    modules,
    loading,
    error,
    updateModuleStatus,
    updateModuleConfig,
    addModule,
    refreshModules
  };
};

export const useModuleConfiguration = useModuleConfigurationHook;
export default useModuleConfigurationHook;