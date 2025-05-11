import { Request, Response, NextFunction } from 'express';
import { Campaign } from '../models/campaign.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { UserDocument } from '../models/user.model';
import { isValidObjectId } from 'mongoose';
import { queueCampaignDeliveries } from '../services/campaign.service';

export const saveCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { campaignName, message, segmentId, audienceSize } = req.body;
    const user = req.user as UserDocument;

    // Validation of required fields
    if (!campaignName || !message || !segmentId || !audienceSize) {
      throw new ApiError(
        400,
        'Missing required fields: name, message, or segmentId,audienceSize',
      );
    }

    // Validate the user and segmentId
    const userId = user.id?.toString();
    if (!userId || !isValidObjectId(segmentId)) {
      throw new ApiError(400, 'Invalid user ID or segment ID');
    }

    // Optional: Check if campaign with same name already exists for user and segment
    const existingCampaign = await Campaign.findOne({
      name: campaignName,
      segmentId,
      userId,
    });
    if (existingCampaign) {
      throw new ApiError(
        409,
        'A campaign with this name already exists for this segment',
      );
    }

    // Create the campaign document
    const newCampaign = await Campaign.create({
      name: campaignName,
      segmentId,
      userId,
      message,
      audienceSize,
    });

    await queueCampaignDeliveries(newCampaign, userId);

    const response = new ApiResponse(
      201,
      newCampaign,
      'Your message has been send successfully',
    );
    res.status(201).json(response);
  } catch (err: any) {
    const stack = err instanceof Error ? err.stack : undefined;
    next(
      new ApiError(
        err.statusCode || 500,
        err.message || 'Internal server error while saving campaign',
        [],
        stack,
      ),
    );
  }
};

export const getAllCampaigns = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as UserDocument;
    const campaigns = await Campaign.find()
      .populate({
        path: 'segmentId',
        select: 'name', // Get only segment name
      })
      .populate({
        path: 'userId',
        select: 'name',
      })
      .select('name message audienceSize segmentId createdAt userId')
      .sort({ createdAt: -1 });

    if (!campaigns || campaigns.length === 0) {
      throw new ApiError(404, 'No campaigns found');
    }

    const response = new ApiResponse(
      200,
      campaigns,
      'Campaigns fetched successfully',
    );
    res.status(200).json(response);
  } catch (err: any) {
    next(
      new ApiError(
        err.statusCode || 500,
        err.message || 'Internal server error while fetching campaigns',
        [],
        err.stack,
      ),
    );
  }
};
