import dotenv from 'dotenv';
import { Kafka } from 'kafkajs';

dotenv.config();

const isProd = process.env.APP_ENV === 'prod';

export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'xeno-app',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
  ...(isProd
    ? {
        ssl: true,
        sasl: {
          mechanism: 'plain',
          username: process.env.KAFKA_USERNAME!,
          password: process.env.KAFKA_PASSWORD!,
        },
        connectionTimeout: 30000,
        authenticationTimeout: 30000,
      }
    : {})
});

