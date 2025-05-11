import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CommunicationLog } from '../models/communicationLog.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

// Input validation
const VendorSendSchema = z.object({
  deliveryId: z.string().length(24, 'Invalid delivery ID format'),
});

const DeliveryReceiptSchema = z.object({
  deliveryId: z.string().length(24, 'Invalid delivery ID format'),
  status: z.enum(['SENT', 'FAILED']),
});

// Simulated vendor sending function
export const vendorSend = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = VendorSendSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, 'Validation error in vendorSend');
    }

    const { deliveryId } = parsed.data;
    const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';

    // Simulate calling the delivery receipt API
    const response = await fetch(
      'http://localhost:5000/api/communicationlogs/delivery-receipt',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Auth': process.env.INTERNAL_SECRET!,
        },
        body: JSON.stringify({ deliveryId, status }),
      },
    );

    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to notify delivery receipt');
    }

    const apiRes = new ApiResponse(
      200,
      { vendorMessageId: deliveryId },
      'Vendor sent message successfully',
    );
    res.status(200).json(apiRes);
  } catch (err: any) {
    next(
      new ApiError(
        err.statusCode || 500,
        err.message || 'Internal error in vendor send',
        [],
        err.stack,
      ),
    );
  }
};

// Delivery receipt endpoint
export const deliveryReceipt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = DeliveryReceiptSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, 'Validation error in deliveryReceipt');
    }

    const { deliveryId, status } = parsed.data;

    const updated = await CommunicationLog.findByIdAndUpdate(deliveryId, {
      status,
      deliveryTime: new Date(),
    });

    if (!updated) {
      throw new ApiError(404, 'Communication log not found');
    }

    const apiRes = new ApiResponse(
      200,
      { success: true },
      'Delivery status updated',
    );
    res.status(200).json(apiRes);
  } catch (err: any) {
    next(
      new ApiError(
        err.statusCode || 500,
        err.message || 'Internal error in delivery receipt',
        [],
        err.stack,
      ),
    );
  }
};
