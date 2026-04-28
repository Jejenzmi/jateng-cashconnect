import React, { useState, useEffect } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  color: string;
}

interface RecentActivity {
  id: string;
  patientName: string;
  type: string;
  time: string;
  status: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 text-white ${color}`}>
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
    <div className={`px-5 py-3 bg-gray-50 text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
      <div className="truncate">{change}</div>
    </div>
  </div>
);

const HospitalDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    totalPatients: 0,
    todayVisits: 0,
    availableBeds: 0,
    inpatientCount: 0,
    emergencyCases: 0,
    appointmentsToday: 0
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    // Simulasi pengambilan data dari API
    setTimeout(() => {
      setMetrics({
        totalPatients: 12482,
        todayVisits: 142,
        availableBeds: 23,
        inpatientCount: 87,
        emergencyCases: 8,
        appointmentsToday: 65
      });

      setRecentActivities([
        {
          id: '1',
          patientName: 'Andi Prasetyo',
          type: 'Pendaftaran Rawat Jalan',
          time: '10 menit yang lalu',
          status: 'success'
        },
        {
          id: '2',
          patientName: 'Siti Nurhaliza',
          type: 'Pemeriksaan Laboratorium',
          time: '25 menit yang lalu',
          status: 'progress'
        },
        {
          id: '3',
          patientName: 'Budi Santoso',
          type: 'Pendaftaran Rawat Inap',
          time: '40 menit yang lalu',
          status: 'success'
        },
        {
          id: '4',
          patientName: 'Rina Kusuma',
          type: 'Pemeriksaan Radiologi',
          time: '1 jam yang lalu',
          status: 'completed'
        },
        {
          id: '5',
          patientName: 'Joko Widodo',
          type: 'IGD',
          time: '1 jam 15 menit yang lalu',
          status: 'emergency'
        }
      ]);
    }, 1000);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Manajemen Rumah Sakit</h1>
        <p className="mt-2 text-sm text-gray-600">
          Ringkasan aktivitas dan metrik kunci rumah sakit hari ini
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <MetricCard 
          title="Total Pasien" 
          value={metrics.totalPatients} 
          change="+12% dari minggu lalu" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color="bg-blue-500"
        />
        
        <MetricCard 
          title="Kunjungan Hari Ini" 
          value={metrics.todayVisits} 
          change="+5 dari kemarin" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          color="bg-green-500"
        />
        
        <MetricCard 
          title="Tempat Tidur Tersedia" 
          value={metrics.availableBeds} 
          change="-3 dari kemarin" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4m10 6l6-6m-6-6l6 6" />
            </svg>
          }
          color="bg-yellow-500"
        />
        
        <MetricCard 
          title="Pasien Rawat Inap" 
          value={metrics.inpatientCount} 
          change="+7 dari kemarin" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          color="bg-purple-500"
        />
        
        <MetricCard 
          title="Kasus IGD" 
          value={metrics.emergencyCases} 
          change="+2 dari kemarin" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          color="bg-red-500"
        />
        
        <MetricCard 
          title="Janji Hari Ini" 
          value={metrics.appointmentsToday} 
          change="+10 dari kemarin" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          color="bg-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Aktivitas Terbaru</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Aktivitas terbaru dalam sistem SIMRS</p>
          </div>
          <ul className="divide-y divide-gray-200">
            {recentActivities.map(activity => (
              <li key={activity.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`h-2.5 w-2.5 rounded-full ${
                      activity.status === 'success' ? 'bg-green-400' :
                      activity.status === 'progress' ? 'bg-yellow-400' :
                      activity.status === 'completed' ? 'bg-blue-400' : 'bg-red-400'
                    }`}></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{activity.patientName}</p>
                    <p className="text-sm text-gray-500">{activity.type}</p>
                  </div>
                  <div className="ml-auto text-sm text-gray-500">
                    {activity.time}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Alerts */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Notifikasi & Peringatan</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Peringatan dan notifikasi penting</p>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                <li>
                  <div className="relative pb-8">
                    <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <img className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-4 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm">
                            <a href="#" className="font-medium text-gray-900">Sistem</a>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-500">12 menit yang lalu</p>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>Stok obat Paracetamol kurang dari 10 box. Segera lakukan pengadaan!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                
                <li>
                  <div className="relative pb-8">
                    <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <div className="bg-red-500 h-10 w-10 rounded-full flex items-center justify-center ring-4 ring-white">
                          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm">
                            <a href="#" className="font-medium text-gray-900">Sistem</a>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-500">1 jam yang lalu</p>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>Generator cadangan akan melakukan uji coba pada hari Sabtu pukul 02:00 pagi</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                
                <li>
                  <div className="relative pb-8">
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <div className="bg-blue-500 h-10 w-10 rounded-full flex items-center justify-center ring-4 ring-white">
                          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm">
                            <a href="#" className="font-medium text-gray-900">Sistem</a>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-500">2 jam yang lalu</p>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>Backup data harian berhasil dilakukan pada pukul 23:45 kemarin</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;