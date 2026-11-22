import {
  createGame,
  view,
  type BoardSize,
  type GameView,
  type GameState,
} from '@game/engine';
import { hexSeed } from '../fixtures/solo';

type Cells = readonly (string | null)[];

const toBoard = (cells: Cells): GameState['round']['boards'][0] =>
  cells.map((pieceId) =>
    pieceId === null ? null : { pieceId, nullified: false },
  );

export const humanView = (options: {
  boardSize?: BoardSize;
  own?: Cells;
  opp?: Cells;
  offer?: readonly string[];
  wins?: readonly [number, number];
  results?: GameView['results'];
}): GameView => {
  const boardSize = options.boardSize ?? '2x2';
  const empty = Array(boardSize === '2x2' ? 4 : 6).fill(null);
  const game = createGame({ seed: hexSeed(1), boardSize });
  const shown = view(
    {
      ...game,
      round: {
        ...game.round,
        boards: [toBoard(options.own ?? empty), toBoard(options.opp ?? empty)],
        offer: options.offer ?? game.round.offer,
        currentPlayer: 0,
      },
    },
    0,
  );
  return {
    ...shown,
    ...(options.wins === undefined ? {} : { wins: options.wins }),
    ...(options.results === undefined ? {} : { results: options.results }),
  };
};
