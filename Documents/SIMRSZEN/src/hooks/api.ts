import { useQuery, UseQueryOptions } from '@tanstack/react-query';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Generic API utility
export const apiRequest = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};

// Hook untuk mengambil data billing
export const useBillings = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['billings'],
    queryFn: () => apiRequest('/billings'),
    ...options,
  });
};

// Hook untuk mengambil data academic activities
export const useAcademicActivities = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['academic-activities'],
    queryFn: () => apiRequest('/academic-activities'),
    ...options,
  });
};

// Hook untuk mengambil data clinical rotations
export const useClinicalRotations = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['clinical-rotations'],
    queryFn: () => apiRequest('/clinical-rotations'),
    ...options,
  });
};

// Hook untuk mengambil data education programs
export const useEducationPrograms = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['education-programs'],
    queryFn: () => apiRequest('/education-programs'),
    ...options,
  });
};

// Hook untuk mengambil data medical trainees
export const useMedicalTrainees = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['medical-trainees'],
    queryFn: () => apiRequest('/medical-trainees'),
    ...options,
  });
};

// Hook untuk mengambil data research projects
export const useResearchProjects = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['research-projects'],
    queryFn: () => apiRequest('/research-projects'),
    ...options,
  });
};

// Hook untuk mengambil data doctors
export const useDoctors = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: () => apiRequest('/doctors'),
    ...options,
  });
};

// Hook untuk mengambil data departments
export const useDepartments = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: () => apiRequest('/departments'),
    ...options,
  });
};

// Tambahkan hook lain sesuai kebutuhan