import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwt';
import authRepository from '../repositories/authRepository';
import { JWTPayload } from '../../types';
import { logger } from '../../utils/logger';

const authService = {
    login: async (email: string, password: string): Promise<string> => {
        try {
            const user = await authRepository.getUserByEmail(email);
            if (!user) {
                throw new Error('Invalid email or password');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }
            const payload: JWTPayload = {
                user_id: user.user_id,
                email: user.email,
                role: user.role
            };
            return generateToken(payload);
        } catch (error: any) {
            logger.error(`Error in authService.login: ${error.message}`);
            throw error;
        }
    }
}

export default authService;