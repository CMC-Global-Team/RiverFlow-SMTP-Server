# API Key Management Guide

## 🔑 Tổng quan

SMTP Server hỗ trợ 2 loại API keys:

1. **Default API Key** - Key từ environment variable `API_KEY`
2. **Generated API Keys** - Keys được tạo động và lưu trữ, không bao giờ hết hạn

## 🛡️ Master API Key

Master API Key dùng để quản lý các API keys khác. Chỉ Master Key mới có quyền:
- ✅ Tạo API key mới
- ✅ Xem danh sách API keys
- ✅ Revoke/Reactivate API keys
- ✅ Xóa API keys

**Cấu hình Master Key:**
```env
MASTER_API_KEY=master-riverflow-smtp-key-2024
```

**Sử dụng Master Key:**
```bash
# Thêm header X-Master-Key vào request
curl -H "X-Master-Key: master-riverflow-smtp-key-2024" \
  https://river-flow-smtp-server-t3zk.vercel.app/api/keys
```

## 📋 API Endpoints

### 1. Tạo API Key Mới

**Endpoint:** `POST /api/keys`  
**Authentication:** Master Key required  
**Header:** `X-Master-Key: your-master-key`

**Request Body:**
```json
{
  "name": "Production Server",
  "description": "API key for production RiverFlow Server"
}
```

**Response:**
```json
{
  "success": true,
  "message": "API key created successfully",
  "data": {
    "id": "1699876543210",
    "key": "rfsk_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890aBcDeFgHiJkL",
    "name": "Production Server",
    "description": "API key for production RiverFlow Server",
    "createdAt": "2024-11-10T12:00:00.000Z",
    "warning": "Save this key securely. You will not be able to see it again."
  }
}
```

⚠️ **Quan trọng:** Key chỉ hiển thị 1 lần duy nhất khi tạo. Lưu lại ngay!

**Example:**
```bash
curl -X POST https://river-flow-smtp-server-t3zk.vercel.app/api/keys \
  -H "Content-Type: application/json" \
  -H "X-Master-Key: master-riverflow-smtp-key-2024" \
  -d '{
    "name": "Production Server",
    "description": "Main backend server"
  }'
```

---

### 2. Lấy Danh Sách API Keys

**Endpoint:** `GET /api/keys`  
**Authentication:** Master Key required

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "1699876543210",
      "name": "Production Server",
      "description": "Main backend server",
      "key": "rfsk_aBcDeFgHi...JkLm",
      "createdAt": "2024-11-10T12:00:00.000Z",
      "lastUsedAt": "2024-11-10T15:30:00.000Z",
      "usageCount": 156,
      "active": true
    }
  ]
}
```

**Example:**
```bash
curl https://river-flow-smtp-server-t3zk.vercel.app/api/keys \
  -H "X-Master-Key: master-riverflow-smtp-key-2024"
```

---

### 3. Lấy Thông Tin API Key

**Endpoint:** `GET /api/keys/:id`  
**Authentication:** Master Key required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1699876543210",
    "name": "Production Server",
    "description": "Main backend server",
    "key": "rfsk_aBcDeFgHi...JkLm",
    "createdAt": "2024-11-10T12:00:00.000Z",
    "lastUsedAt": "2024-11-10T15:30:00.000Z",
    "usageCount": 156,
    "active": true
  }
}
```

**Example:**
```bash
curl https://river-flow-smtp-server-t3zk.vercel.app/api/keys/1699876543210 \
  -H "X-Master-Key: master-riverflow-smtp-key-2024"
```

---

### 4. Revoke API Key

**Endpoint:** `PUT /api/keys/:id/revoke`  
**Authentication:** Master Key required

Vô hiệu hóa API key (có thể reactivate sau)

**Response:**
```json
{
  "success": true,
  "message": "API key revoked successfully"
}
```

**Example:**
```bash
curl -X PUT https://river-flow-smtp-server-t3zk.vercel.app/api/keys/1699876543210/revoke \
  -H "X-Master-Key: master-riverflow-smtp-key-2024"
```

---

### 5. Reactivate API Key

**Endpoint:** `PUT /api/keys/:id/reactivate`  
**Authentication:** Master Key required

Kích hoạt lại API key đã bị revoke

**Response:**
```json
{
  "success": true,
  "message": "API key reactivated successfully"
}
```

**Example:**
```bash
curl -X PUT https://river-flow-smtp-server-t3zk.vercel.app/api/keys/1699876543210/reactivate \
  -H "X-Master-Key: master-riverflow-smtp-key-2024"
```

---

### 6. Xóa API Key

**Endpoint:** `DELETE /api/keys/:id`  
**Authentication:** Master Key required

Xóa vĩnh viễn API key (không thể khôi phục)

**Response:**
```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

**Example:**
```bash
curl -X DELETE https://river-flow-smtp-server-t3zk.vercel.app/api/keys/1699876543210 \
  -H "X-Master-Key: master-riverflow-smtp-key-2024"
```

---

## 🔄 Workflow Sử Dụng

### Bước 1: Tạo API Key cho Service Mới

```bash
# Tạo key cho production server
curl -X POST https://river-flow-smtp-server-t3zk.vercel.app/api/keys \
  -H "Content-Type: application/json" \
  -H "X-Master-Key: master-riverflow-smtp-key-2024" \
  -d '{
    "name": "Production Server",
    "description": "Main backend server on Render"
  }'

# Response sẽ chứa key mới
# rfsk_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890aBcDeFgHiJkL
```

### Bước 2: Lưu API Key an toàn

Lưu key vào:
- Environment variables trên server
- Vault/Secret management service
- Password manager

**❌ KHÔNG:**
- Commit vào Git
- Lưu trong code
- Share qua email/chat không mã hóa

### Bước 3: Sử dụng API Key

```bash
# Gửi email với API key mới
curl -X POST https://river-flow-smtp-server-t3zk.vercel.app/api/email/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: rfsk_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890aBcDeFgHiJkL" \
  -d '{
    "to": "user@example.com",
    "subject": "Test Email",
    "html": "<h1>Hello!</h1>"
  }'
```

### Bước 4: Monitor Usage

```bash
# Kiểm tra usage statistics
curl https://river-flow-smtp-server-t3zk.vercel.app/api/keys \
  -H "X-Master-Key: master-riverflow-smtp-key-2024"
```

### Bước 5: Revoke Key khi cần

```bash
# Nếu key bị compromise
curl -X PUT https://river-flow-smtp-server-t3zk.vercel.app/api/keys/1699876543210/revoke \
  -H "X-Master-Key: master-riverflow-smtp-key-2024"
```

---

## 🔐 API Key Format

Generated API keys có format:
```
rfsk_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890aBcDeFgHiJkL
└──┘ └────────────────────────────────────────────────┘
  │                        │
  │                        └─ 48 random characters
  └─ Prefix (RiverFlow SMTP Key)
```

**Độ dài:** 53 characters (5 prefix + 48 random)  
**Entropy:** ~287 bits (rất an toàn)

---

## 📊 API Key Features

| Feature | Default Key | Generated Keys |
|---------|-------------|----------------|
| Không hết hạn | ✅ | ✅ |
| Track usage | ❌ | ✅ |
| Có thể revoke | ❌ | ✅ |
| Có thể reactivate | ❌ | ✅ |
| Metadata (name, description) | ❌ | ✅ |
| Last used tracking | ❌ | ✅ |
| Usage count | ❌ | ✅ |

---

## 🚨 Best Practices

### 1. Master Key Security
- ✅ Sử dụng key mạnh (ít nhất 32 characters)
- ✅ Chỉ share với admin
- ✅ Rotate định kỳ (3-6 tháng)
- ✅ Lưu trong secret manager

### 2. Generated Keys
- ✅ Tạo key riêng cho mỗi service/environment
- ✅ Đặt tên rõ ràng (Production Server, Staging, Testing)
- ✅ Thêm description chi tiết
- ✅ Monitor usage thường xuyên

### 3. Key Rotation
```bash
# 1. Tạo key mới
NEW_KEY=$(curl -X POST ... | jq -r '.data.key')

# 2. Cập nhật service với key mới
# 3. Verify key mới hoạt động
# 4. Revoke key cũ
```

### 4. Incident Response
Nếu key bị lộ:
1. **Revoke ngay lập tức**
2. Tạo key mới
3. Update services
4. Review logs để check unauthorized usage
5. Notify security team

---

## 💾 Storage

API keys được lưu trong file JSON:
```
data/api-keys.json
```

**Format:**
```json
[
  {
    "id": "1699876543210",
    "key": "rfsk_...",
    "name": "Production Server",
    "description": "Main backend",
    "createdAt": "2024-11-10T12:00:00.000Z",
    "lastUsedAt": "2024-11-10T15:30:00.000Z",
    "usageCount": 156,
    "active": true
  }
]
```

⚠️ **Lưu ý:** File này được gitignore và chỉ tồn tại trên server.

---

## 🧪 Testing

### Test Master Key Authentication

```bash
# ✅ Valid master key
curl https://river-flow-smtp-server-t3zk.vercel.app/api/keys \
  -H "X-Master-Key: master-riverflow-smtp-key-2024"
# Expected: 200 OK

# ❌ Invalid master key
curl https://river-flow-smtp-server-t3zk.vercel.app/api/keys \
  -H "X-Master-Key: wrong-key"
# Expected: 403 Forbidden

# ❌ Missing master key
curl https://river-flow-smtp-server-t3zk.vercel.app/api/keys
# Expected: 401 Unauthorized
```

### Test Generated API Key

```bash
# Tạo key
RESPONSE=$(curl -X POST https://river-flow-smtp-server-t3zk.vercel.app/api/keys \
  -H "Content-Type: application/json" \
  -H "X-Master-Key: master-riverflow-smtp-key-2024" \
  -d '{"name":"Test Key","description":"For testing"}')

# Extract key
API_KEY=$(echo $RESPONSE | jq -r '.data.key')

# Test gửi email với key mới
curl -X POST https://river-flow-smtp-server-t3zk.vercel.app/api/email/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "to": "test@example.com",
    "subject": "Test",
    "html": "<h1>Test</h1>"
  }'
```

---

## 📖 Related Documentation

- [API_KEY_SETUP.md](./API_KEY_SETUP.md) - Basic API key configuration
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [README.md](./README.md) - General documentation

