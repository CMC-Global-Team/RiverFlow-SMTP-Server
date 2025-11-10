# Vercel KV Setup Guide

## 🚀 Quick Setup

### Step 1: Create Vercel KV Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** tab
3. Click **Create Database**
4. Select **KV (Redis)**
5. Name it: `riverflow-smtp-kv`
6. Choose region (same as your deployment for best performance)
7. Click **Create**

### Step 2: Connect to Project

1. After creating KV, go to **Settings** tab of the KV database
2. Find **Connect Project** section
3. Select your `RiverFlow-SMTP-Server` project
4. Click **Connect**
5. Choose environments: **Production**, **Preview**, **Development**

### Step 3: Environment Variables (Auto-added)

Vercel automatically adds these to your project:

```env
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
KV_URL=redis://...
```

### Step 4: Verify Setup

```bash
# Check environment variables in your project
# Go to: Project Settings → Environment Variables

# You should see KV_* variables
```

### Step 5: Redeploy

```bash
# Trigger a new deployment to apply KV connection
git commit --allow-empty -m "Trigger redeploy for KV"
git push origin main
```

---

## 🧪 Test API Key Creation

Once deployed:

```bash
# Create a test API key
curl -X POST https://river-flow-smtp-server-t3zk.vercel.app/api/keys \
  -H "Content-Type: application/json" \
  -H "X-Master-Key: master-riverflow-smtp-key-2024" \
  -d '{
    "name": "Test Key",
    "description": "Testing Vercel KV storage"
  }'

# Expected response:
{
  "success": true,
  "message": "API key created successfully",
  "data": {
    "id": "...",
    "key": "rfsk_...",
    "name": "Test Key",
    ...
  }
}
```

---

## 📊 How it Works

### Local Development
- Uses file system: `data/api-keys.json`
- No Vercel KV needed
- Works immediately

### Vercel Production
- Detects `VERCEL=1` or `VERCEL_ENV` environment variable
- Automatically switches to Vercel KV
- No code changes needed

### Storage Structure

**Vercel KV Key:** `riverflow:api-keys`

**Value (JSON Array):**
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

---

## 💰 Pricing

**Vercel KV Free Tier:**
- ✅ 256 MB storage
- ✅ 10,000 commands/day
- ✅ Perfect for API key management

**For RiverFlow SMTP:**
- API key storage: ~1KB per key
- Can store ~250,000 keys (way more than needed!)
- Read/write operations are very low frequency
- Free tier is more than enough

---

## 🔧 Troubleshooting

### Error: "Cannot find module '@vercel/kv'"

```bash
# Reinstall package
npm install @vercel/kv
```

### Error: "KV_REST_API_URL is not defined"

**Solution:**
1. Go to Vercel Dashboard → Storage → Your KV
2. Click "Connect Project"
3. Select your SMTP server project
4. Redeploy

### Keys not persisting

**Check:**
1. KV is connected to project ✅
2. Environment variables are set ✅
3. Redeployed after connecting KV ✅

### View KV Data

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Open KV dashboard
vercel kv
```

Or via Dashboard:
1. Storage tab
2. Select your KV
3. Click "Data Browser"

---

## 🔐 Security

### KV Tokens
- Automatically rotated by Vercel
- Read-only token for viewing data
- Full token for write operations
- Never commit tokens to git

### API Keys in KV
- Encrypted in transit (TLS)
- Stored securely by Vercel
- Only accessible by your deployment
- Master key still required for management

---

## 📖 References

- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [@vercel/kv NPM Package](https://www.npmjs.com/package/@vercel/kv)
- [Vercel KV Pricing](https://vercel.com/docs/storage/vercel-kv/usage-and-pricing)

---

## ✅ Checklist

- [ ] Created Vercel KV database
- [ ] Connected KV to project
- [ ] Verified environment variables
- [ ] Redeployed project
- [ ] Tested API key creation
- [ ] Verified keys persist across deployments
- [ ] Added Master API Key to environment variables

