import mongoose, { Document, Schema } from 'mongoose';

export interface CustomerDocument extends Document {
  name: string;
  email: string;
  phone: string;
  totalSpend: number;
  visits: number;
  lastVisit: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<CustomerDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    totalSpend: { type: Number, default: 0 },
    visits: { type: Number, default: 0 },
    lastVisit: { type: Date },
  },
  { timestamps: true }
);

export const Customer = mongoose.model<CustomerDocument>('Customer', CustomerSchema);
