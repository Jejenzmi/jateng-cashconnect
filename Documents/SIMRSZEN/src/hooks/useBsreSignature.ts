import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { ElectronicSignatureService } from "@/services/ElectronicSignatureService";

export function useBsreSignature(hospitalId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get BSRE configuration
  const { data: bsreConfig, isLoading: isConfigLoading } = useQuery({
    queryKey: ["bsre-config", hospitalId],
    queryFn: async () => {
      if (!hospitalId) return null;
      return await ElectronicSignatureService.getConfig(hospitalId);
    },
    enabled: !!hospitalId,
  });

  // Get BSRE status
  const { data: isBsreEnabled, isLoading: isStatusLoading } = useQuery({
    queryKey: ["bsre-status", hospitalId],
    queryFn: async () => {
      if (!hospitalId) return false;
      return await ElectronicSignatureService.getBsreStatus(hospitalId);
    },
    enabled: !!hospitalId,
  });

  // Toggle BSRE feature
  const toggleBsreFeature = useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!hospitalId) throw new Error("Hospital ID is required");
      return await ElectronicSignatureService.toggleBsreFeature(hospitalId, enabled);
    },
    onSuccess: (_, enabled) => {
      queryClient.invalidateQueries({ queryKey: ["bsre-status", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["bsre-config", hospitalId] });
      
      toast({
        title: `Fitur TTE ${enabled ? 'diaktifkan' : 'dinonaktifkan'}`,
        description: `Tanda Tangan Elektronik BSRE telah ${enabled ? 'diaktifkan' : 'dinonaktifkan'}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal mengubah status fitur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update BSRE configuration
  const updateBsreConfig = useMutation({
    mutationFn: async (config: {
      api_endpoint?: string;
      api_key?: string;
      enable_verification?: boolean;
      default_position?: { x: number; y: number; page: number };
    }) => {
      if (!hospitalId) throw new Error("Hospital ID is required");
      return await ElectronicSignatureService.updateConfig(
        hospitalId,
        config,
        isBsreEnabled || false
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bsre-config", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["bsre-status", hospitalId] });
      
      toast({
        title: "Konfigurasi berhasil disimpan",
        description: "Pengaturan tanda tangan elektronik BSRE telah diperbarui.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal menyimpan konfigurasi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Initiate document signing process (without storing passphrase)
  const initiateSigningProcess = useMutation({
    mutationFn: async ({
      documentData,
      documentName,
      signerNik,
      passphrase
    }: {
      documentData: Buffer;
      documentName: string;
      signerNik: string;
      passphrase: string;  // Passphrase is only used for this session, not stored
    }) => {
      return await ElectronicSignatureService.initiateSigningProcess(
        documentData,
        documentName,
        signerNik,
        passphrase
      );
    },
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "Proses penandatanganan dimulai",
          description: result.message,
        });
      } else {
        toast({
          title: "Gagal memulai penandatanganan",
          description: result.message || "Terjadi kesalahan saat memulai proses penandatanganan",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal memulai penandatanganan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    bsreConfig,
    isBsreEnabled,
    isConfigLoading,
    isStatusLoading,
    toggleBsreFeature: toggleBsreFeature.mutate,
    updateBsreConfig: updateBsreConfig.mutate,
    initiateSigningProcess: initiateSigningProcess.mutate,
    isToggling: toggleBsreFeature.isPending,
    isUpdatingConfig: updateBsreConfig.isPending,
    isInitiatingSigning: initiateSigningProcess.isPending,
  };
}