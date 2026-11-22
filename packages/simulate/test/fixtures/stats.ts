import type { PlayerId } from '@game/engine';
import type { Pairing, RoundRecord } from '../../src/stats';

export const wilsonCases: readonly (readonly [
  successes: number,
  trials: number,
  low: number,
  high: number,
])[] = [
  [50, 100, 0.4038, 0.5962],
  [0, 10, 0, 0.2775],
  [10, 10, 0.7225, 1],
  [8, 10, 0.4902, 0.9433],
  [0, 0, 0, 1],
];

const pairing = (
  stronger: Pairing['a'],
  weaker: Pairing['b'],
  aWins: number,
): Pairing => ({ a: stronger, b: weaker, games: 100, aWins });

export type OrderingCase = {
  name: string;
  pairings: readonly Pairing[];
  holds: boolean;
  failed: readonly string[];
};

export const orderingCases: readonly OrderingCase[] = [
  {
    name: 'holds when every stronger level wins more than half',
    pairings: [
      pairing('hard', 'medium', 60),
      pairing('medium', 'easy', 70),
      pairing('hard', 'easy', 90),
    ],
    holds: true,
    failed: [],
  },
  {
    name: 'fails when medium does not beat easy',
    pairings: [
      pairing('hard', 'medium', 60),
      pairing('medium', 'easy', 45),
      pairing('hard', 'easy', 90),
    ],
    holds: false,
    failed: ['medium over easy'],
  },
  {
    name: 'fails on exactly one half',
    pairings: [pairing('hard', 'medium', 50)],
    holds: false,
    failed: ['hard over medium'],
  },
  {
    name: 'reads a pairing written the other way round',
    pairings: [pairing('easy', 'medium', 30)],
    holds: true,
    failed: [],
  },
  {
    name: 'only checks the pairings that were played',
    pairings: [pairing('medium', 'easy', 70)],
    holds: true,
    failed: [],
  },
  {
    name: 'skips a pairing without any game and still checks the others',
    pairings: [
      { a: 'hard', b: 'medium', games: 0, aWins: 0 },
      pairing('medium', 'easy', 45),
    ],
    holds: false,
    failed: ['medium over easy'],
  },
  {
    name: 'holds when no game was played at all',
    pairings: [{ a: 'hard', b: 'medium', games: 0, aWins: 0 }],
    holds: true,
    failed: [],
  },
  {
    name: 'lists every failing pairing',
    pairings: [pairing('hard', 'medium', 40), pairing('hard', 'easy', 10)],
    holds: false,
    failed: ['hard over medium', 'hard over easy'],
  },
];

const round = (
  firstPlayer: PlayerId,
  winner: RoundRecord['winner'],
  placed0: readonly string[] = [],
  placed1: readonly string[] = [],
): RoundRecord => ({ firstPlayer, winner, placed: [placed0, placed1] });

export type FirstPlayerCase = {
  name: string;
  rounds: readonly RoundRecord[];
  expected: {
    rounds: number;
    firstWins: number;
    secondWins: number;
    draws: number;
    firstWinRate: number | null;
  };
};

export const firstPlayerCases: readonly FirstPlayerCase[] = [
  {
    name: 'counts wins of the first player, the second player and draws',
    rounds: [
      round(0, 0),
      round(1, 1),
      round(0, 0),
      round(1, 0),
      round(0, 'draw'),
      round(1, 'draw'),
    ],
    expected: {
      rounds: 6,
      firstWins: 3,
      secondWins: 1,
      draws: 2,
      firstWinRate: 0.75,
    },
  },
  {
    name: 'has no rate without a decided round',
    rounds: [round(0, 'draw')],
    expected: {
      rounds: 1,
      firstWins: 0,
      secondWins: 0,
      draws: 1,
      firstWinRate: null,
    },
  },
  {
    name: 'handles no round',
    rounds: [],
    expected: {
      rounds: 0,
      firstWins: 0,
      secondWins: 0,
      draws: 0,
      firstWinRate: null,
    },
  },
];

export const effectOf = (pieceId: string): string | null =>
  ({ p: 'prize', q: 'prize', f: 'fallen' })[pieceId] ?? null;

export const impactRounds: readonly RoundRecord[] = [
  round(0, 0, ['p'], []),
  round(0, 'draw', ['p'], ['q']),
  round(1, 1, [], ['p']),
  round(1, 0, [], []),
];

export const impactEffects = ['prize', 'fallen'] as const;
