import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';

// Route imports
import chatRoutes from './routes/chat.js';
import timelineRoutes from './routes/timeline.js';
import scenarioRoutes from './routes/scenarios.js';
import pollingRoutes from './routes/polling.js';
import translateRoutes from './routes/translate.js';

dotenv.config();

import { loadPollingData } from './services/pollingService.js';

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

loadPollingData();

// ---- CORS (must be BEFORE helmet) ----
const ALLOWED_ORIGINS = [CLIENT_URL, 'http://127.0.0.1:5173', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin.endsWith('.netlify.app') || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
}));

// ---- Security Middleware (after CORS) ----
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(compression());
app.use(express.json({ limit: '1mb' }));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});
app.use(globalLimiter);

// ---- Health Check ----
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CivicQ API', timestamp: new Date().toISOString() });
});

// ---- Routes ----
app.use('/api/chat', chatRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/polling', pollingRoutes);
app.use('/api/translate', translateRoutes);

// ---- Global Error Handler ----
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// ---- 404 ----
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Accepting requests from ${CLIENT_URL}`);
});

export default app;
