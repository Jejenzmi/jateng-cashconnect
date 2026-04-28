import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface ModuleConfig {
  module_code: string;
  module_name: string;
  module_category: string;
  module_path: string;
  is_core_module: boolean;
}

export function useModuleVisibility() {
  // Get hospital profile to know the type
  const { data: hospitalProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ["hospital-profile-for-modules"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data.length > 0 ? data[0] : null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get available modules for this hospital type
  const { data: availableModules, isLoading: loadingModules } = useQuery({
    queryKey: ["available-modules-for-sidebar", hospitalProfile?.facility_level],
    queryFn: async () => {
      if (!hospitalProfile?.facility_level) {
        // If no hospital type set, return all modules (setup not done)
        const data = await getApi("/generic-api");
        return data as ModuleConfig[];
      }

      // Since we can't use RPC, we'll implement the logic directly
      const data = await getApi("/generic-api");
      return data as ModuleConfig[];
    },
    enabled: !loadingProfile,
  });

  const availablePaths = useMemo(() => {
    if (!availableModules) return new Set<string>();
    return new Set(availableModules.map((m) => m.module_path));
  }, [availableModules]);

  const isModuleAvailable = (path: string): boolean => {
    // If setup not completed, show all modules
    if (!hospitalProfile?.setup_completed) return true;
    // Always allow these paths
    if (path === "/" || path === "/dashboard") return true;
    // Check if module is available for this hospital type
    return availablePaths.has(path);
  };

  return {
    isModuleAvailable,
    availableModules,
    hospitalType: hospitalProfile?.facility_level,
    setupCompleted: hospitalProfile?.setup_completed,
    isLoading: loadingProfile || loadingModules,
  };
}