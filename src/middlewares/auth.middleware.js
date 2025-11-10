import { config } from '../config/app.config.js';
import apiKeyModel from '../models/apiKey.model.js';

/**
 * Middleware để xác thực API key
 * Kiểm tra header X-API-Key với database hoặc default key
 */
export const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key is required',
    });
  }

  // Kiểm tra với default key từ env (backward compatibility)
  if (apiKey === config.apiKey) {
    next();
    return;
  }

  // Kiểm tra với API keys trong database
  if (apiKeyModel.validateKey(apiKey)) {
    next();
    return;
  }

  return res.status(403).json({
    success: false,
    message: 'Invalid API key',
  });
};

export default authenticateApiKey;

