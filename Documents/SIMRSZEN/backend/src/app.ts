import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { commonRoutes } from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { limiter, securityHeaders, validateAndSanitize } from './middleware/security';

const app = express();

// Security middleware
app.use(securityHeaders); // Apply security headers
app.use(limiter); // Apply rate limiting
app.use(validateAndSanitize); // Apply input validation and sanitization

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Enable CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:8080,http://localhost:3000')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
}));


// Request logging
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', commonRoutes);

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'SIMRS ZEN',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use(errorHandler);

// 404 handler
app.use(notFound);

export default app;