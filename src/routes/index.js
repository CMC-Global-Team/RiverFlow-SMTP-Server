import express from 'express';
import emailRoutes from './email.routes.js';

const router = express.Router();

/**
 * Root route
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'RiverFlow SMTP Server API',
    version: '1.0.0',
    endpoints: {
      health: '/api/email/health',
      sendEmail: '/api/email/send',
      verification: '/api/email/verification',
      resetPassword: '/api/email/reset-password',
    },
  });
});

/**
 * Email routes
 */
router.use('/email', emailRoutes);

export default router;

