import { describe, expect, it } from 'vitest';
import { EXPECTED_PIECE_COUNT } from '../test/fixtures/catalog';
import {
  gameSeeds,
  maxMovesPerGame,
  replayStops,
  roundEndCases,
} from '../test/fixtures/game';
import { hexSeedFor, boardSizes } from '../test/fixtures/round';
import {
  almostFullGame,
  lastCell,
  lastPieceId,
  playOut,
  randomPicker,
} from '../test/helpers/game';
import { errorCode } from '../test/helpers/round';
import { applyMove, createGame, legalMoves, recordOf, replay } from './game';
import { matchStatus } from './match';
import { legalMoves as roundLegalMoves, type PlayerId } from './round';

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
      const { state: game } = playOut(
        createGame({ seed: hexSeedFor(seed), boardSize }),
        { maxMoves: maxMovesPerGame },
      );
      expect(game.winner).not.toBeNull();
      expect(matchStatus(game.results).winner).toBe(game.winner);
      expect(game.round.phase).toBe('resolved');
    },
  );
});

describe('recordOf', () => {
  const game = createGame({ seed: hexSeedFor(1), boardSize: '2x3' });

  it('describes a new game by its seed and board size', () => {
    expect(recordOf(game)).toEqual({
      seed: hexSeedFor(1),
      boardSize: '2x3',
      moves: [],
    });
  });

  it('lists each move with its player', () => {
    const [move] = legalMoves(game);
    const player = game.round.currentPlayer ?? 0;
    const { state } = applyMove(game, player, move!);
    expect(recordOf(state).moves).toEqual([{ player, ...move }]);
  });
});

describe('replay', () => {
  const cases = boardSizes.flatMap(([boardSize]) =>
    gameSeeds.flatMap((seed) =>
      replayStops.map((stop) => ({ boardSize, seed, stop })),
    ),
  );

  it.each(cases)(
    'rebuilds the state and events of $boardSize seed $seed after $stop moves',
    ({ boardSize, seed, stop }) => {
      const played = playOut(
        createGame({ seed: hexSeedFor(seed), boardSize }),
        { maxMoves: stop, pick: randomPicker(hexSeedFor(seed + 100)) },
      );
      const record = JSON.parse(JSON.stringify(recordOf(played.state)));
      expect(replay(record)).toEqual(played);
    },
  );

  it('rejects a move that is not legal at its point of the game', () => {
    const game = createGame({ seed: hexSeedFor(1), boardSize: '2x2' });
    const [move] = legalMoves(game);
    const wrongPlayer: PlayerId = game.round.currentPlayer === 0 ? 1 : 0;
    const record = {
      ...recordOf(game),
      moves: [{ player: wrongPlayer, ...move! }],
    };
    expect(errorCode(() => replay(record))).toBe('wrong-turn');
  });

  it('rejects a move recorded after the end of the match', () => {
    const { state } = playOut(
      createGame({ seed: hexSeedFor(1), boardSize: '2x2' }),
      { maxMoves: maxMovesPerGame },
    );
    const [first] = recordOf(state).moves;
    const record = {
      ...recordOf(state),
      moves: [...recordOf(state).moves, first!],
    };
    expect(errorCode(() => replay(record))).toBe('game-over');
  });
});
