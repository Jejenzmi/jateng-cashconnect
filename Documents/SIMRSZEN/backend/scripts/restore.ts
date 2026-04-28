import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '../src/utils/logger';

const BACKUP_DIR = process.env.BACKUP_LOCATION || '/backups/simrszen';
const DB_URL = process.env.DATABASE_URL;

// Extract database name from connection string
const extractDBName = (connectionString: string): string => {
  // PostgreSQL connection string format: postgresql://user:pass@host:port/dbname
  const dbName = connectionString.split('/').pop();
  if (!dbName) {
    throw new Error('Could not extract database name from connection string');
  }
  return dbName;
};

// Function to list available backups
const listBackups = (): string[] => {
  if (!fs.existsSync(BACKUP_DIR)) {
    logger.error(`Backup directory does not exist: ${BACKUP_DIR}`);
    return [];
  }

  const files = fs.readdirSync(BACKUP_DIR);
  const backupFiles = files.filter(file => file.endsWith('.sql') && file.includes('_backup_'));
  return backupFiles.sort().reverse(); // Most recent first
};

// Function to perform the restore
const performRestore = (backupFileName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!DB_URL) {
      reject(new Error('DATABASE_URL environment variable not set'));
      return;
    }

    const backupFilePath = path.join(BACKUP_DIR, backupFileName);
    
    // Check if backup file exists
    try {
      await fs.access(backupFilePath);
    } catch (error) {
      reject(new Error(`Backup file does not exist: ${backupFilePath}`));
      return;
    }
    
    // Verify file is a valid backup
    try {
      const stats = await fs.stat(backupFilePath);
      if (stats.size === 0) {
        reject(new Error(`Backup file is empty: ${backupFilePath}`));
        return;
      }
    } catch (error) {
      reject(new Error(`Error reading backup file: ${error}`));
      return;
    }

    const dbName = extractDBName(DB_URL);

    logger.info(`Starting restore of database: ${dbName} from: ${backupFileName}`);
    
    // Set environment variables for pg_restore
    const dbParts = DB_URL.replace('postgresql://', '').split('@');
    const [credentials, hostPortDb] = dbParts;
    const [user, password] = credentials.split(':');
    
    const envVars = {
      ...process.env,
      PGPASSWORD: password
    };

    logger.info(`Using database user: ${user}`);
    
    // Prepare pg_restore command
    const pgRestoreProcess = spawn('pg_restore', [
      `--dbname=${DB_URL}`,
      '--verbose',
      '--clean',
      '--no-owner',
      '--no-privileges',
      '--format=c', // Custom format
      backupFilePath
    ], {
      env: envVars
    });

    pgRestoreProcess.stdout.on('data', (data) => {
      logger.info(`pg_restore stdout: ${data}`);
    });

    pgRestoreProcess.stderr.on('data', (data) => {
      logger.error(`pg_restore stderr: ${data}`);
    });

    pgRestoreProcess.on('close', (code) => {
      if (code === 0) {
        logger.info(`Restore completed successfully from: ${backupFilePath}`);
        resolve();
      } else {
        logger.error(`pg_restore process exited with code ${code}`);
        reject(new Error(`pg_restore failed with exit code ${code}`));
      }
    });
  });
};

// Main execution
const main = async () => {
  const args = process.argv.slice(2);
  const backupFileName = args[0];

  if (!backupFileName) {
    console.log('Usage: npm run restore <backup-file-name>');
    console.log('\nAvailable backup files:');
    const backups = listBackups();
    if (backups.length === 0) {
      console.log('No backup files found in ' + BACKUP_DIR);
    } else {
      backups.forEach((file, index) => {
        const dateStr = file.match(/_(\d{8}_\d{6})\.sql/)?.[1]?.replace('_', ' ')?.replace('_', ':') || 'Unknown date';
        console.log(`${index + 1}. ${file} (${dateStr})`);
      });
    }
    return;
  }

  try {
    await performRestore(backupFileName);
    logger.info('Restore process completed successfully');
  } catch (error) {
    logger.error('Restore process failed:', { error: (error as Error).message });
    process.exit(1);
  }
};

// Execute restore
main();