import { Response } from 'express';
import { vehicleService } from '../services/vehicle.service.js';
import { createVehicleSchema, updateVehicleSchema } from '../utils/validation.js';
import { AuthRequest } from '../middleware/auth.js';

export const vehicleController = {
    async getAll(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const vehicles = await vehicleService.getAll(req.user.userId, req.user.role);
            res.status(200).json({ success: true, data: vehicles });
        } catch (error) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Error' });
        }
    },

    async getById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const vehicle = await vehicleService.getById(req.params.id);
            res.status(200).json({ success: true, data: vehicle });
        } catch (error) {
            res.status(404).json({ success: false, message: error instanceof Error ? error.message : 'Not found' });
        }
    },

    async create(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            if (req.user.role !== 'Carrier' && req.user.role !== 'Admin') {
                res.status(403).json({ success: false, message: 'Only carriers can create vehicles' });
                return;
            }
            const validatedData = createVehicleSchema.parse(req.body);
            const vehicle = await vehicleService.create(validatedData, req.user.userId);
            res.status(201).json({ success: true, data: vehicle });
        } catch (error) {
            res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Error' });
        }
    },

    async update(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const validatedData = updateVehicleSchema.parse(req.body);
            const vehicle = await vehicleService.update(req.params.id, validatedData, req.user.userId, req.user.role);
            res.status(200).json({ success: true, data: vehicle });
        } catch (error) {
            res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Error' });
        }
    },

    async delete(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const result = await vehicleService.delete(req.params.id, req.user.userId, req.user.role);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Error' });
        }
    },
};
