"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.History = void 0;
const mongoose_1 = require("mongoose");
const historySchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    weather: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Weather', required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    requestedAt: { type: Date, default: Date.now, index: true }
});
historySchema.index({ user: 1, requestedAt: -1 });
exports.History = (0, mongoose_1.model)('History', historySchema);
