import prisma from '../config/database.js';

export const shipmentService = {
    async getAll() {
        return prisma.shipment.findMany({
            include: {
                cargo: { select: { id: true, origin: true, destination: true } },
                vehicle: { select: { id: true, type: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    },

    async getById(id: string) {
        const shipment = await prisma.shipment.findUnique({
            where: { id },
            include: { cargo: true, vehicle: true, alerts: true },
        });
        if (!shipment) throw new Error('Shipment not found');
        return shipment;
    },

    async create(data: any) {
        return prisma.shipment.create({
            data: {
                ...data,
                estimatedDelivery: new Date(data.estimatedDelivery),
                status: 'IN_TRANSIT',
            },
            include: { cargo: true, vehicle: true },
        });
    },

    async update(id: string, data: any) {
        const updateData: any = { ...data };
        if (data.estimatedDelivery) {
            updateData.estimatedDelivery = new Date(data.estimatedDelivery);
        }
        return prisma.shipment.update({ where: { id }, data: updateData });
    },

    async getRealTimeData(id: string) {
        const shipment = await prisma.shipment.findUnique({
            where: { id },
            select: { id: true, realTimeData: true, currentLocation: true, status: true },
        });
        if (!shipment) throw new Error('Shipment not found');
        return shipment;
    },

    async delete(id: string) {
        await prisma.shipment.delete({ where: { id } });
        return { id };
    },
};
