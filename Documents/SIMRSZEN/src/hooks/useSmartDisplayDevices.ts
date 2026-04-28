import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// Interfaces untuk data smart display devices
interface SmartDisplayDevice {
  id: string;
  device_name: string;
  device_token: string; // Token otentikasi perangkat
  config_id: string;
  last_connected?: string;
  is_online: boolean;
  location: string; // Lokasi perangkat
  created_at: string;
  updated_at: string;
}

interface SmartDisplayConfig {
  id: string;
  name: string; // Nama konfigurasi
  device_type: string; // queue_display, info_display, wayfinding
  department_id?: string; // Bisa null untuk konfigurasi global
  location: string; // Lokasi layar
  screen_layout: any; // Layout layar dalam bentuk JSON
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface DeviceConnection {
  id: string;
  device_id: string;
  connected_at: string;
  disconnected_at?: string;
  ip_address: string;
  user_agent: string;
  status: 'connected' | 'disconnected';
  created_at: string;
  updated_at: string;
}

export function useSmartDisplayDevices() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all smart display devices
  const { data: devices, isLoading: isLoadingDevices } = useQuery<SmartDisplayDevice[]>({
    queryKey: ["smart-display-devices"],
    queryFn: async () => {
      try {
        const result = await getApi<SmartDisplayDevice[]>`
          SELECT 
            sdd.id,
            sdd.device_name,
            sdd.device_token,
            sdd.config_id,
            sdd.last_connected,
            sdd.is_online,
            sdd.location,
            sdd.created_at,
            sdd.updated_at,
            sdc.name as config_name
          FROM smart_display_devices sdd
          LEFT JOIN smart_display_configs sdc ON sdd.config_id = sdc.id
          ORDER BY sdd.device_name
        `;
        return result;
      } catch (error) {
        console.error("Error fetching smart display devices:", error);
        throw error;
      }
    },
  });

  // Fetch all smart display configs
  const { data: configs, isLoading: isLoadingConfigs } = useQuery<SmartDisplayConfig[]>({
    queryKey: ["smart-display-configs"],
    queryFn: async () => {
      try {
        const result = await getApi<SmartDisplayConfig[]>`
          SELECT 
            id,
            name,
            device_type,
            department_id,
            location,
            screen_layout,
            is_active,
            created_at,
            updated_at
          FROM smart_display_configs
          ORDER BY name
        `;
        return result;
      } catch (error) {
        console.error("Error fetching smart display configs:", error);
        throw error;
      }
    },
  });

  // Fetch recent connections for devices
  const { data: recentConnections } = useQuery<DeviceConnection[]>({
    queryKey: ["recent-device-connections"],
    queryFn: async () => {
      try {
        const result = await getApi<DeviceConnection[]>`
          SELECT 
            dc.id,
            dc.device_id,
            dc.connected_at,
            dc.disconnected_at,
            dc.ip_address,
            dc.user_agent,
            dc.status,
            dc.created_at,
            dc.updated_at,
            sdd.device_name
          FROM device_connections dc
          LEFT JOIN smart_display_devices sdd ON dc.device_id = sdd.id
          WHERE dc.created_at >= NOW() - INTERVAL '24 hours'
          ORDER BY dc.created_at DESC
          LIMIT 100
        `;
        return result;
      } catch (error) {
        console.error("Error fetching recent device connections:", error);
        throw error;
      }
    },
  });

  // Register new smart display device
  const registerDevice = useMutation({
    mutationFn: async (deviceData: Omit<SmartDisplayDevice, 'id' | 'device_token' | 'last_connected' | 'created_at' | 'updated_at'>) => {
      // Generate a unique token for the device
      const deviceToken = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const result = await getApi<SmartDisplayDevice[]>`
        INSERT INTO smart_display_devices (
          device_name,
          device_token,
          config_id,
          location
        ) VALUES (
          ${deviceData.device_name},
          ${deviceToken},
          ${deviceData.config_id},
          ${deviceData.location}
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smart-display-devices"] });
      toast({
        title: "Perangkat Berhasil Terdaftar",
        description: "Perangkat smart display baru telah terdaftar di sistem.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Mendaftarkan Perangkat",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update device status (online/offline)
  const updateDeviceStatus = useMutation({
    mutationFn: async ({ deviceId, isOnline }: { deviceId: string; isOnline: boolean }) => {
      const result = await getApi<SmartDisplayDevice[]>`
        UPDATE smart_display_devices 
        SET 
          is_online = ${isOnline},
          last_connected = NOW(),
          updated_at = NOW()
        WHERE id = ${deviceId} 
        RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smart-display-devices"] });
      toast({
        title: "Status Perangkat Diperbarui",
        description: "Status koneksi perangkat telah diperbarui.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Memperbarui Status Perangkat",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create/update smart display configuration
  const saveConfig = useMutation({
    mutationFn: async (configData: Omit<SmartDisplayConfig, 'id' | 'created_at' | 'updated_at'>) => {
      // Check if config already exists (by name)
      const existingConfig = await getApi<SmartDisplayConfig[]>`
        SELECT id FROM smart_display_configs WHERE name = ${configData.name} LIMIT 1
      `;
      
      let result;
      if (existingConfig.length > 0) {
        // Update existing config
        result = await getApi<SmartDisplayConfig[]>`
          UPDATE smart_display_configs 
          SET 
            device_type = ${configData.device_type},
            department_id = ${configData.department_id},
            location = ${configData.location},
            screen_layout = ${JSON.stringify(configData.screen_layout)},
            is_active = ${configData.is_active},
            updated_at = NOW()
          WHERE id = ${existingConfig[0].id}
          RETURNING *
        `;
      } else {
        // Create new config
        result = await getApi<SmartDisplayConfig[]>`
          INSERT INTO smart_display_configs (
            name,
            device_type,
            department_id,
            location,
            screen_layout,
            is_active
          ) VALUES (
            ${configData.name},
            ${configData.device_type},
            ${configData.department_id},
            ${configData.location},
            ${JSON.stringify(configData.screen_layout)},
            ${configData.is_active}
          ) RETURNING *
        `;
      }
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smart-display-configs"] });
      toast({
        title: "Konfigurasi Disimpan",
        description: "Konfigurasi smart display telah disimpan.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menyimpan Konfigurasi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Record device connection
  const recordConnection = useMutation({
    mutationFn: async (connectionData: Omit<DeviceConnection, 'id' | 'created_at' | 'updated_at'>) => {
      const result = await getApi<DeviceConnection[]>`
        INSERT INTO device_connections (
          device_id,
          connected_at,
          ip_address,
          user_agent,
          status
        ) VALUES (
          ${connectionData.device_id},
          ${connectionData.connected_at},
          ${connectionData.ip_address},
          ${connectionData.user_agent},
          ${connectionData.status}
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recent-device-connections"] });
    },
    onError: (error: Error) => {
      console.error("Error recording device connection:", error);
    },
  });

  return {
    devices,
    configs,
    recentConnections,
    isLoadingDevices,
    isLoadingConfigs,
    registerDevice: registerDevice.mutate,
    updateDeviceStatus: updateDeviceStatus.mutate,
    saveConfig: saveConfig.mutate,
    recordConnection: recordConnection.mutate,
    isRegisteringDevice: registerDevice.isPending,
    isUpdatingDeviceStatus: updateDeviceStatus.isPending,
    isSavingConfig: saveConfig.isPending,
  };
}

export function useCreateSmartDisplayDevice() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (deviceData: Omit<SmartDisplayDevice, 'id' | 'device_token' | 'last_connected' | 'created_at' | 'updated_at'>) => {
      // Generate a unique token for the device
      const deviceToken = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const result = await getApi<SmartDisplayDevice[]>`
        INSERT INTO smart_display_devices (
          device_name,
          device_token,
          config_id,
          location
        ) VALUES (
          ${deviceData.device_name},
          ${deviceToken},
          ${deviceData.config_id},
          ${deviceData.location}
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smart-display-devices"] });
      toast({
        title: "Perangkat Berhasil Ditambahkan",
        description: "Perangkat smart display baru telah ditambahkan ke sistem.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menambahkan Perangkat",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createDevice: mutation.mutate,
    isPending: mutation.isPending
  };
}

export function useUpdateSmartDisplayDevice() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (deviceData: Partial<SmartDisplayDevice> & { id: string }) => {
      const result = await getApi<SmartDisplayDevice[]>`
        UPDATE smart_display_devices 
        SET 
          device_name = COALESCE(${deviceData.device_name}, device_name),
          config_id = COALESCE(${deviceData.config_id}, config_id),
          location = COALESCE(${deviceData.location}, location),
          updated_at = NOW()
        WHERE id = ${deviceData.id} 
        RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smart-display-devices"] });
      toast({
        title: "Perangkat Berhasil Diperbarui",
        description: "Data perangkat smart display telah diperbarui.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Memperbarui Perangkat",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    updateDevice: mutation.mutate,
    isPending: mutation.isPending
  };
}

export function useDeleteSmartDisplayDevice() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (deviceId: string) => {
      await deleteApi("/generic-api");
      return deviceId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smart-display-devices"] });
      toast({
        title: "Perangkat Berhasil Dihapus",
        description: "Perangkat smart display telah dihapus dari sistem.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menghapus Perangkat",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    deleteDevice: mutation.mutate,
    isPending: mutation.isPending
  };
}

// Fungsi untuk mendapatkan satu perangkat berdasarkan ID
export function useSmartDisplayDevice(deviceId?: string) {
  const { data: device, isLoading } = useQuery<SmartDisplayDevice>({
    queryKey: ["smart-display-device", deviceId],
    queryFn: async () => {
      if (!deviceId) {
        throw new Error("Device ID is required");
      }
      
      try {
        const result = await getApi<SmartDisplayDevice[]>`
          SELECT 
            sdd.id,
            sdd.device_name,
            sdd.device_token,
            sdd.config_id,
            sdd.last_connected,
            sdd.is_online,
            sdd.location,
            sdd.created_at,
            sdd.updated_at,
            sdc.name as config_name
          FROM smart_display_devices sdd
          LEFT JOIN smart_display_configs sdc ON sdd.config_id = sdc.id
          WHERE sdd.id = ${deviceId}
        `;
        
        if (result.length === 0) {
          throw new Error("Perangkat tidak ditemukan");
        }
        
        return result[0];
      } catch (error) {
        console.error("Error fetching smart display device:", error);
        throw error;
      }
    },
    enabled: !!deviceId
  });

  return { device, isLoading };
}
