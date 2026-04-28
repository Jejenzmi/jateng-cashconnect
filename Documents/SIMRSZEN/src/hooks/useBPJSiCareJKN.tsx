import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useState, useEffect } from 'react';
interface ICareJKNSubmission {
  id: string;
  submission_id: string;
  patient_id: string;
  patient_name: string;
  patient_no_kartu: string;
  service_type: string;
  service_date: string;
  facility_code: string;
  facility_name: string;
  care_provider_nik: string;
  care_provider_name: string;
  care_provider_type: string;
  service_notes: string;
  icare_score: number;
  feedback: string;
  status: 'draft' | 'submitted' | 'processed' | 'approved' | 'rejected';
  submission_date: string;
  processed_date: string;
  created_at: string;
  updated_at: string;
}

interface ICareJKNSummary {
  month: string;
  year: number;
  total_submissions: number;
  avg_icare_score: number;
  total_positive_feedback: number;
  total_negative_feedback: number;
}

const useBPJSiCareJKN = () => {
  const [submissions, setSubmissions] = useState<ICareJKNSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async (status?: string, startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = `
        SELECT 
          id,
          submission_id,
          patient_id,
          patient_name,
          patient_no_kartu,
          service_type,
          service_date,
          facility_code,
          facility_name,
          care_provider_nik,
          care_provider_name,
          care_provider_type,
          service_notes,
          icare_score,
          feedback,
          status,
          submission_date,
          processed_date,
          created_at,
          updated_at
        FROM bpjs_i_care_jkn_submissions
      `;
      
      const conditions = [];
      if (status) {
        conditions.push(`status = ${status}`);
      }
      
      if (startDate && endDate) {
        conditions.push(`created_at BETWEEN ${startDate} AND ${endDate}`);
      } else if (startDate) {
        conditions.push(`created_at >= ${startDate}`);
      } else if (endDate) {
        conditions.push(`created_at <= ${endDate}`);
      }
      
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }
      
      query += ` ORDER BY created_at DESC`;
      
      const result = await getApi<ICareJKNSubmission[]>(query);
      setSubmissions(result);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data iCare JKN BPJS');
      console.error('Error fetching iCare JKN data:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitICare = async (
    patientId: string,
    patientName: string,
    patientNoKartu: string,
    serviceType: string,
    serviceDate: string,
    facilityCode: string,
    facilityName: string,
    careProviderNik: string,
    careProviderName: string,
    careProviderType: string,
    serviceNotes: string,
    icareScore: number,
    feedback: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate submission ID
      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const submissionCountResult = await getApi<{ count: number }[]>`
        SELECT COUNT(*) as count
        FROM bpjs_i_care_jkn_submissions
        WHERE created_at::date = CURRENT_DATE
      `;
      const submissionId = `ICARE-${dateStr}-${String(submissionCountResult[0].count + 1).padStart(4, '0')}`;
      
      const result = await getApi<ICareJKNSubmission[]>`
        INSERT INTO bpjs_i_care_jkn_submissions (
          submission_id,
          patient_id,
          patient_name,
          patient_no_kartu,
          service_type,
          service_date,
          facility_code,
          facility_name,
          care_provider_nik,
          care_provider_name,
          care_provider_type,
          service_notes,
          icare_score,
          feedback
        ) VALUES (
          ${submissionId},
          ${patientId},
          ${patientName},
          ${patientNoKartu},
          ${serviceType},
          ${serviceDate},
          ${facilityCode},
          ${facilityName},
          ${careProviderNik},
          ${careProviderName},
          ${careProviderType},
          ${serviceNotes},
          ${icareScore},
          ${feedback}
        ) RETURNING 
          id,
          submission_id,
          patient_id,
          patient_name,
          patient_no_kartu,
          service_type,
          service_date,
          facility_code,
          facility_name,
          care_provider_nik,
          care_provider_name,
          care_provider_type,
          service_notes,
          icare_score,
          feedback,
          status,
          submission_date,
          processed_date,
          created_at,
          updated_at
      `;
      
      setSubmissions([result[0], ...submissions]);
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim data iCare JKN BPJS');
      console.error('Error submitting iCare JKN:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (
    submissionId: string,
    status: 'draft' | 'submitted' | 'processed' | 'approved' | 'rejected',
    processedDate?: string,
    additionalFeedback?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      let updateFields = [`status = ${status}`];
      if (processedDate) updateFields.push(`processed_date = ${processedDate}`);
      if (additionalFeedback) updateFields.push(`feedback = feedback || E'\\n' || ${additionalFeedback}`);
      
      const result = await getApi<ICareJKNSubmission[]>`
        UPDATE bpjs_i_care_jkn_submissions
        SET ${updateFields.join(', ')}, updated_at = NOW()
        WHERE submission_id = ${submissionId}
        RETURNING 
          id,
          submission_id,
          patient_id,
          patient_name,
          patient_no_kartu,
          service_type,
          service_date,
          facility_code,
          facility_name,
          care_provider_nik,
          care_provider_name,
          care_provider_type,
          service_notes,
          icare_score,
          feedback,
          status,
          submission_date,
          processed_date,
          created_at,
          updated_at
      `;
      
      setSubmissions(submissions.map(s => s.submission_id === submissionId ? result[0] : s));
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui status data iCare JKN');
      console.error('Error updating iCare JKN status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSubmissionById = (submissionId: string) => {
    return submissions.find(s => s.submission_id === submissionId);
  };

  const getICareJKNSummary = async (month: number, year: number): Promise<ICareJKNSummary> => {
    try {
      const result = await getApi<ICareJKNSummary[]>`
        SELECT 
          EXTRACT(MONTH FROM created_at)::INTEGER as month,
          EXTRACT(YEAR FROM created_at)::INTEGER as year,
          COUNT(*) as total_submissions,
          AVG(icare_score) as avg_icare_score,
          COUNT(CASE WHEN icare_score >= 4 THEN 1 END) as total_positive_feedback,
          COUNT(CASE WHEN icare_score < 4 THEN 1 END) as total_negative_feedback
        FROM bpjs_i_care_jkn_submissions
        WHERE EXTRACT(MONTH FROM created_at) = ${month} AND EXTRACT(YEAR FROM created_at) = ${year}
        GROUP BY EXTRACT(MONTH FROM created_at), EXTRACT(YEAR FROM created_at)
      `;
      
      if (result.length === 0) {
        return {
          month: month.toString(),
          year,
          total_submissions: 0,
          avg_icare_score: 0,
          total_positive_feedback: 0,
          total_negative_feedback: 0
        };
      }
      
      return {
        ...result[0],
        avg_icare_score: parseFloat(result[0].avg_icare_score.toFixed(2))
      };
    } catch (err: any) {
      setError(err.message || 'Gagal mendapatkan ringkasan iCare JKN');
      console.error('Error getting iCare JKN summary:', err);
      throw err;
    }
  };

  const getTopRatedServices = async (limit: number = 10) => {
    try {
      const result = await getApi<ICareJKNSubmission[]>`
        SELECT 
          id,
          submission_id,
          patient_id,
          patient_name,
          patient_no_kartu,
          service_type,
          service_date,
          facility_name,
          care_provider_name,
          icare_score,
          feedback,
          created_at
        FROM bpjs_i_care_jkn_submissions
        WHERE status = 'approved'
        ORDER BY icare_score DESC, created_at DESC
        LIMIT ${limit}
      `;
      
      return result;
    } catch (err: any) {
      setError(err.message || 'Gagal mendapatkan layanan dengan rating tertinggi');
      console.error('Error getting top rated services:', err);
      throw err;
    }
  };

  const getLowRatedServices = async (limit: number = 10) => {
    try {
      const result = await getApi<ICareJKNSubmission[]>`
        SELECT 
          id,
          submission_id,
          patient_id,
          patient_name,
          patient_no_kartu,
          service_type,
          service_date,
          facility_name,
          care_provider_name,
          icare_score,
          feedback,
          created_at
        FROM bpjs_i_care_jkn_submissions
        WHERE status = 'approved'
        ORDER BY icare_score ASC, created_at DESC
        LIMIT ${limit}
      `;
      
      return result;
    } catch (err: any) {
      setError(err.message || 'Gagal mendapatkan layanan dengan rating terendah');
      console.error('Error getting low rated services:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const refreshSubmissions = () => {
    setLoading(true);
    fetchSubmissions();
  };

  return {
    submissions,
    loading,
    error,
    fetchSubmissions,
    submitICare,
    updateSubmissionStatus,
    getSubmissionById,
    getICareJKNSummary,
    getTopRatedServices,
    getLowRatedServices,
    refreshSubmissions
  };
};

export default useBPJSiCareJKN;