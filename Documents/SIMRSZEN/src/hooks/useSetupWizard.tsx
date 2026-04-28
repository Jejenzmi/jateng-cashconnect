import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

export type HospitalType = 'A' | 'B' | 'C' | 'D' | 'FKTP';

export interface HospitalProfileData {
  hospital_name: string;
  hospital_code: string;
  hospital_type: string;
  facility_level: HospitalType;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  accreditation_status?: string;
  bed_count_total?: number;
  is_teaching_hospital?: boolean;
  npwp?: string;
  director_name?: string;
  organization_id?: string;
}

export function useIsSetupCompleted() {
  return useQuery({
    queryKey: ["setup-completed"],
    queryFn: async () => {
      try {
        const token = (() => {
          try {
            const s = localStorage.getItem('auth-session');
            return s ? JSON.parse(s).token : null;
          } catch { return null; }
        })();

        if (!token) return false;

        // Try the faskes-profile check endpoint
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/faskes-profile/check-profile`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        if (response.ok) {
          const data = await response.json();
          return data.exists === true;
        }

        // If endpoint returns 404 or other error, assume setup is done
        // to prevent users from being stuck on setup page
        if (response.status === 404 || response.status === 500) {
          return true;
        }

        return false;
      } catch (error: any) {
        console.warn("Setup check failed, assuming setup completed:", error.message);
        // Network errors - assume setup done so user can proceed
        return true;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
}

export function useHospitalProfile() {
  return useQuery({
    queryKey: ["hospital-profile"],
    queryFn: async () => {
      const data = await getApi("/generic-api?table=hospital_profile");
      return data.length > 0 ? data[0] : null;
    },
    refetchOnWindowFocus: false,  // Disable refetch on window focus to prevent auto-refresh
  });
}

export function useModuleConfigurations(hospitalType?: HospitalType) {
  return useQuery({
    queryKey: ["module-configurations", hospitalType],
    queryFn: async () => {
      if (!hospitalType) {
        const data = await getApi("/generic-api?table=modules");
        return data;
      }

      // Execute the function to get available modules for hospital type
      const result = await getApi.unsafe(
        `SELECT * FROM get_available_modules($1)`,
        [hospitalType]
      );
      return result;
    },
    enabled: !!hospitalType,
    refetchOnWindowFocus: false,  // Disable refetch on window focus to prevent auto-refresh
  });
}

export function useCompleteSetup() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: HospitalProfileData) => {
      // Check if profile exists
      const existing = await getApi("/generic-api?table=hospital_profile");

      if (existing.length > 0) {
        // Update existing
        await putApi("/generic-api", {
          table: "hospital_profile",
          id: existing[0].id,
          data: profileData
        });
      } else {
        // Insert new
        await postApi("/generic-api", {
          table: "hospital_profile",
          data: profileData
        });
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setup-completed"] });
      queryClient.invalidateQueries({ queryKey: ["hospital-profile"] });
      queryClient.invalidateQueries({ queryKey: ["module-configurations"] });
      toast({
        title: "Setup Selesai!",
        description: "Konfigurasi rumah sakit berhasil disimpan.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useAvailableModulesForType(hospitalType: HospitalType) {
  return useQuery({
    queryKey: ["available-modules", hospitalType],
    queryFn: async () => {
      const result = await getApi.unsafe(
        `SELECT * FROM get_available_modules($1)`,
        [hospitalType]
      );
      
      return result as Array<{
        module_code: string;
        module_name: string;
        module_category: string;
        module_path: string;
        module_icon: string | null;
        display_order: number;
        is_core_module: boolean;
      }>;
    },
    enabled: !!hospitalType,
    refetchOnWindowFocus: false,  // Disable refetch on window focus to prevent auto-refresh
  });
}