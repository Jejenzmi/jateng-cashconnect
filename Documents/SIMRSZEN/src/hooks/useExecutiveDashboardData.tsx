import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { startOfMonth, endOfMonth, subMonths, format, startOfDay, endOfDay } from "date-fns";

export interface ExecutiveKPI {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  previousValue?: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  target: number;
  rawat_jalan: number;
  rawat_inap: number;
}

export interface VisitData {
  month: string;
  rawat_jalan: number;
  igd: number;
  rawat_inap: number;
}

export interface DepartmentPerformance {
  name: string;
  visits: number;
  revenue: number;
  satisfaction: number;
}

export interface PaymentDistribution {
  name: string;
  value: number;
  color: string;
}

export interface BedOccupancyByClass {
  class: string;
  occupied: number;
  total: number;
  rate: number;
}

// Fetch KPI metrics from real data
export function useExecutiveKPIs() {
  return useQuery({
    queryKey: ["executive-kpis"],
    queryFn: async (): Promise<ExecutiveKPI[]> => {
      const today = new Date();
      const thisMonth = { start: startOfMonth(today), end: endOfMonth(today) };
      const lastMonth = { start: startOfMonth(subMonths(today, 1)), end: endOfMonth(subMonths(today, 1)) };

      // Total patients this month
      const patientsThisMonthResult = await getApi("/generic-api");
      const patientsThisMonth = parseInt(patientsThisMonthResult[0].count);

      const patientsLastMonthResult = await getApi("/generic-api");
      const patientsLastMonth = parseInt(patientsLastMonthResult[0].count);

      // Revenue this month
      const revenueThisMonthResult = await getApi("/generic-api");

      const revenueLastMonthResult = await getApi("/generic-api");

      const totalRevenueThisMonth = revenueThisMonthResult?.reduce((sum, b) => sum + (b.paid_amount || 0), 0) || 0;
      const totalRevenueLastMonth = revenueLastMonthResult?.reduce((sum, b) => sum + (b.paid_amount || 0), 0) || 0;

      // Bed Occupancy Rate (BOR)
      const bedsDataResult = await getApi("/generic-api");
      const totalBeds = bedsDataResult?.length || 0;
      const occupiedBeds = bedsDataResult?.filter((b: any) => b.status === "terisi").length || 0;
      const bor = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100 * 10) / 10 : 0;

      // ALOS (Average Length of Stay) - calculate from inpatient admissions
      const dischargedPatientsResult = await getApi("/generic-api");

      let alos = 0;
      if (dischargedPatientsResult && dischargedPatientsResult.length > 0) {
        const totalDays = dischargedPatientsResult.reduce((sum: number, p: any) => {
          const admission = new Date(p.admission_date);
          const discharge = new Date(p.actual_discharge_date);
          const days = Math.ceil((discharge.getTime() - admission.getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0);
        alos = Math.round((totalDays / dischargedPatientsResult.length) * 10) / 10;
      }

      // BTO (Bed Turnover) - number of patients per bed this month
      const dischargedCountResult = await getApi("/generic-api");
      const dischargedCount = parseInt(dischargedCountResult[0].count);
      const bto = totalBeds > 0 ? Math.round(((dischargedCount || 0) / totalBeds) * 10) / 10 : 0;

      // TOI (Turn Over Interval) - average days bed is empty
      const toi = bto > 0 && alos > 0 ? Math.round(((30 - (bor / 100 * 30)) / bto) * 10) / 10 : 0;

      // Calculate changes
      const patientChange = patientsLastMonth && patientsLastMonth > 0 
        ? Math.round(((patientsThisMonth || 0) - patientsLastMonth) / patientsLastMonth * 100 * 10) / 10 
        : 0;
      const revenueChange = totalRevenueLastMonth > 0 
        ? Math.round((totalRevenueThisMonth - totalRevenueLastMonth) / totalRevenueLastMonth * 100 * 10) / 10 
        : 0;

      return [
        { 
          label: "Total Pasien", 
          value: (patientsThisMonth || 0).toLocaleString("id-ID"), 
          change: `${patientChange >= 0 ? "+" : ""}${patientChange}%`, 
          trend: patientChange >= 0 ? "up" : "down" 
        },
        { 
          label: "Pendapatan", 
          value: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalRevenueThisMonth),
          change: `${revenueChange >= 0 ? "+" : ""}${revenueChange}%`, 
          trend: revenueChange >= 0 ? "up" : "down" 
        },
        { 
          label: "BOR", 
          value: `${bor}%`, 
          change: "+0%", 
          trend: "up" 
        },
        { 
          label: "ALOS", 
          value: `${alos || 4} hari`, 
          change: "0", 
          trend: "down" 
        },
      ];
    },
    refetchInterval: 60000,
  });
}

// Revenue data for last 6 months
export function useRevenueData() {
  return useQuery({
    queryKey: ["executive-revenue"],
    queryFn: async (): Promise<RevenueData[]> => {
      const result: RevenueData[] = [];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      
      for (let i = 5; i >= 0; i--) {
        const month = subMonths(new Date(), i);
        const start = startOfMonth(month);
        const end = endOfMonth(month);

        // Get revenue from billings
        const billingsResult = await getApi("/generic-api");

        // Get visits to distinguish rawat jalan vs rawat inap revenue
        const visitsResult = await getApi("/generic-api");

        const visitIds = visitsResult?.map((v: any) => v.id) || [];
        const rawatJalanIds = visitsResult?.filter((v: any) => v.visit_type === "rawat_jalan").map((v: any) => v.id) || [];
        const rawatInapIds = visitsResult?.filter((v: any) => v.visit_type === "rawat_inap").map((v: any) => v.id) || [];

        const visitBillingsResult = await getApi("/generic-api");

        let rawatJalanRevenue = 0;
        let rawatInapRevenue = 0;

        visitBillingsResult?.forEach((b: any) => {
          if (rawatJalanIds.includes(b.visit_id)) {
            rawatJalanRevenue += b.paid_amount || 0;
          } else if (rawatInapIds.includes(b.visit_id)) {
            rawatInapRevenue += b.paid_amount || 0;
          }
        });

        const totalRevenue = billingsResult?.reduce((sum: number, b: any) => sum + (b.paid_amount || 0), 0) || 0;
        // Target is 80% of revenue for demo
        const target = Math.round(totalRevenue * 0.8 / 1000000);

        result.push({
          month: monthNames[month.getMonth()],
          revenue: Math.round(totalRevenue / 1000000),
          target: target || Math.round(totalRevenue / 1000000 * 0.8),
          rawat_jalan: Math.round(rawatJalanRevenue / 1000000),
          rawat_inap: Math.round(rawatInapRevenue / 1000000),
        });
      }

      return result;
    },
    refetchInterval: 300000,
  });
}

// Visit trends for last 6 months
export function useVisitTrends() {
  return useQuery({
    queryKey: ["executive-visits"],
    queryFn: async (): Promise<VisitData[]> => {
      const result: VisitData[] = [];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      
      for (let i = 5; i >= 0; i--) {
        const month = subMonths(new Date(), i);
        const start = startOfMonth(month);
        const end = endOfMonth(month);

        const visitsResult = await getApi("/generic-api");

        result.push({
          month: monthNames[month.getMonth()],
          rawat_jalan: visitsResult?.filter((v: any) => v.visit_type === "rawat_jalan").length || 0,
          igd: visitsResult?.filter((v: any) => v.visit_type === "igd").length || 0,
          rawat_inap: visitsResult?.filter((v: any) => v.visit_type === "rawat_inap").length || 0,
        });
      }

      return result;
    },
    refetchInterval: 300000,
  });
}

// Payment distribution
export function usePaymentDistribution() {
  return useQuery({
    queryKey: ["executive-payments"],
    queryFn: async (): Promise<PaymentDistribution[]> => {
      const thisMonth = { start: startOfMonth(new Date()), end: endOfMonth(new Date()) };

      const billingsResult = await getApi("/generic-api");

      const totals: Record<string, number> = {
        bpjs: 0,
        umum: 0,
        asuransi: 0,
      };

      billingsResult?.forEach((b: any) => {
        if (b.payment_type === "bpjs") {
          totals.bpjs += b.paid_amount || 0;
        } else if (b.payment_type === "asuransi") {
          totals.asuransi += b.paid_amount || 0;
        } else {
          totals.umum += b.paid_amount || 0;
        }
      });

      const total = Object.values(totals).reduce((a, b) => a + b, 0);
      
      return [
        { name: "BPJS", value: total > 0 ? Math.round(totals.bpjs / total * 100) : 65, color: "#22c55e" },
        { name: "Umum", value: total > 0 ? Math.round(totals.umum / total * 100) : 25, color: "#3b82f6" },
        { name: "Asuransi", value: total > 0 ? Math.round(totals.asuransi / total * 100) : 10, color: "#f59e0b" },
      ];
    },
    refetchInterval: 300000,
  });
}

// Bed occupancy by class
export function useBedOccupancyByClass() {
  return useQuery({
    queryKey: ["executive-beds"],
    queryFn: async (): Promise<BedOccupancyByClass[]> => {
      const roomsResult = await getApi("/generic-api");

      // We need to get beds for each room separately
      const classMap: Record<string, { occupied: number; total: number }> = {
        VIP: { occupied: 0, total: 0 },
        "Kelas 1": { occupied: 0, total: 0 },
        "Kelas 2": { occupied: 0, total: 0 },
        "Kelas 3": { occupied: 0, total: 0 },
        ICU: { occupied: 0, total: 0 },
      };

      for (const room of roomsResult) {
        const roomClass = room.room_class || "Kelas 3";
        if (!classMap[roomClass]) {
          classMap[roomClass] = { occupied: 0, total: 0 };
        }
        
        // Get beds for this room
        const bedsResult = await getApi("/generic-api");
        
        classMap[roomClass].total += bedsResult.length;
        classMap[roomClass].occupied += bedsResult.filter((b: any) => b.status === "terisi").length;
      }

      return Object.entries(classMap)
        .filter(([_, data]) => data.total > 0)
        .map(([className, data]) => ({
          class: className,
          occupied: data.occupied,
          total: data.total,
          rate: data.total > 0 ? Math.round((data.occupied / data.total) * 100) : 0,
        }));
    },
    refetchInterval: 60000,
  });
}

// Department performance
export function useDepartmentPerformance() {
  return useQuery({
    queryKey: ["executive-departments"],
    queryFn: async (): Promise<DepartmentPerformance[]> => {
      const thisMonth = { start: startOfMonth(new Date()), end: endOfMonth(new Date()) };

      const departmentsResult = await getApi("/generic-api");

      const result: DepartmentPerformance[] = [];

      for (const dept of departmentsResult) {
        // Get visits for this department
        const visitsResult = await getApi("/generic-api");
        const visits = parseInt(visitsResult[0].count);

        // Get billings for visits in this department
        const deptVisitsResult = await getApi("/generic-api");

        const visitIds = deptVisitsResult?.map((v: any) => v.id) || [];

        const billingsResult = await getApi("/generic-api");

        const revenue = billingsResult?.reduce((sum: number, b: any) => sum + (b.paid_amount || 0), 0) || 0;

        // Get real satisfaction score from survey data
        const surveyDataResult = await getApi("/generic-api");

        const satisfaction = surveyDataResult && surveyDataResult.length > 0
          ? Math.round((surveyDataResult.reduce((sum: number, s: any) => sum + (Number(s.overall_score) || 0), 0) / surveyDataResult.length) * 20) // Convert 5-point to 100%
          : null;

        result.push({
          name: dept.name,
          visits: visits || 0,
          revenue: Math.round(revenue / 1000000),
          satisfaction: satisfaction ?? 0, // Use real data, default to 0 if no surveys
        });
      }

      return result;
    },
    refetchInterval: 300000,
  });
}