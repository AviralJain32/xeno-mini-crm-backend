import { kafka } from '../config/kafka.config';

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log('[Kafka] Producer connected');
};

export const sendKafkaMessage = async (topic: string, message: unknown) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};

export const sendKafkaMessageForDelivery = async (
  topic: string,
  messages: unknown[],
) => {
  await producer.send({
    topic,
    messages: messages.map((msg) => ({ value: JSON.stringify(msg) })),
  });
};
