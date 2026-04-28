import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface Patient {
  id: string;
  name: string;
  medicalRecordNumber: string;
}

interface Doctor {
  id: string;
  fullName: string;
  specialization: string;
}

interface Visit {
  id: string;
  visitNumber: string;
}

interface LaboratoryTest {
  id: string;
  name: string;
  code: string;
}

interface LaboratoryOrder {
  id: string;
  patient: Patient;
  doctor: Doctor;
  visit: Visit;
  test: LaboratoryTest;
}

interface LaboratoryResult {
  id: string;
  orderId: string;
  order: LaboratoryOrder;
  result: string;
  notes: string;
  status: 'pending' | 'completed' | 'verified';
  resultDate: string;
  createdAt: string;
  updatedAt: string;
}

const LaboratoryResultManagement = () => {
  const [editingResult, setEditingResult] = useState<LaboratoryResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<Omit<LaboratoryResult, 'id' | 'order' | 'resultDate' | 'createdAt' | 'updatedAt'>>({
    orderId: '',
    result: '',
    notes: '',
    status: 'pending',
  });
  
  const queryClient = useQueryClient();

  const { data: orders } = useQuery({
    queryKey: ['laboratoryOrders'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/laboratory-orders`);
      return response.data.data as LaboratoryOrder[];
    }
  });

  const { data: results, isLoading, isError } = useQuery({
    queryKey: ['laboratoryResults'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/laboratory-results`);
      return response.data.data as LaboratoryResult[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (resultData: Omit<LaboratoryResult, 'id' | 'order' | 'resultDate' | 'createdAt' | 'updatedAt'>) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/laboratory-results`, resultData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratoryResults'] });
      setIsModalOpen(false);
      setEditingResult(null);
      setFormData({
        orderId: '',
        result: '',
        notes: '',
        status: 'pending',
      });
      toast.success(editingResult ? 'Hasil laboratorium berhasil diperbarui' : 'Hasil laboratorium berhasil ditambahkan');
    },
    onError: (error: any) => {
      console.error('Error saving laboratory result:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal menyimpan data hasil laboratorium');
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...resultData }: LaboratoryResult) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/laboratory-results/${id}`, resultData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratoryResults'] });
      setIsModalOpen(false);
      setEditingResult(null);
      setFormData({
        orderId: '',
        result: '',
        notes: '',
        status: 'pending',
      });
      toast.success('Hasil laboratorium berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating laboratory result:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal memperbarui data hasil laboratorium');
      toast.error(errorMessage);
    }
  });

  const verifyMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/laboratory-results/${id}/verify`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratoryResults'] });
      toast.success('Hasil laboratorium berhasil diverifikasi');
    },
    onError: (error: any) => {
      console.error('Error verifying laboratory result:', error);
      toast.error(error.response?.data?.message || 'Gagal memverifikasi hasil laboratorium');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/laboratory-results/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratoryResults'] });
      toast.success('Hasil laboratorium berhasil dihapus');
    },
    onError: (error: any) => {
      console.error('Error deleting laboratory result:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus data hasil laboratorium');
    }
  });

  useEffect(() => {
    if (editingResult) {
      setFormData({
        orderId: editingResult.orderId,
        result: editingResult.result || '',
        notes: editingResult.notes || '',
        status: editingResult.status,
      });
      setIsModalOpen(true);
    }
  }, [editingResult]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingResult) {
      updateMutation.mutate({ ...editingResult, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (result: LaboratoryResult) => {
    setEditingResult(result);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data hasil laboratorium ini? Data akan dihapus secara permanen.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleVerify = (id: string) => {
    if (window.confirm('Yakin ingin memverifikasi hasil laboratorium ini?')) {
      verifyMutation.mutate(id);
    }
  };

  if (isError) return <div className="p-4 text-red-500">Error saat memuat data hasil laboratorium</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Hasil Laboratorium</h1>
        <button 
          onClick={() => {
            setEditingResult(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Hasil Laboratorium
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. RM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pasien</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results?.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{result.order.patient.medicalRecordNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{result.order.patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{result.order.test.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${result.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                       result.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                       'bg-green-100 text-green-800'}`}>
                      {result.status === 'pending' ? 'Menunggu' : 
                       result.status === 'completed' ? 'Selesai' : 'Terverifikasi'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(result.resultDate || result.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {(result.status === 'completed') && (
                      <button 
                        onClick={() => handleVerify(result.id)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Verifikasi
                      </button>
                    )}
                    <button 
                      onClick={() => handleEdit(result)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(result.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!results || results.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data hasil laboratorium
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
                {editingResult ? 'Edit Hasil Laboratorium' : 'Tambah Hasil Laboratorium Baru'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                      Pesanan Laboratorium *
                    </label>
                    <select
                      id="orderId"
                      name="orderId"
                      value={formData.orderId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!!editingResult} // Disable jika sedang edit
                    >
                      <option value="">Pilih Pesanan</option>
                      {orders?.map((order) => (
                        <option key={order.id} value={order.id}>
                          {order.patient.medicalRecordNumber} - {order.patient.name} - {order.test.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Menunggu</option>
                      <option value="completed">Selesai</option>
                      <option value="verified">Terverifikasi</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="result" className="block text-sm font-medium text-gray-700 mb-1">
                      Hasil Pemeriksaan
                    </label>
                    <textarea
                      id="result"
                      name="result"
                      value={formData.result}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan hasil pemeriksaan laboratorium"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Catatan
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Catatan tambahan"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingResult(null);
                      setFormData({
                        orderId: '',
                        result: '',
                        notes: '',
                        status: 'pending',
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
                    {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : (editingResult ? 'Perbarui' : 'Simpan')}
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

export default LaboratoryResultManagement;