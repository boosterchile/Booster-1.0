import { Response } from 'express';
import { alertService } from '../services/alert.service.js';
import { createAlertSchema } from '../utils/validation.js';
import { AuthRequest } from '../middleware/auth.js';

export const alertController = {
    async getAll(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.query.recipientId as string | undefined;
            const alerts = await alertService.getAll(userId);
            res.status(200).json({ success: true, data: alerts });
        } catch (error) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Error' });
        }
    },

    async create(req: AuthRequest, res: Response): Promise<void> {
        try {
            const validatedData = createAlertSchema.parse(req.body);
            const alert = await alertService.create(validatedData);
            res.status(201).json({ success: true, data: alert });
        } catch (error) {
            res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Error' });
        }
    },

    async markAsRead(req: AuthRequest, res: Response): Promise<void> {
        try {
            const alert = await alertService.markAsRead(req.params.id);
            res.status(200).json({ success: true, data: alert });
        } catch (error) {
            res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Error' });
        }
    },

    async delete(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await alertService.delete(req.params.id);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Error' });
        }
    },
};
