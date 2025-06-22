"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = void 0;
const history_model_1 = require("../models/history.model");
const getHistory = async (req, res) => {
    try {
        const { count, limit, skip, sort } = req.query;
        if (count === 'true') {
            const total = await history_model_1.History.countDocuments({ user: req.user._id });
            res.status(200).json({ total });
            return;
        }
        const history = await history_model_1.History.find({ user: req.user._id })
            .populate('weather')
            .sort(sort)
            .skip(Number(skip))
            .limit(Number(limit));
        const histories = history.map(({ lat, lon, requestedAt, weather }) => ({
            lat,
            lon,
            requestedAt: requestedAt.toISOString(),
            weather: {
                source: weather?.source || 'cache',
                tempC: weather?.data?.main?.temp,
                description: weather?.data?.weather?.[0]?.description,
                location: weather?.data?.name,
            },
        }));
        res.status(200).json(histories);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'error getting history',
        });
    }
};
exports.getHistory = getHistory;
