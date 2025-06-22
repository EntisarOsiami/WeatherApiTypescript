import { Response } from 'express';
import { AuthRequest } from '../utils/authorize';
import { History } from '../models/history.model';
import axios from 'axios';
import { Weather } from '../models/weather.model';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

export const getWeather = async (req: AuthRequest, res: Response) => {
  try {
    const { lat, lon } = req.query;

    const roundedLat = parseFloat(lat as string);
    const roundedLon = parseFloat(lon as string);      
    
    let weatherData = await Weather.findOne({
      lat: roundedLat,
      lon: roundedLon,
    });

    let isFromCache;    
    
    if (weatherData) {
      isFromCache = true;
    } else {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${roundedLat}&lon=${roundedLon}&appid=${OPENWEATHER_API_KEY}&units=metric` );

      weatherData = await Weather.create({
        lat: roundedLat,
        lon: roundedLon,
        data: response.data,
        fetchedAt: new Date(),
      });      
      isFromCache = false;
    }   
    
    await History.create({
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'error trying to get weather data',
    });
  }
};
