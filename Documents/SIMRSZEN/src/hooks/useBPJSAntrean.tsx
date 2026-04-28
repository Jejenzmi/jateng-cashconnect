import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useState, useEffect } from 'react';
interface BPJSQueue {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_birthday: string;
  patient_gender: string;
  patient_no_kartu: string;
  poli_code: string;
  poli_desc: string;
  dokter_code: string;
  dokter_desc: string;
  tanggal_periksa: string;
  no_antrean: string;
  estimasi_selesai: string;
  waktu_mulai_layanan: string;
  waktu_selesai_layanan: string;
  created_at: string;
}

interface QueueStatus {
  current_number: number;
  total_queue: number;
  estimated_wait_time: number; // in minutes
}

const useBPJSAntrean = () => {
  const [queues, setQueues] = useState<BPJSQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueues = async (tanggal: string, poliCode?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = `
        SELECT 
          id,
          patient_id,
          patient_name,
          patient_birthday,
          patient_gender,
          patient_no_kartu,
          poli_code,
          poli_desc,
          dokter_code,
          dokter_desc,
          tanggal_periksa,
          no_antrean,
          estimasi_selesai,
          waktu_mulai_layanan,
          waktu_selesai_layanan,
          created_at
        FROM bpjs_queues
        WHERE tanggal_periksa = ${tanggal}
      `;
      
      if (poliCode) {
        query += ` AND poli_code = ${poliCode}`;
      }
      
      query += ` ORDER BY no_antrean ASC`;
      
      const result = await getApi<BPJSQueue[]>(query);
      setQueues(result);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat antrean BPJS');
      console.error('Error fetching BPJS queues:', err);
    } finally {
      setLoading(false);
    }
  };

  const createQueue = async (
    patientId: string,
    patientName: string,
    patientBirthday: string,
    patientGender: string,
    patientNoKartu: string,
    poliCode: string,
    poliDesc: string,
    dokterCode: string,
    dokterDesc: string,
    tanggalPeriksa: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate queue number
      const dateStr = new Date(tanggalPeriksa).toISOString().split('T')[0];
      const queueNumberResult = await getApi<{ next_queue: number }[]>`
        SELECT COALESCE(MAX(CAST(SUBSTRING(no_antrean, POSITION('.' IN no_antrean) + 1) AS INTEGER)), 0) + 1 as next_queue
        FROM bpjs_queues 
        WHERE tanggal_periksa = ${dateStr} AND poli_code = ${poliCode}
      `;
      
      const queueNumber = `${poliCode.substring(0, 3).toUpperCase()}.${String(queueNumberResult[0].next_queue).padStart(3, '0')}`;
      
      const result = await getApi<BPJSQueue[]>`
        INSERT INTO bpjs_queues (
          patient_id,
          patient_name,
          patient_birthday,
          patient_gender,
          patient_no_kartu,
          poli_code,
          poli_desc,
          dokter_code,
          dokter_desc,
          tanggal_periksa,
          no_antrean,
          created_at
        ) VALUES (
          ${patientId},
          ${patientName},
          ${patientBirthday},
          ${patientGender},
          ${patientNoKartu},
          ${poliCode},
          ${poliDesc},
          ${dokterCode},
          ${dokterDesc},
          ${tanggalPeriksa},
          ${queueNumber},
          NOW()
        ) RETURNING 
          id,
          patient_id,
          patient_name,
          patient_birthday,
          patient_gender,
          patient_no_kartu,
          poli_code,
          poli_desc,
          dokter_code,
          dokter_desc,
          tanggal_periksa,
          no_antrean,
          estimasi_selesai,
          waktu_mulai_layanan,
          waktu_selesai_layanan,
          created_at
      `;
      
      setQueues([...queues, result[0]]);
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal membuat antrean BPJS');
      console.error('Error creating BPJS queue:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQueueStatus = async (
    queueId: string,
    waktuMulaiLayanan?: string,
    waktuSelesaiLayanan?: string,
    estimasiSelesai?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      let updateFields = [];
      if (waktuMulaiLayanan) updateFields.push(`waktu_mulai_layanan = ${waktuMulaiLayanan}`);
      if (waktuSelesaiLayanan) updateFields.push(`waktu_selesai_layanan = ${waktuSelesaiLayanan}`);
      if (estimasiSelesai) updateFields.push(`estimasi_selesai = ${estimasiSelesai}`);
      
      if (updateFields.length === 0) {
        throw new Error('Tidak ada data untuk diperbarui');
      }
      
      const result = await getApi<BPJSQueue[]>`
        UPDATE bpjs_queues
        SET ${updateFields.join(', ')}
        WHERE id = ${queueId}
        RETURNING 
          id,
          patient_id,
          patient_name,
          patient_birthday,
          patient_gender,
          patient_no_kartu,
          poli_code,
          poli_desc,
          dokter_code,
          dokter_desc,
          tanggal_periksa,
          no_antrean,
          estimasi_selesai,
          waktu_mulai_layanan,
          waktu_selesai_layanan,
          created_at
      `;
      
      setQueues(queues.map(q => q.id === queueId ? result[0] : q));
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui status antrean BPJS');
      console.error('Error updating queue status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getQueueStatus = async (poliCode: string, tanggal: string): Promise<QueueStatus> => {
    try {
      // Get current queue status for a specific poli
      const result = await getApi<QueueStatus[]>`
        SELECT 
          COALESCE(MAX(CAST(SUBSTRING(no_antrean, POSITION('.' IN no_antrean) + 1) AS INTEGER)), 0) as current_number,
          COUNT(*) as total_queue,
          COUNT(*) * 10 as estimated_wait_time
        FROM bpjs_queues 
        WHERE tanggal_periksa = ${tanggal} AND poli_code = ${poliCode}
      `;
      
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal mendapatkan status antrean');
      console.error('Error getting queue status:', err);
      throw err;
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    fetchQueues(today);
  }, []);

  return {
    queues,
    loading,
    error,
    fetchQueues,
    createQueue,
    updateQueueStatus,
    getQueueStatus
  };
};

export default useBPJSAntrean;