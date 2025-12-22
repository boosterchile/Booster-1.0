# 🚀 SmartAICargo - Complete Integration Guide

This guide will help you set up both the frontend and backend for SmartAICargo with real REST API integration.

## 📋 Prerequisites

- **Node.js** 20+ LTS
- **PostgreSQL** 14+ 
- **npm** or **yarn**

---

## Part 1: Backend Setup

### 1.1 Install PostgreSQL

#### macOS (Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Windows
Download from: https://www.postgresql.org/download/windows/

### 1.2 Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE smartaicargo;
CREATE USER smartaicargo_user WITH PASSWORD 'smartaicargo123';
GRANT ALL PRIVILEGES ON DATABASE smartaicargo TO smartaicargo_user;

# In PostgreSQL 15+, also grant schema privileges
\c smartaicargo
GRANT ALL ON SCHEMA public TO smartaicargo_user;

# Exit
\q
```

### 1.3 Configure Backend

```bash
cd smartaicargo-backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

Edit `.env` and update:
```
DATABASE_URL="postgresql://smartaicargo_user:smartaicargo123@localhost:5432/smartaicargo?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-minimum-32-characters"
```

### 1.4 Run Migrations and Seed

```bash
# Generate Prisma client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Seed with test data
npm run seed
```

### 1.5 Start Backend Server

```bash
npm run dev
```

Backend will run on: **http://localhost:3001**

Test it:
```bash
curl http://localhost:3001/health
```

---

## Part 2: Frontend Setup

### 2.1 Configure Frontend

```bash
cd ../smartaicargo-v4

# Copy environment file (if not exists)
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_API_BASE_URL=http://localhost:3001
```

### 2.2 Switch to Real Backend

The frontend code is ready to use the real backend! The `apiService.ts` will automatically detect if you're using a real backend.

### 2.3 Start Frontend

```bash
npm run dev
```

Frontend will run on: **http://localhost:5173**

---

## 🧪 Testing the Integration

### Test 1: Login

1. Open http://localhost:5173
2. Click "Iniciar Sesión"
3. Use test credentials:
   - Username: `shipper`
   - Password: `password123`

### Test 2: Create Cargo

1. After logging in, go to "Cargas"
2. Create a new cargo offer
3. Verify it persists (refresh the page)

### Test 3: Real-Time Data

1. Check the Dashboard
2. Data should load from PostgreSQL
3. Open browser DevTools → Network tab
4. You should see requests to `localhost:3001/api/*`

---

## 🎯 Quick Start (Both Servers)

### Terminal 1 - Backend
```bash
cd smartaicargo-backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd smartaicargo-v4
npm run dev
```

---

## 🔧 Troubleshooting

### Backend won't start

**Error: "Connection refused"**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Restart PostgreSQL
brew services restart postgresql@15
```

**Error: "Database does not exist"**
```bash
createdb smartaicargo
```

### Frontend shows errors

**CORS Error**
- Check that backend CORS_ORIGIN in `.env` matches frontend URL
- Default: `http://localhost:5173`

**401 Unauthorized**
- Clear browser localStorage
- Login again to get a fresh JWT token

### Database Issues

**Reset database:**
```bash
cd smartaicargo-backend
npx prisma migrate reset
npm run seed
```

---

## 📊 Test Credentials

After running `npm run seed`, you'll have these test users:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `password123` |
| Shipper | `shipper` | `password123` |
| Carrier | `carrier` | `password123` |

---

## 🚀 Production Deployment

### Backend (Railway/Render)

1. Create account on Railway.app or Render.com
2. Create new PostgreSQL database
3. Deploy backend:
   - Connect GitHub repo
   - Set environment variables
   - Deploy

### Frontend (Vercel)

1. Update `.env.production`:
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app
   ```
2. Deploy to Vercel
3. Update backend CORS_ORIGIN to Vercel URL

---

## 📚 API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| POST | /api/auth/login | User login |
| POST | /api/auth/register | User registration |
| GET | /api/auth/me | Get current user |
| GET | /api/cargo | List cargo offers |
| POST | /api/cargo | Create cargo offer |
| PUT | /api/cargo/:id | Update cargo |
| DELETE | /api/cargo/:id | Delete cargo |
| GET | /api/vehicles | List vehicles |
| POST | /api/vehicles | Create vehicle |
| GET | /api/shipments | List shipments |
| GET | /api/alerts | List alerts |

Full API documentation in `smartaicargo-backend/README.md`

---

## ✅ Verification Checklist

- [ ] PostgreSQL installed and running
- [ ] Database created and migrated
- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173
- [ ] Can login with test credentials
- [ ] Data persists across refreshes
- [ ] Network tab shows API calls to backend

---

## 🎉 Success!

You now have a fully integrated full-stack application with:
- ✅ React + TypeScript frontend
- ✅ Express + TypeScript backend
- ✅ PostgreSQL database with Prisma ORM
- ✅ JWT authentication
- ✅ Real-time data synchronization with React Query

Happy coding! 🚀
