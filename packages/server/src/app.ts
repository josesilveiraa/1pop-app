import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';

import Scheduler from './database/scheduler/Scheduler';

import api from './api/routes/api';
import key from './api/routes/key';
import connect from './database/config/databaseConnector';
import logger from './util/logger';

dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(mongoSanitize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API route
app.use('/api/users', api);
app.use('/api/keys', key);

app.listen(process.env.PORT, async () => {
  logger.info('Connecting with the database...');
  await connect();

  logger.info('Setting cron jobs up...');
  Scheduler.schedule();

  logger.info(`Server listening on port ${process.env.PORT}`);
});
