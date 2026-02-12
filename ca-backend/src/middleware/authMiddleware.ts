import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { JWTPayload } from '../types';
import { StatusCode } from '../enums';
import { logger } from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try{
    const authHeader = req.headers.authorization;
    if(!authHeader)
    {
        logger.warn('No authorization header provided');
        return res.status(StatusCode.UNAUTHORIZED).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    const token = authHeader.split(' ')[1];

    if(!token){
        logger.warn('No token provided in authorization header');
        return res.status(StatusCode.UNAUTHORIZED).json({ 
        error: 'Access denied. Invalid token format.' 
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  }
  catch (error: any) {
    logger.error(`Auth middleware error: ${error.message}`);
    return res.status(StatusCode.UNAUTHORIZED).json({ 
      error: 'Invalid or expired token' 
    });
  }
};