import prisma from '../config/database.js';
import { SensorType } from '@prisma/client';

export interface CreateSensorReadingInput {
    shipmentId: string;
    sensorType: SensorType;
    value: number;
    unit: string;
    latitude?: number;
    longitude?: number;
    deviceId?: string;
    isSimulated?: boolean;
}

export const iotService = {
    async createReading(data: CreateSensorReadingInput) {
        const reading = await prisma.sensorReading.create({
            data: {
                shipmentId: data.shipmentId,
                sensorType: data.sensorType,
                value: data.value,
                unit: data.unit,
                latitude: data.latitude,
                longitude: data.longitude,
                deviceId: data.deviceId,
                isSimulated: data.isSimulated ?? false,
            },
        });

        // Also update the shipment's realTimeData
        await this.updateShipmentRealTimeData(data);

        return reading;
    },

    async createBatchReadings(readings: CreateSensorReadingInput[]) {
        const results = await Promise.all(
            readings.map(reading => this.createReading(reading))
        );
        return results;
    },

    async getReadingsByShipment(shipmentId: string, limit = 100) {
        return prisma.sensorReading.findMany({
            where: { shipmentId },
            orderBy: { timestamp: 'desc' },
            take: limit,
        });
    },

    async getLatestReadingsByType(shipmentId: string) {
        const types: SensorType[] = ['TEMPERATURE', 'HUMIDITY', 'LOCATION', 'VIBRATION', 'DOOR_STATUS'];
        const latestReadings: Record<string, any> = {};

        for (const type of types) {
            const reading = await prisma.sensorReading.findFirst({
                where: { shipmentId, sensorType: type },
                orderBy: { timestamp: 'desc' },
            });
            if (reading) {
                latestReadings[type] = reading;
            }
        }

        return latestReadings;
    },

    async updateShipmentRealTimeData(data: CreateSensorReadingInput) {
        const shipment = await prisma.shipment.findUnique({
            where: { id: data.shipmentId },
        });

        if (!shipment) return;

        const currentData = (shipment.realTimeData as any) || {};
        const updatedData = { ...currentData };

        switch (data.sensorType) {
            case 'TEMPERATURE':
                updatedData.temperatureCelsius = data.value;
                break;
            case 'HUMIDITY':
                updatedData.humidityPercent = data.value;
                break;
            case 'LOCATION':
                updatedData.latitude = data.latitude;
                updatedData.longitude = data.longitude;
                updatedData.speedKmh = data.value; // value is speed for location
                break;
            case 'VIBRATION':
                updatedData.vibrationLevel = data.value < 30 ? 'Low' : data.value < 70 ? 'Medium' : 'High';
                break;
            case 'DOOR_STATUS':
                updatedData.doorOpen = data.value === 1;
                break;
        }

        await prisma.shipment.update({
            where: { id: data.shipmentId },
            data: {
                realTimeData: updatedData,
                currentLocation: data.latitude && data.longitude
                    ? `${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`
                    : shipment.currentLocation,
            },
        });
    },

    // IoT Simulator
    async simulateReadings(shipmentId: string) {
        const shipment = await prisma.shipment.findUnique({
            where: { id: shipmentId },
            include: { cargo: true },
        });

        if (!shipment) throw new Error('Shipment not found');

        const currentData = (shipment.realTimeData as any) || {
            latitude: -33.45,
            longitude: -70.65,
        };

        // Generate simulated readings
        const readings: CreateSensorReadingInput[] = [
            {
                shipmentId,
                sensorType: 'TEMPERATURE',
                value: Math.round((Math.random() * 6 + 2) * 10) / 10, // 2-8°C
                unit: '°C',
                latitude: currentData.latitude,
                longitude: currentData.longitude,
                deviceId: 'SIM-TEMP-001',
                isSimulated: true,
            },
            {
                shipmentId,
                sensorType: 'HUMIDITY',
                value: Math.round(Math.random() * 30 + 50), // 50-80%
                unit: '%',
                latitude: currentData.latitude,
                longitude: currentData.longitude,
                deviceId: 'SIM-HUM-001',
                isSimulated: true,
            },
            {
                shipmentId,
                sensorType: 'LOCATION',
                value: Math.round(Math.random() * 60 + 40), // 40-100 km/h speed
                unit: 'km/h',
                latitude: currentData.latitude + (Math.random() - 0.5) * 0.02,
                longitude: currentData.longitude + (Math.random() - 0.5) * 0.02,
                deviceId: 'SIM-GPS-001',
                isSimulated: true,
            },
            {
                shipmentId,
                sensorType: 'VIBRATION',
                value: Math.round(Math.random() * 100), // 0-100
                unit: 'level',
                deviceId: 'SIM-VIB-001',
                isSimulated: true,
            },
            {
                shipmentId,
                sensorType: 'DOOR_STATUS',
                value: Math.random() > 0.95 ? 1 : 0, // 5% chance door is open
                unit: 'boolean',
                deviceId: 'SIM-DOOR-001',
                isSimulated: true,
            },
        ];

        return this.createBatchReadings(readings);
    },
};
