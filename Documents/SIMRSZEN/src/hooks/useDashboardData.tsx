import { useState, useEffect } from 'react';
import { getApi } from '@/utils/api';  // Impor fungsi getApi

interface DashboardStats {
  total_patients: number;
  total_appointments: number;
  total_revenue: number;
  pending_tasks: number;
}

interface Appointment {
  id: string;
  patient_name: string;
  doctor: string;
  time: string;
  status: string;
}

interface RevenueData {
  date: string;
  amount: number;
}

interface BedOccupancyWard {
  name: string;
  total: number;
  occupied: number;
  color: string;
}

interface WeeklyVisitData {
  name: string;
  rawatJalan: number;
  rawatInap: number;
  igd: number;
}

interface DashboardStatValue {
  title: string;
  value: number | string;
  change: number;
  icon: string;
}

const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      // Fetch all dashboard data through API using our getApi utility
      const data = await getApi<any>('/dashboard');
      
      // Set all data at once
      setStats(data.stats);
      setAppointments(data.appointments);
      setRevenueData(data.revenueData);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data dashboard');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refreshData = () => {
    setLoading(true);
    fetchStats();
  };

  return { data: { stats, appointments, revenueData }, loading, error, refreshData };
};

// Custom hook specifically for weekly visits data
export const useWeeklyVisits = () => {
  const [data, setData] = useState<WeeklyVisitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call to fetch weekly visits data
        // Replace this with actual API call when backend is ready
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulating network delay
        
        // Sample data - replace with actual API call
        const sampleData: WeeklyVisitData[] = [
          { name: 'Senin', rawatJalan: 4000, rawatInap: 2400, igd: 2400 },
          { name: 'Selasa', rawatJalan: 3000, rawatInap: 1398, igd: 2210 },
          { name: 'Rabu', rawatJalan: 2000, rawatInap: 9800, igd: 2290 },
          { name: 'Kamis', rawatJalan: 2780, rawatInap: 3908, igd: 2000 },
          { name: 'Jumat', rawatJalan: 1890, rawatInap: 4800, igd: 2181 },
          { name: 'Sabtu', rawatJalan: 2390, rawatInap: 3800, igd: 2500 },
          { name: 'Minggu', rawatJalan: 3490, rawatInap: 4300, igd: 2100 },
        ];
        
        setData(sampleData);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat data kunjungan mingguan');
        console.error('Error fetching weekly visits data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading: loading, error };
};

// Custom hook specifically for bed occupancy data
export const useBedOccupancy = () => {
  const [data, setData] = useState<BedOccupancyWard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call to fetch bed occupancy data
        // Replace this with actual API call when backend is ready
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulating network delay
        
        // Sample data - replace with actual API call
        const sampleData: BedOccupancyWard[] = [
          { name: 'IRNA BIASA', total: 20, occupied: 16, color: 'bg-medical-blue' },
          { name: 'IRNA ANAK', total: 12, occupied: 8, color: 'bg-medical-green' },
          { name: 'IRNA BERSALIN', total: 8, occupied: 6, color: 'bg-medical-purple' },
          { name: 'IRNA INTENSIF', total: 6, occupied: 5, color: 'bg-medical-coral' },
          { name: 'INSTALASI OPERASI', total: 4, occupied: 2, color: 'bg-medical-orange' },
        ];
        
        setData(sampleData);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat data okupansi tempat tidur');
        console.error('Error fetching bed occupancy data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading: loading, error };
};

// Custom hook specifically for dashboard stats
export const useDashboardStats = () => {
  const [data, setData] = useState<DashboardStatValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call to fetch dashboard stats
        // Replace this with actual API call when backend is ready
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulating network delay
        
        // Sample data - replace with actual API call
        const sampleData: DashboardStatValue[] = [
          { 
            title: 'Pasien Hari Ini', 
            value: 142, 
            change: 12, 
            icon: '👥' 
          },
          { 
            title: 'Antrian', 
            value: 24, 
            change: -3, 
            icon: '📋' 
          },
          { 
            title: 'Rawat Inap', 
            value: 86, 
            change: 5, 
            icon: '🏥' 
          },
          { 
            title: 'Ketersediaan TT', 
            value: 32, 
            change: 2, 
            icon: '🛏️' 
          },
        ];
        
        setData(sampleData);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat data statistik dashboard');
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading: loading, error };
};

export default useDashboardData;