import React, { useState } from 'react';

interface EmergencyCase {
  id: string;
  patientId: string;
  visitId: string;
  triageLevel: number;
  chiefComplaint: string;
  arrivalTime: Date;
  disposition: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IcuStay {
  id: string;
  patientId: string;
  inpatientStayId: string;
  kamarId: string;
  icuTypeId: string;
  admissionDateTime: Date;
  dischargeDateTime?: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BloodDonation {
  id: string;
  donorId: string;
  donationDate: Date;
  bloodType: string;
  amount: number;
  bloodComponents: string[];
  status: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const SupportingServicesModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'igd' | 'icu' | 'bloodBank'>('igd');
  const [emergencyCases, setEmergencyCases] = useState<EmergencyCase[]>([
    {
      id: 'emg-1',
      patientId: 'P001',
      visitId: 'V001',
      triageLevel: 2,
      chiefComplaint: 'Sesak napas berat',
      arrivalTime: new Date(Date.now() - 3600000), // 1 jam yang lalu
      disposition: 'rawat_inap',
      status: 'examined',
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 1800000)
    },
    {
      id: 'emg-2',
      patientId: 'P002',
      visitId: 'V002',
      triageLevel: 1,
      chiefComplaint: 'Nyeri dada mendadak',
      arrivalTime: new Date(Date.now() - 1800000), // 30 menit yang lalu
      disposition: '',
      status: 'registered',
      createdAt: new Date(Date.now() - 1800000),
      updatedAt: new Date(Date.now() - 1800000)
    }
  ]);

  const [icuPatients, setIcuPatients] = useState<IcuStay[]>([
    {
      id: 'icu-1',
      patientId: 'P003',
      inpatientStayId: 'IP-001',
      kamarId: 'KMR-001',
      icuTypeId: 'icu',
      admissionDateTime: new Date(Date.now() - 86400000), // 1 hari yang lalu
      status: 'active',
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 3600000)
    }
  ]);

  const [bloodStock, setBloodStock] = useState<Record<string, number>>({
    'A+': 15,
    'A-': 5,
    'B+': 12,
    'B-': 3,
    'AB+': 8,
    'AB-': 2,
    'O+': 20,
    'O-': 7
  });

  const [bloodDonations, setBloodDonations] = useState<BloodDonation[]>([
    {
      id: 'don-1',
      donorId: 'P004',
      donationDate: new Date(Date.now() - 172800000), // 2 hari yang lalu
      bloodType: 'O+',
      amount: 450,
      bloodComponents: ['whole_blood'],
      status: 'processed',
      notes: 'Donasi rutin',
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 172800000)
    }
  ]);

  const [newEmergencyCase, setNewEmergencyCase] = useState({
    patientId: '',
    triageLevel: 3,
    chiefComplaint: '',
    arrivalTime: new Date()
  });

  const [newIcuAdmission, setNewIcuAdmission] = useState({
    patientId: '',
    inpatientStayId: '',
    kamarId: '',
    icuTypeId: 'icu'
  });

  const [newDonation, setNewDonation] = useState({
    donorId: '',
    donationDate: new Date(),
    bloodType: 'A+',
    amount: 450,
    notes: ''
  });

  const handleRegisterEmergency = () => {
    if (!newEmergencyCase.patientId || !newEmergencyCase.chiefComplaint) return;
    
    const newCase: EmergencyCase = {
      id: `emg-${Date.now()}`,
      patientId: newEmergencyCase.patientId,
      visitId: `V-${Date.now()}`,
      triageLevel: newEmergencyCase.triageLevel,
      chiefComplaint: newEmergencyCase.chiefComplaint,
      arrivalTime: newEmergencyCase.arrivalTime,
      disposition: '',
      status: 'registered',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setEmergencyCases([...emergencyCases, newCase]);
    setNewEmergencyCase({
      patientId: '',
      triageLevel: 3,
      chiefComplaint: '',
      arrivalTime: new Date()
    });
  };

  const handleAdmitToIcu = () => {
    if (!newIcuAdmission.patientId || !newIcuAdmission.inpatientStayId) return;
    
    const newAdmission: IcuStay = {
      id: `icu-${Date.now()}`,
      patientId: newIcuAdmission.patientId,
      inpatientStayId: newIcuAdmission.inpatientStayId,
      kamarId: newIcuAdmission.kamarId,
      icuTypeId: newIcuAdmission.icuTypeId,
      admissionDateTime: new Date(),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setIcuPatients([...icuPatients, newAdmission]);
    setNewIcuAdmission({
      patientId: '',
      inpatientStayId: '',
      kamarId: '',
      icuTypeId: 'icu'
    });
  };

  const handleAddDonation = () => {
    if (!newDonation.donorId) return;
    
    const newDonationObj: BloodDonation = {
      id: `don-${Date.now()}`,
      donorId: newDonation.donorId,
      donationDate: newDonation.donationDate,
      bloodType: newDonation.bloodType,
      amount: newDonation.amount,
      bloodComponents: ['whole_blood'],
      status: 'processed',
      notes: newDonation.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setBloodDonations([...bloodDonations, newDonationObj]);
    
    // Update stock
    setBloodStock(prev => ({
      ...prev,
      [newDonation.bloodType]: (prev[newDonation.bloodType] || 0) + 1
    }));
    
    setNewDonation({
      donorId: '',
      donationDate: new Date(),
      bloodType: 'A+',
      amount: 450,
      notes: ''
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Modul Penunjang Medis</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manajemen IGD, ICU, dan Bank Darah
          </p>
        </div>
        
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-4">
            {[
              { id: 'igd', name: 'IGD (Instalasi Gawat Darurat)' },
              { id: 'icu', name: 'ICU/ICCU/NICU/PICU' },
              { id: 'bloodBank', name: 'Bank Darah' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {/* IGD Tab */}
          {activeTab === 'igd' && (
            <div>
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-900 mb-4">Pendaftaran Kasus Baru</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="patient-id-emg" className="block text-sm font-medium text-gray-700">
                      ID Pasien
                    </label>
                    <input
                      type="text"
                      id="patient-id-emg"
                      value={newEmergencyCase.patientId}
                      onChange={(e) => setNewEmergencyCase({...newEmergencyCase, patientId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Masukkan ID Pasien"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="triage-level" className="block text-sm font-medium text-gray-700">
                      Tingkat Triage
                    </label>
                    <select
                      id="triage-level"
                      value={newEmergencyCase.triageLevel}
                      onChange={(e) => setNewEmergencyCase({...newEmergencyCase, triageLevel: parseInt(e.target.value)})}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value={1}>1 - Emergensi (Merah)</option>
                      <option value={2}>2 - Urgent (Kuning)</option>
                      <option value={3}>3 - Semi-Urgent (Hijau)</option>
                      <option value={4}>4 - Non-Urgent (Biru)</option>
                      <option value={5}>5 - Minimal (Hitam)</option>
                    </select>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="chief-complaint" className="block text-sm font-medium text-gray-700">
                      Keluhan Utama
                    </label>
                    <textarea
                      id="chief-complaint"
                      rows={3}
                      value={newEmergencyCase.chiefComplaint}
                      onChange={(e) => setNewEmergencyCase({...newEmergencyCase, chiefComplaint: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Deskripsikan keluhan utama pasien"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleRegisterEmergency}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Daftarkan Kasus
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Kasus Aktif di IGD</h4>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {emergencyCases.map((caseItem) => (
                      <li key={caseItem.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-indigo-600 truncate">Pasien {caseItem.patientId}</div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                caseItem.triageLevel === 1 ? 'bg-red-100 text-red-800' :
                                caseItem.triageLevel === 2 ? 'bg-yellow-100 text-yellow-800' :
                                caseItem.triageLevel === 3 ? 'bg-green-100 text-green-800' :
                                caseItem.triageLevel === 4 ? 'bg-blue-100 text-blue-800' : 'bg-black-100 text-black-800'
                              }`}>
                                Triage {caseItem.triageLevel}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <div className="mr-6 flex items-center text-sm text-gray-500">
                                <span>{caseItem.chiefComplaint}</span>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <span>Status: {caseItem.status}</span>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <span>{caseItem.arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* ICU Tab */}
          {activeTab === 'icu' && (
            <div>
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-900 mb-4">Pendaftaran Pasien ke ICU</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="patient-id-icu" className="block text-sm font-medium text-gray-700">
                      ID Pasien
                    </label>
                    <input
                      type="text"
                      id="patient-id-icu"
                      value={newIcuAdmission.patientId}
                      onChange={(e) => setNewIcuAdmission({...newIcuAdmission, patientId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Masukkan ID Pasien"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="inpatient-stay-id" className="block text-sm font-medium text-gray-700">
                      ID Rawat Inap
                    </label>
                    <input
                      type="text"
                      id="inpatient-stay-id"
                      value={newIcuAdmission.inpatientStayId}
                      onChange={(e) => setNewIcuAdmission({...newIcuAdmission, inpatientStayId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Masukkan ID Rawat Inap"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="icu-type" className="block text-sm font-medium text-gray-700">
                      Jenis ICU
                    </label>
                    <select
                      id="icu-type"
                      value={newIcuAdmission.icuTypeId}
                      onChange={(e) => setNewIcuAdmission({...newIcuAdmission, icuTypeId: e.target.value})}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="icu">ICU (Intensive Care Unit)</option>
                      <option value="iccu">ICCU (Intensive Cardiac Care Unit)</option>
                      <option value="nicu">NICU (Neonatal Intensive Care Unit)</option>
                      <option value="picu">PICU (Pediatric Intensive Care Unit)</option>
                      <option value="hcu">HCU (High Dependency Unit)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="room-id" className="block text-sm font-medium text-gray-700">
                      ID Kamar
                    </label>
                    <input
                      type="text"
                      id="room-id"
                      value={newIcuAdmission.kamarId}
                      onChange={(e) => setNewIcuAdmission({...newIcuAdmission, kamarId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Masukkan ID Kamar"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAdmitToIcu}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Daftarkan ke ICU
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Pasien di ICU</h4>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {icuPatients.map((icuStay) => (
                      <li key={icuStay.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-indigo-600 truncate">Pasien {icuStay.patientId}</div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                icuStay.status === 'active' ? 'bg-green-100 text-green-800' : 
                                icuStay.status === 'discharged' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {icuStay.status}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <div className="mr-6 flex items-center text-sm text-gray-500">
                                <span>Jenis: {icuStay.icuTypeId.toUpperCase()}</span>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <span>Kamar: {icuStay.kamarId}</span>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <span>Masuk: {icuStay.admissionDateTime.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Blood Bank Tab */}
          {activeTab === 'bloodBank' && (
            <div>
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-900 mb-4">Stok Darah Tersedia</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(bloodStock).map(([type, count]) => (
                    <div key={type} className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6 text-center">
                        <div className="text-2xl font-bold text-gray-900">{count}</div>
                        <div className="mt-1 text-sm font-medium text-gray-500">{type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-900 mb-4">Pencatatan Donasi Darah</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="donor-id" className="block text-sm font-medium text-gray-700">
                      ID Pendonor
                    </label>
                    <input
                      type="text"
                      id="donor-id"
                      value={newDonation.donorId}
                      onChange={(e) => setNewDonation({...newDonation, donorId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Masukkan ID Pendonor"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="blood-type" className="block text-sm font-medium text-gray-700">
                      Golongan Darah
                    </label>
                    <select
                      id="blood-type"
                      value={newDonation.bloodType}
                      onChange={(e) => setNewDonation({...newDonation, bloodType: e.target.value})}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Jumlah (ml)
                    </label>
                    <input
                      type="number"
                      id="amount"
                      value={newDonation.amount}
                      onChange={(e) => setNewDonation({...newDonation, amount: parseInt(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Jumlah darah (ml)"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Catatan
                    </label>
                    <input
                      type="text"
                      id="notes"
                      value={newDonation.notes}
                      onChange={(e) => setNewDonation({...newDonation, notes: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Catatan tambahan"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddDonation}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Catat Donasi
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Riwayat Donasi</h4>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {bloodDonations.map((donation) => (
                      <li key={donation.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-indigo-600 truncate">Donor {donation.donorId}</div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                donation.status === 'processed' ? 'bg-green-100 text-green-800' : 
                                donation.status === 'tested' ? 'bg-blue-100 text-blue-800' : 
                                donation.status === 'stored' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {donation.status}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <div className="mr-6 flex items-center text-sm text-gray-500">
                                <span>{donation.bloodType} - {donation.amount}ml</span>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <span>{donation.donationDate.toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <span>Catatan: {donation.notes}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportingServicesModule;