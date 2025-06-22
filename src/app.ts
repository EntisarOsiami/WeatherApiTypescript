import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { databaseConnection } from './config/database';
import authRoutes from './routes/auth.routes';
import weatherRoutes from './routes/weather.routes';
import historyRoutes from './routes/history.routes';

config();
const port = process.env.PORT || 3000;

const app: Express = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 40, 
  message: {
    success: false,
    error: {
      message: 'try again later, too many requests'
    }
  }
});

app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

databaseConnection().catch(console.error);

app.use('/auth', authRoutes);
app.use('/weather', weatherRoutes);
app.use('/history', historyRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    success: true,
    data: { message: 'weather api' }
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: `not found `
    }
  });
});


app.listen(port, () => {
  console.log(`weather API server is running at http://localhost:${port}`);
});
