import React, { useState } from 'react';

interface ClergyMember {
  id: string;
  name: string;
  religion: string;
  phone: string;
  email: string;
  availability: boolean;
  certifications: string[];
  assignedServices: number;
}

const SpiritualClergyList = () => {
  const [clergy, setClergy] = useState<ClergyMember[]>([
    {
      id: 'CLG-001',
      name: 'Ustadz Ahmad Fikri',
      religion: 'Islam',
      phone: '+62 812 3456 7890',
      email: 'ahmad.fikri@spiritualcare.org',
      availability: true,
      certifications: ['Imam Masjid', 'Konselor Spiritual', 'Panduan Haji & Umroh'],
      assignedServices: 12
    },
    {
      id: 'CLG-002',
      name: 'Pdt. Dr. Johannes Christian',
      religion: 'Kristen Protestan',
      phone: '+62 813 4567 8901',
      email: 'johannes.christian@spiritualcare.org',
      availability: true,
      certifications: ['Pendeta Utama', 'Teologi Pastoral', 'Konseling Grief'],
      assignedServices: 18
    },
    {
      id: 'CLG-003',
      name: 'Rom. Maria Santosa',
      religion: 'Katolik',
      phone: '+62 811 5678 9012',
      email: 'maria.santosa@spiritualcare.org',
      availability: false,
      certifications: ['Pastor Paroki', 'Liturgi', 'Konseling Sakramental'],
      assignedServices: 9
    },
    {
      id: 'CLG-004',
      name: 'Ida Pedanda Gde Putra',
      religion: 'Hindu',
      phone: '+62 812 6789 0123',
      email: 'gde.putra@spiritualcare.org',
      availability: true,
      certifications: ['Pedanda Utama', 'Upacara Agama', 'Konseling Hindu'],
      assignedServices: 7
    },
    {
      id: 'CLG-005',
      name: 'Bhikkhu Thich Minh',
      religion: 'Buddha',
      phone: '+62 813 7890 1234',
      email: 'minh.thich@spiritualcare.org',
      availability: true,
      certifications: ['Bhikkhu Senior', 'Meditasi Vipassana', 'Upacara Buddha'],
      assignedServices: 5
    }
  ]);

  const toggleAvailability = (id: string) => {
    setClergy(clergy.map(member => 
      member.id === id ? {...member, availability: !member.availability} : member
    ));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Daftar Petugas Pelayanan Rohani</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clergy.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{member.name}</h2>
                  <div className="mt-2 flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {member.religion}
                    </span>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    member.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {member.availability ? 'Tersedia' : 'Tidak Tersedia'}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {member.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {member.email}
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">Sertifikasi:</h3>
                <div className="mt-1 flex flex-wrap gap-1">
                  {member.certifications.map((cert, idx) => (
                    <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Pelayanan Ditugaskan</p>
                  <p className="text-lg font-bold">{member.assignedServices}</p>
                </div>
                
                <button
                  onClick={() => toggleAvailability(member.id)}
                  className={`px-3 py-1 rounded text-sm ${
                    member.availability 
                      ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {member.availability ? 'Atur Tidak Tersedia' : 'Atur Tersedia'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Ringkasan Petugas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Total Petugas</p>
            <p className="text-2xl font-bold mt-1">{clergy.length}</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Tersedia</p>
            <p className="text-2xl font-bold mt-1 text-green-600">
              {clergy.filter(c => c.availability).length}
            </p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Tidak Tersedia</p>
            <p className="text-2xl font-bold mt-1 text-red-600">
              {clergy.filter(c => !c.availability).length}
            </p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Rata-rata Tugas</p>
            <p className="text-2xl font-bold mt-1">
              {Math.round(clergy.reduce((sum, c) => sum + c.assignedServices, 0) / clergy.length)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpiritualClergyList;