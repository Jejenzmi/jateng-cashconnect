import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { Building, MapPin, Phone, Mail, Users, Calendar, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

interface FaskesProfile {
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
}

const FaskesProfileSetup: React.FC = () => {
  const [profile, setProfile] = useState<FaskesProfile>({
    name: '',
    type: 'FKTP',
    address: '',
    city: '',
    province: '',
    phone: '',
    email: '',
    licenseNumber: '',
    operationalSince: '',
    capacity: 0,
    director: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setProfile(prev => ({ ...prev, type: value as any }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await apiClient.post('/faskes-profile', profile);
      
      if (response.data.success) {
        toast.success('Profil faskes berhasil disimpan');
        // Simpan ke localStorage sebagai fallback
        localStorage.setItem('faskesProfile', JSON.stringify(profile));
        navigate('/');
      } else {
        toast.error(response.data.message || 'Gagal menyimpan profil faskes');
      }
    } catch (error: any) {
      console.error('Error saving faskes profile:', error);
      toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan profil faskes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Setup Profil Fasilitas Kesehatan</CardTitle>
          <CardDescription>
            Lengkapi informasi profil faskes Anda untuk menyesuaikan dashboard dengan tipe faskes yang dipilih
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Faskes</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="name" 
                      name="name" 
                      value={profile.name} 
                      onChange={handleChange} 
                      placeholder="Nama resmi fasilitas kesehatan"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="type">Tipe Faskes</Label>
                  <Select value={profile.type} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe faskes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Rumah Sakit Kelas A</SelectItem>
                      <SelectItem value="B">Rumah Sakit Kelas B</SelectItem>
                      <SelectItem value="C">Rumah Sakit Kelas C</SelectItem>
                      <SelectItem value="D">Rumah Sakit Kelas D</SelectItem>
                      <SelectItem value="FKTP">Fasilitas Kesehatan Tingkat Pertama (FKTP)</SelectItem>
                      <SelectItem value="KLINIK">Klinik</SelectItem>
                      <SelectItem value="PUSKESMAS">Puskesmas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="licenseNumber">Nomor Izin Operasional</Label>
                  <Input 
                    id="licenseNumber" 
                    name="licenseNumber" 
                    value={profile.licenseNumber} 
                    onChange={handleChange} 
                    placeholder="Nomor izin operasional faskes"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="operationalSince">Beroperasi Sejak</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="operationalSince" 
                      name="operationalSince" 
                      type="date" 
                      value={profile.operationalSince} 
                      onChange={handleChange}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="director">Nama Direktur</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="director" 
                      name="director" 
                      value={profile.director} 
                      onChange={handleChange} 
                      placeholder="Nama direktur utama"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="capacity">Kapasitas Tempat Tidur</Label>
                  <Input 
                    id="capacity" 
                    name="capacity" 
                    type="number" 
                    value={profile.capacity} 
                    onChange={handleChange} 
                    placeholder="Jumlah tempat tidur"
                    min="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={profile.phone} 
                      onChange={handleChange} 
                      placeholder="Nomor telepon utama"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={profile.email} 
                      onChange={handleChange} 
                      placeholder="Email resmi faskes"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Alamat Lengkap</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea 
                  id="address" 
                  name="address" 
                  value={profile.address} 
                  onChange={handleChange} 
                  placeholder="Alamat jalan, nomor, kelurahan, kecamatan, dll."
                  className="pl-9 min-h-[100px]"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="city">Kota/Kabupaten</Label>
                <Input 
                  id="city" 
                  name="city" 
                  value={profile.city} 
                  onChange={handleChange} 
                  placeholder="Nama kota atau kabupaten"
                  required
                />
              </div>
              <div>
                <Label htmlFor="province">Provinsi</Label>
                <Input 
                  id="province" 
                  name="province" 
                  value={profile.province} 
                  onChange={handleChange} 
                  placeholder="Nama provinsi"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Deskripsi Faskes</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={profile.description} 
                onChange={handleChange} 
                placeholder="Deskripsi singkat tentang faskes Anda"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/')} disabled={loading}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Profil & Lanjutkan'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FaskesProfileSetup;