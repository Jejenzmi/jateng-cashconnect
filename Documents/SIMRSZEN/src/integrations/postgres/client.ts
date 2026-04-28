// Mock postgres client untuk frontend
// NOTE: Di frontend, kita tidak seharusnya mengakses database secara langsung
// Ini hanya untuk mencegah error saat ini, seharusnya diganti dengan API calls

console.warn("Peringatan: postgresClient sedang digunakan di lingkungan frontend. Ini seharusnya hanya digunakan di backend.");

// Fungsi mock untuk mencegah error
export const postgresClient = {
  async execute(query: string) {
    console.error(`Tried to execute query in frontend: ${query}`);
    console.warn("PostgreSQL client should only be used in backend, not frontend.");
    return [];
  },
  async query(strings: TemplateStringsArray, ...values: any[]) {
    const query = strings.reduce((acc, string, i) => {
      return acc + string + (values[i] !== undefined ? values[i] : '');
    }, '');
    
    console.error(`Tried to execute query in frontend: ${query}`);
    console.warn("PostgreSQL client should only be used in backend, not frontend.");
    return Promise.resolve([]);
  }
} as any;

// Template literal handler untuk mendukung sintaks postgresClient`query`
export const postgres = (strings: TemplateStringsArray, ...values: any[]) => {
  return postgresClient.query(strings, ...values);
};

// Fungsi mock untuk menguji koneksi
export const testConnection = async () => {
  console.warn("testConnection called in frontend - should only be used in backend");
  return false; // Selalu gagal di frontend
};

// Fungsi mock untuk menutup koneksi
export const closeConnection = async () => {
  console.warn("closeConnection called in frontend - should only be used in backend");
  return Promise.resolve();
};