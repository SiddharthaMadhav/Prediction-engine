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
const dotenv_1 = __importDefault(require("dotenv"));
const cacheService_1 = require("./services/cacheService");
const database_1 = require("./services/database");
const predictions_1 = __importDefault(require("./routes/predictions"));
const errorHandler_1 = require("./error/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, cacheService_1.initializeCache)();
    yield (0, database_1.connectToDatabase)();
}))();
app.use('/api/predictions', predictions_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});
app.use(errorHandler_1.errorHandler);
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
exports.default = app;
