import mongoose, { Document, Schema, Types } from 'mongoose';

export interface OrderDocument extends Document {
  customerId: Types.ObjectId;
  amount: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<OrderDocument>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true },
);

export const Order = mongoose.model<OrderDocument>('Order', OrderSchema);
