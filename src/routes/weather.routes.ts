import { Router } from 'express';
import { getWeather } from '../controllers/weather.controllers';
import { authorized } from '../utils/authorize';

const router = Router();

router.get('/', authorized, getWeather);

export default router;