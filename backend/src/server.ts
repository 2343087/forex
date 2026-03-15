import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// ═══════════════════════════════════════
// SECURITY: Validasi env kritis saat startup
// ═══════════════════════════════════════
const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'];
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.error(`[FATAL] Environment variable ${key} is NOT SET. Server will NOT start.`);
    process.exit(1);
  }
}

const app: Express = express();
const port = process.env.PORT || 5001;

// ═══════════════════════════════════════
// SECURITY MIDDLEWARE LAYER
// ═══════════════════════════════════════

// 1. Helmet — HTTP Security Headers (XSS, clickjacking, MIME sniffing, etc.)
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for API server compat
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow static file access
}));

// 2. CORS — Whitelist origins only (NO wild-open)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, server-to-server, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 3. Compression — Gzip responses for speed (penting kalo jutaan request)
app.use(compression());

// 4. Body size limit — Prevent payload bombing / DoS
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 5. Morgan — Request logging (only in dev)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 6. Global Rate Limiter — Anti brute-force (100 req/15min per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Max 300 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak request. Coba lagi dalam 15 menit.' },
});
app.use(globalLimiter);

// 7. Auth Rate Limiter — Extra strict untuk login/register (anti brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Max 20 login attempts per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' },
});

// ═══════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import adminRoutes from './routes/adminRoutes';
import uploadRoutes from './routes/uploadRoutes';
import paymentRoutes from './routes/paymentRoutes';
import profileRoutes from './routes/profileRoutes';

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));

// Health Check
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Akademi Edukasi Forex API — Running & Secured 🔥', timestamp: new Date().toISOString() });
});

// ═══════════════════════════════════════
// API ROUTES (With Rate Limiters)
// ═══════════════════════════════════════
app.use('/api/auth', authLimiter, authRoutes);       // Extra strict rate limit
app.use('/api/courses', courseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/profile', profileRoutes);

// ═══════════════════════════════════════
// GLOBAL ERROR HANDLER (Catch-all)
// ═══════════════════════════════════════
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  // Never expose stack traces to client
  console.error(`[Global Error] ${req.method} ${req.path}:`, err.message);
  res.status(500).json({ error: 'Internal server error.' });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route tidak ditemukan.' });
});

// Start Server
app.listen(port, () => {
  console.log(`[server]: Akademi Edukasi Forex API running at http://localhost:${port}`);
  console.log(`[server]: CORS allowed: ${allowedOrigins.join(', ')}`);
  console.log(`[server]: Rate limiting: ACTIVE ✅`);
});

export { app };
