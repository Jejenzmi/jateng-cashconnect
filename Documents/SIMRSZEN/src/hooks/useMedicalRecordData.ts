import { useState, useEffect } from 'react';
import { MedicalRecord } from '@/types/medicalRecord';

interface MedicalRecordDataState {
  medicalRecords: MedicalRecord[];
  filteredRecords: MedicalRecord[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

const useMedicalRecordData = () => {
  const [state, setState] = useState<MedicalRecordDataState>({
    medicalRecords: [],
    filteredRecords: [],
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
        
        const mockRecords: MedicalRecord[] = [
          {
            id: '1',
            patientId: '1',
            patientName: 'Ahmad Fauzi',
            doctorId: 'd1',
            doctorName: 'dr. Budi Santoso',
            registrationId: 'r1',
            registrationDate: '2026-04-19 08:30:00',
            chiefComplaint: 'Sesak napas',
            historyOfPresentIllness: 'Pasien mengeluh sesak napas sejak 2 hari yang lalu...',
            physicalExam: 'TD: 120/80 mmHg, N: 80x/mnt, RR: 20x/mnt, T: 36.5°C',
            diagnosis: 'Bronkhitis akut',
            treatment: 'Diberikan antibiotik dan ekspektoran',
            notes: 'Kontrol 1 minggu kemudian',
            createdAt: '2026-04-19 09:15:00',
            updatedAt: '2026-04-19 09:15:00',
          },
          {
            id: '2',
            patientId: '2',
            patientName: 'Siti Nurhaliza',
            doctorId: 'd2',
            doctorName: 'dr. Sri Lestari',
            registrationId: 'r2',
            registrationDate: '2026-04-19 09:45:00',
            chiefComplaint: 'Nyeri perut bagian kanan bawah',
            historyOfPresentIllness: 'Pasien mengeluh nyeri perut kanan bawah sejak 1 hari yang lalu...',
            physicalExam: 'TD: 110/70 mmHg, N: 85x/mnt, RR: 22x/mnt, T: 37.2°C',
            diagnosis: 'Apendisitis akut',
            treatment: 'Dirujuk ke bedah untuk evaluasi lebih lanjut',
            notes: 'Perlu tindakan segera',
            createdAt: '2026-04-19 10:30:00',
            updatedAt: '2026-04-19 10:30:00',
          },
          {
            id: '3',
            patientId: '3',
            patientName: 'Budi Santoso',
            doctorId: 'd1',
            doctorName: 'dr. Budi Santoso',
            registrationId: 'r3',
            registrationDate: '2026-04-18 14:30:00',
            chiefComplaint: 'Demam dan batuk',
            historyOfPresentIllness: 'Pasien mengeluh demam dan batuk sejak 3 hari yang lalu...',
            physicalExam: 'TD: 115/75 mmHg, N: 88x/mnt, RR: 20x/mnt, T: 37.8°C',
            diagnosis: 'Infeksi saluran pernapasan atas',
            treatment: 'Diberikan obat penurun panas dan ekspektoran',
            notes: 'Kontrol bila gejala tidak membaik',
            createdAt: '2026-04-18 15:00:00',
            updatedAt: '2026-04-18 15:00:00',
          },
        ];
        
        setState(prev => ({
          ...prev,
          medicalRecords: mockRecords,
          filteredRecords: mockRecords,
          loading: false,
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Gagal memuat data rekam medis',
        }));
      }
    };

    fetchData();
  }, []);

  const setSearchTerm = (term: string) => {
    setState(prev => ({
      ...prev,
      searchTerm: term,
      filteredRecords: prev.medicalRecords.filter(record =>
        record.patientName.toLowerCase().includes(term.toLowerCase()) ||
        record.chiefComplaint.toLowerCase().includes(term.toLowerCase()) ||
        record.diagnosis.toLowerCase().includes(term.toLowerCase()) ||
        record.doctorName.toLowerCase().includes(term.toLowerCase())
      ),
    }));
  };

  const refreshData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulasi refresh data dari API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockRecords: MedicalRecord[] = [
        {
          id: '1',
          patientId: '1',
          patientName: 'Ahmad Fauzi',
          doctorId: 'd1',
          doctorName: 'dr. Budi Santoso',
          registrationId: 'r1',
          registrationDate: '2026-04-19 08:30:00',
          chiefComplaint: 'Sesak napas',
          historyOfPresentIllness: 'Pasien mengeluh sesak napas sejak 2 hari yang lalu...',
          physicalExam: 'TD: 120/80 mmHg, N: 80x/mnt, RR: 20x/mnt, T: 36.5°C',
          diagnosis: 'Bronkhitis akut',
          treatment: 'Diberikan antibiotik dan ekspektoran',
          notes: 'Kontrol 1 minggu kemudian',
          createdAt: '2026-04-19 09:15:00',
          updatedAt: '2026-04-19 09:15:00',
        },
        {
          id: '2',
          patientId: '2',
          patientName: 'Siti Nurhaliza',
          doctorId: 'd2',
          doctorName: 'dr. Sri Lestari',
          registrationId: 'r2',
          registrationDate: '2026-04-19 09:45:00',
          chiefComplaint: 'Nyeri perut bagian kanan bawah',
          historyOfPresentIllness: 'Pasien mengeluh nyeri perut kanan bawah sejak 1 hari yang lalu...',
          physicalExam: 'TD: 110/70 mmHg, N: 85x/mnt, RR: 22x/mnt, T: 37.2°C',
          diagnosis: 'Apendisitis akut',
          treatment: 'Dirujuk ke bedah untuk evaluasi lebih lanjut',
          notes: 'Perlu tindakan segera',
          createdAt: '2026-04-19 10:30:00',
          updatedAt: '2026-04-19 10:30:00',
        },
        {
          id: '3',
          patientId: '3',
          patientName: 'Budi Santoso',
          doctorId: 'd1',
          doctorName: 'dr. Budi Santoso',
          registrationId: 'r3',
          registrationDate: '2026-04-18 14:30:00',
          chiefComplaint: 'Demam dan batuk',
          historyOfPresentIllness: 'Pasien mengeluh demam dan batuk sejak 3 hari yang lalu...',
          physicalExam: 'TD: 115/75 mmHg, N: 88x/mnt, RR: 20x/mnt, T: 37.8°C',
          diagnosis: 'Infeksi saluran pernapasan atas',
          treatment: 'Diberikan obat penurun panas dan ekspektoran',
          notes: 'Kontrol bila gejala tidak membaik',
          createdAt: '2026-04-18 15:00:00',
          updatedAt: '2026-04-18 15:00:00',
        },
      ];
      
      setState(prev => ({
        ...prev,
        medicalRecords: mockRecords,
        filteredRecords: prev.searchTerm 
          ? mockRecords.filter(record =>
              record.patientName.toLowerCase().includes(prev.searchTerm.toLowerCase()) ||
              record.chiefComplaint.toLowerCase().includes(prev.searchTerm.toLowerCase()) ||
              record.diagnosis.toLowerCase().includes(prev.searchTerm.toLowerCase()) ||
              record.doctorName.toLowerCase().includes(prev.searchTerm.toLowerCase())
            )
          : mockRecords,
        loading: false,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Gagal memuat ulang data rekam medis',
      }));
    }
  };

  return {
    ...state,
    setSearchTerm,
    refreshData,
  };
};

export default useMedicalRecordData;