import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface OperatingRoom {
  id: string;
  room_number: string;
  name: string;
  room_type: string;
  equipment: string[];
  is_available: boolean;
  is_active: boolean;
  notes: string | null;
}

export interface Surgery {
  id: string;
  surgery_number: string;
  patient_id: string;
  visit_id: string | null;
  operating_room_id: string | null;
  scheduled_date: string;
  scheduled_start_time: string;
  scheduled_end_time: string | null;
  actual_start_time: string | null;
  actual_end_time: string | null;
  preoperative_diagnosis: string;
  postoperative_diagnosis: string | null;
  procedure_name: string;
  procedure_code: string | null;
  procedure_type: string;
  wound_class: string;
  status: 'scheduled' | 'preparation' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  cancellation_reason: string | null;
  anesthesia_type: 'general' | 'regional' | 'local' | 'sedation' | 'combined' | null;
  asa_classification: 'ASA_I' | 'ASA_II' | 'ASA_III' | 'ASA_IV' | 'ASA_V' | 'ASA_VI' | null;
  preoperative_notes: string | null;
  operative_notes: string | null;
  postoperative_notes: string | null;
  complications: string | null;
  blood_loss_ml: number | null;
  consent_signed: boolean;
  consent_signed_at: string | null;
  consent_signed_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  patient?: {
    full_name: string;
    medical_record_number: string;
    birth_date: string;
    gender: string;
  };
  operating_room?: OperatingRoom;
}

export interface SurgeryTeamMember {
  id: string;
  surgery_id: string;
  staff_id: string | null;
  staff_name: string;
  role: string;
  is_primary: boolean;
  notes: string | null;
}

export interface SurgicalSafetyChecklist {
  id: string;
  surgery_id: string;
  sign_in_completed: boolean;
  sign_in_time: string | null;
  sign_in_by: string | null;
  time_out_completed: boolean;
  time_out_time: string | null;
  time_out_by: string | null;
  sign_out_completed: boolean;
  sign_out_time: string | null;
  sign_out_by: string | null;
  // ... other checklist fields
}

export function useSurgeryData() {
  const queryClient = useQueryClient();

  // Fetch operating rooms
  const { data: operatingRooms = [], isLoading: loadingRooms } = useQuery({
    queryKey: ["operating-rooms"],
    queryFn: async () => {
      const data = await getApi("/generic-api");

      return data as OperatingRoom[];
    },
  });

  // Fetch surgeries with patient and room data
  const { data: surgeries = [], isLoading: loadingSurgeries, refetch: refetchSurgeries } = useQuery({
    queryKey: ["surgeries"],
    queryFn: async () => {
      const data = await getApi("/generic-api");

      return data.map((row: any) => ({
        ...row,
        patient: row.patient_full_name ? {
          full_name: row.patient_full_name,
          medical_record_number: row.medical_record_number,
          birth_date: row.birth_date,
          gender: row.gender
        } : undefined,
        operating_room: row.or_room_number ? {
          id: row.operating_room_id,
          room_number: row.or_room_number,
          name: row.or_name,
          room_type: row.or_room_type,
          equipment: row.or_equipment,
          is_available: row.or_is_available,
          is_active: row.or_is_active,
          notes: row.or_notes
        } : undefined
      })) as Surgery[];
    },
  });

  // Fetch today's surgeries
  const { data: todaySurgeries = [], isLoading: loadingToday } = useQuery({
    queryKey: ["surgeries-today"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const data = await getApi("/generic-api");

      return data.map((row: any) => ({
        ...row,
        patient: row.patient_full_name ? {
          full_name: row.patient_full_name,
          medical_record_number: row.medical_record_number,
          birth_date: row.birth_date,
          gender: row.gender
        } : undefined,
        operating_room: row.or_room_number ? {
          id: row.operating_room_id,
          room_number: row.or_room_number,
          name: row.or_name,
          room_type: row.or_room_type,
          equipment: row.or_equipment,
          is_available: row.or_is_available,
          is_active: row.or_is_active,
          notes: row.or_notes
        } : undefined
      })) as Surgery[];
    },
  });

  // Create surgery
  const createSurgery = useMutation({
    mutationFn: async (surgeryData: Partial<Surgery>) => {
      // Generate surgery number using a function that creates unique numbers
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const surgeryNumber = `SURG-${date}-${randomPart}`;
      
      const insertData = {
        patient_id: surgeryData.patient_id!,
        scheduled_date: surgeryData.scheduled_date!,
        scheduled_start_time: surgeryData.scheduled_start_time!,
        preoperative_diagnosis: surgeryData.preoperative_diagnosis!,
        procedure_name: surgeryData.procedure_name!,
        surgery_number: surgeryNumber,
        visit_id: surgeryData.visit_id || null,
        operating_room_id: surgeryData.operating_room_id || null,
        scheduled_end_time: surgeryData.scheduled_end_time || null,
        procedure_code: surgeryData.procedure_code || null,
        procedure_type: surgeryData.procedure_type || 'elective',
        wound_class: surgeryData.wound_class || 'clean',
        anesthesia_type: surgeryData.anesthesia_type || null,
        asa_classification: surgeryData.asa_classification || null,
        preoperative_notes: surgeryData.preoperative_notes || null,
      };
      
      const result = await postApi("/generic-api", {});

      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surgeries"] });
      queryClient.invalidateQueries({ queryKey: ["surgeries-today"] });
      toast.success("Jadwal operasi berhasil dibuat");
    },
    onError: (error: Error) => {
      toast.error(`Gagal membuat jadwal: ${error.message}`);
    },
  });

  // Update surgery
  const updateSurgery = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Surgery> & { id: string }) => {
      // Membentuk dinamis bagian SET dari query SQL
      const updateFields = Object.keys(updateData);
      if (updateFields.length === 0) {
        throw new Error("Tidak ada field yang di-update");
      }

      let setClause = "";
      const values: any[] = [];
      updateFields.forEach((field, idx) => {
        if (idx > 0) setClause += ", ";
        setClause += `"${field}" = $${idx + 1}`;
        values.push((updateData as any)[field]);
      });

      const result = await getApi.unsafe(
        `UPDATE surgeries SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`,
        [...values, id]
      );
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surgeries"] });
      queryClient.invalidateQueries({ queryKey: ["surgeries-today"] });
      toast.success("Data operasi berhasil diperbarui");
    },
    onError: (error: Error) => {
      toast.error(`Gagal memperbarui: ${error.message}`);
    },
  });

  // Update surgery status
  const updateSurgeryStatus = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: Surgery['status']; notes?: string }) => {
      const updateData: Partial<Surgery> = { status };
      
      if (status === 'in_progress') {
        updateData.actual_start_time = new Date().toISOString();
      } else if (status === 'completed') {
        updateData.actual_end_time = new Date().toISOString();
      } else if (status === 'cancelled') {
        updateData.cancellation_reason = notes;
      }

      // Membentuk dinamis bagian SET dari query SQL
      const updateFields = Object.keys(updateData);
      if (updateFields.length === 0) {
        throw new Error("Tidak ada field yang di-update");
      }

      let setClause = "";
      const values: any[] = [];
      updateFields.forEach((field, idx) => {
        if (idx > 0) setClause += ", ";
        setClause += `"${field}" = $${idx + 1}`;
        values.push((updateData as any)[field]);
      });

      const result = await getApi.unsafe(
        `UPDATE surgeries SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`,
        [...values, id]
      );
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surgeries"] });
      queryClient.invalidateQueries({ queryKey: ["surgeries-today"] });
      toast.success("Status operasi diperbarui");
    },
    onError: (error: Error) => {
      toast.error(`Gagal memperbarui status: ${error.message}`);
    },
  });

  // Surgery team operations
  const addTeamMember = useMutation({
    mutationFn: async (member: Omit<SurgeryTeamMember, 'id'>) => {
      const result = await postApi("/generic-api", {});

      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surgery-team"] });
      toast.success("Anggota tim ditambahkan");
    },
  });

  // Fetch surgery team
  const fetchSurgeryTeam = async (surgeryId: string) => {
    const data = await getApi("/generic-api");
    
    return data as SurgeryTeamMember[];
  };

  // Create/update safety checklist
  const updateSafetyChecklist = useMutation({
    mutationFn: async ({ surgeryId, ...checklistData }: Partial<SurgicalSafetyChecklist> & { surgeryId: string }) => {
      // Check if checklist exists
      const existingResult = await getApi("/generic-api");

      if (existingResult.length > 0) {
        // Update existing checklist
        const updateFields = Object.keys(checklistData);
        if (updateFields.length === 0) {
          throw new Error("Tidak ada field yang di-update");
        }

        let setClause = "";
        const values: any[] = [];
        updateFields.forEach((field, idx) => {
          if (idx > 0) setClause += ", ";
          setClause += `"${field}" = $${idx + 1}`;
          values.push((checklistData as any)[field]);
        });

        const result = await getApi.unsafe(
          `UPDATE surgical_safety_checklists SET ${setClause} WHERE surgery_id = $${values.length + 1} RETURNING *`,
          [...values, surgeryId]
        );
        return result[0];
      } else {
        // Insert new checklist
        const result = await postApi("/generic-api", {});
        return result[0];
      }
    },
    onSuccess: () => {
      toast.success("Checklist diperbarui");
    },
  });

  // Statistics
  const stats = {
    totalToday: todaySurgeries.length,
    scheduled: todaySurgeries.filter((s: any) => s.status === 'scheduled').length,
    inProgress: todaySurgeries.filter((s: any) => s.status === 'in_progress').length,
    completed: todaySurgeries.filter((s: any) => s.status === 'completed').length,
    cancelled: todaySurgeries.filter((s: any) => s.status === 'cancelled').length,
    availableRooms: operatingRooms.filter((r: any) => r.is_available).length,
  };

  return {
    operatingRooms,
    surgeries,
    todaySurgeries,
    stats,
    isLoading: loadingRooms || loadingSurgeries || loadingToday,
    createSurgery,
    updateSurgery,
    updateSurgeryStatus,
    addTeamMember,
    fetchSurgeryTeam,
    updateSafetyChecklist,
    refetchSurgeries,
  };
}