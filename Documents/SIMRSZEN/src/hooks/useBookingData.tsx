import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  department_id: string | null;
  appointment_date: string;
  appointment_time: string;
  end_time: string | null;
  appointment_type: string;
  status: string;
  chief_complaint: string | null;
  notes: string | null;
  booking_source: string | null;
  reminder_sent: boolean | null;
  created_at: string;
  patient?: {
    id: string;
    full_name: string;
    medical_record_number: string;
    phone: string | null;
  };
  doctor?: {
    id: string;
    full_name: string;
    specialization: string | null;
  };
}

export interface Patient {
  id: string;
  full_name: string;
  medical_record_number: string;
  phone: string | null;
  nik: string;
}

export interface Doctor {
  id: string;
  full_name: string;
  specialization: string | null;
  department_id: string | null;
  consultation_fee: number | null;
}

export interface DoctorSchedule {
  id: string;
  doctor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration: number;
  max_patients: number | null;
  room_number: string | null;
  is_active: boolean;
}

export function useBookingData() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    today: 0,
    pending: 0,
    telemedicine: 0,
    completed: 0,
  });
  const { toast } = useToast();

  const fetchAppointments = async (date?: string) => {
    try {
      let sql = getApi("/generic-api");

      if (date) {
        sql = getApi("/generic-api");
      }

      const data = await sql;

      // Format the data to match the expected interface
      const formattedAppointments = data.map((row: any) => ({
        ...row,
        patient: row.patient_id ? {
          id: row.patient_id,
          full_name: row.patient_name,
          medical_record_number: row.medical_record_number,
          phone: row.patient_phone,
        } : undefined,
        doctor: row.doctor_id ? {
          id: row.doctor_id,
          full_name: row.doctor_name,
          specialization: row.specialization,
        } : undefined,
      }));

      setAppointments(formattedAppointments);

      // Calculate stats
      const today = format(new Date(), "yyyy-MM-dd");
      const todayAppointments = formattedAppointments.filter((a: any) => a.appointment_date === today);
      setStats({
        today: todayAppointments.length,
        pending: todayAppointments.filter((a: any) => a.status === "scheduled").length,
        telemedicine: todayAppointments.filter((a: any) => a.appointment_type === "telemedicine").length,
        completed: todayAppointments.filter((a: any) => a.status === "completed").length,
      });
    } catch (error: any) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data appointment",
        variant: "destructive",
      });
    }
  };

  const searchPatients = async (searchTerm: string) => {
    try {
      if (!searchTerm || searchTerm.length < 2) {
        setPatients([]);
        return;
      }

      const data = await getApi(`/generic-api?table=patients&search=${encodeURIComponent(searchTerm)}`);

      setPatients(data);
    } catch (error: any) {
      console.error("Error searching patients:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const data = await getApi("/generic-api");
      setDoctors(data);
    } catch (error: any) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const data = await getApi("/generic-api");
      setSchedules(data);
    } catch (error: any) {
      console.error("Error fetching schedules:", error);
    }
  };

  const createAppointment = async (appointment: any) => {
    try {
      const result = await postApi("/generic-api", {});
      
      const data = result[0];
      
      toast({ title: "Berhasil", description: "Booking berhasil dibuat" });
      fetchAppointments();
      return data;
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Error",
        description: error.message || "Gagal membuat booking",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      // Membentuk dinamis bagian SET dari query SQL
      const updateFields = Object.keys(updates);
      if (updateFields.length === 0) {
        throw new Error("Tidak ada field yang di-update");
      }

      let setClause = "";
      const values: any[] = [];
      updateFields.forEach((field, idx) => {
        if (idx > 0) setClause += ", ";
        setClause += `"${field}" = $${idx + 1}`;
        values.push((updates as any)[field]);
      });

      await getApi.unsafe(
        `UPDATE appointments SET ${setClause} WHERE id = $${values.length + 1}`,
        [...values, id]
      );
      
      toast({ title: "Berhasil", description: "Appointment berhasil diperbarui" });
      fetchAppointments();
    } catch (error: any) {
      console.error("Error updating appointment:", error);
      toast({
        title: "Error",
        description: error.message || "Gagal memperbarui appointment",
        variant: "destructive",
      });
      throw error;
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      await putApi("/generic-api", {});
      
      toast({ title: "Berhasil", description: "Appointment dibatalkan" });
      fetchAppointments();
    } catch (error: any) {
      console.error("Error cancelling appointment:", error);
      toast({
        title: "Error",
        description: error.message || "Gagal membatalkan appointment",
        variant: "destructive",
      });
    }
  };

  const confirmAppointment = async (id: string) => {
    try {
      await putApi("/generic-api", {});
      
      toast({ title: "Berhasil", description: "Appointment dikonfirmasi" });
      fetchAppointments();
    } catch (error: any) {
      console.error("Error confirming appointment:", error);
      toast({
        title: "Error",
        description: error.message || "Gagal mengkonfirmasi appointment",
        variant: "destructive",
      });
    }
  };

  const getAvailableSlots = async (doctorId: string, date: Date) => {
    try {
      const dayOfWeek = date.getDay();
      const dateStr = format(date, "yyyy-MM-dd");

      // Get doctor schedule for this day
      const scheduleResult = await getApi("/generic-api");

      if (scheduleResult.length === 0) return [];

      const schedule = scheduleResult[0];

      // Get existing appointments
      const existingAptsResult = await getApi("/generic-api");

      // Generate available slots
      const bookedTimes = new Set(existingAptsResult.map((a: any) => a.appointment_time));
      const slots: string[] = [];
      
      const [startHour, startMin] = schedule.start_time.split(":").map(Number);
      const [endHour, endMin] = schedule.end_time.split(":").map(Number);
      
      let currentMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      while (currentMinutes < endMinutes) {
        const hours = Math.floor(currentMinutes / 60);
        const mins = currentMinutes % 60;
        const timeStr = `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:00`;
        
        if (!bookedTimes.has(timeStr)) {
          slots.push(timeStr.substring(0, 5));
        }
        
        currentMinutes += schedule.slot_duration;
      }

      return slots;
    } catch (error: any) {
      console.error("Error getting available slots:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAppointments(),
        fetchDoctors(),
        fetchSchedules(),
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  return {
    appointments,
    patients,
    doctors,
    schedules,
    stats,
    loading,
    fetchAppointments,
    searchPatients,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    confirmAppointment,
    getAvailableSlots,
  };
}