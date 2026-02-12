import { Request, Response } from 'express';
import authService from '../services/authService';
import { LoginRequest } from '../../types';
import authValidation from '../validations/authValidation';
import { StatusCode } from '../../enums';
import { logger } from '../../utils/logger';

const authController ={
    login: async (req: Request, res: Response) => {
        try{
            const user: LoginRequest = req.body;
            const error = authValidation.validateLoginDetails(user);

             if (error.error) {
                return res.status(StatusCode.BAD_REQUEST).json({ error: error.error.details[0].message });
            }
            
            if (!user.email || !user.password) {
            return res.status(StatusCode.BAD_REQUEST).json({ error: 'Email and password required' });
            }
            const token = await authService.login(user.email, user.password);
            res.status(StatusCode.OK).json({ 
                token,
                message: 'Login successful'});

        }
        catch (error: any) {
        logger.error(`Login error: ${error.message}`);
        return res.status(StatusCode.UNAUTHORIZED).json({ 
            error: 'Invalid email or password' 
        });
        }
    } 
}

export default authController;