import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// Interfaces untuk data home care
interface HomeCareService {
  id: string;
  service_name: string;
  description: string;
  category: string; // perawatan, terapi, rehabilitasi
  base_price: number;
  duration_minutes: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

interface HomeCareBooking {
  id: string;
  patient_id: string;
  service_id: string;
  assigned_nurse_id: string;
  booking_date: string;
  service_time: string; // Waktu pelaksanaan layanan
  status: 'booked' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  address: string; // Alamat pasien untuk layanan home care
  notes: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface HomeCareVisit {
  id: string;
  booking_id: string;
  nurse_id: string;
  visit_start_time: string;
  visit_end_time?: string;
  vital_signs: any; // JSON untuk tekanan darah, suhu, dll
  assessment_notes: string;
  medications_given: any[]; // JSON untuk obat yang diberikan
  follow_up_required: boolean;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

interface NurseAssignment {
  id: string;
  nurse_id: string;
  service_id: string;
  availability_status: 'available' | 'assigned' | 'off';
  weekly_schedule: any; // JSON untuk jadwal mingguan
  created_at: string;
  updated_at: string;
}

export function useHomeCareData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all home care services
  const { data: services, isLoading: isLoadingServices } = useQuery<HomeCareService[]>({
    queryKey: ["home-care-services"],
    queryFn: async () => {
      try {
        const result = await getApi<HomeCareService[]>`
          SELECT 
            id,
            service_name,
            description,
            category,
            base_price,
            duration_minutes,
            is_available,
            created_at,
            updated_at
          FROM home_care_services
          ORDER BY service_name
        `;
        return result;
      } catch (error) {
        console.error("Error fetching home care services:", error);
        throw error;
      }
    },
  });

  // Fetch all home care bookings
  const { data: bookings, isLoading: isLoadingBookings } = useQuery<HomeCareBooking[]>({
    queryKey: ["home-care-bookings"],
    queryFn: async () => {
      try {
        const result = await getApi<HomeCareBooking[]>`
          SELECT 
            hcb.id,
            hcb.patient_id,
            hcb.service_id,
            hcb.assigned_nurse_id,
            hcb.booking_date,
            hcb.service_time,
            hcb.status,
            hcb.address,
            hcb.notes,
            hcb.created_by,
            hcb.created_at,
            hcb.updated_at,
            p.name as patient_name,
            u.full_name as nurse_name,
            hcs.service_name
          FROM home_care_bookings hcb
          LEFT JOIN patients p ON hcb.patient_id = p.id
          LEFT JOIN users u ON hcb.assigned_nurse_id = u.id
          LEFT JOIN home_care_services hcs ON hcb.service_id = hcs.id
          ORDER BY hcb.booking_date DESC, hcb.service_time
        `;
        return result;
      } catch (error) {
        console.error("Error fetching home care bookings:", error);
        throw error;
      }
    },
  });

  // Fetch all home care visits
  const { data: visits, isLoading: isLoadingVisits } = useQuery<HomeCareVisit[]>({
    queryKey: ["home-care-visits"],
    queryFn: async () => {
      try {
        const result = await getApi<HomeCareVisit[]>`
          SELECT 
            hcv.id,
            hcv.booking_id,
            hcv.nurse_id,
            hcv.visit_start_time,
            hcv.visit_end_time,
            hcv.vital_signs,
            hcv.assessment_notes,
            hcv.medications_given,
            hcv.follow_up_required,
            hcv.follow_up_date,
            hcv.created_at,
            hcv.updated_at,
            u.full_name as nurse_name,
            hcb.service_time as booking_service_time
          FROM home_care_visits hcv
          LEFT JOIN users u ON hcv.nurse_id = u.id
          LEFT JOIN home_care_bookings hcb ON hcv.booking_id = hcb.id
          ORDER BY hcv.visit_start_time DESC
        `;
        return result;
      } catch (error) {
        console.error("Error fetching home care visits:", error);
        throw error;
      }
    },
  });

  // Get nurses available for home care assignments
  const { data: nurseAssignments } = useQuery<NurseAssignment[]>({
    queryKey: ["nurse-assignments"],
    queryFn: async () => {
      try {
        const result = await getApi<NurseAssignment[]>`
          SELECT 
            na.id,
            na.nurse_id,
            na.service_id,
            na.availability_status,
            na.weekly_schedule,
            na.created_at,
            na.updated_at,
            u.full_name as nurse_name,
            hcs.service_name
          FROM nurse_assignments na
          LEFT JOIN users u ON na.nurse_id = u.id
          LEFT JOIN home_care_services hcs ON na.service_id = hcs.id
          ORDER BY u.full_name
        `;
        return result;
      } catch (error) {
        console.error("Error fetching nurse assignments:", error);
        throw error;
      }
    },
  });

  // Create new home care service
  const createService = useMutation({
    mutationFn: async (serviceData: Omit<HomeCareService, 'id' | 'created_at' | 'updated_at'>) => {
      const result = await getApi<HomeCareService[]>`
        INSERT INTO home_care_services (
          service_name,
          description,
          category,
          base_price,
          duration_minutes,
          is_available
        ) VALUES (
          ${serviceData.service_name},
          ${serviceData.description},
          ${serviceData.category},
          ${serviceData.base_price},
          ${serviceData.duration_minutes},
          ${serviceData.is_available}
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-care-services"] });
      toast({
        title: "Layanan Home Care Berhasil Ditambahkan",
        description: "Layanan home care baru telah ditambahkan ke sistem.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menambahkan Layanan Home Care",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Book a home care service
  const bookService = useMutation({
    mutationFn: async (bookingData: Omit<HomeCareBooking, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
      const result = await getApi<HomeCareBooking[]>`
        INSERT INTO home_care_bookings (
          patient_id,
          service_id,
          assigned_nurse_id,
          booking_date,
          service_time,
          address,
          notes,
          created_by
        ) VALUES (
          ${bookingData.patient_id},
          ${bookingData.service_id},
          ${bookingData.assigned_nurse_id},
          ${bookingData.booking_date},
          ${bookingData.service_time},
          ${bookingData.address},
          ${bookingData.notes},
          ${bookingData.created_by}
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-care-bookings"] });
      toast({
        title: "Booking Berhasil Dibuat",
        description: "Booking layanan home care telah dibuat.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Membuat Booking",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update booking status
  const updateBookingStatus = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      const result = await getApi<HomeCareBooking[]>`
        UPDATE home_care_bookings 
        SET 
          status = ${status},
          updated_at = NOW()
        WHERE id = ${bookingId} 
        RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-care-bookings"] });
      toast({
        title: "Status Booking Diperbarui",
        description: "Status booking layanan home care telah diperbarui.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Memperbarui Status Booking",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Record home care visit
  const recordVisit = useMutation({
    mutationFn: async (visitData: Omit<HomeCareVisit, 'id' | 'created_at' | 'updated_at'>) => {
      const result = await getApi<HomeCareVisit[]>`
        INSERT INTO home_care_visits (
          booking_id,
          nurse_id,
          visit_start_time,
          visit_end_time,
          vital_signs,
          assessment_notes,
          medications_given,
          follow_up_required,
          follow_up_date
        ) VALUES (
          ${visitData.booking_id},
          ${visitData.nurse_id},
          ${visitData.visit_start_time},
          ${visitData.visit_end_time},
          ${JSON.stringify(visitData.vital_signs)},
          ${visitData.assessment_notes},
          ${JSON.stringify(visitData.medications_given)},
          ${visitData.follow_up_required},
          ${visitData.follow_up_date}
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-care-visits"] });
      toast({
        title: "Kunjungan Berhasil Dicatat",
        description: "Catatan kunjungan home care telah disimpan.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Mencatat Kunjungan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    services,
    bookings,
    visits,
    nurseAssignments,
    isLoadingServices,
    isLoadingBookings,
    isLoadingVisits,
    createService: createService.mutate,
    bookService: bookService.mutate,
    updateBookingStatus: updateBookingStatus.mutate,
    recordVisit: recordVisit.mutate,
    isCreatingService: createService.isPending,
    isBookingService: bookService.isPending,
    isUpdatingBookingStatus: updateBookingStatus.isPending,
    isRecordingVisit: recordVisit.isPending,
  };
}
// Stub exports for HomeCare page
export function useHomeCareVisits() {
  const { visits, isLoadingVisits } = useHomeCareData();
  return { data: visits, isLoading: isLoadingVisits };
}

export function useCreateHomeCareVisit() {
  const { recordVisit } = useHomeCareData();
  return { mutate: recordVisit, isPending: false };
}

export function useUpdateHomeCareVisit() {
  return { mutate: (_data: any) => {}, isPending: false };
}

export function generateHomeCareVisitNumber(): string {
  const now = new Date();
  return `HC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 9000) + 1000}`;
}
