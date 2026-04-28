export interface Medicine {
  id: string;
  code: string;
  name: string;
  genericName: string;
  dosageForm: string;
  dosage: string;
  unit: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
  manufacturer: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}