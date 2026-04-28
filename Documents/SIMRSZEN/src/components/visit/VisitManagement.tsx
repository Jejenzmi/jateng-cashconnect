import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface Patient {
  id: string;
  name: string;
  nik: string;
  medicalRecordNumber: string;
}

interface Doctor {
  id: string;
  fullName: string;
  specialization: string;
}

interface Room {
  id: string;
  name: string;
  type: string;
}

interface Visit {
  id: string;
  patientId: string;
  patient: Patient;
  doctorId: string;
  doctor: Doctor;
  roomId: string;
  room: Room;
  visitNumber: string;
  visitDate: string;
  chiefComplaint: string;
  diagnosis?: string;
  notes?: string;
  status: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

const VisitManagement = () => {
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusUpdateId, setStatusUpdateId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('registered');
  
  const [formData, setFormData] = useState<Omit<Visit, 'id' | 'patient' | 'doctor' | 'room' | 'visitNumber' | 'startedAt' | 'completedAt' | 'cancelledAt' | 'createdAt' | 'updatedAt'>>({
    patientId: '',
    doctorId: '',
    roomId: '',
    visitDate: new Date().toISOString().slice(0, 16),
    chiefComplaint: '',
    diagnosis: '',
    notes: '',
    status: 'registered',
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

  const { data: rooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/rooms`);
      return response.data.data as Room[];
    }
  });

  const { data: visits, isLoading, isError } = useQuery({
    queryKey: ['visits'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/visits`);
      return response.data.data as Visit[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (visitData: Omit<Visit, 'id' | 'patient' | 'doctor' | 'room' | 'visitNumber' | 'startedAt' | 'completedAt' | 'cancelledAt' | 'createdAt' | 'updatedAt'>) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/visits`, visitData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      setIsModalOpen(false);
      setEditingVisit(null);
      setFormData({
        patientId: '',
        doctorId: '',
        roomId: '',
        visitDate: new Date().toISOString().slice(0, 16),
        chiefComplaint: '',
        diagnosis: '',
        notes: '',
        status: 'registered',
      });
      toast.success(editingVisit ? 'Kunjungan berhasil diperbarui' : 'Kunjungan berhasil ditambahkan');
    },
    onError: (error: any) => {
      console.error('Error saving visit:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal menyimpan data kunjungan');
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...visitData }: Visit) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/visits/${id}`, visitData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      setIsModalOpen(false);
      setEditingVisit(null);
      setFormData({
        patientId: '',
        doctorId: '',
        roomId: '',
        visitDate: new Date().toISOString().slice(0, 16),
        chiefComplaint: '',
        diagnosis: '',
        notes: '',
        status: 'registered',
      });
      toast.success('Kunjungan berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating visit:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal memperbarui data kunjungan');
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/visits/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      toast.success('Kunjungan berhasil dihapus');
    },
    onError: (error: any) => {
      console.error('Error deleting visit:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus data kunjungan');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/visits/${id}/status`, {
        status
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      setIsStatusModalOpen(false);
      setStatusUpdateId(null);
      toast.success('Status kunjungan berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating visit status:', error);
      toast.error(error.response?.data?.message || 'Gagal memperbarui status kunjungan');
    }
  });

  useEffect(() => {
    if (editingVisit) {
      setFormData({
        patientId: editingVisit.patientId,
        doctorId: editingVisit.doctorId,
        roomId: editingVisit.roomId,
        visitDate: editingVisit.visitDate.slice(0, 16),
        chiefComplaint: editingVisit.chiefComplaint,
        diagnosis: editingVisit.diagnosis || '',
        notes: editingVisit.notes || '',
        status: editingVisit.status,
      });
      setIsModalOpen(true);
    }
  }, [editingVisit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVisit) {
      updateMutation.mutate({ ...editingVisit, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'visitDate' ? value : value
    }));
  };

  const handleEdit = (visit: Visit) => {
    setEditingVisit(visit);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data kunjungan ini? Data akan dihapus secara permanen.')) {
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

  if (isError) return <div className="p-4 text-red-500">Error saat memuat data kunjungan</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Kunjungan Pasien</h1>
        <button 
          onClick={() => {
            setEditingVisit(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Kunjungan
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruangan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visits?.map((visit) => (
                <tr key={visit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{visit.visitNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{visit.patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{visit.doctor.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{visit.room.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(visit.visitDate).toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${visit.status === 'registered' ? 'bg-blue-100 text-blue-800' :
                        visit.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        visit.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'}`}>
                      {visit.status === 'registered' ? 'Terdaftar' :
                       visit.status === 'in_progress' ? 'Sedang Berlangsung' :
                       visit.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(visit)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleStatusChange(visit.id)}
                      className="text-orange-600 hover:text-orange-900 mr-3"
                    >
                      Ubah Status
                    </button>
                    <button 
                      onClick={() => handleDelete(visit.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!visits || visits.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data kunjungan pasien
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
                {editingVisit ? 'Edit Kunjungan' : 'Tambah Kunjungan Baru'}
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
                          {patient.name} ({patient.medicalRecordNumber})
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
                    <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih Ruangan *
                    </label>
                    <select
                      id="roomId"
                      name="roomId"
                      value={formData.roomId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Ruangan</option>
                      {rooms?.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name} - {room.type}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="visitDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Kunjungan *
                    </label>
                    <input
                      type="datetime-local"
                      id="visitDate"
                      name="visitDate"
                      value={formData.visitDate}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="chiefComplaint" className="block text-sm font-medium text-gray-700 mb-1">
                      Keluhan Utama *
                    </label>
                    <textarea
                      id="chiefComplaint"
                      name="chiefComplaint"
                      value={formData.chiefComplaint}
                      onChange={handleChange}
                      required
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Keluhan utama pasien"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                      Diagnosis
                    </label>
                    <textarea
                      id="diagnosis"
                      name="diagnosis"
                      value={formData.diagnosis || ''}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Diagnosis dokter"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Catatan
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes || ''}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Catatan tambahan tentang kunjungan"
                    />
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
                      <option value="registered">Terdaftar</option>
                      <option value="in_progress">Sedang Berlangsung</option>
                      <option value="completed">Selesai</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingVisit(null);
                      setFormData({
                        patientId: '',
                        doctorId: '',
                        roomId: '',
                        visitDate: new Date().toISOString().slice(0, 16),
                        chiefComplaint: '',
                        diagnosis: '',
                        notes: '',
                        status: 'registered',
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
                    {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : (editingVisit ? 'Perbarui' : 'Simpan')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ubah Status Kunjungan */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Ubah Status Kunjungan</h2>
              
              <form onSubmit={handleStatusSubmit}>
                <div className="mb-4">
                  <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700 mb-1">
                    Status Kunjungan Baru
                  </label>
                  <select
                    id="newStatus"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="registered">Terdaftar</option>
                    <option value="in_progress">Sedang Berlangsung</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsStatusModalOpen(false);
                      setStatusUpdateId(null);
                      setNewStatus('registered');
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

export default VisitManagement;