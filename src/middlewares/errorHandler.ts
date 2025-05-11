import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    status: err.statusCode,
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || [],
    data: null,
    stack: err.stack,
  });
};
