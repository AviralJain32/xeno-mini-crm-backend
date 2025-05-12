import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.log('Incoming request:', req.path, req.headers);
  try {
    const internalAuth = req.headers['x-internal-auth'];
    if (internalAuth === process.env.INTERNAL_SECRET) {
      return next();
    }

    const token = req.cookies?.token;

    if (!token) {
      throw new ApiError(401, 'Authentication token missing');
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: any, decoded: any) => {
        if (err) {
          const message =
            err.name === 'TokenExpiredError'
              ? 'Session expired. Please login again.'
              : 'Invalid token. Authentication failed.';
          throw new ApiError(403, message);
        }

        (req as any).user = decoded as JwtPayload;
        next();
      },
    );
  } catch (err) {
    const status = err instanceof ApiError ? err.statusCode : 500;
    const message =
      err instanceof ApiError ? err.message : 'Authentication middleware error';
    next(new ApiError(status, message));
  }
};
