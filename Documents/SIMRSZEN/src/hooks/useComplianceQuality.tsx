import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// Accreditation Hooks
export function useAccreditationStandards() {
  return useQuery({
    queryKey: ["accreditation-standards"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

export function useAccreditationElements(standardId?: string) {
  return useQuery({
    queryKey: ["accreditation-elements", standardId],
    queryFn: async () => {
      let sql = getApi("/generic-api");
      
      if (standardId) {
        sql = getApi("/generic-api");
      }
      
      const data = await sql;
      return data;
    },
  });
}

export function useAccreditationAssessments() {
  return useQuery({
    queryKey: ["accreditation-assessments"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

// Quality Indicator Hooks
export function useQualityIndicators() {
  return useQuery({
    queryKey: ["quality-indicators"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

export function useQualityMeasurements(indicatorId?: string) {
  return useQuery({
    queryKey: ["quality-measurements", indicatorId],
    queryFn: async () => {
      let sql = getApi("/generic-api");
      
      if (indicatorId) {
        sql = getApi("/generic-api");
      }
      
      const data = await sql;
      return data;
    },
  });
}

export function useQualityImprovementActions() {
  return useQuery({
    queryKey: ["quality-improvement-actions"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

// Safety Incident Hooks
export function useSafetyIncidents() {
  return useQuery({
    queryKey: ["safety-incidents"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

// Consent Hooks
export function useConsentTemplates() {
  return useQuery({
    queryKey: ["consent-templates"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

export function usePatientConsents(patientId?: string) {
  return useQuery({
    queryKey: ["patient-consents", patientId],
    queryFn: async () => {
      let sql = getApi("/generic-api");
      
      if (patientId) {
        sql = getApi("/generic-api");
      }
      
      const data = await sql;
      return data;
    },
  });
}

// INA-DRG Hooks
export function useINADRGCodes() {
  return useQuery({
    queryKey: ["inadrg-codes"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

export function useDiagnosisDRGMapping() {
  return useQuery({
    queryKey: ["diagnosis-drg-mapping"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

// Insurance Provider Hooks
export function useInsuranceProviders() {
  return useQuery({
    queryKey: ["insurance-providers"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}