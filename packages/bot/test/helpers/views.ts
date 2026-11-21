import {
  createGame,
  view,
  type BoardSize,
  type GameState,
  type GameView,
  type PlayerId,
} from '@game/engine';
import { hexSeedFor } from '../fixtures/bot';

type Cells = readonly (string | null)[];

const toBoard = (cells: Cells): GameState['round']['boards'][0] =>
  cells.map((pieceId) =>
    pieceId === null ? null : { pieceId, nullified: false },
  );

export const viewOf = (options: {
  boardSize: BoardSize;
  player: PlayerId;
  own: Cells;
  opp: Cells;
  offer: readonly string[];
}): GameView => {
  const game = createGame({
    seed: hexSeedFor(1),
    boardSize: options.boardSize,
  });
  const own = toBoard(options.own);
  const opp = toBoard(options.opp);
  const boards: GameState['round']['boards'] =
    options.player === 0 ? [own, opp] : [opp, own];
  return view(
    {
      ...game,
      round: {
        ...game.round,
        boards,
        offer: options.offer,
        currentPlayer: options.player,
      },
    },
    options.player,
  );
};
