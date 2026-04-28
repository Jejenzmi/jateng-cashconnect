import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import LoginLogo from '@/components/LoginLogo';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Loading component untuk semua lazy-loaded route
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[70vh]">
    <Card className="p-6 flex flex-col items-center gap-4 shadow-sm">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Memuat halaman...</p>
    </Card>
  </div>
);

// Lazy load semua halaman utama
export const DashboardPage = lazy(() => 
  import('@/pages/Dashboard').then(module => ({ 
    default: module.default 
  }))
);

export const LoginPage = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (!email || !password) {
      toast.error('Email dan password wajib diisi');
      return;
    }
    
    try {
      const success = await signIn(email, password);
      
      if (success) {
        toast.success('Login berhasil');
        navigate('/dashboard'); // Arahkan ke dashboard setelah login
      } else {
        toast.error('Email atau password salah');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat login');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginLogo />
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Login form content */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Ingat saya
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Lupa password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Masuk
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const PatientPage = lazy(() => 
  import('@/pages/Pasien').then(module => ({ 
    default: module.default 
  }))
);

export const QueuePage = lazy(() => 
  import('@/pages/Antrian').then(module => ({ 
    default: module.default 
  }))
);

export const MedicalRecordPage = lazy(() => 
  import('@/pages/RekamMedis').then(module => ({ 
    default: module.default 
  }))
);

export const PharmacyPage = lazy(() => 
  import('@/pages/Farmasi').then(module => ({ 
    default: module.default 
  }))
);

export const LaboratoryPage = lazy(() => 
  import('@/pages/Laboratorium').then(module => ({ 
    default: module.default 
  }))
);

export const RadiologyPage = lazy(() => 
  import('@/pages/Radiologi').then(module => ({ 
    default: module.default 
  }))
);

export const BillingPage = lazy(() => 
  import('@/pages/Billing').then(module => ({ 
    default: module.default 
  }))
);

export const SettingPage = lazy(() => 
  import('@/pages/Pengaturan').then(module => ({ 
    default: module.default 
  }))
);

export const KioskPage = lazy(() => 
  import('@/pages/Kiosk').then(module => ({ 
    default: module.default 
  }))
);

export const SmartDisplayPage = lazy(() => 
  import('@/pages/SmartDisplay').then(module => ({ 
    default: module.default 
  }))
);

// Lazy load untuk modul Psikologi Klinis
export const ClinicalPsychologyDashboardPage = lazy(() => 
  import('@/components/clinical-psychology/ClinicalPsychologyDashboard').then(module => ({ 
    default: module.default 
  }))
);

export const PsychologyPatientListPage = lazy(() => 
  import('@/components/clinical-psychology/PsychologyPatientList').then(module => ({ 
    default: module.default 
  }))
);

export const PsychologySessionFormPage = lazy(() => 
  import('@/components/clinical-psychology/PsychologySessionForm').then(module => ({ 
    default: module.default 
  }))
);

export const PsychologyReportsPage = lazy(() => 
  import('@/components/clinical-psychology/PsychologyReports').then(module => ({ 
    default: module.default 
  }))
);

// Lazy load untuk modul Pelayanan Rohani
export const SpiritualCareDashboardPage = lazy(() => 
  import('@/components/spiritual-care/SpiritualCareDashboard').then(module => ({ 
    default: module.default 
  }))
);

export const SpiritualServiceRequestsPage = lazy(() => 
  import('@/components/spiritual-care/SpiritualServiceRequests').then(module => ({ 
    default: module.default 
  }))
);

export const SpiritualClergyListPage = lazy(() => 
  import('@/components/spiritual-care/SpiritualClergyList').then(module => ({ 
    default: module.default 
  }))
);

export const SpiritualCareReportsPage = lazy(() => 
  import('@/components/spiritual-care/SpiritualCareReports').then(module => ({ 
    default: module.default 
  }))
);

// Lazy load untuk modul HR (Sumber Daya Manusia)
export const HREmployeeManagementPage = lazy(() => 
  import('@/components/hr/EmployeeList').then(module => ({ 
    default: module.default 
  }))
);

export const HRAttendanceTrackingPage = lazy(() => 
  import('@/components/hr/AttendanceTab').then(module => ({ 
    default: module.default 
  }))
);

export const HRPayrollProcessingPage = lazy(() => 
  import('@/components/hr/PayrollTab').then(module => ({ 
    default: module.default 
  }))
);

export const HRPerformanceEvaluationPage = lazy(() => 
  import('@/components/hr/PerformanceTab').then(module => ({ 
    default: module.default 
  }))
);

// Lazy load untuk modul Purchasing (Pembelian)
export const SupplierManagementPage = lazy(() => 
  import('@/components/inventory/SupplierManagement').then(module => ({ 
    default: module.default 
  }))
);

export const PurchaseRequestPage = lazy(() => 
  import('@/components/inventory/PurchaseRequestApproval').then(module => ({ 
    default: module.default 
  }))
);

export const PurchaseOrderPage = lazy(() => 
  import('@/components/inventory/PurchaseOrders').then(module => ({ 
    default: module.default 
  }))
);

export const ProcurementTrackingPage = lazy(() => 
  import('@/components/inventory/InventoryTransactions').then(module => ({ 
    default: module.default 
  }))
);

// Wrapper untuk lazy-loaded route dengan suspense
export const LazyRouteWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
);