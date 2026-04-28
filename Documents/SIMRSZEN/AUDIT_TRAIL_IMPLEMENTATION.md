# Implementasi Audit Trail pada SIMRS ZEN

## Tujuan
Audit trail merupakan fitur penting dalam sistem informasi rumah sakit untuk memenuhi kebutuhan hukum, kepatuhan regulasi, dan pemantauan aktivitas sistem. Dokumen ini menjelaskan implementasi audit trail pada SIMRS ZEN.

## Cakupan Audit Trail
Audit trail mencakup:

1. **Aktivitas Pengguna**
   - Login/logout
   - Perubahan profil pengguna
   - Reset password
   - Akses ke data pasien

2. **Manipulasi Data Klinis**
   - Pembuatan rekam medis
   - Perubahan rekam medis
   - Pembuatan dan perubahan resep
   - Perubahan hasil laboratorium/radiologi

3. **Aktivitas Administratif**
   - Pembuatan dan pembatalan kunjungan
   - Pembayaran dan perubahan status pembayaran
   - Perubahan data pasien

## Struktur Tabel Audit Trail

### Tabel `AuditTrail`
```prisma
model AuditTrail {
  id           String   @id @default(uuid())
  tableName    String   // Nama tabel yang diubah
  recordId     String   // ID dari record yang diubah
  action       String   // CREATE, UPDATE, DELETE
  oldValues    Json?    // Nilai sebelum perubahan
  newValues    Json?    // Nilai setelah perubahan
  timestamp    DateTime @default(now())
  userAgent    String?  // User agent dari browser
  ipAddress    String?  // IP address pengguna
  userId       String?  // ID pengguna yang melakukan perubahan
  user         User?    @relation(fields: [userId], references: [id])
  createdAt    DateTime @default(now())
  updatedAt    DateTime @default(now()) @updatedAt
}
```

## Implementasi Middleware Audit Trail

### Backend - Middleware Prisma
```typescript
// backend/src/middleware/auditMiddleware.ts
import { Prisma } from '@prisma/client';

export const auditMiddleware: Prisma.Middleware = async (params, next) => {
  // Logika untuk mencatat perubahan ke tabel audit trail
  const result = await next(params);
  
  // Jika bukan operasi write, lewati
  if (params.action === 'findUnique' || params.action === 'findFirst' || params.action.includes('count')) {
    return result;
  }

  // Ambil informasi user dari context (misalnya dari token JWT)
  // Dalam implementasi nyata, ini akan diambil dari request context
  const userId = params.args.userId || null;
  const ipAddress = params.args.ipAddress || null;
  const userAgent = params.args.userAgent || null;

  // Simpan ke tabel audit trail
  if (global.prisma) {
    await global.prisma.auditTrail.create({
      data: {
        tableName: params.model,
        recordId: getRecordId(params),
        action: params.action,
        oldValues: getOldValues(params, result),
        newValues: getNewValues(params),
        userId,
        ipAddress,
        userAgent,
      },
    });
  }

  return result;
};

// Helper functions
function getRecordId(params: any): string {
  // Ambil ID dari parameter atau hasil
  if (params.args.where?.id) {
    return params.args.where.id;
  }
  if (params.result?.id) {
    return params.result.id;
  }
  return '';
}

function getOldValues(params: any, result: any): any {
  // Ambil nilai-nilai lama sebelum perubahan
  if (params.action === 'create') {
    return null;
  }
  // Implementasi untuk mendapatkan nilai lama
  return {};
}

function getNewValues(params: any): any {
  // Ambil nilai-nilai baru setelah perubahan
  if (params.action === 'delete') {
    return null;
  }
  // Implementasi untuk mendapatkan nilai baru
  return params.args.data || {};
}
```

### Registrasi Middleware di Prisma Client
```typescript
// backend/src/config/database.ts
import { PrismaClient } from '@prisma/client';
import { auditMiddleware } from '../middleware/auditMiddleware';

const prisma = new PrismaClient();

// Terapkan middleware
prisma.$use(auditMiddleware);

export default prisma;
```

## Implementasi di Controller

### Contoh: Patient Controller dengan Audit Trail
```typescript
// backend/src/controllers/patient.controller.ts
import prisma from '../config/database';
import { Request, Response } from 'express';

export const createPatient = async (req: Request, res: Response) => {
  try {
    const patientData = req.body;
    const userId = req.user?.id; // dari middleware auth
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');

    const patient = await prisma.patient.create({
      data: {
        ...patientData,
        // tambahkan relasi jika diperlukan
      },
    });

    // Catat ke audit trail
    await prisma.auditTrail.create({
      data: {
        tableName: 'Patient',
        recordId: patient.id,
        action: 'CREATE',
        newValues: JSON.stringify(patientData),
        userId,
        ipAddress,
        userAgent,
      },
    });

    res.status(201).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
      },
    });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const patientData = req.body;
    const userId = req.user?.id;
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');

    // Ambil data sebelum perubahan
    const oldPatient = await prisma.patient.findUnique({
      where: { id },
    });

    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: patientData,
    });

    // Catat ke audit trail
    await prisma.auditTrail.create({
      data: {
        tableName: 'Patient',
        recordId: id,
        action: 'UPDATE',
        oldValues: JSON.stringify(oldPatient),
        newValues: JSON.stringify(updatedPatient),
        userId,
        ipAddress,
        userAgent,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedPatient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
      },
    });
  }
};
```

## Tampilan UI untuk Audit Trail

### Komponen React untuk Menampilkan Audit Trail
```tsx
// src/components/audit-trail/AuditTrailViewer.tsx
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface AuditTrailEntry {
  id: string;
  tableName: string;
  recordId: string;
  action: string;
  oldValues: Record<string, any> | null;
  newValues: Record<string, any> | null;
  timestamp: string;
  user: {
    fullName: string;
  } | null;
}

interface AuditTrailViewerProps {
  tableName: string;
  recordId: string;
}

const AuditTrailViewer: React.FC<AuditTrailViewerProps> = ({ tableName, recordId }) => {
  const [auditTrails, setAuditTrails] = useState<AuditTrailEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil audit trail dari API
    fetchAuditTrails();
  }, [tableName, recordId]);

  const fetchAuditTrails = async () => {
    try {
      const response = await fetch(`/api/audit-trail?tableName=${tableName}&recordId=${recordId}`);
      const data = await response.json();
      setAuditTrails(data.data);
    } catch (error) {
      console.error('Error fetching audit trails:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDiff = (oldValues: Record<string, any>, newValues: Record<string, any>) => {
    if (!oldValues || !newValues) return null;

    const changes = [];
    for (const key in newValues) {
      if (oldValues[key] !== newValues[key]) {
        changes.push(
          <div key={key} className="text-sm">
            <span className="font-medium">{key}:</span> 
            <span className="line-through text-red-500"> {JSON.stringify(oldValues[key])}</span>
            <span> → </span>
            <span className="text-green-500"> {JSON.stringify(newValues[key])}</span>
          </div>
        );
      }
    }
    return changes.length > 0 ? changes : <span>Tidak ada perubahan</span>;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Aksi</TableHead>
          <TableHead>Waktu</TableHead>
          <TableHead>Pengguna</TableHead>
          <TableHead>Perubahan</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {auditTrails.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>
              <Badge variant={entry.action === 'CREATE' ? 'default' : entry.action === 'UPDATE' ? 'secondary' : 'destructive'}>
                {entry.action}
              </Badge>
            </TableCell>
            <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
            <TableCell>{entry.user?.fullName || 'Sistem'}</TableCell>
            <TableCell>
              {renderDiff(entry.oldValues, entry.newValues)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AuditTrailViewer;
```

## Penjadwalan Backup Audit Trail

### Cron Job untuk Backup Audit Trail
Tambahkan ke crontab untuk backup harian tabel audit trail:

```bash
# Backup audit trail setiap hari pukul 02:00 pagi
0 2 * * * pg_dump -h localhost -p 5433 -U satusehat_user -d simrszen -t "AuditTrail" -f /home/simrs/backups/audit_trail_$(date +\%Y\%m\%d).sql
```

## Kebijakan Retensi Data Audit Trail

- Data audit trail disimpan selama 7 tahun sesuai dengan ketentuan hukum Indonesia
- Data lebih dari 3 bulan dipindahkan ke tabel arsip
- Data lebih dari 1 tahun dikompresi untuk menghemat ruang penyimpanan

## Pengujian Audit Trail

### Unit Test untuk Middleware Audit Trail
```typescript
// backend/tests/auditMiddleware.test.ts
import { auditMiddleware } from '../src/middleware/auditMiddleware';
import { Prisma } from '@prisma/client';

describe('Audit Middleware', () => {
  it('should log CREATE operations', async () => {
    const params: Prisma.MiddlewareParams = {
      model: 'Patient',
      action: 'create',
      args: {
        data: { name: 'John Doe', nik: '1234567890' },
        userId: 'user123',
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
      },
      dataPath: [],
      runInTransaction: false,
    };

    const next = jest.fn().mockResolvedValue({
      id: 'patient123',
      name: 'John Doe',
      nik: '1234567890',
    });

    await auditMiddleware(params, next);

    expect(next).toHaveBeenCalled();
    // Tambahkan assertion untuk memastikan audit trail dibuat
  });
});
```

Dengan implementasi ini, SIMRS ZEN akan memiliki audit trail yang komprehensif sesuai dengan kebutuhan regulasi dan keamanan data.