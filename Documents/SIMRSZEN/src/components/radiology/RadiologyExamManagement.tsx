import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface RadiologyExam {
  id: string;
  name: string;
  code: string;
  category?: string;
  description?: string;
  price: number;
  preparation?: string;
  contraindications?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const RadiologyExamManagement = () => {
  const [editingExam, setEditingExam] = useState<RadiologyExam | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<RadiologyExam, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    code: '',
    category: '',
    description: '',
    price: 0,
    preparation: '',
    contraindications: '',
    isActive: true,
  });
  
  const queryClient = useQueryClient();

  const { data: exams, isLoading, isError } = useQuery({
    queryKey: ['radiologyExams'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/radiology-exams`);
      return response.data.data as RadiologyExam[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (examData: Omit<RadiologyExam, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/radiology-exams`, examData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['radiologyExams'] });
      setIsModalOpen(false);
      setEditingExam(null);
      setFormData({
        name: '',
        code: '',
        category: '',
        description: '',
        price: 0,
        preparation: '',
        contraindications: '',
        isActive: true,
      });
      toast.success(editingExam ? 'Pemeriksaan radiologi berhasil diperbarui' : 'Pemeriksaan radiologi berhasil ditambahkan');
    },
    onError: (error: any) => {
      console.error('Error saving radiology exam:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal menyimpan data pemeriksaan radiologi');
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...examData }: RadiologyExam) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/radiology-exams/${id}`, examData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['radiologyExams'] });
      setIsModalOpen(false);
      setEditingExam(null);
      setFormData({
        name: '',
        code: '',
        category: '',
        description: '',
        price: 0,
        preparation: '',
        contraindications: '',
        isActive: true,
      });
      toast.success('Pemeriksaan radiologi berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating radiology exam:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal memperbarui data pemeriksaan radiologi');
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/radiology-exams/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['radiologyExams'] });
      toast.success('Pemeriksaan radiologi berhasil dihapus');
    },
    onError: (error: any) => {
      console.error('Error deleting radiology exam:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus data pemeriksaan radiologi');
    }
  });

  useEffect(() => {
    if (editingExam) {
      setFormData({
        name: editingExam.name,
        code: editingExam.code,
        category: editingExam.category || '',
        description: editingExam.description || '',
        price: editingExam.price,
        preparation: editingExam.preparation || '',
        contraindications: editingExam.contraindications || '',
        isActive: editingExam.isActive,
      });
      setIsModalOpen(true);
    }
  }, [editingExam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingExam) {
      updateMutation.mutate({ ...editingExam, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'price' ? Number(value) : value
    }));
  };

  const handleEdit = (exam: RadiologyExam) => {
    setEditingExam(exam);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data pemeriksaan radiologi ini? Data akan dihapus secara permanen.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isError) return <div className="p-4 text-red-500">Error saat memuat data pemeriksaan radiologi</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Pemeriksaan Radiologi</h1>
        <button 
          onClick={() => {
            setEditingExam(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Pemeriksaan
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pemeriksaan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exams?.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{exam.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{exam.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{exam.category || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">Rp {exam.price.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${exam.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {exam.isActive ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(exam)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(exam.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!exams || exams.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data pemeriksaan radiologi
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
                {editingExam ? 'Edit Pemeriksaan Radiologi' : 'Tambah Pemeriksaan Radiologi Baru'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Pemeriksaan *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nama pemeriksaan radiologi"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                      Kode Pemeriksaan *
                    </label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Kode unik pemeriksaan"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="CT">Computed Tomography (CT)</option>
                      <option value="MRI">Magnetic Resonance Imaging (MRI)</option>
                      <option value="X-RAY">X-Ray</option>
                      <option value="USG">Ultrasound (USG)</option>
                      <option value="FLUOROSCOPY">Fluoroscopy</option>
                      <option value="MAMMOGRAPHY">Mammography</option>
                      <option value="DEXA">DEXA Scan</option>
                      <option value="ANGIOGRAPHY">Angiography</option>
                      <option value="NUCLEAR">Nuclear Medicine</option>
                      <option value="OTHER">Lainnya</option>
                    </select>
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
                      placeholder="Harga pemeriksaan"
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
                      placeholder="Deskripsi pemeriksaan radiologi"
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
                      placeholder="Persiapan sebelum pemeriksaan"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="contraindications" className="block text-sm font-medium text-gray-700 mb-1">
                      Kontraindikasi
                    </label>
                    <textarea
                      id="contraindications"
                      name="contraindications"
                      value={formData.contraindications}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Kontraindikasi pemeriksaan"
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
                      setEditingExam(null);
                      setFormData({
                        name: '',
                        code: '',
                        category: '',
                        description: '',
                        price: 0,
                        preparation: '',
                        contraindications: '',
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
                    {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : (editingExam ? 'Perbarui' : 'Simpan')}
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

export default RadiologyExamManagement;