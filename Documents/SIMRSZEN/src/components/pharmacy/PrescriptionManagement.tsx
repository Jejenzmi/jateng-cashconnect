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
  patient: Patient;
}

interface Medicine {
  id: string;
  name: string;
  price: number;
}

interface PrescriptionItem {
  id?: string;
  medicineId: string;
  medicine?: Medicine;
  quantity: number;
  dosage: string;
  frequency: string;
  duration: number;
  notes?: string;
}

interface Prescription {
  id: string;
  visitId: string;
  visit: Visit;
  items: PrescriptionItem[];
  notes?: string;
  status: string;
  issuedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const PrescriptionManagement = () => {
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusUpdateId, setStatusUpdateId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('pending');
  
  const [formData, setFormData] = useState<Omit<Prescription, 'id' | 'visit' | 'items' | 'createdAt' | 'updatedAt'>>({
    visitId: '',
    notes: '',
    status: 'pending',
  });
  
  const [items, setItems] = useState<{ medicineId: string; quantity: number; dosage: string; frequency: string; duration: number; notes?: string; }[]>([{ medicineId: '', quantity: 1, dosage: '', frequency: '', duration: 1, notes: '' }]);
  
  const queryClient = useQueryClient();

  const { data: visits } = useQuery({
    queryKey: ['visits'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/visits`);
      return response.data.data as Visit[];
    }
  });

  const { data: medicines } = useQuery({
    queryKey: ['medicines'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/medicines`);
      return response.data.data as Medicine[];
    }
  });

  const { data: prescriptions, isLoading, isError } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/prescriptions`);
      return response.data.data as Prescription[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (prescriptionData: Omit<Prescription, 'id' | 'visit' | 'items' | 'createdAt' | 'updatedAt'>) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/prescriptions`, {
        ...prescriptionData,
        items: items
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      setIsModalOpen(false);
      setEditingPrescription(null);
      setFormData({
        visitId: '',
        notes: '',
        status: 'pending',
      });
      setItems([{ medicineId: '', quantity: 1, dosage: '', frequency: '', duration: 1, notes: '' }]);
      toast.success(editingPrescription ? 'Resep berhasil diperbarui' : 'Resep berhasil ditambahkan');
    },
    onError: (error: any) => {
      console.error('Error saving prescription:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal menyimpan data resep');
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (prescriptionData: { id: string } & Omit<Prescription, 'id' | 'visit' | 'items' | 'createdAt' | 'updatedAt'>) => {
      const { id, ...rest } = prescriptionData;
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/prescriptions/${id}`, {
        ...rest,
        items: items
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      setIsModalOpen(false);
      setEditingPrescription(null);
      setFormData({
        visitId: '',
        notes: '',
        status: 'pending',
      });
      setItems([{ medicineId: '', quantity: 1, dosage: '', frequency: '', duration: 1, notes: '' }]);
      toast.success('Resep berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating prescription:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal memperbarui data resep');
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/prescriptions/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      toast.success('Resep berhasil dihapus');
    },
    onError: (error: any) => {
      console.error('Error deleting prescription:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus data resep');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/prescriptions/${id}/status`, {
        status
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      setIsStatusModalOpen(false);
      setStatusUpdateId(null);
      toast.success('Status resep berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating prescription status:', error);
      toast.error(error.response?.data?.message || 'Gagal memperbarui status resep');
    }
  });

  useEffect(() => {
    if (editingPrescription) {
      setFormData({
        visitId: editingPrescription.visitId,
        notes: editingPrescription.notes || '',
        status: editingPrescription.status,
      });
      setItems(editingPrescription.items.map(item => ({
        medicineId: item.medicineId,
        quantity: item.quantity,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        notes: item.notes || '',
      })));
      setIsModalOpen(true);
    }
  }, [editingPrescription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPrescription) {
      updateMutation.mutate({ id: editingPrescription.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleItemChange = (index: number, field: keyof typeof items[number], value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { medicineId: '', quantity: 1, dosage: '', frequency: '', duration: 1, notes: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const updatedItems = [...items];
      updatedItems.splice(index, 1);
      setItems(updatedItems);
    }
  };

  const handleEdit = (prescription: Prescription) => {
    setEditingPrescription(prescription);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data resep ini? Data akan dihapus secara permanen.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatusChange = (id: string) => {
    setStatusUpdateId(id);
    setIsStatusModalOpen(true);
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (statusUpdateId) {
      updateStatusMutation.mutate({
        id: statusUpdateId,
        status: newStatus
      });
    }
  };

  if (isError) return <div className="p-4 text-red-500">Error saat memuat data resep</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Resep Obat</h1>
        <button 
          onClick={() => {
            setEditingPrescription(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Resep
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pasien</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Obat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prescriptions?.map((prescription) => (
                <tr key={prescription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{prescription.visit.visitNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{prescription.visit.patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{prescription.items.length} jenis obat</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${prescription.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        prescription.status === 'dispensed' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'}`}>
                      {prescription.status === 'pending' ? 'Menunggu' :
                       prescription.status === 'dispensed' ? 'Telah Diserahkan' : 'Selesai'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(prescription)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleStatusChange(prescription.id)}
                      className="text-orange-600 hover:text-orange-900 mr-3"
                    >
                      Ubah Status
                    </button>
                    <button 
                      onClick={() => handleDelete(prescription.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!prescriptions || prescriptions.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data resep obat
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingPrescription ? 'Edit Resep' : 'Tambah Resep Baru'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label htmlFor="visitId" className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih Kunjungan *
                    </label>
                    <select
                      id="visitId"
                      name="visitId"
                      value={formData.visitId}
                      onChange={(e) => setFormData({...formData, visitId: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Kunjungan</option>
                      {visits?.map((visit) => (
                        <option key={visit.id} value={visit.id}>
                          {visit.visitNumber} - {visit.patient.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Obat dalam Resep
                    </label>
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-end">
                          <div className="col-span-4">
                            <select
                              value={item.medicineId}
                              onChange={(e) => handleItemChange(index, 'medicineId', e.target.value)}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Pilih Obat</option>
                              {medicines?.map((medicine) => (
                                <option key={medicine.id} value={medicine.id}>
                                  {medicine.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                              placeholder="Jumlah"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="text"
                              value={item.dosage}
                              onChange={(e) => handleItemChange(index, 'dosage', e.target.value)}
                              placeholder="Dosis"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="text"
                              value={item.frequency}
                              onChange={(e) => handleItemChange(index, 'frequency', e.target.value)}
                              placeholder="Frekuensi"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="col-span-1">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                              -
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addItem}
                        className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        + Tambah Obat
                      </button>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Catatan Tambahan
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Catatan tambahan tentang resep"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status Resep
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Menunggu</option>
                      <option value="dispensed">Telah Diserahkan</option>
                      <option value="completed">Selesai</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingPrescription(null);
                      setFormData({
                        visitId: '',
                        notes: '',
                        status: 'pending',
                      });
                      setItems([{ medicineId: '', quantity: 1, dosage: '', frequency: '', duration: 1, notes: '' }]);
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
                    {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : (editingPrescription ? 'Perbarui' : 'Simpan')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ubah Status Resep */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Ubah Status Resep</h2>
              
              <form onSubmit={handleStatusSubmit}>
                <div className="mb-4">
                  <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700 mb-1">
                    Status Resep Baru
                  </label>
                  <select
                    id="newStatus"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Menunggu</option>
                    <option value="dispensed">Telah Diserahkan</option>
                    <option value="completed">Selesai</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsStatusModalOpen(false);
                      setStatusUpdateId(null);
                      setNewStatus('pending');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={updateStatusMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {updateStatusMutation.isPending ? 'Memperbarui...' : 'Perbarui Status'}
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

export default PrescriptionManagement;