// kafka/consumer.ts
import { kafka } from '../config/kafka.config';
import axios from 'axios';

const consumer = kafka.consumer({
  groupId: 'delivery-group-for-xeno-mini-crm',
});

export const startKafkaConsumer = async () => {
  console.log('STARTED');
  await consumer.connect();
  await consumer.subscribe({
    topic: 'campaign-delivery',
    fromBeginning: false,
  });

  await consumer.run({
    eachBatch: async ({ batch, resolveOffset, heartbeat }) => {
      for (const message of batch.messages) {
        const data = JSON.parse(message.value?.toString() || '{}');

        // Call the vendor API (simulate delivery)
        await axios.post(
          `${process.env.BACKEND_URL}/api/communicationlogs/vendor/send`,
          {
            deliveryId: data.logId,
            message: data.message,
            phoneNumber: data.phoneNumber,
          },
          {
            headers: {
              'X-Internal-Auth': process.env.INTERNAL_SECRET, // e.g. "supersecurestring"
            },
          },
        );

        resolveOffset(message.offset);
        await heartbeat();
      }
    },
  });
};
