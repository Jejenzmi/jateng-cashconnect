import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSatuSehatConfig } from "@/hooks/useSatuSehatConfig";

const SatuSehatSettings = () => {
  const { 
    config, 
    loading, 
    updateConfig,
    syncFacility,
    syncHealthWorkers,
    checkConnection 
  } = useSatuSehatConfig();

  const [formData, setFormData] = useState({
    active: false,
    clientId: "",
    clientSecret: "",
    apiUrl: "",
    facilityCode: "",
    facilityName: ""
  });

  useEffect(() => {
    if (config) {
      setFormData({
        active: config.active,
        clientId: config.clientId || "",
        clientSecret: "",
        apiUrl: config.apiUrl || "",
        facilityCode: config.facilityCode || "",
        facilityName: config.facilityName || ""
      });
    }
  }, [config]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, active: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Integrasi SATU SEHAT</CardTitle>
        <CardDescription>Konfigurasi koneksi ke platform SATU SEHAT Kementerian Kesehatan RI</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="satusehat-active" 
              checked={formData.active}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="satusehat-active">Aktifkan Integrasi SATU SEHAT</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientId">Client ID</Label>
              <Input 
                id="clientId"
                name="clientId"
                type="password"
                value={formData.clientId}
                onChange={handleChange}
                placeholder="Masukkan Client ID"
              />
            </div>
            
            <div>
              <Label htmlFor="clientSecret">Client Secret</Label>
              <Input 
                id="clientSecret"
                name="clientSecret"
                type="password"
                value={formData.clientSecret}
                onChange={handleChange}
                placeholder="Masukkan Client Secret"
              />
            </div>
            
            <div>
              <Label htmlFor="apiUrl">API URL</Label>
              <Input 
                id="apiUrl"
                name="apiUrl"
                type="text"
                value={formData.apiUrl}
                onChange={handleChange}
                placeholder="https://api-satusehat.kemkes.go.id"
              />
            </div>
            
            <div>
              <Label htmlFor="facilityCode">Kode Fasilitas</Label>
              <Input 
                id="facilityCode"
                name="facilityCode"
                type="text"
                value={formData.facilityCode}
                onChange={handleChange}
                placeholder="Contoh: 123456"
              />
            </div>
            
            <div>
              <Label htmlFor="facilityName">Nama Fasilitas</Label>
              <Input 
                id="facilityName"
                name="facilityName"
                type="text"
                value={formData.facilityName}
                onChange={handleChange}
                placeholder="Nama Fasilitas Kesehatan"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Konfigurasi"}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={checkConnection}
              disabled={loading}
            >
              Uji Koneksi
            </Button>
            
            <Button 
              type="button" 
              variant="secondary"
              onClick={syncFacility}
              disabled={loading}
            >
              Sinkronisasi Fasilitas
            </Button>
            
            <Button 
              type="button" 
              variant="secondary"
              onClick={syncHealthWorkers}
              disabled={loading}
            >
              Sinkronisasi Tenaga Kesehatan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SatuSehatSettings;