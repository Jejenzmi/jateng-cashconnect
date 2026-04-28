import React, { useState, useEffect } from 'react';

interface DoctorSchedule {
  id: string;
  doctorId: string;
  doctorName: string;
  poliId: string;
  poliName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxPatients: number;
  currentPatients: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorScheduleId: string;
  appointmentDate: Date;
  appointmentNumber: number;
  status: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface QueueNumber {
  id: string;
  appointmentId: string;
  queueNumber: number;
  poliId: string;
  poliName: string;
  called: boolean;
  served: boolean;
  calledAt?: Date;
  servedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchedulingModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'appointments' | 'queue'>('schedule');
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([
    {
      id: 'sched-1',
      doctorId: 'doc-1',
      doctorName: 'Dr. Andi Prasetyo',
      poliId: 'poli-1',
      poliName: 'Penyakit Dalam',
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '12:00',
      maxPatients: 20,
      currentPatients: 15,
      status: 'active',
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date()
    },
    {
      id: 'sched-2',
      doctorId: 'doc-1',
      doctorName: 'Dr. Andi Prasetyo',
      poliId: 'poli-1',
      poliName: 'Penyakit Dalam',
      dayOfWeek: 3,
      startTime: '14:00',
      endTime: '17:00',
      maxPatients: 15,
      currentPatients: 8,
      status: 'active',
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date()
    }
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'apt-1',
      patientId: 'pat-1',
      patientName: 'Siti Nurhaliza',
      doctorScheduleId: 'sched-1',
      appointmentDate: new Date(Date.now() + 86400000),
      appointmentNumber: 5,
      status: 'scheduled',
      notes: 'Follow up hipertensi',
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 172800000)
    },
    {
      id: 'apt-2',
      patientId: 'pat-2',
      patientName: 'Budi Santoso',
      doctorScheduleId: 'sched-2',
      appointmentDate: new Date(Date.now() + 172800000),
      appointmentNumber: 3,
      status: 'scheduled',
      notes: 'Konsultasi diabetes',
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000)
    }
  ]);

  const [currentQueues, setCurrentQueues] = useState<QueueNumber[]>([
    {
      id: 'q-1',
      appointmentId: 'apt-1',
      queueNumber: 1,
      poliId: 'poli-1',
      poliName: 'Penyakit Dalam',
      called: true,
      served: true,
      calledAt: new Date(Date.now() - 1200000),
      servedAt: new Date(Date.now() - 600000),
      createdAt: new Date(Date.now() - 1800000),
      updatedAt: new Date()
    },
    {
      id: 'q-2',
      appointmentId: 'apt-2',
      queueNumber: 2,
      poliId: 'poli-1',
      poliName: 'Penyakit Dalam',
      called: true,
      served: false,
      calledAt: new Date(Date.now() - 600000),
      createdAt: new Date(Date.now() - 1200000),
      updatedAt: new Date()
    },
    {
      id: 'q-3',
      appointmentId: 'apt-3',
      queueNumber: 3,
      poliId: 'poli-1',
      poliName: 'Penyakit Dalam',
      called: false,
      served: false,
      createdAt: new Date(Date.now() - 600000),
      updatedAt: new Date()
    }
  ]);

  const [newSchedule, setNewSchedule] = useState({
    doctorId: '',
    doctorName: '',
    poliId: '',
    poliName: '',
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '12:00',
    maxPatients: 20
  });

  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    patientName: '',
    doctorScheduleId: '',
    appointmentDate: new Date(),
    notes: ''
  });

  const handleCreateSchedule = () => {
    if (!newSchedule.doctorId || !newSchedule.poliId) return;
    
    const newSched: DoctorSchedule = {
      id: `sched-${Date.now()}`,
      doctorId: newSchedule.doctorId,
      doctorName: newSchedule.doctorName,
      poliId: newSchedule.poliId,
      poliName: newSchedule.poliName,
      dayOfWeek: newSchedule.dayOfWeek,
      startTime: newSchedule.startTime,
      endTime: newSchedule.endTime,
      maxPatients: newSchedule.maxPatients,
      currentPatients: 0,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setSchedules([...schedules, newSched]);
    setNewSchedule({
      doctorId: '',
      doctorName: '',
      poliId: '',
      poliName: '',
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '12:00',
      maxPatients: 20
    });
  };

  const handleCreateAppointment = () => {
    if (!newAppointment.patientId || !newAppointment.doctorScheduleId) return;
    
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: newAppointment.patientId,
      patientName: newAppointment.patientName,
      doctorScheduleId: newAppointment.doctorScheduleId,
      appointmentDate: newAppointment.appointmentDate,
      appointmentNumber: 10, // Dalam implementasi nyata, ini akan dihitung
      status: 'scheduled',
      notes: newAppointment.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setAppointments([...appointments, newApt]);
    setNewAppointment({
      patientId: '',
      patientName: '',
      doctorScheduleId: '',
      appointmentDate: new Date(),
      notes: ''
    });
  };

  const handleCallQueue = () => {
    // Find next uncalled queue
    const nextQueue = currentQueues.find(q => !q.called);
    if (!nextQueue) return;

    const updatedQueues = currentQueues.map(q => 
      q.id === nextQueue.id 
        ? { ...q, called: true, calledAt: new Date() } 
        : q
    );

    setCurrentQueues(updatedQueues);
  };

  const handleServeQueue = (queueId: string) => {
    const updatedQueues = currentQueues.map(q => 
      q.id === queueId 
        ? { ...q, served: true, servedAt: new Date() } 
        : q
    );

    setCurrentQueues(updatedQueues);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Modul Antrian & Jadwal Dokter</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manajemen jadwal dokter dan sistem antrian
          </p>
        </div>
        
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-4">
            {[
              { id: 'schedule', name: 'Jadwal Dokter' },
              { id: 'appointments', name: 'Janji Temu' },
              { id: 'queue', name: 'Antrian Hari Ini' }
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
          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div>
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-900 mb-4">Tambah Jadwal Dokter Baru</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label htmlFor="doctor-id" className="block text-sm font-medium text-gray-700">
                      ID Dokter
                    </label>
                    <input
                      type="text"
                      id="doctor-id"
                      value={newSchedule.doctorId}
                      onChange={(e) => setNewSchedule({...newSchedule, doctorId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Masukkan ID Dokter"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="doctor-name" className="block text-sm font-medium text-gray-700">
                      Nama Dokter
                    </label>
                    <input
                      type="text"
                      id="doctor-name"
                      value={newSchedule.doctorName}
                      onChange={(e) => setNewSchedule({...newSchedule, doctorName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Nama Dokter"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="poli-id" className="block text-sm font-medium text-gray-700">
                      ID Poli
                    </label>
                    <input
                      type="text"
                      id="poli-id"
                      value={newSchedule.poliId}
                      onChange={(e) => setNewSchedule({...newSchedule, poliId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="ID Poli"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="poli-name" className="block text-sm font-medium text-gray-700">
                      Nama Poli
                    </label>
                    <input
                      type="text"
                      id="poli-name"
                      value={newSchedule.poliName}
                      onChange={(e) => setNewSchedule({...newSchedule, poliName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Nama Poli"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="day-of-week" className="block text-sm font-medium text-gray-700">
                      Hari
                    </label>
                    <select
                      id="day-of-week"
                      value={newSchedule.dayOfWeek}
                      onChange={(e) => setNewSchedule({...newSchedule, dayOfWeek: parseInt(e.target.value)})}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value={0}>Minggu</option>
                      <option value={1}>Senin</option>
                      <option value={2}>Selasa</option>
                      <option value={3}>Rabu</option>
                      <option value={4}>Kamis</option>
                      <option value={5}>Jumat</option>
                      <option value={6}>Sabtu</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="start-time" className="block text-sm font-medium text-gray-700">
                      Jam Mulai
                    </label>
                    <input
                      type="time"
                      id="start-time"
                      value={newSchedule.startTime}
                      onChange={(e) => setNewSchedule({...newSchedule, startTime: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="end-time" className="block text-sm font-medium text-gray-700">
                      Jam Selesai
                    </label>
                    <input
                      type="time"
                      id="end-time"
                      value={newSchedule.endTime}
                      onChange={(e) => setNewSchedule({...newSchedule, endTime: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="max-patients" className="block text-sm font-medium text-gray-700">
                      Maks Pasien
                    </label>
                    <input
                      type="number"
                      id="max-patients"
                      value={newSchedule.maxPatients}
                      onChange={(e) => setNewSchedule({...newSchedule, maxPatients: parseInt(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="sm:col-span-2 lg:col-span-3">
                    <button
                      type="button"
                      onClick={handleCreateSchedule}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Tambah Jadwal
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Daftar Jadwal Dokter</h4>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {schedules.map((schedule) => (
                      <li key={schedule.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-indigo-600 truncate">{schedule.doctorName}</div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                schedule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {schedule.status}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <div className="mr-6 flex items-center text-sm text-gray-500">
                                <span>{schedule.poliName}</span>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <span>
                                  {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][schedule.dayOfWeek]}{' '}
                                  {schedule.startTime} - {schedule.endTime}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <span>
                                {schedule.currentPatients}/{schedule.maxPatients} pasien
                              </span>
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
          
          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div>
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-900 mb-4">Buat Janji Temu Baru</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="patient-id" className="block text-sm font-medium text-gray-700">
                      ID Pasien
                    </label>
                    <input
                      type="text"
                      id="patient-id"
                      value={newAppointment.patientId}
                      onChange={(e) => setNewAppointment({...newAppointment, patientId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Masukkan ID Pasien"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="patient-name" className="block text-sm font-medium text-gray-700">
                      Nama Pasien
                    </label>
                    <input
                      type="text"
                      id="patient-name"
                      value={newAppointment.patientName}
                      onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Nama Pasien"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="doctor-schedule" className="block text-sm font-medium text-gray-700">
                      Jadwal Dokter
                    </label>
                    <select
                      id="doctor-schedule"
                      value={newAppointment.doctorScheduleId}
                      onChange={(e) => setNewAppointment({...newAppointment, doctorScheduleId: e.target.value})}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Pilih Jadwal</option>
                      {schedules.map(schedule => (
                        <option key={schedule.id} value={schedule.id}>
                          {schedule.doctorName} - {schedule.poliName} - {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][schedule.dayOfWeek]}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="appointment-date" className="block text-sm font-medium text-gray-700">
                      Tanggal Janji
                    </label>
                    <input
                      type="date"
                      id="appointment-date"
                      value={newAppointment.appointmentDate.toISOString().split('T')[0]}
                      onChange={(e) => setNewAppointment({...newAppointment, appointmentDate: new Date(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Catatan
                    </label>
                    <input
                      type="text"
                      id="notes"
                      value={newAppointment.notes}
                      onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Catatan tambahan"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleCreateAppointment}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Buat Janji Temu
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Daftar Janji Temu</h4>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                      <li key={appointment.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-indigo-600 truncate">{appointment.patientName}</div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                appointment.status === 'visited' ? 'bg-green-100 text-green-800' :
                                appointment.status === 'canceled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {appointment.status}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <div className="mr-6 flex items-center text-sm text-gray-500">
                                <span>No. Antrian: {appointment.appointmentNumber}</span>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <span>{appointment.appointmentDate.toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <span>Catatan: {appointment.notes}</span>
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
          
          {/* Queue Tab */}
          {activeTab === 'queue' && (
            <div>
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium text-gray-900">Antrian Hari Ini</h4>
                  <button
                    type="button"
                    onClick={handleCallQueue}
                    disabled={!currentQueues.some(q => !q.called)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    Panggil Antrian Berikutnya
                  </button>
                </div>
                
                <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {currentQueues.map((queue) => (
                      <li key={queue.id} className={`${queue.called && !queue.served ? 'bg-blue-50' : ''}`}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-indigo-600 truncate">
                              No. Antrian: {queue.queueNumber}
                            </div>
                            <div className="ml-2 flex-shrink-0 flex space-x-2">
                              {!queue.served && queue.called && (
                                <button
                                  onClick={() => handleServeQueue(queue.id)}
                                  className="inline-flex items-center px-2.5 py-0.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                  Layani
                                </button>
                              )}
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                queue.called ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {queue.called ? 'Dipanggil' : 'Belum Dipanggil'}
                              </span>
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                queue.served ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {queue.served ? 'Dilayani' : 'Belum Dilayani'}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <div className="mr-6 flex items-center text-sm text-gray-500">
                                <span>{queue.poliName}</span>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <span>Nama Pasien: {appointments.find(a => a.id === queue.appointmentId)?.patientName || 'N/A'}</span>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <span>
                                {queue.calledAt ? `Dipanggil: ${queue.calledAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : ''}
                                {queue.servedAt ? ` | Dilayani: ${queue.servedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Ringkasan Antrian</h4>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Jumlah Antrian</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">{currentQueues.length}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Belum Dipanggil</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">
                                {currentQueues.filter(q => !q.called).length}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Telah Dilayani</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">
                                {currentQueues.filter(q => q.served).length}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentSchedulingModule;