import dotenv from 'dotenv';

dotenv.config();

export const AppConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'simrszen_default_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  environment: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // SIMRS ZEN specific configurations
  appName: 'SIMRS ZEN',
  appVersion: '1.0.0',
  maxUploadSize: process.env.MAX_UPLOAD_SIZE || '10mb',
  
  // BPJS Integration Settings
  bpjs: {
    vclaim: process.env.BPJS_VCLAIM_URL || '',
    pcare: process.env.BPJS_PCARE_URL || '',
    consumerId: process.env.BPJS_CONSUMER_ID || '',
    consumerSecret: process.env.BPJS_CONSUMER_SECRET || '',
    userKey: process.env.BPJS_USER_KEY || ''
  },
  
  // External service timeouts
  timeouts: {
    apiCall: parseInt(process.env.API_CALL_TIMEOUT || '10000', 10), // 10 seconds
    dbQuery: parseInt(process.env.DB_QUERY_TIMEOUT || '5000', 10),  // 5 seconds
  }
};

// Validate essential environment variables
if (!AppConfig.databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

if (AppConfig.environment === 'production' && AppConfig.jwtSecret === 'simrszen_default_secret') {
  throw new Error('JWT_SECRET must be set to a secure value in production environment');
}