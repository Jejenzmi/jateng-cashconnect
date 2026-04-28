import { useState } from 'react';

export function useHospitalLogo() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const uploadLogo = async (_file: File) => {
    setIsUploading(true);
    setIsUploading(false);
  };

  const deleteLogo = async () => {
    setIsDeleting(true);
    setLogoUrl(null);
    setIsDeleting(false);
  };

  return { logoUrl, setLogoUrl, isUploading, isDeleting, isLoading, uploadLogo, deleteLogo };
}
