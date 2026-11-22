import type { PlayerId } from '@game/engine';

export type BotLevel = 'easy' | 'medium' | 'hard';

export const LEVELS: readonly BotLevel[] = ['easy', 'medium', 'hard'];

export type Pairing = {
  a: BotLevel;
  b: BotLevel;
  games: number;
  aWins: number;
};

export type RoundRecord = {
  firstPlayer: PlayerId;
  winner: PlayerId | 'draw';
  placed: readonly [readonly string[], readonly string[]];
};

export type Interval = readonly [low: number, high: number];

const Z_95 = 1.96;
const FLAG_MIN_DELTA = 0.05;
const FLAG_MIN_STANDARD_ERRORS = 2;
const DRAW_SCORE = 0.5;

export function wilsonInterval(
  successes: number,
  trials: number,
  z: number = Z_95,
): Interval {
  if (trials === 0) {
    return [0, 1];
  }
  const rate = successes / trials;
  const scale = 1 + (z * z) / trials;
  const centre = (rate + (z * z) / (2 * trials)) / scale;
  const half =
    (z *
      Math.sqrt(
        (rate * (1 - rate)) / trials + (z * z) / (4 * trials * trials),
      )) /
    scale;
  return [Math.max(0, centre - half), Math.min(1, centre + half)];
}

export type OrderingFailure = {
  stronger: BotLevel;
  weaker: BotLevel;
  rate: number;
  games: number;
};

export function checkOrdering(pairings: readonly Pairing[]): {
  holds: boolean;
  failures: OrderingFailure[];
} {
  const failures = pairings.flatMap(
    ({ a, b, games, aWins }): OrderingFailure[] => {
      const rankA = LEVELS.indexOf(a);
      const rankB = LEVELS.indexOf(b);
      if (rankA === rankB || games === 0) {
        return [];
      }
      const aIsStronger = rankA > rankB;
      const rate = aIsStronger ? aWins / games : 1 - aWins / games;
      return rate > 0.5
        ? []
        : [
            {
              stronger: aIsStronger ? a : b,
              weaker: aIsStronger ? b : a,
              rate,
              games,
            },
          ];
    },
  );
  return { holds: failures.length === 0, failures };
}

export function firstPlayerAdvantage(rounds: readonly RoundRecord[]): {
  rounds: number;
  firstWins: number;
  secondWins: number;
  draws: number;
  firstWinRate: number | null;
  interval: Interval | null;
} {
  const draws = rounds.filter(({ winner }) => winner === 'draw').length;
  const firstWins = rounds.filter(
    ({ winner, firstPlayer }) => winner === firstPlayer,
  ).length;
  const decided = rounds.length - draws;
  return {
    rounds: rounds.length,
    firstWins,
    secondWins: decided - firstWins,
    draws,
    firstWinRate: decided > 0 ? firstWins / decided : null,
    interval: decided > 0 ? wilsonInterval(firstWins, decided) : null,
  };
}

export type EffectImpact = {
  effect: string;
  playedRounds: number;
  notPlayedRounds: number;
  playedScore: number | null;
  notPlayedScore: number | null;
  delta: number | null;
  standardError: number | null;
  flagged: boolean;
};

const mean = (values: readonly number[]): number | null =>
  values.length === 0
    ? null
    : values.reduce((sum, value) => sum + value, 0) / values.length;

const variance = (values: readonly number[]): number | null => {
  const average = mean(values);
  return average === null || values.length < 2
    ? null
    : values.reduce((sum, value) => sum + (value - average) ** 2, 0) /
        (values.length - 1);
};

export function effectImpact(
  rounds: readonly RoundRecord[],
  effectOf: (pieceId: string) => string | null,
  effects: readonly string[],
): EffectImpact[] {
  const playerRounds = rounds.flatMap(({ winner, placed }) =>
    ([0, 1] as const).map((player) => ({
      score: winner === 'draw' ? DRAW_SCORE : winner === player ? 1 : 0,
      played: new Set(placed[player].map(effectOf)),
    })),
  );
  return effects.map((effect) => {
    const played = playerRounds
      .filter(({ played: set }) => set.has(effect))
      .map(({ score }) => score);
    const notPlayed = playerRounds
      .filter(({ played: set }) => !set.has(effect))
      .map(({ score }) => score);
    const playedScore = mean(played);
    const notPlayedScore = mean(notPlayed);
    const delta =
      playedScore === null || notPlayedScore === null
        ? null
        : playedScore - notPlayedScore;
    const playedVariance = variance(played);
    const notPlayedVariance = variance(notPlayed);
    const standardError =
      playedVariance === null || notPlayedVariance === null
        ? null
        : Math.sqrt(
            playedVariance / played.length +
              notPlayedVariance / notPlayed.length,
          );
    return {
      effect,
      playedRounds: played.length,
      notPlayedRounds: notPlayed.length,
      playedScore,
      notPlayedScore,
      delta,
      standardError,
      flagged:
        delta !== null &&
        standardError !== null &&
        Math.abs(delta) >= FLAG_MIN_DELTA &&
        Math.abs(delta) > FLAG_MIN_STANDARD_ERRORS * standardError,
    };
  });
}
