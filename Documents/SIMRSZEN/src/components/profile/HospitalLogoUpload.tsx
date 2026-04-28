import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHospitalLogo } from "@/hooks/useHospitalLogo";
import { Upload, X, Loader2 } from "lucide-react";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export function HospitalLogoUpload() {
  const { logoUrl, uploadLogo, deleteLogo, isUploading, isLoading } = useHospitalLogo();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      uploadLogo(file);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus logo rumah sakit?")) {
      deleteLogo();
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo Rumah Sakit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : logoUrl ? (
            <div className="relative group">
              <img 
                src={logoUrl} 
                alt="Logo Rumah Sakit" 
                className="max-h-40 max-w-xs object-contain rounded-lg border"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-2">Logo rumah sakit belum diunggah</p>
              <p className="text-sm text-gray-400">Ukuran maksimal: 5MB. Format: JPG, PNG, SVG</p>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={isUploading}
          />

          <div className="flex gap-2">
            <Button 
              type="button" 
              onClick={handleButtonClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Mengunggah...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {logoUrl ? "Ganti Logo" : "Unggah Logo"}
                </>
              )}
            </Button>
            
            {logoUrl && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Menghapus...
                  </>
                ) : (
                  "Hapus Logo"
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}