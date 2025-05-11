import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import customerRoutes from './routes/customer.routes';
import orderRoutes from './routes/order.routes';
import segmentRoutes from './routes/segment.routes';
import campaignRoutes from './routes/campaign.routes';
import communicationLogsRoutes from './routes/communication.routes';
import session from 'express-session';
import passport from 'passport';
import './config/passport'; // Passport config
import authRoutes from './routes/auth.routes';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { errorHandler } from './middlewares/errorHandler';
import cookieParser from 'cookie-parser';

import { authenticateJWT } from './middlewares/auth';

const app = express();
const swaggerDocument = YAML.load('./src/swagger.yaml');

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  session({ secret: 'xenominicrm', resave: false, saveUninitialized: true }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(authenticateJWT);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/segment', segmentRoutes);
app.use('/api/campaign', campaignRoutes);
app.use('/api/communicationlogs', communicationLogsRoutes);

app.use(errorHandler);

export default app;
