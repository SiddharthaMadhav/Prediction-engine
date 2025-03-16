import express, { Request, Response} from 'express';
import { DataCollectionService } from "../services/dataCollection";
import { PredictionEngine} from "../services/predictionEngine";
import { Prediction} from "../services/database";
import { getCachedData, setCachedData } from '../services/cacheService';

const router = express.Router();

const dataCollectionService = new DataCollectionService();
const predictionEngine = new PredictionEngine();


router.get('/:sport', async (req: Request, res: Response) : Promise<any> => {
    try{
        const sport = req.params.sport;
        const cacheKey =  `prediction:${sport}`;

        const cachedData = await getCachedData(cacheKey);
        if (cachedData) {
            return res.status(200).json({
              fromCache: true,
              data: JSON.parse(cachedData)
            });
        }

        const events = await dataCollectionService.getSportsData(sport);
    
        if (events.length === 0) {
            return res.status(404).json({ message: `No events found for ${sport}` });
        }

        const predictions = await predictionEngine.generatePrediction(events);

        await Promise.all(predictions.map(async (prediction) => {
            const newPrediction = new Prediction(prediction);
            await newPrediction.save();
          }));

        await setCachedData(cacheKey, JSON.stringify(predictions), 1800);

        return res.status(200).json({
        fromCache: false,
        data: predictions
        });
        } catch (error) {
          console.error('Error generating predictions:', error);
          return res.status(500).json({ message: 'Failed to generate predictions' });
    }
})

export default router;