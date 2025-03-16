import express from 'express';
import dotenv from 'dotenv';
import { initializeCache } from './services/cacheService';
import { connectToDatabase } from './services/database';
import predictionRoutes from './routes/predictions';

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

app.listen(port, () => {
console.log(`Server running on port ${port}`);
});
  
export default app;