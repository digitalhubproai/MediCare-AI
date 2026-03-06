# Vercel Deployment Guide

## ⚠️ Critical: Environment Variables Required

Your Vercel function is crashing with **500 INTERNAL_SERVER_ERROR** because environment variables are not configured.

## Quick Fix (3 Steps)

### Step 1: Go to Vercel Dashboard

1. Open your project at https://vercel.com/dashboard
2. Click on your MediCare AI project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add These Environment Variables

Click "Add New" for each variable:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Your Neon PostgreSQL URL | Production, Preview, Development |
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Production, Preview, Development |
| `JWT_SECRET` | Random secure string (32+ chars) | Production, Preview, Development |
| `FRONTEND_URL` | Your Vercel app URL | Production, Preview, Development |
| `OPENROUTER_BASE_URL` | `https://openrouter.ai/api/v1` | All |
| `AI_MODEL` | `meta-llama/llama-3-70b-instruct` | All |

### Step 3: Redeploy

After adding environment variables:

```bash
# Commit and push the new deployment configuration
git add .
git commit -m "Fix Vercel deployment: proper serverless config with mangum"
git push origin main
```

Then in Vercel dashboard, click **Deploy** → **Redeploy** on the latest deployment.

---

## Detailed Setup Instructions

### Get Your API Keys

#### 1. OpenRouter API Key
1. Visit https://openrouter.ai/keys
2. Sign in or create account
3. Click "Create Key"
4. Copy the key (starts with `sk-...`)
5. Add to Vercel as `OPENROUTER_API_KEY`

#### 2. Database URL (Neon)
Your current database URL (from models.py):
```
postgresql://neondb_owner:***@ep-bitter-mud-ahezrh7h-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

1. Go to https://console.neon.tech
2. Select your project
3. Copy the connection string
4. Add to Vercel as `DATABASE_URL`

#### 3. JWT Secret
Generate a secure random string:
```bash
# Use any random string generator, example:
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Add to Vercel as `JWT_SECRET`

#### 4. Frontend URL
After first deployment, get your Vercel URL (e.g., `https://medicare-ai.vercel.app`) and add as `FRONTEND_URL`

---

## Local Development

### 1. Create `.env` file in `/backend` folder:

```bash
cd backend
copy .env.example .env
```

Then edit `backend/.env` with your actual values:
```env
DATABASE_URL=your_actual_database_url
OPENROUTER_API_KEY=your_actual_api_key
JWT_SECRET=your_secure_secret
FRONTEND_URL=http://localhost:3000
```

### 2. Install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

### 3. Run the backend:

```bash
uvicorn main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`

### 4. Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:3000`

---

## Troubleshooting

### Still Getting 500 Error?

1. **Check Vercel Function Logs:**
   - Go to Vercel dashboard → Your project → **Deployments**
   - Click on the latest deployment
   - Click **Function Logs**
   - Look for error messages

2. **Common Issues:**

   **"AI service unavailable"**
   - `OPENROUTER_API_KEY` is missing or invalid
   - Check your OpenRouter account has credits

   **"Database connection failed"**
   - `DATABASE_URL` is incorrect
   - Check Neon database is accessible
   - Verify SSL mode is set (`sslmode=require`)

   **"Invalid or expired token"**
   - `JWT_SECRET` not set
   - Set a consistent secret in Vercel environment variables

3. **Test Locally First:**
   ```bash
   cd backend
   uvicorn main:app --reload
   # Test at http://localhost:8000/docs
   ```

### Database Tables Missing

The app now creates tables on startup without dropping existing data. If you need to reset:

```bash
cd backend
python reset_db.py
```

⚠️ **Warning:** This will delete all data!

---

## Project Structure

```
MediCare AI/
├── api/
│   └── index.py           # Vercel serverless entry point (NEW)
├── backend/
│   ├── main.py            # FastAPI application
│   ├── auth.py            # Authentication routes
│   ├── health_routes.py   # Health feature routes
│   ├── models.py          # SQLAlchemy models
│   ├── requirements.txt   # Python dependencies (+ mangum)
│   └── .env.example       # Environment variables template
├── frontend/
│   ├── package.json       # Next.js dependencies
│   └── ...
├── vercel.json            # Vercel deployment config (UPDATED)
└── DEPLOYMENT.md          # This file
```

---

## What Was Fixed

1. ✅ **Removed destructive DB initialization** - No longer drops tables on startup
2. ✅ **Added proper error handling** - App won't crash on DB init failure
3. ✅ **Added Mangum for serverless** - Proper ASGI handler for Vercel
4. ✅ **Created api/index.py** - Correct entry point for Vercel Python functions
5. ✅ **Updated vercel.json** - Proper routing and build configuration
6. ✅ **Added .env.example** - Template for required environment variables

---

## Additional Resources

- [Vercel Python Documentation](https://vercel.com/docs/runtimes#official-runtimes/python)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [OpenRouter API Docs](https://openrouter.ai/docs)
- [Neon Database Docs](https://neon.tech/docs)
- [Mangum Documentation](https://mangum.io/)
