import { config } from '../config/app.config.js';

/**
 * Middleware để xác thực API key
 * Kiểm tra header X-API-Key
 */
export const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key is required',
    });
  }

  if (apiKey !== config.apiKey) {
    return res.status(403).json({
      success: false,
      message: 'Invalid API key',
    });
  }

  next();
};

export default authenticateApiKey;

