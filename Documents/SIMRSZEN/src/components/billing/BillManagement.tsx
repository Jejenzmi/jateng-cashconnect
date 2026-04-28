import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface Patient {
  id: string;
  name: string;
  medicalRecordNumber: string;
}

interface Visit {
  id: string;
  visitNumber: string;
}

interface BillItem {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: string;
}

interface Bill {
  id: string;
  patientId: string;
  patient: Patient;
  visitId: string;
  visit: Visit;
  items: BillItem[];
  totalAmount: number;
  discountPercent: number;
  discountAmount: number;
  finalAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'cancelled';
  paymentMethod: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const BillManagement = () => {
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Bill, 'id' | 'patient' | 'visit' | 'items' | 'totalAmount' | 'finalAmount' | 'createdAt' | 'updatedAt'>>({
    patientId: '',
    visitId: '',
    discountPercent: 0,
    discountAmount: 0,
    paymentStatus: 'pending',
    paymentMethod: '',
    notes: '',
  });
  
  const queryClient = useQueryClient();

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/patients`);
      return response.data.data as Patient[];
    }
  });

  const { data: visits } = useQuery({
    queryKey: ['visits'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/visits`);
      return response.data.data as Visit[];
    }
  });

  const { data: bills, isLoading, isError } = useQuery({
    queryKey: ['bills'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/bills`);
      return response.data.data as Bill[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (billData: Omit<Bill, 'id' | 'patient' | 'visit' | 'items' | 'totalAmount' | 'finalAmount' | 'createdAt' | 'updatedAt'>) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/bills`, billData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      setIsModalOpen(false);
      setEditingBill(null);
      setFormData({
        patientId: '',
        visitId: '',
        discountPercent: 0,
        discountAmount: 0,
        paymentStatus: 'pending',
        paymentMethod: '',
        notes: '',
      });
      toast.success(editingBill ? 'Tagihan berhasil diperbarui' : 'Tagihan berhasil ditambahkan');
    },
    onError: (error: any) => {
      console.error('Error saving bill:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal menyimpan data tagihan');
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...billData }: Bill) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/bills/${id}`, billData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      setIsModalOpen(false);
      setEditingBill(null);
      setFormData({
        patientId: '',
        visitId: '',
        discountPercent: 0,
        discountAmount: 0,
        paymentStatus: 'pending',
        paymentMethod: '',
        notes: '',
      });
      toast.success('Tagihan berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating bill:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal memperbarui data tagihan');
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/bills/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      toast.success('Tagihan berhasil dihapus');
    },
    onError: (error: any) => {
      console.error('Error deleting bill:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus data tagihan');
    }
  });

  useEffect(() => {
    if (editingBill) {
      setFormData({
        patientId: editingBill.patientId,
        visitId: editingBill.visitId,
        discountPercent: editingBill.discountPercent,
        discountAmount: editingBill.discountAmount,
        paymentStatus: editingBill.paymentStatus,
        paymentMethod: editingBill.paymentMethod || '',
        notes: editingBill.notes || '',
      });
      setIsModalOpen(true);
    }
  }, [editingBill]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBill) {
      updateMutation.mutate({ ...editingBill, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discountPercent' || name === 'discountAmount' ? Number(value) : value
    }));
  };

  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data tagihan ini? Data akan dihapus secara permanen.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isError) return <div className="p-4 text-red-500">Error saat memuat data tagihan</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Tagihan</h1>
        <button 
          onClick={() => {
            setEditingBill(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Tagihan
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Kunjungan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pasien</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. RM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diskon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Pembayaran</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bills?.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{bill.visit.visitNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{bill.patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{bill.patient.medicalRecordNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">Rp {bill.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {bill.discountPercent}% / Rp {bill.discountAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">Rp {bill.finalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${bill.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        bill.paymentStatus === 'partial' ? 'bg-blue-100 text-blue-800' :
                        bill.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'}`}>
                      {bill.paymentStatus === 'pending' ? 'Menunggu' : 
                       bill.paymentStatus === 'partial' ? 'Sebagian' : 
                       bill.paymentStatus === 'paid' ? 'Lunas' : 'Dibatalkan'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(bill)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(bill.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!bills || bills.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data tagihan
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingBill ? 'Edit Tagihan' : 'Tambah Tagihan Baru'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
                      Pasien *
                    </label>
                    <select
                      id="patientId"
                      name="patientId"
                      value={formData.patientId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Pasien</option>
                      {patients?.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.medicalRecordNumber} - {patient.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="visitId" className="block text-sm font-medium text-gray-700 mb-1">
                      Kunjungan *
                    </label>
                    <select
                      id="visitId"
                      name="visitId"
                      value={formData.visitId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Kunjungan</option>
                      {visits?.map((visit) => (
                        <option key={visit.id} value={visit.id}>
                          {visit.visitNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="discountPercent" className="block text-sm font-medium text-gray-700 mb-1">
                      Diskon Persen (%)
                    </label>
                    <input
                      type="number"
                      id="discountPercent"
                      name="discountPercent"
                      value={formData.discountPercent}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="discountAmount" className="block text-sm font-medium text-gray-700 mb-1">
                      Diskon Jumlah (Rp)
                    </label>
                    <input
                      type="number"
                      id="discountAmount"
                      name="discountAmount"
                      value={formData.discountAmount}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-1">
                      Status Pembayaran *
                    </label>
                    <select
                      id="paymentStatus"
                      name="paymentStatus"
                      value={formData.paymentStatus}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Menunggu</option>
                      <option value="partial">Sebagian</option>
                      <option value="paid">Lunas</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                      Metode Pembayaran
                    </label>
                    <input
                      type="text"
                      id="paymentMethod"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Tunai, Kartu Kredit, Transfer"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Catatan
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Catatan tambahan tentang tagihan"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingBill(null);
                      setFormData({
                        patientId: '',
                        visitId: '',
                        discountPercent: 0,
                        discountAmount: 0,
                        paymentStatus: 'pending',
                        paymentMethod: '',
                        notes: '',
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : (editingBill ? 'Perbarui' : 'Simpan')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillManagement;