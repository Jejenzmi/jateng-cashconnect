import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useState, useEffect } from 'react';
interface Report {
  id: string;
  title: string;
  type: string;
  category: string;
  generated_by: string;
  generated_at: string;
  data: any;
  filters_applied: any;
}

interface ReportFilter {
  field: string;
  operator: string;
  value: any;
}

const useReportData = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async (limit: number = 50, offset: number = 0) => {
    try {
      const result = await getApi<Report[]>`
        SELECT 
          id,
          title,
          type,
          category,
          generated_by,
          generated_at,
          data,
          filters_applied
        FROM reports
        ORDER BY generated_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      
      setReports(result);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data laporan');
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (
    title: string, 
    type: string, 
    category: string, 
    filters: ReportFilter[],
    userId: string
  ) => {
    try {
      // Simulate report generation by querying the required data
      const reportData = await generateReportData(type, filters);
      
      const result = await getApi<Report[]>`
        INSERT INTO reports (
          title,
          type,
          category,
          generated_by,
          data,
          filters_applied
        ) VALUES (
          ${title},
          ${type},
          ${category},
          ${userId},
          ${JSON.stringify(reportData)},
          ${JSON.stringify(filters)}
        )
        RETURNING 
          id,
          title,
          type,
          category,
          generated_by,
          generated_at,
          data,
          filters_applied
      `;
      
      // Add the new report to the state
      setReports([result[0], ...reports]);
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal membuat laporan');
      console.error('Error generating report:', err);
      throw err;
    }
  };

  const generateReportData = async (type: string, filters: ReportFilter[]) => {
    try {
      // Apply filters to construct the appropriate query
      let baseQuery = '';
      let queryParams: any[] = [];
      
      switch (type) {
        case 'patient-statistics':
          baseQuery = `
            SELECT 
              COUNT(*) as total_patients,
              COUNT(CASE WHEN gender = 'L' THEN 1 END) as male_patients,
              COUNT(CASE WHEN gender = 'P' THEN 1 END) as female_patients,
              AVG(EXTRACT(YEAR FROM AGE(date_of_birth))) as average_age
            FROM patients
          `;
          break;
          
        case 'appointment-summary':
          baseQuery = `
            SELECT 
              COUNT(*) as total_appointments,
              COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_appointments,
              COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_appointments,
              COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_appointments
            FROM appointments
          `;
          break;
          
        case 'revenue-summary':
          baseQuery = `
            SELECT 
              SUM(amount) as total_revenue,
              AVG(amount) as average_transaction,
              COUNT(*) as total_transactions
            FROM payments
          `;
          break;
          
        case 'inventory-status':
          baseQuery = `
            SELECT 
              COUNT(*) as total_items,
              COUNT(CASE WHEN stock <= min_stock THEN 1 END) as low_stock_items,
              SUM(stock * price) as total_inventory_value
            FROM inventory_items
          `;
          break;
          
        default:
          throw new Error(`Tipe laporan tidak didukung: ${type}`);
      }
      
      // Apply date range filter if present
      const dateFilter = filters.find(f => f.field === 'date_range');
      if (dateFilter && dateFilter.value) {
        const { startDate, endDate } = dateFilter.value;
        if (startDate && endDate) {
          // Add appropriate date filtering to the query based on report type
          if (type === 'appointment-summary' || type === 'revenue-summary') {
            baseQuery += ` WHERE created_at BETWEEN '${startDate}' AND '${endDate}'`;
          } else if (type === 'patient-statistics') {
            baseQuery += ` WHERE created_at BETWEEN '${startDate}' AND '${endDate}'`;
          }
        }
      }
      
      const result = await getApi<any[]>(baseQuery);
      return result[0];
    } catch (err: any) {
      console.error('Error generating report data:', err);
      throw err;
    }
  };

  const getReportById = (reportId: string) => {
    return reports.find(r => r.id === reportId);
  };

  const exportReport = async (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
    try {
      const report = getReportById(reportId);
      if (!report) {
        throw new Error('Laporan tidak ditemukan');
      }
      
      // In a real implementation, this would generate the actual file
      // For now, we'll just return the report data
      return {
        reportId,
        format,
        data: report.data,
        title: report.title,
        generatedAt: report.generated_at
      };
    } catch (err: any) {
      setError(err.message || 'Gagal mengekspor laporan');
      console.error('Error exporting report:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const refreshReports = () => {
    setLoading(true);
    fetchReports();
  };

  return {
    reports,
    loading,
    error,
    generateReport,
    getReportById,
    exportReport,
    refreshReports
  };
};

export default useReportData;