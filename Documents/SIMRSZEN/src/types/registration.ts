export interface Registration {
  id: string;
  patientId: string;
  patientName: string;
  registrationDate: string;
  serviceType: 'rawat_jalan' | 'rawat_inap' | 'gawat_darurat';
  department: string;
  doctor: string;
  status: 'daftar' | 'periksa' | 'selesai' | 'batal';
  queueNumber: string;
  notes: string;
}