# Panduan Deployment SIMRSZEN

## Prasyarat Sistem

### Backend Requirements
- Node.js v18 atau lebih baru
- PostgreSQL v12 atau lebih baru
- Git

### Frontend Requirements
- Node.js v18 atau lebih baru
- npm v8 atau lebih baru

## Setup Lingkungan Development

### 1. Clone Repository
```bash
git clone <repository-url>
cd SIMRSZEN
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### 3. Setup Database
```bash
# Di direktori backend
npx prisma generate
npx prisma db push
```

### 4. Konfigurasi Environment
Salin `.env.example` ke `.env` dan sesuaikan konfigurasi:
```bash
cp .env.example .env
```

Contoh konfigurasi:
```
NODE_ENV=development
PORT=3001
DB_URL=postgresql://username:password@localhost:5432/simrszen
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:8080
SATUSEHAT_CLIENT_ID=your-satusehat-client-id
SATUSEHAT_CLIENT_SECRET=your-satusehat-client-secret
SATUSEHAT_BASE_URL=https://api.satu-sehat.rencana.kemkes.go.id
BPJS_VCLAIM_URL=https://api.bpjs-kesehatan.go.id/vclaim-rest
BPJS_BPJS_CONSUMER_ID=your-bpjs-consumer-id
BPJS_BPJSSPACE_CONSUMER_PASSWORD=your-bpjs-password
BPJS_BPJSSPACE_API_KEY=your-bpjs-api-key
```

## Deployment ke Production

### 1. Build Frontend
```bash
npm run build
```

### 2. Build Backend
```bash
cd backend
npm run build
```

### 3. Setup Production Environment
Pastikan konfigurasi berikut disetel di lingkungan produksi:
```
NODE_ENV=production
PORT=3001
DB_URL=postgresql://username:password@prod-host:5432/proddb
JWT_SECRET=strong-production-jwt-secret
CLIENT_URL=https://yourdomain.com
LOG_LEVEL=info
```

### 4. Jalankan Aplikasi
```bash
# Di direktori backend
npm start
```

## Docker Deployment (Opsional)

### 1. Build Docker Images
```bash
# Build frontend image
docker build -f Dockerfile.frontend -t simrszen-frontend .

# Build backend image
docker build -f Dockerfile.backend -t simrszen-backend .
```

### 2. Jalankan dengan Docker Compose
```bash
docker-compose up -d
```

## Monitoring dan Logging

Aplikasi menyediakan endpoint monitoring:
- Health check: `GET /health`
- Ready check: `GET /ready`

Log aplikasi disimpan di direktori `logs/`:
- `error.log` - Kesalahan aplikasi
- `combined.log` - Semua log aplikasi

## Backup dan Recovery

### Backup Database
```bash
# Di direktori backend
bash scripts/backup-db.sh
```

### Restore Database
```bash
# Ekstraksi backup
gunzip backup_file.sql.gz

# Restore ke database
psql -h host -U username -d database_name < backup_file.sql
```

## Troubleshooting

### Aplikasi Tidak Bisa Diakses
1. Pastikan port yang digunakan tidak digunakan oleh aplikasi lain
2. Cek log aplikasi di direktori `logs/`
3. Pastikan konfigurasi database benar

### Error Saat Migration
1. Pastikan koneksi database valid
2. Cek hak akses database
3. Pastikan versi PostgreSQL didukung

### Masalah Otentikasi
1. Pastikan JWT_SECRET konsisten di frontend dan backend
2. Cek konfigurasi CORS di environment