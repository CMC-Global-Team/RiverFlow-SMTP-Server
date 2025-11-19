import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from 'redis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to store API keys (local development only)
const API_KEYS_FILE = path.join(__dirname, '../../data/api-keys.json');
const KV_KEY = 'riverflow:api-keys';

// Detect environment
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
const hasRedisUrl = !!process.env.REDIS_URL;
const hasVercelKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

// Redis client (for external Redis like Redis Cloud)
let redisClient = null;

// Lazy import Vercel KV (only when needed)
let kv = null;

/**
 * Get Redis client (external Redis like Redis Cloud)
 */
const getRedisClient = async () => {
  if (!hasRedisUrl) return null;
  
  if (!redisClient) {
    try {
      redisClient = createClient({
        url: process.env.REDIS_URL,
      });
      
      redisClient.on('error', (err) => {
        console.error('Redis Client Error:', err);
      });
      
      await redisClient.connect();
      console.log('Redis Cloud connected successfully');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw new Error(`Redis connection failed: ${error.message}`);
    }
  }
  
  return redisClient;
};

/**
 * Get Vercel KV client
 */
const getKV = async () => {
  if (!hasVercelKV) return null;
  
  if (!kv) {
    try {
      const { kv: kvClient } = await import('@vercel/kv');
      kv = kvClient;
      console.log('✅ Vercel KV initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Vercel KV:', error);
      throw new Error('Vercel KV initialization failed. Check KV connection and environment variables.');
    }
  }
  
  return kv;
};

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
      // Priority: External Redis > Vercel KV > File
      if (hasRedisUrl) {
        // Load from external Redis (Redis Cloud)
        const client = await getRedisClient();
        if (!client) {
          console.warn('Redis client is not available. Using empty keys array.');
          this.keys = [];
          return;
        }
        
        console.log('Loading API keys from Redis Cloud...');
        const data = await client.get(KV_KEY);
        this.keys = data ? JSON.parse(data) : [];
        console.log(`Loaded ${this.keys.length} API keys from Redis Cloud`);
      } else if (hasVercelKV) {
        // Load from Vercel KV
        const kvClient = await getKV();
        if (!kvClient) {
          console.warn('Vercel KV is not available. Using empty keys array.');
          this.keys = [];
          return;
        }
        
        console.log('Loading API keys from Vercel KV...');
        const data = await kvClient.get(KV_KEY);
        this.keys = data || [];
        console.log(`Loaded ${this.keys.length} API keys from Vercel KV`);
      } else {
        // Load from file (local development)
        if (fs.existsSync(API_KEYS_FILE)) {
          const data = fs.readFileSync(API_KEYS_FILE, 'utf8');
          this.keys = JSON.parse(data);
        } else {
          this.keys = [];
          await this.saveKeys();
        }
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        hasRedisUrl,
        hasVercelKV,
        isVercel: this.isVercel,
      });
      this.keys = [];
    }
  }

  /**
   * Lưu API keys vào storage
   */
  async saveKeys() {
    try {
      // Priority: External Redis > Vercel KV > File
      if (hasRedisUrl) {
        // Save to external Redis (Redis Cloud)
        const client = await getRedisClient();
        if (!client) {
          const errorMsg = 'Redis not configured. Please check REDIS_URL environment variable.';
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        
        console.log(`Saving ${this.keys.length} API keys to Redis Cloud...`);
        await client.set(KV_KEY, JSON.stringify(this.keys));
        console.log('API keys saved to Redis Cloud successfully');
      } else if (hasVercelKV) {
        // Save to Vercel KV
        const kvClient = await getKV();
        if (!kvClient) {
          const errorMsg = 'Vercel KV not configured. Please check KV_REST_API_URL and KV_REST_API_TOKEN environment variables.';
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        
        console.log(`Saving ${this.keys.length} API keys to Vercel KV...`);
        await kvClient.set(KV_KEY, this.keys);
        console.log('API keys saved to Vercel KV successfully');
      } else {
        // Save to file (local development)
        fs.writeFileSync(API_KEYS_FILE, JSON.stringify(this.keys, null, 2));
        console.log('API keys saved to file successfully');
      }
    } catch (error) {
      console.error('Error saving API keys:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        hasRedisUrl,
        hasVercelKV,
        isVercel: this.isVercel,
        keysCount: this.keys.length,
        envVars: {
          REDIS_URL: process.env.REDIS_URL ? 'Set' : 'Missing',
          KV_REST_API_URL: process.env.KV_REST_API_URL ? 'Set' : 'Missing',
          KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? 'Set' : 'Missing',
        },
      });
      throw new Error(`Failed to save API keys: ${error.message}`);
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

