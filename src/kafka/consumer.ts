import { kafka } from '../config/kafka.config';
import { Customer } from '../models/customer.model';
import { Order } from '../models/order.model';
import { sendKafkaMessage } from './producer';

const consumer = kafka.consumer({ groupId: 'xeno-group' });

const MAX_RETRIES = 3;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectConsumer = async () => {
  await consumer.connect();
  console.log('[Kafka] Consumer & Producer connected');

  await consumer.subscribe({ topic: 'customers', fromBeginning: false });
  await consumer.subscribe({ topic: 'orders', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      const data = JSON.parse(message.value.toString());
      let success = false;
      let retries = 0;

      while (!success && retries < MAX_RETRIES) {
        try {
          switch (topic) {
            case 'customers':
              await Customer.create(data);
              console.log('[Kafka] Customer saved:', data.name);
              break;
            case 'orders':
              await Order.create(data);
              console.log('[Kafka] Order saved:', data.customerId);
              break;
          }
          success = true; // mark as processed
        } catch (err) {
          retries++;
          console.error(
            `[Kafka] Error processing ${topic} message (attempt ${retries}):`,
            err,
          );
          if (retries < MAX_RETRIES) {
            await delay(2 ** retries * 100); // exponential backoff
          }
        }
      }

      // If all retries failed, send to dead-letter topic
      if (!success) {
        console.warn(`[Kafka] Sending failed ${topic} message to dead-letter`);
        await sendKafkaMessage('dead-letter', {
          messages: [
            {
              key: topic,
              value: JSON.stringify({
                originalTopic: topic,
                data,
                timestamp: new Date().toISOString(),
              }),
            },
          ],
        });
      }
    },
  });
};
