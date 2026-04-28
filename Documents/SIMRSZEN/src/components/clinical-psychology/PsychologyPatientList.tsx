import React, { useState } from 'react';

interface PsychologyPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  diagnosis: string;
  therapist: string;
  lastSession: string;
}

const PsychologyPatientList = () => {
  const [patients, setPatients] = useState<PsychologyPatient[]>([
    {
      id: 'PSY-001',
      name: 'Ahmad Fauzi',
      age: 32,
      gender: 'Laki-laki',
      diagnosis: 'Anxiety Disorder',
      therapist: 'Dr. Siti Rahayu',
      lastSession: '2026-04-18'
    },
    {
      id: 'PSY-002',
      name: 'Sri Lestari',
      age: 28,
      gender: 'Perempuan',
      diagnosis: 'Depression',
      therapist: 'Dr. Budi Santoso',
      lastSession: '2026-04-19'
    },
    {
      id: 'PSY-003',
      name: 'Rizki Pratama',
      age: 45,
      gender: 'Laki-laki',
      diagnosis: 'PTSD',
      therapist: 'Dr. Siti Rahayu',
      lastSession: '2026-04-17'
    }
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Daftar Pasien Psikologi Klinis</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pasien</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terapis</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sesi Terakhir</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap">{patient.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.age}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.diagnosis}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.therapist}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.lastSession}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PsychologyPatientList;