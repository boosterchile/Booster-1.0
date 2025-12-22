# SmartAICargo Backend - Setup Guide

## 📋 Prerequisites

Before you can run the backend, you need to install PostgreSQL.

### Option 1: Install PostgreSQL via Homebrew (Recommended for macOS)

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify installation
psql --version
```

### Option 2: Download PostgreSQL directly

Download from: https://www.postgresql.org/download/macosx/

---

## 🚀 Database Setup

Once PostgreSQL is installed:

### 1. Create the database

```bash
# Connect to PostgreSQL
psql postgres

# Inside psql, create the database and user
CREATE DATABASE smartaicargo;
CREATE USER smartaicargo_user WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE smartaicargo TO smartaicargo_user;

# Exit psql
\q
```

### 2. Update .env file

Edit `smartaicargo-backend/.env` and update the DATABASE_URL:

```
DATABASE_URL="postgresql://smartaicargo_user:your_password_here@localhost:5432/smartaicargo?schema=public"
```

### 3. Run Prisma migrations

```bash
cd smartaicargo-backend
npm run prisma:migrate
```

When prompted, give your migration a name like: `init`

### 4. Seed the database

```bash
npm run seed
```

This will create test users:
- **Admin**: username: `admin`, password: `password123`
- **Shipper**: username: `shipper`, password: `password123`
- **Carrier**: username: `carrier`, password: `password123`

### 5. Start the backend server

```bash
npm run dev
```

The API will run on `http://localhost:3001`

---

## 🧪 Test the API

### Health check
```bash
curl http://localhost:3001/health
```

### Test login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "shipper",
    "password": "password123"
  }'
```

---

## 🔧 Troubleshooting

### "Connection refused" error

PostgreSQL is not running. Start it with:
```bash
brew services start postgresql@15
```

### "Database does not exist" error

Create the database:
```bash
createdb smartaicargo
```

### "Permission denied" error

Grant permissions:
```bash
psql smartaicargo_backend -c "GRANT ALL ON SCHEMA public TO smartaicargo_user"
```

---

## 📦 Quick Setup Script

Save this as `setup-db.sh` and run `bash setup-db.sh`:

```bash
#!/bin/bash

echo "🚀 Setting up SmartAICargo database..."

# Create database
createdb smartaicargo 2>/dev/null || echo "Database already exists"

# Run migrations
cd smartaicargo-backend
npm run prisma:migrate

# Seed database
npm run seed

echo "✅ Database setup complete!"
echo "Run 'npm run dev' to start the server"
```

---

## Next Steps

Once the backend is running:
1. Update frontend `.env` with `VITE_API_BASE_URL=http://localhost:3001`
2. Start frontend: `cd smartaicargo-v4 && npm run dev`
3. Test the full stack application
