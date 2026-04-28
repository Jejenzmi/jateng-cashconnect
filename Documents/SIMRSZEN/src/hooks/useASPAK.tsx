import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// Medical Equipment
export function useMedicalEquipment(filters?: {
  status?: string;
  category?: string;
  departmentId?: string;
}) {
  return useQuery({
    queryKey: ["medical-equipment", filters],
    queryFn: async () => {
      // Membangun query dasar
      let sql = getApi("/generic-api");
      
      // Menambahkan filter jika ada
      if (filters?.status) {
        sql = getApi("/generic-api");
      }
      if (filters?.category) {
        sql = getApi("/generic-api");
      }
      if (filters?.departmentId) {
        sql = getApi("/generic-api");
      }
      
      sql = getApi("/generic-api");
      
      const data = await sql;
      return data;
    },
  });
}

// Equipment needing calibration
export function useEquipmentNeedingCalibration() {
  return useQuery({
    queryKey: ["equipment-needing-calibration"],
    queryFn: async () => {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const data = await getApi("/generic-api");
      
      return data;
    },
  });
}

// Equipment needing maintenance
export function useEquipmentNeedingMaintenance() {
  return useQuery({
    queryKey: ["equipment-needing-maintenance"],
    queryFn: async () => {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const data = await getApi("/generic-api");
      
      return data;
    },
  });
}

// Equipment Calibrations
export function useEquipmentCalibrations(equipmentId?: string) {
  return useQuery({
    queryKey: ["equipment-calibrations", equipmentId],
    queryFn: async () => {
      let sql = getApi("/generic-api");
      
      if (equipmentId) {
        sql = getApi("/generic-api");
      }
      
      const data = await sql;
      return data;
    },
  });
}

// Equipment Maintenance
export function useEquipmentMaintenance(equipmentId?: string) {
  return useQuery({
    queryKey: ["equipment-maintenance", equipmentId],
    queryFn: async () => {
      let sql = getApi("/generic-api");
      
      if (equipmentId) {
        sql = getApi("/generic-api");
      }
      
      const data = await sql;
      return data;
    },
  });
}

// Equipment Categories
export function useEquipmentCategories() {
  return useQuery({
    queryKey: ["equipment-categories"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

// ASPAK Sync Logs
export function useASPAKSyncLogs() {
  return useQuery({
    queryKey: ["aspak-sync-logs"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

// Create Equipment
export function useCreateEquipment() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (equipment: {
      equipment_code: string;
      equipment_name: string;
      brand?: string;
      model?: string;
      serial_number?: string;
      category?: string;
      risk_class?: string;
      department_id?: string;
      location?: string;
      purchase_date?: string;
      purchase_price?: number;
      calibration_required?: boolean;
      calibration_interval_months?: number;
      maintenance_interval_months?: number;
    }) => {
      const result = await postApi("/generic-api", {});
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-equipment"] });
      toast({
        title: "Berhasil",
        description: "Alat kesehatan berhasil ditambahkan",
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

// Update Equipment
export function useUpdateEquipment() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: unknown }) => {
      // Membentuk dinamis bagian SET dari query SQL
      const updateFields = Object.keys(updates);
      if (updateFields.length === 0) {
        throw new Error("Tidak ada field yang di-update");
      }

      let setClause = "";
      const values: any[] = [];
      updateFields.forEach((field, idx) => {
        if (idx > 0) setClause += ", ";
        setClause += `"${field}" = $${idx + 1}`;
        values.push(updates[field]);
      });

      const result = await getApi.unsafe(
        `UPDATE medical_equipment SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`,
        [...values, id]
      );
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-equipment"] });
      toast({
        title: "Berhasil",
        description: "Data alat kesehatan berhasil diperbarui",
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

// Equipment Statistics
export function useEquipmentStats() {
  return useQuery({
    queryKey: ["equipment-stats"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      
      const typedData = data as Array<{status: string, category: string, risk_class: string}>;
      
      const stats = {
        total: typedData.length,
        operational: typedData.filter((e: any) => e.status === "operational").length,
        maintenance: typedData.filter((e: any) => e.status === "maintenance").length,
        broken: typedData.filter((e: any) => e.status === "broken").length,
        disposed: typedData.filter((e: any) => e.status === "disposed").length,
        byCategory: {} as Record<string, number>,
        byRiskClass: {} as Record<string, number>,
      };
      
      typedData.forEach(e => {
        if (e.category) {
          stats.byCategory[e.category] = (stats.byCategory[e.category] || 0) + 1;
        }
        if (e.risk_class) {
          stats.byRiskClass[e.risk_class] = (stats.byRiskClass[e.risk_class] || 0) + 1;
        }
      });
      
      return stats;
    },
  });
}