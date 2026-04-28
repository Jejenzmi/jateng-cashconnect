// Konfigurasi database PostgreSQL lokal
export const DATABASE_CONFIG = {
  host: process.env.VITE_DB_HOST || 'localhost',
  port: parseInt(process.env.VITE_DB_PORT || '5433'),
  database: process.env.VITE_DB_NAME || 'simrszen',
  username: process.env.VITE_DB_USERNAME || 'postgres',
  password: process.env.VITE_DB_PASSWORD || 'postgres',
  ssl: process.env.VITE_DB_SSL === 'true',
};

// Fungsi untuk membuat connection string
export function getPostgresConnectionString(): string {
  const { host, port, database, username, password, ssl } = DATABASE_CONFIG;
  const sslParam = ssl ? '?sslmode=require' : '';
  return `postgresql://${username}:${password}@${host}:${port}/${database}${sslParam}`;
}