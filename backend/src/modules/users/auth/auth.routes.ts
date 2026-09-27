import { Router } from 'express';
import { login } from './auth.controller';

const router = Router();

// POST /api/users/auth/login
router.post('/login', login);

export default router;
