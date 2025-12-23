import express from 'express';
import { env } from './config/env.js';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import cargoRoutes from './routes/cargo.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import shipmentRoutes from './routes/shipment.routes.js';
import alertRoutes from './routes/alert.routes.js';

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Booster API is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cargo', cargoRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/alerts', alertRoutes);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${_req.method} ${_req.path} not found`,
    });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Booster API server running on port ${PORT}`);
    console.log(`📝 Environment: ${env.NODE_ENV}`);
    console.log(`🌐 CORS enabled for: ${env.CORS_ORIGIN}`);
    console.log(`\n📚 Available endpoints:`);
    console.log(`   GET  /health`);
    console.log(`   POST /api/auth/register`);
    console.log(`   POST /api/auth/login`);
    console.log(`   GET  /api/auth/me`);
    console.log(`   GET  /api/cargo`);
    console.log(`   GET  /api/vehicles`);
    console.log(`   GET  /api/shipments`);
    console.log(`   GET  /api/alerts`);
});

export default app;
