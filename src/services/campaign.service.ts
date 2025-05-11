// services/campaign.service.ts
import {
  CommunicationLog,
  CommunicationLogDocument,
} from '../models/communicationLog.model';
import { sendKafkaMessageForDelivery } from '../kafka/producer';
import { getSegmentUsers } from './getSegmentUsers.service';
import { Types } from 'mongoose';

export const queueCampaignDeliveries = async (
  campaign: any,
  campaignOwnerId: string,
) => {
  const users = await getSegmentUsers(campaign.segmentId);
  const kafkaMessages = [];

  for (const customer of users) {
    const personalizedMessage = campaign.message.replace(
      '{{name}}',
      customer.name,
    );

    const log: CommunicationLogDocument = await CommunicationLog.create({
      campaignId: campaign._id,
      campaignOwnerId: new Types.ObjectId(campaignOwnerId),
      customerId: customer._id,
      message: personalizedMessage,
      status: 'PENDING', // Initially pending, will be updated via Delivery Receipt
    });

    kafkaMessages.push({
      logId: log._id,
      campaignId: campaign._id,
      message: personalizedMessage,
      phoneNumber: customer.phone,
    });
  }

  await sendKafkaMessageForDelivery('campaign-delivery', kafkaMessages);
};
