import { Response } from 'express';
import { cargoService } from '../services/cargo.service.js';
import { createCargoSchema, updateCargoSchema } from '../utils/validation.js';
import { AuthRequest } from '../middleware/auth.js';

export const cargoController = {
    async getAll(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }

            const cargoOffers = await cargoService.getAll(req.user.userId, req.user.role);

            res.status(200).json({
                success: true,
                data: cargoOffers,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error fetching cargo offers',
            });
        }
    },

    async getById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const cargo = await cargoService.getById(id);

            res.status(200).json({
                success: true,
                data: cargo,
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : 'Cargo not found',
            });
        }
    },

    async create(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }

            if (req.user.role !== 'Shipper' && req.user.role !== 'Admin') {
                res.status(403).json({
                    success: false,
                    message: 'Only shippers can create cargo offers',
                });
                return;
            }

            const validatedData = createCargoSchema.parse(req.body);
            const cargo = await cargoService.create(validatedData, req.user.userId);

            res.status(201).json({
                success: true,
                data: cargo,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error creating cargo offer',
            });
        }
    },

    async update(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }

            const { id } = req.params;
            const validatedData = updateCargoSchema.parse(req.body);
            const cargo = await cargoService.update(id, validatedData, req.user.userId, req.user.role);

            res.status(200).json({
                success: true,
                data: cargo,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error updating cargo offer',
            });
        }
    },

    async delete(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }

            const { id } = req.params;
            const result = await cargoService.delete(id, req.user.userId, req.user.role);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error deleting cargo offer',
            });
        }
    },
};
