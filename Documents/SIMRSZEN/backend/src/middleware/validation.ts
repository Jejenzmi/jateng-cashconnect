import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Middleware validasi umum untuk standarisasi validasi input
 * @param schema - Skema Zod untuk validasi
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validasi request dengan skema yang diberikan
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof Error) {
        // Respons error validasi dengan format standar
        return res.status(400).json({
          success: false,
          message: 'Validasi gagal',
          errors: Array.isArray(error) ? error : [{ message: error.message }]
        });
      }
      // Respons error internal server
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat validasi input'
      });
    }
  };
};