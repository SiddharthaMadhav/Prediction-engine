"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prediction = exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const uri = process.env.MONGODB_URI || '';
    try {
        yield mongoose_1.default.connect(uri);
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.log("Mongodb connection error", error);
        process.exit(1);
    }
});
exports.connectToDatabase = connectToDatabase;
const predictionSchema = new mongoose_1.default.Schema({
    eventId: String,
    homeTeam: String,
    awayTeam: String,
    predictedWinner: String,
    winProbability: Number,
    recommendedBet: String,
    confidenceScore: Number,
    createdAt: Date
});
exports.Prediction = mongoose_1.default.model('Prediction', predictionSchema);
