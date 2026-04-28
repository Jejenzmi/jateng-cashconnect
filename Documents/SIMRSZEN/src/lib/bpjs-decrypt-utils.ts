import * as crypto from 'crypto';
// Catatan: LZ-String mungkin perlu diinstal terpisah
// import * as LZString from 'lz-string';

/**
 * Utilitas untuk mendekripsi respons dari layanan BPJS
 */
export class BpjsDecryptUtils {
  /**
   * Mendekripsi respons terenkripsi dari layanan BPJS
   * 
   * @param encryptedData Data terenkripsi dari BPJS
   * @param consumerId ID consumer dari BPJS
   * @param consumerSecret Secret key dari BPJS
   * @param timestamp Timestamp yang digunakan saat permintaan
   * @returns Data yang telah didekripsi
   */
  static decryptBpjsResponse(
    encryptedData: string,
    consumerId: string,
    consumerSecret: string,
    timestamp: number
  ): any {
    try {
      // Buat kunci dari gabungan: consumerId + consumerSecret + timestamp
      const keyString = `${consumerId}${consumerSecret}${timestamp}`;
      
      // Hash kunci menggunakan SHA-256 untuk mendapatkan kunci 32-byte
      const key = crypto.createHash('sha256').update(keyString).digest();
      
      // Ambil 16 byte pertama dari hash untuk digunakan sebagai IV
      const iv = key.slice(0, 16);
      
      // Dekripsi menggunakan AES-256-CBC
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      
      let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      
      // Saat ini hanya mengembalikan data yang didekripsi
      // Jika implementasi kompresi LZ-String tersedia, maka:
      // const decompressed = LZString.decompressFromUTF16(decrypted);
      // return JSON.parse(decompressed);
      
      return decrypted;
    } catch (error) {
      console.error('Error during BPJS response decryption:', error);
      throw error;
    }
  }

  /**
   * Fungsi helper untuk membuat key dan IV dari kombinasi informasi
   */
  static generateKeyAndIV(consumerId: string, consumerSecret: string, timestamp: number): { key: Buffer, iv: Buffer } {
    const keyString = `${consumerId}${consumerSecret}${timestamp}`;
    
    // Hash kunci menggunakan SHA-256 untuk mendapatkan kunci 32-byte
    const key = crypto.createHash('sha256').update(keyString).digest();
    
    // Ambil 16 byte pertama dari hash untuk digunakan sebagai IV
    const iv = key.slice(0, 16);
    
    return { key, iv };
  }

  /**
   * Fungsi untuk menggabungkan semua langkah dekripsi menjadi satu fungsi
   */
  static fullDecrypt(
    encryptedData: string,
    consumerId: string,
    consumerSecret: string,
    timestamp: number
  ): any {
    try {
      // Generate key and IV
      const { key, iv } = this.generateKeyAndIV(consumerId, consumerSecret, timestamp);
      
      // Decrypt using AES-256-CBC
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      
      let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      
      // Jika LZ-String tersedia, tambahkan dekompresi
      // const decompressed = LZString.decompressFromUTF16(decrypted);
      
      // Parse JSON
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Full decryption failed:', error);
      throw error;
    }
  }
}

/**
 * Fungsi untuk mengintegrasikan dekripsi ke dalam permintaan BPJS
 */
export function createDecryptedBpjsResponseHandler(
  consumerId: string,
  consumerSecret: string,
  timestamp: number
) {
  return (responseData: string) => {
    return BpjsDecryptUtils.decryptBpjsResponse(
      responseData,
      consumerId,
      consumerSecret,
      timestamp
    );
  };
}