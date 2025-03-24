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
exports.DataCollectionService = void 0;
const axios_1 = __importDefault(require("axios"));
const cacheService_1 = require("./cacheService");
const errorHandler_1 = require("../error/errorHandler");
class DataCollectionService {
    constructor() {
        this.apiKey = process.env.ODDS_API_KEY;
        this.baseUrl = 'https://api.the-odds-api.com/v4/sports';
    }
    getSportsData(sport) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = `sport_data:${sport}`;
            const cachedData = yield (0, cacheService_1.getCachedData)(cacheKey);
            if (cachedData) {
                console.log(`Retreived ${sport} data from cache`);
                return JSON.parse(cachedData);
            }
            try {
                // Fetch from The Odds API
                const response = yield axios_1.default.get(`${this.baseUrl}/${sport}/odds`, {
                    params: {
                        apiKey: this.apiKey,
                        regions: 'us',
                        markets: 'h2h,spreads,totals',
                        oddsFormat: 'american'
                    }
                });
                yield (0, cacheService_1.setCachedData)(cacheKey, JSON.stringify(response.data), 1800);
                return response.data;
            }
            catch (error) {
                console.error(`Error fetching ${sport} data:`, error);
                throw new errorHandler_1.AppError(`Failed to fetch sports data for ${sport}`, 500);
            }
        });
    }
}
exports.DataCollectionService = DataCollectionService;
