import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useState, useEffect } from 'react';
interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string;
  category: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

const useSystemSettingsHook = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      const result = await getApi<SystemSetting[]>`
        SELECT 
          id,
          setting_key,
          setting_value,
          description,
          category,
          is_public,
          created_at,
          updated_at
        FROM system_settings
        ORDER BY category, setting_key
      `;
      
      setSettings(result);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat pengaturan sistem');
      console.error('Error fetching system settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key: string) => {
    const setting = settings.find(s => s.setting_key === key);
    return setting ? setting.setting_value : null;
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const result = await getApi<SystemSetting[]>`
        UPDATE system_settings
        SET 
          setting_value = ${typeof value === 'object' ? JSON.stringify(value) : String(value)},
          updated_at = NOW()
        WHERE setting_key = ${key}
        RETURNING 
          id,
          setting_key,
          setting_value,
          description,
          category,
          is_public,
          created_at,
          updated_at
      `;
      
      if (result.length > 0) {
        // Update local state
        setSettings(settings.map(s => 
          s.setting_key === key ? result[0] : s
        ));
        return result[0];
      } else {
        // If setting doesn't exist, create it
        return await createSetting(key, value);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui pengaturan');
      console.error('Error updating system setting:', err);
      throw err;
    }
  };

  const createSetting = async (key: string, value: any, description: string = '', category: string = 'general', isPublic: boolean = false) => {
    try {
      const result = await getApi<SystemSetting[]>`
        INSERT INTO system_settings (
          setting_key,
          setting_value,
          description,
          category,
          is_public
        ) VALUES (
          ${key},
          ${typeof value === 'object' ? JSON.stringify(value) : String(value)},
          ${description},
          ${category},
          ${isPublic}
        )
        RETURNING 
          id,
          setting_key,
          setting_value,
          description,
          category,
          is_public,
          created_at,
          updated_at
      `;
      
      setSettings([...settings, result[0]]);
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal membuat pengaturan');
      console.error('Error creating system setting:', err);
      throw err;
    }
  };

  const getSettingByCategory = (category: string) => {
    return settings.filter(s => s.category === category);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = () => {
    setLoading(true);
    fetchSettings();
  };

  return {
    settings,
    loading,
    error,
    getSetting,
    updateSetting,
    createSetting,
    getSettingByCategory,
    refreshSettings
  };
};

export const useSystemSettings = useSystemSettingsHook;
export default useSystemSettingsHook;