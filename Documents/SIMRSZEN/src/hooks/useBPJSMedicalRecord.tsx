import { useState } from 'react';
import { 
  BpjsMedicalRecordIntegration, 
  BpjsMedicalRecordConfig,
  InsertMedicalRecordRequest,
  InsertMedicalRecordResponse,
  MedicalRecordResource
} from '../lib/bpjs-medical-record-integration';

interface BpjsMedicalRecordHook {
  medicalRecordClient: BpjsMedicalRecordIntegration | null;
  loading: boolean;
  error: string | null;
  initializeClient: (config: BpjsMedicalRecordConfig) => void;
  insertMedicalRecord: (request: InsertMedicalRecordRequest) => Promise<InsertMedicalRecordResponse>;
  insertCompleteMedicalRecord: (
    noSep: string,
    jnsPelayanan: string,
    bulan: string,
    tahun: string,
    koders: string,
    medicalRecordData: MedicalRecordResource[]
  ) => Promise<InsertMedicalRecordResponse>;
  createCompositionResource: (
    id: string,
    patientReference: string,
    encounterReference: string,
    practitionerReference: string,
    date: string
  ) => MedicalRecordResource;
  createPatientResource: (
    id: string,
    name: string,
    gender: 'male' | 'female',
    birthDate: string,
    address: string
  ) => MedicalRecordResource;
  createEncounterResource: (
    id: string,
    patientReference: string,
    startDate: string,
    endDate: string,
    reason: string
  ) => MedicalRecordResource;
}

export const useBPJSMedicalRecord = (): BpjsMedicalRecordHook => {
  const [medicalRecordClient, setMedicalRecordClient] = useState<BpjsMedicalRecordIntegration | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initializeClient = (config: BpjsMedicalRecordConfig) => {
    try {
      setError(null);
      const client = new BpjsMedicalRecordIntegration(config);
      setMedicalRecordClient(client);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize BPJS Medical Record client');
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

  const insertMedicalRecord = async (request: InsertMedicalRecordRequest) => {
    if (!medicalRecordClient) {
      throw new Error('BPJS Medical Record Client not initialized');
    }
    return handleApiCall(() => medicalRecordClient.insertMedicalRecord(request));
  };

  const insertCompleteMedicalRecord = async (
    noSep: string,
    jnsPelayanan: string,
    bulan: string,
    tahun: string,
    koders: string,
    medicalRecordData: MedicalRecordResource[]
  ) => {
    if (!medicalRecordClient) {
      throw new Error('BPJS Medical Record Client not initialized');
    }
    return handleApiCall(() => 
      medicalRecordClient.insertCompleteMedicalRecord(
        noSep,
        jnsPelayanan,
        bulan,
        tahun,
        koders,
        medicalRecordData
      )
    );
  };

  const createCompositionResource = (
    id: string,
    patientReference: string,
    encounterReference: string,
    practitionerReference: string,
    date: string
  ) => {
    if (!medicalRecordClient) {
      throw new Error('BPJS Medical Record Client not initialized');
    }
    return medicalRecordClient.createCompositionResource(
      id,
      patientReference,
      encounterReference,
      practitionerReference,
      date
    );
  };

  const createPatientResource = (
    id: string,
    name: string,
    gender: 'male' | 'female',
    birthDate: string,
    address: string
  ) => {
    if (!medicalRecordClient) {
      throw new Error('BPJS Medical Record Client not initialized');
    }
    return medicalRecordClient.createPatientResource(
      id,
      name,
      gender,
      birthDate,
      address
    );
  };

  const createEncounterResource = (
    id: string,
    patientReference: string,
    startDate: string,
    endDate: string,
    reason: string
  ) => {
    if (!medicalRecordClient) {
      throw new Error('BPJS Medical Record Client not initialized');
    }
    return medicalRecordClient.createEncounterResource(
      id,
      patientReference,
      startDate,
      endDate,
      reason
    );
  };

  return {
    medicalRecordClient,
    loading,
    error,
    initializeClient,
    insertMedicalRecord,
    insertCompleteMedicalRecord,
    createCompositionResource,
    createPatientResource,
    createEncounterResource,
  };
};