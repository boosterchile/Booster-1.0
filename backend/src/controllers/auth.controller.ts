import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../utils/validation.js';
import { AuthRequest } from '../middleware/auth.js';

export const authController = {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = registerSchema.parse(req.body);
            const result = await authService.register(validatedData);

            res.status(201).json({
                success: true,
                data: result,
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error during registration',
                });
            }
        }
    },

    async login(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = loginSchema.parse(req.body);
            const result = await authService.login(validatedData);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error during login',
                });
            }
        }
    },

    async validateToken(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'No user found in request',
                });
                return;
            }

            const user = await authService.validateToken(req.user.userId);

            res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error validating token',
                });
            }
        }
    },
};
