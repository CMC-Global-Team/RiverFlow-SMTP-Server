import apiKeyModel from '../models/apiKey.model.js';

/**
 * API Key Controller
 * Quản lý các API keys
 */
class ApiKeyController {
  /**
   * Tạo API key mới
   * POST /api/keys
   */
  async createKey(req, res, next) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Name is required',
        });
      }

      const key = apiKeyModel.createKey(name, description);

      res.status(201).json({
        success: true,
        message: 'API key created successfully',
        data: {
          id: key.id,
          key: key.key, // Show full key only once
          name: key.name,
          description: key.description,
          createdAt: key.createdAt,
          warning: 'Save this key securely. You will not be able to see it again.',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách tất cả API keys
   * GET /api/keys
   */
  async getAllKeys(req, res, next) {
    try {
      const keys = apiKeyModel.getAllKeys();

      res.status(200).json({
        success: true,
        count: keys.length,
        data: keys,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Revoke API key
   * PUT /api/keys/:id/revoke
   */
  async revokeKey(req, res, next) {
    try {
      const { id } = req.params;

      const success = apiKeyModel.revokeKey(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'API key not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'API key revoked successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reactivate API key
   * PUT /api/keys/:id/reactivate
   */
  async reactivateKey(req, res, next) {
    try {
      const { id } = req.params;

      const success = apiKeyModel.reactivateKey(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'API key not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'API key reactivated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa API key
   * DELETE /api/keys/:id
   */
  async deleteKey(req, res, next) {
    try {
      const { id } = req.params;

      const success = apiKeyModel.deleteKey(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'API key not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'API key deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy thông tin API key theo ID
   * GET /api/keys/:id
   */
  async getKeyById(req, res, next) {
    try {
      const { id } = req.params;

      const key = apiKeyModel.getKeyById(id);

      if (!key) {
        return res.status(404).json({
          success: false,
          message: 'API key not found',
        });
      }

      // Don't return full key for security
      res.status(200).json({
        success: true,
        data: {
          id: key.id,
          name: key.name,
          description: key.description,
          key: key.key.substring(0, 15) + '...' + key.key.substring(key.key.length - 4),
          createdAt: key.createdAt,
          lastUsedAt: key.lastUsedAt,
          usageCount: key.usageCount,
          active: key.active,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ApiKeyController();

