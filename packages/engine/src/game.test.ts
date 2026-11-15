import { describe, expect, it } from 'vitest';
import { EXPECTED_PIECE_COUNT } from '../test/fixtures/catalog';
import {
  gameSeeds,
  maxMovesPerGame,
  roundEndCases,
} from '../test/fixtures/game';
import { hexSeedFor, boardSizes } from '../test/fixtures/round';
import {
  almostFullGame,
  lastCell,
  lastPieceId,
  playOut,
} from '../test/helpers/game';
import { errorCode } from '../test/helpers/round';
import { applyMove, createGame, legalMoves } from './game';
import { matchStatus } from './match';
import { legalMoves as roundLegalMoves } from './round';

describe('createGame', () => {
  it.each(boardSizes)(
    'starts a %s game at the first placement',
    (boardSize) => {
      const game = createGame({ seed: hexSeedFor(1), boardSize });
      expect(game).toMatchObject({ results: [], winner: null });
      expect(game.round).toMatchObject({ boardSize, phase: 'placing' });
      for (const deck of game.round.decks) {
        expect(deck).toHaveLength(EXPECTED_PIECE_COUNT);
      }
    },
  );

  it('is deterministic for a seed and differs between seeds', () => {
    const create = (seed: number) =>
      createGame({ seed: hexSeedFor(seed), boardSize: '2x2' });
    expect(create(1)).toEqual(create(1));
    expect(create(1)).not.toEqual(create(2));
  });

  it('rejects a malformed seed', () => {
    expect(() =>
      createGame({ seed: 'not a seed', boardSize: '2x2' }),
    ).toThrow();
  });
});

describe('legalMoves and applyMove during a round', () => {
  const game = createGame({ seed: hexSeedFor(1), boardSize: '2x2' });

  it('lists the placements of the current round', () => {
    expect(legalMoves(game)).toEqual(roundLegalMoves(game.round));
  });

  it('places a piece without ending the round, with no event', () => {
    const [move] = legalMoves(game);
    const result = applyMove(game, game.round.currentPlayer ?? 0, move!);
    expect(result.events).toEqual([]);
    expect(result.state.results).toEqual([]);
    expect(result.state.round.currentPlayer).not.toBe(game.round.currentPlayer);
  });

  it('passes placement errors through', () => {
    const [move] = legalMoves(game);
    const wrongPlayer = game.round.currentPlayer === 0 ? 1 : 0;
    expect(errorCode(() => applyMove(game, wrongPlayer, move!))).toBe(
      'wrong-turn',
    );
  });
});

describe('the last placement of a round', () => {
  it.each(roundEndCases)('$name', (testCase) => {
    const game = almostFullGame(testCase);
    const { state, events } = applyMove(game, 1, {
      pieceId: lastPieceId(testCase),
      cell: lastCell,
    });
    expect(state.results).toEqual(testCase.results);
    expect(state.winner).toBe(testCase.matchWinner);
    expect(events.slice(-testCase.tail.length)).toEqual(testCase.tail);
    expect(
      events
        .slice(0, -testCase.tail.length)
        .every((event) => event.type === 'duel' || event.type === 'points'),
    ).toBe(true);

    if (testCase.nextFirstPlayer === undefined) {
      expect(state.round.phase).toBe('resolved');
      expect(legalMoves(state)).toEqual([]);
      expect(
        errorCode(() =>
          applyMove(state, 0, {
            pieceId: lastPieceId(testCase),
            cell: lastCell,
          }),
        ),
      ).toBe('game-over');
      return;
    }
    expect(state.round).toMatchObject({
      phase: 'placing',
      firstPlayer: testCase.nextFirstPlayer,
      currentPlayer: testCase.nextFirstPlayer,
      points: [0, 0],
      winner: null,
    });
    expect(state.round.boards.flat().every((cell) => cell === null)).toBe(true);
    expect(state.round.offer).toHaveLength(3);
    for (const deck of state.round.decks) {
      expect(new Set(deck).size).toBe(EXPECTED_PIECE_COUNT);
    }
  });
});

describe('a whole game', () => {
  const cases = boardSizes.flatMap(([boardSize]) =>
    gameSeeds.map((seed) => ({ boardSize, seed })),
  );

  it.each(cases)(
    'plays $boardSize seed $seed to a winner',
    ({ boardSize, seed }) => {
      const game = playOut(
        createGame({ seed: hexSeedFor(seed), boardSize }),
        maxMovesPerGame,
      );
      expect(game.winner).not.toBeNull();
      expect(matchStatus(game.results).winner).toBe(game.winner);
      expect(game.round.phase).toBe('resolved');
    },
  );
});
