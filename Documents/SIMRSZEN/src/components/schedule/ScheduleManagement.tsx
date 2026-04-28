import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface Doctor {
  id: string;
  fullName: string;
  specialization: string;
}

interface Schedule {
  id: string;
  doctorId: string;
  doctor: Doctor;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  maxVisits: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ScheduleManagement = () => {
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Schedule, 'id' | 'doctor' | 'createdAt' | 'updatedAt'>>({
    doctorId: '',
    dayOfWeek: 'MONDAY',
    startTime: '08:00',
    endTime: '16:00',
    maxVisits: 20,
    isActive: true,
  });
  
  const queryClient = useQueryClient();

  const { data: doctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/doctors`);
      return response.data.data as Doctor[];
    }
  });

  const { data: schedules, isLoading, isError } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/schedules`);
      return response.data.data as Schedule[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (scheduleData: Omit<Schedule, 'id' | 'doctor' | 'createdAt' | 'updatedAt'>) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/schedules`, scheduleData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setIsModalOpen(false);
      setEditingSchedule(null);
      setFormData({
        doctorId: '',
        dayOfWeek: 'MONDAY',
        startTime: '08:00',
        endTime: '16:00',
        maxVisits: 20,
        isActive: true,
      });
      toast.success(editingSchedule ? 'Jadwal dokter berhasil diperbarui' : 'Jadwal dokter berhasil ditambahkan');
    },
    onError: (error: any) => {
      console.error('Error saving schedule:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal menyimpan data jadwal dokter');
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...scheduleData }: Schedule) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/schedules/${id}`, scheduleData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setIsModalOpen(false);
      setEditingSchedule(null);
      setFormData({
        doctorId: '',
        dayOfWeek: 'MONDAY',
        startTime: '08:00',
        endTime: '16:00',
        maxVisits: 20,
        isActive: true,
      });
      toast.success('Jadwal dokter berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating schedule:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal memperbarui data jadwal dokter');
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/schedules/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast.success('Jadwal dokter berhasil dihapus');
    },
    onError: (error: any) => {
      console.error('Error deleting schedule:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus data jadwal dokter');
    }
  });

  useEffect(() => {
    if (editingSchedule) {
      setFormData({
        doctorId: editingSchedule.doctorId,
        dayOfWeek: editingSchedule.dayOfWeek,
        startTime: editingSchedule.startTime,
        endTime: editingSchedule.endTime,
        maxVisits: editingSchedule.maxVisits,
        isActive: editingSchedule.isActive,
      });
      setIsModalOpen(true);
    }
  }, [editingSchedule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSchedule) {
      updateMutation.mutate({ ...editingSchedule, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'maxVisits' ? Number(value) : value
    }));
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus jadwal dokter ini? Data akan dihapus secara permanen.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isError) return <div className="p-4 text-red-500">Error saat memuat data jadwal dokter</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Jadwal Dokter</h1>
        <button 
          onClick={() => {
            setEditingSchedule(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Jadwal
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spesialisasi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hari</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maks. Kunjungan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedules?.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{schedule.doctor.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{schedule.doctor.specialization}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{schedule.dayOfWeek}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{schedule.startTime} - {schedule.endTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{schedule.maxVisits}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${schedule.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {schedule.isActive ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(schedule)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(schedule.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!schedules || schedules.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data jadwal dokter
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
                {editingSchedule ? 'Edit Jadwal Dokter' : 'Tambah Jadwal Dokter Baru'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih Dokter *
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
                    <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700 mb-1">
                      Hari dalam Seminggu *
                    </label>
                    <select
                      id="dayOfWeek"
                      name="dayOfWeek"
                      value={formData.dayOfWeek}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="MONDAY">Senin</option>
                      <option value="TUESDAY">Selasa</option>
                      <option value="WEDNESDAY">Rabu</option>
                      <option value="THURSDAY">Kamis</option>
                      <option value="FRIDAY">Jumat</option>
                      <option value="SATURDAY">Sabtu</option>
                      <option value="SUNDAY">Minggu</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Jam Mulai *
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Jam Selesai *
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="maxVisits" className="block text-sm font-medium text-gray-700 mb-1">
                      Maks. Kunjungan
                    </label>
                    <input
                      type="number"
                      id="maxVisits"
                      name="maxVisits"
                      value={formData.maxVisits}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Jumlah maksimal kunjungan per hari"
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
                      setEditingSchedule(null);
                      setFormData({
                        doctorId: '',
                        dayOfWeek: 'MONDAY',
                        startTime: '08:00',
                        endTime: '16:00',
                        maxVisits: 20,
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
                    {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : (editingSchedule ? 'Perbarui' : 'Simpan')}
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

export default ScheduleManagement;