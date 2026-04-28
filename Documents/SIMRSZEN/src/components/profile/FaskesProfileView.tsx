import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Edit, Building, MapPin, Phone, Mail, Users, Calendar, Loader2 } from 'lucide-react';
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

const FaskesProfileView: React.FC = () => {
  const [profile, setProfile] = useState<FaskesProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/faskes-profile');
      
      if (response.data.success) {
        setProfile(response.data.data);
        // Simpan ke localStorage sebagai fallback
        localStorage.setItem('faskesProfile', JSON.stringify(response.data.data));
      } else {
        toast.error(response.data.message || 'Gagal mengambil profil faskes');
      }
    } catch (error: any) {
      console.error('Error fetching faskes profile:', error);
      toast.error(error.response?.data?.message || 'Terjadi kesalahan saat mengambil profil faskes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4">Mengambil data profil faskes...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Profil Fasilitas Kesehatan</CardTitle>
            <CardDescription>
              Profil faskes belum diatur. Silakan lengkapi setup awal terlebih dahulu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <Button onClick={() => navigate('/setup')}>
                Setup Profil Faskes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'A': return 'Rumah Sakit Kelas A';
      case 'B': return 'Rumah Sakit Kelas B';
      case 'C': return 'Rumah Sakit Kelas C';
      case 'D': return 'Rumah Sakit Kelas D';
      case 'FKTP': return 'Fasilitas Kesehatan Tingkat Pertama';
      case 'KLINIK': return 'Klinik';
      case 'PUSKESMAS': return 'Puskesmas';
      default: return type;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {profile.name}
            </CardTitle>
            <CardDescription>
              Profil fasilitas kesehatan Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tipe Faskes</h3>
                  <Badge variant="outline" className="mt-1">
                    {getTypeLabel(profile.type)}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Alamat</h3>
                  <p className="mt-1">{profile.address}</p>
                  <p className="text-sm text-muted-foreground">{profile.city}, {profile.province}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Nomor Izin Operasional</h3>
                  <p className="mt-1">{profile.licenseNumber}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Beroperasi Sejak</h3>
                  <p className="mt-1">{new Date(profile.operationalSince).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Kapasitas Tempat Tidur</h3>
                  <p className="mt-1">{profile.capacity > 0 ? `${profile.capacity} bed` : 'Tidak disebutkan'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Direktur</h3>
                  <p className="mt-1 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {profile.director}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Telepon</h3>
                  <p className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {profile.phone}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p className="mt-1 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </p>
                </div>
              </div>
            </div>
            
            {profile.description && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-muted-foreground">Deskripsi</h3>
                <p className="mt-1">{profile.description}</p>
              </div>
            )}
            
            <div className="mt-6 text-xs text-muted-foreground">
              <p>Dibuat: {new Date(profile.createdAt).toLocaleString('id-ID')}</p>
              <p>Terakhir diperbarui: {new Date(profile.updatedAt).toLocaleString('id-ID')}</p>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="ml-4 self-start"
          onClick={() => navigate('/setup')}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FaskesProfileView;