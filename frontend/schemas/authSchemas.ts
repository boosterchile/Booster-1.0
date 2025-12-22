import { z } from 'zod';

/**
 * Validation schema for login form
 */
export const loginSchema = z.object({
    username: z
        .string()
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .max(50, 'El nombre de usuario no puede exceder 50 caracteres'),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(100, 'La contraseña no puede exceder 100 caracteres'),
});

/**
 * Validation schema for registration form
 */
export const registerSchema = z.object({
    username: z
        .string()
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .max(50, 'El nombre de usuario no puede exceder 50 caracteres')
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos'
        ),
    name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres'),
    email: z
        .string()
        .email('Por favor ingresa un email válido')
        .max(255, 'El email no puede exceder 255 caracteres'),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(100, 'La contraseña no puede exceder 100 caracteres')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
        ),
    role: z.enum(['Shipper', 'Carrier', 'Admin'], {
        errorMap: () => ({ message: 'Por favor selecciona un rol válido' }),
    }),
    companyName: z
        .string()
        .min(2, 'El nombre de la empresa debe tener al menos 2 caracteres')
        .max(200, 'El nombre de la empresa no puede exceder 200 caracteres'),
});

// Type inference from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
