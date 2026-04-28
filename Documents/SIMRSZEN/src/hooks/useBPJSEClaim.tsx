import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useState, useEffect } from 'react';
interface EClaimSubmission {
  id: string;
  claim_id: string;
  patient_id: string;
  patient_name: string;
  patient_no_kartu: string;
  treatment_start_date: string;
  treatment_end_date: string;
  diagnosis_code: string;
  diagnosis_name: string;
  procedure_code: string;
  procedure_name: string;
  claim_amount: number;
  status: 'draft' | 'submitted' | 'processed' | 'approved' | 'rejected';
  submission_date: string;
  processed_date: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface ClaimSummary {
  month: string;
  year: number;
  total_submissions: number;
  total_approved: number;
  total_rejected: number;
  total_amount: number;
  approved_amount: number;
}

const useBPJSEClaim = () => {
  const [claims, setClaims] = useState<EClaimSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClaims = async (status?: string, startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = `
        SELECT 
          id,
          claim_id,
          patient_id,
          patient_name,
          patient_no_kartu,
          treatment_start_date,
          treatment_end_date,
          diagnosis_code,
          diagnosis_name,
          procedure_code,
          procedure_name,
          claim_amount,
          status,
          submission_date,
          processed_date,
          notes,
          created_at,
          updated_at
        FROM bpjs_e_claims
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
      
      const result = await getApi<EClaimSubmission[]>(query);
      setClaims(result);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat klaim e-claim BPJS');
      console.error('Error fetching e-claim data:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitClaim = async (
    patientId: string,
    patientName: string,
    patientNoKartu: string,
    treatmentStartDate: string,
    treatmentEndDate: string,
    diagnosisCode: string,
    diagnosisName: string,
    procedureCode: string,
    procedureName: string,
    claimAmount: number,
    notes: string = ''
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate claim ID
      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const claimCountResult = await getApi<{ count: number }[]>`
        SELECT COUNT(*) as count
        FROM bpjs_e_claims
        WHERE created_at::date = CURRENT_DATE
      `;
      const claimId = `CLAIM-${dateStr}-${String(claimCountResult[0].count + 1).padStart(4, '0')}`;
      
      const result = await getApi<EClaimSubmission[]>`
        INSERT INTO bpjs_e_claims (
          claim_id,
          patient_id,
          patient_name,
          patient_no_kartu,
          treatment_start_date,
          treatment_end_date,
          diagnosis_code,
          diagnosis_name,
          procedure_code,
          procedure_name,
          claim_amount,
          status,
          notes
        ) VALUES (
          ${claimId},
          ${patientId},
          ${patientName},
          ${patientNoKartu},
          ${treatmentStartDate},
          ${treatmentEndDate},
          ${diagnosisCode},
          ${diagnosisName},
          ${procedureCode},
          ${procedureName},
          ${claimAmount},
          'submitted',
          ${notes}
        ) RETURNING 
          id,
          claim_id,
          patient_id,
          patient_name,
          patient_no_kartu,
          treatment_start_date,
          treatment_end_date,
          diagnosis_code,
          diagnosis_name,
          procedure_code,
          procedure_name,
          claim_amount,
          status,
          submission_date,
          processed_date,
          notes,
          created_at,
          updated_at
      `;
      
      setClaims([result[0], ...claims]);
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim klaim e-claim BPJS');
      console.error('Error submitting e-claim:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateClaimStatus = async (
    claimId: string,
    status: 'draft' | 'submitted' | 'processed' | 'approved' | 'rejected',
    processedDate?: string,
    notes?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      let updateFields = [`status = ${status}`];
      if (processedDate) updateFields.push(`processed_date = ${processedDate}`);
      if (notes) updateFields.push(`notes = ${notes}`);
      
      const result = await getApi<EClaimSubmission[]>`
        UPDATE bpjs_e_claims
        SET ${updateFields.join(', ')}, updated_at = NOW()
        WHERE claim_id = ${claimId}
        RETURNING 
          id,
          claim_id,
          patient_id,
          patient_name,
          patient_no_kartu,
          treatment_start_date,
          treatment_end_date,
          diagnosis_code,
          diagnosis_name,
          procedure_code,
          procedure_name,
          claim_amount,
          status,
          submission_date,
          processed_date,
          notes,
          created_at,
          updated_at
      `;
      
      setClaims(claims.map(c => c.claim_id === claimId ? result[0] : c));
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui status klaim e-claim');
      console.error('Error updating claim status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getClaimById = (claimId: string) => {
    return claims.find(c => c.claim_id === claimId);
  };

  const getClaimSummary = async (month: number, year: number): Promise<ClaimSummary> => {
    try {
      const result = await getApi<ClaimSummary[]>`
        SELECT 
          EXTRACT(MONTH FROM created_at)::INTEGER as month,
          EXTRACT(YEAR FROM created_at)::INTEGER as year,
          COUNT(*) as total_submissions,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) as total_approved,
          COUNT(CASE WHEN status = 'rejected' THEN 1 END) as total_rejected,
          SUM(claim_amount) as total_amount,
          SUM(CASE WHEN status = 'approved' THEN claim_amount ELSE 0 END) as approved_amount
        FROM bpjs_e_claims
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
          total_amount: 0,
          approved_amount: 0
        };
      }
      
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal mendapatkan ringkasan klaim');
      console.error('Error getting claim summary:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const refreshClaims = () => {
    setLoading(true);
    fetchClaims();
  };

  return {
    claims,
    loading,
    error,
    fetchClaims,
    submitClaim,
    updateClaimStatus,
    getClaimById,
    getClaimSummary,
    refreshClaims
  };
};

export default useBPJSEClaim;