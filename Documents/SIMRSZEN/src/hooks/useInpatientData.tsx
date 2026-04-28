import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useState, useEffect } from 'react';
interface Inpatient {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  admission_date: string;
  discharge_date: string | null;
  room_id: string;
  room_name: string;
  room_type: string;
  bed_number: string;
  attending_doctor_id: string;
  attending_doctor_name: string;
  diagnosis: string;
  condition: 'stable' | 'critical' | 'improving' | 'deteriorating';
  notes: string;
  created_at: string;
  updated_at: string;
}

interface BedAvailability {
  room_id: string;
  room_name: string;
  room_type: string;
  total_beds: number;
  occupied_beds: number;
  available_beds: number;
}

const useInpatientData = () => {
  const [inpatients, setInpatients] = useState<Inpatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInpatients = async (status: 'active' | 'discharged' | 'all' = 'active') => {
    try {
      setLoading(true);
      setError(null);
      
      let query = `
        SELECT 
          id,
          patient_id,
          patient_name,
          patient_age,
          patient_gender,
          admission_date,
          discharge_date,
          room_id,
          room_name,
          room_type,
          bed_number,
          attending_doctor_id,
          attending_doctor_name,
          diagnosis,
          condition,
          notes,
          created_at,
          updated_at
        FROM inpatients
      `;
      
      if (status === 'active') {
        query += ` WHERE discharge_date IS NULL`;
      } else if (status === 'discharged') {
        query += ` WHERE discharge_date IS NOT NULL`;
      }
      
      query += ` ORDER BY admission_date DESC`;
      
      const result = await getApi<Inpatient[]>(query);
      setInpatients(result);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data rawat inap');
      console.error('Error fetching inpatient data:', err);
    } finally {
      setLoading(false);
    }
  };

  const admitPatient = async (
    patientId: string,
    patientName: string,
    patientAge: number,
    patientGender: string,
    roomId: string,
    roomName: string,
    roomType: string,
    bedNumber: string,
    attendingDoctorId: string,
    attendingDoctorName: string,
    diagnosis: string,
    notes: string = ''
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getApi<Inpatient[]>`
        INSERT INTO inpatients (
          patient_id,
          patient_name,
          patient_age,
          patient_gender,
          admission_date,
          room_id,
          room_name,
          room_type,
          bed_number,
          attending_doctor_id,
          attending_doctor_name,
          diagnosis,
          condition,
          notes
        ) VALUES (
          ${patientId},
          ${patientName},
          ${patientAge},
          ${patientGender},
          NOW(),
          ${roomId},
          ${roomName},
          ${roomType},
          ${bedNumber},
          ${attendingDoctorId},
          ${attendingDoctorName},
          ${diagnosis},
          'stable',
          ${notes}
        ) RETURNING 
          id,
          patient_id,
          patient_name,
          patient_age,
          patient_gender,
          admission_date,
          discharge_date,
          room_id,
          room_name,
          room_type,
          bed_number,
          attending_doctor_id,
          attending_doctor_name,
          diagnosis,
          condition,
          notes,
          created_at,
          updated_at
      `;
      
      setInpatients([result[0], ...inpatients]);
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftarkan pasien rawat inap');
      console.error('Error admitting patient:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const dischargePatient = async (
    patientId: string,
    dischargeDate: string,
    finalDiagnosis: string,
    notes: string = ''
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getApi<Inpatient[]>`
        UPDATE inpatients
        SET 
          discharge_date = ${dischargeDate},
          diagnosis = ${finalDiagnosis},
          notes = notes || E'\\n' || ${notes},
          updated_at = NOW()
        WHERE patient_id = ${patientId} AND discharge_date IS NULL
        RETURNING 
          id,
          patient_id,
          patient_name,
          patient_age,
          patient_gender,
          admission_date,
          discharge_date,
          room_id,
          room_name,
          room_type,
          bed_number,
          attending_doctor_id,
          attending_doctor_name,
          diagnosis,
          condition,
          notes,
          created_at,
          updated_at
      `;
      
      if (result.length > 0) {
        setInpatients(inpatients.map(p => p.patient_id === patientId ? result[0] : p));
        return result[0];
      } else {
        throw new Error('Pasien tidak ditemukan atau sudah dipulangkan');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memulangkan pasien rawat inap');
      console.error('Error discharging patient:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePatientCondition = async (
    patientId: string,
    condition: 'stable' | 'critical' | 'improving' | 'deteriorating',
    notes: string = ''
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getApi<Inpatient[]>`
        UPDATE inpatients
        SET 
          condition = ${condition},
          notes = notes || E'\\n' || ${notes},
          updated_at = NOW()
        WHERE patient_id = ${patientId} AND discharge_date IS NULL
        RETURNING 
          id,
          patient_id,
          patient_name,
          patient_age,
          patient_gender,
          admission_date,
          discharge_date,
          room_id,
          room_name,
          room_type,
          bed_number,
          attending_doctor_id,
          attending_doctor_name,
          diagnosis,
          condition,
          notes,
          created_at,
          updated_at
      `;
      
      if (result.length > 0) {
        setInpatients(inpatients.map(p => p.patient_id === patientId ? result[0] : p));
        return result[0];
      } else {
        throw new Error('Pasien tidak ditemukan atau sudah dipulangkan');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui kondisi pasien');
      console.error('Error updating patient condition:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPatientById = (patientId: string) => {
    return inpatients.find(p => p.patient_id === patientId);
  };

  const getInpatientsByRoom = (roomId: string) => {
    return inpatients.filter(p => p.room_id === roomId && !p.discharge_date);
  };

  const getInpatientsByDoctor = (doctorId: string) => {
    return inpatients.filter(p => p.attending_doctor_id === doctorId && !p.discharge_date);
  };

  const getBedAvailability = (): BedAvailability[] => {
    const roomCounts: Record<string, BedAvailability> = {};
    
    // Initialize all rooms
    inpatients.forEach(patient => {
      if (!roomCounts[patient.room_id]) {
        roomCounts[patient.room_id] = {
          room_id: patient.room_id,
          room_name: patient.room_name,
          room_type: patient.room_type,
          total_beds: 0,
          occupied_beds: 0,
          available_beds: 0
        };
      }
    });
    
    // Count beds per room
    inpatients.forEach(patient => {
      const room = roomCounts[patient.room_id];
      room.total_beds++;
      if (!patient.discharge_date) {
        room.occupied_beds++;
      }
    });
    
    // Calculate available beds
    Object.values(roomCounts).forEach(room => {
      room.available_beds = room.total_beds - room.occupied_beds;
    });
    
    return Object.values(roomCounts);
  };

  const getAdmissionStatistics = () => {
    const totalAdmitted = inpatients.length;
    const activePatients = inpatients.filter(p => !p.discharge_date).length;
    const dischargedPatients = inpatients.filter(p => p.discharge_date).length;
    
    // Calculate distribution by room type
    const roomTypeDistribution: Record<string, number> = {};
    inpatients.forEach(patient => {
      if (!patient.discharge_date) {
        roomTypeDistribution[patient.room_type] = (roomTypeDistribution[patient.room_type] || 0) + 1;
      }
    });
    
    return {
      totalAdmitted,
      activePatients,
      dischargedPatients,
      roomTypeDistribution
    };
  };

  useEffect(() => {
    fetchInpatients();
  }, []);

  const refreshData = (status: 'active' | 'discharged' | 'all' = 'active') => {
    setLoading(true);
    fetchInpatients(status);
  };

  return {
    inpatients,
    loading,
    error,
    fetchInpatients,
    admitPatient,
    dischargePatient,
    updatePatientCondition,
    getPatientById,
    getInpatientsByRoom,
    getInpatientsByDoctor,
    getBedAvailability,
    getAdmissionStatistics,
    refreshData
  };
};

export default useInpatientData;