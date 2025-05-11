import mongoose, { Schema, Document, Types } from 'mongoose';

// export type OperatorType = '>' | '<' | '=' | 'in' | 'days_ago';
// export type FieldType = 'totalSpend' | 'visits' | 'lastVisit';
// export type ConditionType = 'AND' | 'OR';

// export interface Rule {
//   field: FieldType;
//   operator: OperatorType;
//   value: any;
//   conditionType: ConditionType;
// }

export interface SegmentDocument extends Document {
  userId: Types.ObjectId;
  name: string;
  rules: Record<string, any>;
  audienceSize: number;
  createdAt: Date;
  updatedAt: Date;
}

// const RuleSchema: Schema<Rule> = new Schema<Rule>(
//   {
//     field: {
//       type: String,
//       enum: ['totalSpend', 'visits', 'lastVisit'],
//       required: true,
//     },
//     operator: {
//       type: String,
//       enum: ['>', '<', '=', 'in', 'days_ago'],
//       required: true,
//     },
//     value: {
//       type: Schema.Types.Mixed,
//       required: true,
//     },
//     conditionType: {
//       type: String,
//       enum: ['AND', 'OR'],
//       required: true,
//     },
//   },
//   { _id: false }
// );

const SegmentSchema: Schema<SegmentDocument> = new Schema<SegmentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rules: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
    audienceSize: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Segment = mongoose.model<SegmentDocument>(
  'Segment',
  SegmentSchema,
);
