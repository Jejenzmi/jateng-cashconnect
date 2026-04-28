import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// Hospital Profile
export function useHospitalProfile() {
  return useQuery({
    queryKey: ["hospital-profile"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data.length > 0 ? data[0] : null;
    },
  });
}

// RL Report Submissions
export function useRLReportSubmissions(year?: number) {
  return useQuery({
    queryKey: ["rl-report-submissions", year],
    queryFn: async () => {
      let sql = getApi("/generic-api");
      
      if (year) {
        sql = getApi("/generic-api");
      }
      
      const data = await sql;
      return data;
    },
  });
}

// RL3 Outpatient Stats
export function useRL3OutpatientStats(month?: number, year?: number) {
  return useQuery({
    queryKey: ["rl3-outpatient-stats", month, year],
    queryFn: async () => {
      let sql = getApi("/generic-api");
      
      if (month && year) {
        sql = getApi("/generic-api");
      }
      
      const data = await sql;
      return data;
    },
  });
}

// RL3 Inpatient Stats
export function useRL3InpatientStats(month?: number, year?: number) {
  return useQuery({
    queryKey: ["rl3-inpatient-stats", month, year],
    queryFn: async () => {
      let sql = getApi("/generic-api");
      
      if (month && year) {
        sql = getApi("/generic-api");
      }
      
      const data = await sql;
      return data;
    },
  });
}

// RL4 Morbidity Stats
export function useRL4MorbidityStats(year?: number, patientType?: string) {
  return useQuery({
    queryKey: ["rl4-morbidity-stats", year, patientType],
    queryFn: async () => {
      let sql = getApi("/generic-api");
      
      const conditions = [];
      if (year) {
        conditions.push(getApi("/generic-api"));
      }
      if (patientType) {
        conditions.push(getApi("/generic-api"));
      }
      
      if (conditions.length > 0) {
        sql = getApi("/generic-api");
      }
      
      const data = await sql;
      return data;
    },
  });
}

// RL4 Mortality Stats
export function useRL4MortalityStats(year?: number) {
  return useQuery({
    queryKey: ["rl4-mortality-stats", year],
    queryFn: async () => {
      let sql = getApi("/generic-api");
      
      if (year) {
        sql = getApi("/generic-api");
      }
      
      const data = await sql;
      return data;
    },
  });
}

// RL5 Visitor Stats
export function useRL5VisitorStats(month?: number, year?: number) {
  return useQuery({
    queryKey: ["rl5-visitor-stats", month, year],
    queryFn: async () => {
      let sql = getApi("/generic-api");
      
      if (month && year) {
        sql = getApi("/generic-api");
      }
      
      const data = await sql;
      return data;
    },
  });
}

// RL6 Indicators
export function useRL6Indicators(year?: number) {
  return useQuery({
    queryKey: ["rl6-indicators", year],
    queryFn: async () => {
      let sql = getApi("/generic-api");
      
      if (year) {
        sql = getApi("/generic-api");
      }
      
      const data = await sql;
      return data;
    },
  });
}

// Calculate RL6 Indicators
export function useCalculateRL6() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ month, year }: { month: number; year: number }) => {
      // Execute the stored procedure to calculate RL6 indicators
      await getApi.unsafe(
        `CALL calculate_rl6_indicators($1, $2)`,
        [month, year]
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rl6-indicators"] });
      toast({
        title: "Berhasil",
        description: "Indikator RL6 berhasil dihitung",
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