import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useState } from 'react';
interface CRUDOperations<T> {
  create: (data: Partial<T>) => Promise<T>;
  read: (id: string) => Promise<T | null>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<void>;
  list: (filters?: Record<string, any>, limit?: number, offset?: number) => Promise<T[]>;
}

const useCRUDOperations = <T,>(tableName: string, idField: string = 'id'): CRUDOperations<T> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sanitizeInput = (value: any): string => {
    if (typeof value === 'string') {
      return value.replace(/'/g, "''"); // Escape single quotes for PostgreSQL
    }
    return value;
  };

  const create = async (data: Partial<T>): Promise<T> => {
    try {
      setLoading(true);
      setError(null);

      // Build dynamic insert query
      const columns = Object.keys(data).filter(key => data[key as keyof Partial<T>] !== undefined);
      const values = columns.map(col => {
        const value = data[col as keyof Partial<T>];
        return typeof value === 'object' && value !== null 
          ? JSON.stringify(value) 
          : value;
      });

      // Format the query with getApi template literal
      let query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (`;
      for (let i = 0; i < values.length; i++) {
        if (i > 0) query += ', ';
        query += getApi.escape(String(values[i]));
      }
      query += ') RETURNING *';

      const result = await getApi<T[]>(query);
      
      if (result.length === 0) {
        throw new Error('Gagal membuat data');
      }

      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal membuat data');
      console.error(`Error creating ${tableName}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const read = async (id: string): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await getApi<T[]>(`
        SELECT * FROM ${tableName} WHERE ${idField} = ${id}
      `);

      return result.length > 0 ? result[0] : null;
    } catch (err: any) {
      setError(err.message || 'Gagal membaca data');
      console.error(`Error reading ${tableName}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: Partial<T>): Promise<T> => {
    try {
      setLoading(true);
      setError(null);

      // Build dynamic update query
      const columns = Object.keys(data).filter(key => data[key as keyof Partial<T>] !== undefined);
      if (columns.length === 0) {
        throw new Error('Tidak ada data untuk diperbarui');
      }

      let query = `UPDATE ${tableName} SET `;
      const updates = [];
      for (const col of columns) {
        const value = data[col as keyof Partial<T>];
        const escapedValue = typeof value === 'object' && value !== null 
          ? JSON.stringify(value) 
          : value;
        updates.push(`${col} = ${getApi.escape(String(escapedValue))}`);
      }
      query += updates.join(', ');
      query += ` WHERE ${idField} = ${id}`;

      query += ' RETURNING *';

      const result = await getApi<T[]>(query);

      if (result.length === 0) {
        throw new Error('Gagal memperbarui data');
      }

      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui data');
      console.error(`Error updating ${tableName}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const del = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await getApi(`
        DELETE FROM ${tableName} WHERE ${idField} = ${id}
      `);
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus data');
      console.error(`Error deleting ${tableName}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const list = async (
    filters?: Record<string, any>, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<T[]> => {
    try {
      setLoading(true);
      setError(null);

      let query = `SELECT * FROM ${tableName}`;

      if (filters && Object.keys(filters).length > 0) {
        const conditions = [];
        for (const [key, value] of Object.entries(filters)) {
          if (value !== undefined && value !== null) {
            if (typeof value === 'string') {
              conditions.push(`${key} = ${getApi.escape(value)}`);
            } else if (typeof value === 'object') {
              conditions.push(`${key} = ${getApi.escape(JSON.stringify(value))}`);
            } else {
              conditions.push(`${key} = ${getApi.escape(String(value))}`);
            }
          }
        }
        if (conditions.length > 0) {
          query += ` WHERE ${conditions.join(' AND ')}`;
        }
      }

      query += ` ORDER BY ${idField} DESC LIMIT ${limit} OFFSET ${offset}`;

      const result = await getApi<T[]>(query);
      return result;
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil daftar data');
      console.error(`Error listing ${tableName}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    create,
    read,
    update,
    delete: del,
    list
  };
};

export default useCRUDOperations;