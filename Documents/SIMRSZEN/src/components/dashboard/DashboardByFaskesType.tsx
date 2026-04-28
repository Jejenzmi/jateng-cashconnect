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
  Search,
  Building,
  Syringe,
  HeartPulse,
  Scan,
  Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { StatCard } from './StatCard';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

interface FaskesProfile {
  id: string;
  name: string;
  type: 'A' | 'B' | 'C' | 'D' | 'FKTP' | 'KLINIK' | 'PUSKESMAS';
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  licenseNumber: string;
  operationalSince: string;
  capacity: number;
  director: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalPatients: number;
  newPatientsToday: number;
  appointmentsToday: number;
  totalRevenue: number;
  activeDoctors: number;
  pendingTasks: number;
  totalMedicines: number;
  lowStockMedicines: number;
  availableBeds?: number;
  occupiedBeds?: number;
  availableStaff?: number;
}

const DashboardByFaskesType: React.FC = () => {
  const [faskesProfile, setFaskesProfile] = useState<FaskesProfile | null>(null);
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfileAndStats();
  }, []);

  const loadProfileAndStats = async () => {
    try {
      setLoading(true);
      
      // Ambil data profil dari API
      const response = await apiClient.get('/faskes-profile');
      
      if (response.data.success) {
        const profile = response.data.data;
        setFaskesProfile(profile);
        
        // Simpan ke localStorage sebagai fallback
        localStorage.setItem('faskesProfile', JSON.stringify(profile));
        
        // Simulasi data statistik berdasarkan tipe faskes
        setTimeout(() => {
          let baseStats: DashboardStats = {
            totalPatients: 0,
            newPatientsToday: 0,
            appointmentsToday: 0,
            totalRevenue: 0,
            activeDoctors: 0,
            pendingTasks: 0,
            totalMedicines: 0,
            lowStockMedicines: 0
          };
          
          // Atur statistik berdasarkan tipe faskes
          switch (profile.type) {
            case 'A':
              baseStats = {
                totalPatients: 12480,
                newPatientsToday: 120,
                appointmentsToday: 240,
                totalRevenue: 1250000000,
                activeDoctors: 150,
                pendingTasks: 8,
                totalMedicines: 2450,
                lowStockMedicines: 120,
                availableBeds: 450,
                occupiedBeds: 380,
                availableStaff: 850
              };
              break;
            case 'B':
              baseStats = {
                totalPatients: 8450,
                newPatientsToday: 85,
                appointmentsToday: 180,
                totalRevenue: 850000000,
                activeDoctors: 90,
                pendingTasks: 12,
                totalMedicines: 1800,
                lowStockMedicines: 85,
                availableBeds: 250,
                occupiedBeds: 220,
                availableStaff: 550
              };
              break;
            case 'C':
              baseStats = {
                totalPatients: 5230,
                newPatientsToday: 55,
                appointmentsToday: 120,
                totalRevenue: 550000000,
                activeDoctors: 50,
                pendingTasks: 6,
                totalMedicines: 1200,
                lowStockMedicines: 45,
                availableBeds: 150,
                occupiedBeds: 120,
                availableStaff: 350
              };
              break;
            case 'D':
              baseStats = {
                totalPatients: 2100,
                newPatientsToday: 25,
                appointmentsToday: 60,
                totalRevenue: 250000000,
                activeDoctors: 25,
                pendingTasks: 4,
                totalMedicines: 600,
                lowStockMedicines: 15,
                availableBeds: 75,
                occupiedBeds: 60,
                availableStaff: 150
              };
              break;
            case 'FKTP':
            case 'KLINIK':
              baseStats = {
                totalPatients: 1248,
                newPatientsToday: 12,
                appointmentsToday: 24,
                totalRevenue: 125000000,
                activeDoctors: 15,
                pendingTasks: 8,
                totalMedicines: 245,
                lowStockMedicines: 12
              };
              break;
            case 'PUSKESMAS':
              baseStats = {
                totalPatients: 3240,
                newPatientsToday: 45,
                appointmentsToday: 85,
                totalRevenue: 320000000,
                activeDoctors: 12,
                pendingTasks: 10,
                totalMedicines: 520,
                lowStockMedicines: 25
              };
              break;
          }
          
          setStats(baseStats);
        }, 500);
      } else {
        // Jika profil belum disetel, arahkan ke halaman setup
        toast.info('Silakan lengkapi profil faskes terlebih dahulu');
        navigate('/setup');
      }
    } catch (error: any) {
      console.error('Error loading faskes profile:', error);
      toast.error(error.response?.data?.message || 'Gagal mengambil profil faskes');
      
      // Coba ambil dari localStorage sebagai fallback
      const storedProfile = localStorage.getItem('faskesProfile');
      if (storedProfile) {
        setFaskesProfile(JSON.parse(storedProfile));
      } else {
        navigate('/setup');
      }
    } finally {
      setLoading(false);
    }
  };

  const getDashboardTitle = (type: string) => {
    switch (type) {
      case 'A': return 'Dashboard Rumah Sakit Kelas A';
      case 'B': return 'Dashboard Rumah Sakit Kelas B';
      case 'C': return 'Dashboard Rumah Sakit Kelas C';
      case 'D': return 'Dashboard Rumah Sakit Kelas D';
      case 'FKTP': return 'Dashboard FKTP';
      case 'KLINIK': return 'Dashboard Klinik';
      case 'PUSKESMAS': return 'Dashboard Puskesmas';
      default: return 'Dashboard Fasilitas Kesehatan';
    }
  };

  const getDashboardDescription = (type: string) => {
    switch (type) {
      case 'A': 
      case 'B': 
      case 'C': 
      case 'D': 
        return 'Ringkasan aktivitas rumah sakit Anda';
      case 'FKTP':
        return 'Ringkasan aktivitas Fasilitas Kesehatan Tingkat Pertama';
      case 'KLINIK':
        return 'Ringkasan aktivitas klinik Anda';
      case 'PUSKESMAS':
        return 'Ringkasan aktivitas puskesmas Anda';
      default:
        return 'Ringkasan aktivitas fasilitas kesehatan Anda';
    }
  };

  const getAvailableModules = (type: string) => {
    switch (type) {
      case 'A':
      case 'B':
        return [
          { title: 'Manajemen Pasien', icon: User, path: '/patients', desc: 'Manajemen data pasien' },
          { title: 'Registrasi', icon: Calendar, path: '/registrations', desc: 'Pendaftaran pasien' },
          { title: 'Rekam Medis', icon: FileText, path: '/medical-records', desc: 'Riwayat medis pasien' },
          { title: 'Farmasi', icon: Pill, path: '/pharmacy', desc: 'Manajemen obat' },
          { title: 'Keuangan', icon: CreditCard, path: '/billing', desc: 'Pembayaran & tagihan' },
          { title: 'Rawat Inap', icon: HeartPulse, path: '/inpatient', desc: 'Manajemen pasien rawat inap' },
          { title: 'Laboratorium', icon: Syringe, path: '/laboratory', desc: 'Pemeriksaan lab' },
          { title: 'Radiologi', icon: Scan, path: '/radiology', desc: 'Pemeriksaan imaging' },
        ];
      case 'C':
      case 'D':
        return [
          { title: 'Manajemen Pasien', icon: User, path: '/patients', desc: 'Manajemen data pasien' },
          { title: 'Registrasi', icon: Calendar, path: '/registrations', desc: 'Pendaftaran pasien' },
          { title: 'Rekam Medis', icon: FileText, path: '/medical-records', desc: 'Riwayat medis pasien' },
          { title: 'Farmasi', icon: Pill, path: '/pharmacy', desc: 'Manajemen obat' },
          { title: 'Keuangan', icon: CreditCard, path: '/billing', desc: 'Pembayaran & tagihan' },
          { title: 'Rawat Inap', icon: HeartPulse, path: '/inpatient', desc: 'Manajemen pasien rawat inap' },
        ];
      case 'FKTP':
      case 'KLINIK':
        return [
          { title: 'Manajemen Pasien', icon: User, path: '/patients', desc: 'Manajemen data pasien' },
          { title: 'Registrasi', icon: Calendar, path: '/registrations', desc: 'Pendaftaran pasien' },
          { title: 'Rekam Medis', icon: FileText, path: '/medical-records', desc: 'Riwayat medis pasien' },
          { title: 'Farmasi', icon: Pill, path: '/pharmacy', desc: 'Manajemen obat' },
          { title: 'Keuangan', icon: CreditCard, path: '/billing', desc: 'Pembayaran & tagihan' },
        ];
      case 'PUSKESMAS':
        return [
          { title: 'Manajemen Pasien', icon: User, path: '/patients', desc: 'Manajemen data pasien' },
          { title: 'Registrasi', icon: Calendar, path: '/registrations', desc: 'Pendaftaran pasien' },
          { title: 'Rekam Medis', icon: FileText, path: '/medical-records', desc: 'Riwayat medis pasien' },
          { title: 'Farmasi', icon: Pill, path: '/pharmacy', desc: 'Manajemen obat' },
          { title: 'Imunisasi', icon: Syringe, path: '/immunization', desc: 'Program imunisasi' },
          { title: 'KIA', icon: Users, path: '/kia', desc: 'Kartu ibu dan anak' },
        ];
      default:
        return [
          { title: 'Manajemen Pasien', icon: User, path: '/patients', desc: 'Manajemen data pasien' },
          { title: 'Registrasi', icon: Calendar, path: '/registrations', desc: 'Pendaftaran pasien' },
          { title: 'Rekam Medis', icon: FileText, path: '/medical-records', desc: 'Riwayat medis pasien' },
          { title: 'Farmasi', icon: Pill, path: '/pharmacy', desc: 'Manajemen obat' },
          { title: 'Keuangan', icon: CreditCard, path: '/billing', desc: 'Pembayaran & tagihan' },
        ];
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6 flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4">Memuat profil faskes...</p>
        </div>
      </div>
    );
  }

  if (!faskesProfile) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Setup Profil Faskes Diperlukan</h1>
          <p className="text-muted-foreground">
            Silakan lengkapi profil faskes Anda terlebih dahulu untuk menyesuaikan dashboard
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Profil Faskes Belum Disetel</CardTitle>
            <CardDescription>
              Anda perlu melengkapi informasi profil faskes terlebih dahulu untuk menyesuaikan dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <Link to="/setup">
                <Button>
                  <Settings className="mr-2 h-4 w-4" />
                  Setup Profil Faskes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{getDashboardTitle(faskesProfile.type)}</h1>
          <p className="text-muted-foreground">
            {getDashboardDescription(faskesProfile.type)}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Building className="h-4 w-4 text-primary" />
            <span className="text-sm">{faskesProfile.name}</span>
            <Badge variant="outline" className="ml-2">
              {faskesProfile.type === 'A' ? 'Rumah Sakit Kelas A' :
               faskesProfile.type === 'B' ? 'Rumah Sakit Kelas B' :
               faskesProfile.type === 'C' ? 'Rumah Sakit Kelas C' :
               faskesProfile.type === 'D' ? 'Rumah Sakit Kelas D' :
               faskesProfile.type === 'FKTP' ? 'FKTP' :
               faskesProfile.type === 'KLINIK' ? 'Klinik' :
               'Puskesmas'}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/profile">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Profil Faskes
            </Button>
          </Link>
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

      {(faskesProfile.type === 'A' || faskesProfile.type === 'B' || faskesProfile.type === 'C' || faskesProfile.type === 'D') && stats.availableBeds !== undefined && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Tempat Tidur Tersedia"
            value={stats.availableBeds}
            subtitle="Ketersediaan"
            icon={HeartPulse}
            variant="primary"
          />
          <StatCard
            title="Terisi"
            value={stats.occupiedBeds}
            subtitle="Saat ini"
            icon={Activity}
            variant="success"
          />
          <StatCard
            title="Dokter Aktif"
            value={stats.activeDoctors}
            subtitle="Sedang bertugas"
            icon={Stethoscope}
            variant="primary"
          />
          <StatCard
            title="Staf Tersedia"
            value={stats.availableStaff}
            subtitle="SDM"
            icon={Users}
            variant="default"
          />
        </div>
      )}

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
              Akses cepat ke modul-modul utama berdasarkan tipe faskes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {getAvailableModules(faskesProfile.type).map((module, index) => (
                <Link to={module.path} key={index}>
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center">
                    <module.icon className="h-6 w-6 mb-2" />
                    <span>{module.title}</span>
                    <span className="text-xs text-muted-foreground mt-1">{module.desc}</span>
                  </Button>
                </Link>
              ))}
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
                { id: 5, action: 'Rekam Medis Ditambahkan', patient: 'Kadek Wayan', time: '3 jam yang lalu', type: 'medical' },
              ].map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                    {activity.type === 'registration' && <User className="h-4 w-4 text-primary" />}
                    {activity.type === 'exam' && <Stethoscope className="h-4 w-4 text-primary" />}
                    {activity.type === 'payment' && <CreditCard className="h-4 w-4 text-primary" />}
                    {activity.type === 'stock' && <Pill className="h-4 w-4 text-primary" />}
                    {activity.type === 'medical' && <FileText className="h-4 w-4 text-primary" />}
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
                Pendapatan bulan ini meningkat {stats.totalRevenue > 1000000000 ? '12%' : '5%'} dari bulan lalu
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

export default DashboardByFaskesType;