"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const weather_controllers_1 = require("../controllers/weather.controllers");
const authorize_1 = require("../utils/authorize");
const router = (0, express_1.Router)();
router.get('/', authorize_1.authorized, weather_controllers_1.getWeather);
exports.default = router;
