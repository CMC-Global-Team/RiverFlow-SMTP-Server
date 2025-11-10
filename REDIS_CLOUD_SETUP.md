# Redis Cloud Setup Guide

## 🎯 Overview

RiverFlow SMTP Server hỗ trợ 3 storage options (theo thứ tự ưu tiên):

1. **External Redis** (Redis Cloud) - Nếu có `REDIS_URL`
2. **Vercel KV** - Nếu có `KV_REST_API_URL` và `KV_REST_API_TOKEN`
3. **File System** - Local development only

---

## 🔧 Setup Redis Cloud

### Bước 1: Tạo Redis Cloud Account

1. Vào https://redis.com/try-free/
2. Sign up hoặc login
3. Tạo database mới

### Bước 2: Get Redis URL

Sau khi tạo database, bạn sẽ có Redis URL:

```
redis://default:PASSWORD@HOST:PORT
```

Ví dụ:
```
redis://default:dYIrqVmMAqWxvUGKiDbqVzx0Io1HwlAY@redis-13956.c52.us-east-1-4.ec2.redns.redis-cloud.com:13956
```

### Bước 3: Add Environment Variable trên Vercel

1. Vào https://vercel.com/dashboard
2. Chọn project **RiverFlow-SMTP-Server**
3. **Settings** → **Environment Variables**
4. Add new variable:

```
Name: REDIS_URL
Value: redis://default:PASSWORD@HOST:PORT
Environments: Production, Preview, Development
```

5. Click **Save**

### Bước 4: Redeploy

1. **Deployments** tab
2. Click **...** menu trên deployment mới nhất
3. Click **Redeploy**
4. Đợi deployment hoàn tất

---

## ✅ Verify Setup

### Test Connection

Sau khi deploy, check logs trong Vercel:

```
✅ Redis Cloud connected successfully
Loading API keys from Redis Cloud...
✅ Loaded 0 API keys from Redis Cloud
```

### Test Create API Key

```bash
curl -X POST https://river-flow-smtp-server.vercel.app/api/keys \
  -H "Content-Type: application/json" \
  -H "X-Master-Key: master-riverflow-smtp-key-2024" \
  -d '{
    "name": "Production Server",
    "description": "Main backend"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "API key created successfully",
  "data": {
    "id": "...",
    "key": "rfsk_...",
    "name": "Production Server",
    ...
  }
}
```

### Verify Data in Redis

```bash
# Connect to Redis Cloud
redis-cli -u redis://default:PASSWORD@HOST:PORT

# Check key
GET riverflow:api-keys

# Should return JSON array of API keys
```

---

## 🔐 Security Best Practices

### ✅ DO:
- ✅ Use Redis Cloud with password authentication
- ✅ Store `REDIS_URL` in environment variables (never in code)
- ✅ Use different Redis databases for different environments
- ✅ Enable Redis AUTH if available
- ✅ Monitor Redis usage and connections

### ❌ DON'T:
- ❌ Commit `REDIS_URL` to Git
- ❌ Share Redis credentials publicly
- ❌ Use same Redis for production and development

---

## 📊 Redis Cloud vs Vercel KV

| Feature | Redis Cloud | Vercel KV |
|---------|-------------|-----------|
| **Setup** | External service | Built-in Vercel |
| **Cost** | Free tier available | Free tier available |
| **Performance** | High (dedicated) | Good (shared) |
| **Scalability** | Excellent | Good |
| **Management** | Separate dashboard | Vercel dashboard |
| **Best For** | Production, high volume | Simple projects |

---

## 🚨 Troubleshooting

### Error: "Redis connection failed"

**Solutions:**
1. Verify `REDIS_URL` format is correct
2. Check Redis Cloud database is active
3. Verify password is correct
4. Check network connectivity (firewall rules)
5. Verify Redis Cloud allows connections from Vercel IPs

### Error: "ECONNREFUSED"

**Solutions:**
1. Check Redis Cloud database status
2. Verify host and port are correct
3. Check if Redis Cloud requires IP whitelist
4. Verify connection string format

### Keys not persisting

**Solutions:**
1. Check Redis connection in logs
2. Verify `REDIS_URL` is set correctly
3. Test connection manually with `redis-cli`
4. Check Redis Cloud dashboard for errors

---

## 🔄 Migration từ Vercel KV sang Redis Cloud

1. **Add `REDIS_URL`** environment variable
2. **Redeploy** project
3. **Verify** logs show "Redis Cloud connected"
4. **Test** create API key
5. **Optional**: Remove Vercel KV environment variables

Code sẽ tự động detect và sử dụng Redis Cloud nếu `REDIS_URL` có sẵn.

---

## 📖 Related Documentation

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - General troubleshooting
- [API_KEY_MANAGEMENT.md](./API_KEY_MANAGEMENT.md) - API key management
- [VERCEL_KV_SETUP.md](./VERCEL_KV_SETUP.md) - Vercel KV setup (alternative)

---

## ✅ Checklist

- [ ] Redis Cloud account created
- [ ] Database created
- [ ] Redis URL obtained
- [ ] `REDIS_URL` added to Vercel environment variables
- [ ] Project redeployed
- [ ] Logs show "Redis Cloud connected"
- [ ] Test create API key successful
- [ ] Verify data in Redis Cloud dashboard

