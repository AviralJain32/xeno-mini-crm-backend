import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'xeno-app',
  brokers: ['localhost:9092'], // or from .env
});
