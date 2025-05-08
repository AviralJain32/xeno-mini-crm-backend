import { Request, Response } from 'express';
import { sendKafkaMessage } from '../kafka/producer';
import { z } from 'zod';

export const orderSchema = z.object({
  customerId: z.string().min(1),
  amount: z.number().min(0),
  date: z.coerce.date(), // automatically parses ISO string to Date
});

export const createOrder  = async (req: Request, res: Response) => {
  try {
    const validatedData = orderSchema.parse(req.body);
    console.log(validatedData)
    await sendKafkaMessage('orders', validatedData);
    res.status(202).json({ message: 'Order queued for creation.' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ error: 'Failed to publish order data' });
  }
};
