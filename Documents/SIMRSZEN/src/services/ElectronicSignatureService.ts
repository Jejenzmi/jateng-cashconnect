import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
// Interface untuk konfigurasi tanda tangan elektronik
interface ElectronicSignatureConfig {
  id: string;
  hospital_profile_id: string;
  signature_type: 'bsre' | 'other';
  is_enabled: boolean;
  api_endpoint?: string;
  api_key_encrypted?: string;
  config_metadata?: any; // Metadata tambahan dalam bentuk JSON
  created_at: Date;
  updated_at: Date;
}

// Interface untuk data konfigurasi BSRE
interface BsreConfig {
  api_endpoint: string;
  api_key: string;
  enable_verification: boolean;
  default_position: {
    x: number;
    y: number;
    page: number;
  };
}

// Layanan untuk manajemen konfigurasi tanda tangan elektronik
export class ElectronicSignatureService {
  private tableName = "electronic_signature_configs";

  // Mendapatkan konfigurasi tanda tangan elektronik untuk rumah sakit tertentu
  static async getConfig(hospitalId: string): Promise<ElectronicSignatureConfig | null> {
    try {
      const result = await getApi<ElectronicSignatureConfig[]>`
        SELECT * FROM ${this.tableName} 
        WHERE hospital_profile_id = ${hospitalId} 
        AND signature_type = 'bsre'
        LIMIT 1
      `;
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Error getting electronic signature config:", error);
      throw error;
    }
  }

  // Memperbarui atau membuat konfigurasi tanda tangan elektronik
  static async updateConfig(
    hospitalId: string,
    config: Partial<BsreConfig>,
    is_enabled: boolean
  ): Promise<ElectronicSignatureConfig | null> {
    try {
      // Ambil konfigurasi yang sudah ada
      const existingConfig = await this.getConfig(hospitalId);
      
      if (existingConfig) {
        // Update jika konfigurasi sudah ada
        const result = await getApi<ElectronicSignatureConfig[]>`
          UPDATE ${this.tableName} 
          SET 
            is_enabled = ${is_enabled},
            api_endpoint = ${config.api_endpoint || null},
            api_key_encrypted = ${config.api_key ? this.encryptApiKey(config.api_key) : existingConfig.api_key_encrypted},
            config_metadata = ${config ? JSON.stringify({
              enable_verification: config.enable_verification,
              default_position: config.default_position
            }) : null},
            updated_at = NOW()
          WHERE id = ${existingConfig.id}
          RETURNING *
        `;
        return result[0] || null;
      } else {
        // Buat konfigurasi baru jika belum ada
        const result = await getApi<ElectronicSignatureConfig[]>`
          INSERT INTO ${this.tableName} (
            hospital_profile_id,
            signature_type,
            is_enabled,
            api_endpoint,
            api_key_encrypted,
            config_metadata
          ) VALUES (
            ${hospitalId},
            'bsre',
            ${is_enabled},
            ${config.api_endpoint || null},
            ${config.api_key ? this.encryptApiKey(config.api_key) : null},
            ${config ? JSON.stringify({
              enable_verification: config.enable_verification,
              default_position: config.default_position
            }) : null}
          )
          RETURNING *
        `;
        return result[0] || null;
      }
    } catch (error) {
      console.error("Error updating electronic signature config:", error);
      throw error;
    }
  }

  // Aktifkan atau nonaktifkan tanda tangan elektronik
  static async toggleBsreFeature(hospitalId: string, isEnabled: boolean): Promise<boolean> {
    try {
      // Dapatkan profil rumah sakit
      const profileResult = await getApi<any[]>`
        SELECT id, enable_bsre_signature FROM hospital_profile 
        WHERE id = ${hospitalId}
      `;
      
      if (profileResult.length === 0) {
        throw new Error("Profil rumah sakit tidak ditemukan");
      }
      
      // Update status fitur di profil rumah sakit
      await putApi("/generic-api", {});
      
      // Jika konfigurasi BSRE belum ada, buatkan
      const config = await this.getConfig(hospitalId);
      if (!config) {
        await this.updateConfig(hospitalId, {}, isEnabled);
      } else {
        // Jika sudah ada, update status enabled saja
        await putApi("/generic-api", {});
      }
      
      return true;
    } catch (error) {
      console.error("Error toggling BSRE feature:", error);
      throw error;
    }
  }

  // Fungsi untuk mengintegrasikan dengan layanan eksternal BSRE
  static async initiateSigningProcess(
    documentData: Buffer,
    documentName: string,
    signerNik: string,
    passphrase: string // Passphrase diberikan saat proses penandatanganan, tidak disimpan
  ): Promise<any> {
    // Dalam implementasi nyata, ini akan menghubungi API BSRE
    // Untuk simulasi, kita hanya akan me-return objek yang menunjukkan permintaan penandatanganan
    
    // Pastikan untuk tidak menyimpan passphrase ke dalam database atau log
    console.log(`Initiating signing process for document: ${documentName}`);
    
    // Proses yang sebenarnya akan:
    // 1. Mengunggah dokumen ke layanan BSRE
    // 2. Mengirimkan NIK penandatangan
    // 3. Menggunakan passphrase hanya untuk sesi penandatanganan
    // 4. Tidak menyimpan passphrase ke mana pun
    
    return {
      success: true,
      documentId: `doc_${Date.now()}`, // ID dokumen unik
      status: 'awaiting_signature',
      message: 'Proses penandatanganan telah dimulai',
    };
  }

  // Fungsi untuk mengenkripsi API key sebelum disimpan
  private static encryptApiKey(apiKey: string): string {
    // Dalam implementasi nyata, Anda akan menggunakan metode enkripsi yang kuat
    // Misalnya dengan AES-256-CBC encryption seperti yang disyaratkan dalam spesifikasi
    // Untuk simulasi ini, kita hanya mengembalikan nilai aslinya
    // TODO: Implementasi enkripsi yang sesungguhnya
    return apiKey;
  }

  // Fungsi untuk mendekripsi API key saat digunakan
  private static decryptApiKey(encryptedApiKey: string): string {
    // Dalam implementasi nyata, Anda akan menggunakan metode dekripsi
    // Untuk simulasi ini, kita hanya mengembalikan nilai aslinya
    // TODO: Implementasi dekripsi yang sesungguhnya
    return encryptedApiKey;
  }

  // Mendapatkan status fitur BSRE untuk rumah sakit
  static async getBsreStatus(hospitalId: string): Promise<boolean> {
    try {
      const result = await getApi<{ enable_bsre_signature: boolean }[]>`
        SELECT enable_bsre_signature 
        FROM hospital_profile 
        WHERE id = ${hospitalId}
      `;
      
      return result.length > 0 ? result[0].enable_bsre_signature : false;
    } catch (error) {
      console.error("Error getting BSRE status:", error);
      return false;
    }
  }
}