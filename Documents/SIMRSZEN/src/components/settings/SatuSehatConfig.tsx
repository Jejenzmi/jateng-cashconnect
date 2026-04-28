import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { Shield, Save, RotateCcw, Key, Globe, Network } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

interface SatuSehatConfig {
  id?: string;
  clientId: string;
  clientSecret: string;
  baseUrl: string;
  authUrl: string;
  organizationId: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const SatuSehatConfig: React.FC = () => {
  const [config, setConfig] = useState<SatuSehatConfig>({
    clientId: '',
    clientSecret: '',
    baseUrl: 'https://api-satusehat.bpmn.io/fhir-r4',
    authUrl: 'https://api-satusehat.bpmn.io/auth/realms/satusehat/protocol/openid-connect/token',
    organizationId: '',
    isActive: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/satusehat-config');
      
      if (response.data.success) {
        setConfig(response.data.data);
      } else {
        // Jika konfigurasi belum disetel, gunakan nilai default
        setConfig({
          clientId: '',
          clientSecret: '',
          baseUrl: 'https://api-satusehat.bpmn.io/fhir-r4',
          authUrl: 'https://api-satusehat.bpmn.io/auth/realms/satusehat/protocol/openid-connect/token',
          organizationId: '',
          isActive: false
        });
      }
    } catch (error: any) {
      console.error('Error loading Satu Sehat config:', error);
      toast.error('Gagal memuat konfigurasi Satu Sehat');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await apiClient.post('/satusehat-config', config);
      
      if (response.data.success) {
        toast.success('Konfigurasi Satu Sehat berhasil disimpan');
      } else {
        toast.error(response.data.message || 'Gagal menyimpan konfigurasi Satu Sehat');
      }
    } catch (error: any) {
      console.error('Error saving Satu Sehat config:', error);
      toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan konfigurasi Satu Sehat');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setConfig({
      clientId: '',
      clientSecret: '',
      baseUrl: 'https://api-satusehat.bpmn.io/fhir-r4',
      authUrl: 'https://api-satusehat.bpmn.io/auth/realms/satusehat/protocol/openid-connect/token',
      organizationId: '',
      isActive: false
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RotateCcw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Konfigurasi Integrasi Satu Sehat
          </CardTitle>
          <CardDescription>
            Atur kredensial dan parameter koneksi ke platform Satu Sehat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientId">Client ID *</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="clientId" 
                      name="clientId" 
                      value={config.clientId} 
                      onChange={handleChange} 
                      placeholder="Client ID dari portal Satu Sehat"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="clientSecret">Client Secret *</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="clientSecret" 
                      name="clientSecret" 
                      type="password" 
                      value={config.clientSecret} 
                      onChange={handleChange} 
                      placeholder="Client Secret dari portal Satu Sehat"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="organizationId">Organization ID *</Label>
                  <div className="relative">
                    <Network className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="organizationId" 
                      name="organizationId" 
                      value={config.organizationId} 
                      onChange={handleChange} 
                      placeholder="ID organisasi dari portal Satu Sehat"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="baseUrl">Base URL API</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="baseUrl" 
                      name="baseUrl" 
                      value={config.baseUrl} 
                      onChange={handleChange} 
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="authUrl">Auth URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="authUrl" 
                      name="authUrl" 
                      value={config.authUrl} 
                      onChange={handleChange} 
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="isActive"
                    name="isActive"
                    checked={config.isActive}
                    onCheckedChange={(checked) => setConfig({...config, isActive: Boolean(checked)})}
                  />
                  <Label htmlFor="isActive">Aktifkan Integrasi Satu Sehat</Label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={handleReset} disabled={saving}>
                Reset
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Konfigurasi
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SatuSehatConfig;