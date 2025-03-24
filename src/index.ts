import express from 'express';
import dotenv from 'dotenv';
import { initializeCache } from './services/cacheService';
import { connectToDatabase } from './services/database';
import predictionRoutes from './routes/predictions';
import { errorHandler } from './error/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

(async () => {
    await initializeCache();
    await connectToDatabase();
  })();

app.use('/api/predictions', predictionRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
  });

app.use(errorHandler);

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

const server = app.listen(port, () => {
console.log(`Server running on port ${port}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
  
export default app;