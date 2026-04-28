import * as crypto from 'crypto';
import { gzipSync, gunzipSync } from 'zlib';

/**
 * Utilitas untuk kompresi dan enkripsi data BPJS
 */
export class BpjsCompressionEncryptionUtils {
  /**
   * Melakukan kompresi data menggunakan GZip
   */
  static compressWithGzip(data: string): Buffer {
    return gzipSync(Buffer.from(data, 'utf-8'));
  }

  /**
   * Melakukan dekompresi data menggunakan GZip
   */
  static decompressWithGzip(compressedData: Buffer): string {
    return gunzipSync(compressedData).toString('utf-8');
  }

  /**
   * Melakukan enkripsi AES-256-CBC
   */
  static encryptWithAES(data: string, secret: string): string {
    // Ambil 32 byte pertama dari hash SHA256 sebagai kunci
    const key = crypto.createHash('sha256').update(secret).digest().slice(0, 32);
    
    // Buat IV acak 16 byte
    const iv = crypto.randomBytes(16);
    
    // Buat cipher
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Gabungkan IV dan data terenkripsi, dipisahkan dengan titik dua
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Melakukan dekripsi AES-256-CBC
   */
  static decryptWithAES(encryptedData: string, secret: string): string {
    // Ambil 32 byte pertama dari hash SHA256 sebagai kunci
    const key = crypto.createHash('sha256').update(secret).digest().slice(0, 32);
    
    // Pisahkan IV dan data terenkripsi
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    // Buat decipher
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Menggabungkan kompresi dan enkripsi
   */
  static compressAndEncrypt(data: string, secret: string): string {
    const compressed = this.compressWithGzip(data);
    return this.encryptWithAES(compressed.toString('base64'), secret);
  }

  /**
   * Menggabungkan dekripsi dan dekompresi
   */
  static decryptAndDecompress(encryptedCompressedData: string, secret: string): string {
    const decrypted = this.decryptWithAES(encryptedCompressedData, secret);
    const compressedBuffer = Buffer.from(decrypted, 'base64');
    return this.decompressWithGzip(compressedBuffer);
  }

  /**
   * Membuat signature untuk data BPJS
   */
  static generateSignature(secret: string, timestamp: string): string {
    const combined = secret + timestamp;
    return crypto.createHash('sha256').update(combined).digest('hex');
  }

  /**
   * Membuat string autorisasi untuk request ke BPJS
   */
  static generateAuthorizationString(
    consID: string, 
    secret: string, 
    userAgent: string, 
    timestamp: string
  ): string {
    const signature = this.generateSignature(secret, timestamp);
    return `Basic ${Buffer.from(`${consID}:${signature}:${timestamp}`).toString('base64')}`;
  }
}