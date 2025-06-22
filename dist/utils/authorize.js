"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorized = void 0;
const user_model_1 = require("../models/user.model");
const token_1 = require("./token");
const authorized = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'no token provided' });
            return;
        }
        const decoded = (0, token_1.verifyToken)(token);
        if (!decoded) {
            res.status(401).json({ message: 'invalid token' });
            return;
        }
        const user = await user_model_1.User.findById(decoded.id);
        if (!user) {
            res.status(401).json({ message: 'not found' });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'error' });
    }
};
exports.authorized = authorized;
