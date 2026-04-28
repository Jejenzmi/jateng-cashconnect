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

interface Visit {
  id: string;
  visitNumber: string;
  chiefComplaint: string;
}

interface Room {
  id: string;
  name: string;
  type: string;
}

interface Bed {
  id: string;
  name: string;
  roomNumber: string;
  status: string;
}

interface Doctor {
  id: string;
  fullName: string;
  specialization: string;
}

interface Inpatient {
  id: string;
  patientId: string;
  patient: Patient;
  visitId: string;
  visit: Visit;
  roomId: string;
  room: Room;
  bedId: string;
  bed: Bed;
  attendingDoctorId: string;
  attendingDoctor: Doctor;
  admissionDate: string;
  admissionReason: string;
  dischargeDate?: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const InpatientManagement = () => {
  const [editingInpatient, setEditingInpatient] = useState<Inpatient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferPatientId, setTransferPatientId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Inpatient, 'id' | 'patient' | 'visit' | 'room' | 'bed' | 'attendingDoctor' | 'createdAt' | 'updatedAt'>>({
    patientId: '',
    visitId: '',
    roomId: '',
    bedId: '',
    attendingDoctorId: '',
    admissionDate: new Date().toISOString().slice(0, 16),
    admissionReason: '',
    dischargeDate: undefined,
    notes: '',
    status: 'admitted',
  });
  
  const queryClient = useQueryClient();

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/patients`);
      return response.data.data as Patient[];
    }
  });

  const { data: visits } = useQuery({
    queryKey: ['visits'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/visits`);
      return response.data.data as Visit[];
    }
  });

  const { data: rooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/rooms`);
      return response.data.data as Room[];
    }
  });

  const { data: beds } = useQuery({
    queryKey: ['beds'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/beds`);
      return response.data.data as Bed[];
    }
  });

  const { data: doctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/doctors`);
      return response.data.data as Doctor[];
    }
  });

  const { data: inpatients, isLoading, isError } = useQuery({
    queryKey: ['inpatients'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/inpatients`);
      return response.data.data as Inpatient[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (inpatientData: Omit<Inpatient, 'id' | 'patient' | 'visit' | 'room' | 'bed' | 'attendingDoctor' | 'createdAt' | 'updatedAt'>) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/inpatients`, inpatientData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inpatients'] });
      setIsModalOpen(false);
      setEditingInpatient(null);
      setFormData({
        patientId: '',
        visitId: '',
        roomId: '',
        bedId: '',
        attendingDoctorId: '',
        admissionDate: new Date().toISOString().slice(0, 16),
        admissionReason: '',
        dischargeDate: undefined,
        notes: '',
        status: 'admitted',
      });
      toast.success(editingInpatient ? 'Rawat inap berhasil diperbarui' : 'Rawat inap berhasil ditambahkan');
    },
    onError: (error: any) => {
      console.error('Error saving inpatient:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal menyimpan data rawat inap');
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...inpatientData }: Inpatient) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/inpatients/${id}`, inpatientData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inpatients'] });
      setIsModalOpen(false);
      setEditingInpatient(null);
      setFormData({
        patientId: '',
        visitId: '',
        roomId: '',
        bedId: '',
        attendingDoctorId: '',
        admissionDate: new Date().toISOString().slice(0, 16),
        admissionReason: '',
        dischargeDate: undefined,
        notes: '',
        status: 'admitted',
      });
      toast.success('Rawat inap berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating inpatient:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal memperbarui data rawat inap');
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/inpatients/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inpatients'] });
      toast.success('Rawat inap berhasil dihapus');
    },
    onError: (error: any) => {
      console.error('Error deleting inpatient:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus data rawat inap');
    }
  });

  const transferMutation = useMutation({
    mutationFn: async ({ id, roomId, bedId, reason }: { id: string; roomId: string; bedId: string; reason: string }) => {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/inpatients/${id}/transfer`, {
        roomId,
        bedId,
        reason
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inpatients'] });
      setIsTransferModalOpen(false);
      setTransferPatientId(null);
      toast.success('Pasien berhasil dipindahkan');
    },
    onError: (error: any) => {
      console.error('Error transferring patient:', error);
      toast.error(error.response?.data?.message || 'Gagal memindahkan pasien');
    }
  });

  useEffect(() => {
    if (editingInpatient) {
      setFormData({
        patientId: editingInpatient.patientId,
        visitId: editingInpatient.visitId,
        roomId: editingInpatient.roomId,
        bedId: editingInpatient.bedId,
        attendingDoctorId: editingInpatient.attendingDoctorId,
        admissionDate: editingInpatient.admissionDate.slice(0, 16),
        admissionReason: editingInpatient.admissionReason,
        dischargeDate: editingInpatient.dischargeDate?.slice(0, 16),
        notes: editingInpatient.notes || '',
        status: editingInpatient.status,
      });
      setIsModalOpen(true);
    }
  }, [editingInpatient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingInpatient) {
      updateMutation.mutate({ ...editingInpatient, ...formData });
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

  const handleEdit = (inpatient: Inpatient) => {
    setEditingInpatient(inpatient);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data rawat inap ini? Data akan dihapus secara permanen.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleTransfer = (id: string) => {
    setTransferPatientId(id);
    setIsTransferModalOpen(true);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (transferPatientId && formData.roomId && formData.bedId) {
      transferMutation.mutate({
        id: transferPatientId,
        roomId: formData.roomId,
        bedId: formData.bedId,
        reason: 'Pemindahan kamar'
      });
    }
  };

  if (isError) return <div className="p-4 text-red-500">Error saat memuat data rawat inap</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Rawat Inap</h1>
        <button 
          onClick={() => {
            setEditingInpatient(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Rawat Inap
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kamar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tempat Tidur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokter Penanggung Jawab</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inpatients?.map((inpatient) => (
                <tr key={inpatient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{inpatient.visit.visitNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{inpatient.patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{inpatient.room.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{inpatient.bed.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{inpatient.attendingDoctor.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${inpatient.status === 'admitted' ? 'bg-blue-100 text-blue-800' :
                        inpatient.status === 'discharged' ? 'bg-green-100 text-green-800' :
                        inpatient.status === 'transferred' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                      {inpatient.status === 'admitted' ? 'Dirawat' :
                       inpatient.status === 'discharged' ? 'Pulang' :
                       inpatient.status === 'transferred' ? 'Dipindahkan' : 'Meninggal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(inpatient)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleTransfer(inpatient.id)}
                      className="text-orange-600 hover:text-orange-900 mr-3"
                    >
                      Pindah Kamar
                    </button>
                    <button 
                      onClick={() => handleDelete(inpatient.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!inpatients || inpatients.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data rawat inap
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
                {editingInpatient ? 'Edit Rawat Inap' : 'Tambah Rawat Inap Baru'}
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
                    <label htmlFor="visitId" className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih Kunjungan *
                    </label>
                    <select
                      id="visitId"
                      name="visitId"
                      value={formData.visitId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Kunjungan</option>
                      {visits?.map((visit) => (
                        <option key={visit.id} value={visit.id}>
                          {visit.visitNumber} - {visit.chiefComplaint}
                        </option>
                      ))}
                    </select>
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
                    <label htmlFor="bedId" className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih Tempat Tidur *
                    </label>
                    <select
                      id="bedId"
                      name="bedId"
                      value={formData.bedId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Tempat Tidur</option>
                      {beds?.filter(bed => bed.status === 'available' || editingInpatient?.bedId === bed.id).map((bed) => (
                        <option key={bed.id} value={bed.id}>
                          {bed.name} ({bed.status})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="attendingDoctorId" className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih Dokter Penanggung Jawab *
                    </label>
                    <select
                      id="attendingDoctorId"
                      name="attendingDoctorId"
                      value={formData.attendingDoctorId}
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
                    <label htmlFor="admissionDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Masuk *
                    </label>
                    <input
                      type="datetime-local"
                      id="admissionDate"
                      name="admissionDate"
                      value={formData.admissionDate}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="admissionReason" className="block text-sm font-medium text-gray-700 mb-1">
                      Alasan Rawat Inap *
                    </label>
                    <textarea
                      id="admissionReason"
                      name="admissionReason"
                      value={formData.admissionReason}
                      onChange={handleChange}
                      required
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Alasan rawat inap pasien"
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
                      placeholder="Catatan tambahan tentang rawat inap"
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
                      <option value="admitted">Dirawat</option>
                      <option value="discharged">Pulang</option>
                      <option value="transferred">Dipindahkan</option>
                      <option value="expired">Meninggal</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingInpatient(null);
                      setFormData({
                        patientId: '',
                        visitId: '',
                        roomId: '',
                        bedId: '',
                        attendingDoctorId: '',
                        admissionDate: new Date().toISOString().slice(0, 16),
                        admissionReason: '',
                        dischargeDate: undefined,
                        notes: '',
                        status: 'admitted',
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
                    {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : (editingInpatient ? 'Perbarui' : 'Simpan')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pemindahan Pasien */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Pindahkan Pasien</h2>
              
              <form onSubmit={handleTransferSubmit}>
                <div className="mb-4">
                  <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">
                    Pilih Kamar Tujuan
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
                
                <div className="mb-4">
                  <label htmlFor="bedId" className="block text-sm font-medium text-gray-700 mb-1">
                    Pilih Tempat Tidur Tujuan
                  </label>
                  <select
                    id="bedId"
                    name="bedId"
                    value={formData.bedId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Tempat Tidur</option>
                    {beds?.filter(bed => bed.status === 'available').map((bed) => (
                      <option key={bed.id} value={bed.id}>
                        {bed.name} ({bed.status})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsTransferModalOpen(false);
                      setTransferPatientId(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={transferMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {transferMutation.isPending ? 'Memproses...' : 'Pindahkan'}
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

export default InpatientManagement;