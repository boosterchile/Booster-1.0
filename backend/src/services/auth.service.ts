import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';

interface RegisterData {
    username: string;
    email: string;
    password: string;
    name: string;
    role: 'Shipper' | 'Carrier';
    companyName: string;
    certifications?: string[];
}

interface LoginData {
    username: string;
    password: string;
}

export const authService = {
    async register(data: RegisterData) {
        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username: data.username }, { email: data.email }],
            },
        });

        if (existingUser) {
            if (existingUser.username === data.username) {
                throw new Error(`El usuario '${data.username}' ya existe.`);
            }
            throw new Error(`El email '${data.email}' ya está registrado.`);
        }

        // Hash password
        const passwordHash = await hashPassword(data.password);

        // Create user
        const user = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                passwordHash,
                name: data.name,
                role: data.role,
                companyName: data.companyName,
                status: data.role === 'Carrier' ? 'PENDING_APPROVAL' : 'ACTIVE',
                certifications: data.certifications || [],
                preferences: {
                    language: 'es',
                    notifications: { email: true, inApp: true, sms: false },
                    theme: 'dark',
                },
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    data.name
                )}&background=random&color=FFFFFF&font-size=0.5&length=2`,
            },
        });

        // Generate token
        const token = signToken({
            userId: user.id,
            username: user.username,
            role: user.role,
        });

        // Return user without password hash
        const { passwordHash: _, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token };
    },

    async login(data: LoginData) {
        // Find user
        const user = await prisma.user.findUnique({
            where: { username: data.username },
        });

        if (!user) {
            throw new Error('Usuario o contraseña incorrectos.');
        }

        // Verify password
        const isValidPassword = await comparePassword(data.password, user.passwordHash);

        if (!isValidPassword) {
            throw new Error('Usuario o contraseña incorrectos.');
        }

        // Check user status
        if (user.status === 'INACTIVE') {
            throw new Error('Tu cuenta está inactiva. Contacta al administrador.');
        }

        if (user.status === 'PENDING_APPROVAL') {
            throw new Error('Tu cuenta está pendiente de aprobación.');
        }

        // Generate token
        const token = signToken({
            userId: user.id,
            username: user.username,
            role: user.role,
        });

        // Return user without password hash
        const { passwordHash: _, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token };
    },

    async validateToken(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('Usuario no encontrado.');
        }

        const { passwordHash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },
};
