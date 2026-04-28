import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useState, useEffect } from "react";
interface ICURecord {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  admission_date: string;
  discharge_date: string | null;
  icu_room_id: string;
  icu_room_name: string;
  attending_doctor_id: string;
  attending_doctor_name: string;
  diagnosis: string;
  apache_ii_score: number | null;
  sofa_score: number | null;
  gcs_score: number | null;
  ventilator_status: 'none' | 'invasive' | 'non_invasive' | 'weaning';
  nutrition_method: 'nil_per_os' | 'oral' | 'ngt' | 'peg' | 'parenteral';
  dialysis_status: 'none' | 'hd' | 'pd' | 'crrt';
  condition: 'critical' | 'stable' | 'improving' | 'deteriorating';
  notes: string;
  created_at: string;
  updated_at: string;
}

interface ICURoom {
  id: string;
  name: string;
  room_number: string;
  capacity: number;
  equipment_available: string[];
  is_available: boolean;
}

interface ICUScoreHistory {
  id: string;
  icu_record_id: string;
  score_type: 'apache_ii' | 'sofa' | 'gcs';
  score_value: number;
  assessment_date: string;
  assessed_by: string;
}

const useICUData = () => {
  const [icuRecords, setIcuRecords] = useState<ICURecord[]>([]);
  const [icuRooms, setIcuRooms] = useState<ICURoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchICUData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch ICU records
      const recordsResult = await getApi<ICURecord[]>`
        SELECT 
          id,
          patient_id,
          patient_name,
          patient_age,
          patient_gender,
          admission_date,
          discharge_date,
          icu_room_id,
          icu_room_name,
          attending_doctor_id,
          attending_doctor_name,
          diagnosis,
          apache_ii_score,
          sofa_score,
          gcs_score,
          ventilator_status,
          nutrition_method,
          dialysis_status,
          condition,
          notes,
          created_at,
          updated_at
        FROM icu_records
        WHERE discharge_date IS NULL
        ORDER BY admission_date DESC
      `;
      
      // Fetch ICU rooms
      const roomsResult = await getApi<ICURoom[]>`
        SELECT 
          id,
          name,
          room_number,
          capacity,
          equipment_available,
          is_available
        FROM icu_rooms
        ORDER BY room_number
      `;
      
      setIcuRecords(recordsResult);
      setIcuRooms(roomsResult);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data ICU');
      console.error('Error fetching ICU data:', err);
    } finally {
      setLoading(false);
    }
  };

  const admitToICU = async (
    patientId: string,
    patientName: string,
    patientAge: number,
    patientGender: string,
    icuRoomId: string,
    icuRoomName: string,
    attendingDoctorId: string,
    attendingDoctorName: string,
    diagnosis: string,
    notes: string = ''
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getApi<ICURecord[]>`
        INSERT INTO icu_records (
          patient_id,
          patient_name,
          patient_age,
          patient_gender,
          admission_date,
          icu_room_id,
          icu_room_name,
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
          ${icuRoomId},
          ${icuRoomName},
          ${attendingDoctorId},
          ${attendingDoctorName},
          ${diagnosis},
          'critical',
          ${notes}
        ) RETURNING 
          id,
          patient_id,
          patient_name,
          patient_age,
          patient_gender,
          admission_date,
          discharge_date,
          icu_room_id,
          icu_room_name,
          attending_doctor_id,
          attending_doctor_name,
          diagnosis,
          apache_ii_score,
          sofa_score,
          gcs_score,
          ventilator_status,
          nutrition_method,
          dialysis_status,
          condition,
          notes,
          created_at,
          updated_at
      `;
      
      // Update room availability
      await putApi("/generic-api", {});
      
      setIcuRecords([result[0], ...icuRecords]);
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftarkan pasien ke ICU');
      console.error('Error admitting to ICU:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const dischargeFromICU = async (
    patientId: string,
    dischargeDate: string,
    finalDiagnosis: string,
    notes: string = ''
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getApi<ICURecord[]>`
        UPDATE icu_records
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
          icu_room_id,
          icu_room_name,
          attending_doctor_id,
          attending_doctor_name,
          diagnosis,
          apache_ii_score,
          sofa_score,
          gcs_score,
          ventilator_status,
          nutrition_method,
          dialysis_status,
          condition,
          notes,
          created_at,
          updated_at
      `;
      
      if (result.length > 0) {
        // Update room availability
        await putApi("/generic-api", {});
        
        setIcuRecords(icuRecords.map(p => p.patient_id === patientId ? result[0] : p));
        return result[0];
      } else {
        throw new Error('Pasien ICU tidak ditemukan atau sudah dipulangkan');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memulangkan pasien dari ICU');
      console.error('Error discharging from ICU:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePatientCondition = async (
    patientId: string,
    condition: 'critical' | 'stable' | 'improving' | 'deteriorating',
    apacheIIScore?: number,
    sofaScore?: number,
    gcsScore?: number,
    ventilatorStatus?: 'none' | 'invasive' | 'non_invasive' | 'weaning',
    nutritionMethod?: 'nil_per_os' | 'oral' | 'ngt' | 'peg' | 'parenteral',
    dialysisStatus?: 'none' | 'hd' | 'pd' | 'crrt',
    notes: string = ''
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const updateFields = [];
      updateFields.push(`condition = ${condition}`);
      if (apacheIIScore !== undefined) updateFields.push(`apache_ii_score = ${apacheIIScore}`);
      if (sofaScore !== undefined) updateFields.push(`sofa_score = ${sofaScore}`);
      if (gcsScore !== undefined) updateFields.push(`gcs_score = ${gcsScore}`);
      if (ventilatorStatus !== undefined) updateFields.push(`ventilator_status = ${ventilatorStatus}`);
      if (nutritionMethod !== undefined) updateFields.push(`nutrition_method = ${nutritionMethod}`);
      if (dialysisStatus !== undefined) updateFields.push(`dialysis_status = ${dialysisStatus}`);
      if (notes) updateFields.push(`notes = notes || E'\\n' || ${notes}`);
      updateFields.push(`updated_at = NOW()`);
      
      const result = await getApi<ICURecord[]>`
        UPDATE icu_records
        SET ${updateFields.join(', ')}
        WHERE patient_id = ${patientId} AND discharge_date IS NULL
        RETURNING 
          id,
          patient_id,
          patient_name,
          patient_age,
          patient_gender,
          admission_date,
          discharge_date,
          icu_room_id,
          icu_room_name,
          attending_doctor_id,
          attending_doctor_name,
          diagnosis,
          apache_ii_score,
          sofa_score,
          gcs_score,
          ventilator_status,
          nutrition_method,
          dialysis_status,
          condition,
          notes,
          created_at,
          updated_at
      `;
      
      if (result.length > 0) {
        setIcuRecords(icuRecords.map(p => p.patient_id === patientId ? result[0] : p));
        return result[0];
      } else {
        throw new Error('Pasien ICU tidak ditemukan atau sudah dipulangkan');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui kondisi pasien ICU');
      console.error('Error updating ICU patient condition:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addScoreAssessment = async (
    icuRecordId: string,
    scoreType: 'apache_ii' | 'sofa' | 'gcs',
    scoreValue: number,
    assessedBy: string
  ) => {
    try {
      const result = await getApi<ICUScoreHistory[]>`
        INSERT INTO icu_scores_history (
          icu_record_id,
          score_type,
          score_value,
          assessment_date,
          assessed_by
        ) VALUES (
          ${icuRecordId},
          ${scoreType},
          ${scoreValue},
          NOW(),
          ${assessedBy}
        ) RETURNING id, icu_record_id, score_type, score_value, assessment_date, assessed_by
      `;
      
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal menambahkan penilaian skor ICU');
      console.error('Error adding ICU score assessment:', err);
      throw err;
    }
  };

  const getICUPatientById = (patientId: string) => {
    return icuRecords.find(p => p.patient_id === patientId);
  };

  const getAvailableICURooms = () => {
    return icuRooms.filter(room => room.is_available);
  };

  const getICUStatistics = () => {
    const totalBeds = icuRooms.length;
    const occupiedBeds = icuRecords.filter(p => !p.discharge_date).length;
    const availableBeds = totalBeds - occupiedBeds;
    const occupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;
    
    // Distribution by condition
    const conditionDistribution: Record<string, number> = {
      critical: 0,
      stable: 0,
      improving: 0,
      deteriorating: 0
    };
    
    icuRecords.forEach(record => {
      if (!record.discharge_date && record.condition) {
        conditionDistribution[record.condition]++;
      }
    });
    
    // Ventilator utilization
    const ventilatorUtilization = icuRecords.filter(
      p => !p.discharge_date && 
      (p.ventilator_status === 'invasive' || p.ventilator_status === 'non_invasive')
    ).length;
    
    return {
      totalBeds,
      occupiedBeds,
      availableBeds,
      occupancyRate: parseFloat(occupancyRate.toFixed(2)),
      conditionDistribution,
      ventilatorUtilization,
      avgApacheIIScore: icuRecords.length > 0 
        ? parseFloat((icuRecords.reduce((sum, rec) => sum + (rec.apache_ii_score || 0), 0) / icuRecords.length).toFixed(2))
        : 0
    };
  };

  useEffect(() => {
    fetchICUData();
  }, []);

  const refreshData = () => {
    setLoading(true);
    fetchICUData();
  };

  return {
    icuRecords,
    icuRooms,
    loading,
    error,
    fetchICUData,
    admitToICU,
    dischargeFromICU,
    updatePatientCondition,
    addScoreAssessment,
    getICUPatientById,
    getAvailableICURooms,
    getICUStatistics,
    refreshData
  };
};

export default useICUData;

// Stub exports for ICU components
export interface ICUBed {
  id: string;
  bed_number: string;
  room: string;
  status: 'available' | 'occupied' | 'maintenance';
  patient_id?: string;
  patient_name?: string;
}

export interface ICUPatient {
  id: string;
  patient_id: string;
  patient_name: string;
  bed_id: string;
  admission_date: string;
  diagnosis: string;
  status: string;
}

export function useICUBeds() {
  return { data: [] as ICUBed[], isLoading: false };
}

export function useUpdateICUBed() {
  return { mutate: (_data: Partial<ICUBed>) => {}, isPending: false };
}

export function useICUStatistics() {
  return { data: { total: 0, occupied: 0, available: 0, maintenance: 0 }, isLoading: false };
}

export function useActiveICUPatients() {
  return { data: [] as ICUPatient[], isLoading: false };
}

export function useICUMonitoring(patientId?: string) {
  return { data: null, isLoading: false };
}
