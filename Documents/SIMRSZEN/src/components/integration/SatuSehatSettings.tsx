import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

const SatuSehatSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    active: true,
    organizationId: 'b1eb0d2d-feb8-44da-b0ab-a32c8e7fa5a3',
    clientId: 'QzABfhf3NaJbrB2ZZEBNVKvuYiQfPINAtEybmn4Q9tueFOe1',
    clientSecret: 'sMcm1O30cbpyBy7iKmAUYoSu4AUY1G6K6o0ExX5eii5ycjxyuV1L620vG6AlwWOg',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected');

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/satusehat/settings`, {
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth-session') || '{}').token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.config) {
            setSettings({
              active: data.config.active ?? true,
              organizationId: data.config.organizationId || 'b1eb0d2d-feb8-44da-b0ab-a32c8e7fa5a3',
              clientId: data.config.clientId || 'QzABfhf3NaJbrB2ZZEBNVKvuYiQfPINAtEybmn4Q9tueFOe1',
              clientSecret: data.config.clientSecret || 'sMcm1O30cbpyBy7iKmAUYoSu4AUY1G6K6o0ExX5eii5ycjxyuV1L620vG6AlwWOg',
            });
            // Automatically test connection after loading
            if (data.config.clientId && data.config.clientSecret) {
              setConnectionStatus('testing');
              const testResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/satusehat/test-connection`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth-session') || '{}').token}`
                },
                body: JSON.stringify(data.config),
              });
              if (testResponse.ok) {
                const result = await testResponse.json();
                setConnectionStatus(result.connected ? 'connected' : 'disconnected');
              } else {
                setConnectionStatus('disconnected');
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading Satu Sehat settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const handleChange = (field: keyof typeof settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    
    try {
      // Dalam implementasi nyata, ini akan menguji koneksi ke layanan Satu Sehat
      // dengan menggunakan credential yang disediakan
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/satusehat/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth-session') || '{}').token}`
        },
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        const result = await response.json();
        setConnectionStatus(result.connected ? 'connected' : 'disconnected');
        toast({
          title: result.connected ? "Koneksi Berhasil" : "Koneksi Gagal",
          description: result.message,
          variant: result.connected ? undefined : "destructive"
        });
      } else {
        const error = await response.json();
        setConnectionStatus('disconnected');
        toast({
          title: "Koneksi Gagal",
          description: error.error || "Tidak dapat menguji koneksi ke layanan Satu Sehat",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error testing Satu Sehat connection:', error);
      setConnectionStatus('disconnected');
      toast({
        title: "Koneksi Gagal",
        description: "Tidak dapat terhubung ke server untuk menguji koneksi Satu Sehat",
        variant: "destructive"
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/satusehat/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth-session') || '{}').token}`
        },
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Pengaturan Tersimpan",
          description: result.message || "Konfigurasi integrasi Satu Sehat telah disimpan",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Gagal Menyimpan",
          description: error.error || "Terjadi kesalahan saat menyimpan pengaturan Satu Sehat",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving Satu Sehat settings:', error);
      toast({
        title: "Gagal Menyimpan",
        description: "Tidak dapat terhubung ke server untuk menyimpan pengaturan",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Pengaturan Integrasi Satu Sehat | SIMRS ZEN</title>
        <meta name="description" content="Halaman pengaturan integrasi dengan platform Satu Sehat milik Kementerian Kesehatan RI" />
      </Helmet>
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Pengaturan Integrasi Satu Sehat</CardTitle>
            <CardDescription>
              Konfigurasi koneksi dan sinkronisasi data dengan platform Satu Sehat milik Kementerian Kesehatan RI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave}>
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="satusehat-active"
                    checked={settings.active}
                    onCheckedChange={(checked) => handleChange('active', checked)}
                  />
                  <Label htmlFor="satusehat-active">Aktifkan Integrasi Satu Sehat</Label>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationId">Organization ID</Label>
                    <Input
                      id="organizationId"
                      type="text"
                      value={settings.organizationId}
                      onChange={(e) => handleChange('organizationId', e.target.value)}
                      placeholder="Masukkan Organization ID dari Satu Sehat"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientId">Client ID</Label>
                    <Input
                      id="clientId"
                      type="text"
                      value={settings.clientId}
                      onChange={(e) => handleChange('clientId', e.target.value)}
                      placeholder="Masukkan Client ID dari Satu Sehat"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientSecret">Client Secret</Label>
                    <Input
                      id="clientSecret"
                      type="password"
                      value={settings.clientSecret}
                      onChange={(e) => handleChange('clientSecret', e.target.value)}
                      placeholder="Masukkan Client Secret dari Satu Sehat"
                    />
                  </div>
                </div>

                <Alert className={connectionStatus === 'connected' ? 'border-green-500 bg-green-50' : 
                                connectionStatus === 'testing' ? 'border-yellow-500 bg-yellow-50' : 
                                'border-red-500 bg-red-50'}>
                  <AlertDescription>
                    Status Koneksi: 
                    <span className={`ml-2 font-medium ${connectionStatus === 'connected' ? 'text-green-600' : 
                                     connectionStatus === 'testing' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {connectionStatus === 'connected' ? 'Terhubung' : 
                       connectionStatus === 'testing' ? 'Menguji koneksi...' : 'Tidak terhubung'}
                    </span>
                  </AlertDescription>
                </Alert>

                <div className="flex flex-wrap gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleTestConnection}
                    disabled={connectionStatus === 'testing'}
                  >
                    {connectionStatus === 'testing' ? 'Menguji...' : 'Uji Koneksi'}
                  </Button>
                  
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SatuSehatSettings;