import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';
import { connectProducer } from './kafka/producer';
import { connectConsumer } from './kafka/consumer';
import { startKafkaConsumer } from './kafka/deliveryConsumer';

dotenv.config();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB connected');

    await connectProducer();
    await connectConsumer();
    await startKafkaConsumer();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
