import React, { useState, useEffect } from 'react';
import { postApi, getApi } from '@/utils/api';
import { Building2, MapPin, Phone, Mail, Globe, Edit3, Save, Shield, Users, Bed, Clock, Award, ChevronRight, FileText, Camera, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const defaultProfile = {
  nama: 'SIMRS ZEN - Rumah Sakit Demo',
  kode: 'RS-DEMO-001',
  jenis: 'Rumah Sakit Umum',
  kelas: 'C',
  akreditasi: 'Paripurna',
  nomorIzin: '503/RS/2020/001',
  masa_berlaku_izin: '2027-12-31',
  direktur: 'dr. Ahmad Susanto, Sp.PD',
  alamat: 'Jl. Demo Kesehatan No. 1',
  kota: 'Jakarta Selatan',
  provinsi: 'DKI Jakarta',
  kodePos: '12190',
  telepon: '021-12345678',
  fax: '021-12345679',
  email: 'info@simrszen.id',
  website: 'www.simrszen.id',
  bed_total: 150,
  bed_icu: 12,
  bed_vip: 20,
  bed_kelas1: 40,
  bed_kelas2: 50,
  bed_kelas3: 38,
  latitude: '-6.2146',
  longitude: '106.8451',
  bpjs_kode: 'RS0001234',
  bpjs_username: 'admin_bpjs',
  satusehat_org_id: 'b1eb0d2d-feb8-44da-b0ab-a32c8e7fa5a3',
};

function BpjsConfigSection() {
  const [bpjsConfig, setBpjsConfig] = useState({
    consId: '',
    secretKey: '',
    userKey: '',
    baseUrl: 'https://apijkn-dev.bpjs-kesehatan.go.id/vclaim-rest-dev',
    environment: 'staging' as 'staging' | 'production',
  });
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadBpjsConfig();
  }, []);

  const loadBpjsConfig = async () => {
    try {
      const res = await getApi<any>('/faskes/check-profile');
      if (res?.profile?.bpjsConfig) {
        const c = res.profile.bpjsConfig;
        setBpjsConfig({
          consId: c.consId || '',
          secretKey: c.secretKey || '',
          userKey: c.userKey || '',
          baseUrl: c.baseUrl || 'https://apijkn-dev.bpjs-kesehatan.go.id/vclaim-rest-dev',
          environment: c.environment || 'staging',
        });
      }
      setLoaded(true);
    } catch (e) {
      console.error('Gagal memuat konfigurasi BPJS:', e);
      setLoaded(true);
    }
  };

  const saveBpjsConfig = async () => {
    setSaving(true);
    try {
      await postApi('/faskes/update-bpjs', { bpjsConfig });
      toast.success('Konfigurasi BPJS berhasil disimpan');
    } catch (e: any) {
      toast.error(e.message || 'Gagal menyimpan konfigurasi BPJS');
    } finally {
      setSaving(false);
    }
  };

  const isConfigured = bpjsConfig.consId && bpjsConfig.secretKey && bpjsConfig.userKey;

  return (
    <div className="space-y-4">
      {/* BPJS Kesehatan */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏥</span>
            <div>
              <h3 className="font-semibold">BPJS Kesehatan (VClaim)</h3>
              <p className="text-xs text-muted-foreground">Konfigurasi Bridging VClaim BPJS Kesehatan</p>
            </div>
          </div>
          <Badge variant="outline" className={isConfigured ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
            {isConfigured ? (
              <><CheckCircle className="h-3 w-3 mr-1" /> Terkonfigurasi</>
            ) : (
              <><AlertCircle className="h-3 w-3 mr-1" /> Belum Dikonfigurasi</>
            )}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Cons ID</label>
            <Input className="mt-1 font-mono" placeholder="Masukkan Cons ID dari BPJS" value={bpjsConfig.consId} onChange={(e) => setBpjsConfig({ ...bpjsConfig, consId: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Secret Key</label>
            <Input className="mt-1 font-mono" type="password" placeholder="Masukkan Secret Key" value={bpjsConfig.secretKey} onChange={(e) => setBpjsConfig({ ...bpjsConfig, secretKey: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">User Key</label>
            <Input className="mt-1 font-mono" type="password" placeholder="Masukkan User Key" value={bpjsConfig.userKey} onChange={(e) => setBpjsConfig({ ...bpjsConfig, userKey: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Environment</label>
            <select className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={bpjsConfig.environment} onChange={(e) => setBpjsConfig({ ...bpjsConfig, environment: e.target.value as any, baseUrl: e.target.value === 'production' ? 'https://new-api.bpjs-kesehatan.go.id/vclaim-rest' : 'https://apijkn-dev.bpjs-kesehatan.go.id/vclaim-rest-dev' })}>
              <option value="staging">Development / Sandbox</option>
              <option value="production">Production</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">Base URL API</label>
            <Input className="mt-1 font-mono text-xs" value={bpjsConfig.baseUrl} onChange={(e) => setBpjsConfig({ ...bpjsConfig, baseUrl: e.target.value })} />
            <p className="text-xs text-muted-foreground mt-1">URL endpoint VClaim BPJS Kesehatan</p>
          </div>
        </div>

        <div className="flex gap-2 mt-6 pt-4 border-t">
          <Button size="sm" onClick={saveBpjsConfig} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Simpan Konfigurasi BPJS
          </Button>
        </div>
      </div>

      {/* Satu Sehat */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏛️</span>
            <div>
              <h3 className="font-semibold">Satu Sehat (Kemenkes RI)</h3>
              <p className="text-xs text-muted-foreground">Konfigurasi tersedia di menu Integrasi &gt; Satu Sehat</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" /> Aktif
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Konfigurasi lengkap Satu Sehat (Organization ID, Client ID, Client Secret) bisa dikelola langsung dari halaman <strong>Integrasi &gt; Satu Sehat &gt; tab Settings</strong>.
        </p>
      </div>
    </div>
  );
}

export default function ProfileFaskes() {
  const [profile, setProfile] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(defaultProfile);

  const handleSave = () => {
    setProfile(editData);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string | number) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-7 w-7 text-primary" />
            Profil Fasilitas Kesehatan
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola informasi dan konfigurasi fasilitas kesehatan Anda
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => { setIsEditing(false); setEditData(profile); }}>
                Batal
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Simpan Perubahan
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profil
            </Button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center border-2 border-white/30 relative group cursor-pointer">
            <Building2 className="h-10 w-10 text-white" />
            <div className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{profile.nama}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">{profile.jenis}</Badge>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">Kelas {profile.kelas}</Badge>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Award className="h-3 w-3 mr-1" />
                Akreditasi {profile.akreditasi}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-2 text-white/80 text-sm">
              <MapPin className="h-4 w-4" />
              {profile.alamat}, {profile.kota}, {profile.provinsi}
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-white/70 text-sm">Kode RS</p>
            <p className="font-bold text-lg">{profile.kode}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Bed', value: profile.bed_total, icon: <Bed className="h-4 w-4" />, color: 'text-blue-600 bg-blue-50' },
          { label: 'ICU', value: profile.bed_icu, icon: <Shield className="h-4 w-4" />, color: 'text-red-600 bg-red-50' },
          { label: 'VIP', value: profile.bed_vip, icon: <Award className="h-4 w-4" />, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Kelas I', value: profile.bed_kelas1, icon: <Bed className="h-4 w-4" />, color: 'text-green-600 bg-green-50' },
          { label: 'Kelas II', value: profile.bed_kelas2, icon: <Bed className="h-4 w-4" />, color: 'text-teal-600 bg-teal-50' },
          { label: 'Kelas III', value: profile.bed_kelas3, icon: <Bed className="h-4 w-4" />, color: 'text-indigo-600 bg-indigo-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border p-3 shadow-sm text-center">
            <div className={`inline-flex p-2 rounded-lg ${s.color.split(' ')[1]} mb-2`}>
              <span className={s.color.split(' ')[0]}>{s.icon}</span>
            </div>
            <p className={`text-xl font-bold ${s.color.split(' ')[0]}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Detail Tabs */}
      <Tabs defaultValue="umum">
        <TabsList>
          <TabsTrigger value="umum">Informasi Umum</TabsTrigger>
          <TabsTrigger value="kontak">Kontak & Lokasi</TabsTrigger>
          <TabsTrigger value="integrasi">Integrasi Sistem</TabsTrigger>
          <TabsTrigger value="izin">Perizinan</TabsTrigger>
        </TabsList>

        <TabsContent value="umum">
          <div className="bg-white rounded-xl border shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Nama Faskes', field: 'nama', value: profile.nama },
              { label: 'Kode Faskes', field: 'kode', value: profile.kode },
              { label: 'Jenis Fasilitas', field: 'jenis', value: profile.jenis },
              { label: 'Kelas RS', field: 'kelas', value: profile.kelas },
              { label: 'Akreditasi', field: 'akreditasi', value: profile.akreditasi },
              { label: 'Direktur/Kepala', field: 'direktur', value: profile.direktur },
            ].map((f, i) => (
              <div key={i}>
                <label className="text-sm font-medium text-muted-foreground">{f.label}</label>
                {isEditing ? (
                  <Input
                    value={editData[f.field as keyof typeof editData] as string}
                    onChange={(e) => handleChange(f.field, e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 font-medium">{f.value}</p>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="kontak">
          <div className="bg-white rounded-xl border shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Alamat', field: 'alamat', icon: <MapPin className="h-4 w-4" />, value: profile.alamat },
              { label: 'Kota', field: 'kota', icon: <MapPin className="h-4 w-4" />, value: profile.kota },
              { label: 'Provinsi', field: 'provinsi', icon: <MapPin className="h-4 w-4" />, value: profile.provinsi },
              { label: 'Kode Pos', field: 'kodePos', icon: <MapPin className="h-4 w-4" />, value: profile.kodePos },
              { label: 'Telepon', field: 'telepon', icon: <Phone className="h-4 w-4" />, value: profile.telepon },
              { label: 'Fax', field: 'fax', icon: <Phone className="h-4 w-4" />, value: profile.fax },
              { label: 'Email', field: 'email', icon: <Mail className="h-4 w-4" />, value: profile.email },
              { label: 'Website', field: 'website', icon: <Globe className="h-4 w-4" />, value: profile.website },
            ].map((f, i) => (
              <div key={i}>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  {f.icon}{f.label}
                </label>
                {isEditing ? (
                  <Input
                    value={editData[f.field as keyof typeof editData] as string}
                    onChange={(e) => handleChange(f.field, e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 font-medium">{f.value}</p>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integrasi">
          <BpjsConfigSection />
        </TabsContent>

        <TabsContent value="izin">
          <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Nomor Izin Operasional', field: 'nomorIzin', value: profile.nomorIzin },
                { label: 'Masa Berlaku Izin', field: 'masa_berlaku_izin', value: new Date(profile.masa_berlaku_izin).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) },
              ].map((f, i) => (
                <div key={i}>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />{f.label}
                  </label>
                  <p className="mt-1 font-medium">{f.value}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                ⚠️ Pastikan izin operasional selalu diperbarui sebelum masa berlaku habis. 
                Lapor ke Dinas Kesehatan setempat minimal 3 bulan sebelum masa berlaku berakhir.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}