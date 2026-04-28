import React, { useState } from 'react';

interface PsychologyReport {
  id: string;
  patientName: string;
  sessionDate: string;
  therapist: string;
  sessionType: string;
  reportSummary: string;
  nextAction: string;
}

const PsychologyReports = () => {
  const [reports, setReports] = useState<PsychologyReport[]>([
    {
      id: 'REP-PSY-001',
      patientName: 'Ahmad Fauzi',
      sessionDate: '2026-04-18',
      therapist: 'Dr. Siti Rahayu',
      sessionType: 'Individual',
      reportSummary: 'Pasien menunjukkan kemajuan dalam mengelola kecemasan. Teknik relaksasi mulai efektif.',
      nextAction: 'Lanjutkan terapi minggu depan dengan fokus pada CBT'
    },
    {
      id: 'REP-PSY-002',
      patientName: 'Sri Lestari',
      sessionDate: '2026-04-19',
      therapist: 'Dr. Budi Santoso',
      sessionType: 'Individual',
      reportSummary: 'Pasien mulai membuka diri tentang trauma masa lalu. Perlu pendekatan hati-hati.',
      nextAction: 'Rencanakan terapi dengan pendekatan trauma-informed care'
    },
    {
      id: 'REP-PSY-003',
      patientName: 'Rizki Pratama',
      sessionDate: '2026-04-17',
      therapist: 'Dr. Siti Rahayu',
      sessionType: 'Group',
      reportSummary: 'Dalam sesi kelompok, pasien cukup aktif berpartisipasi. Respon baik terhadap peer support.',
      nextAction: 'Gabungkan ke dalam grup terapi PTSD'
    }
  ]);

  const [reportPeriod, setReportPeriod] = useState('monthly');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Laporan Terapi Psikologi</h1>
      
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terapis</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Sesi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ringkasan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindak Lanjut</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.patientName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.sessionDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.therapist}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.sessionType}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{report.reportSummary}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{report.nextAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Statistik Terapi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Sesi Bulan Ini</p>
            <p className="text-2xl font-bold mt-1">42</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-600">Pasien Aktif</p>
            <p className="text-2xl font-bold mt-1">28</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-600">Tingkat Pemulihan</p>
            <p className="text-2xl font-bold mt-1">76%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychologyReports;