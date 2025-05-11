import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'xeno-app',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
});
