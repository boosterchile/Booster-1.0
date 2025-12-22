import prisma from '../src/config/database.js';
import { hashPassword } from '../src/utils/password.js';

async function main() {
    console.log('🌱 Seeding database...');

    // Create users
    const adminPassword = await hashPassword('password123');
    const shipperPassword = await hashPassword('password123');
    const carrierPassword = await hashPassword('password123');

    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            email: 'admin@smartaicargo.com',
            passwordHash: adminPassword,
            name: 'Admin User',
            role: 'Admin',
            companyName: 'SmartAICargo Platform',
            status: 'ACTIVE',
            preferences: {
                language: 'es',
                notifications: { email: true, inApp: true, sms: false },
                theme: 'dark',
            },
            certifications: [],
            avatarUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=4f46e5&color=FFFFFF',
        },
    });

    const shipper = await prisma.user.upsert({
        where: { username: 'shipper' },
        update: {},
        create: {
            username: 'shipper',
            email: 'shipper@example.com',
            passwordHash: shipperPassword,
            name: 'Shipper Example Co.',
            role: 'Shipper',
            companyName: 'Shipper Example Co.',
            status: 'ACTIVE',
            preferences: {
                language: 'es',
                notifications: { email: true, inApp: true, sms: false },
                theme: 'dark',
            },
            certifications: [],
            avatarUrl: 'https://ui-avatars.com/api/?name=Shipper&background=10b981&color=FFFFFF',
        },
    });

    const carrier = await prisma.user.upsert({
        where: { username: 'carrier' },
        update: {},
        create: {
            username: 'carrier',
            email: 'carrier@example.com',
            passwordHash: carrierPassword,
            name: 'Carrier Express Services',
            role: 'Carrier',
            companyName: 'Carrier Express Services',
            status: 'ACTIVE',
            preferences: {
                language: 'es',
                notifications: { email: true, inApp: true, sms: false },
                theme: 'dark',
            },
            certifications: ['RUTC Vigente', 'Seguro Carga Total'],
            avatarUrl: 'https://ui-avatars.com/api/?name=Carrier&background=f59e0b&color=FFFFFF',
        },
    });

    console.log('✅ Created users:', { admin: admin.username, shipper: shipper.username, carrier: carrier.username });

    // Create cargo offers
    const cargo1 = await prisma.cargoOffer.create({
        data: {
            origin: 'Santiago',
            destination: 'Valparaíso',
            cargoType: 'Electronics',
            weightKg: 500,
            volumeM3: 2.5,
            pickupDate: new Date('2025-12-01T10:00:00Z'),
            deliveryDate: new Date('2025-12-02T18:00:00Z'),
            status: 'PENDING',
            shipperId: shipper.id,
        },
    });

    const cargo2 = await prisma.cargoOffer.create({
        data: {
            origin: 'Concepción',
            destination: 'Santiago',
            cargoType: 'Food Products',
            weightKg: 1200,
            volumeM3: 5.0,
            pickupDate: new Date('2025-12-03T08:00:00Z'),
            deliveryDate: new Date('2025-12-04T16:00:00Z'),
            status: 'PENDING',
            shipperId: shipper.id,
        },
    });

    console.log('✅ Created cargo offers:', cargo1.id, cargo2.id);

    // Create vehicles
    const vehicle1 = await prisma.vehicle.create({
        data: {
            type: 'TRUCK_FTL',
            capacityKg: 25000,
            capacityM3: 80,
            currentLocation: 'Santiago',
            availability: 'AVAILABLE',
            driverName: 'Juan Pérez',
            carrierId: carrier.id,
        },
    });

    const vehicle2 = await prisma.vehicle.create({
        data: {
            type: 'REFRIGERATED_TRUCK',
            capacityKg: 10000,
            capacityM3: 40,
            currentLocation: 'Valparaíso',
            availability: 'AVAILABLE',
            driverName: 'María González',
            carrierId: carrier.id,
        },
    });

    console.log('✅ Created vehicles:', vehicle1.id, vehicle2.id);

    // Create a shipment
    const shipment1 = await prisma.shipment.create({
        data: {
            cargoId: cargo1.id,
            vehicleId: vehicle1.id,
            currentLocation: 'En ruta - Km 45 Ruta 68',
            status: 'IN_TRANSIT',
            estimatedDelivery: new Date('2025-12-02T18:00:00Z'),
            realTimeData: {
                latitude: -33.3925,
                longitude: -70.5969,
                speedKmh: 85,
                doorOpen: false,
            },
        },
    });

    // Update cargo status
    await prisma.cargoOffer.update({
        where: { id: cargo1.id },
        data: { status: 'IN_TRANSIT' },
    });

    console.log('✅ Created shipment:', shipment1.id);

    // Create alerts
    const alert1 = await prisma.alert.create({
        data: {
            message: 'Envío en camino - ETA 2 horas',
            severity: 'INFO',
            relatedShipmentId: shipment1.id,
            recipientId: shipper.id,
            isRead: false,
        },
    });

    console.log('✅ Created alert:', alert1.id);

    // Create blockchain events
    await prisma.blockchainEvent.create({
        data: {
            eventType: 'SHIPMENT_CREATED',
            details: { shipmentId: shipment1.id, cargoId: cargo1.id, vehicleId: vehicle1.id },
            relatedEntityId: shipment1.id,
            actorId: admin.id,
        },
    });

    console.log('✅ Database seeded successfully!');
    console.log('\n📝 Test credentials:');
    console.log('   Admin:   username: admin    password: password123');
    console.log('   Shipper: username: shipper  password: password123');
    console.log('   Carrier: username: carrier  password: password123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
