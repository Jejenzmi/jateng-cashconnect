import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface MCUPackage {
  id: string;
  package_name: string;
  package_code: string;
  category: string;
  base_price: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  mcu_package_items?: any[]; // Could define more specific type if needed
}

export interface MCURegistration {
  id: string;
  registration_number: string;
  patient_id: string;
  package_id: string;
  corporate_client_id: string | null;
  registration_date: string;
  examination_date: string;
  examination_time: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  patients?: {
    full_name: string;
    medical_record_number: string;
    gender: string;
    birth_date: string;
  };
  mcu_packages?: {
    package_name: string;
    package_code: string;
    category: string;
  };
  corporate_clients?: {
    company_name: string;
  };
}

export interface MCUResult {
  id: string;
  registration_id: string;
  examination_date: string;
  examination_results: string | null;
  recommendations: string | null;
  conclusion: string | null;
  examined_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CorporateClient {
  id: string;
  company_name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  discount_percent: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MCUSummaryReport {
  id: string;
  registration_id: string;
  report_date: string;
  report_title: string;
  report_content: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  mcu_registrations?: {
    registration_number: string;
    patients?: {
      full_name: string;
    };
  };
}

export function useMCUData() {
  const queryClient = useQueryClient();

  // Fetch MCU packages
  const { data: packages, isLoading: loadingPackages } = useQuery({
    queryKey: ["mcu-packages"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data as MCUPackage[];
    },
  });

  // Fetch corporate clients
  const { data: corporateClients, isLoading: loadingClients } = useQuery({
    queryKey: ["corporate-clients"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data as CorporateClient[];
    },
  });

  // Fetch MCU registrations
  const { data: registrations, isLoading: loadingRegistrations } = useQuery({
    queryKey: ["mcu-registrations"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      
      return data.map((row: any) => ({
        ...row,
        patients: {
          full_name: row.full_name,
          medical_record_number: row.medical_record_number,
          gender: row.gender,
          birth_date: row.birth_date
        },
        mcu_packages: {
          package_name: row.package_name,
          package_code: row.package_code,
          category: row.category
        },
        corporate_clients: {
          company_name: row.company_name
        }
      })) as MCURegistration[];
    },
  });

  // Fetch today's MCU schedule
  const { data: todaySchedule, isLoading: loadingSchedule } = useQuery({
    queryKey: ["today-mcu-schedule"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const data = await getApi("/generic-api");
      
      return data.map((row: any) => ({
        ...row,
        patients: {
          full_name: row.full_name,
          medical_record_number: row.medical_record_number,
          gender: row.gender
        },
        mcu_packages: {
          package_name: row.package_name,
          category: row.category
        }
      })) as MCURegistration[];
    },
  });

  // Fetch MCU summary reports
  const { data: summaryReports, isLoading: loadingReports } = useQuery({
    queryKey: ["mcu-summary-reports"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      
      return data.map((row: any) => ({
        ...row,
        mcu_registrations: {
          registration_number: row.registration_number,
          patients: {
            full_name: row.patient_name
          }
        }
      })) as MCUSummaryReport[];
    },
  });

  // Create MCU registration
  const createRegistration = useMutation({
    mutationFn: async (registration: Omit<MCURegistration, 'id' | 'created_at' | 'updated_at'>) => {
      const result = await postApi("/generic-api", {});
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mcu-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["today-mcu-schedule"] });
      toast.success("Pendaftaran MCU berhasil");
    },
    onError: (error: Error) => {
      toast.error("Gagal mendaftar MCU: " + error.message);
    },
  });

  // Update registration status
  const updateRegistrationStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const result = await putApi("/generic-api", {});
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mcu-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["today-mcu-schedule"] });
      toast.success("Status MCU berhasil diperbarui");
    },
    onError: (error: Error) => {
      toast.error("Gagal memperbarui status: " + error.message);
    },
  });

  // Record MCU result
  const recordResult = useMutation({
    mutationFn: async (result: Omit<MCUResult, 'id' | 'created_at' | 'updated_at'>) => {
      const resultData = await postApi("/generic-api", {});
      return resultData[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mcu-registrations"] });
      toast.success("Hasil pemeriksaan berhasil dicatat");
    },
    onError: (error: Error) => {
      toast.error("Gagal mencatat hasil: " + error.message);
    },
  });

  // Create corporate client
  const createCorporateClient = useMutation({
    mutationFn: async (client: Omit<CorporateClient, 'id' | 'created_at' | 'updated_at'>) => {
      const result = await postApi("/generic-api", {});
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["corporate-clients"] });
      toast.success("Klien korporat berhasil ditambahkan");
    },
    onError: (error: Error) => {
      toast.error("Gagal menambah klien: " + error.message);
    },
  });

  return {
    packages,
    corporateClients,
    registrations,
    todaySchedule,
    summaryReports,
    loadingPackages,
    loadingClients,
    loadingRegistrations,
    loadingSchedule,
    loadingReports,
    createRegistration,
    updateRegistrationStatus,
    recordResult,
    createCorporateClient,
  };
}