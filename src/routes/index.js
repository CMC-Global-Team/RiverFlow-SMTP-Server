import express from 'express';
import emailRoutes from './email.routes.js';
import apiKeyRoutes from './apiKey.routes.js';

const router = express.Router();

/**
 * Root route
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'RiverFlow SMTP Server API',
    version: '1.1.0',
    endpoints: {
      email: {
        health: '/api/email/health',
        sendEmail: '/api/email/send',
        verification: '/api/email/verification',
        resetPassword: '/api/email/reset-password',
      },
      apiKeys: {
        create: 'POST /api/keys',
        list: 'GET /api/keys',
        get: 'GET /api/keys/:id',
        revoke: 'PUT /api/keys/:id/revoke',
        reactivate: 'PUT /api/keys/:id/reactivate',
        delete: 'DELETE /api/keys/:id',
        note: 'All key management endpoints require X-Master-Key header',
      },
    },
  });
});

/**
 * Email routes
 */
router.use('/email', emailRoutes);

/**
 * API Key management routes
 */
router.use('/keys', apiKeyRoutes);

export default router;

