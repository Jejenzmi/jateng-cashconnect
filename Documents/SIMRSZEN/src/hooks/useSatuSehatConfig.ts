import { useState } from 'react';

export interface SatuSehatConfig {
  clientId: string;
  clientSecret: string;
  organizationId: string;
  baseUrl: string;
  isActive: boolean;
}

export function useSatuSehatConfig() {
  const [config, setConfig] = useState<SatuSehatConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const saveConfig = async (_cfg: SatuSehatConfig) => {
    setIsSaving(true);
    setIsSaving(false);
  };

  return { config, setConfig, isLoading, isSaving, saveConfig };
}
