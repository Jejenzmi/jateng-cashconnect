import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getApi } from "@/utils/api";

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  visitId: string;
  subjectif: string;
  objektif: string;
  asesmen: string;
  planning: string;
  tanggal: string;
  createdAt: string;
  updatedAt: string;
  patients?: {
    full_name?: string;
    medical_record_number?: string;
  };
  dokter?: {
    nama: string;
  };
  visit?: {
    visitId: string;
    tanggalPeriksa: string;
  };
}

interface MedicalRecordStat {
  totalRecords: number;
  todayRecords: number;
  activeDoctors: number;
  icdCompliance: number;
}

interface ICDCode {
  kode: string;
  nama: string;
}

// Hook untuk mendapatkan daftar rekam medis
export const useMedicalRecords = () => {
  return useQuery<MedicalRecord[]>({
    queryKey: ["medicalRecords"],
    queryFn: async () => {
      try {
        const response = await getApi("/medical-records");
        return response || [];
      } catch (error) {
        console.error("Error fetching medical records:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};

// Hook untuk mendapatkan statistik rekam medis
export const useMedicalRecordStats = () => {
  return useQuery<MedicalRecordStat>({
    queryKey: ["medicalRecordStats"],
    queryFn: async () => {
      try {
        const response = await getApi("/medical-records/stats");
        return response || { totalRecords: 0, todayRecords: 0, activeDoctors: 0, icdCompliance: 0 };
      } catch (error) {
        console.error("Error fetching medical record stats:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 10, // 10 menit
  });
};

// Hook untuk mencari kode ICD-10
export const useICD10Codes = (searchTerm: string) => {
  return useQuery<ICDCode[]>({
    queryKey: ["icd10Codes", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      
      try {
        const response = await getApi(`/icd10?search=${encodeURIComponent(searchTerm)}`);
        return response || [];
      } catch (error) {
        console.error("Error fetching ICD-10 codes:", error);
        // Return data dummy sebagai fallback
        return [
          { kode: "A00", nama: "Kolera" },
          { kode: "A01", nama: "Tipes dan paratifus" },
          { kode: "I20", nama: "Angina pektoris" },
          { kode: "I21", nama: "Infark miokard akut" },
          { kode: "J44", nama: "Penyakit paru obstruktif kronik" },
          { kode: "E11", nama: "Diabetes mellitus tipe 2" },
          { kode: "F32", nama: "Gangguan depresi" },
        ];
      }
    },
    enabled: !!searchTerm,
    staleTime: 1000 * 60 * 30, // 30 menit
  });
};