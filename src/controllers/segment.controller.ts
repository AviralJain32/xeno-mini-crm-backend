import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Customer } from '../models/customer.model';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import parser from 'mongodb-query-parser';
import { Segment } from '../models/segment.model';
import { UserDocument } from '../models/user.model';

function cleanMongoQuery(query: any) {
  if (query?.$and?.length === 1 && query.$and[0].$expr === true) {
    return {}; // Return an empty filter to match all
  }
  return query;
}

async function calcAudienceSize(mongoQuery: any) {
  let cleanMongoDbQuery;

  if (Object.keys(mongoQuery).length === 0) {
    throw new ApiError(400, 'Mongo query cannot be empty');
  }

  if (typeof mongoQuery === 'string') {
    try {
      mongoQuery = parser(mongoQuery);
      console.log(typeof mongoQuery);
      cleanMongoDbQuery = cleanMongoQuery(mongoQuery);
    } catch (err) {
      throw new ApiError(400, 'Invalid JSON string in mongoQuery');
    }
  }

  // const parseResult = MongoQuerySchema.safeParse(mongoQuery);

  // if (!parseResult.success) {
  //   throw new ApiError(400, 'Invalid MongoDB query format', parseResult.error.errors);
  // }
  // console.log("parseResult : ",parseResult)
  // const mongoQueryParsed = parseResult.data;

  const audienceSize = await Customer.countDocuments(cleanMongoDbQuery);

  return { audienceSize, cleanMongoDbQuery };
}

export const previewAudience = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let mongoQuery = req.body.mongoQuery;
    console.log(typeof mongoQuery);
    const { audienceSize, cleanMongoDbQuery } =
      await calcAudienceSize(mongoQuery);

    const response = new ApiResponse(
      200,
      { audienceSize },
      'Audience size calculated',
    );
    res.status(200).json(response);
  } catch (err: any) {
    const stack = err instanceof Error ? err.stack : undefined;
    next(
      new ApiError(
        err.statusCode || 500,
        err.message || 'Internal server error while previewing audience size',
        [],
        stack,
      ),
    );
  }
};

// Schema for validating segment data
const SaveSegmentSchema = z.object({
  name: z.string().min(1, 'Segment name is required'),
  rules: z.record(z.any()),
  audienceSize: z.number().min(0, 'Audience size must be non-negative'),
  userId: z.string().length(24, 'Invalid user ID format'),
});

export const saveSegment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, rules } = req.body;
    const user = req.user as UserDocument;

    // Ensure the user has a valid MongoDB ObjectId as _id
    const userId = user.id.toString();

    // Calculate audience size
    const { audienceSize, cleanMongoDbQuery } = await calcAudienceSize(rules);
    console.log(cleanMongoDbQuery);

    if (!name || !rules || !userId || audienceSize <= 0) {
      throw new ApiError(400, 'Missing Parameters while saving the segment');
    }

    // Check for existing segment with the same name for this user
    const existing = await Segment.findOne({ name, userId });
    if (existing) {
      throw new ApiError(
        409,
        'Segment with this name already exists for this user',
      );
    }
    console.log('ye hai segment se pahle', cleanMongoDbQuery);
    // Create new segment
    const segment = await Segment.create({
      name,
      rules: cleanMongoDbQuery,
      audienceSize,
      userId,
    });
    console.log(segment);

    const response = new ApiResponse(
      201,
      segment,
      'Segment saved successfully',
    );
    res.status(201).json(response);
  } catch (err: any) {
    const stack = err instanceof Error ? err.stack : undefined;
    next(
      new ApiError(
        err.statusCode || 500,
        err.message || 'Internal server error while saving segment',
        [],
        stack,
      ),
    );
  }
};
