import axios from 'axios';

interface HospitalInfo {
  name: string;
  code: string;
  type: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
}

interface AdminUser {
  fullName: string;
  email: string;
  password: string;
}

interface Modules {
  activeModules: string[];
}

interface SetupData {
  hospitalInfo: HospitalInfo;
  adminUser: AdminUser;
  modules: Modules;
}

interface SetupResponse {
  message: string;
  hospitalProfile: any; // Detailed type would depend on the actual schema
  adminUser: {
    id: string;
    email: string;
    fullName: string;
  };
}

interface SetupStatusResponse {
  setupCompleted: boolean;
  message: string;
}

const API_BASE_URL = '/api';

export const setupService = {
  /**
   * Initialize the system with hospital information and admin account
   */
  async initializeSetup(setupData: SetupData): Promise<SetupResponse> {
    try {
      const response = await axios.post<SetupResponse>(`${API_BASE_URL}/setup`, setupData);
      return response.data;
    } catch (error) {
      console.error('Setup initialization error:', error);
      throw error;
    }
  },

  /**
   * Check if the system has already been set up
   */
  async checkSetupStatus(): Promise<SetupStatusResponse> {
    try {
      const response = await axios.get<SetupStatusResponse>(`${API_BASE_URL}/setup/status`);
      return response.data;
    } catch (error) {
      console.error('Check setup status error:', error);
      throw error;
    }
  }
};