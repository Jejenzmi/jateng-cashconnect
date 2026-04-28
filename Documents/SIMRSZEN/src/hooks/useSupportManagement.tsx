import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// CSSD Hooks
export function useSterilizationItems() {
  return useQuery({
    queryKey: ["sterilization-items"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

export function useSterilizationBatches() {
  return useQuery({
    queryKey: ["sterilization-batches"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

// Linen/Laundry Hooks
export function useLinenInventory() {
  return useQuery({
    queryKey: ["linen-inventory"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

export function useLaundryBatches() {
  return useQuery({
    queryKey: ["laundry-batches"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

// Maintenance Hooks
export function useMaintenanceAssets() {
  return useQuery({
    queryKey: ["maintenance-assets"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

export function useMaintenanceRequests() {
  return useQuery({
    queryKey: ["maintenance-requests"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

// Waste Management Hooks
export function useWasteCategories() {
  return useQuery({
    queryKey: ["waste-categories"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

export function useWasteCollections() {
  return useQuery({
    queryKey: ["waste-collections"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

export function useWasteDisposals() {
  return useQuery({
    queryKey: ["waste-disposals"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

// Vendor Hooks
export function useVendors() {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

export function useVendorContracts() {
  return useQuery({
    queryKey: ["vendor-contracts"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}

export function useVendorEvaluations() {
  return useQuery({
    queryKey: ["vendor-evaluations"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data;
    },
  });
}