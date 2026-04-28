import { useState, useEffect } from 'react';
import { Faskes, FaskesType } from '@/types/faskes';

interface FaskesDataState {
  faskesTypes: FaskesType[];
  faskes: Faskes[];
  filteredFaskes: Faskes[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

const useFaskesData = () => {
  const [state, setState] = useState<FaskesDataState>({
    faskesTypes: [],
    faskes: [],
    filteredFaskes: [],
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
        
        const mockFaskesTypes: FaskesType[] = [
          {
            id: '1',
            name: 'Rumah Sakit Umum',
            description: 'Rumah sakit yang melayani berbagai bidang medis',
            level: 'tersier',
            category: 'rumah_sakit',
            isActive: true,
          },
          {
            id: '2',
            name: 'Rumah Sakit Khusus',
            description: 'Rumah sakit yang fokus pada bidang medis tertentu',
            level: 'tersier',
            category: 'rumah_sakit',
            isActive: true,
          },
          {
            id: '3',
            name: 'Puskesmas',
            description: 'Pusat Kesehatan Masyarakat',
            level: 'primer',
            category: 'puskesmas',
            isActive: true,
          },
          {
            id: '4',
            name: 'Klinik Pratama',
            description: 'Klinik swasta tingkat dasar',
            level: 'primer',
            category: 'klinik',
            isActive: true,
          },
          {
            id: '5',
            name: 'Klinik Pratama Mandiri',
            description: 'Klinik swasta yang beroperasi mandiri',
            level: 'primer',
            category: 'klinik',
            isActive: true,
          },
          {
            id: '6',
            name: 'Laboratorium Kesehatan',
            description: 'Fasilitas pemeriksaan laboratorium',
            level: 'sekunder',
            category: 'laboratorium',
            isActive: true,
          },
        ];
        
        const mockFaskes: Faskes[] = [
          {
            id: '1',
            name: 'Rumah Sakit Sehat Sentosa',
            type: 'Rumah Sakit Umum',
            address: 'Jl. Kesehatan No. 123',
            city: 'Jakarta',
            province: 'DKI Jakarta',
            phone: '+622112345678',
            email: 'info@rs-sehatsentosa.co.id',
            licenseNumber: '503/RS/2020',
            operationalSince: '2020-01-15',
            capacity: 200,
            director: 'Dr. Ahmad Hidayat',
            isActive: true,
          },
          {
            id: '2',
            name: 'Puskesmas Mekar Jaya',
            type: 'Puskesmas',
            address: 'Jl. Mawar Raya No. 45',
            city: 'Bandung',
            province: 'Jawa Barat',
            phone: '+622287654321',
            email: 'puskesmas@mekarjaya.id',
            licenseNumber: '440/PK/2019',
            operationalSince: '2019-05-20',
            capacity: 50,
            director: 'Ns. Siti Rahayu',
            isActive: true,
          },
          {
            id: '3',
            name: 'Klinik Pratama Medika',
            type: 'Klinik Pratama',
            address: 'Jl. Diponegoro No. 78',
            city: 'Surabaya',
            province: 'Jawa Timur',
            phone: '+623198765432',
            email: 'info@klinikmedika.id',
            licenseNumber: '357/KLN/2021',
            operationalSince: '2021-03-10',
            capacity: 20,
            director: 'Dr. Budi Santoso',
            isActive: true,
          },
        ];
        
        setState(prev => ({
          ...prev,
          faskesTypes: mockFaskesTypes,
          faskes: mockFaskes,
          filteredFaskes: mockFaskes,
          loading: false,
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Gagal memuat data faskes',
        }));
      }
    };

    fetchData();
  }, []);

  const setSearchTerm = (term: string) => {
    setState(prev => ({
      ...prev,
      searchTerm: term,
      filteredFaskes: prev.faskes.filter(faskes =>
        faskes.name.toLowerCase().includes(term.toLowerCase()) ||
        faskes.licenseNumber.toLowerCase().includes(term.toLowerCase()) ||
        faskes.director.toLowerCase().includes(term.toLowerCase())
      ),
    }));
  };

  const refreshData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulasi refresh data dari API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockFaskes: Faskes[] = [
        {
          id: '1',
          name: 'Rumah Sakit Sehat Sentosa',
          type: 'Rumah Sakit Umum',
          address: 'Jl. Kesehatan No. 123',
          city: 'Jakarta',
          province: 'DKI Jakarta',
          phone: '+622112345678',
          email: 'info@rs-sehatsentosa.co.id',
          licenseNumber: '503/RS/2020',
          operationalSince: '2020-01-15',
          capacity: 200,
          director: 'Dr. Ahmad Hidayat',
          isActive: true,
        },
        {
          id: '2',
          name: 'Puskesmas Mekar Jaya',
          type: 'Puskesmas',
          address: 'Jl. Mawar Raya No. 45',
          city: 'Bandung',
          province: 'Jawa Barat',
          phone: '+622287654321',
          email: 'puskesmas@mekarjaya.id',
          licenseNumber: '440/PK/2019',
          operationalSince: '2019-05-20',
          capacity: 50,
          director: 'Ns. Siti Rahayu',
          isActive: true,
        },
        {
          id: '3',
          name: 'Klinik Pratama Medika',
          type: 'Klinik Pratama',
          address: 'Jl. Diponegoro No. 78',
          city: 'Surabaya',
          province: 'Jawa Timur',
          phone: '+623198765432',
          email: 'info@klinikmedika.id',
          licenseNumber: '357/KLN/2021',
          operationalSince: '2021-03-10',
          capacity: 20,
          director: 'Dr. Budi Santoso',
          isActive: true,
        },
      ];
      
      setState(prev => ({
        ...prev,
        faskes: mockFaskes,
        filteredFaskes: prev.searchTerm 
          ? mockFaskes.filter(faskes =>
              faskes.name.toLowerCase().includes(prev.searchTerm.toLowerCase()) ||
              faskes.licenseNumber.toLowerCase().includes(prev.searchTerm.toLowerCase()) ||
              faskes.director.toLowerCase().includes(prev.searchTerm.toLowerCase())
            )
          : mockFaskes,
        loading: false,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Gagal memuat ulang data faskes',
      }));
    }
  };

  return {
    ...state,
    setSearchTerm,
    refreshData,
  };
};

export default useFaskesData;