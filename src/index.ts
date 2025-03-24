import express from 'express';
import dotenv from 'dotenv';
import { initializeCache } from './services/cacheService';
import { connectToDatabase } from './services/database';
import predictionRoutes from './routes/predictions';
import { errorHandler } from './error/errorHandler';
import morgan from 'morgan';
import logger from './utils/logging';
import fs from 'fs';
import path from 'path';  

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

const accessLogStream = fs.createWriteStream(
  path.join('logs', 'access.log'),
  { flags: 'a' }
);

const morganFormat = 'dev';
app.use(morgan(morganFormat, { stream: accessLogStream }));


app.use(morgan('dev'));


app.use(express.json());

(async () => {
  try {
    await initializeCache();
    await connectToDatabase();
    logger.info('Application services initialized successfully');
  } catch (error) {
    logger.error(`Failed to initialize application services: ${error}`);
    process.exit(1);
  }
})();

app.use('/api/predictions', predictionRoutes);

app.get('/health', (req, res) => {
    logger.debug('Health check endpoint called');
    res.status(200).json({ status: 'healthy' });
  });

app.use(errorHandler);

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(`Uncaught exception: ${err.message}`, { stack: err.stack });
  console.error(err.name, err.message);
  process.exit(1);
});

const server = app.listen(port, () => {
console.log(`Server running on port ${port}`);
logger.info(`Server running on port ${port}`);
});

process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled promise rejection', { err});
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
  
export default app;