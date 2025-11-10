import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { kv } from '@vercel/kv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to store API keys (local development only)
const API_KEYS_FILE = path.join(__dirname, '../../data/api-keys.json');
const KV_KEY = 'riverflow:api-keys';

// Detect environment
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;

/**
 * API Key Model
 * Quản lý các API keys với Vercel KV (production) hoặc file JSON (local)
 */
class ApiKeyModel {
  constructor() {
    this.keys = [];
    this.isVercel = isVercel;
    
    if (!this.isVercel) {
      this.ensureDataDirectory();
      this.loadKeys();
    }
  }

  /**
   * Đảm bảo thư mục data tồn tại (local only)
   */
  ensureDataDirectory() {
    const dataDir = path.dirname(API_KEYS_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  /**
   * Load API keys từ storage
   */
  async loadKeys() {
    try {
      if (this.isVercel) {
        // Load from Vercel KV
        const data = await kv.get(KV_KEY);
        this.keys = data || [];
      } else {
        // Load from file (local development)
        if (fs.existsSync(API_KEYS_FILE)) {
          const data = fs.readFileSync(API_KEYS_FILE, 'utf8');
          this.keys = JSON.parse(data);
        } else {
          this.keys = [];
          this.saveKeys();
        }
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
      this.keys = [];
    }
  }

  /**
   * Lưu API keys vào storage
   */
  async saveKeys() {
    try {
      if (this.isVercel) {
        // Save to Vercel KV
        await kv.set(KV_KEY, this.keys);
      } else {
        // Save to file (local development)
        fs.writeFileSync(API_KEYS_FILE, JSON.stringify(this.keys, null, 2));
      }
    } catch (error) {
      console.error('Error saving API keys:', error);
      throw new Error('Failed to save API keys');
    }
  }

  /**
   * Tạo API key mới
   */
  async createKey(name, description = '') {
    // Load latest keys first
    await this.loadKeys();
    
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
    await this.saveKeys();
    
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
  async validateKey(apiKey) {
    await this.loadKeys();
    const key = this.keys.find(k => k.key === apiKey && k.active);
    
    if (key) {
      // Update usage stats
      key.lastUsedAt = new Date().toISOString();
      key.usageCount += 1;
      await this.saveKeys();
      return true;
    }
    
    return false;
  }

  /**
   * Lấy tất cả API keys
   */
  async getAllKeys() {
    await this.loadKeys();
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
  async getKeyById(id) {
    await this.loadKeys();
    return this.keys.find(k => k.id === id);
  }

  /**
   * Revoke API key
   */
  async revokeKey(id) {
    await this.loadKeys();
    const key = this.keys.find(k => k.id === id);
    
    if (key) {
      key.active = false;
      await this.saveKeys();
      return true;
    }
    
    return false;
  }

  /**
   * Delete API key
   */
  async deleteKey(id) {
    await this.loadKeys();
    const index = this.keys.findIndex(k => k.id === id);
    
    if (index !== -1) {
      this.keys.splice(index, 1);
      await this.saveKeys();
      return true;
    }
    
    return false;
  }

  /**
   * Reactivate API key
   */
  async reactivateKey(id) {
    await this.loadKeys();
    const key = this.keys.find(k => k.id === id);
    
    if (key) {
      key.active = true;
      await this.saveKeys();
      return true;
    }
    
    return false;
  }
}

export default new ApiKeyModel();

