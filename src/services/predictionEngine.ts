export class PredictionEngine {
    async generatePrediction(events: any[]): Promise<any[]> {
        return Promise.all(events.map(event => this.analyzeSingleEvent(event)));
    }

    private async analyzeSingleEvent(event: any): Promise<any> {
        const homeTeamOdds: number[]= [];
        const awayTeamOdds: number[] = [];
        event.bookmakers.forEach((bookmaker: any) => {
            const h2hMarket = bookmaker.markets.find((m: any) => m.key === 'h2h');
            if (h2hMarket) {
                const homeOutcome = h2hMarket.outcomes.find((o: any) => o.name === event.home_team);
                const awayOutcome = h2hMarket.outcomes.find((o: any) => o.name === event.away_team);
                if (homeOutcome) homeTeamOdds.push(homeOutcome.price);
                if (awayOutcome) awayTeamOdds.push(awayOutcome.price);
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
    }

    private calculateAverage(numbers: number[]): number {
        if (numbers.length === 0) return 0;
        return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    }

    private americanOddsToProb(odds: number): number {
        if (odds > 0) {
          return 100 / (odds + 100);
        } else {
          return Math.abs(odds) / (Math.abs(odds) + 100);
        }
    }
}