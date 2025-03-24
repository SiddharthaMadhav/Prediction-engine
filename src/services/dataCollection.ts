import axios from 'axios';
import {getCachedData, setCachedData} from './cacheService';
import { AppError } from '../error/errorHandler';
import { configDotenv } from 'dotenv';

configDotenv()

export class DataCollectionService{
    private apiKey: string | undefined;
    private baseUrl: string;

    constructor(){
        this.apiKey = process.env.ODDS_API_KEY;
        this.baseUrl = 'https://api.the-odds-api.com/v4/sports';
    }

    async getSportsData(sport: string): Promise<any[]>{
        const cacheKey = `sport_data:${sport}`;

        const cachedData = await getCachedData(cacheKey);
        if(cachedData){
            console.log(`Retreived ${sport} data from cache`);
            return JSON.parse( cachedData);
        }

        try {
            // Fetch from The Odds API
            const response = await axios.get(
              `${this.baseUrl}/${sport}/odds`,
              {
                params: {
                  apiKey: this.apiKey,
                  regions: 'us',
                  markets: 'h2h,spreads,totals',
                  oddsFormat: 'american'
                }
              }
            );
            await setCachedData(cacheKey, JSON.stringify(response.data), 1800);
      
        return response.data;
        } catch (error) {
            console.error(`Error fetching ${sport} data:`, error);
            throw new AppError(`Failed to fetch sports data for ${sport}`, 500);
        }
    }
}