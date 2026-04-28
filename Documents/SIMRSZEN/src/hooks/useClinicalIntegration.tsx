import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

/**
 * Clinical Integration Hook
 * Integrates workflows across clinical modules
 */

// ==================== IGD INTEGRATION ====================

export function useIGDToAdmission() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      emergencyVisitId,
      visitId,
      patientId,
      disposition,
      roomId,
      bedId,
      doctorId,
    }: {
      emergencyVisitId: string;
      visitId: string;
      patientId: string;
      disposition: "rawat_inap" | "rawat_jalan" | "rujuk" | "pulang" | "meninggal";
      roomId?: string;
      bedId?: string;
      doctorId?: string;
    }) => {
      // Update emergency visit disposition
      await putApi("/generic-api", {});

      // If rawat inap, create inpatient admission
      if (disposition === "rawat_inap" && roomId) {
        await postApi("/generic-api", {});

        if (bedId) {
          await putApi("/generic-api", {});
        }
      }

      // Update visit status
      await putApi("/generic-api", {});

      return { disposition };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergency-visits"] });
      queryClient.invalidateQueries({ queryKey: ["inpatient-admissions"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast({ title: "Disposisi berhasil" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Gagal", description: error.message });
    },
  });
}

// ==================== RAWAT INAP INTEGRATION ====================

export function useInpatientWorkflow() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const transferBed = useMutation({
    mutationFn: async ({
      admissionId,
      currentBedId,
      newRoomId,
      newBedId,
    }: {
      admissionId: string;
      currentBedId: string | null;
      newRoomId: string;
      newBedId: string;
    }) => {
      if (currentBedId) {
        await putApi("/generic-api", {});
      }

      const admissionResult = await getApi("/generic-api");
      
      const admission = admissionResult[0];
      
      await putApi("/generic-api", {});
      
      await putApi("/generic-api", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inpatient-admissions"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast({ title: "Transfer berhasil" });
    },
  });

  const createDischargeBilling = useMutation({
    mutationFn: async ({
      visitId,
      patientId,
      paymentType,
      amount,
    }: {
      visitId: string;
      patientId: string;
      paymentType: "umum" | "bpjs" | "asuransi";
      amount: number;
    }) => {
      // Generate invoice number manually since we can't use RPC
      const timestamp = Date.now().toString(36).toUpperCase();
      const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
      const invoiceNumber = `INV-${timestamp}-${randomPart}`;

      const billingResult = await postApi("/generic-api", {});
      
      return billingResult[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billings"] });
      toast({ title: "Tagihan rawat inap dibuat" });
    },
  });

  return { transferBed, createDischargeBilling };
}

// ==================== LAB INTEGRATION ====================

export function useLabIntegration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createLabOrderFromVisit = useMutation({
    mutationFn: async ({
      visitId,
      patientId,
      doctorId,
      templateIds,
      notes,
    }: {
      visitId: string;
      patientId: string;
      doctorId: string;
      templateIds: string[];
      notes?: string;
    }) => {
      const results = await Promise.all(
        templateIds.map(async (templateId) => {
          const labNumber = `LAB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

          const result = await postApi("/generic-api", {});
          
          return result[0];
        })
      );

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-results"] });
      toast({ title: "Permintaan lab berhasil dibuat" });
    },
  });

  const completeLabResult = useMutation({
    mutationFn: async ({
      labResultId,
      results,
      notes,
    }: {
      labResultId: string;
      results: Record<string, string>;
      notes?: string;
    }) => {
      const result = await putApi("/generic-api", {});
      
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-results"] });
      toast({ title: "Hasil lab berhasil disimpan" });
    },
  });

  return { createLabOrderFromVisit, completeLabResult };
}

// ==================== SURGERY INTEGRATION ====================

export function useSurgeryIntegration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const completeSurgery = useMutation({
    mutationFn: async ({
      surgeryId,
      operatingRoomId,
      postoperativeDiagnosis,
      operativeNotes,
    }: {
      surgeryId: string;
      operatingRoomId: string;
      postoperativeDiagnosis?: string;
      operativeNotes?: string;
    }) => {
      const result = await putApi("/generic-api", {});

      await putApi("/generic-api", {});

      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surgeries"] });
      queryClient.invalidateQueries({ queryKey: ["operating-rooms"] });
      toast({ title: "Operasi selesai" });
    },
  });

  const createSurgeryBilling = useMutation({
    mutationFn: async ({
      visitId,
      patientId,
      paymentType,
      surgeonFee,
      anesthesiaFee,
      roomFee,
    }: {
      visitId: string;
      patientId: string;
      paymentType: "umum" | "bpjs" | "asuransi";
      surgeonFee: number;
      anesthesiaFee: number;
      roomFee: number;
    }) => {
      const total = surgeonFee + anesthesiaFee + roomFee;
      // Generate invoice number manually
      const timestamp = Date.now().toString(36).toUpperCase();
      const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
      const invoiceNumber = `INV-${timestamp}-${randomPart}`;

      const billingResult = await postApi("/generic-api", {});

      const billing = billingResult[0];

      await postApi("/generic-api", {});

      return billing;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billings"] });
      toast({ title: "Tagihan operasi dibuat" });
    },
  });

  return { completeSurgery, createSurgeryBilling };
}

// ==================== ICU INTEGRATION ====================

export function useICUIntegration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const admitToICU = useMutation({
    mutationFn: async ({
      visitId,
      patientId,
      icuBedId,
      icuType,
      admissionReason,
      doctorId,
    }: {
      visitId: string;
      patientId: string;
      icuBedId: string;
      icuType: "icu" | "iccu" | "nicu" | "picu" | "hcu";
      admissionReason: string;
      doctorId?: string;
    }) => {
      const admissionNumber = `ICU-${Date.now().toString(36).toUpperCase()}`;

      const result = await postApi("/generic-api", {});

      await putApi("/generic-api", {});

      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["icu-admissions"] });
      queryClient.invalidateQueries({ queryKey: ["icu-beds"] });
      toast({ title: "Pasien masuk ICU" });
    },
  });

  const dischargeFromICU = useMutation({
    mutationFn: async ({
      admissionId,
      icuBedId,
      dischargeReason,
      totalDays,
    }: {
      admissionId: string;
      icuBedId: string;
      dischargeReason: string;
      totalDays: number;
    }) => {
      const result = await putApi("/generic-api", {});

      await putApi("/generic-api", {});

      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["icu-admissions"] });
      queryClient.invalidateQueries({ queryKey: ["icu-beds"] });
      toast({ title: "Pasien keluar ICU" });
    },
  });

  return { admitToICU, dischargeFromICU };
}

// ==================== DIALYSIS INTEGRATION ====================

export function useDialysisIntegration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const completeDialysisSession = useMutation({
    mutationFn: async ({
      sessionId,
      machineId,
      postWeight,
      actualUf,
      ktV,
    }: {
      sessionId: string;
      machineId: string;
      postWeight?: number;
      actualUf?: number;
      ktV?: number;
    }) => {
      const result = await putApi("/generic-api", {});

      await putApi("/generic-api", {});

      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dialysis-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["dialysis-machines"] });
      toast({ title: "Sesi hemodialisa selesai" });
    },
  });

  return { completeDialysisSession };
}

// ==================== BLOOD BANK INTEGRATION ====================

export function useBloodBankIntegration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const performCrossmatch = useMutation({
    mutationFn: async ({
      requestId,
      patientId,
      bloodBagId,
      majorResult,
      isCompatible,
    }: {
      requestId: string;
      patientId: string;
      bloodBagId: string;
      majorResult: "compatible" | "incompatible" | "pending";
      isCompatible: boolean;
    }) => {
      const validUntil = new Date();
      validUntil.setHours(validUntil.getHours() + 72);

      const result = await postApi("/generic-api", {});

      if (isCompatible) {
        await putApi("/generic-api", {});
      }

      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crossmatch-tests"] });
      queryClient.invalidateQueries({ queryKey: ["blood-inventory"] });
      toast({ title: "Hasil crossmatch dicatat" });
    },
  });

  return { performCrossmatch };
}

// ==================== COMBINED QUERIES ====================

export function useClinicalDashboardStats() {
  return useQuery({
    queryKey: ["clinical-dashboard-stats"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];

      const [
        igdActiveResult,
        inpatientActiveResult,
        icuActiveResult,
        surgeriesTodayResult,
        dialysisTodayResult,
        labPendingResult,
        transfusionPendingResult,
      ] = await Promise.all([
        getApi("/generic-api"),
        getApi("/generic-api"),
        getApi("/generic-api"),
        getApi("/generic-api"),
        getApi("/generic-api"),
        getApi("/generic-api"),
        getApi("/generic-api"),
      ]);

      return {
        igdActive: parseInt(igdActiveResult[0].count),
        inpatientActive: parseInt(inpatientActiveResult[0].count),
        icuActive: parseInt(icuActiveResult[0].count),
        surgeriesToday: parseInt(surgeriesTodayResult[0].count),
        dialysisToday: parseInt(dialysisTodayResult[0].count),
        labPending: parseInt(labPendingResult[0].count),
        transfusionPending: parseInt(transfusionPendingResult[0].count),
      };
    },
  });
}