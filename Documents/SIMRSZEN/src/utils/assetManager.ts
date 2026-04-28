import { HOSPITAL_ASSETS_BUCKET, uploadFileToMinio, deleteFileFromMinio } from "@/config/minio";

/**
 * Upload file ke MinIO
 * @param file File yang akan diupload
 * @param folder Nama folder dalam bucket (contoh: "avatars", "documents", dll)
 * @param customFileName Nama file kustom (opsional, jika tidak disediakan maka akan digenerate otomatis)
 * @returns URL publik dari file yang diupload
 */
export async function uploadAsset(
  file: File, 
  folder: string, 
  customFileName?: string
): Promise<string> {
  try {
    // Validasi tipe file jika diperlukan
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipe file tidak didukung: ${file.type}`);
    }

    // Validasi ukuran file (maksimal 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Ukuran file maksimal 10MB');
    }

    // Buat nama file unik jika tidak disediakan
    const fileName = customFileName || `${folder}/${Date.now()}-${file.name}`;
    
    // Upload ke MinIO
    const publicUrl = await uploadFileToMinio(
      HOSPITAL_ASSETS_BUCKET,
      file,
      fileName,
      {
        'x-amz-meta-original-name': file.name,
        'x-amz-meta-uploaded-at': new Date().toISOString(),
        'x-amz-meta-content-type': file.type,
      }
    );

    return publicUrl;
  } catch (error) {
    console.error('Error uploading asset:', error);
    throw error;
  }
}

/**
 * Hapus file dari MinIO
 * @param fileName Nama file yang akan dihapus (termasuk path folder)
 */
export async function deleteAsset(fileName: string): Promise<void> {
  try {
    await deleteFileFromMinio(HOSPITAL_ASSETS_BUCKET, fileName);
  } catch (error) {
    console.error('Error deleting asset:', error);
    throw error;
  }
}

/**
 * Generate nama file unik
 * @param originalName Nama file asli
 * @param prefix Prefiks untuk nama file (opsional)
 * @returns Nama file unik
 */
export function generateUniqueFileName(originalName: string, prefix?: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = originalName.split('.').pop();
  const baseName = originalName.replace(/\.[^/.]+$/, ""); // Remove extension
  
  let fileName = `${timestamp}-${randomString}-${baseName}`;
  if (prefix) {
    fileName = `${prefix}/${fileName}`;
  }
  
  if (extension) {
    fileName += `.${extension}`;
  }
  
  return fileName;
}