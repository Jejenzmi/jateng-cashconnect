import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { logger } from '../src/utils/logger';

const BACKUP_DIR = process.env.BACKUP_LOCATION || '/backups/simrszen';
const DB_URL = process.env.DATABASE_URL;
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS || '30');

// Extract database name from connection string
const extractDBName = (connectionString: string): string => {
  // PostgreSQL connection string format: postgresql://user:pass@host:port/dbname
  const dbName = connectionString.split('/').pop();
  if (!dbName) {
    throw new Error('Could not extract database name from connection string');
  }
  return dbName;
};

// Create backup directory if it doesn't exist using async
(async () => {
  try {
    await fs.promises.mkdir(BACKUP_DIR, { recursive: true });
    logger.info(`Backup directory created or already exists: ${BACKUP_DIR}`);
  } catch (error) {
    logger.error(`Failed to create backup directory: ${BACKUP_DIR}`, { error: (error as Error).message });
    process.exit(1);
  }
})();

// Function to perform the backup
const performBackup = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!DB_URL) {
      reject(new Error('DATABASE_URL environment variable not set'));
      return;
    }

    if (!dbUrl.protocol.startsWith('postgresql')) {
      reject(new Error('DATABASE_URL must use postgresql protocol'));
      return;
    }

    const dbName = extractDBName(DB_URL);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `simrszen_${dbName}_backup_${timestamp}.sql`;
    const backupFilePath = path.join(BACKUP_DIR, backupFileName);

    logger.info(`Starting backup of database: ${dbName}`);
    
    // Prepare pg_dump command
    const dbUrl = new URL(DB_URL);
    const user = dbUrl.username;
    const password = dbUrl.password;
    const host = dbUrl.hostname;
    const port = dbUrl.port;
    const db = dbUrl.pathname.replace(/^\//, ''); // Remove leading slash
    
    const pgDumpProcess = spawn('pg_dump', [
      '--dbname=' + DB_URL,
      '--verbose',
      '--clean',
      '--no-owner',
      '--no-privileges',
      '--format=custom',
      `--file=${backupFilePath}`
    ]);

    pgDumpProcess.stdout.on('data', (data) => {
      logger.info(`pg_dump stdout: ${data}`);
    });

    pgDumpProcess.stderr.on('data', (data) => {
      logger.error(`pg_dump stderr: ${data}`);
    });

    pgDumpProcess.on('close', (code) => {
      if (code === 0) {
        logger.info(`Backup completed successfully: ${backupFilePath}`);
        await cleanupOldBackups();
        resolve();
      } else {
        logger.error(`pg_dump process exited with code ${code}`);
        reject(new Error(`pg_dump failed with exit code ${code}`));
      }
    });
  });
};

// Function to clean up old backups
const cleanupOldBackups = async () => {
  try {
    const files = await fs.promises.readdir(BACKUP_DIR);
    const now = Date.now();
    
    files.forEach(file => {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = await fs.promises.stat(filePath);
      const ageInDays = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
      
      if (ageInDays > RETENTION_DAYS) {
        await fs.promises.unlink(filePath);
        logger.info(`Removed old backup: ${filePath}`);
      }
    });
  } catch (error) {
    logger.error('Error cleaning up old backups:', { error: (error as Error).message });
  }
};

// Main execution
const main = async () => {
  try {
    await performBackup();
    logger.info('Backup process completed successfully');
  } catch (error) {
    logger.error('Backup process failed:', { error: (error as Error).message });
    process.exit(1);
  }
};

// Execute backup
main();