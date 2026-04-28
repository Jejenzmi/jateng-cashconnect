import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface DietType {
  id: string;
  name: string;
  category: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PatientDiet {
  id: string;
  patient_id: string;
  diet_type_id: string;
  diet_name: string;
  start_date: string;
  end_date: string | null;
  status: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  patients?: {
    full_name: string;
    medical_record_number: string;
  };
  diet_types?: {
    name: string;
    category: string;
  };
}

export interface FoodAllergy {
  id: string;
  patient_id: string;
  allergen: string;
  reaction: string | null;
  severity: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  patients?: {
    full_name: string;
    medical_record_number: string;
  };
}

export interface MealPlan {
  id: string;
  patient_diet_id: string;
  meal_date: string;
  meal_type: string;
  menu_items: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  patient_diets?: {
    patient_id: string;
    diet_name: string;
    patients?: {
      full_name: string;
      medical_record_number: string;
    };
  };
}

export interface MealRecord {
  id: string;
  patient_id: string;
  meal_date: string;
  meal_type: string;
  consumed_percentage: number;
  notes: string | null;
  recorded_by: string | null;
  created_at: string;
  patients?: {
    full_name: string;
    medical_record_number: string;
  };
}

export function useNutritionData() {
  const queryClient = useQueryClient();

  // Fetch diet types
  const { data: dietTypes, isLoading: loadingDietTypes } = useQuery({
    queryKey: ["diet-types"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      return data as DietType[];
    },
  });

  // Fetch patient diets with patient info
  const { data: patientDiets, isLoading: loadingPatientDiets } = useQuery({
    queryKey: ["patient-diets"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      
      return data.map((row: any) => ({
        ...row,
        patients: {
          full_name: row.full_name,
          medical_record_number: row.medical_record_number
        },
        diet_types: {
          name: row.diet_type_name,
          category: row.diet_type_category
        }
      })) as PatientDiet[];
    },
  });

  // Fetch food allergies
  const { data: foodAllergies, isLoading: loadingAllergies } = useQuery({
    queryKey: ["food-allergies"],
    queryFn: async () => {
      const data = await getApi("/generic-api");
      
      return data.map((row: any) => ({
        ...row,
        patients: {
          full_name: row.full_name,
          medical_record_number: row.medical_record_number
        }
      })) as FoodAllergy[];
    },
  });

  // Fetch today's meal plans
  const { data: todayMealPlans, isLoading: loadingMealPlans } = useQuery({
    queryKey: ["today-meal-plans"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const data = await getApi("/generic-api");
      
      return data.map((row: any) => ({
        ...row,
        patient_diets: {
          patient_id: row.patient_id,
          diet_name: row.diet_name,
          patients: {
            full_name: row.patient_name,
            medical_record_number: row.medical_record_number
          }
        }
      })) as MealPlan[];
    },
  });

  // Fetch meal records
  const { data: mealRecords, isLoading: loadingMealRecords } = useQuery({
    queryKey: ["meal-records"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const data = await getApi("/generic-api");
      
      return data.map((row: any) => ({
        ...row,
        patients: {
          full_name: row.full_name,
          medical_record_number: row.medical_record_number
        }
      })) as MealRecord[];
    },
  });

  // Create patient diet
  const createPatientDiet = useMutation({
    mutationFn: async (diet: Omit<PatientDiet, 'id' | 'created_at' | 'updated_at'>) => {
      const result = await postApi("/generic-api", {});
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-diets"] });
      toast.success("Diet pasien berhasil ditambahkan");
    },
    onError: (error: Error) => {
      toast.error("Gagal menambah diet pasien: " + error.message);
    },
  });

  // Record food allergy
  const recordFoodAllergy = useMutation({
    mutationFn: async (allergy: Omit<FoodAllergy, 'id' | 'created_at' | 'updated_at'>) => {
      const result = await postApi("/generic-api", {});
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["food-allergies"] });
      toast.success("Alergi makanan berhasil dicatat");
    },
    onError: (error: Error) => {
      toast.error("Gagal mencatat alergi: " + error.message);
    },
  });

  // Record meal consumption
  const recordMealConsumption = useMutation({
    mutationFn: async (record: Omit<MealRecord, 'id' | 'created_at'>) => {
      const result = await postApi("/generic-api", {});
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-records"] });
      toast.success("Konsumsi makanan berhasil dicatat");
    },
    onError: (error: Error) => {
      toast.error("Gagal mencatat konsumsi: " + error.message);
    },
  });

  return {
    dietTypes,
    patientDiets,
    foodAllergies,
    todayMealPlans,
    mealRecords,
    loadingDietTypes,
    loadingPatientDiets,
    loadingAllergies,
    loadingMealPlans,
    loadingMealRecords,
    createPatientDiet,
    recordFoodAllergy,
    recordMealConsumption,
  };
}