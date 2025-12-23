import { Router } from 'express';
import { alertController } from '../controllers/alert.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get('/', alertController.getAll);
router.get('/:id', alertController.getById);
router.post('/', alertController.create);
router.put('/:id/read', alertController.markAsRead);
router.delete('/:id', alertController.delete);

export default router;
