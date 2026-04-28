import { useState, useEffect } from 'react';
import { Patient } from '@/types/patient';

interface PatientDataState {
  patients: Patient[];
  filteredPatients: Patient[];
  loading: boolean;
  loadingCount: number;
  error: string | null;
  searchTerm: string;
}

const usePatientData = () => {
  const [state, setState] = useState<PatientDataState>({
    patients: [],
    filteredPatients: [],
    loading: true,
    loadingCount: 0,
    error: null,
    searchTerm: '',
  });

  // Mock data - dalam implementasi nyata ini akan dipanggil dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Increase loading count
        setState(prev => ({ ...prev, loading: true, loadingCount: prev.loadingCount + 1 }));
        
        // Simulasi delay API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockPatients: Patient[] = [
          {
            id: '1',
            medicalRecordNo: 'MR-1234567890',
            fullName: 'Ahmad Fauzi',
            nik: '1234567890123456',
            birthDate: '1990-01-01',
            gender: 'L',
            phone: '+6281234567890',
            address: 'Jl. Contoh No. 123, Jakarta',
            bpjsNumber: '0001234567890',
            bloodType: 'A+',
            allergies: 'Penicillin',
            registrationDate: '2023-01-15',
          },
          {
            id: '2',
            medicalRecordNo: 'MR-1234567891',
            fullName: 'Siti Nurhaliza',
            nik: '1234567890123457',
            birthDate: '1985-05-20',
            gender: 'P',
            phone: '+6281234567891',
            address: 'Jl. Contoh No. 124, Jakarta',
            bpjsNumber: '0001234567891',
            bloodType: 'B+',
            allergies: '-',
            registrationDate: '2023-01-16',
          },
          {
            id: '3',
            medicalRecordNo: 'MR-1234567892',
            fullName: 'Budi Santoso',
            nik: '1234567890123458',
            birthDate: '1978-11-10',
            gender: 'L',
            phone: '+6281234567892',
            address: 'Jl. Contoh No. 125, Jakarta',
            bpjsNumber: '0001234567892',
            bloodType: 'O+',
            allergies: 'Sulfa',
            registrationDate: '2023-01-17',
          },
        ];
        
        // Only update data if the component is still mounted
        setState(prev => {
          // Decrease loading count and update data
          const nextLoadingCount = prev.loadingCount - 1;
          
          return {
            ...prev,
            patients: mockPatients,
            filteredPatients: mockPatients,
            loadingCount: nextLoadingCount,
            loading: nextLoadingCount > 0,
          };
        });
      } catch (err) {
        // Handle error
        setState(prev => {
          // Decrease loading count and set error
          const nextLoadingCount = prev.loadingCount - 1;
          
          return {
            ...prev,
            loadingCount: nextLoadingCount,
            loading: nextLoadingCount > 0,
            error: 'Gagal memuat data pasien: ' + (err instanceof Error ? err.message : 'Unknown error'),
          };
        });
      }
    };

    fetchData();
  }, []);

  const setSearchTerm = (term: string) => {
    setState(prev => ({
      ...prev,
      searchTerm: term,
      filteredPatients: prev.patients.filter(patient =>
        patient.fullName.toLowerCase().includes(term.toLowerCase()) ||
        patient.medicalRecordNo.toLowerCase().includes(term.toLowerCase()) ||
        patient.nik.toLowerCase().includes(term.toLowerCase()) ||
        patient.bpjsNumber.toLowerCase().includes(term.toLowerCase())
      ),
    }));
  };

  const refreshData = async () => {
    // Increase loading count
    setState(prev => ({ ...prev, loading: true, loadingCount: prev.loadingCount + 1, error: null }));
    
    try {
      // Simulasi refresh data dari API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockPatients: Patient[] = [
        {
          id: '1',
          medicalRecordNo: 'MR-1234567890',
          fullName: 'Ahmad Fauzi',
          nik: '1234567890123456',
          birthDate: '1990-01-01',
          gender: 'L',
          phone: '+6281234567890',
          address: 'Jl. Contoh No. 123, Jakarta',
          bpjsNumber: '0001234567890',
          bloodType: 'A+',
          allergies: 'Penicillin',
          registrationDate: '2023-01-15',
        },
        {
          id: '2',
          medicalRecordNo: 'MR-1234567891',
          fullName: 'Siti Nurhaliza',
          nik: '1234567890123457',
          birthDate: '1985-05-20',
          gender: 'P',
          phone: '+6281234567891',
          address: 'Jl. Contoh No. 124, Jakarta',
          bpjsNumber: '0001234567891',
          bloodType: 'B+',
          allergies: '-',
          registrationDate: '2023-01-16',
        },
        {
          id: '3',
          medicalRecordNo: 'MR-1234567892',
          fullName: 'Budi Santoso',
          nik: '1234567890123458',
          birthDate: '1978-11-10',
          gender: 'L',
          phone: '+6281234567892',
          address: 'Jl. Contoh No. 125, Jakarta',
          bpjsNumber: '0001234567892',
          bloodType: 'O+',
          allergies: 'Sulfa',
          registrationDate: '2023-01-17',
        },
        // Tambahkan data baru jika ada
      ];
      
      // Only update data if the component is still mounted
      setState(prev => {
        // Decrease loading count and update data
        const nextLoadingCount = prev.loadingCount - 1;
        
        return {
          ...prev,
          patients: mockPatients,
          filteredPatients: prev.searchTerm 
            ? mockPatients.filter(patient =>
                patient.fullName.toLowerCase().includes(prev.searchTerm.toLowerCase()) ||
                patient.medicalRecordNo.toLowerCase().includes(prev.searchTerm.toLowerCase()) ||
                patient.nik.toLowerCase().includes(prev.searchTerm.toLowerCase()) ||
                patient.bpjsNumber.toLowerCase().includes(prev.searchTerm.toLowerCase())
              )
            : mockPatients,
          loadingCount: nextLoadingCount,
          loading: nextLoadingCount > 0,
        };
      });
    } catch (err) {
      // Handle error
      setState(prev => {
        // Decrease loading count and set error
        const nextLoadingCount = prev.loadingCount - 1;
        
        return {
          ...prev,
          loadingCount: nextLoadingCount,
          loading: nextLoadingCount > 0,
          error: 'Gagal memuat ulang data pasien: ' + (err instanceof Error ? err.message : 'Unknown error'),
        };
      });
    }
  };

  return {
    ...state,
    setSearchTerm,
    refreshData,
  };
};

export default usePatientData;