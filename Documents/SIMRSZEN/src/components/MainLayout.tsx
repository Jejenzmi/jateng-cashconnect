import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Building,  // Ganti Hospital dengan Building
  Users,
  User,
  FileText,
  Pill,
  CreditCard,
  Settings,
  Bell,
  Search,
  Calendar,
  Activity,
  Menu as MenuIcon,
  Wrench,
  HeartPulse,
  Syringe,
  Scan,
  Baby,
  Users as UsersIcon,
  Globe,
  Key,
  MapPin,
  Database,
  FileText as FileTextIcon,
  HardDrive,
  Calculator,
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
}

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  const menuItems: MenuItem[] = [
    { title: 'Dashboard', icon: <Building className="h-5 w-5" />, path: '/' }, // Ganti Hospital menjadi Building
    { title: 'Manajemen Pasien', icon: <User className="h-5 w-5" />, path: '/patients' },
    { title: 'Registrasi', icon: <Calendar className="h-5 w-5" />, path: '/registrations' },
    { title: 'Rekam Medis', icon: <FileText className="h-5 w-5" />, path: '/medical-records' },
    { title: 'Farmasi', icon: <Pill className="h-5 w-5" />, path: '/pharmacy' },
    { title: 'Keuangan', icon: <CreditCard className="h-5 w-5" />, path: '/billing' },
    { title: 'Rawat Inap', icon: <HeartPulse className="h-5 w-5" />, path: '/inpatient' },
    { title: 'Laboratorium', icon: <Syringe className="h-5 w-5" />, path: '/laboratory' },
    { title: 'Radiologi', icon: <Scan className="h-5 w-5" />, path: '/radiology' },
    { title: 'Imunisasi', icon: <Syringe className="h-5 w-5" />, path: '/immunization' },
    { title: 'KIA', icon: <Baby className="h-5 w-5" />, path: '/kia' },
    { title: 'iDRG', icon: <Calculator className="h-5 w-5" />, path: '/idrg' },
    { title: 'ICD WHO', icon: <BookOpen className="h-5 w-5" />, path: '/icd-who' },
    { title: 'BPJS', icon: <ShieldCheck className="h-5 w-5" />, path: '/bpjs' },
    { title: 'Master Data', icon: <Database className="h-5 w-5" />, path: '/masterdata' },
    { title: 'KYC & DICOM', icon: <HardDrive className="h-5 w-5" />, path: '/kyc-dicom' },
    { title: 'Integrasi Satu Sehat', icon: <Globe className="h-5 w-5" />, path: '/satusehat' },
    { title: 'Pengaturan Satu Sehat', icon: <Key className="h-5 w-5" />, path: '/settings/satusehat' },
    { title: 'Fasilitas Kesehatan', icon: <Building className="h-5 w-5" />, path: '/faskes' },
    { title: 'Pengguna', icon: <Users className="h-5 w-5" />, path: '/users' },
    { title: 'Setup Faskes', icon: <Wrench className="h-5 w-5" />, path: '/setup' },
    { title: 'Profil Faskes', icon: <Settings className="h-5 w-5" />, path: '/profile' },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent menuItems={menuItems} location={location} onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SidebarContent menuItems={menuItems} location={location} />
      </div>

      {/* Main content */}
      <div className="flex-1 md:pl-64">
        {/* Top navigation bar */}
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <MenuIcon className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>
              <div className="flex items-center gap-2">
                <Building className="h-8 w-8 text-primary" /> {/* Ganti Hospital menjadi Building */}
                <h1 className="text-xl font-bold hidden sm:block">SIMRS ZEN</h1>
              </div>
            </div>

            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari pasien, rekam medis, atau tagihan..."
                  className="pl-8"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">3</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">
                      AD
                    </div>
                    <span>Admin</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profil</DropdownMenuItem>
                  <DropdownMenuItem>Pengaturan</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Keluar</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

interface SidebarContentProps {
  menuItems: MenuItem[];
  location: { pathname: string };
  onClose?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ menuItems, location, onClose }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-4 border-b">
        <Building className="h-8 w-8 text-primary" /> {/* Ganti Hospital menjadi Building */}
        <h1 className="text-xl font-bold">SIMRS ZEN</h1>
        <Button 
          variant="outline" 
          size="icon" 
          className="ml-auto md:hidden"
          onClick={() => onClose && onClose()}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  location.pathname === item.path 
                    ? 'bg-primary text-primary-foreground' 
                    : 'aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground'
                }`}
                onClick={() => onClose && onClose()}
              >
                {item.icon}
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium">Admin SIMRS</p>
            <p className="text-xs text-muted-foreground">admin@simrszen.local</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;