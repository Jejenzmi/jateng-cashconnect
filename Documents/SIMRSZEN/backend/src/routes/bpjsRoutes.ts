import express from 'express';
import { BpjsController } from '../controllers/bpjsController';

const router = express.Router();

// Route untuk mengatur kredensial
router.post('/credentials', BpjsController.setCredentials);

// Route untuk mengatur konfigurasi API
router.put('/config', BpjsController.setApiConfig);

// Route untuk VClaim
router.get('/vclaim/peserta/kartu/:noKartu/:tglSEP?', BpjsController.getVClaimParticipantByNoKartu);
router.get('/vclaim/peserta/nik/:nik/:tglSEP?', BpjsController.getVClaimParticipantByNIK);

// Route untuk VClaim 2.0
router.post('/vclaim2/sep/1.1/insert', BpjsController.insertSEP);
router.post('/vclaim2/sep/1.1/update', BpjsController.updateSEP);
router.post('/vclaim2/sep/1.1/delete', BpjsController.deleteSEP);
router.get('/vclaim2/sep/:noSEP', BpjsController.getSEP);
router.get('/vclaim2/sep/lastsep/norujukan/:noRujukan', BpjsController.getLastSEPByNoRujukan);
router.post('/vclaim2/sep/2.0/insert', BpjsController.insertSEP2);
router.post('/vclaim2/sep/2.0/update', BpjsController.updateSEP2);
router.post('/vclaim2/sep/2.0/delete', BpjsController.deleteSEP2);
router.post('/vclaim2/sep/updtglplg', BpjsController.updateTanggalPulang);
router.post('/vclaim2/sep/pengajuan', BpjsController.pengajuanSEP);
router.post('/vclaim2/sep/approve', BpjsController.approveSEP);
router.get('/vclaim2/sep/cbg/:noSep', BpjsController.getSEPForInacbg);
router.get('/vclaim2/sep/internal/:noSep', BpjsController.getSEPInternal);
router.post('/vclaim2/sep/internal/delete', BpjsController.deleteSEPInternal);
router.get('/vclaim2/sep/persetujuanSEP/list/bulan/:bulan/tahun/:tahun', BpjsController.getListPersetujuanSEP);
router.get('/vclaim2/sep/updtglplg/list/bulan/:bulan/tahun/:tahun/:filter', BpjsController.getListUpdateTanggalPulang);
router.post('/vclaim2/sep/2.0/updtglplg', BpjsController.updateTanggalPulang2);
router.get('/vclaim2/sep/fingerprint/peserta/:noKartu/tglPelayanan/:tglPelayanan', BpjsController.getFingerprintStatus);
router.get('/vclaim2/sep/fingerprint/list/tglPelayanan/:tglPelayanan', BpjsController.getListFingerprint);
router.get('/vclaim2/sep/fingerprint/randomquestion/:noKartu/tglSep/:tglSep', BpjsController.getRandomQuestion);
router.post('/vclaim2/sep/fingerprint/randomanswer', BpjsController.submitRandomAnswer);
router.get('/vclaim2/sep/kllinduk/list/:noKartu', BpjsController.getDataIndukKecelakaan);
router.get('/vclaim2/suplesi/:noKartu/:tglPelayanan', BpjsController.getSuplesi);

// Route untuk Rujukan
router.post('/vclaim2/rujukan/insert', BpjsController.insertRujukan2);
router.post('/vclaim2/rujukan/update', BpjsController.updateRujukan2);
router.post('/vclaim2/rujukan/delete', BpjsController.deleteRujukan);
router.get('/vclaim2/rujukan/spesialistik/:ppkRujukan/:tglRujukan', BpjsController.getListSpesialistikRujukan);
router.get('/vclaim2/rujukan/sarana/:ppkRujukan', BpjsController.getListSaranaRujukan);
router.get('/vclaim2/rujukan/list/:tglMulai/:tglAkhir', BpjsController.getListRujukanKeluar);
router.get('/vclaim2/rujukan/:noRujukan', BpjsController.getRujukanKeluar);
router.get('/vclaim2/rujukan/jumlah-sep/:jnsRujukan/:noRujukan', BpjsController.getJumlahSEPRujukan);
router.post('/vclaim2/rujukan/khusus/insert', BpjsController.perpanjangRujukanKhusus);
router.post('/vclaim2/rujukan/khusus/delete', BpjsController.deletePerpanjanganRujukanKhusus);
router.get('/vclaim2/rujukan/khusus/list/:bulan/:tahun', BpjsController.getListPerpanjanganRujukanKhusus);

// Route untuk Rencana Kontrol/SPRI
router.post('/vclaim2/kontrol/insert', BpjsController.insertRencanaKontrol);
router.post('/vclaim2/kontrol/update', BpjsController.updateRencanaKontrol);
router.post('/vclaim2/kontrol/delete', BpjsController.deleteRencanaKontrol);
router.get('/vclaim2/kontrol/jadwal-spesialistik/:jnsKontrol/:nomor/:tglRencanaKontrol', BpjsController.getListSpesialistikRencanaKontrol);
router.get('/vclaim2/kontrol/jadwal-dokter/:jnsKontrol/:kdPoli/:tglRencanaKontrol', BpjsController.getJadwalDokterRencanaKontrol);
router.get('/vclaim2/kontrol/list-sep/:tglAwal/:tglAkhir/:filter', BpjsController.getListRencanaKontrol);
router.get('/vclaim2/kontrol/:noSuratKontrol', BpjsController.getSuratKontrolByNoSuratKontrol);
router.post('/vclaim2/spri/insert', BpjsController.insertSPRI);
router.post('/vclaim2/spri/update', BpjsController.updateSPRI);

// Route untuk Rencana Kontrol/SPRI v2
router.post('/vclaim2/kontrol/v2/insert', BpjsController.insertRencanaKontrolV2);
router.post('/vclaim2/kontrol/v2/update', BpjsController.updateRencanaKontrolV2);
router.get('/vclaim2/kontrol/sepnosep/:noSep', BpjsController.getSEPForRencanaKontrol);
router.get('/vclaim2/kontrol/list-by-nokartu/:bulan/:tahun/:noKartu/:filter', BpjsController.getListRencanaKontrolByNoKartu);

// Route untuk PRB (Program Rujuk Balik)
router.post('/prb/insert', BpjsController.insertPRB);
router.put('/prb/update', BpjsController.updatePRB);
router.delete('/prb/delete', BpjsController.deletePRB);
router.get('/prb/srb/:noSrb/nosep/:noSep', BpjsController.getPRBByNoSrbAndSep);
router.get('/prb/date/:tglMulai/:tglAkhir', BpjsController.getPRBByDateRange);
router.get('/prb/potensi/:tahun/:bulan', BpjsController.getPRBPotensiSummary);

// Route untuk referensi VClaim 2.0
router.get('/vclaim2/ref/diagnosa/:param', BpjsController.getDiagnosaRef);
router.get('/vclaim2/ref/poli/:param', BpjsController.getPoliRef);
router.get('/vclaim2/ref/dokter/:param', BpjsController.getDokterRef);
router.get('/vclaim2/ref/faskes/:param1/:param2', BpjsController.getFaskesRef);
router.get('/vclaim2/ref/procedure/:param', BpjsController.getProcedureRef);
router.get('/vclaim2/ref/kelasrawat', BpjsController.getKelasRawatRef);
router.get('/vclaim2/ref/ruangrawat', BpjsController.getRuangRawatRef);
router.get('/vclaim2/ref/spesialistik', BpjsController.getSpesialistikRef);
router.get('/vclaim2/ref/carakeluar', BpjsController.getCaraKeluarRef);
router.get('/vclaim2/ref/pascapulang', BpjsController.getPascaPulangRef);
router.get('/vclaim2/ref/propinsi', BpjsController.getPropinsiRef);
router.get('/vclaim2/ref/kabupaten/:propinsiId', BpjsController.getKabupatenRef);
router.get('/vclaim2/ref/kecamatan/:kabupatenId', BpjsController.getKecamatanRef);
router.get('/vclaim2/ref/dpjp/:pelayanan/:tglPelayanan/:spesialis', BpjsController.getDpjpRef);
router.get('/vclaim2/ref/diagnosaprb', BpjsController.getDiagnosaPrbRef);
router.get('/vclaim2/ref/obatprb/:param', BpjsController.getObatPrbRef);

// Route untuk monitoring
router.get('/monitoring/kunjungan/:tanggal/:jnsPelayanan', BpjsController.getDataKunjungan);
router.get('/monitoring/klaim/:tanggal/:jnsPelayanan/:status', BpjsController.getDataKlaim);
router.get('/monitoring/histori/:noKartu/:tglMulai/:tglAkhir', BpjsController.getHistoriPelayananPeserta);
router.get('/monitoring/jasaraharja/:jnsPelayanan/:tglMulai/:tglAkhir', BpjsController.getDataKlaimJasaRaharja);

// Route untuk Antrean RS
router.get('/antrean/rs/ref/poli', BpjsController.getAntreanPoliRef);
router.get('/antrean/rs/ref/dokter', BpjsController.getAntreanDokterRef);
router.get('/antrean/rs/ref/jadwaldokter/:kodePoli/:tanggal', BpjsController.getAntreanJadwalDokterRef);
router.get('/antrean/rs/ref/poli/fp', BpjsController.getAntreanPoliFpRef);
router.get('/antrean/rs/ref/pasien/fp/identitas/:nik/noidentitas/:noka', BpjsController.getAntreanPasienFpRef);
router.post('/antrean/rs/jadwaldokter/update', BpjsController.updateJadwalDokterAntrean);
router.post('/antrean/rs/add', BpjsController.addAntrean);
router.post('/antrean/rs/farmasi/add', BpjsController.addAntreanFarmasi);
router.post('/antrean/rs/updatewaktu', BpjsController.updateWaktuAntrean);
router.post('/antrean/rs/batal', BpjsController.batalAntrean);
router.post('/antrean/rs/getlisttask/:kodeBooking', BpjsController.getListTaskAntrean);
router.get('/antrean/rs/dashboard/waktutunggu/tanggal/:tanggal/waktu/:waktu', BpjsController.getDashboardAntreanPerTanggal);
router.get('/antrean/rs/dashboard/waktutunggu/bulan/:bulan/tahun/:tahun/waktu/:waktu', BpjsController.getDashboardAntreanPerBulan);
router.get('/antrean/rs/pendaftaran/tanggal/:tanggal', BpjsController.getAntreanPerTanggal);
router.get('/antrean/rs/pendaftaran/kodebooking/:kodeBooking', BpjsController.getAntreanPerKodeBooking);
router.get('/antrean/rs/pendaftaran/aktif', BpjsController.getAntreanAktif);
router.get('/antrean/rs/pendaftaran/kodepoli/:kodePoli/kodedokter/:kodeDokter/hari/:hari/jampraktek/:jamPraktek', BpjsController.getAntreanAktifPerPoliDokterHariJam);

// Route untuk Apotek
router.get('/apotek/ref/dpho', BpjsController.getReferensiDPHO);
router.get('/apotek/ref/poli/:param', BpjsController.getReferensiPoliApotek);
router.get('/apotek/ref/faskes/:param1/:param2', BpjsController.getReferensiFaskesApotek);
router.get('/apotek/ref/settingppk/read/:param', BpjsController.getSettingApotek);
router.get('/apotek/ref/spesialistik', BpjsController.getReferensiSpesialistikApotek);
router.get('/apotek/ref/obat/:param1/:param2/:param3', BpjsController.getReferensiObatApotek);
router.post('/apotek/obatnonracikan/v3/insert', BpjsController.simpanObatNonRacikan);
router.post('/apotek/obatracikan/v3/insert', BpjsController.simpanObatRacikan);
router.post('/apotek/updatestok', BpjsController.updateStokObat);
router.delete('/apotek/pelayanan/obat/hapus', BpjsController.hapusPelayananObat);
router.get('/apotek/obat/daftar/:noSep', BpjsController.daftarPelayananObat);
router.get('/apotek/riwayatobat/:tglAwal/:tglAkhir/:noKartu', BpjsController.riwayatPelayananObat);
router.post('/apotek/sjpresep/v3/insert', BpjsController.simpanResep);
router.delete('/apotek/hapusresep', BpjsController.hapusResep);
router.post('/apotek/daftarresep', BpjsController.daftarResep);
router.get('/apotek/sep/:noSep', BpjsController.cariSEP);
router.get('/apotek/monitoring/klaim/:bulan/:tahun/:jenisObat/:status', BpjsController.getDataKlaimApotek);
router.get('/apotek/prb/rekappeserta/tahun/:tahun/bulan/:bulan', BpjsController.getRekapPesertaPRB);

// Route untuk PCare
router.get('/pcare/diagnosa/:param/:row/:limit', BpjsController.getDiagnosaPCare);
router.get('/pcare/dokter/:row/:limit', BpjsController.getDokterPCare);
router.get('/pcare/kelompok/club/:kdJenisKelompok', BpjsController.getClubProlanisPCare);
router.get('/pcare/kelompok/kegiatan/:bulan', BpjsController.getKegiatanKelompokPCare);
router.get('/pcare/kelompok/peserta/:eduId', BpjsController.getPesertaKegiatanKelompokPCare);
router.post('/pcare/kelompok/kegiatan', BpjsController.addKegiatanKelompokPCare);
router.post('/pcare/kelompok/peserta', BpjsController.addPesertaKegiatanKelompokPCare);
router.delete('/pcare/kelompok/kegiatan/:eduId', BpjsController.deleteKegiatanKelompokPCare);
router.delete('/pcare/kelompok/peserta/:eduId/:noKartu', BpjsController.deletePesertaKegiatanKelompokPCare);
router.get('/pcare/kesadaran', BpjsController.getKesadaranPCare);
router.get('/pcare/kunjungan/rujukan/:noKunjungan', BpjsController.getRujukanPCare);
router.get('/pcare/kunjungan/peserta/:noKartu', BpjsController.getRiwayatKunjunganPCare);
router.post('/pcare/kunjungan', BpjsController.addKunjunganPCare);
router.put('/pcare/kunjungan', BpjsController.editKunjunganPCare);
router.delete('/pcare/kunjungan/:noKunjungan', BpjsController.deleteKunjunganPCare);

// Route untuk Apotek
router.get('/apotek/resep/:kodeBooking', BpjsController.getApotekResep);

// Route untuk iCare
router.get('/icare/nik/:nik', BpjsController.getICareData);

// Route untuk Aplicares - Ketersediaan Kamar
router.get('/aplicares/ref/kelas', BpjsController.getBedClassReference);
router.post('/aplicares/bed/update/:kodeppk', BpjsController.updateBedAvailability);
router.post('/aplicares/bed/create/:kodeppk', BpjsController.createNewRoom);
router.get('/aplicares/bed/read/:kodeppk/:start/:limit', BpjsController.getBedAvailability);
router.post('/aplicares/bed/delete/:kodeppk', BpjsController.deleteRoom);

// Route untuk data master
router.get('/poli', BpjsController.getPoliList);
router.get('/dokter', BpjsController.getDokterList);

export default router;