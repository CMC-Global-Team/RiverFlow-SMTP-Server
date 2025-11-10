# RiverFlow SMTP Server

SMTP Proxy Server for RiverFlow - Intermediary service to send emails via Gmail.

## 🎯 Purpose

This server acts as an intermediary between the RiverFlow main server and Gmail SMTP service. Since Render.com blocks direct SMTP connections, this proxy server deployed on Vercel handles all email sending operations.

## 🚀 Features

### Email Services
- ✅ Send general emails
- ✅ Send email verification for new accounts
- ✅ Send password reset emails
- ✅ HTML email templates

### Security & Management
- ✅ API key authentication (multiple keys support)
- ✅ **API Key Management** - Create, revoke, reactivate API keys
- ✅ Master API key for admin operations
- ✅ Usage tracking (last used, usage count)
- ✅ Request validation
- ✅ CORS support
- ✅ Error handling

## 📦 Tech Stack

- **Runtime**: Node.js (>= 18.0.0)
- **Framework**: Express.js
- **Email**: Nodemailer
- **Validation**: express-validator
- **Security**: Helmet, CORS

## 🔧 Installation

```bash
# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update .env with your credentials
```

## 🔐 Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# SMTP Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com

# Security - API Keys
API_KEY=your-secure-api-key-here
MASTER_API_KEY=your-master-api-key-here

# CORS Origins (comma separated)
CORS_ORIGINS=https://riverflow-server.onrender.com,http://localhost:8080
```

**API Keys:**
- `API_KEY`: Default API key for backward compatibility
- `MASTER_API_KEY`: Admin key for managing generated API keys (create, revoke, delete)

## 🏃 Running

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Root API Documentation
```http
GET /api
```
Returns list of all available endpoints

### Health Check
```http
GET /api/email/health
```

### Send General Email
```http
POST /api/email/send
Headers:
  X-API-Key: your-api-key
  Content-Type: application/json

Body:
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "html": "<h1>Email Content</h1>",
  "text": "Plain text content (optional)"
}
```

### Send Verification Email
```http
POST /api/email/verification
Headers:
  X-API-Key: your-api-key
  Content-Type: application/json

Body:
{
  "to": "user@example.com",
  "token": "verification-token",
  "frontendUrl": "https://river-flow-client.vercel.app"
}
```

### Send Reset Password Email
```http
POST /api/email/reset-password
Headers:
  X-API-Key: your-api-key
  Content-Type: application/json

Body:
{
  "to": "user@example.com",
  "token": "reset-token",
  "frontendUrl": "https://river-flow-client.vercel.app"
}
```

---

## 🔑 API Key Management

### Create API Key
```http
POST /api/keys
Headers:
  X-Master-Key: your-master-key
  Content-Type: application/json

Body:
{
  "name": "Production Server",
  "description": "Main backend server"
}

Response:
{
  "success": true,
  "data": {
    "key": "rfsk_aBcDeFgHiJkLmNoPqRsTuVwXyZ...",
    "name": "Production Server",
    "id": "1699876543210",
    "warning": "Save this key securely. You will not be able to see it again."
  }
}
```

### List All API Keys
```http
GET /api/keys
Headers:
  X-Master-Key: your-master-key
```

### Get API Key Details
```http
GET /api/keys/:id
Headers:
  X-Master-Key: your-master-key
```

### Revoke API Key
```http
PUT /api/keys/:id/revoke
Headers:
  X-Master-Key: your-master-key
```

### Reactivate API Key
```http
PUT /api/keys/:id/reactivate
Headers:
  X-Master-Key: your-master-key
```

### Delete API Key
```http
DELETE /api/keys/:id
Headers:
  X-Master-Key: your-master-key
```

**📖 See [API_KEY_MANAGEMENT.md](./API_KEY_MANAGEMENT.md) for detailed guide**

## 🔒 Security

- All email endpoints require API key authentication via `X-API-Key` header
- CORS is configured to only allow requests from specified origins
- Request validation using express-validator
- Helmet for security headers

## 🌐 Deployment

### Vercel

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
# Or use Vercel CLI
vercel --prod
```

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "message-id-from-smtp"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "to",
      "message": "Invalid email address"
    }
  ]
}
```

## 🔗 Links

- **Production URL**: https://river-flow-smtp-server.vercel.app
- **Main Server**: https://riverflow-server.onrender.com
- **Frontend**: https://river-flow-client.vercel.app

## 📄 License

MIT License - see LICENSE file for details

