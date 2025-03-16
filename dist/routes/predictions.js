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
const express_1 = __importDefault(require("express"));
const dataCollection_1 = require("../services/dataCollection");
const predictionEngine_1 = require("../services/predictionEngine");
const database_1 = require("../services/database");
const cacheService_1 = require("../services/cacheService");
const router = express_1.default.Router();
const dataCollectionService = new dataCollection_1.DataCollectionService();
const predictionEngine = new predictionEngine_1.PredictionEngine();
router.get('/:sport', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sport = req.params.sport;
        const cacheKey = `prediction:${sport}`;
        const cachedData = yield (0, cacheService_1.getCachedData)(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                fromCache: true,
                data: JSON.parse(cachedData)
            });
        }
        const events = yield dataCollectionService.getSportsData(sport);
        if (events.length === 0) {
            return res.status(404).json({ message: `No events found for ${sport}` });
        }
        const predictions = yield predictionEngine.generatePrediction(events);
        yield Promise.all(predictions.map((prediction) => __awaiter(void 0, void 0, void 0, function* () {
            const newPrediction = new database_1.Prediction(prediction);
            yield newPrediction.save();
        })));
        yield (0, cacheService_1.setCachedData)(cacheKey, JSON.stringify(predictions), 1800);
        return res.status(200).json({
            fromCache: false,
            data: predictions
        });
    }
    catch (error) {
        console.error('Error generating predictions:', error);
        return res.status(500).json({ message: 'Failed to generate predictions' });
    }
}));
exports.default = router;
