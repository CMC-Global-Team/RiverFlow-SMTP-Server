import express from 'express';
import emailController from '../controllers/email.controller.js';
import { authenticateApiKey } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validator.middleware.js';
import {
  sendEmailValidation,
  sendVerificationEmailValidation,
  sendResetPasswordEmailValidation,
} from '../validators/email.validator.js';

const router = express.Router();

/**
 * @route   GET /api/email/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', emailController.healthCheck);

/**
 * @route   POST /api/email/send
 * @desc    Gửi email chung
 * @access  Private (require API key)
 */
router.post(
  '/send',
  authenticateApiKey,
  sendEmailValidation,
  validateRequest,
  emailController.sendEmail
);

/**
 * @route   POST /api/email/verification
 * @desc    Gửi email xác thực tài khoản
 * @access  Private (require API key)
 */
router.post(
  '/verification',
  authenticateApiKey,
  sendVerificationEmailValidation,
  validateRequest,
  emailController.sendVerificationEmail
);

/**
 * @route   POST /api/email/reset-password
 * @desc    Gửi email reset password
 * @access  Private (require API key)
 */
router.post(
  '/reset-password',
  authenticateApiKey,
  sendResetPasswordEmailValidation,
  validateRequest,
  emailController.sendResetPasswordEmail
);

export default router;

