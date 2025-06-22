import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { generateToken, verifyToken } from '../utils/token';
import { AuthRequest } from '../utils/authorize';

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        error: {
          message: 'email already exists',
        },
      });
      return;
    }

    const newUser = await User.create({ email, password });

    const token = generateToken(newUser);

    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(201).json({
      success: true,
      token,
    });

  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'error creating a new user',
      },
    });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'user not found',
        },
      });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: {
          message: 'invalid email or password',
        },
      });
      return;
    }

    const token = generateToken(user);

    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).json({
      success: true,
      token,
    });

  } catch (error) {
    console.error(
      'sign in error:',
      error
    );
    res.status(500).json({
      success: false,
      error: {
        message: 'error signing in',
      },
    });
  }
};

export const signOut = async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          message: 'no token provided',
        },
      });
      return;
    }
  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({
      success: false,
      error: {
        message: 'invalid token',
      },
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: { message: 'signed out successfully' },
  });

  } catch (error) {
    console.error('sign out error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'error signing out',
      },
    });
  }
};
