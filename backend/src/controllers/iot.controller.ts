import { Response } from 'express';
import { iotService } from '../services/iot.service.js';
import { AuthRequest } from '../middleware/auth.js';
import { z } from 'zod';

const sensorReadingSchema = z.object({
    shipmentId: z.string().uuid(),
    sensorType: z.enum(['TEMPERATURE', 'HUMIDITY', 'LOCATION', 'VIBRATION', 'DOOR_STATUS']),
    value: z.number(),
    unit: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    deviceId: z.string().optional(),
    isSimulated: z.boolean().optional(),
});

const batchReadingsSchema = z.object({
    readings: z.array(sensorReadingSchema),
});

export const iotController = {
    async createReading(req: AuthRequest, res: Response): Promise<void> {
        try {
            const validatedData = sensorReadingSchema.parse(req.body);
            const reading = await iotService.createReading(validatedData);
            res.status(201).json({ success: true, data: reading });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error creating reading'
            });
        }
    },

    async createBatchReadings(req: AuthRequest, res: Response): Promise<void> {
        try {
            const validatedData = batchReadingsSchema.parse(req.body);
            const readings = await iotService.createBatchReadings(validatedData.readings);
            res.status(201).json({ success: true, data: readings });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error creating readings'
            });
        }
    },

    async getReadingsByShipment(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { shipmentId } = req.params;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
            const readings = await iotService.getReadingsByShipment(shipmentId, limit);
            res.status(200).json({ success: true, data: readings });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error fetching readings'
            });
        }
    },

    async getLatestReadings(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { shipmentId } = req.params;
            const readings = await iotService.getLatestReadingsByType(shipmentId);
            res.status(200).json({ success: true, data: readings });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error fetching readings'
            });
        }
    },

    async simulateReadings(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { shipmentId } = req.params;
            const readings = await iotService.simulateReadings(shipmentId);
            res.status(201).json({
                success: true,
                data: readings,
                message: `Generated ${readings.length} simulated sensor readings`
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error simulating readings'
            });
        }
    },
};
