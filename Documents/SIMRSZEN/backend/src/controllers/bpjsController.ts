import { Request, Response } from 'express';
import { BpjsService } from '../services/bpjsService'; // Changed import path to match actual file name

export class BpjsController {
  private static respondNotImplemented(res: Response, feature: string): void {
    res.status(501).json({
      success: false,
      message: `Endpoint belum diimplementasikan: ${feature}`
    });
  }

  // Set BPJS credentials
  static async setCredentials(req: Request, res: Response): Promise<void> {
    try {
      const { consumerId, consumerSecret, userName, password, kdAplikasi } = req.body;

      if (!consumerId || !consumerSecret || !userName || !password || !kdAplikasi) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields',
        });
        return;
      }

      await BpjsService.setCredentials(consumerId, consumerSecret, userName, password, kdAplikasi);
      
      res.status(200).json({
        success: true,
        message: 'Credentials set successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to set credentials',
      });
    }
  }

  // VClaim - Get participant by noKartu
  static async getVClaimParticipantByNoKartu(req: Request, res: Response): Promise<void> {
    try {
      const { noKartu, tglSEP } = req.params;
      const result = await BpjsService.getVClaimParticipantByNoKartu(noKartu, tglSEP);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get participant',
      });
    }
  }

  // VClaim - Get participant by NIK
  static async getVClaimParticipantByNIK(req: Request, res: Response): Promise<void> {
    try {
      const { nik, tglSEP } = req.params;
      const result = await BpjsService.getVClaimParticipantByNIK(nik, tglSEP);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get participant',
      });
    }
  }

  // VClaim - Insert SEP
  static async insertSEP(req: Request, res: Response): Promise<void> {
    try {
      const sepData = req.body;
      const result = await BpjsService.insertSEP(sepData);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to insert SEP',
      });
    }
  }

  // VClaim - Get SEP by noSEP
  static async getSEPByNoSEP(req: Request, res: Response): Promise<void> {
    try {
      const { noSEP } = req.params;
      const result = await BpjsService.getSEPByNoSEP(noSEP);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get SEP',
      });
    }
  }

  // VClaim - Get SEP for Inacbg
  static async getSEPForInacbg(req: Request, res: Response): Promise<void> {
    try {
      const { noSep } = req.params;
      const result = await BpjsService.getSEPForInacbg(noSep);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get SEP for Inacbg',
      });
    }
  }

  // ===== Legacy/placeholder endpoints referenced by routes =====

  static async setApiConfig(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'setApiConfig');
  }

  static async updateSEP(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'updateSEP');
  }

  static async deleteSEP(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'deleteSEP');
  }

  static async getSEP(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getSEP');
  }

  static async getLastSEPByNoRujukan(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getLastSEPByNoRujukan');
  }

  static async insertSEP2(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'insertSEP2');
  }

  static async updateSEP2(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'updateSEP2');
  }

  static async deleteSEP2(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'deleteSEP2');
  }

  static async updateTanggalPulang(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'updateTanggalPulang');
  }

  static async pengajuanSEP(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'pengajuanSEP');
  }

  static async approveSEP(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'approveSEP');
  }

  static async getSEPInternal(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getSEPInternal');
  }

  static async deleteSEPInternal(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'deleteSEPInternal');
  }

  static async getListPersetujuanSEP(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getListPersetujuanSEP');
  }

  static async getListUpdateTanggalPulang(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getListUpdateTanggalPulang');
  }

  static async updateTanggalPulang2(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'updateTanggalPulang2');
  }

  static async getFingerprintStatus(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getFingerprintStatus');
  }

  static async getListFingerprint(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getListFingerprint');
  }

  static async getRandomQuestion(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getRandomQuestion');
  }

  static async submitRandomAnswer(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'submitRandomAnswer');
  }

  static async getDataIndukKecelakaan(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getDataIndukKecelakaan');
  }

  static async getSuplesi(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getSuplesi');
  }

  static async insertRujukan2(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'insertRujukan2');
  }

  static async updateRujukan2(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'updateRujukan2');
  }

  static async deleteRujukan(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'deleteRujukan');
  }

  static async getListSpesialistikRujukan(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getListSpesialistikRujukan');
  }

  static async getListSaranaRujukan(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getListSaranaRujukan');
  }

  static async getListRujukanKeluar(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getListRujukanKeluar');
  }

  static async getRujukanKeluar(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getRujukanKeluar');
  }

  static async getJumlahSEPRujukan(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getJumlahSEPRujukan');
  }

  static async perpanjangRujukanKhusus(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'perpanjangRujukanKhusus');
  }

  static async deletePerpanjanganRujukanKhusus(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'deletePerpanjanganRujukanKhusus');
  }

  static async getListPerpanjanganRujukanKhusus(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getListPerpanjanganRujukanKhusus');
  }

  static async insertRencanaKontrol(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'insertRencanaKontrol');
  }

  static async updateRencanaKontrol(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'updateRencanaKontrol');
  }

  static async deleteRencanaKontrol(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'deleteRencanaKontrol');
  }

  static async getListSpesialistikRencanaKontrol(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getListSpesialistikRencanaKontrol');
  }

  static async getJadwalDokterRencanaKontrol(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getJadwalDokterRencanaKontrol');
  }

  static async getListRencanaKontrol(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getListRencanaKontrol');
  }

  static async getSuratKontrolByNoSuratKontrol(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getSuratKontrolByNoSuratKontrol');
  }

  static async insertSPRI(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'insertSPRI');
  }

  static async updateSPRI(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'updateSPRI');
  }

  static async insertRencanaKontrolV2(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'insertRencanaKontrolV2');
  }

  static async updateRencanaKontrolV2(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'updateRencanaKontrolV2');
  }

  static async getSEPForRencanaKontrol(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getSEPForRencanaKontrol');
  }

  static async getListRencanaKontrolByNoKartu(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getListRencanaKontrolByNoKartu');
  }

  static async insertPRB(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'insertPRB');
  }

  static async updatePRB(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'updatePRB');
  }

  static async deletePRB(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'deletePRB');
  }

  static async getPRBByNoSrbAndSep(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getPRBByNoSrbAndSep');
  }

  static async getPRBByDateRange(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getPRBByDateRange');
  }

  static async getPRBPotensiSummary(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getPRBPotensiSummary');
  }

  static async getDiagnosaRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getDiagnosaRef');
  }

  static async getPoliRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getPoliRef');
  }

  static async getDokterRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getDokterRef');
  }

  static async getFaskesRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getFaskesRef');
  }

  static async getProcedureRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getProcedureRef');
  }

  static async getKelasRawatRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getKelasRawatRef');
  }

  static async getRuangRawatRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getRuangRawatRef');
  }

  static async getSpesialistikRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getSpesialistikRef');
  }

  static async getCaraKeluarRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getCaraKeluarRef');
  }

  static async getPascaPulangRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getPascaPulangRef');
  }

  static async getPropinsiRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getPropinsiRef');
  }

  static async getKabupatenRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getKabupatenRef');
  }

  static async getKecamatanRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getKecamatanRef');
  }

  static async getDpjpRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getDpjpRef');
  }

  static async getDiagnosaPrbRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getDiagnosaPrbRef');
  }

  static async getObatPrbRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getObatPrbRef');
  }

  static async getDataKunjungan(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getDataKunjungan');
  }

  static async getDataKlaim(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getDataKlaim');
  }

  static async getHistoriPelayananPeserta(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getHistoriPelayananPeserta');
  }

  static async getDataKlaimJasaRaharja(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getDataKlaimJasaRaharja');
  }

  static async getAntreanPoliRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getAntreanPoliRef');
  }

  static async getAntreanDokterRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getAntreanDokterRef');
  }

  static async getAntreanJadwalDokterRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getAntreanJadwalDokterRef');
  }

  static async getAntreanPoliFpRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getAntreanPoliFpRef');
  }

  static async getAntreanPasienFpRef(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getAntreanPasienFpRef');
  }

  static async updateJadwalDokterAntrean(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'updateJadwalDokterAntrean');
  }

  static async addAntrean(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'addAntrean');
  }

  static async addAntreanFarmasi(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'addAntreanFarmasi');
  }

  static async updateWaktuAntrean(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'updateWaktuAntrean');
  }

  static async batalAntrean(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'batalAntrean');
  }

  static async getListTaskAntrean(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getListTaskAntrean');
  }

  static async getDashboardAntreanPerTanggal(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getDashboardAntreanPerTanggal');
  }

  static async getDashboardAntreanPerBulan(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getDashboardAntreanPerBulan');
  }

  static async getAntreanPerTanggal(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getAntreanPerTanggal');
  }

  static async getAntreanPerKodeBooking(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getAntreanPerKodeBooking');
  }

  static async getAntreanAktif(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getAntreanAktif');
  }

  static async getAntreanAktifPerPoliDokterHariJam(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getAntreanAktifPerPoliDokterHariJam');
  }

  static async getReferensiDPHO(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getReferensiDPHO');
  }

  static async getReferensiPoliApotek(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getReferensiPoliApotek');
  }

  static async getReferensiFaskesApotek(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getReferensiFaskesApotek');
  }

  static async getSettingApotek(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getSettingApotek');
  }

  static async getReferensiSpesialistikApotek(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getReferensiSpesialistikApotek');
  }

  static async getReferensiObatApotek(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getReferensiObatApotek');
  }

  static async simpanObatNonRacikan(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'simpanObatNonRacikan');
  }

  static async simpanObatRacikan(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'simpanObatRacikan');
  }

  static async updateStokObat(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'updateStokObat');
  }

  static async hapusPelayananObat(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'hapusPelayananObat');
  }

  static async daftarPelayananObat(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'daftarPelayananObat');
  }

  static async riwayatPelayananObat(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'riwayatPelayananObat');
  }

  static async simpanResep(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'simpanResep');
  }

  static async hapusResep(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'hapusResep');
  }

  static async daftarResep(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'daftarResep');
  }

  static async cariSEP(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'cariSEP');
  }

  static async getDataKlaimApotek(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getDataKlaimApotek');
  }

  static async getRekapPesertaPRB(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getRekapPesertaPRB');
  }

  static async getDiagnosaPCare(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getDiagnosaPCare');
  }

  static async getDokterPCare(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getDokterPCare');
  }

  static async getClubProlanisPCare(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getClubProlanisPCare');
  }

  static async getKegiatanKelompokPCare(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getKegiatanKelompokPCare');
  }

  static async getPesertaKegiatanKelompokPCare(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getPesertaKegiatanKelompokPCare');
  }

  static async addKegiatanKelompokPCare(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'addKegiatanKelompokPCare');
  }

  static async addPesertaKegiatanKelompokPCare(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'addPesertaKegiatanKelompokPCare');
  }

  static async deleteKegiatanKelompokPCare(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'deleteKegiatanKelompokPCare');
  }

  static async deletePesertaKegiatanKelompokPCare(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'deletePesertaKegiatanKelompokPCare');
  }

  static async getKesadaranPCare(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getKesadaranPCare');
  }

  static async getRujukanPCare(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getRujukanPCare');
  }

  static async getRiwayatKunjunganPCare(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getRiwayatKunjunganPCare');
  }

  static async addKunjunganPCare(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'addKunjunganPCare');
  }

  static async editKunjunganPCare(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'editKunjunganPCare');
  }

  static async deleteKunjunganPCare(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'deleteKunjunganPCare');
  }

  static async getApotekResep(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getApotekResep');
  }

  static async getICareData(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getICareData');
  }

  static async getBedClassReference(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getBedClassReference');
  }

  static async updateBedAvailability(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'updateBedAvailability');
  }

  static async createNewRoom(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'createNewRoom');
  }

  static async getBedAvailability(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getBedAvailability');
  }

  static async deleteRoom(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'deleteRoom');
  }

  static async getPoliList(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getPoliList');
  }

  static async getDokterList(_req: Request, res: Response): Promise<void> {
    BpjsController.respondNotImplemented(res, 'getDokterList');
  }
}