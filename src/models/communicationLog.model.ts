import mongoose, { Document, Schema, Types } from 'mongoose';

export interface CommunicationLogDocument extends Document {
  campaignId: Types.ObjectId;
  customerId: Types.ObjectId;
  message: string;
  status: 'SENT' | 'FAILED';
  deliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CommunicationLogSchema = new Schema<CommunicationLogDocument>(
  {
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['SENT', 'FAILED'], required: true },
    deliveryTime: { type: Date },
  },
  { timestamps: true }
);

export const CommunicationLog = mongoose.model<CommunicationLogDocument>(
  'CommunicationLog',
  CommunicationLogSchema
);
