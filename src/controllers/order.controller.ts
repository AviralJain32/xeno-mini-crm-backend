import { Request, Response, NextFunction } from 'express';
import { sendKafkaMessage } from '../kafka/producer';
import { z } from 'zod';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { Order } from '../models/order.model';

export const orderSchema = z.object({
  customerId: z.string().min(1),
  amount: z.number().min(0),
  date: z.coerce.date(), // automatically parses ISO string to Date
});

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = orderSchema.parse(req.body);
    console.log(validatedData);

    await sendKafkaMessage('orders', validatedData);

    const response = new ApiResponse(202, null, 'Order queued for creation.');
    res.status(202).json(response);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return next(new ApiError(400, 'Validation failed', err.errors));
    }

    return next(
      new ApiError(
        err.statusCode || 500,
        err?.message || 'Failed to publish order data',
        [],
        err?.stack,
      ),
    );
  }
};


export const getAllOrders = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email phone') // Include basic customer info
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, orders, 'Orders fetched successfully'));
  } catch (err: any) {
    next(
      new ApiError(err.statusCode || 500, err.message || 'Failed to fetch orders', [], err.stack)
    );
  }
};