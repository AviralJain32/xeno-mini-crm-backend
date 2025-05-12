import { Request, Response, NextFunction } from 'express';
import { sendKafkaMessage } from '../kafka/producer';
import { z } from 'zod';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { Customer } from '../models/customer.model';

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10).max(15),
  totalSpend: z.number().optional(),
  visits: z.number().optional(),
  lastVisit: z.string().datetime().optional(),
});

export const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = customerSchema.parse(req.body);

    await sendKafkaMessage('customers', parsed);

    const response = new ApiResponse(
      202,
      null,
      'Customer queued for creation.',
    );
    res.status(202).json(response);
  } catch (err: any) {
    console.log(err);
    if (err instanceof z.ZodError) {
      return next(new ApiError(400, 'Validation failed', err.errors));
    }
    return next(
      new ApiError(500, err?.message || 'Failed to publish customer data', []),
    );
  }
};

export const getAllCustomers = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await Customer.find()
      .select('-__v') // Exclude internal fields
      .sort({ createdAt: -1 })

    res.status(200).json(new ApiResponse(200, customers, 'Customers fetched successfully'));
  } catch (err: any) {
    next(
      new ApiError(
        err.statusCode || 500,
        err.message || 'Failed to fetch customers',
        [],
        err.stack
      )
    );
  }
};
