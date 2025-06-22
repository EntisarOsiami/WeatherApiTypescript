"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeather = void 0;
const history_model_1 = require("../models/history.model");
const axios_1 = __importDefault(require("axios"));
const weather_model_1 = require("../models/weather.model");
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const getWeather = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const roundedLat = parseFloat(lat);
        const roundedLon = parseFloat(lon);
        let weatherData = await weather_model_1.Weather.findOne({
            lat: roundedLat,
            lon: roundedLon,
        });
        let isFromCache;
        if (weatherData) {
            isFromCache = true;
        }
        else {
            const response = await axios_1.default.get(`https://api.openweathermap.org/data/2.5/weather?lat=${roundedLat}&lon=${roundedLon}&appid=${OPENWEATHER_API_KEY}&units=metric`);
            weatherData = await weather_model_1.Weather.create({
                lat: roundedLat,
                lon: roundedLon,
                data: response.data,
                fetchedAt: new Date(),
            });
            isFromCache = false;
        }
        await history_model_1.History.create({
            user: req.user._id,
            lat: roundedLat,
            lon: roundedLon,
            weather: weatherData._id,
        });
        res.status(200).json({
            success: true,
            data: {
                location: weatherData.data.name,
                temperature: weatherData.data.main.temp,
                description: weatherData.data.weather[0].description,
                humidity: weatherData.data.main.humidity,
                windSpeed: weatherData.data.wind.speed,
            },
            source: isFromCache ? 'cache' : 'openweather',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'error trying to get weather data',
        });
    }
};
exports.getWeather = getWeather;
