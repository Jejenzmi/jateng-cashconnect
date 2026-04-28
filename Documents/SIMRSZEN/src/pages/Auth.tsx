import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, Shield, Activity, Users, HeartPulse, Stethoscope, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { setupService } from "@/services/setupService";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, session, signIn, loading: authLoading, faskesProfileExists } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Cek status setup sebelum menampilkan halaman login
  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const status = await setupService.checkSetupStatus();
        
        // Jika setup belum selesai, arahkan ke halaman setup
        if (!status.setupCompleted) {
          navigate("/setup");
        }
      } catch (error) {
        console.error("Error checking setup status:", error);
        // Jika terjadi error saat mengecek status setup, arahkan ke setup sebagai fallback
        navigate("/setup");
      }
    };
    
    // Hanya periksa jika belum ada user yang login
    if (!user && !session) {
      checkSetupStatus();
    }
  }, [user, session, navigate]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user && session) {
      // If user is authenticated and setup is completed, go to dashboard
      if (faskesProfileExists === true) {
        navigate("/", { replace: true });
      } 
      // If user is authenticated but setup is not completed, go to setup
      else if (faskesProfileExists === false) {
        navigate("/setup", { replace: true });
      }
      // If faskesProfileExists is still null, we're still checking, so don't navigate yet
    }
  }, [user, session, faskesProfileExists, authLoading, navigate]);

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-blue-800 font-medium">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  // If already authenticated, show loading while redirecting
  if (user && session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-blue-800 font-medium">Mengalihkan...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Membersihkan input sebelum digunakan
    const cleanedEmail = loginData.email.trim();
    const cleanedPassword = loginData.password.trim();
    
    // Simple validation
    const newErrors: Record<string, string> = {};
    if (!cleanedEmail) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(cleanedEmail)) {
      newErrors.email = "Format email tidak valid";
    }
    
    if (!cleanedPassword) {
      newErrors.password = "Password wajib diisi";
    } else if (cleanedPassword.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const result = await signIn(cleanedEmail, cleanedPassword);
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: result.error === "Invalid login credentials" 
          ? "Email atau password salah" 
          : result.error,
      });
    } else {
      toast({
        title: "Login Berhasil",
        description: "Selamat datang di SIMRS ZEN",
      });
      
      // Redirect based on whether setup is completed
      if (result.needsSetup) {
        navigate("/setup", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Panel - Branding with Enhanced Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-800 via-indigo-900 to-purple-900 text-white p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-300"></div>
        </div>
        
        <div className="max-w-md text-center relative z-10 flex flex-col justify-center">
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-lg">
              <img 
                src="/simrs-zen-logo.png" 
                alt="SIMRS ZEN Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">SIMRS ZEN</h1>
            <p className="text-xl text-blue-200 font-light mb-8">Sistem Informasi Manajemen Rumah Sakit Terintegrasi</p>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col items-center">
                <HeartPulse className="h-8 w-8 text-green-300 mb-2" />
                <p className="text-sm text-blue-100">Manajemen Pasien</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col items-center">
                <Stethoscope className="h-8 w-8 text-yellow-300 mb-2" />
                <p className="text-sm text-blue-100">Rekam Medis</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col items-center">
                <Calendar className="h-8 w-8 text-blue-300 mb-2" />
                <p className="text-sm text-blue-100">Jadwal Dokter</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col items-center">
                <FileText className="h-8 w-8 text-purple-300 mb-2" />
                <p className="text-sm text-blue-100">Laporan</p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-left">
              <h3 className="font-bold text-lg mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-300" />
                Keamanan Data Terjamin
              </h3>
              <p className="text-sm text-blue-100 leading-relaxed">
                Sistem kami menggunakan enkripsi tingkat tinggi untuk menjaga kerahasiaan data medis pasien sesuai dengan regulasi yang berlaku.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Enhanced Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-full max-w-md">
          {/* Mobile logo header */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-lg p-2 mb-4 mx-auto border-2 border-blue-100">
              <img src="/simrs-zen-logo.png" alt="SIMRS ZEN" className="h-12 w-auto object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">SIMRS ZEN</h1>
            <p className="text-gray-600 mt-2">Sistem Informasi Manajemen Rumah Sakit</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6 transition-all duration-300 hover:shadow-2xl border border-white">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800">Selamat Datang</h2>
              <p className="text-gray-600 mt-2">Masuk ke akun Anda untuk melanjutkan</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-700 font-medium">Email</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 z-10">
                      <Mail className="h-5 w-5" />
                    </div>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="masukkan email Anda"
                      className="pl-10 py-6 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl transition-all bg-white/50"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-500 font-medium">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-700 font-medium">Password</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 z-10">
                      <Lock className="h-5 w-5" />
                    </div>
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="masukkan password Anda"
                      className="pl-10 pr-10 py-6 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl transition-all bg-white/50"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors z-10"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500 font-medium">{errors.password}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input 
                    id="remember-me" 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Ingat saya
                  </label>
                </div>
                
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  Lupa password?
                </a>
              </div>

              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-2xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  "Masuk ke Akun"
                )}
              </Button>
            </form>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Butuh bantuan? Hubungi admin di{' '}
                <a href="mailto:support@simrs.com" className="font-medium text-blue-600 hover:text-blue-800">
                  support@simrs.com
                </a>
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} SIMRS ZEN. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;