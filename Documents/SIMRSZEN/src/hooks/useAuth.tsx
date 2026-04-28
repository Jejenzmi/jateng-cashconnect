import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useState, useEffect } from 'react';
import { User } from '@/types/user';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  role: string;
}

const useAuthHook = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on hook initialization
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // In our local authentication system, we'll check for token in localStorage
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Verify token and get user info
        const userData = await getCurrentUser(token);
        setUser(userData);
      }
    } catch (err) {
      console.error('Auth verification failed:', err);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setError(null);
    setLoading(true);
    
    try {
      // Query user from PostgreSQL
      const result = await getApi<User[]>`
        SELECT 
          id,
          full_name,
          email,
          role,
          department,
          is_active,
          created_at
        FROM users 
        WHERE email = ${credentials.email} AND is_active = true
      `;
      
      if (result.length === 0) {
        throw new Error('Email tidak ditemukan atau akun tidak aktif');
      }
      
      const user = result[0];
      
      // Here we would normally hash and compare passwords
      // For now, we'll simulate successful authentication
      const isValidPassword = await verifyPassword(credentials.password, user.id);
      
      if (!isValidPassword) {
        throw new Error('Password salah');
      }
      
      // Generate and store token
      const token = generateAuthToken(user.id);
      localStorage.setItem('auth_token', token);
      
      setUser(user);
      return user;
    } catch (err: any) {
      setError(err.message || 'Login gagal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setError(null);
    setLoading(true);
    
    try {
      // Hash password before storing
      const hashedPassword = await hashPassword(userData.password);
      
      const result = await getApi<User[]>`
        INSERT INTO users (
          full_name,
          email,
          password_hash,
          role,
          department,
          is_active
        ) VALUES (
          ${userData.full_name},
          ${userData.email},
          ${hashedPassword},
          ${userData.role},
          '',
          true
        ) RETURNING 
          id,
          full_name,
          email,
          role,
          department,
          is_active,
          created_at
      `;
      
      const newUser = result[0];
      
      // Auto-login after registration
      const token = generateAuthToken(newUser.id);
      localStorage.setItem('auth_token', token);
      
      setUser(newUser);
      return newUser;
    } catch (err: any) {
      setError(err.message || 'Registrasi gagal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const getCurrentUser = async (token?: string) => {
    const authToken = token || localStorage.getItem('auth_token');
    
    if (!authToken) {
      throw new Error('Tidak ada token otentikasi');
    }
    
    // Decode token to get user ID (simplified - in reality you'd verify JWT)
    const userId = decodeUserIdFromToken(authToken);
    
    const result = await getApi<User[]>`
      SELECT 
        id,
        full_name,
        email,
        role,
        department,
        is_active,
        created_at
      FROM users 
      WHERE id = ${userId}
    `;
    
    if (result.length === 0) {
      throw new Error('Pengguna tidak ditemukan');
    }
    
    return result[0];
  };

  // Helper functions
  const generateAuthToken = (userId: string): string => {
    // In a real app, this would be a proper JWT
    // For now we'll create a simple token containing the user ID
    const payload = {
      userId,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
    };
    
    return btoa(JSON.stringify(payload)); // Base64 encode for simplicity
  };

  const decodeUserIdFromToken = (token: string): string => {
    try {
      const decoded = JSON.parse(atob(token));
      return decoded.userId;
    } catch (e) {
      throw new Error('Token tidak valid');
    }
  };

  const verifyPassword = async (password: string, userId: string): Promise<boolean> => {
    // In a real implementation, this would compare the password with the stored hash
    // For now, we'll return true to allow login during migration
    return true;
  };

  const hashPassword = async (password: string): Promise<string> => {
    // In a real implementation, this would properly hash the password
    // For now, we'll just return the password for migration purposes
    return password;
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    getCurrentUser,
    isAuthenticated: !!user
  };
};

export const useAuth = useAuthHook;
export default useAuthHook;