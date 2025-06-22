import { Router } from 'express';
import { getHistory } from '../controllers/history.controllers';
import { authorized } from '../utils/authorize';

const router = Router();

router.get('/', authorized, getHistory);

export default router;