import jwt from 'jsonwebtoken';
import { environment } from '../config/environment';
import { JWTPayload } from '../types';
import { logger } from './logger';

export const generateToken = (payload: JWTPayload): string => {
    try {
        return jwt.sign(payload, environment.jwtSecret!, { expiresIn: '1h' });
    } catch (error: any) {
        logger.error(`Error generating JWT: ${error.message}`);
        throw error;
    }
};

export const verifyToken = (token: string): JWTPayload => {
    try {
        return jwt.verify(token, environment.jwtSecret!) as JWTPayload;
    } catch (error: any) {
        logger.error(`Error verifying JWT: ${error.message}`);
        throw error;
    }
};