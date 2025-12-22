import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface JwtPayload {
    userId: string;
    username: string;
    role: string;
}

export const signToken = (payload: JwtPayload): string => {
    // @ts-ignore - Type conflict with jsonwebtoken v9 types
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    }) as string;
};

export const verifyToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};
