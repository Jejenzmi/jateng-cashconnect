import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// Interfaces untuk data report builder
interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  sql_query: string;
  parameters: any[]; // Konfigurasi parameter dalam bentuk JSON
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface ReportHistory {
  id: string;
  template_id: string;
  executed_by: string;
  parameters_used: any; // Parameter yang digunakan saat eksekusi
  execution_time: string;
  execution_duration: number; // Durasi eksekusi dalam milidetik
  result_count: number; // Jumlah hasil dari eksekusi
  status: 'success' | 'failed';
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export function useReportBuilderData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all report templates
  const { data: reportTemplates, isLoading: isLoadingReportTemplates } = useQuery<ReportTemplate[]>({
    queryKey: ["report-templates"],
    queryFn: async () => {
      try {
        const result = await getApi<ReportTemplate[]>`
          SELECT 
            id,
            name,
            description,
            category,
            sql_query,
            parameters,
            created_by,
            created_at,
            updated_at
          FROM report_templates
          ORDER BY name
        `;
        return result;
      } catch (error) {
        console.error("Error fetching report templates:", error);
        throw error;
      }
    },
  });

  // Fetch all report history
  const { data: reportHistory, isLoading: isLoadingReportHistory } = useQuery<ReportHistory[]>({
    queryKey: ["report-history"],
    queryFn: async () => {
      try {
        const result = await getApi<ReportHistory[]>`
          SELECT 
            rh.id,
            rh.template_id,
            rh.executed_by,
            rh.parameters_used,
            rh.execution_time,
            rh.execution_duration,
            rh.result_count,
            rh.status,
            rh.error_message,
            rh.created_at,
            rh.updated_at,
            rt.name as template_name,
            u.full_name as executed_by_name
          FROM report_history rh
          LEFT JOIN report_templates rt ON rh.template_id = rt.id
          LEFT JOIN users u ON rh.executed_by = u.id
          ORDER BY rh.execution_time DESC
          LIMIT 100
        `;
        return result;
      } catch (error) {
        console.error("Error fetching report history:", error);
        throw error;
      }
    },
  });

  // Create new report template
  const createReportTemplate = useMutation({
    mutationFn: async (templateData: Omit<ReportTemplate, 'id' | 'created_at' | 'updated_at'>) => {
      const result = await getApi<ReportTemplate[]>`
        INSERT INTO report_templates (
          name,
          description,
          category,
          sql_query,
          parameters,
          created_by
        ) VALUES (
          ${templateData.name},
          ${templateData.description},
          ${templateData.category},
          ${templateData.sql_query},
          ${JSON.stringify(templateData.parameters)},
          ${templateData.created_by}
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-templates"] });
      toast({
        title: "Template Laporan Berhasil Dibuat",
        description: "Template laporan baru telah ditambahkan ke sistem.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Membuat Template Laporan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update report template
  const updateReportTemplate = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<ReportTemplate> & { id: string }) => {
      const result = await getApi<ReportTemplate[]>`
        UPDATE report_templates 
        SET 
          name = ${updateData.name},
          description = ${updateData.description},
          category = ${updateData.category},
          sql_query = ${updateData.sql_query},
          parameters = ${updateData.parameters ? JSON.stringify(updateData.parameters) : undefined},
          updated_at = NOW()
        WHERE id = ${id} 
        RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-templates"] });
      toast({
        title: "Template Laporan Berhasil Diperbarui",
        description: "Template laporan telah diperbarui.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Memperbarui Template Laporan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete report template
  const deleteReportTemplate = useMutation({
    mutationFn: async (id: string) => {
      await deleteApi("/generic-api");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-templates"] });
      toast({
        title: "Template Laporan Berhasil Dihapus",
        description: "Template laporan telah dihapus dari sistem.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menghapus Template Laporan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    reportTemplates,
    reportHistory,
    isLoadingReportTemplates,
    isLoadingReportHistory,
    createReportTemplate: createReportTemplate.mutate,
    updateReportTemplate: updateReportTemplate.mutate,
    deleteReportTemplate: deleteReportTemplate.mutate,
    executeReport: executeReport.mutate,
    isCreatingTemplate: createReportTemplate.isPending,
    isUpdatingTemplate: updateReportTemplate.isPending,
    isDeletingTemplate: deleteReportTemplate.isPending,
    isExecutingReport: executeReport.isPending,
  };
}

// Hook to fetch real data for report preview
export function useReportData(dataSource: string) {
  return useQuery({
    queryKey: ["report-data", dataSource],
    queryFn: async () => {
      try {
        switch (dataSource) {
          case "visits": {
            const result = await getApi("/generic-api");
            return result;
          }
          case "billing": {
            const result = await getApi("/generic-api");
            return result;
          }
          case "pharmacy": {
            const result = await getApi("/generic-api");
            return result;
          }
          case "lab": {
            const result = await getApi("/generic-api");
            return result;
          }
          case "employees": {
            const result = await getApi("/generic-api");
            return result;
          }
          case "inventory": {
            const result = await getApi("/generic-api");
            return result;
          }
          case "bpjs": {
            const result = await getApi("/generic-api");
            return result;
          }
          default:
            return [];
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 2,
  });
}
