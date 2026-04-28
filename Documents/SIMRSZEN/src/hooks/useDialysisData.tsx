import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Types
export interface DialysisMachine {
  id: string;
  machine_number: string;
  brand: string | null;
  model: string | null;
  is_available: boolean | null;
  last_maintenance_date: string | null;
  next_maintenance_date: string | null;
  notes: string | null;
}

export interface VascularAccess {
  id: string;
  patient_id: string;
  access_type: string; // vascular_access_type enum
  location: string | null;
  creation_date: string | null;
  is_active: boolean | null;
}

export interface DialysisSession {
  id: string;
  session_number: string;
  patient_id: string;
  machine_id: string | null;
  vascular_access_id: string | null;
  dialysis_type: string | null; // dialysis_type enum
  session_date: string;
  scheduled_time: string | null;
  actual_start_time: string | null;
  actual_end_time: string | null;
  duration_planned: number | null;
  duration_actual: number | null;
  status: string | null; // session_status enum
  attending_doctor_id: string | null;
  
  // Pre-dialysis
  pre_weight: number | null;
  dry_weight: number | null;
  target_uf: number | null;
  pre_bp_systolic: number | null;
  pre_bp_diastolic: number | null;
  
  // Dialysis Parameters
  blood_flow_rate: number | null;
  dialyzer_type: string | null;
  
  // Post-dialysis
  post_weight: number | null;
  actual_uf: number | null;
  kt_v: number | null;
  urr: number | null;
  
  notes: string | null;
  
  patients?: { full_name: string; medical_record_number: string } | null;
  dialysis_machines?: { machine_number: string; brand: string | null; model: string | null } | null;
  doctors?: { full_name: string } | null;
}

export interface DialysisMonitoring {
  id: string;
  session_id: string;
  recorded_at: string;
  time_elapsed: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  heart_rate: number | null;
  blood_flow_rate: number | null;
  uf_total: number | null;
  symptoms: string | null;
}

// Dialysis Machines
export function useDialysisMachines() {
  return useQuery({
    queryKey: ["dialysis-machines"],
    queryFn: async () => {
      const data = await getApi("/generic-api");

      return data as DialysisMachine[];
    },
  });
}

// Dialysis Sessions
export function useDialysisSessions(date?: string, status?: string) {
  return useQuery({
    queryKey: ["dialysis-sessions", date, status],
    queryFn: async () => {
      let sql = getApi("/generic-api");

      // Apply filters if provided
      let conditions: string[] = [];
      if (date) {
        conditions.push(`ds.session_date = '${date}'`);
      }
      if (status) {
        conditions.push(`ds.status = '${status}'`);
      }

      if (conditions.length > 0) {
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
        dialysis_machines: row.machine_number ? { 
          machine_number: row.machine_number, 
          brand: row.machine_brand, 
          model: row.machine_model 
        } : null,
        doctors: row.doctor_full_name ? { 
          full_name: row.doctor_full_name 
        } : null
      })) as unknown as DialysisSession[];
    },
  });
}

// Today's Sessions
export function useTodayDialysisSessions() {
  const today = new Date().toISOString().split('T')[0];
  return useDialysisSessions(today);
}

// Dialysis Monitoring
export function useDialysisMonitoring(sessionId: string) {
  return useQuery({
    queryKey: ["dialysis-monitoring", sessionId],
    queryFn: async () => {
      const data = await getApi("/generic-api");

      return data as DialysisMonitoring[];
    },
    enabled: !!sessionId,
  });
}

// Dialysis Statistics
export function useDialysisStatistics() {
  return useQuery({
    queryKey: ["dialysis-statistics"],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Get machines
      const machines = await getApi("/generic-api");
      
      // Get today's sessions
      const todaySessions = await getApi("/generic-api");

      // Get this month's completed sessions
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const monthSessionsResult = await getApi("/generic-api");
      
      // Get total count of this month's completed sessions
      const monthlyTotalResult = await getApi("/generic-api");
      const monthlyTotal = parseInt(monthlyTotalResult[0].count);

      const totalMachines = machines?.length || 0;
      const availableMachines = machines?.filter((m: any) => m.is_available).length || 0;
      const inUseMachines = totalMachines - availableMachines;

      const todayScheduled = todaySessions?.filter((s: any) => s.status === 'scheduled').length || 0;
      const todayCompleted = todaySessions?.filter((s: any) => s.status === 'completed').length || 0;
      const todayInProgress = todaySessions?.filter((s: any) => s.status === 'in_progress').length || 0;

      // Calculate average Kt/V from completed sessions
      const sessionsWithKtV = monthSessionsResult?.filter((s: any) => s.kt_v) || [];
      const avgKtV = sessionsWithKtV.length 
        ? sessionsWithKtV.reduce((sum: number, s: any) => sum + (s.kt_v || 0), 0) / sessionsWithKtV.length
        : 0;

      return {
        totalMachines,
        availableMachines,
        inUseMachines,
        todayScheduled,
        todayCompleted,
        todayInProgress,
        monthlyTotal: monthlyTotal || 0,
        avgKtV: avgKtV.toFixed(2),
      };
    },
  });
}

// Weekly dialysis sessions data for charts
export function useWeeklyDialysisSessions() {
  return useQuery({
    queryKey: ["dialysis-weekly-sessions"],
    queryFn: async () => {
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
      
      const weekDays = [];
      for (let i = 0; i < 6; i++) { // Mon-Sat
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        weekDays.push(date.toISOString().split('T')[0]);
      }
      
      const data = await getApi("/generic-api");
      
      const dayLabels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
      const sessionCounts: Record<string, number> = {};
      weekDays.forEach(d => sessionCounts[d] = 0);
      
      data?.forEach((s: any) => {
        if (sessionCounts[s.session_date] !== undefined) {
          sessionCounts[s.session_date]++;
        }
      });
      
      return weekDays.map((date, idx) => ({
        day: dayLabels[idx],
        sessions: sessionCounts[date] || 0,
      }));
    },
  });
}

// Adequacy data (Kt/V distribution)
export function useDialysisAdequacy() {
  return useQuery({
    queryKey: ["dialysis-adequacy"],
    queryFn: async () => {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      
      const data = await getApi("/generic-api");
      
      const total = data?.length || 0;
      const adequate = data?.filter((s: any) => (s.kt_v || 0) >= 1.2).length || 0;
      const inadequate = total - adequate;
      
      return [
        { name: "Kt/V ≥ 1.2", value: total > 0 ? Math.round((adequate / total) * 100) : 0, color: "hsl(var(--primary))" },
        { name: "Kt/V < 1.2", value: total > 0 ? Math.round((inadequate / total) * 100) : 0, color: "hsl(var(--muted))" },
      ];
    },
  });
}

// Mutations
export function useUpdateDialysisSession() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Omit<DialysisSession, 'id'>>) => {
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
        `UPDATE dialysis_sessions SET ${setClause} WHERE id = $${values.length + 1}`,
        [...values, id]
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dialysis-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["dialysis-statistics"] });
      toast({ title: "Session updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating session", description: error.message, variant: "destructive" });
    },
  });
}

export function useAddDialysisMonitoring() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<DialysisMonitoring, 'id'>) => {
      const {
        session_id, recorded_at, time_elapsed, blood_pressure_systolic, 
        blood_pressure_diastolic, heart_rate, blood_flow_rate, 
        uf_total, symptoms
      } = data;
      
      await postApi("/generic-api", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dialysis-monitoring"] });
      toast({ title: "Monitoring data recorded" });
    },
  });
}