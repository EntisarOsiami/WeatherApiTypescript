"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weather = void 0;
const mongoose_1 = require("mongoose");
const weatherSchema = new mongoose_1.Schema({
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    data: { type: mongoose_1.Schema.Types.Mixed, required: true },
    fetchedAt: { type: Date, default: Date.now }
});
weatherSchema.index({ lat: 1, lon: 1 }, { unique: true });
exports.Weather = (0, mongoose_1.model)('Weather', weatherSchema);
