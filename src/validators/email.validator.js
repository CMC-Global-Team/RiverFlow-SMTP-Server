import { body } from 'express-validator';

/**
 * Validation rules cho việc gửi email
 */
export const sendEmailValidation = [
  body('to')
    .isEmail()
    .withMessage('Invalid email address'),
  
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ max: 255 })
    .withMessage('Subject must not exceed 255 characters'),
  
  body('html')
    .trim()
    .notEmpty()
    .withMessage('Email content (html) is required'),
  
  body('text')
    .optional()
    .trim(),
];

/**
 * Validation rules cho việc gửi email xác thực
 */
export const sendVerificationEmailValidation = [
  body('to')
    .isEmail()
    .withMessage('Invalid email address'),
  
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Token is required'),
  
  body('frontendUrl')
    .trim()
    .notEmpty()
    .withMessage('Frontend URL is required')
    .isURL()
    .withMessage('Invalid frontend URL'),
];

/**
 * Validation rules cho việc gửi email reset password
 */
export const sendResetPasswordEmailValidation = [
  body('to')
    .isEmail()
    .withMessage('Invalid email address'),
  
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Token is required'),
  
  body('frontendUrl')
    .trim()
    .notEmpty()
    .withMessage('Frontend URL is required')
    .isURL()
    .withMessage('Invalid frontend URL'),
];

export default {
  sendEmailValidation,
  sendVerificationEmailValidation,
  sendResetPasswordEmailValidation,
};

