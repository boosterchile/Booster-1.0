import { z } from 'zod';

// Auth Schemas
export const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(1, 'Name is required'),
    role: z.enum(['Shipper', 'Carrier']),
    companyName: z.string().min(1, 'Company name is required'),
    certifications: z.array(z.string()).optional(),
});

export const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

// Cargo Schemas
export const createCargoSchema = z.object({
    origin: z.string().min(1, 'Origin is required'),
    destination: z.string().min(1, 'Destination is required'),
    cargoType: z.string().min(1, 'Cargo type is required'),
    weightKg: z.number().positive('Weight must be positive'),
    volumeM3: z.number().positive('Volume must be positive'),
    pickupDate: z.string().datetime(),
    deliveryDate: z.string().datetime(),
});

export const updateCargoSchema = createCargoSchema.partial().extend({
    status: z.enum(['PENDING', 'MATCHED', 'IN_TRANSIT', 'DELIVERED', 'CONSOLIDATING']).optional(),
});

// Vehicle Schemas
export const createVehicleSchema = z.object({
    type: z.enum(['TRUCK_LTL', 'TRUCK_FTL', 'VAN', 'REFRIGERATED_TRUCK']),
    capacityKg: z.number().positive(),
    capacityM3: z.number().positive(),
    currentLocation: z.string().min(1),
    availability: z.enum(['AVAILABLE', 'ON_TRIP', 'MAINTENANCE']).default('AVAILABLE'),
    driverName: z.string().optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

// Shipment Schemas
export const createShipmentSchema = z.object({
    cargoId: z.string().uuid(),
    vehicleId: z.string().uuid(),
    currentLocation: z.string().min(1),
    estimatedDelivery: z.string().datetime(),
    realTimeData: z.any().optional(),
});

export const updateShipmentSchema = z.object({
    currentLocation: z.string().optional(),
    status: z.enum(['IN_TRANSIT', 'DELAYED', 'DELIVERED', 'ISSUE_REPORTED']).optional(),
    estimatedDelivery: z.string().datetime().optional(),
    realTimeData: z.any().optional(),
});

// Alert Schemas
export const createAlertSchema = z.object({
    message: z.string().min(1),
    severity: z.enum(['INFO', 'WARNING', 'CRITICAL']),
    relatedShipmentId: z.string().uuid().optional(),
    recipientId: z.string().uuid().optional(),
});
