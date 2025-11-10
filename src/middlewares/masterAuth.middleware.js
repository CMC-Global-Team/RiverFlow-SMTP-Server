import { config } from '../config/app.config.js';

/**
 * Middleware để xác thực Master API key
 * Chỉ Master key mới được phép quản lý API keys
 */
export const authenticateMasterKey = (req, res, next) => {
  const masterKey = req.headers['x-master-key'];

  if (!masterKey) {
    return res.status(401).json({
      success: false,
      message: 'Master API key is required',
    });
  }

  if (masterKey !== config.masterApiKey) {
    return res.status(403).json({
      success: false,
      message: 'Invalid Master API key',
    });
  }

  next();
};

export default authenticateMasterKey;

