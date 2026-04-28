import React, { useState } from 'react';

interface SpiritualRequest {
  id: string;
  patientName: string;
  religion: string;
  requestType: string;
  requestDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  assignedClergy: string;
  notes: string;
}

const SpiritualServiceRequests = () => {
  const [requests, setRequests] = useState<SpiritualRequest[]>([
    {
      id: 'SRQ-001',
      patientName: 'Ahmad Fauzi',
      religion: 'Islam',
      requestType: 'Dzikir & Doa',
      requestDate: '2026-04-18',
      status: 'In Progress',
      assignedClergy: 'Ustadz Ahmad',
      notes: 'Pasien membutuhkan ketenangan spiritual menjelang operasi'
    },
    {
      id: 'SRQ-002',
      patientName: 'Maria Sitorus',
      religion: 'Kristen',
      requestType: 'Pelayanan Ibadah',
      requestDate: '2026-04-19',
      status: 'Pending',
      assignedClergy: '-',
      notes: 'Pasien ingin dilayani ibadah di kamar'
    },
    {
      id: 'SRQ-003',
      patientName: 'I Wayan Suarta',
      religion: 'Hindu',
      requestType: 'Doa Bersama',
      requestDate: '2026-04-17',
      status: 'Completed',
      assignedClergy: 'Ida Pedanda',
      notes: 'Doa bersama keluarga selesai dengan baik'
    },
    {
      id: 'SRQ-004',
      patientName: 'Ni Luh Ketut',
      religion: 'Buddha',
      requestType: 'Meditasi',
      requestDate: '2026-04-20',
      status: 'Pending',
      assignedClergy: '-',
      notes: 'Pasien ingin bimbingan meditasi untuk ketenangan'
    }
  ]);

  const updateStatus = (id: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => {
    setRequests(requests.map(req => req.id === id ? {...req, status: newStatus} : req));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Permohonan Pelayanan Rohani</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Pasien</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Agama</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Jenis Layanan</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Tanggal</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Petugas</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="py-3 px-4 text-sm text-gray-800">{request.id}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{request.patientName}</td>
                <td className="py-3 px-4 text-sm">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {request.religion}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-800">{request.requestType}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{request.requestDate}</td>
                <td className="py-3 px-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-800">{request.assignedClergy || '-'}</td>
                <td className="py-3 px-4 text-sm">
                  <div className="flex space-x-2">
                    <select
                      value={request.status}
                      onChange={(e) => updateStatus(
                        request.id, 
                        e.target.value as 'Pending' | 'In Progress' | 'Completed'
                      )}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Statistik Pelayanan</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Total Permohonan</p>
            <p className="text-2xl font-bold mt-1">24</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Dalam Proses</p>
            <p className="text-2xl font-bold mt-1 text-blue-600">8</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Selesai</p>
            <p className="text-2xl font-bold mt-1 text-green-600">14</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Belum Ditugaskan</p>
            <p className="text-2xl font-bold mt-1 text-yellow-600">2</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpiritualServiceRequests;