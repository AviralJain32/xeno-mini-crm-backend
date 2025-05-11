import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CommunicationLog } from '../models/communicationLog.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import mongoose from 'mongoose';

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
      `${process.env.BACKEND_URL}/api/communicationlogs/delivery-receipt`,
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


export const getCustomersFromCampaign=async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("may yaha hu ")
    const { campaignId } = req.params;

    // Validate campaignId as a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      throw new ApiError(400, 'Invalid campaign ID format');
    }

    const logs = await CommunicationLog.find({ campaignId })
      .populate('campaignOwnerId', 'name email') // assuming userId is ref to User
      .sort({ createdAt: -1 });

    if (!logs || logs.length === 0) {
      throw new ApiError(404, 'No communication logs found for this campaign');
    }

    res.status(200).json(new ApiResponse(200, logs, 'Logs fetched successfully'));
  } catch (err: any) {
    next(
      new ApiError(
        err.statusCode || 500,
        err.message || 'Internal server error while fetching communication logs',
        [],
        err.stack
      )
    );
  }
}