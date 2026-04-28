import { Request, Response } from 'express';
import { SatuSehatMasterDataService } from '../services/satusehatMasterDataService';

export class SatuSehatMasterDataController {
  /**
   * Menyinkronkan data provinsi dari Satu Sehat
   */
  static async syncProvinces(req: Request, res: Response): Promise<void> {
    try {
      const result = await SatuSehatMasterDataService.syncProvinces();
      
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Data provinsi berhasil disinkronkan dari Satu Sehat',
          data: null
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Gagal menyinkronkan data provinsi dari Satu Sehat',
          data: null
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Menyinkronkan data kota dari Satu Sehat
   */
  static async syncCities(req: Request, res: Response): Promise<void> {
    try {
      const { provinceCode } = req.query;
      const result = await SatuSehatMasterDataService.syncCities(provinceCode as string);
      
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Data kota berhasil disinkronkan dari Satu Sehat',
          data: null
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Gagal menyinkronkan data kota dari Satu Sehat',
          data: null
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Menyinkronkan data kecamatan dari Satu Sehat
   */
  static async syncDistricts(req: Request, res: Response): Promise<void> {
    try {
      const { cityCode } = req.query;
      const result = await SatuSehatMasterDataService.syncDistricts(cityCode as string);
      
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Data kecamatan berhasil disinkronkan dari Satu Sehat',
          data: null
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Gagal menyinkronkan data kecamatan dari Satu Sehat',
          data: null
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Menyinkronkan data desa dari Satu Sehat
   */
  static async syncVillages(req: Request, res: Response): Promise<void> {
    try {
      const { districtCode } = req.query;
      const result = await SatuSehatMasterDataService.syncVillages(districtCode as string);
      
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Data desa berhasil disinkronkan dari Satu Sehat',
          data: null
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Gagal menyinkronkan data desa dari Satu Sehat',
          data: null
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Menyinkronkan data praktisi dari Satu Sehat
   */
  static async syncPractitioners(req: Request, res: Response): Promise<void> {
    try {
      const result = await SatuSehatMasterDataService.syncPractitioners();
      
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Data praktisi berhasil disinkronkan dari Satu Sehat',
          data: null
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Gagal menyinkronkan data praktisi dari Satu Sehat',
          data: null
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Menyinkronkan data KFA dari Satu Sehat
   */
  static async syncKFA(req: Request, res: Response): Promise<void> {
    try {
      const result = await SatuSehatMasterDataService.syncKFA();
      
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Data KFA berhasil disinkronkan dari Satu Sehat',
          data: null
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Gagal menyinkronkan data KFA dari Satu Sehat',
          data: null
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Menyinkronkan data KPTL dari Satu Sehat
   */
  static async syncKPTL(req: Request, res: Response): Promise<void> {
    try {
      const result = await SatuSehatMasterDataService.syncKPTL();
      
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Data KPTL berhasil disinkronkan dari Satu Sehat',
          data: null
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Gagal menyinkronkan data KPTL dari Satu Sehat',
          data: null
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Mendapatkan data provinsi
   */
  static async getProvinces(req: Request, res: Response): Promise<void> {
    try {
      const provinces = await SatuSehatMasterDataService.getProvinces();
      
      res.status(200).json({
        success: true,
        message: 'Data provinsi berhasil diambil',
        data: provinces
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Mendapatkan data kota berdasarkan provinsi
   */
  static async getCitiesByProvince(req: Request, res: Response): Promise<void> {
    try {
      const { provinceCode } = req.params;
      const cities = await SatuSehatMasterDataService.getCitiesByProvince(provinceCode);
      
      res.status(200).json({
        success: true,
        message: 'Data kota berhasil diambil',
        data: cities
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Mendapatkan data kecamatan berdasarkan kota
   */
  static async getDistrictsByCity(req: Request, res: Response): Promise<void> {
    try {
      const { cityCode } = req.params;
      const districts = await SatuSehatMasterDataService.getDistrictsByCity(cityCode);
      
      res.status(200).json({
        success: true,
        message: 'Data kecamatan berhasil diambil',
        data: districts
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Mendapatkan data desa berdasarkan kecamatan
   */
  static async getVillagesByDistrict(req: Request, res: Response): Promise<void> {
    try {
      const { districtCode } = req.params;
      const villages = await SatuSehatMasterDataService.getVillagesByDistrict(districtCode);
      
      res.status(200).json({
        success: true,
        message: 'Data desa berhasil diambil',
        data: villages
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Mendapatkan data praktisi
   */
  static async getPractitioners(req: Request, res: Response): Promise<void> {
    try {
      const practitioners = await SatuSehatMasterDataService.getPractitioners();
      
      res.status(200).json({
        success: true,
        message: 'Data praktisi berhasil diambil',
        data: practitioners
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Mendapatkan data KFA
   */
  static async getKFAComponents(req: Request, res: Response): Promise<void> {
    try {
      const kfaComponents = await SatuSehatMasterDataService.getKFAComponents();
      
      res.status(200).json({
        success: true,
        message: 'Data KFA berhasil diambil',
        data: kfaComponents
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Mendapatkan data KPTL
   */
  static async getKPTLProducts(req: Request, res: Response): Promise<void> {
    try {
      const kptlProducts = await SatuSehatMasterDataService.getKPTLProducts();
      
      res.status(200).json({
        success: true,
        message: 'Data KPTL berhasil diambil',
        data: kptlProducts
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }
}