import app from './app.js';
import { config } from './config/app.config.js';
import { verifyConnection } from './config/smtp.config.js';

/**
 * Start server
 */
const startServer = async () => {
  try {
    // Verify SMTP connection
    const smtpReady = await verifyConnection();
    
    if (!smtpReady) {
      console.warn('⚠️  Warning: SMTP connection could not be verified');
      console.warn('⚠️  Server will start but email sending may fail');
    }

    // Start listening
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log('🚀 RiverFlow SMTP Server');
      console.log('='.repeat(50));
      console.log(`📧 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`📬 SMTP Host: ${config.smtp.host}:${config.smtp.port}`);
      console.log(`📨 From Email: ${config.smtp.from}`);
      console.log(`🔐 CORS Origins: ${config.corsOrigins.join(', ')}`);
      console.log('='.repeat(50));
      console.log(`📍 API Documentation: http://localhost:${PORT}/api`);
      console.log(`💚 Health Check: http://localhost:${PORT}/api/email/health`);
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();

