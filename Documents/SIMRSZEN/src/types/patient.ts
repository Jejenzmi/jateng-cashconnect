export interface Patient {
  id: string;
  medicalRecordNo: string;
  fullName: string;
  nik: string;
  birthDate: string;
  gender: 'L' | 'P'; // Laki-laki atau Perempuan
  phone: string;
  address: string;
  bpjsNumber?: string;
  bloodType?: string;
  allergies?: string;
  registrationDate: string;
}