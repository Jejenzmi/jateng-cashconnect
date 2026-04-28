import { useState, useEffect } from 'react';
import { Registration } from '@/types/registration';

interface RegistrationDataState {
  registrations: Registration[];
  filteredRegistrations: Registration[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

const useRegistrationData = () => {
  const [state, setState] = useState<RegistrationDataState>({
    registrations: [],
    filteredRegistrations: [],
    loading: true,
    error: null,
    searchTerm: '',
  });

  // Mock data - dalam implementasi nyata ini akan dipanggil dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulasi delay API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockRegistrations: Registration[] = [
          {
            id: '1',
            patientId: '1',
            patientName: 'Ahmad Fauzi',
            registrationDate: '2026-04-19 08:30:00',
            serviceType: 'rawat_jalan',
            department: 'poli-internal',
            doctor: 'dr. Budi Santoso',
            status: 'periksa',
            queueNumber: 'A-001',
            notes: 'Kontrol hipertensi',
          },
          {
            id: '2',
            patientId: '2',
            patientName: 'Siti Nurhaliza',
            registrationDate: '2026-04-19 09:15:00',
            serviceType: 'rawat_jalan',
            department: 'poli-kandungan',
            doctor: 'dr. Sri Lestari',
            status: 'daftar',
            queueNumber: 'B-002',
            notes: 'Pemeriksaan rutin trimester 2',
          },
          {
            id: '3',
            patientId: '3',
            patientName: 'Budi Santoso',
            registrationDate: '2026-04-18 14:20:00',
            serviceType: 'gawat_darurat',
            department: 'igd',
            doctor: 'dr. Andi Pratama',
            status: 'selesai',
            queueNumber: 'C-001',
            notes: 'Kecelakaan lalu lintas minor',
          },
        ];
        
        setState(prev => ({
          ...prev,
          registrations: mockRegistrations,
          filteredRegistrations: mockRegistrations,
          loading: false,
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Gagal memuat data registrasi',
        }));
      }
    };

    fetchData();
  }, []);

  const setSearchTerm = (term: string) => {
    setState(prev => ({
      ...prev,
      searchTerm: term,
      filteredRegistrations: prev.registrations.filter(registration =>
        registration.patientName.toLowerCase().includes(term.toLowerCase()) ||
        registration.queueNumber.toLowerCase().includes(term.toLowerCase()) ||
        registration.doctor.toLowerCase().includes(term.toLowerCase())
      ),
    }));
  };

  const refreshData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulasi refresh data dari API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockRegistrations: Registration[] = [
        {
          id: '1',
          patientId: '1',
          patientName: 'Ahmad Fauzi',
          registrationDate: '2026-04-19 08:30:00',
          serviceType: 'rawat_jalan',
          department: 'poli-internal',
          doctor: 'dr. Budi Santoso',
          status: 'periksa',
          queueNumber: 'A-001',
          notes: 'Kontrol hipertensi',
        },
        {
          id: '2',
          patientId: '2',
          patientName: 'Siti Nurhaliza',
          registrationDate: '2026-04-19 09:15:00',
          serviceType: 'rawat_jalan',
          department: 'poli-kandungan',
          doctor: 'dr. Sri Lestari',
          status: 'daftar',
          queueNumber: 'B-002',
          notes: 'Pemeriksaan rutin trimester 2',
        },
        {
          id: '3',
          patientId: '3',
          patientName: 'Budi Santoso',
          registrationDate: '2026-04-18 14:20:00',
          serviceType: 'gawat_darurat',
          department: 'igd',
          doctor: 'dr. Andi Pratama',
          status: 'selesai',
          queueNumber: 'C-001',
          notes: 'Kecelakaan lalu lintas minor',
        },
      ];
      
      setState(prev => ({
        ...prev,
        registrations: mockRegistrations,
        filteredRegistrations: prev.searchTerm 
          ? mockRegistrations.filter(registration =>
              registration.patientName.toLowerCase().includes(prev.searchTerm.toLowerCase()) ||
              registration.queueNumber.toLowerCase().includes(prev.searchTerm.toLowerCase()) ||
              registration.doctor.toLowerCase().includes(prev.searchTerm.toLowerCase())
            )
          : mockRegistrations,
        loading: false,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Gagal memuat ulang data registrasi',
      }));
    }
  };

  return {
    ...state,
    setSearchTerm,
    refreshData,
  };
};

export default useRegistrationData;