import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useState, useEffect } from 'react';
interface FKTPSubmission {
  id: string;
  submission_id: string;
  patient_id: string;
  patient_name: string;
  patient_no_kartu: string;
  faskes_code: string;
  faskes_name: string;
  pcare_code: string;
  pcare_name: string;
  visit_date: string;
  complaint: string;
  diagnosis_code: string;
  diagnosis_name: string;
  treatment_notes: string;
  referral_needed: boolean;
  referral_notes: string;
  status: 'draft' | 'submitted' | 'processed' | 'approved' | 'rejected';
  submission_date: string;
  processed_date: string;
  created_at: string;
  updated_at: string;
}

interface FKTPSummary {
  month: string;
  year: number;
  total_submissions: number;
  total_approved: number;
  total_rejected: number;
  total_referrals: number;
}

const useBPJSFKTP = () => {
  const [submissions, setSubmissions] = useState<FKTPSubmission[]>([]);
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
          faskes_code,
          faskes_name,
          pcare_code,
          pcare_name,
          visit_date,
          complaint,
          diagnosis_code,
          diagnosis_name,
          treatment_notes,
          referral_needed,
          referral_notes,
          status,
          submission_date,
          processed_date,
          created_at,
          updated_at
        FROM bpjs_fktp_submissions
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
      
      const result = await getApi<FKTPSubmission[]>(query);
      setSubmissions(result);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data FKTP BPJS');
      console.error('Error fetching FKTP data:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitFKTP = async (
    patientId: string,
    patientName: string,
    patientNoKartu: string,
    faskesCode: string,
    faskesName: string,
    pcareCode: string,
    pcareName: string,
    visitDate: string,
    complaint: string,
    diagnosisCode: string,
    diagnosisName: string,
    treatmentNotes: string,
    referralNeeded: boolean,
    referralNotes: string = ''
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate submission ID
      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const submissionCountResult = await getApi<{ count: number }[]>`
        SELECT COUNT(*) as count
        FROM bpjs_fktp_submissions
        WHERE created_at::date = CURRENT_DATE
      `;
      const submissionId = `FKTP-${dateStr}-${String(submissionCountResult[0].count + 1).padStart(4, '0')}`;
      
      const result = await getApi<FKTPSubmission[]>`
        INSERT INTO bpjs_fktp_submissions (
          submission_id,
          patient_id,
          patient_name,
          patient_no_kartu,
          faskes_code,
          faskes_name,
          pcare_code,
          pcare_name,
          visit_date,
          complaint,
          diagnosis_code,
          diagnosis_name,
          treatment_notes,
          referral_needed,
          referral_notes
        ) VALUES (
          ${submissionId},
          ${patientId},
          ${patientName},
          ${patientNoKartu},
          ${faskesCode},
          ${faskesName},
          ${pcareCode},
          ${pcareName},
          ${visitDate},
          ${complaint},
          ${diagnosisCode},
          ${diagnosisName},
          ${treatmentNotes},
          ${referralNeeded},
          ${referralNotes}
        ) RETURNING 
          id,
          submission_id,
          patient_id,
          patient_name,
          patient_no_kartu,
          faskes_code,
          faskes_name,
          pcare_code,
          pcare_name,
          visit_date,
          complaint,
          diagnosis_code,
          diagnosis_name,
          treatment_notes,
          referral_needed,
          referral_notes,
          status,
          submission_date,
          processed_date,
          created_at,
          updated_at
      `;
      
      setSubmissions([result[0], ...submissions]);
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim data FKTP BPJS');
      console.error('Error submitting FKTP:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (
    submissionId: string,
    status: 'draft' | 'submitted' | 'processed' | 'approved' | 'rejected',
    processedDate?: string,
    notes?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      let updateFields = [`status = ${status}`];
      if (processedDate) updateFields.push(`processed_date = ${processedDate}`);
      if (notes) updateFields.push(`treatment_notes = treatment_notes || E'\\n' || ${notes}`);
      
      const result = await getApi<FKTPSubmission[]>`
        UPDATE bpjs_fktp_submissions
        SET ${updateFields.join(', ')}, updated_at = NOW()
        WHERE submission_id = ${submissionId}
        RETURNING 
          id,
          submission_id,
          patient_id,
          patient_name,
          patient_no_kartu,
          faskes_code,
          faskes_name,
          pcare_code,
          pcare_name,
          visit_date,
          complaint,
          diagnosis_code,
          diagnosis_name,
          treatment_notes,
          referral_needed,
          referral_notes,
          status,
          submission_date,
          processed_date,
          created_at,
          updated_at
      `;
      
      setSubmissions(submissions.map(s => s.submission_id === submissionId ? result[0] : s));
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui status data FKTP');
      console.error('Error updating FKTP status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSubmissionById = (submissionId: string) => {
    return submissions.find(s => s.submission_id === submissionId);
  };

  const getFKTPSummary = async (month: number, year: number): Promise<FKTPSummary> => {
    try {
      const result = await getApi<FKTPSummary[]>`
        SELECT 
          EXTRACT(MONTH FROM created_at)::INTEGER as month,
          EXTRACT(YEAR FROM created_at)::INTEGER as year,
          COUNT(*) as total_submissions,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) as total_approved,
          COUNT(CASE WHEN status = 'rejected' THEN 1 END) as total_rejected,
          COUNT(CASE WHEN referral_needed = true THEN 1 END) as total_referrals
        FROM bpjs_fktp_submissions
        WHERE EXTRACT(MONTH FROM created_at) = ${month} AND EXTRACT(YEAR FROM created_at) = ${year}
        GROUP BY EXTRACT(MONTH FROM created_at), EXTRACT(YEAR FROM created_at)
      `;
      
      if (result.length === 0) {
        return {
          month: month.toString(),
          year,
          total_submissions: 0,
          total_approved: 0,
          total_rejected: 0,
          total_referrals: 0
        };
      }
      
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal mendapatkan ringkasan FKTP');
      console.error('Error getting FKTP summary:', err);
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
    submitFKTP,
    updateSubmissionStatus,
    getSubmissionById,
    getFKTPSummary,
    refreshSubmissions
  };
};

export default useBPJSFKTP;