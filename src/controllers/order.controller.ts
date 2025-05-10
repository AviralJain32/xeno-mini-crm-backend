import { Request, Response, NextFunction } from 'express';
import { sendKafkaMessage } from '../kafka/producer';
import { z } from 'zod';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

export const orderSchema = z.object({
  customerId: z.string().min(1),
  amount: z.number().min(0),
  date: z.coerce.date(), // automatically parses ISO string to Date
});

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = orderSchema.parse(req.body);
    console.log(validatedData);

    await sendKafkaMessage('orders', validatedData);

    const response = new ApiResponse(202, null, 'Order queued for creation.');
    res.status(202).json(response);
  } catch (err:any) {
    if (err instanceof z.ZodError) {
      return next(new ApiError(400, 'Validation failed', err.errors));
    }

    return next(
      new ApiError(err.statusCode||500,err?.message || 'Failed to publish order data', [], err?.stack)
    );
  }
};
