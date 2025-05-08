import { Request, Response } from 'express';
import { sendKafkaMessage } from '../kafka/producer';
import { z } from 'zod';

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10).max(15),
  totalSpend: z.number().optional(),
  visits: z.number().optional(),
  lastVisit: z.string().datetime().optional(), // ISO string preferred
});

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const parsed = customerSchema.parse(req.body); // ✅ validation

    await sendKafkaMessage('customers', parsed); // 🔄 publish to Kafka

    res.status(202).json({ message: 'Customer queued for creation.' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ error: 'Failed to publish customer data' });
  }
};