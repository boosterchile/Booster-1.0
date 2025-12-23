import prisma from '../config/database.js';

export const alertService = {
    async getAll(userId?: string) {
        const where = userId ? { recipientId: userId } : {};
        return prisma.alert.findMany({
            where,
            include: {
                relatedShipment: { select: { id: true, status: true } },
                recipient: { select: { id: true, name: true } },
            },
            orderBy: { timestamp: 'desc' },
        });
    },

    async getById(id: string) {
        const alert = await prisma.alert.findUnique({
            where: { id },
            include: { relatedShipment: true, recipient: true },
        });
        if (!alert) throw new Error('Alert not found');
        return alert;
    },

    async create(data: any) {
        return prisma.alert.create({
            data,
            include: { relatedShipment: true, recipient: true },
        });
    },

    async markAsRead(id: string) {
        return prisma.alert.update({
            where: { id },
            data: { isRead: true },
        });
    },

    async delete(id: string) {
        await prisma.alert.delete({ where: { id } });
        return { id };
    },
};
