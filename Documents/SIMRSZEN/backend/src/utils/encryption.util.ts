import * as crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = process.env.ENCRYPTION_KEY ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex') : crypto.randomBytes(32);
const ivLength = 16; // For GCM, this is always 12 bytes, but we'll keep 16 for compatibility

/**
 * Fungsi untuk mengenkripsi teks
 */
export function encrypt(text: string): string {
  try {
    // Generate a random IV for each encryption
    const iv = crypto.randomBytes(ivLength);
    
    // Create cipher instance
    const cipher = crypto.createCipher(algorithm, key);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Get auth tag for GCM mode
    const authTag = cipher.getAuthTag();
    
    // Combine IV, auth tag, and encrypted data
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Fungsi untuk mendekripsi teks
 */
export function decrypt(encryptedData: string): string {
  try {
    // Split the encrypted data to extract IV, auth tag, and encrypted text
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts.shift()!, 'hex');
    const authTag = Buffer.from(parts.shift()!, 'hex');
    const encrypted = parts.join(':');
    
    // Create decipher instance
    const decipher = crypto.createDecipher(algorithm, key);
    
    // Set auth tag for GCM mode
    decipher.setAuthTag(authTag);
    
    // Decrypt the data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Fungsi untuk membuat hash dari password atau data sensitif
 */
export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}