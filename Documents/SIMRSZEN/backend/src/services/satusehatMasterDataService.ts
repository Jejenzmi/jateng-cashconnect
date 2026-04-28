import { PrismaClient } from '@prisma/client';
import { SatuSehatAuthService } from './satusehatAuthService';
import logger from '../utils/logger';

const prisma = new PrismaClient();
const authService = SatuSehatAuthService.getInstance();

export class SatuSehatMasterDataService {
  /**
   * Sinkronisasi data provinsi dari Satu Sehat
   */
  static async syncProvinces(): Promise<boolean> {
    try {
      const token = await authService.getToken();
      const config = await import('./satusehatConfigService').then(
        module => module.SatuSehatConfigService.getConfig()
      );
      
      if (!config) {
        throw new Error('Konfigurasi Satu Sehat belum disetel');
      }

      // Ambil data provinsi dari Satu Sehat
      const response = await fetch(`${config.baseUrl}/Location?_count=100&type=province`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json+fhir',
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal mengambil data provinsi: ${response.statusText}`);
      }

      const data = await response.json();
      const provinces = data.entry || [];

      // Hapus data lama
      await prisma.province.deleteMany({});

      // Simpan data baru
      for (const entry of provinces) {
        const location = entry.resource;
        const code = location.identifier?.find((id: any) => id.system === 'http://sys-ids.kemkes.go.id/location')?.value;
        
        if (code) {
          await prisma.province.upsert({
            where: { code },
            update: {
              name: location.name,
            },
            create: {
              code,
              name: location.name,
            },
          });
        }
      }

      logger.info(`Berhasil menyinkronkan ${provinces.length} provinsi dari Satu Sehat`);
      return true;
    } catch (error: any) {
      logger.error('Error menyinkronkan provinsi dari Satu Sehat:', error.message);
      throw new Error(`Gagal menyinkronkan provinsi dari Satu Sehat: ${error.message}`);
    }
  }

  /**
   * Sinkronisasi data kabupaten/kota dari Satu Sehat
   */
  static async syncCities(provinceCode?: string): Promise<boolean> {
    try {
      const token = await authService.getToken();
      const config = await import('./satusehatConfigService').then(
        module => module.SatuSehatConfigService.getConfig()
      );
      
      if (!config) {
        throw new Error('Konfigurasi Satu Sehat belum disetel');
      }

      let url = `${config.baseUrl}/Location?_count=100&type=regency`;
      if (provinceCode) {
        url += `&partof=${provinceCode}`;
      }

      // Ambil data kabupaten/kota dari Satu Sehat
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json+fhir',
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal mengambil data kota: ${response.statusText}`);
      }

      const data = await response.json();
      const cities = data.entry || [];

      // Hapus data kota yang sesuai jika provinceCode disediakan
      if (provinceCode) {
        await prisma.city.deleteMany({
          where: { province: { code: provinceCode } }
        });
      } else {
        await prisma.city.deleteMany({});
      }

      // Ambil provinsi untuk relasi
      const provinces = await prisma.province.findMany();
      const provinceMap: Record<string, string> = {};
      for (const prov of provinces) {
        provinceMap[prov.code] = prov.id;
      }

      // Simpan data baru
      for (const entry of cities) {
        const location = entry.resource;
        const code = location.identifier?.find((id: any) => id.system === 'http://sys-ids.kemkes.go.id/location')?.value;
        const partOfCode = location.partOf?.reference?.replace('Location/', '');
        
        if (code && partOfCode && provinceMap[partOfCode]) {
          await prisma.city.upsert({
            where: { code },
            update: {
              name: location.name,
              provinceId: provinceMap[partOfCode],
            },
            create: {
              code,
              name: location.name,
              provinceId: provinceMap[partOfCode],
            },
          });
        }
      }

      logger.info(`Berhasil menyinkronkan ${cities.length} kota dari Satu Sehat`);
      return true;
    } catch (error: any) {
      logger.error('Error menyinkronkan kota dari Satu Sehat:', error.message);
      throw new Error(`Gagal menyinkronkan kota dari Satu Sehat: ${error.message}`);
    }
  }

  /**
   * Sinkronisasi data kecamatan dari Satu Sehat
   */
  static async syncDistricts(cityCode?: string): Promise<boolean> {
    try {
      const token = await authService.getToken();
      const config = await import('./satusehatConfigService').then(
        module => module.SatuSehatConfigService.getConfig()
      );
      
      if (!config) {
        throw new Error('Konfigurasi Satu Sehat belum disetel');
      }

      let url = `${config.baseUrl}/Location?_count=100&type=district`;
      if (cityCode) {
        url += `&partof=${cityCode}`;
      }

      // Ambil data kecamatan dari Satu Sehat
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json+fhir',
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal mengambil data kecamatan: ${response.statusText}`);
      }

      const data = await response.json();
      const districts = data.entry || [];

      // Hapus data kecamatan yang sesuai jika cityCode disediakan
      if (cityCode) {
        await prisma.district.deleteMany({
          where: { city: { code: cityCode } }
        });
      } else {
        await prisma.district.deleteMany({});
      }

      // Ambil kota untuk relasi
      const cities = await prisma.city.findMany();
      const cityMap: Record<string, string> = {};
      for (const city of cities) {
        cityMap[city.code] = city.id;
      }

      // Simpan data baru
      for (const entry of districts) {
        const location = entry.resource;
        const code = location.identifier?.find((id: any) => id.system === 'http://sys-ids.kemkes.go.id/location')?.value;
        const partOfCode = location.partOf?.reference?.replace('Location/', '');
        
        if (code && partOfCode && cityMap[partOfCode]) {
          await prisma.district.upsert({
            where: { code },
            update: {
              name: location.name,
              cityId: cityMap[partOfCode],
            },
            create: {
              code,
              name: location.name,
              cityId: cityMap[partOfCode],
            },
          });
        }
      }

      logger.info(`Berhasil menyinkronkan ${districts.length} kecamatan dari Satu Sehat`);
      return true;
    } catch (error: any) {
      logger.error('Error menyinkronkan kecamatan dari Satu Sehat:', error.message);
      throw new Error(`Gagal menyinkronkan kecamatan dari Satu Sehat: ${error.message}`);
    }
  }

  /**
   * Sinkronisasi data desa dari Satu Sehat
   */
  static async syncVillages(districtCode?: string): Promise<boolean> {
    try {
      const token = await authService.getToken();
      const config = await import('./satusehatConfigService').then(
        module => module.SatuSehatConfigService.getConfig()
      );
      
      if (!config) {
        throw new Error('Konfigurasi Satu Sehat belum disetel');
      }

      let url = `${config.baseUrl}/Location?_count=100&type=village`;
      if (districtCode) {
        url += `&partof=${districtCode}`;
      }

      // Ambil data desa dari Satu Sehat
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json+fhir',
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal mengambil data desa: ${response.statusText}`);
      }

      const data = await response.json();
      const villages = data.entry || [];

      // Hapus data desa yang sesuai jika districtCode disediakan
      if (districtCode) {
        await prisma.village.deleteMany({
          where: { district: { code: districtCode } }
        });
      } else {
        await prisma.village.deleteMany({});
      }

      // Ambil kecamatan untuk relasi
      const districts = await prisma.district.findMany();
      const districtMap: Record<string, string> = {};
      for (const dist of districts) {
        districtMap[dist.code] = dist.id;
      }

      // Simpan data baru
      for (const entry of villages) {
        const location = entry.resource;
        const code = location.identifier?.find((id: any) => id.system === 'http://sys-ids.kemkes.go.id/location')?.value;
        const partOfCode = location.partOf?.reference?.replace('Location/', '');
        
        if (code && partOfCode && districtMap[partOfCode]) {
          await prisma.village.upsert({
            where: { code },
            update: {
              name: location.name,
              districtId: districtMap[partOfCode],
            },
            create: {
              code,
              name: location.name,
              districtId: districtMap[partOfCode],
            },
          });
        }
      }

      logger.info(`Berhasil menyinkronkan ${villages.length} desa dari Satu Sehat`);
      return true;
    } catch (error: any) {
      logger.error('Error menyinkronkan desa dari Satu Sehat:', error.message);
      throw new Error(`Gagal menyinkronkan desa dari Satu Sehat: ${error.message}`);
    }
  }

  /**
   * Sinkronisasi data praktisi dari Satu Sehat
   */
  static async syncPractitioners(): Promise<boolean> {
    try {
      const token = await authService.getToken();
      const config = await import('./satusehatConfigService').then(
        module => module.SatuSehatConfigService.getConfig()
      );
      
      if (!config) {
        throw new Error('Konfigurasi Satu Sehat belum disetel');
      }

      // Ambil data praktisi dari Satu Sehat
      const response = await fetch(`${config.baseUrl}/Practitioner?_count=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json+fhir',
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal mengambil data praktisi: ${response.statusText}`);
      }

      const data = await response.json();
      const practitioners = data.entry || [];

      // Hapus data lama
      await prisma.practitioner.deleteMany({});

      // Ambil atau buat role praktisi default
      const defaultRole = await prisma.practitionerRole.upsert({
        where: { code: 'doctor' },
        update: { name: 'Dokter' },
        create: {
          code: 'doctor',
          name: 'Dokter',
        },
      });

      // Simpan data baru
      for (const entry of practitioners) {
        const practitioner = entry.resource;
        const practitionerId = practitioner.id;
        
        // Ambil identitas NIK
        const nik = practitioner.identifier?.find((id: any) => 
          id.system === 'https://fhir.kemkes.go.id/id/nik'
        )?.value || '';
        
        // Ambil jenis kelamin
        const gender = practitioner.gender === 'male' ? 'L' : 
                      practitioner.gender === 'female' ? 'P' : '';
        
        await prisma.practitioner.upsert({
          where: { practitionerId },
          update: {
            nik,
            name: practitioner.name?.[0]?.text || '',
            gender,
            birthDate: practitioner.birthDate ? new Date(practitioner.birthDate) : new Date(),
            phoneNumber: practitioner.telecom?.find((t: any) => t.system === 'phone')?.value || '',
            email: practitioner.telecom?.find((t: any) => t.system === 'email')?.value || '',
            practitionerRoleId: defaultRole.id,
          },
          create: {
            practitionerId,
            nik,
            name: practitioner.name?.[0]?.text || '',
            gender,
            birthDate: practitioner.birthDate ? new Date(practitioner.birthDate) : new Date(),
            phoneNumber: practitioner.telecom?.find((t: any) => t.system === 'phone')?.value || '',
            email: practitioner.telecom?.find((t: any) => t.system === 'email')?.value || '',
            practitionerRoleId: defaultRole.id,
          },
        });
      }

      logger.info(`Berhasil menyinkronkan ${practitioners.length} praktisi dari Satu Sehat`);
      return true;
    } catch (error: any) {
      logger.error('Error menyinkronkan praktisi dari Satu Sehat:', error.message);
      throw new Error(`Gagal menyinkronkan praktisi dari Satu Sehat: ${error.message}`);
    }
  }

  /**
   * Sinkronisasi data KFA dari Satu Sehat
   */
  static async syncKFA(): Promise<boolean> {
    try {
      const token = await authService.getToken();
      const config = await import('./satusehatConfigService').then(
        module => module.SatuSehatConfigService.getConfig()
      );
      
      if (!config) {
        throw new Error('Konfigurasi Satu Sehat belum disetel');
      }

      // Ambil data KFA dari Satu Sehat
      const response = await fetch(`${config.baseUrl}/Device?_count=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json+fhir',
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal mengambil data KFA: ${response.statusText}`);
      }

      const data = await response.json();
      const devices = data.entry || [];

      // Hapus data lama
      await prisma.kFAComponent.deleteMany({});

      // Simpan data baru
      for (const entry of devices) {
        const device = entry.resource;
        const kfakode = device.id;
        
        await prisma.kFAComponent.upsert({
          where: { kfakode },
          update: {
            kfanama: device.deviceName?.[0]?.name || '',
            kfatype: device.type?.text || '',
            kfagroup: device.category?.text || '',
            kfalevel: device.version?.[0]?.value || '',
            kfasatuan: device.owner?.reference || '',
            kfadeskripsi: device.note?.[0]?.text || '',
          },
          create: {
            kfakode,
            kfanama: device.deviceName?.[0]?.name || '',
            kfatype: device.type?.text || '',
            kfagroup: device.category?.text || '',
            kfalevel: device.version?.[0]?.value || '',
            kfasatuan: device.owner?.reference || '',
            kfadeskripsi: device.note?.[0]?.text || '',
          },
        });
      }

      logger.info(`Berhasil menyinkronkan ${devices.length} komponen KFA dari Satu Sehat`);
      return true;
    } catch (error: any) {
      logger.error('Error menyinkronkan KFA dari Satu Sehat:', error.message);
      throw new Error(`Gagal menyinkronkan KFA dari Satu Sehat: ${error.message}`);
    }
  }

  /**
   * Sinkronisasi data KPTL dari Satu Sehat
   */
  static async syncKPTL(): Promise<boolean> {
    try {
      const token = await authService.getToken();
      const config = await import('./satusehatConfigService').then(
        module => module.SatuSehatConfigService.getConfig()
      );
      
      if (!config) {
        throw new Error('Konfigurasi Satu Sehat belum disetel');
      }

      // Ambil data obat dari Satu Sehat
      const response = await fetch(`${config.baseUrl}/Medication?_count=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json+fhir',
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal mengambil data KPTL: ${response.statusText}`);
      }

      const data = await response.json();
      const medications = data.entry || [];

      // Hapus data lama
      await prisma.kPTLProduct.deleteMany({});

      // Simpan data baru
      for (const entry of medications) {
        const medication = entry.resource;
        const kptlkode = medication.id;
        
        await prisma.kPTLProduct.upsert({
          where: { kptlkode },
          update: {
            kptlnama: medication.code?.coding?.[0]?.display || medication.code?.text || '',
            kptlgroup: medication.category?.coding?.[0]?.code || '',
            kptljenis: medication.form?.coding?.[0]?.code || medication.form?.text || '',
            kptlsediaan: medication.ingredient?.[0]?.itemCodeableConcept?.coding?.[0]?.display || '',
            kptlbentuk: medication.form?.text || '',
            kptlkategori: medication.category?.coding?.[0]?.display || '',
          },
          create: {
            kptlkode,
            kptlnama: medication.code?.coding?.[0]?.display || medication.code?.text || '',
            kptlgroup: medication.category?.coding?.[0]?.code || '',
            kptljenis: medication.form?.coding?.[0]?.code || medication.form?.text || '',
            kptlsediaan: medication.ingredient?.[0]?.itemCodeableConcept?.coding?.[0]?.display || '',
            kptlbentuk: medication.form?.text || '',
            kptlkategori: medication.category?.coding?.[0]?.display || '',
          },
        });
      }

      logger.info(`Berhasil menyinkronkan ${medications.length} produk KPTL dari Satu Sehat`);
      return true;
    } catch (error: any) {
      logger.error('Error menyinkronkan KPTL dari Satu Sehat:', error.message);
      throw new Error(`Gagal menyinkronkan KPTL dari Satu Sehat: ${error.message}`);
    }
  }

  /**
   * Mendapatkan data provinsi
   */
  static async getProvinces(): Promise<any[]> {
    try {
      return await prisma.province.findMany({
        orderBy: { name: 'asc' }
      });
    } catch (error: any) {
      logger.error('Error mengambil data provinsi:', error.message);
      throw new Error(`Gagal mengambil data provinsi: ${error.message}`);
    }
  }

  /**
   * Mendapatkan data kota berdasarkan provinsi
   */
  static async getCitiesByProvince(provinceCode: string): Promise<any[]> {
    try {
      return await prisma.city.findMany({
        where: { province: { code: provinceCode } },
        orderBy: { name: 'asc' }
      });
    } catch (error: any) {
      logger.error('Error mengambil data kota berdasarkan provinsi:', error.message);
      throw new Error(`Gagal mengambil data kota: ${error.message}`);
    }
  }

  /**
   * Mendapatkan data kecamatan berdasarkan kota
   */
  static async getDistrictsByCity(cityCode: string): Promise<any[]> {
    try {
      return await prisma.district.findMany({
        where: { city: { code: cityCode } },
        orderBy: { name: 'asc' }
      });
    } catch (error: any) {
      logger.error('Error mengambil data kecamatan berdasarkan kota:', error.message);
      throw new Error(`Gagal mengambil data kecamatan: ${error.message}`);
    }
  }

  /**
   * Mendapatkan data desa berdasarkan kecamatan
   */
  static async getVillagesByDistrict(districtCode: string): Promise<any[]> {
    try {
      return await prisma.village.findMany({
        where: { district: { code: districtCode } },
        orderBy: { name: 'asc' }
      });
    } catch (error: any) {
      logger.error('Error mengambil data desa berdasarkan kecamatan:', error.message);
      throw new Error(`Gagal mengambil data desa: ${error.message}`);
    }
  }

  /**
   * Mendapatkan data praktisi
   */
  static async getPractitioners(): Promise<any[]> {
    try {
      return await prisma.practitioner.findMany({
        include: {
          practitionerRole: true
        },
        orderBy: { name: 'asc' }
      });
    } catch (error: any) {
      logger.error('Error mengambil data praktisi:', error.message);
      throw new Error(`Gagal mengambil data praktisi: ${error.message}`);
    }
  }

  /**
   * Mendapatkan data KFA
   */
  static async getKFAComponents(): Promise<any[]> {
    try {
      return await prisma.kFAComponent.findMany({
        orderBy: { kfanama: 'asc' }
      });
    } catch (error: any) {
      logger.error('Error mengambil data KFA:', error.message);
      throw new Error(`Gagal mengambil data KFA: ${error.message}`);
    }
  }

  /**
   * Mendapatkan data KPTL
   */
  static async getKPTLProducts(): Promise<any[]> {
    try {
      return await prisma.kPTLProduct.findMany({
        orderBy: { kptlnama: 'asc' }
      });
    } catch (error: any) {
      logger.error('Error mengambil data KPTL:', error.message);
      throw new Error(`Gagal mengambil data KPTL: ${error.message}`);
    }
  }
}