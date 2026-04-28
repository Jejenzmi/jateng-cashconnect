import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  dosageForm?: string;
  strength?: string;
  manufacturer?: string;
  price: number;
  stock: number;
  unit?: string;
  createdAt: string;
  updatedAt: string;
}

const MedicineManagement = () => {
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    genericName: '',
    dosageForm: '',
    strength: '',
    manufacturer: '',
    price: 0,
    stock: 0,
    unit: '',
  });
  
  const queryClient = useQueryClient();

  const { data: medicines, isLoading, isError } = useQuery({
    queryKey: ['medicines'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/medicines`);
      return response.data.data as Medicine[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (medicineData: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/medicines`, medicineData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      setIsModalOpen(false);
      setEditingMedicine(null);
      setFormData({
        name: '',
        genericName: '',
        dosageForm: '',
        strength: '',
        manufacturer: '',
        price: 0,
        stock: 0,
        unit: '',
      });
      toast.success(editingMedicine ? 'Obat berhasil diperbarui' : 'Obat berhasil ditambahkan');
    },
    onError: (error: any) => {
      console.error('Error saving medicine:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal menyimpan data obat');
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...medicineData }: Medicine) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/medicines/${id}`, medicineData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      setIsModalOpen(false);
      setEditingMedicine(null);
      setFormData({
        name: '',
        genericName: '',
        dosageForm: '',
        strength: '',
        manufacturer: '',
        price: 0,
        stock: 0,
        unit: '',
      });
      toast.success('Obat berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating medicine:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal memperbarui data obat');
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/medicines/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      toast.success('Obat berhasil dihapus');
    },
    onError: (error: any) => {
      console.error('Error deleting medicine:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus data obat');
    }
  });

  useEffect(() => {
    if (editingMedicine) {
      setFormData({
        name: editingMedicine.name,
        genericName: editingMedicine.genericName || '',
        dosageForm: editingMedicine.dosageForm || '',
        strength: editingMedicine.strength || '',
        manufacturer: editingMedicine.manufacturer || '',
        price: editingMedicine.price,
        stock: editingMedicine.stock,
        unit: editingMedicine.unit || '',
      });
      setIsModalOpen(true);
    }
  }, [editingMedicine]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMedicine) {
      updateMutation.mutate({ ...editingMedicine, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data obat ini? Data akan dihapus secara permanen.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isError) return <div className="p-4 text-red-500">Error saat memuat data obat</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Obat</h1>
        <button 
          onClick={() => {
            setEditingMedicine(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Obat
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Obat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Generik</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bentuk Sediaan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kekuatan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {medicines?.map((medicine) => (
                <tr key={medicine.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{medicine.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{medicine.genericName || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{medicine.dosageForm || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{medicine.strength || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">Rp {medicine.price.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${medicine.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {medicine.stock} {medicine.unit || ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(medicine)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(medicine.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!medicines || medicines.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data obat
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
                {editingMedicine ? 'Edit Obat' : 'Tambah Obat Baru'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Obat *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nama obat"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="genericName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Generik
                    </label>
                    <input
                      type="text"
                      id="genericName"
                      name="genericName"
                      value={formData.genericName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nama generik obat"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dosageForm" className="block text-sm font-medium text-gray-700 mb-1">
                      Bentuk Sediaan
                    </label>
                    <input
                      type="text"
                      id="dosageForm"
                      name="dosageForm"
                      value={formData.dosageForm}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tablet, Sirup, Injeksi, dll"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="strength" className="block text-sm font-medium text-gray-700 mb-1">
                      Kekuatan
                    </label>
                    <input
                      type="text"
                      id="strength"
                      name="strength"
                      value={formData.strength}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Misal: 500mg, 10ml"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-1">
                      Produsen
                    </label>
                    <input
                      type="text"
                      id="manufacturer"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nama produsen obat"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                      Satuan
                    </label>
                    <input
                      type="text"
                      id="unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: tablet, botol, strip"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Harga *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Harga obat"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                      Stok *
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Jumlah stok"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingMedicine(null);
                      setFormData({
                        name: '',
                        genericName: '',
                        dosageForm: '',
                        strength: '',
                        manufacturer: '',
                        price: 0,
                        stock: 0,
                        unit: '',
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
                    {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : (editingMedicine ? 'Perbarui' : 'Simpan')}
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

export default MedicineManagement;