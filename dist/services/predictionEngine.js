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
exports.PredictionEngine = void 0;
class PredictionEngine {
    generatePrediction(events) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(events.map(event => this.analyzeSingleEvent(event)));
        });
    }
    analyzeSingleEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const homeTeamOdds = [];
            const awayTeamOdds = [];
            event.bookmakers.forEach((bookmaker) => {
                const h2hMarket = bookmaker.markets.find((m) => m.key === 'h2h');
                if (h2hMarket) {
                    const homeOutcome = h2hMarket.outcomes.find((o) => o.name === event.home_team);
                    const awayOutcome = h2hMarket.outcomes.find((o) => o.name === event.away_team);
                    if (homeOutcome)
                        homeTeamOdds.push(homeOutcome.price);
                    if (awayOutcome)
                        awayTeamOdds.push(awayOutcome.price);
                }
            });
            const avgHomeOdds = this.calculateAverage(homeTeamOdds);
            const avgAwayOdds = this.calculateAverage(awayTeamOdds);
            const homeWinProb = this.americanOddsToProb(avgHomeOdds);
            const awayWinProb = this.americanOddsToProb(avgAwayOdds);
            const predictedWinner = homeWinProb > awayWinProb ? event.home_team : event.away_team;
            const winProbability = Math.max(homeWinProb, awayWinProb);
            return {
                eventId: event.id,
                homeTeam: event.home_team,
                awayTeam: event.away_team,
                predictedWinner,
                winProbability,
                recommendedBet: winProbability > 0.6 ? `${predictedWinner} Moneyline` : 'No Bet',
                confidenceScore: Math.round(winProbability * 100),
                createdAt: new Date()
            };
        });
    }
    calculateAverage(numbers) {
        if (numbers.length === 0)
            return 0;
        return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    }
    americanOddsToProb(odds) {
        if (odds > 0) {
            return 100 / (odds + 100);
        }
        else {
            return Math.abs(odds) / (Math.abs(odds) + 100);
        }
    }
}
exports.PredictionEngine = PredictionEngine;
