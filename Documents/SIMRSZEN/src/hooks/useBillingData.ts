import { useState, useEffect } from 'react';
import { Billing } from '@/types/billing';

interface BillingDataState {
  billings: Billing[];
  filteredBillings: Billing[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

const useBillingData = () => {
  const [state, setState] = useState<BillingDataState>({
    billings: [],
    filteredBillings: [],
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
        
        const mockBillings: Billing[] = [
          {
            id: '1',
            patientId: '1',
            patientName: 'Ahmad Fauzi',
            registrationId: 'r1',
            totalAmount: 250000,
            discount: 25000,
            tax: 22500,
            finalAmount: 247500,
            paymentStatus: 'paid',
            paymentMethod: 'tunai',
            notes: 'Pemeriksaan rutin',
            createdAt: '2026-04-19 09:30:00',
            updatedAt: '2026-04-19 10:15:00',
          },
          {
            id: '2',
            patientId: '2',
            patientName: 'Siti Nurhaliza',
            registrationId: 'r2',
            totalAmount: 150000,
            discount: 0,
            tax: 15000,
            finalAmount: 165000,
            paymentStatus: 'unpaid',
            paymentMethod: 'bpjs',
            notes: 'Pemeriksaan kehamilan',
            createdAt: '2026-04-19 10:00:00',
            updatedAt: '2026-04-19 10:00:00',
          },
          {
            id: '3',
            patientId: '3',
            patientName: 'Budi Santoso',
            registrationId: 'r3',
            totalAmount: 500000,
            discount: 0,
            tax: 50000,
            finalAmount: 550000,
            paymentStatus: 'partially_paid',
            paymentMethod: 'kartu',
            notes: 'Tindakan rawat inap',
            createdAt: '2026-04-18 15:30:00',
            updatedAt: '2026-04-19 08:45:00',
          },
        ];
        
        setState(prev => ({
          ...prev,
          billings: mockBillings,
          filteredBillings: mockBillings,
          loading: false,
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Gagal memuat data billing',
        }));
      }
    };

    fetchData();
  }, []);

  const setSearchTerm = (term: string) => {
    setState(prev => ({
      ...prev,
      searchTerm: term,
      filteredBillings: prev.billings.filter(billing =>
        billing.patientName.toLowerCase().includes(term.toLowerCase()) ||
        billing.id.toLowerCase().includes(term.toLowerCase()) ||
        billing.registrationId.toLowerCase().includes(term.toLowerCase())
      ),
    }));
  };

  const refreshData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulasi refresh data dari API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockBillings: Billing[] = [
        {
          id: '1',
          patientId: '1',
          patientName: 'Ahmad Fauzi',
          registrationId: 'r1',
          totalAmount: 250000,
          discount: 25000,
          tax: 22500,
          finalAmount: 247500,
          paymentStatus: 'paid',
          paymentMethod: 'tunai',
          notes: 'Pemeriksaan rutin',
          createdAt: '2026-04-19 09:30:00',
          updatedAt: '2026-04-19 10:15:00',
        },
        {
          id: '2',
          patientId: '2',
          patientName: 'Siti Nurhaliza',
          registrationId: 'r2',
          totalAmount: 150000,
          discount: 0,
          tax: 15000,
          finalAmount: 165000,
          paymentStatus: 'unpaid',
          paymentMethod: 'bpjs',
          notes: 'Pemeriksaan kehamilan',
          createdAt: '2026-04-19 10:00:00',
          updatedAt: '2026-04-19 10:00:00',
        },
        {
          id: '3',
          patientId: '3',
          patientName: 'Budi Santoso',
          registrationId: 'r3',
          totalAmount: 500000,
          discount: 0,
          tax: 50000,
          finalAmount: 550000,
          paymentStatus: 'partially_paid',
          paymentMethod: 'kartu',
          notes: 'Tindakan rawat inap',
          createdAt: '2026-04-18 15:30:00',
          updatedAt: '2026-04-19 08:45:00',
        },
      ];
      
      setState(prev => ({
        ...prev,
        billings: mockBillings,
        filteredBillings: prev.searchTerm 
          ? mockBillings.filter(billing =>
              billing.patientName.toLowerCase().includes(prev.searchTerm.toLowerCase()) ||
              billing.id.toLowerCase().includes(prev.searchTerm.toLowerCase()) ||
              billing.registrationId.toLowerCase().includes(prev.searchTerm.toLowerCase())
            )
          : mockBillings,
        loading: false,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Gagal memuat ulang data billing',
      }));
    }
  };

  return {
    ...state,
    setSearchTerm,
    refreshData,
  };
};

export default useBillingData;