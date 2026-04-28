import { useState, useEffect } from 'react';
import { Medicine } from '@/types/medicine';

interface MedicineDataState {
  medicines: Medicine[];
  filteredMedicines: Medicine[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

const useMedicineData = () => {
  const [state, setState] = useState<MedicineDataState>({
    medicines: [],
    filteredMedicines: [],
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
        
        const mockMedicines: Medicine[] = [
          {
            id: '1',
            code: 'MED001',
            name: 'Paracetamol 500mg',
            genericName: 'Paracetamol',
            dosageForm: 'tablet',
            dosage: '500mg',
            unit: 'strip',
            price: 15000,
            stock: 45,
            minStock: 10,
            category: 'Obat Keras',
            manufacturer: 'Kimia Farma',
            expiryDate: '2027-12-31',
            createdAt: '2026-01-15',
            updatedAt: '2026-04-10',
          },
          {
            id: '2',
            code: 'MED002',
            name: 'Amoxicillin 250mg',
            genericName: 'Amoxicillin Trihydrate',
            dosageForm: 'capsule',
            dosage: '250mg',
            unit: 'box',
            price: 25000,
            stock: 12,
            minStock: 15,
            category: 'Obat Keras',
            manufacturer: 'Sanbe',
            expiryDate: '2027-06-30',
            createdAt: '2026-02-20',
            updatedAt: '2026-04-15',
          },
          {
            id: '3',
            code: 'MED003',
            name: 'Salbutamol 2mg',
            genericName: 'Salbutamol Sulfate',
            dosageForm: 'syrup',
            dosage: '2mg/5ml',
            unit: 'botol',
            price: 18000,
            stock: 30,
            minStock: 5,
            category: 'Obat Bebas',
            manufacturer: 'Hexpharm',
            expiryDate: '2027-08-15',
            createdAt: '2026-01-30',
            updatedAt: '2026-04-05',
          },
          {
            id: '4',
            code: 'MED004',
            name: 'Omeprazole 20mg',
            genericName: 'Omeprazole',
            dosageForm: 'capsule',
            dosage: '20mg',
            unit: 'strip',
            price: 22000,
            stock: 8,
            minStock: 10,
            category: 'Obat Keras',
            manufacturer: 'Indo Farma',
            expiryDate: '2027-05-20',
            createdAt: '2026-03-10',
            updatedAt: '2026-04-18',
          },
        ];
        
        setState(prev => ({
          ...prev,
          medicines: mockMedicines,
          filteredMedicines: mockMedicines,
          loading: false,
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Gagal memuat data obat',
        }));
      }
    };

    fetchData();
  }, []);

  const setSearchTerm = (term: string) => {
    setState(prev => ({
      ...prev,
      searchTerm: term,
      filteredMedicines: prev.medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(term.toLowerCase()) ||
        medicine.code.toLowerCase().includes(term.toLowerCase()) ||
        medicine.genericName.toLowerCase().includes(term.toLowerCase()) ||
        medicine.manufacturer.toLowerCase().includes(term.toLowerCase())
      ),
    }));
  };

  const refreshData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulasi refresh data dari API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockMedicines: Medicine[] = [
        {
          id: '1',
          code: 'MED001',
          name: 'Paracetamol 500mg',
          genericName: 'Paracetamol',
          dosageForm: 'tablet',
          dosage: '500mg',
          unit: 'strip',
          price: 15000,
          stock: 45,
          minStock: 10,
          category: 'Obat Keras',
          manufacturer: 'Kimia Farma',
          expiryDate: '2027-12-31',
          createdAt: '2026-01-15',
          updatedAt: '2026-04-10',
        },
        {
          id: '2',
          code: 'MED002',
          name: 'Amoxicillin 250mg',
          genericName: 'Amoxicillin Trihydrate',
          dosageForm: 'capsule',
          dosage: '250mg',
          unit: 'box',
          price: 25000,
          stock: 12,
          minStock: 15,
          category: 'Obat Keras',
          manufacturer: 'Sanbe',
          expiryDate: '2027-06-30',
          createdAt: '2026-02-20',
          updatedAt: '2026-04-15',
        },
        {
          id: '3',
          code: 'MED003',
          name: 'Salbutamol 2mg',
          genericName: 'Salbutamol Sulfate',
          dosageForm: 'syrup',
          dosage: '2mg/5ml',
          unit: 'botol',
          price: 18000,
          stock: 30,
          minStock: 5,
          category: 'Obat Bebas',
          manufacturer: 'Hexpharm',
          expiryDate: '2027-08-15',
          createdAt: '2026-01-30',
          updatedAt: '2026-04-05',
        },
        {
          id: '4',
          code: 'MED004',
          name: 'Omeprazole 20mg',
          genericName: 'Omeprazole',
          dosageForm: 'capsule',
          dosage: '20mg',
          unit: 'strip',
          price: 22000,
          stock: 8,
          minStock: 10,
          category: 'Obat Keras',
          manufacturer: 'Indo Farma',
          expiryDate: '2027-05-20',
          createdAt: '2026-03-10',
          updatedAt: '2026-04-18',
        },
      ];
      
      setState(prev => ({
        ...prev,
        medicines: mockMedicines,
        filteredMedicines: prev.searchTerm 
          ? mockMedicines.filter(medicine =>
              medicine.name.toLowerCase().includes(prev.searchTerm.toLowerCase()) ||
              medicine.code.toLowerCase().includes(prev.searchTerm.toLowerCase()) ||
              medicine.genericName.toLowerCase().includes(prev.searchTerm.toLowerCase()) ||
              medicine.manufacturer.toLowerCase().includes(prev.searchTerm.toLowerCase())
            )
          : mockMedicines,
        loading: false,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Gagal memuat ulang data obat',
      }));
    }
  };

  return {
    ...state,
    setSearchTerm,
    refreshData,
  };
};

export default useMedicineData;