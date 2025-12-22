# SmartAICargo Backend API

REST API backend for SmartAICargo logistics platform built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ LTS
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Navigate to the backend directory**
   ```bash
   cd smartaicargo-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

   Required variables:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/smartaicargo"
   JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"
   PORT=3001
   CORS_ORIGIN="http://localhost:5173"
   ```

4. **Set up the database**
   
   Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

   Run migrations:
   ```bash
   npm run prisma:migrate
   ```

   (Optional) Seed the database:
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3001`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires JWT)

### Cargo Management
- `GET /api/cargo` - List cargo offers
- `POST /api/cargo` - Create cargo offer
- `GET /api/cargo/:id` - Get cargo details
- `PUT /api/cargo/:id` - Update cargo
- `DELETE /api/cargo/:id` - Delete cargo

### Vehicle Management
- `GET /api/vehicles` - List vehicles
- `POST /api/vehicles` - Create vehicle
- `GET /api/vehicles/:id` - Get vehicle details
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Shipment Tracking
- `GET /api/shipments` - List shipments
- `POST /api/shipments` - Create shipment
- `GET /api/shipments/:id` - Get shipment details
- `GET /api/shipments/:id/realtime` - Get real-time tracking data
- `PUT /api/shipments/:id` - Update shipment status

### Alerts
- `GET /api/alerts` - List alerts
- `POST /api/alerts` - Create alert
- `PUT /api/alerts/:id/read` - Mark alert as read
- `DELETE /api/alerts/:id` - Delete alert

## 🛠️ Scripts

```bash
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm start                # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (GUI for database)
npm run seed             # Seed database with mock data
npm test                 # Run tests
```

## 🗄️ Database Schema

The database uses PostgreSQL with the following main tables:

- **User** - User accounts (shippers, carriers, admins)
- **CargoOffer** - Cargo shipment offers
- **Vehicle** - Fleet vehicles
- **Shipment** - Active shipments
- **Alert** - System notifications
- **BlockchainEvent** - Event audit log

See `prisma/schema.prisma` for the complete schema definition.

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

**Login Flow:**
1. POST credentials to `/api/auth/login`
2. Receive token in response
3. Include token in subsequent requests:
   ```
   Authorization: Bearer <your-token>
   ```

**Token Expiration:** 7 days (configurable via `JWT_EXPIRES_IN`)

## 🧪 Testing

### Manual Testing with curl

**Register a user:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "shipper1",
    "email": "shipper1@example.com",
    "password": "password123",
    "name": "Test Shipper",
    "role": "Shipper",
    "companyName": "Test Company"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "shipper1",
    "password": "password123"
  }'
```

**Create cargo (with token):**
```bash
curl -X POST http://localhost:3001/api/cargo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "origin": "Santiago",
    "destination": "Valparaíso",
    "cargoType": "Electronics",
    "weightKg": 500,
    "volumeM3": 2.5,
    "pickupDate": "2025-12-01T10:00:00Z",
    "deliveryDate": "2025-12-02T18:00:00Z"
  }'
```

## 📦 Production Deployment

### Railway / Render

1. Create new project
2. Connect GitHub repository
3. Set environment variables in dashboard
4. Deploy automatically on git push

### Environment Variables (Production)
```
DATABASE_URL=<your-production-postgresql-url>
JWT_SECRET=<secure-random-string>
NODE_ENV=production
CORS_ORIGIN=https://smartaicargo.vercel.app
```

## 🔧 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL format: `postgresql://user:password@host:port/database`
- Verify database exists: `psql -l`

### CORS Errors
- Verify CORS_ORIGIN matches frontend URL
- Check browser console for specific error
- Ensure frontend sends proper Authorization header

### JWT Token Issues
- Ensure JWT_SECRET is at least 32 characters
- Check token expiration
- Verify token format: `Bearer <token>`

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Credits

Built with:
- Express.js - Web framework
- Prisma - ORM
- PostgreSQL - Database
- TypeScript - Type safety
- bcrypt - Password hashing
- jsonwebtoken - JWT authentication
