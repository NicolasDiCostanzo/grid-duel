import { easyBot, mediumBot, type Bot } from '@game/bot';
import { getPiece, type PlayerId } from '@game/engine';
import { describe, expect, it } from 'vitest';
import {
  OTHER_SEED,
  SEED,
  boardSizes,
  effectCount,
  smallGames,
} from '../test/fixtures/run';
import { playGame, runPairing, seedsFor, simulate } from './run';

describe('seedsFor', () => {
  it('is deterministic and gives 32 hexadecimal digits', () => {
    const seeds = seedsFor(SEED, 3);
    expect(seedsFor(SEED, 3)).toEqual(seeds);
    for (const { game, bots } of seeds) {
      for (const seed of [game, ...bots]) {
        expect(seed).toMatch(/^[0-9a-f]{32}$/);
      }
    }
  });

  it('does not depend on the number of games', () => {
    expect(seedsFor(SEED, 5).slice(0, 3)).toEqual(seedsFor(SEED, 3));
  });

  it('differs between seeds and between games', () => {
    expect(seedsFor(SEED, 2)).not.toEqual(seedsFor(OTHER_SEED, 2));
    const [first, second] = seedsFor(SEED, 2);
    expect(first).not.toEqual(second);
  });
});

describe('playGame', () => {
  const { game, bots } = seedsFor(SEED, 1)[0]!;

  it.each(boardSizes)('records the rounds of a %s game', (boardSize) => {
    const record = playGame([mediumBot, easyBot], {
      seed: game,
      boardSize,
      botSeeds: bots,
    });
    expect(record.rounds.length).toBeGreaterThanOrEqual(2);
    const wins = [0, 1].map(
      (player) =>
        record.rounds.filter(
          ({ winner }) => winner === player || winner === 'draw',
        ).length,
    );
    expect(wins[record.winner]).toBeGreaterThanOrEqual(2);
    expect(wins[record.winner]).toBeGreaterThan(wins[1 - record.winner]!);
    for (const { placed } of record.rounds) {
      for (const pieceIds of placed) {
        expect(pieceIds.length).toBeGreaterThanOrEqual(
          boardSize === '2x2' ? 4 : 6,
        );
        for (const pieceId of pieceIds) {
          expect(() => getPiece(pieceId)).not.toThrow();
        }
      }
    }
  });

  it('is reproducible', () => {
    const play = () =>
      playGame([easyBot, easyBot], {
        seed: game,
        boardSize: '2x2',
        botSeeds: bots,
      });
    expect(play()).toEqual(play());
  });
});

describe('runPairing', () => {
  const seeds = seedsFor(SEED, smallGames);

  it('plays every game once and counts the wins of the first bot', () => {
    const result = runPairing(mediumBot, easyBot, { boardSize: '2x2', seeds });
    expect(result.games).toBe(smallGames);
    expect(result.aWins).toBeGreaterThanOrEqual(0);
    expect(result.aWins).toBeLessThanOrEqual(smallGames);
    expect(result.rounds.length).toBeGreaterThanOrEqual(2 * smallGames);
  });

  it('alternates the seats of the two bots', () => {
    const seen = new Set<PlayerId>();
    const spy: Bot = (view, rng) => {
      seen.add(view.player);
      return easyBot(view, rng);
    };
    runPairing(spy, easyBot, { boardSize: '2x2', seeds: seeds.slice(0, 2) });
    expect(seen).toEqual(new Set([0, 1]));
  });
});

describe('simulate', () => {
  const options = {
    games: smallGames,
    analysisGames: smallGames * 2,
    levels: ['easy', 'medium'] as const,
    boardSizes: ['2x2'] as const,
    seed: SEED,
    analysisLevel: 'easy' as const,
  };

  it('reports the pairings, the first player, the blessings and the luck', () => {
    const report = simulate(options);
    expect(report.options).toEqual(options);
    const [board] = report.boards;
    expect(report.boards).toHaveLength(1);
    expect(board?.boardSize).toBe('2x2');
    expect(board?.pairings).toHaveLength(1);
    expect(board?.pairings[0]).toMatchObject({
      a: 'medium',
      b: 'easy',
      games: smallGames,
    });
    expect(board?.ordering.holds).toBe(report.orderingHolds);
    expect(board?.firstPlayer.rounds).toBeGreaterThanOrEqual(
      2 * options.analysisGames,
    );
    expect(board?.effects).toHaveLength(effectCount);
    expect(board?.randomness.drawRate).toBeGreaterThanOrEqual(0);
    expect(board?.randomness.drawRate).toBeLessThanOrEqual(1);
    expect(board?.randomness.upsets).toHaveLength(1);
  });

  it('is reproducible from the seed and changes with it', () => {
    const run = (seed: number) =>
      JSON.stringify(simulate({ ...options, seed }));
    expect(run(SEED)).toEqual(run(SEED));
    expect(run(SEED)).not.toEqual(run(OTHER_SEED));
  });

  it('pairs every level with every weaker one', () => {
    const report = simulate({
      ...options,
      games: 2,
      levels: ['easy', 'medium', 'hard'],
      hardRollouts: 10,
    });
    expect(report.boards[0]?.pairings.map(({ a, b }) => `${a}/${b}`)).toEqual([
      'medium/easy',
      'hard/easy',
      'hard/medium',
    ]);
  });
});
