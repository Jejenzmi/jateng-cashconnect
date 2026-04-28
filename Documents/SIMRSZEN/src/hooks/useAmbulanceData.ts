import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// Interfaces untuk data ambulans
interface Ambulance {
  id: string;
  vehicle_number: string;
  brand_model: string;
  year: number;
  capacity: number;
  status: 'available' | 'maintenance' | 'on_mission';
  driver_name: string;
  driver_phone: string;
  equipment: string[];
  created_at: string;
  updated_at: string;
}

interface AmbulanceTrip {
  id: string;
  ambulance_id: string;
  driver_id: string;
  patient_id: string;
  pickup_location: string;
  destination: string;
  trip_date: string;
  departure_time: string;
  arrival_time: string;
  purpose: 'emergency' | 'transfer' | 'scheduled';
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  notes: string;
  created_at: string;
  updated_at: string;
}

interface AmbulanceDriver {
  id: string;
  name: string;
  license_number: string;
  phone: string;
  shift: string;
  status: 'available' | 'on_duty' | 'off_duty';
  created_at: string;
  updated_at: string;
}

export function useAmbulanceData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all ambulances
  const { data: ambulances, isLoading: isLoadingAmbulances } = useQuery<Ambulance[]>({
    queryKey: ["ambulances"],
    queryFn: async () => {
      try {
        const result = await getApi<Ambulance[]>`
          SELECT 
            id,
            vehicle_number,
            brand_model,
            year,
            capacity,
            status,
            driver_name,
            driver_phone,
            equipment,
            created_at,
            updated_at
          FROM ambulances
          ORDER BY vehicle_number
        `;
        return result;
      } catch (error) {
        console.error("Error fetching ambulances:", error);
        throw error;
      }
    },
  });

  // Fetch all ambulance trips
  const { data: trips, isLoading: isLoadingTrips } = useQuery<AmbulanceTrip[]>({
    queryKey: ["ambulance-trips"],
    queryFn: async () => {
      try {
        const result = await getApi<AmbulanceTrip[]>`
          SELECT 
            at.id,
            at.ambulance_id,
            at.driver_id,
            at.patient_id,
            at.pickup_location,
            at.destination,
            at.trip_date,
            at.departure_time,
            at.arrival_time,
            at.purpose,
            at.status,
            at.notes,
            at.created_at,
            at.updated_at,
            a.vehicle_number,
            p.name as patient_name
          FROM ambulance_trips at
          LEFT JOIN ambulances a ON at.ambulance_id = a.id
          LEFT JOIN patients p ON at.patient_id = p.id
          ORDER BY at.trip_date DESC, at.departure_time DESC
        `;
        return result;
      } catch (error) {
        console.error("Error fetching ambulance trips:", error);
        throw error;
      }
    },
  });

  // Fetch all drivers
  const { data: drivers, isLoading: isLoadingDrivers } = useQuery<AmbulanceDriver[]>({
    queryKey: ["ambulance-drivers"],
    queryFn: async () => {
      try {
        const result = await getApi<AmbulanceDriver[]>`
          SELECT 
            id,
            name,
            license_number,
            phone,
            shift,
            status,
            created_at,
            updated_at
          FROM ambulance_drivers
          ORDER BY name
        `;
        return result;
      } catch (error) {
        console.error("Error fetching ambulance drivers:", error);
        throw error;
      }
    },
  });

  // Create new ambulance
  const createAmbulance = useMutation({
    mutationFn: async (ambulanceData: Omit<Ambulance, 'id' | 'created_at' | 'updated_at'>) => {
      const result = await getApi<Ambulance[]>`
        INSERT INTO ambulances (
          vehicle_number,
          brand_model,
          year,
          capacity,
          status,
          driver_name,
          driver_phone,
          equipment
        ) VALUES (
          ${ambulanceData.vehicle_number},
          ${ambulanceData.brand_model},
          ${ambulanceData.year},
          ${ambulanceData.capacity},
          ${ambulanceData.status},
          ${ambulanceData.driver_name},
          ${ambulanceData.driver_phone},
          ${JSON.stringify(ambulanceData.equipment)}
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ambulances"] });
      toast({
        title: "Ambulans Berhasil Ditambahkan",
        description: "Data ambulans telah ditambahkan ke sistem.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menambahkan Ambulans",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update ambulance
  const updateAmbulance = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Ambulance> & { id: string }) => {
      const result = await getApi<Ambulance[]>`
        UPDATE ambulances 
        SET 
          vehicle_number = ${updateData.vehicle_number},
          brand_model = ${updateData.brand_model},
          year = ${updateData.year},
          capacity = ${updateData.capacity},
          status = ${updateData.status},
          driver_name = ${updateData.driver_name},
          driver_phone = ${updateData.driver_phone},
          equipment = ${updateData.equipment ? JSON.stringify(updateData.equipment) : undefined}
        WHERE id = ${id} 
        RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ambulances"] });
      queryClient.invalidateQueries({ queryKey: ["ambulance-trips"] });
      toast({
        title: "Ambulans Berhasil Diperbarui",
        description: "Data ambulans telah diperbarui.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Memperbarui Ambulans",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete ambulance
  const deleteAmbulance = useMutation({
    mutationFn: async (id: string) => {
      await deleteApi("/generic-api");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ambulances"] });
      toast({
        title: "Ambulans Berhasil Dihapus",
        description: "Data ambulans telah dihapus dari sistem.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menghapus Ambulans",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create new trip
  const createTrip = useMutation({
    mutationFn: async (tripData: Omit<AmbulanceTrip, 'id' | 'created_at' | 'updated_at'>) => {
      const result = await getApi<AmbulanceTrip[]>`
        INSERT INTO ambulance_trips (
          ambulance_id,
          driver_id,
          patient_id,
          pickup_location,
          destination,
          trip_date,
          departure_time,
          arrival_time,
          purpose,
          status,
          notes
        ) VALUES (
          ${tripData.ambulance_id},
          ${tripData.driver_id},
          ${tripData.patient_id},
          ${tripData.pickup_location},
          ${tripData.destination},
          ${tripData.trip_date},
          ${tripData.departure_time},
          ${tripData.arrival_time},
          ${tripData.purpose},
          ${tripData.status},
          ${tripData.notes}
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ambulance-trips"] });
      toast({
        title: "Perjalanan Ambulans Berhasil Ditambahkan",
        description: "Data perjalanan ambulans telah ditambahkan ke sistem.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menambahkan Perjalanan Ambulans",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update trip
  const updateTrip = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<AmbulanceTrip> & { id: string }) => {
      const result = await getApi<AmbulanceTrip[]>`
        UPDATE ambulance_trips 
        SET 
          ambulance_id = ${updateData.ambulance_id},
          driver_id = ${updateData.driver_id},
          patient_id = ${updateData.patient_id},
          pickup_location = ${updateData.pickup_location},
          destination = ${updateData.destination},
          trip_date = ${updateData.trip_date},
          departure_time = ${updateData.departure_time},
          arrival_time = ${updateData.arrival_time},
          purpose = ${updateData.purpose},
          status = ${updateData.status},
          notes = ${updateData.notes}
        WHERE id = ${id} 
        RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ambulance-trips"] });
      toast({
        title: "Perjalanan Ambulans Berhasil Diperbarui",
        description: "Data perjalanan ambulans telah diperbarui.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Memperbarui Perjalanan Ambulans",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    ambulances,
    trips,
    drivers,
    isLoadingAmbulances,
    isLoadingTrips,
    isLoadingDrivers,
    createAmbulance: createAmbulance.mutate,
    updateAmbulance: updateAmbulance.mutate,
    deleteAmbulance: deleteAmbulance.mutate,
    createTrip: createTrip.mutate,
    updateTrip: updateTrip.mutate,
    isCreatingAmbulance: createAmbulance.isPending,
    isUpdatingAmbulance: updateAmbulance.isPending,
    isDeletingAmbulance: deleteAmbulance.isPending,
    isCreatingTrip: createTrip.isPending,
    isUpdatingTrip: updateTrip.isPending,
  };
}

// Stub exports for AmbulanceCenter page
export interface AmbulanceFleet {
  id: string;
  vehicle_number: string;
  brand_model: string;
  status: 'available' | 'maintenance' | 'on_mission';
  driver_name: string;
  driver_phone: string;
}

export interface AmbulanceDispatch {
  id: string;
  dispatch_number: string;
  ambulance_id: string;
  patient_name: string;
  pickup_location: string;
  destination: string;
  status: string;
  dispatched_at: string;
}

export function useAmbulanceFleet() {
  const { ambulances, isLoadingAmbulances } = useAmbulanceData();
  return { data: ambulances as AmbulanceFleet[], isLoading: isLoadingAmbulances };
}

export function useAmbulanceDispatches() {
  const { trips, isLoadingTrips } = useAmbulanceData();
  return { data: trips, isLoading: isLoadingTrips };
}

export function useCreateDispatch() {
  const { createTrip } = useAmbulanceData();
  return { mutate: createTrip, isPending: false };
}

export function generateDispatchNumber(): string {
  const now = new Date();
  return `DISP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 9000) + 1000}`;
}
