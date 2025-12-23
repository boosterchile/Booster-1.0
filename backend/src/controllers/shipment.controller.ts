import { Response } from 'express';
import { shipmentService } from '../services/shipment.service.js';
import { createShipmentSchema, updateShipmentSchema } from '../utils/validation.js';
import { AuthRequest } from '../middleware/auth.js';

export const shipmentController = {
    async getAll(_req: AuthRequest, res: Response): Promise<void> {
        try {
            const shipments = await shipmentService.getAll();
            res.status(200).json({ success: true, data: shipments });
        } catch (error) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Error' });
        }
    },

    async getById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const shipment = await shipmentService.getById(req.params.id);
            res.status(200).json({ success: true, data: shipment });
        } catch (error) {
            res.status(404).json({ success: false, message: error instanceof Error ? error.message : 'Not found' });
        }
    },

    async create(req: AuthRequest, res: Response): Promise<void> {
        try {
            const validatedData = createShipmentSchema.parse(req.body);
            const shipment = await shipmentService.create(validatedData);
            res.status(201).json({ success: true, data: shipment });
        } catch (error) {
            res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Error' });
        }
    },

    async update(req: AuthRequest, res: Response): Promise<void> {
        try {
            const validatedData = updateShipmentSchema.parse(req.body);
            const shipment = await shipmentService.update(req.params.id, validatedData);
            res.status(200).json({ success: true, data: shipment });
        } catch (error) {
            res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Error' });
        }
    },

    async getRealTimeData(req: AuthRequest, res: Response): Promise<void> {
        try {
            const data = await shipmentService.getRealTimeData(req.params.id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(404).json({ success: false, message: error instanceof Error ? error.message : 'Not found' });
        }
    },

    async delete(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await shipmentService.delete(req.params.id);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Error' });
        }
    },
};
