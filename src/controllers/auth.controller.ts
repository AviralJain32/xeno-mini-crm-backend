import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new ApiError(401, 'Unauthorized: No token provided');
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      throw new ApiError(401, 'Unauthorized: Invalid or expired token');
    }

    const user = await User.findById(decoded.id).select('-__v -password');

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const response = new ApiResponse(
      200,
      { user },
      'User fetched successfully',
    );
    res.status(200).json(response);
  } catch (err: any) {
    next(
      new ApiError(
        err.statusCode || 500,
        err.message || 'Internal server error while checking user',
        [],
        err.stack,
      ),
    );
  }
};
