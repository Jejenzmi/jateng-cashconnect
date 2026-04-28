import { useState } from 'react';
import { 
  BpjsAntreanFktpIntegration, 
  BpjsAntreanFktpConfig,
  RefPoliResponse,
  RefDokterResponse,
  TambahAntreanRequest,
  UpdateStatusAntreanRequest,
  BatalAntreanRequest
} from '../lib/bpjs-antrean-fktp-integration';

interface BpjsAntreanFKTPHook {
  antreanFktpClient: BpjsAntreanFktpIntegration | null;
  loading: boolean;
  error: string | null;
  initializeClient: (config: BpjsAntreanFktpConfig) => void;
  getRefPoli: (tanggal: string) => Promise<RefPoliResponse>;
  getRefDokter: (kodePoli: string, tanggal: string) => Promise<RefDokterResponse>;
  tambahAntrean: (request: TambahAntreanRequest) => Promise<any>;
  updateStatusAntrean: (request: UpdateStatusAntreanRequest) => Promise<any>;
  batalAntrean: (request: BatalAntreanRequest) => Promise<any>;
}

export const useBPJSAntreanFKTP = (): BpjsAntreanFKTPHook => {
  const [antreanFktpClient, setAntreanFktpClient] = useState<BpjsAntreanFktpIntegration | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initializeClient = (config: BpjsAntreanFktpConfig) => {
    try {
      setError(null);
      const client = new BpjsAntreanFktpIntegration(config);
      setAntreanFktpClient(client);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize BPJS Antrean FKTP client');
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

  const getRefPoli = async (tanggal: string) => {
    if (!antreanFktpClient) {
      throw new Error('BPJS Antrean FKTP Client not initialized');
    }
    return handleApiCall(() => antreanFktpClient.getRefPoli(tanggal));
  };

  const getRefDokter = async (kodePoli: string, tanggal: string) => {
    if (!antreanFktpClient) {
      throw new Error('BPJS Antrean FKTP Client not initialized');
    }
    return handleApiCall(() => antreanFktpClient.getRefDokter(kodePoli, tanggal));
  };

  const tambahAntrean = async (request: TambahAntreanRequest) => {
    if (!antreanFktpClient) {
      throw new Error('BPJS Antrean FKTP Client not initialized');
    }
    return handleApiCall(() => antreanFktpClient.tambahAntrean(request));
  };

  const updateStatusAntrean = async (request: UpdateStatusAntreanRequest) => {
    if (!antreanFktpClient) {
      throw new Error('BPJS Antrean FKTP Client not initialized');
    }
    return handleApiCall(() => antreanFktpClient.updateStatusAntrean(request));
  };

  const batalAntrean = async (request: BatalAntreanRequest) => {
    if (!antreanFktpClient) {
      throw new Error('BPJS Antrean FKTP Client not initialized');
    }
    return handleApiCall(() => antreanFktpClient.batalAntrean(request));
  };

  return {
    antreanFktpClient,
    loading,
    error,
    initializeClient,
    getRefPoli,
    getRefDokter,
    tambahAntrean,
    updateStatusAntrean,
    batalAntrean,
  };
};