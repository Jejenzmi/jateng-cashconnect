import { Client } from 'minio';

// Konfigurasi MinIO
const minioClient = new Client({
  endPoint: process.env.VITE_MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.VITE_MINIO_PORT || '9000'),
  useSSL: process.env.VITE_MINIO_USE_SSL === 'true',
  accessKey: process.env.VITE_MINIO_ACCESS_KEY || '',
  secretKey: process.env.VITE_MINIO_SECRET_KEY || '',
});

// Nama bucket untuk menyimpan asset rumah sakit
const HOSPITAL_ASSETS_BUCKET = process.env.VITE_MINIO_HOSPITAL_ASSETS_BUCKET || 'hospital-assets';

// Fungsi untuk memastikan bucket ada
async function ensureBucketExists(bucketName: string): Promise<void> {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName);
      console.log(`Bucket ${bucketName} created successfully`);
    }
  } catch (error) {
    console.error(`Error checking/creating bucket ${bucketName}:`, error);
    throw error;
  }
}

// Fungsi untuk upload file ke MinIO
async function uploadFileToMinio(
  bucketName: string,
  file: File,
  fileName: string,
  metadata?: Record<string, string>
): Promise<string> {
  try {
    // Pastikan bucket ada
    await ensureBucketExists(bucketName);

    // Convert file ke buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload ke MinIO
    await minioClient.putObject(
      bucketName,
      fileName,
      buffer,
      buffer.length,
      metadata
    );

    // Generate URL publik
    const protocol = process.env.VITE_MINIO_USE_SSL === 'true' ? 'https' : 'http';
    const host = process.env.VITE_MINIO_PUBLIC_HOST || process.env.VITE_MINIO_ENDPOINT;
    const port = process.env.VITE_MINIO_PUBLIC_PORT || process.env.VITE_MINIO_PORT;
    
    const publicUrl = `${protocol}://${host}:${port}/${bucketName}/${fileName}`;
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file to MinIO:', error);
    throw error;
  }
}

// Fungsi untuk menghapus file dari MinIO
async function deleteFileFromMinio(bucketName: string, fileName: string): Promise<void> {
  try {
    await minioClient.removeObject(bucketName, fileName);
  } catch (error) {
    console.error('Error deleting file from MinIO:', error);
    throw error;
  }
}

export { minioClient, HOSPITAL_ASSETS_BUCKET, uploadFileToMinio, deleteFileFromMinio };