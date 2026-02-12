import { Request, Response, NextFunction } from 'express';
import { StatusCode } from '../enums';
import { logger } from '../utils/logger';

export const checkRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if(!req.user) {
                logger.warn('RBAC check failed: No user in request');
                return res.status(StatusCode.UNAUTHORIZED).json({
                    error: 'Authentication Required' 
                }); 
            }

            if (!allowedRoles.includes(req.user!.role)) {
                logger.warn(`RBAC check failed: User role '${req.user!.role}' not allowed`);
                return res.status(StatusCode.FORBIDDEN).json({
                    error: 'Access denied. Insufficient permissions.' 
                });
            }

            next();
        }
        catch (error: any) {
            logger.error(`RBAC middleware error: ${error.message}`);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
                error: 'Authorization check failed' 
            });
        }
    }
}