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

interface LaboratoryResult {
  id: string;
  status: string;
  resultDate?: string;
}

interface LaboratoryOrder {
  id: string;
  patientId: string;
  patient: Patient;
  doctorId: string;
  doctor: Doctor;
  visitId: string;
  visit: Visit;
  testId: string;
  test: LaboratoryTest;
  notes?: string;
  priority: 'routine' | 'urgent' | 'stat';
  result?: LaboratoryResult;
  createdAt: string;
  updatedAt: string;
}

const LaboratoryOrderManagement = () => {
  const [editingOrder, setEditingOrder] = useState<LaboratoryOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<Omit<LaboratoryOrder, 'id' | 'patient' | 'doctor' | 'visit' | 'test' | 'result' | 'createdAt' | 'updatedAt'>>({
    patientId: '',
    doctorId: '',
    visitId: '',
    testId: '',
    notes: '',
    priority: 'routine',
  });
  
  const queryClient = useQueryClient();

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/patients`);
      return response.data.data as Patient[];
    }
  });

  const { data: doctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/doctors`);
      return response.data.data as Doctor[];
    }
  });

  const { data: visits } = useQuery({
    queryKey: ['visits'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/visits`);
      return response.data.data as Visit[];
    }
  });

  const { data: labTests } = useQuery({
    queryKey: ['labTests'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/laboratory-tests`);
      return response.data.data as LaboratoryTest[];
    }
  });

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['laboratoryOrders'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/laboratory-orders`);
      return response.data.data as LaboratoryOrder[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (orderData: Omit<LaboratoryOrder, 'id' | 'patient' | 'doctor' | 'visit' | 'test' | 'result' | 'createdAt' | 'updatedAt'>) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/laboratory-orders`, orderData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratoryOrders'] });
      setIsModalOpen(false);
      setEditingOrder(null);
      setFormData({
        patientId: '',
        doctorId: '',
        visitId: '',
        testId: '',
        notes: '',
        priority: 'routine',
      });
      toast.success(editingOrder ? 'Pesanan laboratorium berhasil diperbarui' : 'Pesanan laboratorium berhasil ditambahkan');
    },
    onError: (error: any) => {
      console.error('Error saving laboratory order:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal menyimpan data pesanan laboratorium');
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...orderData }: LaboratoryOrder) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/laboratory-orders/${id}`, orderData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratoryOrders'] });
      setIsModalOpen(false);
      setEditingOrder(null);
      setFormData({
        patientId: '',
        doctorId: '',
        visitId: '',
        testId: '',
        notes: '',
        priority: 'routine',
      });
      toast.success('Pesanan laboratorium berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating laboratory order:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal memperbarui data pesanan laboratorium');
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/laboratory-orders/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratoryOrders'] });
      toast.success('Pesanan laboratorium berhasil dihapus');
    },
    onError: (error: any) => {
      console.error('Error deleting laboratory order:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus data pesanan laboratorium');
    }
  });

  useEffect(() => {
    if (editingOrder) {
      setFormData({
        patientId: editingOrder.patientId,
        doctorId: editingOrder.doctorId,
        visitId: editingOrder.visitId,
        testId: editingOrder.testId,
        notes: editingOrder.notes || '',
        priority: editingOrder.priority,
      });
      setIsModalOpen(true);
    }
  }, [editingOrder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingOrder) {
      updateMutation.mutate({ ...editingOrder, ...formData });
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

  const handleEdit = (order: LaboratoryOrder) => {
    setEditingOrder(order);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data pesanan laboratorium ini? Data akan dihapus secara permanen.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isError) return <div className="p-4 text-red-500">Error saat memuat data pesanan laboratorium</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Pesanan Laboratorium</h1>
        <button 
          onClick={() => {
            setEditingOrder(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Pesanan Laboratorium
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioritas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hasil</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders?.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{order.patient.medicalRecordNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{order.patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.doctor.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.test.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.priority === 'routine' ? 'bg-blue-100 text-blue-800' :
                       order.priority === 'urgent' ? 'bg-yellow-100 text-yellow-800' :
                       'bg-red-100 text-red-800'}`}>
                      {order.priority === 'routine' ? 'Rutin' : 
                       order.priority === 'urgent' ? 'Urgent' : 'Stat'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.result ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Sudah Ada
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Belum Ada
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(order)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(order.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!orders || orders.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data pesanan laboratorium
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
                {editingOrder ? 'Edit Pesanan Laboratorium' : 'Tambah Pesanan Laboratorium Baru'}
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
                    <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 mb-1">
                      Dokter Pengirim *
                    </label>
                    <select
                      id="doctorId"
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Dokter</option>
                      {doctors?.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.fullName} - {doctor.specialization}
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
                    <label htmlFor="testId" className="block text-sm font-medium text-gray-700 mb-1">
                      Tes Laboratorium *
                    </label>
                    <select
                      id="testId"
                      name="testId"
                      value={formData.testId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Tes</option>
                      {labTests?.map((test) => (
                        <option key={test.id} value={test.id}>
                          {test.code} - {test.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                      Prioritas *
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="routine">Rutin</option>
                      <option value="urgent">Urgent</option>
                      <option value="stat">Stat (Segera)</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Catatan
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes || ''}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Catatan tambahan untuk laboratorium"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingOrder(null);
                      setFormData({
                        patientId: '',
                        doctorId: '',
                        visitId: '',
                        testId: '',
                        notes: '',
                        priority: 'routine',
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
                    {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : (editingOrder ? 'Perbarui' : 'Simpan')}
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

export default LaboratoryOrderManagement;