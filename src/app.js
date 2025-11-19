import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/app.config.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

const app = express();

/**
 * Middleware setup
 */

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Requested-With', 'Accept', 'Origin'],
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * Routes
 */
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to RiverFlow SMTP Server',
    documentation: '/api',
  });
});

/**
 * Error handling
 */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

