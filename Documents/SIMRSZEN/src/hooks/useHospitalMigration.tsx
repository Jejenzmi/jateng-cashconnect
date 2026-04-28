import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

export type HospitalType = 'A' | 'B' | 'C' | 'D' | 'FKTP';

export interface ModuleInfo {
  code: string;
  name: string;
  category: string;
}

export interface MigrationPreview {
  current_type: string;
  new_type: string;
  current_modules: ModuleInfo[];
  new_modules: ModuleInfo[];
  modules_added: ModuleInfo[];
  modules_removed: ModuleInfo[];
  error?: string;
}

export interface MigrationResult {
  success: boolean;
  from_type: string;
  to_type: string;
  modules_added: string[];
  modules_removed: string[];
}

export interface MigrationLog {
  id: string;
  from_type: string;
  to_type: string;
  modules_added: string[];
  modules_removed: string[];
  migrated_by: string;
  migration_notes: string | null;
  created_at: string;
}

export function usePreviewMigration(newType: HospitalType | null) {
  return useQuery({
    queryKey: ["migration-preview", newType],
    queryFn: async () => {
      if (!newType) return null;
      
      // In PostgreSQL, we'll call a stored procedure to preview the migration
      const result = await getApi.unsafe(
        `SELECT * FROM preview_hospital_type_migration($1)`,
        [newType]
      );
      
      return result as unknown as MigrationPreview;
    },
    enabled: !!newType,
  });
}

export function useMigrateHospitalType() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ newType, notes }: { newType: HospitalType; notes?: string }) => {
      // Execute the stored procedure to migrate hospital type
      const result = await getApi.unsafe(
        `CALL migrate_hospital_type($1, $2)`,
        [newType, notes || null]
      );
      
      return result as unknown as MigrationResult;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["hospital-profile"] });
      queryClient.invalidateQueries({ queryKey: ["module-configurations"] });
      queryClient.invalidateQueries({ queryKey: ["available-modules"] });
      queryClient.invalidateQueries({ queryKey: ["migration-logs"] });
      
      toast({
        title: "Migrasi Berhasil!",
        description: `Tipe RS berhasil diubah dari ${data.from_type} ke ${data.to_type}. Halaman akan dimuat ulang...`,
      });
      
      // Auto refresh halaman setelah 1.5 detik untuk memperbarui seluruh state aplikasi
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Migrasi",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useMigrationLogs() {
  return useQuery({
    queryKey: ["migration-logs"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data as MigrationLog[];
    },
  });
}