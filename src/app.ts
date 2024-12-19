import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import webhookRoutes from './routes/webhooks';
import authRoutes from './routes/auth';
import eventRoutes from './routes/events';
import { config } from './config/config';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/webhooks', webhookRoutes);
app.use('/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
}); 