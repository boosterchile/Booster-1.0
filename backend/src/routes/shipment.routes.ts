import { Router } from 'express';
import { shipmentController } from '../controllers/shipment.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get('/', shipmentController.getAll);
router.get('/:id', shipmentController.getById);
router.get('/:id/realtime', shipmentController.getRealTimeData);
router.post('/', shipmentController.create);
router.put('/:id', shipmentController.update);

export default router;
