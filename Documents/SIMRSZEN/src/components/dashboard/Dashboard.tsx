import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Users, 
  FileText, 
  Pill, 
  CreditCard, 
  Stethoscope, 
  Calendar, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  ChevronRight,
  Bell,
  Settings,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from './StatCard';

interface DashboardStats {
  totalPatients: number;
  newPatientsToday: number;
  appointmentsToday: number;
  totalRevenue: number;
  activeDoctors: number;
  pendingTasks: number;
  totalMedicines: number;
  lowStockMedicines: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    newPatientsToday: 0,
    appointmentsToday: 0,
    totalRevenue: 0,
    activeDoctors: 0,
    pendingTasks: 0,
    totalMedicines: 0,
    lowStockMedicines: 0
  });

  // Simulate fetching stats
  useEffect(() => {
    // In a real application, this would come from an API call
    setTimeout(() => {
      setStats({
        totalPatients: 1248,
        newPatientsToday: 12,
        appointmentsToday: 24,
        totalRevenue: 125000000,
        activeDoctors: 15,
        pendingTasks: 8,
        totalMedicines: 245,
        lowStockMedicines: 12
      });
    }, 500);
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard SIMRS ZEN</h1>
          <p className="text-muted-foreground">
            Ringkasan aktivitas sistem informasi manajemen rumah sakit
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Pengaturan
          </Button>
          <Button>
            <Bell className="mr-2 h-4 w-4" />
            Notifikasi
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Pasien"
          value={stats.totalPatients}
          subtitle="Semua waktu"
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Pasien Hari Ini"
          value={stats.newPatientsToday}
          subtitle="Pendaftaran baru"
          icon={User}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatCard
          title="Janji Temu"
          value={stats.appointmentsToday}
          subtitle="Hari ini"
          icon={Calendar}
          variant="success"
        />
        <StatCard
          title="Pendapatan"
          value={`Rp ${(stats.totalRevenue / 1000000).toFixed(0)}Jt`}
          subtitle="Bulan ini"
          icon={CreditCard}
          trend={{ value: 8.2, isPositive: true }}
          variant="warning"
        />
      </div>

      {/* More Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Dokter Aktif"
          value={stats.activeDoctors}
          subtitle="Sedang bertugas"
          icon={Stethoscope}
          variant="primary"
        />
        <StatCard
          title="Tugas Tertunda"
          value={stats.pendingTasks}
          subtitle="Harus diselesaikan"
          icon={Activity}
          variant="danger"
        />
        <StatCard
          title="Obat Tersedia"
          value={stats.totalMedicines}
          subtitle="Dalam inventaris"
          icon={Pill}
          variant="success"
        />
        <StatCard
          title="Stok Rendah"
          value={stats.lowStockMedicines}
          subtitle="Harus direstok"
          icon={TrendingDown}
          variant="danger"
        />
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Akses Cepat</CardTitle>
            <CardDescription>
              Akses cepat ke modul-modul utama SIMRS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/patients">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center">
                  <User className="h-6 w-6 mb-2" />
                  <span>Manajemen Pasien</span>
                </Button>
              </Link>
              <Link to="/registrations">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center">
                  <Calendar className="h-6 w-6 mb-2" />
                  <span>Registrasi</span>
                </Button>
              </Link>
              <Link to="/medical-records">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Rekam Medis</span>
                </Button>
              </Link>
              <Link to="/pharmacy">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center">
                  <Pill className="h-6 w-6 mb-2" />
                  <span>Farmasi</span>
                </Button>
              </Link>
              <Link to="/billing">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center">
                  <CreditCard className="h-6 w-6 mb-2" />
                  <span>Keuangan</span>
                </Button>
              </Link>
              <Link to="/users">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Pengguna</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>
              Aktivitas terbaru dalam sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, action: 'Pendaftaran Pasien Baru', patient: 'Ahmad Fauzi', time: '10 menit yang lalu', type: 'registration' },
                { id: 2, action: 'Pemeriksaan Selesai', patient: 'Siti Nurhaliza', time: '25 menit yang lalu', type: 'exam' },
                { id: 3, action: 'Pembayaran Lunas', patient: 'Budi Santoso', time: '1 jam yang lalu', type: 'payment' },
                { id: 4, action: 'Stok Obat Diperbarui', patient: '-', time: '2 jam yang lalu', type: 'stock' },
                { id: 5, action: 'Pengguna Baru Dibuat', patient: 'dr. Andi Pratama', time: '3 jam yang lalu', type: 'user' },
              ].map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                    {activity.type === 'registration' && <User className="h-4 w-4 text-primary" />}
                    {activity.type === 'exam' && <Stethoscope className="h-4 w-4 text-primary" />}
                    {activity.type === 'payment' && <CreditCard className="h-4 w-4 text-primary" />}
                    {activity.type === 'stock' && <Pill className="h-4 w-4 text-primary" />}
                    {activity.type === 'user' && <Users className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.patient}</p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Lihat Semua Aktivitas
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Important Notifications */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Notifikasi Penting</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-red-500" />
                Stok Rendah
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {stats.lowStockMedicines} obat membutuhkan restok segera
              </p>
              <Button variant="outline" size="sm" className="mt-2 w-full">
                Atur Restok
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-yellow-500" />
                Janji Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {stats.appointmentsToday} janji temu hari ini perlu ditindaklanjuti
              </p>
              <Button variant="outline" size="sm" className="mt-2 w-full">
                Lihat Jadwal
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Pendapatan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Pendapatan bulan ini meningkat {stats.totalRevenue > 100000000 ? '12%' : '5%'} dari bulan lalu
              </p>
              <Button variant="outline" size="sm" className="mt-2 w-full">
                Lihat Rincian
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;