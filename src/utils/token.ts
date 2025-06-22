import jwt from 'jsonwebtoken';
import { iUser } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'none';

export const generateToken = (user: any): string => {
    try {
        const userData = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(userData, JWT_SECRET, {
            expiresIn: '15m',
            algorithm: 'HS256'
        });
        return token;
    } catch (error) {
        throw new Error('token creation failed');     
    }
};

export const verifyToken = (token: string): iUser | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as iUser;
        return decoded;
    } catch (error) {
        return null;
    }
};