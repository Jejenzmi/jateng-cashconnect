import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { Moon, Sun } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTheme, ThemeProvider } from './contexts/ThemeContext';  // Memperbaiki impor
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from '@/components/MainLayout';  // Mengarah ke file yang baru kita buat
import LoginPage from './pages/Auth';  // Mengganti LoginPage menjadi Auth
import Home from './pages/Home'; // Import Home component yang baru
import ClearSession from './pages/ClearSession'; // Import halaman untuk membersihkan session
import Index from './pages/Index'; // Import Index component
import Dashboard from './pages/Dashboard';
import PatientList from './pages/Pasien';  // Mengganti PatientList menjadi Pasien
import RegistrationForm from './pages/Pendaftaran';  // Mengganti RegistrationForm menjadi Pendaftaran
import MedicalRecordList from './pages/RekamMedis';  // Mengganti MedicalRecordList menjadi RekamMedis
import Pharmacy from './pages/Farmasi';  // Mengganti Pharmacy menjadi Farmasi
import Billing from './pages/Billing';
import Inpatient from './pages/RawatInap';  // Mengganti Inpatient menjadi RawatInap
import Laboratory from './pages/Laboratorium';  // Mengganti Laboratory menjadi Laboratorium
import Radiology from './pages/Radiologi';  // Mengganti Radiology menjadi Radiologi
import Immunization from './pages/Immunization';
import KIA from './pages/KIA';
import ICDWHO from './pages/ICDWHO';
import IDRGPg from './pages/IDRGPage';  // Mengganti iDRG menjadi IDRGPage
import BpjsIntegration from './pages/BPJS';  // Mengganti BpjsIntegration menjadi BPJS
import MasterData from './pages/MasterData';
import KycDicom from './pages/DICOMIntegration';  // Mengganti KycDicom menjadi DICOMIntegration
import SatuSehatIntegration from './pages/SatuSehat';  // Mengganti SatuSehatIntegration menjadi SatuSehat
import SatuSehatSetting from './pages/SatuSehatSetting';  // Menggunakan file yang baru dibuat
import FaskesList from './pages/FaskesList';  // Menggunakan file yang baru dibuat
import UserManagement from './pages/ManajemenUser';  // Mengganti UserManagement menjadi ManajemenUser
import SetupFaskes from './pages/Setup';  // Mengganti SetupFaskes menjadi Setup
import ProfileFaskes from './pages/ProfileFaskes';  // Menggunakan file yang baru dibuat
import { ProtectedRoute } from './components/ProtectedRoute';
import ClearSessionProvider from './components/ClearSessionProvider';
import { moduleRoutes } from './routes/module-routes'; // Import module routes

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false, // Disable automatic refetching when window comes into focus to prevent auto-refresh
      refetchOnReconnect: true,    // Still refetch on reconnection
      refetchOnMount: false,       // Don't refetch when component mounts
    },
  },
});

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { user, loading: authLoading } = useAuth();

  console.log('Auth state:', { user, authLoading }); // Debug log

  if (authLoading) {
    console.log('Loading auth state...'); // Debug log
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  console.log('Rendering routes...'); // Debug log
  
  return (
    <ClearSessionProvider>
      <div className="App">
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 z-50"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        
        <Routes>
          {/* Route untuk membersihkan session */}
          <Route path="/clear-session" element={<ClearSession />} />
          
          {/* Home route sebagai root path yang akan mengecek status setup */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/setup" element={<SetupFaskes />} />
          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/registrations" element={<RegistrationForm />} />
            <Route path="/medical-records" element={<MedicalRecordList />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/inpatient" element={<Inpatient />} />
            <Route path="/laboratory" element={<Laboratory />} />
            <Route path="/radiology" element={<Radiology />} />
            <Route path="/immunization" element={<Immunization />} />
            <Route path="/kia" element={<KIA />} />
            <Route path="/idrg" element={<IDRGPg />} />
            <Route path="/icd-who" element={<ICDWHO />} />
            <Route path="/bpjs" element={<BpjsIntegration />} />
            <Route path="/masterdata" element={<MasterData />} />
            <Route path="/kyc-dicom" element={<KycDicom />} />
            <Route path="/satusehat" element={<SatuSehatIntegration />} />
            <Route path="/settings/satusehat" element={<SatuSehatSetting />} />
            <Route path="/faskes" element={<FaskesList />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/profile" element={<ProfileFaskes />} />
            
            {/* Render module routes dynamically */}
            {moduleRoutes.map((route, index) => (
              <Route 
                key={`module-${index}`} 
                path={route.path} 
                element={route.element} 
              />
            ))}
          </Route>
        </Routes>
        <Toaster position="bottom-right" />
      </div>
    </ClearSessionProvider>
  );
}

function App() {
  return (
    <Router>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </Router>
  );
}

export default App;