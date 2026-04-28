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

interface Prescription {
  id: string;
  visitId: string;
  visit: Visit;
}

interface Medicine {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
}

interface PrescriptionItem {
  id: string;
  prescriptionId: string;
  prescription: Prescription;
  medicineId: string;
  medicine: Medicine;
  quantity: number;
  dosage: string;
  frequency: string;
  duration: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const PrescriptionItemManagement = () => {
  const [editingItem, setEditingItem] = useState<PrescriptionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<Omit<PrescriptionItem, 'id' | 'prescription' | 'medicine' | 'createdAt' | 'updatedAt'>>({
    prescriptionId: '',
    medicineId: '',
    quantity: 1,
    dosage: '',
    frequency: '',
    duration: 0,
    notes: '',
  });
  
  const queryClient = useQueryClient();

  const { data: prescriptions } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/prescriptions`);
      return response.data.data as Prescription[];
    }
  });

  const { data: medicines } = useQuery({
    queryKey: ['medicines'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/medicines`);
      return response.data.data as Medicine[];
    }
  });

  const { data: items, isLoading, isError } = useQuery({
    queryKey: ['prescriptionItems'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/prescription-items`);
      return response.data.data as PrescriptionItem[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (itemData: Omit<PrescriptionItem, 'id' | 'prescription' | 'medicine' | 'createdAt' | 'updatedAt'>) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/prescription-items`, itemData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptionItems'] });
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({
        prescriptionId: '',
        medicineId: '',
        quantity: 1,
        dosage: '',
        frequency: '',
        duration: 0,
        notes: '',
      });
      toast.success(editingItem ? 'Item resep berhasil diperbarui' : 'Item resep berhasil ditambahkan');
    },
    onError: (error: any) => {
      console.error('Error saving prescription item:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal menyimpan data item resep');
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...itemData }: PrescriptionItem) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/prescription-items/${id}`, itemData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptionItems'] });
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({
        prescriptionId: '',
        medicineId: '',
        quantity: 1,
        dosage: '',
        frequency: '',
        duration: 0,
        notes: '',
      });
      toast.success('Item resep berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating prescription item:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal memperbarui data item resep');
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/prescription-items/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptionItems'] });
      toast.success('Item resep berhasil dihapus');
    },
    onError: (error: any) => {
      console.error('Error deleting prescription item:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus data item resep');
    }
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        prescriptionId: editingItem.prescriptionId,
        medicineId: editingItem.medicineId,
        quantity: editingItem.quantity,
        dosage: editingItem.dosage || '',
        frequency: editingItem.frequency || '',
        duration: editingItem.duration || 0,
        notes: editingItem.notes || '',
      });
      setIsModalOpen(true);
    }
  }, [editingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      updateMutation.mutate({ ...editingItem, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'duration' ? Number(value) : value
    }));
  };

  const handleEdit = (item: PrescriptionItem) => {
    setEditingItem(item);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data item resep ini? Data akan dihapus secara permanen.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isError) return <div className="p-4 text-red-500">Error saat memuat data item resep</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Item Resep Obat</h1>
        <button 
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Item Resep
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Obat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frekuensi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durasi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{item.prescription.visit.visitNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{item.prescription.visit.patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.medicine.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.quantity} {item.medicine.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.dosage}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.frequency}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.duration} hari</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!items || items.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data item resep obat
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
                {editingItem ? 'Edit Item Resep Obat' : 'Tambah Item Resep Obat Baru'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="prescriptionId" className="block text-sm font-medium text-gray-700 mb-1">
                      Resep Obat *
                    </label>
                    <select
                      id="prescriptionId"
                      name="prescriptionId"
                      value={formData.prescriptionId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Resep</option>
                      {prescriptions?.map((prescription) => (
                        <option key={prescription.id} value={prescription.id}>
                          {prescription.visit.visitNumber} - {prescription.visit.patient.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="medicineId" className="block text-sm font-medium text-gray-700 mb-1">
                      Obat *
                    </label>
                    <select
                      id="medicineId"
                      name="medicineId"
                      value={formData.medicineId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Obat</option>
                      {medicines?.filter(med => med.stock > 0).map((medicine) => (
                        <option key={medicine.id} value={medicine.id}>
                          {medicine.name} (Stok: {medicine.stock})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Jumlah *
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
                      Dosis
                    </label>
                    <input
                      type="text"
                      id="dosage"
                      name="dosage"
                      value={formData.dosage}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: 1 tablet"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                      Frekuensi
                    </label>
                    <input
                      type="text"
                      id="frequency"
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: 3 kali sehari"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                      Durasi (hari)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      placeholder="Catatan tambahan tentang obat"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingItem(null);
                      setFormData({
                        prescriptionId: '',
                        medicineId: '',
                        quantity: 1,
                        dosage: '',
                        frequency: '',
                        duration: 0,
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
                    {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : (editingItem ? 'Perbarui' : 'Simpan')}
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

export default PrescriptionItemManagement;