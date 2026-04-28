import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ElectronicSignatureService } from '@/services/ElectronicSignatureService';

interface DocumentSignerProps {
  documentId: string;
  documentName: string;
  onSigned?: (result: any) => void;
  onCancel?: () => void;
}

const DocumentSigner: React.FC<DocumentSignerProps> = ({ 
  documentId, 
  documentName, 
  onSigned,
  onCancel
}) => {
  const { toast } = useToast();
  const [nik, setNik] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [isSigning, setIsSigning] = useState(false);

  const handleSignDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nik.trim()) {
      toast({
        title: 'NIK harus diisi',
        description: 'Silakan masukkan NIK penandatangan',
        variant: 'destructive',
      });
      return;
    }
    
    if (!passphrase.trim()) {
      toast({
        title: 'Passphrase harus diisi',
        description: 'Silakan masukkan passphrase untuk proses penandatanganan',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSigning(true);
      
      // Dapatkan data dokumen (dalam implementasi nyata, ini akan diambil dari sistem)
      const documentData = Buffer.from(`Dummy document data for ${documentName}`);
      
      // Panggil layanan penandatanganan - tidak menyimpan passphrase
      const result = await ElectronicSignatureService.initiateSigningProcess(
        documentData,
        documentName,
        nik,
        passphrase  // Passphrase hanya digunakan untuk sesi ini, tidak disimpan
      );
      
      if (result.success) {
        toast({
          title: 'Proses penandatanganan dimulai',
          description: result.message,
        });
        
        // Kosongkan passphrase setelah digunakan
        setPassphrase('');
        
        if (onSigned) {
          onSigned(result);
        }
      } else {
        toast({
          title: 'Gagal memulai penandatanganan',
          description: result.message || 'Terjadi kesalahan saat memulai proses penandatanganan',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error signing document:', error);
      toast({
        title: 'Gagal memulai penandatanganan',
        description: 'Terjadi kesalahan saat memulai proses penandatanganan dokumen',
        variant: 'destructive',
      });
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Penandatanganan Dokumen</CardTitle>
        <CardDescription>
          Tanda tangani dokumen "{documentName}" secara elektronik menggunakan layanan BSRE
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSignDocument}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nik">NIK Penandatangan</Label>
            <Input
              id="nik"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              placeholder="Masukkan NIK penandatangan"
              disabled={isSigning}
            />
            <p className="text-xs text-muted-foreground">
              NIK digunakan untuk mengidentifikasi penandatangan di sistem BSRE
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="passphrase">Passphrase</Label>
            <Input
              id="passphrase"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Masukkan passphrase sertifikat digital"
              disabled={isSigning}
            />
            <p className="text-xs text-muted-foreground">
              Passphrase hanya digunakan untuk sesi penandatanganan ini dan tidak akan disimpan
            </p>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-800 mb-1">Proses Penandatanganan:</h4>
            <ol className="text-sm text-blue-700 list-decimal pl-5 space-y-1">
              <li>Data dokumen dikirim ke layanan BSRE</li>
              <li>BSRE memverifikasi identitas menggunakan NIK dan passphrase</li>
              <li>Passphrase hanya digunakan untuk proses ini dan tidak disimpan</li>
              <li>Tanda tangan elektronik ditambahkan ke dokumen</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSigning}
          >
            Batal
          </Button>
          <div className="flex gap-2">
            <Button 
              type="submit" 
              variant="default"
              disabled={isSigning || !nik.trim() || !passphrase.trim()}
            >
              {isSigning ? 'Memproses...' : 'Tanda Tangani'}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DocumentSigner;