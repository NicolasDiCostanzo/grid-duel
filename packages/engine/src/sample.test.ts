import { describe, expect, it } from 'vitest';
import {
  gameSeeds,
  maxMovesPerGame,
  roundEndCases,
} from '../test/fixtures/game';
import { boardSizes, hexSeedFor } from '../test/fixtures/round';
import {
  almostFullGame,
  lastCell,
  lastPieceId,
  randomPicker,
} from '../test/helpers/game';
import { applyMove, createGame, legalMoves, view } from './game';
import { createRng } from './rng';
import { sampleRound } from './sample';
import type { PlayerId } from './round';

const SAMPLE_SEEDS = [1, 2, 3, 4, 5];

describe('sampleRound', () => {
  it.each(roundEndCases)(
    'gives the real outcome when the last placement decides: $name',
    (testCase) => {
      const input = view(almostFullGame(testCase), 1);
      const move = { pieceId: lastPieceId(testCase), cell: lastCell };
      const round = testCase.tail[0];
      if (round?.type !== 'round-ended') {
        throw new Error('Fixture without a round-ended event');
      }
      for (const seed of SAMPLE_SEEDS) {
        expect(sampleRound(input, move, createRng(hexSeedFor(seed)))).toEqual({
          winner: round.winner,
          points: round.points,
        });
      }
    },
  );

  const fresh = (boardSize: '2x2' | '2x3') => {
    const game = createGame({ seed: hexSeedFor(1), boardSize });
    return view(game, game.round.currentPlayer as PlayerId);
  };

  it('is deterministic for a view, a move and a seed', () => {
    const input = fresh('2x3');
    const [move] = input.moves;
    const draw = () => sampleRound(input, move!, createRng(hexSeedFor(3)));
    expect(draw()).toEqual(draw());
  });

  it('varies with the seed, because the unseen cards are sampled', () => {
    const input = fresh('2x2');
    const [move] = input.moves;
    const outcomes = new Set(
      Array.from({ length: 100 }, (_, seed) =>
        JSON.stringify(
          sampleRound(input, move!, createRng(hexSeedFor(seed + 1))),
        ),
      ),
    );
    expect(outcomes.size).toBeGreaterThan(1);
  });

  it.each(
    boardSizes.flatMap(([boardSize]) =>
      gameSeeds.map((seed) => ({ boardSize, seed })),
    ),
  )(
    'finishes the round from every move of every turn: $boardSize seed $seed',
    ({ boardSize, seed }) => {
      const pick = randomPicker(hexSeedFor(seed + 500));
      let game = createGame({ seed: hexSeedFor(seed), boardSize });
      for (let played = 0; played < maxMovesPerGame; played++) {
        const moves = legalMoves(game);
        if (moves.length === 0) {
          break;
        }
        const player = game.round.currentPlayer as PlayerId;
        const input = view(game, player);
        for (const move of input.moves.slice(0, 4)) {
          const outcome = sampleRound(input, move, createRng(hexSeedFor(seed)));
          expect([0, 1, 'draw']).toContain(outcome.winner);
          expect(
            outcome.points.every((n) => Number.isInteger(n) && n >= 0),
          ).toBe(true);
        }
        game = applyMove(game, player, pick(moves)).state;
      }
    },
  );

  it('rejects a move that is not legal in the view, and a view without moves', () => {
    const input = fresh('2x2');
    const [move] = input.moves;
    const illegal = { ...move!, pieceId: 'unknown' };
    expect(() =>
      sampleRound(input, illegal, createRng(hexSeedFor(1))),
    ).toThrow();
    const game = createGame({ seed: hexSeedFor(1), boardSize: '2x2' });
    const waiting = view(game, game.round.currentPlayer === 0 ? 1 : 0);
    expect(() =>
      sampleRound(waiting, move!, createRng(hexSeedFor(1))),
    ).toThrow();
  });
});
