import { useState, useEffect } from 'react';
import { BpjsPcareIntegration } from '../lib/bpjs-pcare-integration';

interface BpjsPcareHook {
  bpjsClient: BpjsPcareIntegration | null;
  loading: boolean;
  error: string | null;
  initializeClient: (config: any) => void;
  getDiagnosa: (param1: string, param2: string, param3: string) => Promise<any>;
  getDokter: (param1: string, param2: string) => Promise<any>;
  getKunjunganByNoKunjungan: (noKunjungan: string) => Promise<any>;
  getRiwayatKunjungan: (nomorKartu: string) => Promise<any>;
  addKunjungan: (kunjunganData: any) => Promise<any>;
  updateKunjungan: (kunjunganData: any) => Promise<any>;
  deleteKunjungan: (noKunjungan: string) => Promise<any>;
  getKesadaran: () => Promise<any>;
  getClubProlanis: (jenisKelompok: string) => Promise<any>;
  getKegiatanKelompok: (bulan: string) => Promise<any>;
  getPesertaKegiatanKelompok: (eduId: string) => Promise<any>;
  addKegiatanKelompok: (kegiatanData: any) => Promise<any>;
  addPesertaKegiatanKelompok: (pesertaData: any) => Promise<any>;
  deleteKegiatanKelompok: (eduId: string) => Promise<any>;
  deletePesertaKegiatanKelompok: (eduId: string, nomorKartu: string) => Promise<any>;
}

export const useBPJSPcare = (): BpjsPcareHook => {
  const [bpjsClient, setBpjsClient] = useState<BpjsPcareIntegration | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initializeClient = (config: any) => {
    try {
      setError(null);
      const client = new BpjsPcareIntegration(config);
      setBpjsClient(client);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize BPJS client');
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

  // Wrapper functions untuk setiap operasi BPJS
  const getDiagnosa = async (param1: string, param2: string, param3: string) => {
    if (!bpjsClient) {
      throw new Error('BPJS Client not initialized');
    }
    return handleApiCall(() => bpjsClient.getDiagnosa(param1, param2, param3));
  };

  const getDokter = async (param1: string, param2: string) => {
    if (!bpjsClient) {
      throw new Error('BPJS Client not initialized');
    }
    return handleApiCall(() => bpjsClient.getDokter(param1, param2));
  };

  const getKunjunganByNoKunjungan = async (noKunjungan: string) => {
    if (!bpjsClient) {
      throw new Error('BPJS Client not initialized');
    }
    return handleApiCall(() => bpjsClient.getKunjunganByNoKunjungan(noKunjungan));
  };

  const getRiwayatKunjungan = async (nomorKartu: string) => {
    if (!bpjsClient) {
      throw new Error('BPJS Client not initialized');
    }
    return handleApiCall(() => bpjsClient.getRiwayatKunjungan(nomorKartu));
  };

  const addKunjungan = async (kunjunganData: any) => {
    if (!bpjsClient) {
      throw new Error('BPJS Client not initialized');
    }
    return handleApiCall(() => bpjsClient.addKunjungan(kunjunganData));
  };

  const updateKunjungan = async (kunjunganData: any) => {
    if (!bpjsClient) {
      throw new Error('BPJS Client not initialized');
    }
    return handleApiCall(() => bpjsClient.updateKunjungan(kunjunganData));
  };

  const deleteKunjungan = async (noKunjungan: string) => {
    if (!bpjsClient) {
      throw new Error('BPJS Client not initialized');
    }
    return handleApiCall(() => bpjsClient.deleteKunjungan(noKunjungan));
  };

  const getKesadaran = async () => {
    if (!bpjsClient) {
      throw new Error('BPJS Client not initialized');
    }
    return handleApiCall(() => bpjsClient.getKesadaran());
  };

  const getClubProlanis = async (jenisKelompok: string) => {
    if (!bpjsClient) {
      throw new Error('BPJS Client not initialized');
    }
    return handleApiCall(() => bpjsClient.getClubProlanis(jenisKelompok));
  };

  const getKegiatanKelompok = async (bulan: string) => {
    if (!bpjsClient) {
      throw new Error('BPJS Client not initialized');
    }
    return handleApiCall(() => bpjsClient.getKegiatanKelompok(bulan));
  };

  const getPesertaKegiatanKelompok = async (eduId: string) => {
    if (!bpjsClient) {
      throw new Error('BPJS Client not initialized');
    }
    return handleApiCall(() => bpjsClient.getPesertaKegiatanKelompok(eduId));
  };

  const addKegiatanKelompok = async (kegiatanData: any) => {
    if (!bpjsClient) {
      throw new Error('BPJS Client not initialized');
    }
    return handleApiCall(() => bpjsClient.addKegiatanKelompok(kegiatanData));
  };

  const addPesertaKegiatanKelompok = async (pesertaData: any) => {
    if (!bpjsClient) {
      throw new Error('BPJS Client not initialized');
    }
    return handleApiCall(() => bpjsClient.addPesertaKegiatanKelompok(pesertaData));
  };

  const deleteKegiatanKelompok = async (eduId: string) => {
    if (!bpjsClient) {
      throw new Error('BPJS Client not initialized');
    }
    return handleApiCall(() => bpjsClient.deleteKegiatanKelompok(eduId));
  };

  const deletePesertaKegiatanKelompok = async (eduId: string, nomorKartu: string) => {
    if (!bpjsClient) {
      throw new Error('BPJS Client not initialized');
    }
    return handleApiCall(() => bpjsClient.deletePesertaKegiatanKelompok(eduId, nomorKartu));
  };

  return {
    bpjsClient,
    loading,
    error,
    initializeClient,
    getDiagnosa,
    getDokter,
    getKunjunganByNoKunjungan,
    getRiwayatKunjungan,
    addKunjungan,
    updateKunjungan,
    deleteKunjungan,
    getKesadaran,
    getClubProlanis,
    getKegiatanKelompok,
    getPesertaKegiatanKelompok,
    addKegiatanKelompok,
    addPesertaKegiatanKelompok,
    deleteKegiatanKelompok,
    deletePesertaKegiatanKelompok,
  };
};