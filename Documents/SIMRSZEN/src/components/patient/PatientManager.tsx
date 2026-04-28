import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Patient {
  id: string;
  patientId: string;
  nik: string;
  noKartu: string;
  nama: string;
  jenisKelamin: string;
  tanggalLahir: string;
  noHp: string;
  alamat: string;
  createdAt: string;
}

const PatientManager: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  
  const [formData, setFormData] = useState({
    patientId: '',
    nik: '',
    noKartu: '',
    nama: '',
    jenisKelamin: 'L',
    tanggalLahir: '',
    noHp: '',
    alamat: '',
  });

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/patients`);
        setPatients(response.data.data);
      } catch (err) {
        setError('Gagal mengambil data pasien');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPatient) {
        // Update existing patient
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/patients/${editingPatient.id}`, formData);
      } else {
        // Create new patient
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/patients`, formData);
      }
      
      // Refresh data
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/patients`);
      setPatients(response.data.data);
      
      // Reset form
      setFormData({
        patientId: '',
        nik: '',
        noKartu: '',
        nama: '',
        jenisKelamin: 'L',
        tanggalLahir: '',
        noHp: '',
        alamat: '',
      });
      setShowForm(false);
      setEditingPatient(null);
    } catch (err) {
      console.error('Error saving patient:', err);
      alert('Gagal menyimpan data pasien');
    }
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      patientId: patient.patientId,
      nik: patient.nik || '',
      noKartu: patient.noKartu || '',
      nama: patient.nama,
      jenisKelamin: patient.jenisKelamin,
      tanggalLahir: patient.tanggalLahir.split('T')[0],
      noHp: patient.noHp || '',
      alamat: patient.alamat || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pasien ini?')) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/patients/${id}`);
      
      // Refresh data
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/patients`);
      setPatients(response.data.data);
    } catch (err) {
      console.error('Error deleting patient:', err);
      alert('Gagal menghapus data pasien');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Manajemen Pasien</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Daftar pasien terdaftar dalam sistem
            </p>
          </div>
          <button
            onClick={() => {
              setEditingPatient(null);
              setFormData({
                patientId: '',
                nik: '',
                noKartu: '',
                nama: '',
                jenisKelamin: 'L',
                tanggalLahir: '',
                noHp: '',
                alamat: '',
              });
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Tambah Pasien
          </button>
        </div>
        
        {showForm && (
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-5 sm:px-6">
            <h3 className="text-md leading-6 font-medium text-gray-900 mb-4">
              {editingPatient ? 'Edit Pasien' : 'Tambah Pasien Baru'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                    ID Pasien *
                  </label>
                  <input
                    type="text"
                    id="patientId"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    placeholder="Contoh: P001"
                  />
                </div>
                
                <div>
                  <label htmlFor="nik" className="block text-sm font-medium text-gray-700">
                    NIK
                  </label>
                  <input
                    type="text"
                    id="nik"
                    name="nik"
                    value={formData.nik}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    placeholder="Nomor Induk Kependudukan"
                  />
                </div>
                
                <div>
                  <label htmlFor="noKartu" className="block text-sm font-medium text-gray-700">
                    No Kartu BPJS
                  </label>
                  <input
                    type="text"
                    id="noKartu"
                    name="noKartu"
                    value={formData.noKartu}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    placeholder="Nomor kartu BPJS"
                  />
                </div>
                
                <div>
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    placeholder="Nama lengkap pasien"
                  />
                </div>
                
                <div>
                  <label htmlFor="jenisKelamin" className="block text-sm font-medium text-gray-700">
                    Jenis Kelamin *
                  </label>
                  <select
                    id="jenisKelamin"
                    name="jenisKelamin"
                    value={formData.jenisKelamin}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="tanggalLahir" className="block text-sm font-medium text-gray-700">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    id="tanggalLahir"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>
                
                <div>
                  <label htmlFor="noHp" className="block text-sm font-medium text-gray-700">
                    No HP
                  </label>
                  <input
                    type="text"
                    id="noHp"
                    name="noHp"
                    value={formData.noHp}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    placeholder="Nomor handphone"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">
                    Alamat
                  </label>
                  <textarea
                    id="alamat"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    placeholder="Alamat lengkap pasien"
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPatient(null);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {editingPatient ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Pasien
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis Kelamin
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tgl Lahir
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No HP
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {patient.patientId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.nama}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.tanggalLahir ? formatDate(patient.tanggalLahir) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.noHp || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(patient)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(patient.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {patients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data pasien. Silakan tambahkan pasien baru.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientManager;