import prisma from '../config/database.js';

interface CreateCargoData {
    origin: string;
    destination: string;
    cargoType: string;
    weightKg: number;
    volumeM3: number;
    pickupDate: string;
    deliveryDate: string;
}

interface UpdateCargoData extends Partial<CreateCargoData> {
    status?: 'PENDING' | 'MATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'CONSOLIDATING';
}

export const cargoService = {
    async getAll(userId: string, userRole: string) {
        // Shippers see only their cargo, Carriers and Admins see all
        const where = userRole === 'Shipper' ? { shipperId: userId } : {};

        const cargoOffers = await prisma.cargoOffer.findMany({
            where,
            include: {
                shipper: {
                    select: {
                        id: true,
                        name: true,
                        companyName: true,
                        rating: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return cargoOffers;
    },

    async getById(id: string) {
        const cargo = await prisma.cargoOffer.findUnique({
            where: { id },
            include: {
                shipper: {
                    select: {
                        id: true,
                        name: true,
                        companyName: true,
                        rating: true,
                    },
                },
                shipments: true,
            },
        });

        if (!cargo) {
            throw new Error('Cargo offer not found');
        }

        return cargo;
    },

    async create(data: CreateCargoData, shipperId: string) {
        const cargo = await prisma.cargoOffer.create({
            data: {
                ...data,
                pickupDate: new Date(data.pickupDate),
                deliveryDate: new Date(data.deliveryDate),
                status: 'PENDING',
                shipperId,
            },
            include: {
                shipper: {
                    select: {
                        id: true,
                        name: true,
                        companyName: true,
                    },
                },
            },
        });

        // Create blockchain event
        await prisma.blockchainEvent.create({
            data: {
                eventType: 'CARGO_OFFER_CREATED',
                details: { cargoId: cargo.id, origin: cargo.origin, destination: cargo.destination },
                relatedEntityId: cargo.id,
                actorId: shipperId,
            },
        });

        return cargo;
    },

    async update(id: string, data: UpdateCargoData, userId: string, userRole: string) {
        // Check if cargo exists and user has permission
        const existingCargo = await prisma.cargoOffer.findUnique({
            where: { id },
        });

        if (!existingCargo) {
            throw new Error('Cargo offer not found');
        }

        // Only owner or admin can update
        if (userRole !== 'Admin' && existingCargo.shipperId !== userId) {
            throw new Error('You do not have permission to update this cargo offer');
        }

        const updateData: any = {};
        if (data.origin) updateData.origin = data.origin;
        if (data.destination) updateData.destination = data.destination;
        if (data.cargoType) updateData.cargoType = data.cargoType;
        if (data.weightKg) updateData.weightKg = data.weightKg;
        if (data.volumeM3) updateData.volumeM3 = data.volumeM3;
        if (data.pickupDate) updateData.pickupDate = new Date(data.pickupDate);
        if (data.deliveryDate) updateData.deliveryDate = new Date(data.deliveryDate);
        if (data.status) updateData.status = data.status;

        const updatedCargo = await prisma.cargoOffer.update({
            where: { id },
            data: updateData,
        });

        return updatedCargo;
    },

    async delete(id: string, userId: string, userRole: string) {
        // Check if cargo exists and user has permission
        const existingCargo = await prisma.cargoOffer.findUnique({
            where: { id },
        });

        if (!existingCargo) {
            throw new Error('Cargo offer not found');
        }

        // Only owner or admin can delete
        if (userRole !== 'Admin' && existingCargo.shipperId !== userId) {
            throw new Error('You do not have permission to delete this cargo offer');
        }

        await prisma.cargoOffer.delete({
            where: { id },
        });

        return { id };
    },
};
