import React, { useState } from 'react';
import { setupService } from '@/services/setupService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';  // Menambahkan import useToast
import { useNavigate } from 'react-router-dom';

const SetupWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    hospital_name: '',
    hospital_code: '',
    hospital_type: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    phone: '',
    email: '',
    website: '',
    accreditation_status: '',
    bed_count_total: 0,
    is_teaching_hospital: false,
    npwp: '',
    director_name: '',
    admin_email: '',
    admin_password: '',
    admin_confirm_password: '',
    selected_modules: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const modules = [
    { id: 'registration', name: 'Pendaftaran', description: 'Modul pendaftaran pasien' },
    { id: 'medical_records', name: 'Rekam Medis', description: 'Modul rekam medis pasien' },
    { id: 'pharmacy', name: 'Farmasi', description: 'Modul manajemen obat dan farmasi' },
    { id: 'billing', name: 'Keuangan', description: 'Modul pembayaran dan tagihan' },
    { id: 'inventory', name: 'Inventaris', description: 'Modul manajemen inventaris' },
    { id: 'laboratory', name: 'Laboratorium', description: 'Modul manajemen laboratorium' },
    { id: 'radiology', name: 'Radiologi', description: 'Modul manajemen radiologi' },
    { id: 'inpatient', name: 'Rawat Inap', description: 'Modul manajemen rawat inap' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleModuleToggle = (moduleId: string) => {
    setFormData(prev => {
      if (prev.selected_modules.includes(moduleId)) {
        return {
          ...prev,
          selected_modules: prev.selected_modules.filter(id => id !== moduleId)
        };
      } else {
        return {
          ...prev,
          selected_modules: [...prev.selected_modules, moduleId]
        };
      }
    });
  };

  const handleNext = () => {
    if (step === 1) {
      // Validasi form step 1
      if (!formData.hospital_name || !formData.hospital_code || !formData.hospital_type) {
        toast({
          title: 'Error',
          description: 'Mohon lengkapi semua field wajib',
          variant: 'destructive'
        });
        return;
      }
    } else if (step === 2) {
      // Validasi form step 2
      if (!formData.admin_email || !formData.admin_password) {
        toast({
          title: 'Error',
          description: 'Mohon lengkapi semua field wajib',
          variant: 'destructive'
        });
        return;
      }
      
      if (formData.admin_password !== formData.admin_confirm_password) {
        toast({
          title: 'Error',
          description: 'Password dan konfirmasi password tidak cocok',
          variant: 'destructive'
        });
        return;
      }
    }
    
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const payload = {
        hospitalInfo: {
          hospital_name: formData.hospital_name,
          hospital_code: formData.hospital_code,
          hospital_type: formData.hospital_type,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postal_code: formData.postal_code,
          phone: formData.phone,
          email: formData.email,
          website: formData.website,
          accreditation_status: formData.accreditation_status,
          bed_count_total: formData.bed_count_total,
          is_teaching_hospital: formData.is_teaching_hospital,
          npwp: formData.npwp,
          director_name: formData.director_name,
        },
        adminUser: {
          email: formData.admin_email,
          password: formData.admin_password,
          role: 'admin',
        },
        modules: formData.selected_modules,
      };

      await setupService.initializeSetup(payload);
      
      toast({
        title: 'Berhasil',
        description: 'Setup sistem berhasil diselesaikan. Silakan login untuk melanjutkan.',
      });
      
      // Redirect ke halaman login
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan saat setup',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-0 shadow-none">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl">Setup SIMRS ZEN</CardTitle>
          <CardDescription>
            Lengkapi informasi untuk mengkonfigurasi sistem manajemen rumah sakit Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Langkah {step} dari 3</span>
              <span>{Math.round((step / 3) * 100)}% Selesai</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Informasi Rumah Sakit</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hospital_name">Nama Rumah Sakit *</Label>
                    <Input
                      id="hospital_name"
                      name="hospital_name"
                      value={formData.hospital_name}
                      onChange={handleInputChange}
                      placeholder="Nama rumah sakit Anda"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hospital_code">Kode Rumah Sakit *</Label>
                    <Input
                      id="hospital_code"
                      name="hospital_code"
                      value={formData.hospital_code}
                      onChange={handleInputChange}
                      placeholder="Kode unik rumah sakit"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hospital_type">Jenis Rumah Sakit *</Label>
                    <Select 
                      value={formData.hospital_type} 
                      onValueChange={(value) => setFormData({...formData, hospital_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis rumah sakit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Rumah Sakit Kelas A</SelectItem>
                        <SelectItem value="B">Rumah Sakit Kelas B</SelectItem>
                        <SelectItem value="C">Rumah Sakit Kelas C</SelectItem>
                        <SelectItem value="D">Rumah Sakit Kelas D</SelectItem>
                        <SelectItem value="FKTP">Fasilitas Kesehatan Tingkat Pertama</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="city">Kota</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Kota rumah sakit berlokasi"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="province">Provinsi</Label>
                    <Input
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      placeholder="Provinsi rumah sakit berlokasi"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Alamat</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Alamat lengkap rumah sakit"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telepon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Nomor telepon rumah sakit"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email kontak rumah sakit"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="Alamat website rumah sakit (opsional)"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="director_name">Nama Direktur</Label>
                    <Input
                      id="director_name"
                      name="director_name"
                      value={formData.director_name}
                      onChange={handleInputChange}
                      placeholder="Nama direktur rumah sakit"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Akun Administrator</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="admin_email">Email Administrator *</Label>
                    <Input
                      id="admin_email"
                      name="admin_email"
                      type="email"
                      value={formData.admin_email}
                      onChange={handleInputChange}
                      placeholder="Email untuk akun admin"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="admin_password">Password *</Label>
                    <Input
                      id="admin_password"
                      name="admin_password"
                      type="password"
                      value={formData.admin_password}
                      onChange={handleInputChange}
                      placeholder="Password untuk akun admin"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="admin_confirm_password">Konfirmasi Password *</Label>
                    <Input
                      id="admin_confirm_password"
                      name="admin_confirm_password"
                      type="password"
                      value={formData.admin_confirm_password}
                      onChange={handleInputChange}
                      placeholder="Ulangi password"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="npwp">NPWP Rumah Sakit</Label>
                    <Input
                      id="npwp"
                      name="npwp"
                      value={formData.npwp}
                      onChange={handleInputChange}
                      placeholder="Nomor Pokok Wajib Pajak"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="accreditation_status">Status Akreditasi</Label>
                    <Input
                      id="accreditation_status"
                      name="accreditation_status"
                      value={formData.accreditation_status}
                      onChange={handleInputChange}
                      placeholder="Status akreditasi rumah sakit"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bed_count_total">Jumlah Tempat Tidur</Label>
                    <Input
                      id="bed_count_total"
                      name="bed_count_total"
                      type="number"
                      value={formData.bed_count_total}
                      onChange={handleInputChange}
                      placeholder="Total jumlah tempat tidur"
                    />
                  </div>
                  
                  <div className="flex items-center pt-4">
                    <Checkbox
                      id="is_teaching_hospital"
                      name="is_teaching_hospital"
                      checked={formData.is_teaching_hospital}
                      onCheckedChange={(checked) => setFormData({...formData, is_teaching_hospital: Boolean(checked)})}
                    />
                    <label htmlFor="is_teaching_hospital" className="ml-2 text-sm font-medium">
                      Rumah Sakit Pendidikan
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Modul yang Diaktifkan</h3>
              <p className="text-gray-600">Pilih modul-modul yang ingin Anda aktifkan dalam sistem SIMRS ZEN</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((module) => (
                  <div 
                    key={module.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.selected_modules.includes(module.id) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleModuleToggle(module.id)}
                  >
                    <div className="flex items-start">
                      <Checkbox
                        checked={formData.selected_modules.includes(module.id)}
                        onCheckedChange={() => handleModuleToggle(module.id)}
                        className="mt-0.5 mr-3"
                      />
                      <div>
                        <h4 className="font-medium">{module.name}</h4>
                        <p className="text-sm text-gray-600">{module.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={step === 1}
            >
              Kembali
            </Button>
            
            {step < 3 ? (
              <Button onClick={handleNext}>
                Lanjutkan
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Memproses...' : 'Selesaikan Setup'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupWizard;