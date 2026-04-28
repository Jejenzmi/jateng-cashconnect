import React, { useState, useEffect } from 'react';
import SetupWizard from '@/components/setup/SetupWizard';
import { setupService } from '@/services/setupService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const SetupPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { faskesProfileExists, user, loading: authLoading } = useAuth();

  console.log('SetupPage rendered - authLoading:', authLoading, 'faskesProfileExists:', faskesProfileExists, 'user:', user);

  useEffect(() => {
    console.log('SetupPage useEffect running - faskesProfileExists:', faskesProfileExists);
    
    // Tunggu dulu auth loading selesai
    if (authLoading) {
      return;
    }

    // Langsung tampilkan setup wizard tanpa menunggu status auth
    // karena kita sedang di halaman setup
    console.log('Showing setup wizard');
    setShowSetup(true);
    setLoading(false);
  }, [authLoading, faskesProfileExists]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg">Memuat setup...</p>
        </div>
      </div>
    );
  }

  if (error && !showSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Status Setup</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            {error.includes('sudah diatur') ? (
              <div className="space-y-4">
                <p>Klik tombol di bawah untuk pergi ke halaman yang sesuai:</p>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate('/login')}
                    variant="outline"
                    className="flex-1"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate('/')}
                    className="flex-1"
                  >
                    Dashboard
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="w-full"
              >
                Coba Lagi
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render setup wizard tanpa card dan elemen layout lainnya
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto py-8 px-4">
        {showSetup && <SetupWizard />}
      </div>
    </div>
  );
};

export default SetupPage;