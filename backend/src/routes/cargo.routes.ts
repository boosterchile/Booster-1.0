import { Router } from 'express';
import { cargoController } from '../controllers/cargo.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All cargo routes require authentication
router.use(authenticate);

router.get('/', cargoController.getAll);
router.get('/:id', cargoController.getById);
router.post('/', cargoController.create);
router.put('/:id', cargoController.update);
router.delete('/:id', cargoController.delete);

export default router;
