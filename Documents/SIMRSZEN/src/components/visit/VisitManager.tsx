import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Patient {
  id: string;
  patientId: string;
  nama: string;
}

interface Poli {
  id: string;
  kode: string;
  nama: string;
}

interface Dokter {
  id: string;
  kode: string;
  nama: string;
}

interface Visit {
  id: string;
  visitId: string;
  patientId: string;
  poliId: string;
  dokterId: string;
  tanggalPeriksa: string;
  catatan: string;
  statusKunjungan: string;
  createdAt: string;
}

const VisitManager: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [polis, setPolis] = useState<Poli[]>([]);
  const [dokters, setDokters] = useState<Dokter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  
  const [formData, setFormData] = useState({
    visitId: '',
    patientId: '',
    poliId: '',
    dokterId: '',
    tanggalPeriksa: new Date().toISOString().split('T')[0],
    catatan: '',
    statusKunjungan: 'daftar',
  });

  // Fetch all required data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [visitsRes, patientsRes, polisRes, doktersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/visits`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/patients`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/polis`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/dokters`)
        ]);
        
        setVisits(visitsRes.data.data);
        setPatients(patientsRes.data.data);
        setPolis(polisRes.data.data);
        setDokters(doktersRes.data.data);
      } catch (err) {
        setError('Gagal mengambil data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      if (editingVisit) {
        // Update existing visit
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/visits/${editingVisit.id}`, formData);
      } else {
        // Create new visit
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/visits`, formData);
      }
      
      // Refresh data
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/visits`);
      setVisits(response.data.data);
      
      // Reset form
      setFormData({
        visitId: '',
        patientId: '',
        poliId: '',
        dokterId: '',
        tanggalPeriksa: new Date().toISOString().split('T')[0],
        catatan: '',
        statusKunjungan: 'daftar',
      });
      setShowForm(false);
      setEditingVisit(null);
    } catch (err) {
      console.error('Error saving visit:', err);
      alert('Gagal menyimpan data kunjungan');
    }
  };

  const handleEdit = (visit: Visit) => {
    setEditingVisit(visit);
    setFormData({
      visitId: visit.visitId,
      patientId: visit.patientId,
      poliId: visit.poliId,
      dokterId: visit.dokterId,
      tanggalPeriksa: visit.tanggalPeriksa.split('T')[0],
      catatan: visit.catatan || '',
      statusKunjungan: visit.statusKunjungan,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kunjungan ini?')) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/visits/${id}`);
      
      // Refresh data
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/visits`);
      setVisits(response.data.data);
    } catch (err) {
      console.error('Error deleting visit:', err);
      alert('Gagal menghapus data kunjungan');
    }
  };

  const syncToBpjs = async (visitId: string, syncType: 'registration' | 'treatment') => {
    try {
      let endpoint = '';
      let message = '';
      
      switch(syncType) {
        case 'registration':
          endpoint = `/sync/registration/${visitId}`;
          message = 'Registrasi';
          break;
        case 'treatment':
          endpoint = `/sync/treatment/${visitId}`;
          message = 'Tindakan';
          break;
        default:
          throw new Error('Invalid sync type');
      }
      
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/bpjs/${endpoint}`);
      alert(`${message} berhasil dikirim ke BPJS`);
    } catch (err) {
      console.error(`Error syncing ${syncType} to BPJS:`, err);
      alert(`Gagal mengirim ${syncType} ke BPJS`);
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
            <h3 className="text-lg leading-6 font-medium text-gray-900">Manajemen Kunjungan</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Daftar kunjungan pasien dalam sistem
            </p>
          </div>
          <button
            onClick={() => {
              setEditingVisit(null);
              setFormData({
                visitId: '',
                patientId: '',
                poliId: '',
                dokterId: '',
                tanggalPeriksa: new Date().toISOString().split('T')[0],
                catatan: '',
                statusKunjungan: 'daftar',
              });
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Tambah Kunjungan
          </button>
        </div>
        
        {showForm && (
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-5 sm:px-6">
            <h3 className="text-md leading-6 font-medium text-gray-900 mb-4">
              {editingVisit ? 'Edit Kunjungan' : 'Tambah Kunjungan Baru'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="visitId" className="block text-sm font-medium text-gray-700">
                    ID Kunjungan *
                  </label>
                  <input
                    type="text"
                    id="visitId"
                    name="visitId"
                    value={formData.visitId}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    placeholder="Contoh: V001"
                  />
                </div>
                
                <div>
                  <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                    Pasien *
                  </label>
                  <select
                    id="patientId"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  >
                    <option value="">Pilih Pasien</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.patientId} - {patient.nama}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="poliId" className="block text-sm font-medium text-gray-700">
                    Poli *
                  </label>
                  <select
                    id="poliId"
                    name="poliId"
                    value={formData.poliId}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  >
                    <option value="">Pilih Poli</option>
                    {polis.map(poli => (
                      <option key={poli.id} value={poli.id}>
                        {poli.kode} - {poli.nama}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="dokterId" className="block text-sm font-medium text-gray-700">
                    Dokter *
                  </label>
                  <select
                    id="dokterId"
                    name="dokterId"
                    value={formData.dokterId}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  >
                    <option value="">Pilih Dokter</option>
                    {dokters.map(dokter => (
                      <option key={dokter.id} value={dokter.id}>
                        {dokter.kode} - {dokter.nama}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="tanggalPeriksa" className="block text-sm font-medium text-gray-700">
                    Tanggal Periksa *
                  </label>
                  <input
                    type="date"
                    id="tanggalPeriksa"
                    name="tanggalPeriksa"
                    value={formData.tanggalPeriksa}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>
                
                <div>
                  <label htmlFor="statusKunjungan" className="block text-sm font-medium text-gray-700">
                    Status Kunjungan *
                  </label>
                  <select
                    id="statusKunjungan"
                    name="statusKunjungan"
                    value={formData.statusKunjungan}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  >
                    <option value="daftar">Daftar</option>
                    <option value="periksa">Periksa</option>
                    <option value="selesai">Selesai</option>
                    <option value="batal">Batal</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="catatan" className="block text-sm font-medium text-gray-700">
                    Catatan
                  </label>
                  <textarea
                    id="catatan"
                    name="catatan"
                    value={formData.catatan}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    placeholder="Catatan kunjungan"
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingVisit(null);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {editingVisit ? 'Update' : 'Simpan'}
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
                  ID Kunjungan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pasien
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Poli
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dokter
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tgl Periksa
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visits.map((visit) => {
                const patient = patients.find(p => p.id === visit.patientId);
                const poli = polis.find(p => p.id === visit.poliId);
                const dokter = dokters.find(d => d.id === visit.dokterId);
                
                return (
                  <tr key={visit.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {visit.visitId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient ? `${patient.patientId} - ${patient.nama}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {poli ? `${poli.kode} - ${poli.nama}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dokter ? `${dokter.kode} - ${dokter.nama}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(visit.tanggalPeriksa)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        visit.statusKunjungan === 'selesai' 
                          ? 'bg-green-100 text-green-800' 
                          : visit.statusKunjungan === 'periksa'
                          ? 'bg-yellow-100 text-yellow-800'
                          : visit.statusKunjungan === 'batal'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {visit.statusKunjungan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => syncToBpjs(visit.id, 'registration')}
                        className="text-blue-600 hover:text-blue-900"
                        title="Sinkron ke BPJS (Registrasi)"
                      >
                        Reg
                      </button>
                      <button
                        onClick={() => syncToBpjs(visit.id, 'treatment')}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Sinkron ke BPJS (Tindakan)"
                      >
                        Tindak
                      </button>
                      <button
                        onClick={() => handleEdit(visit)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(visit.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {visits.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data kunjungan. Silakan tambahkan kunjungan baru.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitManager;