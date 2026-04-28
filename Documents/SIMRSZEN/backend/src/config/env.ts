import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001'),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'fallback_default_secret_for_development_only',
  bpjs: {
    consId: process.env.BPJS_CONS_ID,
    secret: process.env.BPJS_SECRET,
    userKey: process.env.BPJS_USER_KEY,
    ppkCode: process.env.BPJS_PPK_CODE,
    ppkRujukanCode: process.env.BPJS_PPK_RUJUKAN_CODE,
    userName: process.env.BPJS_USER_NAME,
  },
  satusehat: {
    clientId: process.env.SATUSEHAT_CLIENT_ID,
    clientSecret: process.env.SATUSEHAT_CLIENT_SECRET,
    organizationCode: process.env.SATUSEHAT_ORGANIZATION_CODE,
  },
  idrg: {
    clientId: process.env.IDRG_CLIENT_ID,
    secret: process.env.IDRG_SECRET,
  },
};