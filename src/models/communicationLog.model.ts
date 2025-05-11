import mongoose, { Document, Schema, Types } from 'mongoose';

export interface CommunicationLogDocument extends Document {
  campaignOwnerId: Types.ObjectId;
  campaignId: Types.ObjectId;
  customerId: Types.ObjectId;
  message: string;
  status: 'SENT' | 'FAILED' | 'PENDING';
  deliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CommunicationLogSchema = new Schema<CommunicationLogDocument>(
  {
    campaignOwnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['SENT', 'FAILED', 'PENDING'],
      required: true,
    },
    deliveryTime: { type: Date },
  },
  { timestamps: true },
);

export const CommunicationLog = mongoose.model<CommunicationLogDocument>(
  'CommunicationLog',
  CommunicationLogSchema,
);
