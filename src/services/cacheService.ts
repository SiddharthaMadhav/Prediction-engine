import {createClient} from 'redis';

let redisClient: any;

export const initializeCache = async () => {
    redisClient = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    })

    redisClient.on('error', (err: any) => {
        console.error('Redis error:', err);
    });

    await redisClient.connect();
    console.log('Redis client connected');
};

export const getCachedData = async (key: string ): Promise<string | null> => {
    return await redisClient.get(key);
}

export const setCachedData = async(key: string, data: string, ttl: number = 3600): Promise<void> => {
    await redisClient.set(key, data, {EX: ttl});
}