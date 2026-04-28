export interface FaskesType {
  id: string;
  name: string;
  description: string;
  level: 'primer' | 'sekunder' | 'tersier';
  category: 'rumah_sakit' | 'puskesmas' | 'klinik' | 'laboratorium' | 'radiologi' | 'lainnya';
  isActive: boolean;
}

export interface Faskes {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  licenseNumber: string;
  operationalSince: string;
  capacity: number;
  director: string;
  isActive: boolean;
}