import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
// Interface untuk HospitalProfile
interface HospitalProfile {
  id: string;
  hospital_name?: string;
  hospital_code?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  created_at: Date;
  updated_at: Date;
}

// Layanan untuk manajemen profil rumah sakit
export class HospitalProfileService {
  private tableName = "hospital_profile";

  // Mendapatkan profil rumah sakit
  static async getProfile(): Promise<HospitalProfile | null> {
    try {
      const result = await getApi<HospitalProfile[]>`
        SELECT * FROM ${this.tableName} LIMIT 1
      `;
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Error getting hospital profile:", error);
      throw error;
    }
  }

  // Memperbarui profil rumah sakit
  static async updateProfile(profileData: Partial<HospitalProfile>): Promise<HospitalProfile | null> {
    try {
      // Ambil profil yang sudah ada
      const existingProfile = await this.getProfile();
      
      if (existingProfile) {
        // Lakukan update jika profil sudah ada
        const updateFields = Object.keys(profileData).filter(key => key !== 'id');
        if (updateFields.length === 0) return existingProfile;
        
        // Membangun query update dinamis
        const setClause = updateFields
          .map(field => `"${field}" = ${getApi.$if(profileData[field as keyof HospitalProfile] !== undefined).then(getApi(`${profileData[field as keyof HospitalProfile]}`)).else(null)}`)
          .join(', ');
        
        const query = `
          UPDATE ${this.tableName} 
          SET ${setClause}, updated_at = NOW()
          WHERE id = ${getApi(existingProfile.id)}
          RETURNING *
        `;
        
        const result = await getApi<HospitalProfile[]>(query);
        return result[0] || null;
      } else {
        // Buat profil baru jika belum ada
        const result = await getApi<HospitalProfile[]>`
          INSERT INTO ${this.tableName} (
            hospital_name, 
            hospital_code, 
            address, 
            phone, 
            email, 
            website, 
            logo_url
          ) VALUES (
            ${profileData.hospital_name || null},
            ${profileData.hospital_code || null},
            ${profileData.address || null},
            ${profileData.phone || null},
            ${profileData.email || null},
            ${profileData.website || null},
            ${profileData.logo_url || null}
          )
          RETURNING *
        `;
        return result[0] || null;
      }
    } catch (error) {
      console.error("Error updating hospital profile:", error);
      throw error;
    }
  }
}