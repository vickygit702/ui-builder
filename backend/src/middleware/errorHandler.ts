import { Request, Response, NextFunction } from 'express';

// Centralized error handler -- every controller calls next(err) on failure
// instead of shaping its own error response.
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
}
