import express from 'express';
import apiKeyController from '../controllers/apiKey.controller.js';
import { authenticateMasterKey } from '../middlewares/masterAuth.middleware.js';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validator.middleware.js';

const router = express.Router();

// Validation rules
const createKeyValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must not exceed 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
];

/**
 * Tất cả routes đều yêu cầu Master API key
 */
router.use(authenticateMasterKey);

/**
 * @route   POST /api/keys
 * @desc    Tạo API key mới
 * @access  Private (Master key required)
 */
router.post(
  '/',
  createKeyValidation,
  validateRequest,
  apiKeyController.createKey
);

/**
 * @route   GET /api/keys
 * @desc    Lấy danh sách tất cả API keys
 * @access  Private (Master key required)
 */
router.get('/', apiKeyController.getAllKeys);

/**
 * @route   GET /api/keys/:id
 * @desc    Lấy thông tin API key theo ID
 * @access  Private (Master key required)
 */
router.get('/:id', apiKeyController.getKeyById);

/**
 * @route   PUT /api/keys/:id/revoke
 * @desc    Revoke API key
 * @access  Private (Master key required)
 */
router.put('/:id/revoke', apiKeyController.revokeKey);

/**
 * @route   PUT /api/keys/:id/reactivate
 * @desc    Reactivate API key
 * @access  Private (Master key required)
 */
router.put('/:id/reactivate', apiKeyController.reactivateKey);

/**
 * @route   DELETE /api/keys/:id
 * @desc    Xóa API key
 * @access  Private (Master key required)
 */
router.delete('/:id', apiKeyController.deleteKey);

export default router;

