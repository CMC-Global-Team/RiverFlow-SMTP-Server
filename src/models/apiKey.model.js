import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to store API keys
const API_KEYS_FILE = path.join(__dirname, '../../data/api-keys.json');

/**
 * API Key Model
 * Quản lý các API keys trong file JSON
 */
class ApiKeyModel {
  constructor() {
    this.ensureDataDirectory();
    this.loadKeys();
  }

  /**
   * Đảm bảo thư mục data tồn tại
   */
  ensureDataDirectory() {
    const dataDir = path.dirname(API_KEYS_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  /**
   * Load API keys từ file
   */
  loadKeys() {
    try {
      if (fs.existsSync(API_KEYS_FILE)) {
        const data = fs.readFileSync(API_KEYS_FILE, 'utf8');
        this.keys = JSON.parse(data);
      } else {
        // Initialize với master key từ env
        this.keys = [];
        this.saveKeys();
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
      this.keys = [];
    }
  }

  /**
   * Lưu API keys vào file
   */
  saveKeys() {
    try {
      fs.writeFileSync(API_KEYS_FILE, JSON.stringify(this.keys, null, 2));
    } catch (error) {
      console.error('Error saving API keys:', error);
      throw new Error('Failed to save API keys');
    }
  }

  /**
   * Tạo API key mới
   */
  createKey(name, description = '') {
    const key = {
      id: Date.now().toString(),
      key: this.generateRandomKey(),
      name,
      description,
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
      usageCount: 0,
      active: true,
    };

    this.keys.push(key);
    this.saveKeys();
    
    return key;
  }

  /**
   * Generate random API key
   */
  generateRandomKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 48;
    let result = 'rfsk_'; // RiverFlow SMTP Key prefix
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  /**
   * Validate API key
   */
  validateKey(apiKey) {
    const key = this.keys.find(k => k.key === apiKey && k.active);
    
    if (key) {
      // Update usage stats
      key.lastUsedAt = new Date().toISOString();
      key.usageCount += 1;
      this.saveKeys();
      return true;
    }
    
    return false;
  }

  /**
   * Lấy tất cả API keys
   */
  getAllKeys() {
    return this.keys.map(k => ({
      id: k.id,
      name: k.name,
      description: k.description,
      key: k.key.substring(0, 15) + '...' + k.key.substring(k.key.length - 4), // Masked
      createdAt: k.createdAt,
      lastUsedAt: k.lastUsedAt,
      usageCount: k.usageCount,
      active: k.active,
    }));
  }

  /**
   * Lấy API key theo ID
   */
  getKeyById(id) {
    return this.keys.find(k => k.id === id);
  }

  /**
   * Revoke API key
   */
  revokeKey(id) {
    const key = this.keys.find(k => k.id === id);
    
    if (key) {
      key.active = false;
      this.saveKeys();
      return true;
    }
    
    return false;
  }

  /**
   * Delete API key
   */
  deleteKey(id) {
    const index = this.keys.findIndex(k => k.id === id);
    
    if (index !== -1) {
      this.keys.splice(index, 1);
      this.saveKeys();
      return true;
    }
    
    return false;
  }

  /**
   * Reactivate API key
   */
  reactivateKey(id) {
    const key = this.keys.find(k => k.id === id);
    
    if (key) {
      key.active = true;
      this.saveKeys();
      return true;
    }
    
    return false;
  }
}

export default new ApiKeyModel();

