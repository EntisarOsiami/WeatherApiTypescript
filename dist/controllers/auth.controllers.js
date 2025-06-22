"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signOut = exports.signIn = exports.signUp = void 0;
const user_model_1 = require("../models/user.model");
const token_1 = require("../utils/token");
const signUp = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            res.status(409).json({
                success: false,
                error: {
                    message: 'email already exists',
                },
            });
            return;
        }
        const newUser = await user_model_1.User.create({ email, password });
        const token = (0, token_1.generateToken)(newUser);
        res.setHeader('Authorization', `Bearer ${token}`);
        res.status(201).json({
            success: true,
            token,
        });
    }
    catch (error) {
        console.error('Sign up error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'error creating a new user',
            },
        });
    }
};
exports.signUp = signUp;
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.User.findOne({ email });
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
        const token = (0, token_1.generateToken)(user);
        res.setHeader('Authorization', `Bearer ${token}`);
        res.status(200).json({
            success: true,
            token,
        });
    }
    catch (error) {
        console.error('sign in error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'error signing in',
            },
        });
    }
};
exports.signIn = signIn;
const signOut = async (req, res) => {
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
        const decoded = (0, token_1.verifyToken)(token);
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
    }
    catch (error) {
        console.error('sign out error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'error signing out',
            },
        });
    }
};
exports.signOut = signOut;
