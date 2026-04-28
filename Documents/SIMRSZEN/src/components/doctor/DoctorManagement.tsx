import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface Doctor {
  id: string;
  nip: string;
  fullName: string;
  specialization: string;
  phone?: string;
  email?: string;
  address?: string;
  licenseNumber?: string;
  employmentDate?: string;
  createdAt: string;
  updatedAt: string;
}

const DoctorManagement = () => {
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>>({
    nip: '',
    fullName: '',
    specialization: '',
    phone: '',
    email: '',
    address: '',
    licenseNumber: '',
    employmentDate: new Date().toISOString().split('T')[0],
  });
  
  const queryClient = useQueryClient();

  const { data: doctors, isLoading, isError } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/doctors`);
      return response.data.data as Doctor[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (doctorData: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/doctors`, doctorData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      setIsModalOpen(false);
      setEditingDoctor(null);
      setFormData({
        nip: '',
        fullName: '',
        specialization: '',
        phone: '',
        email: '',
        address: '',
        licenseNumber: '',
        employmentDate: new Date().toISOString().split('T')[0],
      });
      toast.success(editingDoctor ? 'Dokter berhasil diperbarui' : 'Dokter berhasil ditambahkan');
    },
    onError: (error: any) => {
      console.error('Error saving doctor:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal menyimpan data dokter');
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...doctorData }: Doctor) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/doctors/${id}`, doctorData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      setIsModalOpen(false);
      setEditingDoctor(null);
      setFormData({
        nip: '',
        fullName: '',
        specialization: '',
        phone: '',
        email: '',
        address: '',
        licenseNumber: '',
        employmentDate: new Date().toISOString().split('T')[0],
      });
      toast.success('Dokter berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating doctor:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal memperbarui data dokter');
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/doctors/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Dokter berhasil dihapus');
    },
    onError: (error: any) => {
      console.error('Error deleting doctor:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus data dokter');
    }
  });

  useEffect(() => {
    if (editingDoctor) {
      setFormData({
        nip: editingDoctor.nip,
        fullName: editingDoctor.fullName,
        specialization: editingDoctor.specialization,
        phone: editingDoctor.phone || '',
        email: editingDoctor.email || '',
        address: editingDoctor.address || '',
        licenseNumber: editingDoctor.licenseNumber || '',
        employmentDate: editingDoctor.employmentDate ? new Date(editingDoctor.employmentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
      setIsModalOpen(true);
    }
  }, [editingDoctor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDoctor) {
      updateMutation.mutate({ ...editingDoctor, ...formData });
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

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data dokter ini? Data akan dihapus secara permanen.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isError) return <div className="p-4 text-red-500">Error saat memuat data dokter</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Dokter</h1>
        <button 
          onClick={() => {
            setEditingDoctor(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Dokter
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spesialisasi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctors?.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{doctor.nip}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{doctor.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {doctor.specialization}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{doctor.phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{doctor.email || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(doctor)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(doctor.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!doctors || doctors.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data dokter
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
                {editingDoctor ? 'Edit Dokter' : 'Tambah Dokter Baru'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="nip" className="block text-sm font-medium text-gray-700 mb-1">
                      NIP *
                    </label>
                    <input
                      type="text"
                      id="nip"
                      name="nip"
                      value={formData.nip}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan NIP"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nama lengkap dokter"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                      Spesialisasi *
                    </label>
                    <input
                      type="text"
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Spesialisasi dokter"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telepon
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nomor telepon"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email dokter"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      No. STR
                    </label>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nomor Surat Tanda Registrasi"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="employmentDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Tgl. Bergabung
                    </label>
                    <input
                      type="date"
                      id="employmentDate"
                      name="employmentDate"
                      value={formData.employmentDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Alamat lengkap dokter"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingDoctor(null);
                      setFormData({
                        nip: '',
                        fullName: '',
                        specialization: '',
                        phone: '',
                        email: '',
                        address: '',
                        licenseNumber: '',
                        employmentDate: new Date().toISOString().split('T')[0],
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
                    {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : (editingDoctor ? 'Perbarui' : 'Simpan')}
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

export default DoctorManagement;