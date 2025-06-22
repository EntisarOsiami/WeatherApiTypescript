import { Response } from 'express';
import { AuthRequest } from '../utils/authorize';
import { History } from '../models/history.model';

export const getHistory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { count, limit, skip, sort } = req.query;
    
    if (count === 'true') {
      const total = await History.countDocuments({ user: req.user._id });
      res.status(200).json({ total });
      return;
    }
    const history = await History.find({ user: req.user._id })
      .populate('weather')
      .sort(sort as string)
      .skip(Number(skip))
      .limit(Number(limit));

    const histories = history.map(({ lat, lon, requestedAt, weather }) => ({
      lat,
      lon,
      requestedAt: requestedAt.toISOString(),
      weather: {
        source: (weather as any)?.source || 'cache',
        tempC: (weather as any)?.data?.main?.temp,
        description: (weather as any)?.data?.weather?.[0]?.description,
      },
    }));

    res.status(200).json(histories);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'error getting history',
    });
  }
};
