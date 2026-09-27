import { Request, Response, NextFunction } from 'express';
import { loginUser } from './auth.service';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: { message: 'Email and password are required' } });
      return;
    }

    const authResult = await loginUser({ email, password });
    res.status(200).json(authResult);
  } catch (err) {
    next(err);
  }
}
