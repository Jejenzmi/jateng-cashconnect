import { useState } from 'react';
import { 
  BpjsIcareIntegration, 
  BpjsIcareConfig,
  IcareValidateResponse
} from '../lib/bpjs-icare-integration';

interface BpjsIcareHook {
  icareClient: BpjsIcareIntegration | null;
  loading: boolean;
  error: string | null;
  initializeClient: (config: BpjsIcareConfig) => void;
  validateFkrtl: (nomorKartu: string, kodeDokter: number) => Promise<IcareValidateResponse>;
  validateFktp: (nomorKartu: string) => Promise<IcareValidateResponse>;
  getFkrtlHistoryUrl: (nomorKartu: string, kodeDokter: number) => Promise<string>;
  getFktpHistoryUrl: (nomorKartu: string) => Promise<string>;
}

export const useBPJSiCare = (): BpjsIcareHook => {
  const [icareClient, setIcareClient] = useState<BpjsIcareIntegration | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initializeClient = (config: BpjsIcareConfig) => {
    try {
      setError(null);
      const client = new BpjsIcareIntegration(config);
      setIcareClient(client);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize BPJS iCare client');
    }
  };

  const handleApiCall = async (apiCall: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateFkrtl = async (nomorKartu: string, kodeDokter: number) => {
    if (!icareClient) {
      throw new Error('BPJS iCare Client not initialized');
    }
    return handleApiCall(() => icareClient.validateFkrtl(nomorKartu, kodeDokter));
  };

  const validateFktp = async (nomorKartu: string) => {
    if (!icareClient) {
      throw new Error('BPJS iCare Client not initialized');
    }
    return handleApiCall(() => icareClient.validateFktp(nomorKartu));
  };

  const getFkrtlHistoryUrl = async (nomorKartu: string, kodeDokter: number) => {
    if (!icareClient) {
      throw new Error('BPJS iCare Client not initialized');
    }
    return handleApiCall(() => icareClient.getFkrtlHistoryUrl(nomorKartu, kodeDokter));
  };

  const getFktpHistoryUrl = async (nomorKartu: string) => {
    if (!icareClient) {
      throw new Error('BPJS iCare Client not initialized');
    }
    return handleApiCall(() => icareClient.getFktpHistoryUrl(nomorKartu));
  };

  return {
    icareClient,
    loading,
    error,
    initializeClient,
    validateFkrtl,
    validateFktp,
    getFkrtlHistoryUrl,
    getFktpHistoryUrl,
  };
};