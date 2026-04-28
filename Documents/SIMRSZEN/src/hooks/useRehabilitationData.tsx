import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface TherapyType {
  id: string;
  name: string;
  type: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RehabAssessment {
  id: string;
  patient_id: string;
  therapist_id: string;
  assessment_date: string;
  primary_diagnosis: string;
  secondary_diagnosis: string;
  functional_limitations: string;
  goals: string;
  treatment_plan: string;
  created_at: string;
  updated_at: string;
}

export interface TherapySession {
  id: string;
  patient_id: string;
  therapy_type_id: string;
  therapist_id: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  status: string;
  progress_notes?: string;
  actual_start_time?: string;
  actual_end_time?: string;
  created_at: string;
  updated_at: string;
}

export interface RehabGoal {
  id: string;
  assessment_id: string;
  goal_description: string;
  target_date: string;
  status: string;
  achieved_date?: string;
  created_at: string;
  updated_at: string;
}

export function useRehabilitationData() {
  const queryClient = useQueryClient();

  // Fetch therapy types
  const { data: therapyTypes, isLoading: loadingTherapyTypes } = useQuery({
    queryKey: ["therapy-types"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data as TherapyType[];
    },
  });

  // Fetch rehabilitation assessments
  const { data: assessments, isLoading: loadingAssessments } = useQuery({
    queryKey: ["rehab-assessments"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });

  // Fetch today's therapy sessions
  const { data: todaySessions, isLoading: loadingSessions } = useQuery({
    queryKey: ["today-therapy-sessions"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const data = await getApi("/generic-api");
      return data;
    },
  });

  // Fetch all therapy sessions for schedule view
  const { data: allSessions, isLoading: loadingAllSessions } = useQuery({
    queryKey: ["all-therapy-sessions"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const data = await getApi("/generic-api");
      return data;
    },
  });

  // Fetch rehabilitation goals
  const { data: goals, isLoading: loadingGoals } = useQuery({
    queryKey: ["rehab-goals"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });

  // Create assessment
  const createAssessment = useMutation({
    mutationFn: async (assessment: Omit<RehabAssessment, 'id' | 'created_at' | 'updated_at'>) => {
      const data = await postApi("/generic-api", {});
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rehab-assessments"] });
      toast.success("Assessment rehabilitasi berhasil dibuat");
    },
    onError: (error: any) => {
      toast.error("Gagal membuat assessment: " + error.message);
    },
  });

  // Schedule therapy session
  const scheduleSession = useMutation({
    mutationFn: async (session: Omit<TherapySession, 'id' | 'created_at' | 'updated_at'>) => {
      const data = await postApi("/generic-api", {});
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["today-therapy-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["all-therapy-sessions"] });
      toast.success("Jadwal terapi berhasil dibuat");
    },
    onError: (error: any) => {
      toast.error("Gagal menjadwalkan terapi: " + error.message);
    },
  });

  // Update session status
  const updateSessionStatus = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const updateData: Record<string, unknown> = { status };
      if (status === "in_progress") {
        updateData.actual_start_time = new Date().toISOString();
      } else if (status === "completed") {
        updateData.actual_end_time = new Date().toISOString();
      }
      if (notes) updateData.progress_notes = notes;
      
      const data = await putApi("/generic-api", {});
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["today-therapy-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["all-therapy-sessions"] });
      toast.success("Status terapi berhasil diperbarui");
    },
    onError: (error: any) => {
      toast.error("Gagal memperbarui status: " + error.message);
    },
  });

  return {
    therapyTypes,
    assessments,
    todaySessions,
    allSessions,
    goals,
    loadingTherapyTypes,
    loadingAssessments,
    loadingSessions,
    loadingAllSessions,
    loadingGoals,
    createAssessment,
    scheduleSession,
    updateSessionStatus,
  };
}