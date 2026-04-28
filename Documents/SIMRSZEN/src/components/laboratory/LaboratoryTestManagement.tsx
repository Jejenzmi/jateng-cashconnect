import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface LaboratoryTest {
  id: string;
  name: string;
  code: string;
  group?: string;
  description?: string;
  price: number;
  normalValues?: string;
  sampleType?: string;
  preparation?: string;
  processingTime?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const LaboratoryTestManagement = () => {
  const [editingTest, setEditingTest] = useState<LaboratoryTest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<LaboratoryTest, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    code: '',
    group: '',
    description: '',
    price: 0,
    normalValues: '',
    sampleType: '',
    preparation: '',
    processingTime: 0,
    isActive: true,
  });
  
  const queryClient = useQueryClient();

  const { data: labTests, isLoading, isError } = useQuery({
    queryKey: ['labTests'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/laboratory-tests`);
      return response.data.data as LaboratoryTest[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (testData: Omit<LaboratoryTest, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/laboratory-tests`, testData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labTests'] });
      setIsModalOpen(false);
      setEditingTest(null);
      setFormData({
        name: '',
        code: '',
        group: '',
        description: '',
        price: 0,
        normalValues: '',
        sampleType: '',
        preparation: '',
        processingTime: 0,
        isActive: true,
      });
      toast.success(editingTest ? 'Tes laboratorium berhasil diperbarui' : 'Tes laboratorium berhasil ditambahkan');
    },
    onError: (error: any) => {
      console.error('Error saving lab test:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal menyimpan data tes laboratorium');
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...testData }: LaboratoryTest) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/laboratory-tests/${id}`, testData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labTests'] });
      setIsModalOpen(false);
      setEditingTest(null);
      setFormData({
        name: '',
        code: '',
        group: '',
        description: '',
        price: 0,
        normalValues: '',
        sampleType: '',
        preparation: '',
        processingTime: 0,
        isActive: true,
      });
      toast.success('Tes laboratorium berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating lab test:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal memperbarui data tes laboratorium');
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/laboratory-tests/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labTests'] });
      toast.success('Tes laboratorium berhasil dihapus');
    },
    onError: (error: any) => {
      console.error('Error deleting lab test:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus data tes laboratorium');
    }
  });

  useEffect(() => {
    if (editingTest) {
      setFormData({
        name: editingTest.name,
        code: editingTest.code,
        group: editingTest.group || '',
        description: editingTest.description || '',
        price: editingTest.price,
        normalValues: editingTest.normalValues || '',
        sampleType: editingTest.sampleType || '',
        preparation: editingTest.preparation || '',
        processingTime: editingTest.processingTime || 0,
        isActive: editingTest.isActive,
      });
      setIsModalOpen(true);
    }
  }, [editingTest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTest) {
      updateMutation.mutate({ ...editingTest, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'price' || name === 'processingTime' ? Number(value) : value
    }));
  };

  const handleEdit = (test: LaboratoryTest) => {
    setEditingTest(test);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data tes laboratorium ini? Data akan dihapus secara permanen.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isError) return <div className="p-4 text-red-500">Error saat memuat data tes laboratorium</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Tes Laboratorium</h1>
        <button 
          onClick={() => {
            setEditingTest(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Tes Lab
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Tes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grup</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Proses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {labTests?.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{test.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{test.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{test.group || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">Rp {test.price.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{test.processingTime} jam</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${test.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {test.isActive ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(test)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(test.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!labTests || labTests.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data tes laboratorium
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
                {editingTest ? 'Edit Tes Laboratorium' : 'Tambah Tes Laboratorium Baru'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Tes *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nama tes laboratorium"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                      Kode Tes *
                    </label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Kode unik tes"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">
                      Grup
                    </label>
                    <input
                      type="text"
                      id="group"
                      name="group"
                      value={formData.group}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Grup tes (hematology, chemistry, dll)"
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
                      placeholder="Harga tes"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="sampleType" className="block text-sm font-medium text-gray-700 mb-1">
                      Jenis Sampel
                    </label>
                    <input
                      type="text"
                      id="sampleType"
                      name="sampleType"
                      value={formData.sampleType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Jenis sampel (darah, urin, dll)"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="processingTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Waktu Pengerjaan (jam)
                    </label>
                    <input
                      type="number"
                      id="processingTime"
                      name="processingTime"
                      value={formData.processingTime}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Lama waktu pengerjaan"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Deskripsi tes laboratorium"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="preparation" className="block text-sm font-medium text-gray-700 mb-1">
                      Persiapan
                    </label>
                    <textarea
                      id="preparation"
                      name="preparation"
                      value={formData.preparation}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Persiapan sebelum tes"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="normalValues" className="block text-sm font-medium text-gray-700 mb-1">
                      Nilai Normal
                    </label>
                    <textarea
                      id="normalValues"
                      name="normalValues"
                      value={formData.normalValues}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nilai normal untuk tes ini"
                    />
                  </div>
                  
                  <div className="md:col-span-2 flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Aktif
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingTest(null);
                      setFormData({
                        name: '',
                        code: '',
                        group: '',
                        description: '',
                        price: 0,
                        normalValues: '',
                        sampleType: '',
                        preparation: '',
                        processingTime: 0,
                        isActive: true,
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
                    {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : (editingTest ? 'Perbarui' : 'Simpan')}
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

export default LaboratoryTestManagement;