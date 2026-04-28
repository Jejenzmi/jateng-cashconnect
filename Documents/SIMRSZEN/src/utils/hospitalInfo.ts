import { HospitalProfileService } from "@/services/HospitalProfileService";

/**
 * Utility function to get hospital logo URL from the database
 */
export async function getHospitalLogo(): Promise<string | null> {
  try {
    const profile = await HospitalProfileService.getProfile();
    return profile?.logo_url || null;
  } catch (err) {
    console.error("Error fetching hospital logo:", err);
    return null;
  }
}

/**
 * Utility function to get basic hospital information
 */
export async function getHospitalInfo(): Promise<{
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo_url: string | null;
} | null> {
  try {
    const profile = await HospitalProfileService.getProfile();

    if (!profile) {
      return null;
    }

    return {
      name: profile.hospital_name || "",
      code: profile.hospital_code || "",
      address: profile.address || "",
      phone: profile.phone || "",
      email: profile.email || "",
      website: profile.website || "",
      logo_url: profile.logo_url || null
    };
  } catch (err) {
    console.error("Error fetching hospital info:", err);
    return null;
  }
}