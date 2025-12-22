import prisma from '../config/database.js';

export const vehicleService = {
    async getAll(userId: string, userRole: string) {
        const where = userRole === 'Carrier' ? { carrierId: userId } : {};
        return prisma.vehicle.findMany({
            where,
            include: {
                carrier: { select: { id: true, name: true, companyName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    },

    async getById(id: string) {
        const vehicle = await prisma.vehicle.findUnique({
            where: { id },
            include: { carrier: true, shipments: true },
        });
        if (!vehicle) throw new Error('Vehicle not found');
        return vehicle;
    },

    async create(data: any, carrierId: string) {
        return prisma.vehicle.create({
            data: { ...data, carrierId },
            include: { carrier: { select: { id: true, name: true } } },
        });
    },

    async update(id: string, data: any, userId: string, userRole: string) {
        const existing = await prisma.vehicle.findUnique({ where: { id } });
        if (!existing) throw new Error('Vehicle not found');
        if (userRole !== 'Admin' && existing.carrierId !== userId) {
            throw new Error('You do not have permission to update this vehicle');
        }
        return prisma.vehicle.update({ where: { id }, data });
    },

    async delete(id: string, userId: string, userRole: string) {
        const existing = await prisma.vehicle.findUnique({ where: { id } });
        if (!existing) throw new Error('Vehicle not found');
        if (userRole !== 'Admin' && existing.carrierId !== userId) {
            throw new Error('You do not have permission to delete this vehicle');
        }
        await prisma.vehicle.delete({ where: { id } });
        return { id };
    },
};
