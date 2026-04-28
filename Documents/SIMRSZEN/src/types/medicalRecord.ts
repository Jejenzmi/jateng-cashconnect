export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  registrationId: string;
  registrationDate: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  physicalExam: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}