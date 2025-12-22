import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiService } from '../../../services/apiService';

describe('apiService', () => {
    beforeEach(() => {
        // Reset any mock state if needed
        vi.clearAllMocks();
    });

    describe('login', () => {
        it('should login successfully with valid admin credentials', async () => {
            const response = await apiService.login('admin', 'password123');

            expect(response.success).toBe(true);
            expect(response.data).toBeDefined();
            expect(response.data?.user.role).toBe('Admin');
            expect(response.data?.token).toContain('simulated-token-admin');
        });

        it('should login successfully with valid shipper credentials', async () => {
            const response = await apiService.login('shipper', 'password123');

            expect(response.success).toBe(true);
            expect(response.data).toBeDefined();
            expect(response.data?.user.role).toBe('Shipper');
        });

        it('should reject invalid credentials', async () => {
            const response = await apiService.login('admin', 'wrongpassword');

            expect(response.success).toBe(false);
            expect(response.message).toBe('Usuario o contraseña incorrectos.');
        });

        it('should reject non-existent user', async () => {
            const response = await apiService.login('nonexistent', 'password');

            expect(response.success).toBe(false);
            expect(response.message).toBe('Usuario o contraseña incorrectos.');
        });

        it('should reject carrier with pending approval status', async () => {
            const response = await apiService.login('carrier', 'password123');

            expect(response.success).toBe(false);
            expect(response.message).toContain('pendiente de aprobación');
        });
    });

    describe('register', () => {
        it('should register a new shipper successfully', async () => {
            const newUser = {
                username: 'newshipper',
                password: 'SecurePass123',
                name: 'New Shipper Co',
                email: 'newshipper@example.com',
                role: 'Shipper' as const,
                companyName: 'New Shipper Company',
            };

            const response = await apiService.register(newUser);

            expect(response.success).toBe(true);
            expect(response.data).toBeDefined();
            expect(response.data?.username).toBe(newUser.username);
            expect(response.data?.status).toBe('Active'); // Shippers are active immediately
        });

        it('should register a new carrier with pending status', async () => {
            const newCarrier = {
                username: 'newcarrier',
                password: 'SecurePass123',
                name: 'New Carrier LLC',
                email: 'newcarrier@example.com',
                role: 'Carrier' as const,
                companyName: 'New Carrier Company',
            };

            const response = await apiService.register(newCarrier);

            expect(response.success).toBe(true);
            expect(response.data?.status).toBe('PendingApproval');
        });

        it('should reject duplicate username', async () => {
            const duplicateUser = {
                username: 'admin', // Already exists
                password: 'password',
                name: 'Duplicate',
                email: 'duplicate@example.com',
                role: 'Admin' as const,
                companyName: 'Test',
            };

            const response = await apiService.register(duplicateUser);

            expect(response.success).toBe(false);
            expect(response.message).toContain('ya existe');
        });
    });

    describe('validateToken', () => {
        it('should validate a valid token', async () => {
            const loginResponse = await apiService.login('admin', 'password123');
            expect(loginResponse.success).toBe(true);

            const token = loginResponse.data!.token;
            const userId = loginResponse.data!.user.id;

            const validateResponse = await apiService.validateToken(token, userId);

            expect(validateResponse.success).toBe(true);
            expect(validateResponse.data?.id).toBe(userId);
        });

        it('should reject invalid token', async () => {
            const response = await apiService.validateToken('invalid-token', 'admin');

            expect(response.success).toBe(false);
            expect(response.message).toContain('inválido o expirado');
        });
    });

    describe('getUsers', () => {
        it('should return list of users', async () => {
            const response = await apiService.getUsers();

            expect(response.success).toBe(true);
            expect(response.data).toBeDefined();
            expect(Array.isArray(response.data)).toBe(true);
            expect(response.data!.length).toBeGreaterThan(0);
        });
    });

    describe('updateUser', () => {
        it('should update user successfully', async () => {
            const usersResponse = await apiService.getUsers();
            const user = usersResponse.data![0];

            const updatedUser = { ...user, companyName: 'Updated Company' };
            const response = await apiService.updateUser(updatedUser);

            expect(response.success).toBe(true);
            expect(response.data?.companyName).toBe('Updated Company');
        });

        it('should reject updating non-existent user', async () => {
            const fakeUser = {
                id: 'nonexistent123',
                name: 'Fake',
                email: 'fake@test.com',
                role: 'Shipper' as const,
                companyName: 'Fake',
                rating: 3,
                completedTrips: 0,
                status: 'Active' as const,
                certifications: [],
                preferences: {
                    language: 'es' as const,
                    notifications: { email: true, inApp: true, sms: false },
                    theme: 'dark' as const,
                },
            };

            const response = await apiService.updateUser(fakeUser);

            expect(response.success).toBe(false);
            expect(response.message).toContain('no encontrado');
        });
    });
});
