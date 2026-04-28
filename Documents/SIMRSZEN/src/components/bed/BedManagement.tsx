import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface Room {
  id: string;
  name: string;
  type: string;
}

interface Inpatient {
  id: string;
  patient: {
    id: string;
    name: string;
  };
}

interface Bed {
  id: string;
  name: string;
  roomNumber: string;
  roomId: string;
  room: Room;
  status: string;
  description?: string;
  inpatients: Inpatient[];
  createdAt: string;
  updatedAt: string;
}

const BedManagement = () => {
  const [editingBed, setEditingBed] = useState<Bed | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusBedId, setStatusBedId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Bed, 'id' | 'room' | 'inpatients' | 'createdAt' | 'updatedAt'>>({
    name: '',
    roomNumber: '',
    roomId: '',
    status: 'available',
    description: '',
  });
  
  const [statusData, setStatusData] = useState({
    status: 'available' as 'available' | 'occupied' | 'maintenance',
  });
  
  const queryClient = useQueryClient();

  const { data: rooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/rooms`);
      return response.data.data as Room[];
    }
  });

  const { data: beds, isLoading, isError } = useQuery({
    queryKey: ['beds'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/beds`);
      return response.data.data as Bed[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (bedData: Omit<Bed, 'id' | 'room' | 'inpatients' | 'createdAt' | 'updatedAt'>) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/beds`, bedData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      setIsModalOpen(false);
      setEditingBed(null);
      setFormData({
        name: '',
        roomNumber: '',
        roomId: '',
        status: 'available',
        description: '',
      });
      toast.success(editingBed ? 'Tempat tidur berhasil diperbarui' : 'Tempat tidur berhasil ditambahkan');
    },
    onError: (error: any) => {
      console.error('Error saving bed:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal menyimpan data tempat tidur');
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...bedData }: Bed) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/beds/${id}`, bedData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      setIsModalOpen(false);
      setEditingBed(null);
      setFormData({
        name: '',
        roomNumber: '',
        roomId: '',
        status: 'available',
        description: '',
      });
      toast.success('Tempat tidur berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating bed:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal memperbarui data tempat tidur');
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/beds/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast.success('Tempat tidur berhasil dihapus');
    },
    onError: (error: any) => {
      console.error('Error deleting bed:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus data tempat tidur');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'available' | 'occupied' | 'maintenance' }) => {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/beds/${id}/status`, {
        status
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      setIsStatusModalOpen(false);
      setStatusBedId(null);
      toast.success('Status tempat tidur berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Gagal memperbarui status tempat tidur');
    }
  });

  useEffect(() => {
    if (editingBed) {
      setFormData({
        name: editingBed.name,
        roomNumber: editingBed.roomNumber,
        roomId: editingBed.roomId,
        status: editingBed.status,
        description: editingBed.description || '',
      });
      setIsModalOpen(true);
    }
  }, [editingBed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBed) {
      updateMutation.mutate({ ...editingBed, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (statusBedId) {
      updateStatusMutation.mutate({
        id: statusBedId,
        status: statusData.status
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStatusData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (bed: Bed) => {
    setEditingBed(bed);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data tempat tidur ini? Data akan dihapus secara permanen.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatusUpdate = (id: string) => {
    setStatusBedId(id);
    setIsStatusModalOpen(true);
  };

  if (isError) return <div className="p-4 text-red-500">Error saat memuat data tempat tidur</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Tempat Tidur</h1>
        <button 
          onClick={() => {
            setEditingBed(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Tempat Tidur
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Kamar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kamar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pasien Terdaftar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {beds?.map((bed) => (
                <tr key={bed.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{bed.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{bed.roomNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{bed.room.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${bed.status === 'available' ? 'bg-green-100 text-green-800' :
                       bed.status === 'occupied' ? 'bg-red-100 text-red-800' :
                       'bg-yellow-100 text-yellow-800'}`}>
                      {bed.status === 'available' ? 'Tersedia' :
                       bed.status === 'occupied' ? 'Terisi' : 'Perawatan'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {bed.inpatients.length > 0 ? (
                      <ul>
                        {bed.inpatients.map(ip => (
                          <li key={ip.id}>{ip.patient.name}</li>
                        ))}
                      </ul>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleStatusUpdate(bed.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Status
                    </button>
                    <button 
                      onClick={() => handleEdit(bed)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(bed.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!beds || beds.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data tempat tidur
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
                {editingBed ? 'Edit Tempat Tidur' : 'Tambah Tempat Tidur Baru'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Tempat Tidur *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nama tempat tidur"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor Kamar *
                    </label>
                    <input
                      type="text"
                      id="roomNumber"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nomor kamar tempat tidur"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih Kamar *
                    </label>
                    <select
                      id="roomId"
                      name="roomId"
                      value={formData.roomId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Kamar</option>
                      {rooms?.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name} - {room.type}
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
                      <option value="available">Tersedia</option>
                      <option value="occupied">Terisi</option>
                      <option value="maintenance">Perawatan</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description || ''}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Deskripsi tempat tidur"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingBed(null);
                      setFormData({
                        name: '',
                        roomNumber: '',
                        roomId: '',
                        status: 'available',
                        description: '',
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
                    {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : (editingBed ? 'Perbarui' : 'Simpan')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pembaruan Status */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Pembaruan Status Tempat Tidur</h2>
              
              <form onSubmit={handleStatusSubmit}>
                <div className="mb-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status Baru
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={statusData.status}
                    onChange={handleStatusChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="available">Tersedia</option>
                    <option value="occupied">Terisi</option>
                    <option value="maintenance">Perawatan</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsStatusModalOpen(false);
                      setStatusBedId(null);
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

export default BedManagement;