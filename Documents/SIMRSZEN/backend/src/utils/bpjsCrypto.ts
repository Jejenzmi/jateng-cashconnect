import * as crypto from 'crypto';
import LZString from 'lz-string';

/**
 * Utilitas untuk enkripsi dan dekripsi sesuai standar BPJS Kesehatan (VClaim / Antrean)
 */
export class BpjsCrypto {
  /**
   * Menghasilkan Timestamp dalam format UNIX timestamp (detik)
   */
  static getTimestamp(): string {
    return Math.floor(Date.now() / 1000).toString();
  }

  /**
   * Menghasilkan Signature (X-signature) menggunakan HMAC-SHA256
   */
  static generateSignature(consId: string, secretKey: string, timestamp: string): string {
    const data = `${consId}&${timestamp}`;
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(data);
    return hmac.digest('base64');
  }

  /**
   * Mendapatkan Key untuk dekripsi data response BPJS (32 byte hash dari consId + secretKey + timestamp)
   */
  static getDecryptKey(consId: string, secretKey: string, timestamp: string): string {
    const data = consId + secretKey + timestamp;
    const hash = crypto.createHash('sha256');
    hash.update(data, 'utf8');
    return hash.digest('hex'); // BPJS requires the key to be SHA256 of the concatenated string
  }

  /**
   * Dekripsi response dari API BPJS (AES-256-CBC, lalu LZ-String Decompress)
   */
  static decryptResponse(encryptedText: string, consId: string, secretKey: string, timestamp: string): any {
    try {
      // 1. Dapatkan Key (berupa string hex hasil hash)
      const keyHex = this.getDecryptKey(consId, secretKey, timestamp);
      const keyBuffer = Buffer.from(keyHex.substring(0, 32), 'utf8'); // Ambil 32 byte pertama
      const ivBuffer = Buffer.from(keyHex.substring(0, 16), 'utf8'); // Ambil 16 byte pertama untuk IV

      // 2. Dekripsi AES-256-CBC
      const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
      let decryptedBytes = decipher.update(encryptedText, 'base64', 'utf8');
      decryptedBytes += decipher.final('utf8');

      // 3. Dekompresi LZ-String
      const decompressedString = LZString.decompressFromEncodedURIComponent(decryptedBytes);
      
      if (!decompressedString) {
        throw new Error("Gagal melakukan dekompresi data BPJS");
      }

      // 4. Parse JSON
      return JSON.parse(decompressedString);
    } catch (error) {
      console.error('BPJS Decryption Error:', error);
      throw new Error('Gagal mendekripsi respons dari BPJS. Pastikan Cons ID, Secret Key, dan Timestamp sesuai.');
    }
  }
}
