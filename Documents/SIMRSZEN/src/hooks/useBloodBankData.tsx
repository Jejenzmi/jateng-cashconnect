import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Types
export interface BloodInventory {
  id: string;
  bag_number: string;
  blood_type: string; // blood_type enum
  product_type: string; // blood_product_type enum
  volume: number | null;
  collection_date: string;
  expiry_date: string;
  source_blood_bank: string | null;
  status: string | null; // blood_status enum
  storage_location: string | null;
  hiv_status: string | null;
  hbsag_status: string | null;
  hcv_status: string | null;
  reserved_for_patient_id: string | null;
  notes: string | null;
}

export interface TransfusionRequest {
  id: string;
  request_number: string;
  patient_id: string;
  visit_id: string | null;
  requesting_doctor_id: string | null;
  department: string | null;
  request_date: string;
  urgency: string | null;
  product_type: string; // blood_product_type enum
  units_requested: number;
  indication: string;
  patient_blood_type: string | null; // blood_type enum
  patient_hemoglobin: number | null;
  status: string | null;
  notes: string | null;
  patients?: { full_name: string; medical_record_number: string } | null;
  doctors?: { full_name: string } | null;
}

export interface CrossmatchTest {
  id: string;
  request_id: string | null;
  patient_id: string;
  blood_bag_id: string;
  test_date: string;
  major_crossmatch: string | null; // crossmatch_result enum
  minor_crossmatch: string | null; // crossmatch_result enum
  is_compatible: boolean | null;
  valid_until: string | null;
  blood_inventory?: { bag_number: string; blood_type: string; product_type: string } | null;
  patients?: { full_name: string } | null;
}

export interface TransfusionReaction {
  id: string;
  transfusion_id: string;
  patient_id: string;
  reaction_type: string;
  severity: string; // transfusion_reaction_severity enum
  reaction_time: string;
  outcome: string | null;
}

// Blood Inventory
export function useBloodInventory(status?: string) {
  return useQuery({
    queryKey: ["blood-inventory", status],
    queryFn: async () => {
      let sql = getApi("/generic-api");

      if (status) {
        sql = getApi("/generic-api");
      }

      const data = await sql;
      return data as BloodInventory[];
    },
  });
}

// Available Blood
export function useAvailableBlood() {
  return useBloodInventory("available");
}

// Blood Inventory Statistics
export function useBloodInventoryStats() {
  return useQuery({
    queryKey: ["blood-inventory-stats"],
    queryFn: async () => {
      const inventory = await getApi("/generic-api");

      const today = new Date();
      const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

      // Count by blood type
      const byBloodType: Record<string, number> = {
        'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 
        'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0,
      };

      // Count by product type
      const byProductType: Record<string, number> = {
        'whole_blood': 0, 'prc': 0, 'ffp': 0, 
        'tc': 0, 'cryoprecipitate': 0, 'platelets': 0,
      };

      let expiringCount = 0;

      inventory?.forEach((item: any) => {
        if (item.blood_type in byBloodType) {
          byBloodType[item.blood_type as keyof typeof byBloodType] = (byBloodType[item.blood_type as keyof typeof byBloodType] || 0) + 1;
        }
        if (item.product_type in byProductType) {
          byProductType[item.product_type as keyof typeof byProductType] = (byProductType[item.product_type as keyof typeof byProductType] || 0) + 1;
        }
        
        if (new Date(item.expiry_date) <= threeDaysFromNow) {
          expiringCount++;
        }
      });

      // Get pending requests count
      const pendingRequestsResult = await getApi("/generic-api");
      const pendingRequests = parseInt(pendingRequestsResult[0].count);

      // Get today's transfusions
      const todayStr = today.toISOString().split('T')[0];
      const todayTransfusionsResult = await getApi("/generic-api");
      const todayTransfusions = parseInt(todayTransfusionsResult[0].count);

      return {
        totalAvailable: inventory?.length || 0,
        byBloodType,
        byProductType,
        expiringCount,
        pendingRequests: pendingRequests || 0,
        todayTransfusions: todayTransfusions || 0,
      };
    },
  });
}

// Transfusion Requests
export function useTransfusionRequests(status?: string) {
  return useQuery({
    queryKey: ["transfusion-requests", status],
    queryFn: async () => {
      let sql = getApi("/generic-api");

      if (status) {
        sql = getApi("/generic-api");
      }

      const data = await sql;
      // Format data to match the expected interface
      return data.map((row: any) => ({
        ...row,
        patients: row.patient_full_name ? { 
          full_name: row.patient_full_name, 
          medical_record_number: row.medical_record_number 
        } : null,
        doctors: row.doctor_full_name ? { 
          full_name: row.doctor_full_name 
        } : null
      })) as unknown as TransfusionRequest[];
    },
  });
}

// Crossmatch Tests
export function useCrossmatchTests(requestId?: string) {
  return useQuery({
    queryKey: ["crossmatch-tests", requestId],
    queryFn: async () => {
      let sql = getApi("/generic-api");

      if (requestId) {
        sql = getApi("/generic-api");
      }

      const data = await sql;
      // Format data to match the expected interface
      return data.map((row: any) => ({
        ...row,
        blood_inventory: row.bag_number ? {
          bag_number: row.bag_number,
          blood_type: row.blood_type,
          product_type: row.product_type
        } : null,
        patients: row.patient_full_name ? {
          full_name: row.patient_full_name
        } : null
      })) as unknown as CrossmatchTest[];
    },
  });
}

// Transfusion Reactions
export function useTransfusionReactions() {
  return useQuery({
    queryKey: ["transfusion-reactions"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      
      // Format data to match the expected interface
      return data.map((row: any) => ({
        ...row,
        patients: row.patient_full_name ? {
          full_name: row.patient_full_name
        } : null,
        blood_inventory: row.bag_number && row.blood_type ? {
          bag_number: row.bag_number,
          blood_type: row.blood_type
        } : null
      })) as unknown as TransfusionReaction[];
    },
  });
}

// Mutations
export function useUpdateBloodInventory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<BloodInventory>) => {
      // Membentuk dinamis bagian SET dari query SQL
      const updateFields = Object.keys(data);
      if (updateFields.length === 0) {
        throw new Error("Tidak ada field yang di-update");
      }

      let setClause = "";
      const values: any[] = [];
      updateFields.forEach((field, idx) => {
        if (idx > 0) setClause += ", ";
        setClause += `"${field}" = $${idx + 1}`;
        values.push((data as any)[field]);
      });

      await getApi.unsafe(
        `UPDATE blood_inventory SET ${setClause} WHERE id = $${values.length + 1}`,
        [...values, id]
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blood-inventory"] });
      queryClient.invalidateQueries({ queryKey: ["blood-inventory-stats"] });
      toast({ title: "Blood bag updated" });
    },
  });
}

export function useCreateTransfusionRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<TransfusionRequest, 'id'>) => {
      const {
        patient_id, visit_id, requesting_doctor_id, department, 
        request_date, urgency, product_type, units_requested, 
        indication, patient_blood_type, patient_hemoglobin, 
        status, notes, request_number
      } = data;
      
      await postApi("/generic-api", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfusion-requests"] });
      queryClient.invalidateQueries({ queryKey: ["blood-inventory-stats"] });
      toast({ title: "Transfusion request created" });
    },
  });
}

export function useUpdateTransfusionRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Omit<TransfusionRequest, 'id'>>) => {
      // Membentuk dinamis bagian SET dari query SQL
      const updateFields = Object.keys(data);
      if (updateFields.length === 0) {
        throw new Error("Tidak ada field yang di-update");
      }

      let setClause = "";
      const values: any[] = [];
      updateFields.forEach((field, idx) => {
        if (idx > 0) setClause += ", ";
        setClause += `"${field}" = $${idx + 1}`;
        values.push((data as any)[field]);
      });

      await getApi.unsafe(
        `UPDATE transfusion_requests SET ${setClause} WHERE id = $${values.length + 1}`,
        [...values, id]
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfusion-requests"] });
      toast({ title: "Request updated" });
    },
  });
}