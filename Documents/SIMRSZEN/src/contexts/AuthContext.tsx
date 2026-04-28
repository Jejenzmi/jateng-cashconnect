import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, Session } from '@/types/user';  // Impor dari file types/user.ts

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [faskesProfileExists, setFaskesProfileExists] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for existing session in localStorage or sessionStorage
    const storedSession = localStorage.getItem('auth-session');
    const storedUser = localStorage.getItem('auth-user');

    if (storedSession && storedUser) {
      try {
        const parsedSession = JSON.parse(storedSession);
        const parsedUser = JSON.parse(storedUser);
        
        // Check if session is still valid
        const now = new Date();
        const expiresAt = new Date(parsedSession.expiresAt);
        
        if (expiresAt > now) {
          setSession(parsedSession);
          setUser(parsedUser);
          
          // Check if Faskes Profile exists only after setting session
          checkFaskesProfile(parsedSession.token);
        } else {
          // Clear expired session
          localStorage.removeItem('auth-session');
          localStorage.removeItem('auth-user');
        }
      } catch (error) {
        console.error('Error parsing stored session:', error);
        // Clear invalid session data
        localStorage.removeItem('auth-session');
        localStorage.removeItem('auth-user');
      }
    }
    
    setLoading(false);
  }, []);

  const checkFaskesProfile = async (token: string) => {
    try {
      // Create a promise that will timeout after 5 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 5000);
      });
      
      const requestPromise = fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/setup/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const response = await Promise.race([requestPromise, timeoutPromise]) as Response;
      
      if (response.ok) {
        const data = await response.json();
        // Update the state based on setup completion status
        setFaskesProfileExists(data.setupCompleted);
      } else {
        console.error('Failed to check setup status:', response.statusText);
        // Show error to user instead of silently assuming
        setFaskesProfileExists(false);
      }
    } catch (error) {
      console.error('Error checking setup status:', error);
      // Show error to user instead of silently assuming
      setFaskesProfileExists(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error?: string, needsSetup?: boolean }> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status); // Logging status
      const data = await response.json();
      console.log('Login response data:', data); // Logging response data

      if (!response.ok) {
        return { error: data.error || 'Login gagal' };
      }

      // Success case - store user and session
      const { user: userData, token } = data;
      
      // Calculate expiration date (using expiresIn from response)
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
      
      const sessionData: Session = {
        token,
        expiresAt,
      };
      
      setUser(userData);
      setSession(sessionData);
      
      // Check if setup is completed by calling the setup status API
      let needsSetup = false;
      try {
        const setupResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/setup/status`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (setupResponse.ok) {
          const setupData = await setupResponse.json();
          setFaskesProfileExists(setupData.setupCompleted);
          needsSetup = !setupData.setupCompleted;
        } else {
          // If we can't check the setup status, treat as if setup is needed
          setFaskesProfileExists(false);
          needsSetup = true;
        }
      } catch (err) {
        console.error('Error checking setup status:', err);
        setFaskesProfileExists(false);
        needsSetup = true;
      }
      
      // Store in localStorage
      localStorage.setItem('auth-session', JSON.stringify(sessionData));
      localStorage.setItem('auth-user', JSON.stringify(userData));
      
      return { needsSetup };
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Terjadi kesalahan saat login' };
    }
  };

  const signOut = () => {
    setUser(null);
    setSession(null);
    setFaskesProfileExists(null);
    localStorage.removeItem('auth-session');
    localStorage.removeItem('auth-user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      roles: user?.roles || [], 
      session, 
      loading, 
      signIn, 
      signOut,
      faskesProfileExists,
      setFaskesProfileExists 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};