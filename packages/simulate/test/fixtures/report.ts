import type { Report } from '../../src/run';

export const report: Report = {
  options: {
    games: 100,
    analysisGames: 1000,
    levels: ['easy', 'medium'],
    boardSizes: ['2x2'],
    seed: 1,
    analysisLevel: 'easy',
  },
  orderingHolds: true,
  boards: [
    {
      boardSize: '2x2',
      pairings: [
        {
          a: 'medium',
          b: 'easy',
          games: 100,
          aWins: 68,
          rate: 0.68,
          interval: [0.583, 0.763],
        },
      ],
      ordering: { holds: true, failures: [] },
      firstPlayer: {
        rounds: 300,
        firstWins: 150,
        secondWins: 100,
        draws: 50,
        firstWinRate: 0.6,
        interval: [0.54, 0.66],
      },
      effects: [
        {
          effect: 'win-bonus',
          playedRounds: 200,
          notPlayedRounds: 400,
          playedScore: 0.62,
          notPlayedScore: 0.44,
          delta: 0.18,
          standardError: 0.04,
          flagged: true,
        },
        {
          effect: 'tie-win',
          playedRounds: 0,
          notPlayedRounds: 600,
          playedScore: null,
          notPlayedScore: 0.5,
          delta: null,
          standardError: null,
          flagged: false,
        },
      ],
      randomness: {
        drawRate: 1 / 6,
        upsets: [
          {
            stronger: 'medium',
            weaker: 'easy',
            rate: 0.32,
            interval: [0.237, 0.417],
          },
        ],
      },
    },
  ],
};

export const reportLines = [
  '# Balance report',
  '## Board 2x2',
  'Ordering of the levels: holds',
  '| medium over easy | 100 | 68 | 68.0% | 58.3% to 76.3% |',
  '| 300 | 150 | 100 | 50 | 60.0% | 54.0% to 66.0% |',
  '| Prize (`win-bonus`) | 200 | 62.0% | 44.0% | +18.0 points | yes |',
  '| Just (`tie-win`) | 0 | n/a | 50.0% | n/a | no |',
  'Rounds that end in a draw: 16.7%',
  '| medium over easy | 32.0% | 23.7% to 41.7% |',
];

export const reportFindings = [
  '2x2: the first player wins 60.0% of the decided rounds (95% interval 54.0% to 66.0%)',
  '2x2: Prize (win-bonus) moves the round score by +18.0 points when played',
];

export const failingOrderingFinding =
  '2x2: easy does not beat medium (45.0% of 100 games)';
