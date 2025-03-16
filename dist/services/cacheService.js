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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCachedData = exports.getCachedData = exports.initializeCache = void 0;
const redis_1 = require("redis");
let redisClient;
const initializeCache = () => __awaiter(void 0, void 0, void 0, function* () {
    redisClient = (0, redis_1.createClient)({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    redisClient.on('error', (err) => {
        console.error('Redis error:', err);
    });
    yield redisClient.connect();
    console.log('Redis client connected');
});
exports.initializeCache = initializeCache;
const getCachedData = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return yield redisClient.get(key);
});
exports.getCachedData = getCachedData;
const setCachedData = (key_1, data_1, ...args_1) => __awaiter(void 0, [key_1, data_1, ...args_1], void 0, function* (key, data, ttl = 3600) {
    yield redisClient.set(key, data, { EX: ttl });
});
exports.setCachedData = setCachedData;
