import { Router } from 'express';
import { signUp, signIn, signOut } from '../controllers/auth.controllers';
import { authorized } from '../utils/authorize';

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', authorized, signOut);

export default router;