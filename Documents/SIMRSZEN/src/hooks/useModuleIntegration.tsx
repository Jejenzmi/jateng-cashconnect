import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Shared types for module integration
export interface PatientWithVisits {
  id: string;
  medical_record_number: string;
  nik: string;
  full_name: string;
  gender: "L" | "P";
  birth_date: string;
  phone: string | null;
  bpjs_number: string | null;
  visits?: Visit[];
}

export interface Visit {
  id: string;
  visit_number: string;
  visit_date: string;
  visit_type: string;
  status: string;
  payment_type: string;
  queue_number: number | null;
  chief_complaint: string | null;
  department?: { id: string; name: string };
  doctor?: { id: string; full_name: string };
}

export interface MedicalRecordSummary {
  id: string;
  visit_id: string;
  patient_id: string;
  record_date: string;
  subjective: string | null;
  assessment: string | null;
  diagnoses?: { code: string; name: string }[];
}

export interface PrescriptionSummary {
  id: string;
  prescription_number: string;
  visit_id: string;
  patient_id: string;
  status: string;
  item_count: number;
}

export interface BillingSummary {
  id: string;
  invoice_number: string;
  visit_id: string;
  patient_id: string;
  total: number;
  status: string;
}

// Hook to get patient with all related data
export function usePatientFullProfile(patientId: string | null) {
  return useQuery({
    queryKey: ["patient-full-profile", patientId],
    queryFn: async () => {
      if (!patientId) return null;

      // Get patient basic info
      const patientResult = await getApi("/generic-api");

      if (patientResult.length === 0) return null;

      const patient = patientResult[0];

      // Get visits
      const visitsResult = await getApi("/generic-api");

      // Get medical records
      const medicalRecordsResult = await getApi("/generic-api");

      // Get prescriptions
      const prescriptionsResult = await getApi("/generic-api");

      // Get billings
      const billingsResult = await getApi("/generic-api");

      return {
        patient,
        visits: visitsResult || [],
        medicalRecords: medicalRecordsResult || [],
        prescriptions: (prescriptionsResult || []).map((p: any) => ({
          ...p,
          item_count: p.item_count || 0,
        })),
        billings: billingsResult || [],
      };
    },
    enabled: !!patientId,
  });
}

// Hook to get visit with all related data
export function useVisitFullDetails(visitId: string | null) {
  return useQuery({
    queryKey: ["visit-full-details", visitId],
    queryFn: async () => {
      if (!visitId) return null;

      // Get visit with patient and doctor
      const visitResult = await getApi("/generic-api");

      if (visitResult.length === 0) return null;

      const visit = visitResult[0];

      // Get medical record for this visit
      const medicalRecordResult = await getApi("/generic-api");

      const medicalRecord = medicalRecordResult.length > 0 ? medicalRecordResult[0] : null;

      // Get prescriptions for this visit
      const prescriptionsResult = await getApi("/generic-api");

      // Get billing for this visit
      const billingResult = await getApi("/generic-api");

      const billing = billingResult.length > 0 ? billingResult[0] : null;

      return {
        visit,
        medicalRecord,
        prescriptions: prescriptionsResult || [],
        billing,
      };
    },
    enabled: !!visitId,
  });
}

// Hook to create prescription from visit
export function useCreatePrescription() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      visitId,
      patientId,
      doctorId,
      items,
    }: {
      visitId: string;
      patientId: string;
      doctorId: string;
      items: Array<{
        medicine_id: string;
        quantity: number;
        dosage: string;
        frequency: string;
        instructions?: string;
      }>;
    }) => {
      // Generate prescription number
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 5).toUpperCase();
      const prescriptionNumber = `RX-${timestamp}-${random}`;

      // Create prescription
      const prescriptionResult = await postApi("/generic-api", {});

      const prescription = prescriptionResult[0];

      // Create prescription items
      for (const item of items) {
        await postApi("/generic-api", {});
      }

      return prescription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      queryClient.invalidateQueries({ queryKey: ["visit-full-details"] });
      toast({
        title: "Berhasil",
        description: "Resep berhasil dibuat",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error.message,
      });
    },
  });
}

// Hook to create billing from visit
export function useCreateBilling() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      visitId,
      patientId,
      paymentType,
      items,
    }: {
      visitId: string;
      patientId: string;
      paymentType: "umum" | "bpjs" | "asuransi";
      items: Array<{
        item_type: string;
        item_name: string;
        quantity: number;
        unit_price: number;
      }>;
    }) => {
      // Generate invoice number manually since we can't use RPC
      const timestamp = Date.now().toString(36).toUpperCase();
      const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
      const invoiceNumber = `INV-${timestamp}-${randomPart}`;

      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
      const tax = 0; // No tax for healthcare in Indonesia
      const total = subtotal + tax;

      // Create billing
      const billingResult = await postApi("/generic-api", {});

      const billing = billingResult[0];

      // Create billing items
      for (const item of items) {
        await postApi("/generic-api", {});
      }

      return billing;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billings"] });
      queryClient.invalidateQueries({ queryKey: ["visit-full-details"] });
      toast({
        title: "Berhasil",
        description: "Tagihan berhasil dibuat",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error.message,
      });
    },
  });
}

// Hook to complete visit workflow (finish examination -> create billing)
export function useCompleteVisitWorkflow() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      visitId,
      patientId,
      paymentType,
      consultationFee = 100000,
    }: {
      visitId: string;
      patientId: string;
      paymentType: "umum" | "bpjs" | "asuransi";
      consultationFee?: number;
    }) => {
      // Update visit status to selesai
      await putApi("/generic-api", {});

      // Only create billing for non-BPJS (BPJS handled separately via claims)
      if (paymentType === "umum" || paymentType === "asuransi") {
        // Generate invoice number manually since we can't use RPC
        const timestamp = Date.now().toString(36).toUpperCase();
        const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
        const invoiceNumber = `INV-${timestamp}-${randomPart}`;

        const billingResult = await postApi("/generic-api", {});

        const billing = billingResult[0];

        // Add consultation item
        await postApi("/generic-api", {});

        return { visitId, billingId: billing.id };
      }

      return { visitId, billingId: null };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["billings"] });
      toast({
        title: "Berhasil",
        description: "Kunjungan selesai, tagihan sudah dibuat",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error.message,
      });
    },
  });
}