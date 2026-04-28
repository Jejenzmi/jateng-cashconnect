import React, { useState } from 'react';

interface SpiritualReport {
  id: string;
  patientName: string;
  serviceDate: string;
  clergy: string;
  serviceType: string;
  outcome: string;
  notes: string;
  satisfactionRating: number;
}

const SpiritualCareReports = () => {
  const [reports, setReports] = useState<SpiritualReport[]>([
    {
      id: 'SCR-001',
      patientName: 'Ahmad Fauzi',
      serviceDate: '2026-04-18',
      clergy: 'Ustadz Ahmad Fikri',
      serviceType: 'Dzikir & Doa',
      outcome: 'Pasien merasa lebih tenang dan siap menjalani tindakan medis',
      notes: 'Pendampingan spiritual sebelum operasi berjalan lancar',
      satisfactionRating: 5
    },
    {
      id: 'SCR-002',
      patientName: 'Maria Sitorus',
      serviceDate: '2026-04-19',
      clergy: 'Pdt. Dr. Johannes Christian',
      serviceType: 'Pelayanan Ibadah',
      outcome: 'Pasien mendapatkan ketenangan spiritual di tengah penderitaan',
      notes: 'Ibadah dilakukan di kamar pasien sesuai permintaan',
      satisfactionRating: 4
    },
    {
      id: 'SCR-003',
      patientName: 'I Wayan Suarta',
      serviceDate: '2026-04-17',
      clergy: 'Ida Pedanda Gde Putra',
      serviceType: 'Doa Bersama',
      outcome: 'Keluarga pasien merasa didukung secara spiritual',
      notes: 'Acara berlangsung khidmat dengan partisipasi keluarga',
      satisfactionRating: 5
    },
    {
      id: 'SCR-004',
      patientName: 'Ni Luh Ketut',
      serviceDate: '2026-04-20',
      clergy: 'Bhikkhu Thich Minh',
      serviceType: 'Meditasi',
      outcome: 'Pasien mencapai tingkat relaksasi yang baik',
      notes: 'Meditasi dipandu dengan teknik pernapasan',
      satisfactionRating: 4
    }
  ]);

  const [reportPeriod, setReportPeriod] = useState('monthly');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Laporan Pelayanan Rohani</h1>
      
      <div className="mb-6 flex space-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Periode Laporan</label>
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="daily">Harian</option>
            <option value="weekly">Mingguan</option>
            <option value="monthly">Bulanan</option>
            <option value="quarterly">Triwulan</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Generate Laporan
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Laporan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pasien</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Petugas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Layanan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hasil</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.patientName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.serviceDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.clergy}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.serviceType}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">{report.outcome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < report.satisfactionRating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Statistik Pelayanan Rohani</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Pelayanan Bulan Ini</p>
            <p className="text-2xl font-bold mt-1">36</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-600">Rata-rata Rating Kepuasan</p>
            <p className="text-2xl font-bold mt-1">4.4/5</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-600">Pelayanan Terbanyak</p>
            <p className="text-2xl font-bold mt-1">Islam</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-600">Petugas Teraktif</p>
            <p className="text-lg font-bold mt-1">Ust. Ahmad</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Umpan Balik Pasien</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm italic">"Pendampingan spiritual sangat membantu saya dalam menghadapi penyakit ini. Terima kasih atas kehadiran Ustadz."</p>
              <p className="text-xs text-gray-600 mt-1">- Ahmad Fauzi</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm italic">"Ibadah di kamar memberikan ketenangan bagi saya dan keluarga di masa-masa sulit ini."</p>
              <p className="text-xs text-gray-600 mt-1">- Maria Sitorus</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpiritualCareReports;