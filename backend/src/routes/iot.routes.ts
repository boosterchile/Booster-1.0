import { Router } from 'express';
import { iotController } from '../controllers/iot.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All IoT routes require authentication
router.use(authenticate);

// Ingest single sensor reading
router.post('/readings', iotController.createReading);

// Ingest batch sensor readings
router.post('/readings/batch', iotController.createBatchReadings);

// Get readings for a shipment
router.get('/readings/:shipmentId', iotController.getReadingsByShipment);

// Get latest readings by sensor type for a shipment
router.get('/readings/:shipmentId/latest', iotController.getLatestReadings);

// Simulate IoT readings for a shipment
router.post('/simulate/:shipmentId', iotController.simulateReadings);

export default router;
