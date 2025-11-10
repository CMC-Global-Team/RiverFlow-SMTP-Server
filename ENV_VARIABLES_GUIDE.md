# 📋 Environment Variables Guide - SMTP Server

## 🔐 File .env cho SMTP Server

### **Cấu trúc file .env:**

```env
# ==============================================================================
# SERVER CONFIGURATION
# ==============================================================================
PORT=3001
NODE_ENV=production

# ==============================================================================
# SMTP CONFIGURATION (Gmail)
# ==============================================================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=winnieph13@gmail.com
SMTP_PASSWORD=fjzaeivwjhblsvig
SMTP_FROM=winnieph13@gmail.com

# ==============================================================================
# SECURITY - API KEYS
# ==============================================================================
API_KEY=riverflow-smtp-secure-key-2024
MASTER_API_KEY=master-riverflow-smtp-key-2024

# ==============================================================================
# CORS CONFIGURATION
# ==============================================================================
CORS_ORIGINS=https://riverflow-server.onrender.com,https://river-flow-client.vercel.app

# ==============================================================================
# REDIS CONFIGURATION (Optional)
# ==============================================================================
REDIS_URL=redis://default:PASSWORD@HOST:PORT
```

---

## 📝 Giải thích từng biến

### **1. SERVER CONFIGURATION**

#### `PORT=3001`
- **Mô tả:** Port mà server sẽ chạy
- **Local:** 3001
- **Vercel:** Tự động set (không cần set)
- **Required:** ❌ (có default)

#### `NODE_ENV=production`
- **Mô tả:** Environment mode
- **Values:** `production`, `development`, `test`
- **Required:** ❌ (có default: `development`)

---

### **2. SMTP CONFIGURATION (Gmail)**

#### `SMTP_HOST=smtp.gmail.com`
- **Mô tả:** SMTP server hostname
- **Gmail:** `smtp.gmail.com`
- **Required:** ✅ (hoặc default: `smtp.gmail.com`)

#### `SMTP_PORT=587`
- **Mô tả:** SMTP server port
- **Gmail:** `587` (TLS) hoặc `465` (SSL)
- **Required:** ✅ (hoặc default: `587`)

#### `SMTP_USER=winnieph13@gmail.com`
- **Mô tả:** Gmail email address để gửi email
- **Required:** ✅ **CRITICAL**
- **Lưu ý:** Phải là Gmail address thật

#### `SMTP_PASSWORD=fjzaeivwjhblsvig`
- **Mô tả:** Gmail App Password (không phải password thường!)
- **Required:** ✅ **CRITICAL**
- **Lưu ý:** 
  - Phải là **App Password** (16 characters)
  - Không phải Gmail password thường
  - Tạo tại: Google Account → Security → 2-Step Verification → App passwords

#### `SMTP_FROM=winnieph13@gmail.com`
- **Mô tả:** Email address hiển thị trong "From" field
- **Required:** ❌ (sẽ dùng `SMTP_USER` nếu không set)
- **Lưu ý:** Thường giống với `SMTP_USER`

---

### **3. SECURITY - API KEYS**

#### `API_KEY=riverflow-smtp-secure-key-2024`
- **Mô tả:** Default API key cho backward compatibility
- **Required:** ❌ (có default)
- **Lưu ý:** Có thể tạo keys mới qua `/api/keys` endpoint

#### `MASTER_API_KEY=master-riverflow-smtp-key-2024`
- **Mô tả:** Master key để quản lý API keys (create, revoke, delete)
- **Required:** ✅ (nếu muốn dùng API key management)
- **Lưu ý:** 
  - Chỉ dùng để quản lý keys
  - Không dùng để gửi email
  - Nên đổi thành key mạnh hơn

---

### **4. CORS CONFIGURATION**

#### `CORS_ORIGINS=https://riverflow-server.onrender.com,https://river-flow-client.vercel.app`
- **Mô tả:** Danh sách domains được phép gọi API
- **Format:** Comma-separated, không có spaces
- **Required:** ❌ (có default)
- **Lưu ý:** 
  - Phải include domain của Spring Boot server
  - Phải include domain của frontend (nếu cần)
  - Không có trailing slashes

---

### **5. REDIS CONFIGURATION (Optional)**

#### `REDIS_URL=redis://default:PASSWORD@HOST:PORT`
- **Mô tả:** Redis Cloud connection string (nếu dùng external Redis)
- **Required:** ❌ (optional)
- **Format:** `redis://default:PASSWORD@HOST:PORT`
- **Lưu ý:**
  - Chỉ cần nếu dùng Redis Cloud
  - Nếu dùng Vercel KV, không cần set (Vercel tự set)
  - Priority: Redis Cloud > Vercel KV > File System

---

## 🚀 Setup trên Vercel

### **Bước 1: Copy các giá trị**

Copy các giá trị từ `.env` file ở trên

### **Bước 2: Add vào Vercel**

1. Vào https://vercel.com/dashboard
2. Chọn **RiverFlow-SMTP-Server**
3. **Settings** → **Environment Variables**
4. Add từng biến một:

```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = winnieph13@gmail.com
SMTP_PASSWORD = fjzaeivwjhblsvig
SMTP_FROM = winnieph13@gmail.com
API_KEY = riverflow-smtp-secure-key-2024
MASTER_API_KEY = master-riverflow-smtp-key-2024
CORS_ORIGINS = https://riverflow-server.onrender.com,https://river-flow-client.vercel.app
REDIS_URL = redis://default:dYIrqVmMAqWxvUGKiDbqVzx0Io1HwlAY@redis-13956.c52.us-east-1-4.ec2.redns.redis-cloud.com:13956
```

### **Bước 3: Check Environments**

Đảm bảo tất cả biến được apply cho:
- ✅ Production
- ✅ Preview  
- ✅ Development

### **Bước 4: Redeploy**

Sau khi thêm tất cả biến, **Redeploy** project.

---

## 🔍 Verify Setup

### **Check Environment Variables:**

```bash
# Test health check
curl https://river-flow-smtp-server.vercel.app/api/email/health

# Test send email
curl -X POST https://river-flow-smtp-server.vercel.app/api/email/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: rfsk_JOHo3vQB4rJrvWPMUUr0O3ko0iJMefcSLM6yFsTbSJIzvniC" \
  -d '{
    "to": "winnieph13@gmail.com",
    "subject": "Test",
    "html": "<h1>Test</h1>"
  }'
```

---

## ⚠️ Security Notes

### **✅ DO:**
- ✅ Use Gmail App Password (not regular password)
- ✅ Store credentials in Vercel Environment Variables
- ✅ Use different keys for different environments
- ✅ Rotate passwords periodically

### **❌ DON'T:**
- ❌ Commit `.env` file to Git (đã có trong .gitignore)
- ❌ Share credentials publicly
- ❌ Use regular Gmail password
- ❌ Hardcode credentials in code

---

## 📊 Priority Order

Khi có nhiều nguồn config:

1. **Vercel Environment Variables** (highest priority)
2. `.env` file (local development)
3. Default values trong code

---

## 🔄 Local Development

Để chạy local:

1. Copy `.env.example` thành `.env`
2. Update values trong `.env`
3. Run: `npm run dev`

```bash
cp .env.example .env
# Edit .env với values của bạn
npm run dev
```

---

## 📖 Related Documentation

- [VERCEL_ENV_SETUP.md](./VERCEL_ENV_SETUP.md) - Detailed Vercel setup
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [REDIS_CLOUD_SETUP.md](./REDIS_CLOUD_SETUP.md) - Redis Cloud setup

