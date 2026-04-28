import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export type TriageLevel = "merah" | "kuning" | "hijau" | "hitam";

export interface EmergencyVisit {
  id: string;
  patient_id: string;
  visit_id: string;
  arrival_time: string;
  arrival_mode: string | null;
  chief_complaint: string;
  triage_level: TriageLevel;
  triage_time: string | null;
  triage_by: string | null;
  is_critical: boolean | null;
  consciousness_level: string | null;
  trauma_type: string | null;
  disposition: string | null;
  disposition_time: string | null;
  notes: string | null;
  patients?: {
    full_name: string;
    medical_record_number: string;
    gender: string;
    birth_date: string;
  };
  visits?: {
    status: string;
  };
}

export interface EmergencyStats {
  totalActive: number;
  triageCounts: Record<TriageLevel, number>;
  avgResponseTime: number;
  todayTotal: number;
}

export function useEmergencyVisits() {
  return useQuery({
    queryKey: ["emergency-visits"],
    queryFn: async (): Promise<EmergencyVisit[]> => {
      const data = await getApi("/generic-api");

      // Format data to match the expected interface
      return data.map((row: any) => ({
        ...row,
        patients: row.patient_name ? {
          full_name: row.patient_name,
          medical_record_number: row.medical_record_number,
          gender: row.gender,
          birth_date: row.birth_date
        } : undefined,
        visits: row.visit_status ? {
          status: row.visit_status
        } : undefined
      })) as EmergencyVisit[];
    },
    refetchInterval: 10000, // Refresh every 10 seconds for real-time updates
  });
}

export function useEmergencyStats() {
  return useQuery({
    queryKey: ["emergency-stats"],
    queryFn: async (): Promise<EmergencyStats> => {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();

      // Get active emergency visits
      const activeVisits = await getApi("/generic-api");

      // Get today's total
      const todayTotalResult = await getApi("/generic-api");
      const todayTotal = parseInt(todayTotalResult[0].count);

      // Calculate triage counts
      const triageCounts: Record<TriageLevel, number> = {
        merah: 0,
        kuning: 0,
        hijau: 0,
        hitam: 0,
      };

      let totalResponseTime = 0;
      let responseCount = 0;

      activeVisits?.forEach((visit: any) => {
        const level = visit.triage_level as TriageLevel;
        if (triageCounts[level] !== undefined) {
          triageCounts[level]++;
        }

        // Calculate response time
        if (visit.triage_time && visit.arrival_time) {
          const arrival = new Date(visit.arrival_time);
          const triage = new Date(visit.triage_time);
          const diff = (triage.getTime() - arrival.getTime()) / 60000; // minutes
          totalResponseTime += diff;
          responseCount++;
        }
      });

      const avgResponseTime = responseCount > 0 
        ? Math.round(totalResponseTime / responseCount) 
        : 0;

      return {
        totalActive: activeVisits?.length || 0,
        triageCounts,
        avgResponseTime,
        todayTotal: todayTotal || 0,
      };
    },
    refetchInterval: 30000,
  });
}

export function useCreateEmergencyVisit() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      patient_id: string;
      arrival_mode: string;
      chief_complaint: string;
      triage_level: TriageLevel;
      is_critical?: boolean;
    }) => {
      // First create a visit - generate a visit number
      const visitNumber = `IGD-${Date.now()}`;
      const visitResult = await postApi("/generic-api", {});
      
      const visit = visitResult[0];

      // Then create emergency visit
      const emergencyVisitResult = await postApi("/generic-api", {});
      
      return emergencyVisitResult[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergency-visits"] });
      queryClient.invalidateQueries({ queryKey: ["emergency-stats"] });
      toast({
        title: "Berhasil",
        description: "Pasien IGD berhasil didaftarkan",
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

export function useUpdateEmergencyDisposition() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      disposition,
      notes 
    }: { 
      id: string; 
      disposition: string;
      notes?: string;
    }) => {
      await putApi("/generic-api", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergency-visits"] });
      queryClient.invalidateQueries({ queryKey: ["emergency-stats"] });
      toast({
        title: "Berhasil",
        description: "Status pasien diperbarui",
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