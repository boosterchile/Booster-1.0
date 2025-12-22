import { Router } from 'express';
import { vehicleController } from '../controllers/vehicle.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get('/', vehicleController.getAll);
router.get('/:id', vehicleController.getById);
router.post('/', vehicleController.create);
router.put('/:id', vehicleController.update);
router.delete('/:id', vehicleController.delete);

export default router;
