import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { verifyToken } from './token';

export interface AuthRequest extends Request {
  user?: any;
}

export const authorized = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'no token provided' });
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ message: 'invalid token' });
      return;
    }

    const user = await User.findById(decoded.id);
    
    if (!user) {
      res.status(401).json({ message: 'not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'error' });
  }
};
