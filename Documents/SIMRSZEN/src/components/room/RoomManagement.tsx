import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface Room {
  id: string;
  name: string;
  type: string;
  floor?: number;
  capacity: number;
  available: number;
  createdAt: string;
  updatedAt: string;
}

const RoomManagement = () => {
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Room, 'id' | 'createdAt' | 'updatedAt' | 'available'>>({
    name: '',
    type: '',
    floor: 0,
    capacity: 1,
  });
  
  const queryClient = useQueryClient();

  const { data: rooms, isLoading, isError } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/rooms`);
      return response.data.data as Room[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt' | 'available'>) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/rooms`, roomData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setIsModalOpen(false);
      setEditingRoom(null);
      setFormData({
        name: '',
        type: '',
        floor: 0,
        capacity: 1,
      });
      toast.success(editingRoom ? 'Ruangan berhasil diperbarui' : 'Ruangan berhasil ditambahkan');
    },
    onError: (error: any) => {
      console.error('Error saving room:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal menyimpan data ruangan');
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...roomData }: Omit<Room, 'available'>) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/rooms/${id}`, roomData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setIsModalOpen(false);
      setEditingRoom(null);
      setFormData({
        name: '',
        type: '',
        floor: 0,
        capacity: 1,
      });
      toast.success('Ruangan berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating room:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal memperbarui data ruangan');
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/rooms/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Ruangan berhasil dihapus');
    },
    onError: (error: any) => {
      console.error('Error deleting room:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus data ruangan');
    }
  });

  useEffect(() => {
    if (editingRoom) {
      setFormData({
        name: editingRoom.name,
        type: editingRoom.type,
        floor: editingRoom.floor || 0,
        capacity: editingRoom.capacity,
      });
      setIsModalOpen(true);
    }
  }, [editingRoom]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRoom) {
      updateMutation.mutate({ ...editingRoom, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'floor' || name === 'capacity' ? Number(value) : value
    }));
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data ruangan ini? Data akan dihapus secara permanen.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isError) return <div className="p-4 text-red-500">Error saat memuat data ruangan</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Ruangan</h1>
        <button 
          onClick={() => {
            setEditingRoom(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Ruangan
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Ruangan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lantai</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kapasitas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tersedia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms?.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{room.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{room.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{room.floor !== undefined ? room.floor : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{room.capacity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${room.available > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {room.available} tersedia
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(room)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(room.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!rooms || rooms.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data ruangan
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
                {editingRoom ? 'Edit Ruangan' : 'Tambah Ruangan Baru'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Ruangan *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nama ruangan"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Tipe Ruangan *
                    </label>
                    <input
                      type="text"
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tipe ruangan (ICU, Reguler, dll)"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
                      Lantai
                    </label>
                    <input
                      type="number"
                      id="floor"
                      name="floor"
                      value={formData.floor}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Lantai tempat ruangan"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                      Kapasitas
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Kapasitas maksimal ruangan"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingRoom(null);
                      setFormData({
                        name: '',
                        type: '',
                        floor: 0,
                        capacity: 1,
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
                    {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : (editingRoom ? 'Perbarui' : 'Simpan')}
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

export default RoomManagement;