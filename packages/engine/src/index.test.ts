import { describe, expect, it } from 'vitest';
import { maxMovesPerGame, publicExports } from '../test/fixtures/game';
import { ROCK, SCISSORS } from '../test/fixtures/pieces';
import { boardSizes, hexSeedFor } from '../test/fixtures/round';
import * as engine from './index';
import type {
  BoardSize,
  Cell,
  GameErrorCode,
  GameEvent,
  GameRecord,
  GameState,
  GameView,
  Move,
  Outcome,
  Piece,
  Placed,
  PlacementErrorCode,
  PlayerId,
  RecordedMove,
  Rng,
  RoundResult,
} from './index';

type PublicTypes = [
  BoardSize,
  Cell,
  GameErrorCode,
  GameEvent,
  GameRecord,
  GameState,
  GameView,
  Move,
  Outcome,
  Piece,
  Placed,
  PlacementErrorCode,
  PlayerId,
  RecordedMove,
  Rng,
  RoundResult,
];

describe('the package entry point', () => {
  it('exports the game API and the error classes, nothing else', () => {
    expect(Object.keys(engine).toSorted()).toEqual(publicExports);
  });

  it('exports the types the clients need', () => {
    const types: PublicTypes | undefined = undefined;
    expect(types).toBeUndefined();
  });

  it('exposes the piece data and the seeded generator', () => {
    const outcome: Outcome = engine.compareTypes(
      engine.getPiece(ROCK),
      engine.getPiece(SCISSORS),
    );
    expect(outcome).toBe('win');
    const draw = (rng: Rng) => [rng.nextFloat(), rng.nextInt(10)];
    expect(draw(engine.createRng(hexSeedFor(1)))).toEqual(
      draw(engine.createRng(hexSeedFor(1))),
    );
  });

  it.each(boardSizes)(
    'plays, views and replays a %s game through the entry point alone',
    (boardSize) => {
      let game = engine.createGame({ seed: hexSeedFor(3), boardSize });
      const events: GameEvent[] = [];
      for (let played = 0; played < maxMovesPerGame; played++) {
        const [move] = engine.legalMoves(game);
        if (move === undefined) {
          break;
        }
        const result = engine.applyMove(
          game,
          game.round.currentPlayer as PlayerId,
          move,
        );
        game = result.state;
        events.push(...result.events);
      }
      expect(game.winner).not.toBeNull();
      expect(engine.view(game, 0).winner).toBe(game.winner);
      expect(engine.replay(engine.recordOf(game))).toEqual({
        state: game,
        events,
      });
    },
  );
});
