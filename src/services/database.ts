import mongoose from 'mongoose';

export const connectToDatabase = async(): Promise<void> => {
    const uri: string  = process.env.MONGODB_URI || '';

    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    }catch(error){
        console.log("Mongodb connection error", error);
        process.exit(1);
    }
}

const predictionSchema = new mongoose.Schema({
    eventId: String,
    homeTeam: String,
    awayTeam: String,
    predictedWinner: String,
    winProbability: Number,
    recommendedBet: String,
    confidenceScore: Number,
    createdAt: Date
})

export const Prediction = mongoose.model('Prediction', predictionSchema);