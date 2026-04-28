import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface MortuaryCase {
  id: string;
  case_number: string;
  deceased_id: string;
  deceased_name: string;
  admission_date: string;
  cause_of_death: string;
  status: string;
  storage_location: string;
  release_authorized: boolean;
  release_date?: string;
  released_to?: string;
  released_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AutopsyRecord {
  id: string;
  case_id: string;
  pathologist_id: string;
  autopsy_date: string;
  findings: string;
  conclusion: string;
  created_at: string;
  updated_at: string;
}

export interface VisumReport {
  id: string;
  patient_id: string;
  examination_date: string;
  examiner_id: string;
  complaint: string;
  findings: string;
  conclusion: string;
  created_at: string;
  updated_at: string;
}

export interface DeathCertificate {
  id: string;
  patient_id: string;
  certifying_doctor_id: string;
  certification_date: string;
  cause_of_death: string;
  manner_of_death: string;
  certified_by: string;
  created_at: string;
  updated_at: string;
}

export function useForensicData() {
  const queryClient = useQueryClient();

  // Fetch mortuary cases
  const { data: mortuaryCases, isLoading: loadingCases } = useQuery({
    queryKey: ["mortuary-cases"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });

  // Fetch active mortuary cases (not released)
  const { data: activeCases, isLoading: loadingActiveCases } = useQuery({
    queryKey: ["active-mortuary-cases"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data as MortuaryCase[];
    },
  });

  // Fetch autopsy records
  const { data: autopsyRecords, isLoading: loadingAutopsies } = useQuery({
    queryKey: ["autopsy-records"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });

  // Fetch visum reports
  const { data: visumReports, isLoading: loadingVisums } = useQuery({
    queryKey: ["visum-reports"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });

  // Fetch death certificates
  const { data: deathCertificates, isLoading: loadingCertificates } = useQuery({
    queryKey: ["death-certificates"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });

  // Create mortuary case
  const createMortuaryCase = useMutation({
    mutationFn: async (caseData: Omit<MortuaryCase, 'id' | 'created_at' | 'updated_at'>) => {
      const data = await postApi("/generic-api", {});
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mortuary-cases"] });
      queryClient.invalidateQueries({ queryKey: ["active-mortuary-cases"] });
      toast.success("Kasus kamar jenazah berhasil dicatat");
    },
    onError: (error: any) => {
      toast.error("Gagal mencatat kasus: " + error.message);
    },
  });

  // Update mortuary case
  const updateMortuaryCase = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<MortuaryCase>) => {
      const data = await putApi("/generic-api", {});
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mortuary-cases"] });
      queryClient.invalidateQueries({ queryKey: ["active-mortuary-cases"] });
      toast.success("Kasus berhasil diperbarui");
    },
    onError: (error: any) => {
      toast.error("Gagal memperbarui kasus: " + error.message);
    },
  });

  // Create autopsy record
  const createAutopsyRecord = useMutation({
    mutationFn: async (record: Omit<AutopsyRecord, 'id' | 'created_at' | 'updated_at'>) => {
      const data = await postApi("/generic-api", {});
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["autopsy-records"] });
      toast.success("Catatan otopsi berhasil dibuat");
    },
    onError: (error: any) => {
      toast.error("Gagal membuat catatan otopsi: " + error.message);
    },
  });

  // Create visum report
  const createVisumReport = useMutation({
    mutationFn: async (report: Omit<VisumReport, 'id' | 'created_at' | 'updated_at'>) => {
      const data = await postApi("/generic-api", {});
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visum-reports"] });
      toast.success("Visum et Repertum berhasil dibuat");
    },
    onError: (error: any) => {
      toast.error("Gagal membuat visum: " + error.message);
    },
  });

  // Create death certificate
  const createDeathCertificate = useMutation({
    mutationFn: async (cert: Omit<DeathCertificate, 'id' | 'created_at' | 'updated_at'>) => {
      const data = await postApi("/generic-api", {});
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["death-certificates"] });
      toast.success("Sertifikat kematian berhasil dibuat");
    },
    onError: (error: any) => {
      toast.error("Gagal membuat sertifikat: " + error.message);
    },
  });

  // Release body
  const releaseBody = useMutation({
    mutationFn: async ({ id, releasedTo, releasedBy }: { id: string; releasedTo: string; releasedBy: string }) => {
      const data = await putApi("/generic-api", {});
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mortuary-cases"] });
      queryClient.invalidateQueries({ queryKey: ["active-mortuary-cases"] });
      toast.success("Jenazah berhasil diserahkan");
    },
    onError: (error: any) => {
      toast.error("Gagal menyerahkan jenazah: " + error.message);
    },
  });

  return {
    mortuaryCases,
    activeCases,
    autopsyRecords,
    visumReports,
    deathCertificates,
    loadingCases,
    loadingActiveCases,
    loadingAutopsies,
    loadingVisums,
    loadingCertificates,
    createMortuaryCase,
    updateMortuaryCase,
    createAutopsyRecord,
    createVisumReport,
    createDeathCertificate,
    releaseBody,
  };
}