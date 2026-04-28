// File konfigurasi environment variables untuk frontend

const getEnvVar = (name: string, fallback?: string): string => {
  const value = import.meta.env[name] || fallback;
  
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  
  return value;
};

export const ENV_CONFIG = {
  API_URL: getEnvVar('VITE_API_URL', 'http://localhost:3001/api'),
  APP_NAME: getEnvVar('VITE_APP_NAME', 'SIMRS ZEN'),
  BASE_URL: getEnvVar('VITE_BASE_URL', 'http://localhost:8080'),
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
};