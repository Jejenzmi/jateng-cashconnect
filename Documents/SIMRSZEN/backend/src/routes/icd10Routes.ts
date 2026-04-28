import express from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Endpoint untuk mencari kode ICD-10
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search } = req.query;
    
    if (!search || typeof search !== 'string') {
      return res.status(400).json({ error: 'Parameter search diperlukan' });
    }
    
    // Data dummy ICD-10 - dalam implementasi nyata, ini akan terhubung ke database ICD-10 resmi
    const icd10Codes = [
      { kode: 'A00', nama: 'Kolera' },
      { kode: 'A01', nama: 'Tipes dan paratifus' },
      { kode: 'I20', nama: 'Angina pektoris' },
      { kode: 'I21', nama: 'Infark miokard akut' },
      { kode: 'J44', nama: 'Penyakit paru obstruktif kronik' },
      { kode: 'E11', nama: 'Diabetes mellitus tipe 2' },
      { kode: 'F32', nama: 'Gangguan depresi' },
      { kode: 'K25', nama: 'Tukak lambung' },
      { kode: 'M54', nama: 'Nyeri pinggang dan tulang belakang lainnya' },
      { kode: 'N39', nama: 'Infeksi saluran kemih lainnya' },
      { kode: 'J06', nama: 'Infeksi saluran pernapasan atas' },
      { kode: 'E78', nama: 'Dislipidemia' },
      { kode: 'I10', nama: 'Hipertensi esensial' },
      { kode: 'J00', nama: 'Rinitis akut' },
      { kode: 'R51', nama: 'Sakit kepala' },
      { kode: 'R10', nama: 'Nyeri abdomen' },
      { kode: 'Z51', nama: 'Pertemuan untuk perawatan lainnya' },
      { kode: 'Z00', nama: 'Pemeriksaan umum' },
      { kode: 'Z01', nama: 'Pemeriksaan khusus' },
      { kode: 'Z09', nama: 'Kontrol setelah perawatan' },
    ];

    // Filter berdasarkan pencarian
    const filteredCodes = icd10Codes.filter(
      (code) =>
        code.kode.toLowerCase().includes(search.toLowerCase()) ||
        code.nama.toLowerCase().includes(search.toLowerCase())
    );

    res.json(filteredCodes);
  } catch (error) {
    console.error('Error fetching ICD-10 codes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;