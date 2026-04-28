import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface Patient {
  id: string;
  name: string;
  nik: string;
}

interface Doctor {
  id: string;
  fullName: string;
  specialization: string;
}

interface Schedule {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface Appointment {
  id: string;
  patientId: string;
  patient: Patient;
  doctorId: string;
  doctor: Doctor;
  scheduleId: string;
  schedule: Schedule;
  appointmentDate: string;
  reason: string;
  priority: string;
  status: string;
  cancellationReason?: string;
  confirmedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const AppointmentManagement = () => {
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusUpdateId, setStatusUpdateId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('scheduled');
  const [cancellationReason, setCancellationReason] = useState<string>('');
  
  const [formData, setFormData] = useState<Omit<Appointment, 'id' | 'patient' | 'doctor' | 'schedule' | 'createdAt' | 'updatedAt'>>({
    patientId: '',
    doctorId: '',
    scheduleId: '',
    appointmentDate: new Date().toISOString().slice(0, 16),
    reason: '',
    priority: 'normal',
    status: 'scheduled',
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

  const { data: schedules } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/schedules`);
      return response.data.data as Schedule[];
    }
  });

  const { data: appointments, isLoading, isError } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/appointments`);
      return response.data.data as Appointment[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (appointmentData: Omit<Appointment, 'id' | 'patient' | 'doctor' | 'schedule' | 'createdAt' | 'updatedAt'>) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/appointments`, appointmentData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setIsModalOpen(false);
      setEditingAppointment(null);
      setFormData({
        patientId: '',
        doctorId: '',
        scheduleId: '',
        appointmentDate: new Date().toISOString().slice(0, 16),
        reason: '',
        priority: 'normal',
        status: 'scheduled',
      });
      toast.success(editingAppointment ? 'Janji temu berhasil diperbarui' : 'Janji temu berhasil ditambahkan');
    },
    onError: (error: any) => {
      console.error('Error saving appointment:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal menyimpan data janji temu');
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...appointmentData }: Appointment) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/appointments/${id}`, appointmentData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setIsModalOpen(false);
      setEditingAppointment(null);
      setFormData({
        patientId: '',
        doctorId: '',
        scheduleId: '',
        appointmentDate: new Date().toISOString().slice(0, 16),
        reason: '',
        priority: 'normal',
        status: 'scheduled',
      });
      toast.success('Janji temu berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating appointment:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal memperbarui data janji temu');
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/appointments/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Janji temu berhasil dihapus');
    },
    onError: (error: any) => {
      console.error('Error deleting appointment:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus data janji temu');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, cancellationReason }: { id: string; status: string; cancellationReason?: string }) => {
      const payload: any = { status };
      if (status === 'cancelled' && cancellationReason) {
        payload.cancellationReason = cancellationReason;
      }
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/appointments/${id}/status`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setIsStatusModalOpen(false);
      setStatusUpdateId(null);
      toast.success('Status janji temu berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating appointment status:', error);
      toast.error(error.response?.data?.message || 'Gagal memperbarui status janji temu');
    }
  });

  useEffect(() => {
    if (editingAppointment) {
      setFormData({
        patientId: editingAppointment.patientId,
        doctorId: editingAppointment.doctorId,
        scheduleId: editingAppointment.scheduleId,
        appointmentDate: editingAppointment.appointmentDate.slice(0, 16),
        reason: editingAppointment.reason,
        priority: editingAppointment.priority,
        status: editingAppointment.status,
      });
      setIsModalOpen(true);
    }
  }, [editingAppointment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAppointment) {
      updateMutation.mutate({ ...editingAppointment, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'appointmentDate' ? value : value
    }));
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus janji temu ini? Data akan dihapus secara permanen.')) {
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
        status: newStatus,
        cancellationReason: newStatus === 'cancelled' ? cancellationReason : undefined
      });
    }
  };

  if (isError) return <div className="p-4 text-red-500">Error saat memuat data janji temu</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Janji Temu Pasien</h1>
        <button 
          onClick={() => {
            setEditingAppointment(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Janji Temu
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pasien</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jadwal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alasan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioritas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments?.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{appointment.patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appointment.doctor.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appointment.schedule.dayOfWeek}, {appointment.schedule.startTime}-{appointment.schedule.endTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(appointment.appointmentDate).toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appointment.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${appointment.priority === 'urgent' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                      {appointment.priority === 'urgent' ? 'Urgent' : 'Normal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {appointment.status === 'scheduled' ? 'Dijadwalkan' :
                       appointment.status === 'confirmed' ? 'Dikonfirmasi' :
                       appointment.status === 'completed' ? 'Selesai' :
                       appointment.status === 'cancelled' ? 'Dibatalkan' : 'Tidak Hadir'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(appointment)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleStatusChange(appointment.id)}
                      className="text-orange-600 hover:text-orange-900 mr-3"
                    >
                      Ubah Status
                    </button>
                    <button 
                      onClick={() => handleDelete(appointment.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!appointments || appointments.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data janji temu pasien
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
                {editingAppointment ? 'Edit Janji Temu' : 'Tambah Janji Temu Baru'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih Pasien *
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
                          {patient.name} ({patient.nik})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
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
                    <label htmlFor="scheduleId" className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih Jadwal *
                    </label>
                    <select
                      id="scheduleId"
                      name="scheduleId"
                      value={formData.scheduleId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Jadwal</option>
                      {schedules?.map((schedule) => (
                        <option key={schedule.id} value={schedule.id}>
                          {schedule.dayOfWeek} - {schedule.startTime} s/d {schedule.endTime} ({schedule.doctor.fullName})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Janji Temu *
                    </label>
                    <input
                      type="datetime-local"
                      id="appointmentDate"
                      name="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                      Alasan Konsultasi *
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Alasan konsultasi atau keluhan utama pasien"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                      Prioritas
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="scheduled">Dijadwalkan</option>
                      <option value="confirmed">Dikonfirmasi</option>
                      <option value="completed">Selesai</option>
                      <option value="cancelled">Dibatalkan</option>
                      <option value="noshow">Tidak Hadir</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingAppointment(null);
                      setFormData({
                        patientId: '',
                        doctorId: '',
                        scheduleId: '',
                        appointmentDate: new Date().toISOString().slice(0, 16),
                        reason: '',
                        priority: 'normal',
                        status: 'scheduled',
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
                    {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : (editingAppointment ? 'Perbarui' : 'Simpan')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ubah Status */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Ubah Status Janji Temu</h2>
              
              <form onSubmit={handleStatusSubmit}>
                <div className="mb-4">
                  <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700 mb-1">
                    Status Baru
                  </label>
                  <select
                    id="newStatus"
                    value={newStatus}
                    onChange={(e) => {
                      setNewStatus(e.target.value);
                      if (e.target.value !== 'cancelled') {
                        setCancellationReason('');
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="scheduled">Dijadwalkan</option>
                    <option value="confirmed">Dikonfirmasi</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                    <option value="noshow">Tidak Hadir</option>
                  </select>
                </div>
                
                {newStatus === 'cancelled' && (
                  <div className="mb-4">
                    <label htmlFor="cancellationReason" className="block text-sm font-medium text-gray-700 mb-1">
                      Alasan Pembatalan
                    </label>
                    <textarea
                      id="cancellationReason"
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Alasan pembatalan janji temu"
                    />
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsStatusModalOpen(false);
                      setStatusUpdateId(null);
                      setCancellationReason('');
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

export default AppointmentManagement;