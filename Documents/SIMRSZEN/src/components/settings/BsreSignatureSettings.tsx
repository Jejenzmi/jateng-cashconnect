import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ElectronicSignatureService } from '@/services/ElectronicSignatureService';
import { HospitalProfileService } from '@/services/HospitalProfileService';

interface BsreConfigProps {
  hospitalId: string;
}

const BsreSignatureSettings: React.FC<BsreConfigProps> = ({ hospitalId }) => {
  const { toast } = useToast();
  const [isBsreEnabled, setIsBsreEnabled] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [enableVerification, setEnableVerification] = useState(true);
  const [defaultPosition, setDefaultPosition] = useState({ x: 50, y: 50, page: 1 });
  const [isLoading, setIsLoading] = useState(true);

  // Load current configuration
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setIsLoading(true);
        
        // Get hospital BSRE status
        const bsreStatus = await ElectronicSignatureService.getBsreStatus(hospitalId);
        setIsBsreEnabled(bsreStatus);
        
        // Get detailed config if available
        const config = await ElectronicSignatureService.getConfig(hospitalId);
        if (config) {
          setApiEndpoint(config.api_endpoint || '');
          
          // Note: We don't fetch the actual API key for security reasons
          // This field would be empty and only filled when updating
          setEnableVerification(
            config.config_metadata?.enable_verification !== undefined 
              ? config.config_metadata.enable_verification 
              : true
          );
          
          if (config.config_metadata?.default_position) {
            setDefaultPosition(config.config_metadata.default_position);
          }
        }
      } catch (error) {
        console.error('Error loading BSRE config:', error);
        toast({
          title: 'Gagal memuat konfigurasi',
          description: 'Terjadi kesalahan saat memuat pengaturan tanda tangan elektronik',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (hospitalId) {
      loadConfig();
    }
  }, [hospitalId, toast]);

  const handleSaveConfig = async () => {
    try {
      await ElectronicSignatureService.updateConfig(
        hospitalId,
        {
          api_endpoint: apiEndpoint,
          api_key: apiKey, // In real app, this would be handled more securely
          enable_verification: enableVerification,
          default_position: defaultPosition
        },
        isBsreEnabled
      );

      // Kosongkan field API key setelah disimpan untuk alasan keamanan
      if (apiKey) {
        setApiKey('');
      }

      toast({
        title: 'Konfigurasi berhasil disimpan',
        description: 'Pengaturan tanda tangan elektronik BSRE telah diperbarui.',
      });
    } catch (error) {
      console.error('Error saving BSRE config:', error);
      toast({
        title: 'Gagal menyimpan konfigurasi',
        description: 'Terjadi kesalahan saat menyimpan pengaturan tanda tangan elektronik',
        variant: 'destructive',
      });
    }
  };

  const toggleBsreFeature = async () => {
    try {
      await ElectronicSignatureService.toggleBsreFeature(hospitalId, !isBsreEnabled);
      setIsBsreEnabled(!isBsreEnabled);
      
      toast({
        title: `Fitur TTE ${!isBsreEnabled ? 'diaktifkan' : 'dinonaktifkan'}`,
        description: `Tanda Tangan Elektronik BSRE telah ${!isBsreEnabled ? 'diaktifkan' : 'dinonaktifkan'}.`,
      });
    } catch (error) {
      console.error('Error toggling BSRE feature:', error);
      toast({
        title: 'Gagal mengubah status fitur',
        description: `Tidak dapat ${!isBsreEnabled ? 'mengaktifkan' : 'menonaktifkan'} fitur TTE BSRE`,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Memuat pengaturan tanda tangan elektronik...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tanda Tangan Elektronik BSRE</CardTitle>
        <CardDescription>
          Kelola pengaturan tanda tangan elektronik untuk rumah sakit Anda. 
          <strong> Peringatan: Passphrase tidak akan disimpan dalam sistem untuk alasan keamanan.</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="bsre-toggle" className="text-base">
              Aktifkan TTE BSRE
            </Label>
            <p className="text-sm text-muted-foreground">
              Aktifkan fitur tanda tangan elektronik untuk dokumen rumah sakit
            </p>
          </div>
          <Switch
            id="bsre-toggle"
            checked={isBsreEnabled}
            onCheckedChange={toggleBsreFeature}
          />
        </div>

        {isBsreEnabled && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apiEndpoint">API Endpoint</Label>
                <Input
                  id="apiEndpoint"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  placeholder="https://api.bsre.go.id/signature"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Masukkan API key BSRE"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  API Key hanya digunakan saat menyimpan konfigurasi dan tidak disimpan dalam bentuk yang dapat dibaca.
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="enableVerification">Verifikasi Otomatis</Label>
                <Switch
                  id="enableVerification"
                  checked={enableVerification}
                  onCheckedChange={setEnableVerification}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Aktifkan verifikasi otomatis terhadap tanda tangan yang terverifikasi
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="positionX">Posisi X</Label>
                <Input
                  id="positionX"
                  type="number"
                  value={defaultPosition.x}
                  onChange={(e) => setDefaultPosition({...defaultPosition, x: Number(e.target.value)})}
                  placeholder="Posisi X"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="positionY">Posisi Y</Label>
                <Input
                  id="positionY"
                  type="number"
                  value={defaultPosition.y}
                  onChange={(e) => setDefaultPosition({...defaultPosition, y: Number(e.target.value)})}
                  placeholder="Posisi Y"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="positionPage">Halaman</Label>
                <Input
                  id="positionPage"
                  type="number"
                  value={defaultPosition.page}
                  onChange={(e) => setDefaultPosition({...defaultPosition, page: Number(e.target.value)})}
                  placeholder="Nomor Halaman"
                />
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h4 className="font-medium text-yellow-800 mb-2">Catatan Penting Keamanan:</h4>
              <ul className="text-sm text-yellow-700 list-disc pl-5 space-y-1">
                <li>Passphrase penandatangan tidak akan pernah disimpan dalam sistem ini</li>
                <li>Passphrase hanya digunakan pada saat proses penandatanganan berlangsung</li>
                <li>Sistem hanya menyimpan konfigurasi API dan metadata yang diperlukan</li>
                <li>Semua komunikasi dengan layanan BSRE dilakukan secara aman</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveConfig} disabled={!isBsreEnabled}>
          Simpan Pengaturan
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BsreSignatureSettings;