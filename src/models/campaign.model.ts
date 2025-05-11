import mongoose, { Document, Schema, Types } from 'mongoose';

export interface CampaignDocument extends Document {
  name: string;
  segmentId: Types.ObjectId;
  userId: Types.ObjectId;
  message: string;
  audienceSize: number;
  // sent: number;
  // failed: number;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema = new Schema<CampaignDocument>(
  {
    name: { type: String, required: true },
    segmentId: { type: Schema.Types.ObjectId, ref: 'Segment', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    audienceSize: { type: Number, required: true },
    // sent: { type: Number, default: 0 },
    // failed: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Campaign = mongoose.model<CampaignDocument>(
  'Campaign',
  CampaignSchema,
);
