export interface Billing {
  id: string;
  patientId: string;
  patientName: string;
  registrationId: string;
  totalAmount: number;
  discount: number;
  tax: number;
  finalAmount: number;
  paymentStatus: 'unpaid' | 'paid' | 'partially_paid' | 'cancelled';
  paymentMethod: 'tunai' | 'kartu' | 'transfer' | 'bpjs';
  notes: string;
  createdAt: string;
  updatedAt: string;
}