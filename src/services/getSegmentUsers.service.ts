// services/segment.service.ts
import { Segment } from '../models/segment.model';
import { Customer } from '../models/customer.model';

export const getSegmentUsers = async (segmentId: string) => {
  const segment = await Segment.findById(segmentId);
  if (!segment) throw new Error('Segment not found');

  // Example: segment.rules = { age: { $gte: 18 }, gender: 'male' }
  const rules = segment.rules || {};

  const customers = await Customer.find(rules);
  return customers;
};
