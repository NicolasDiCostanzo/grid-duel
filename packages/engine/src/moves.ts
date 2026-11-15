import { getPiece } from './catalog';
import {
  ROWS,
  cellIndex,
  otherPlayer,
  withPlayer,
  type Board,
  type BoardSize,
  type Cell,
  type PlayerId,
  type RoundState,
} from './round';

export type DuelEvent = {
  type: 'moved';
  player: PlayerId;
  pieceId: string;
  from: Cell;
  to: Cell;
};

export type MovesErrorCode = 'not-full';

export class MovesError extends Error {
  constructor(readonly code: MovesErrorCode) {
    super(`Cannot resolve moves: ${code}`);
  }
}

const SHIFTS: Partial<Record<string, number>> = {
  'shift-down': 1,
  'shift-up': -1,
};

const sequence = (boardSize: BoardSize): Cell[] =>
  ([1, 0] as const).flatMap((column) =>
    Array.from({ length: ROWS[boardSize] }, (_, row) => ({ column, row })),
  );

const shiftColumn = (
  board: Board,
  boardSize: BoardSize,
  player: PlayerId,
  column: 0 | 1,
  delta: number,
): { board: Board; events: DuelEvent[] } => {
  const rows = ROWS[boardSize];
  const start = cellIndex(boardSize, { column, row: 0 });
  const pieces = board.slice(start, start + rows);
  const events = pieces.flatMap((placed, row): DuelEvent[] =>
    placed === null
      ? []
      : [
          {
            type: 'moved',
            player,
            pieceId: placed.pieceId,
            from: { column, row },
            to: { column, row: (row + delta + rows) % rows },
          },
        ],
  );
  const shifted = pieces.map((_, row) => pieces[(row - delta + rows) % rows]!);
  return {
    board: [...board.slice(0, start), ...shifted, ...board.slice(start + rows)],
    events,
  };
};

export function resolveMoves(state: RoundState): {
  state: RoundState;
  events: DuelEvent[];
} {
  if (state.phase !== 'full') {
    throw new MovesError('not-full');
  }
  const { boardSize, firstPlayer } = state;
  const players = [firstPlayer, otherPlayer(firstPlayer)];
  let boards = state.boards;
  const events: DuelEvent[] = [];
  for (const cell of sequence(boardSize)) {
    for (const player of players) {
      const placed = state.boards[player][cellIndex(boardSize, cell)];
      const effect = placed ? getPiece(placed.pieceId).effect : null;
      const delta =
        placed?.nullified === false && effect ? SHIFTS[effect] : undefined;
      if (delta === undefined) {
        continue;
      }
      const shifted = shiftColumn(
        boards[player],
        boardSize,
        player,
        cell.column,
        delta,
      );
      boards = withPlayer(boards, player, shifted.board);
      events.push(...shifted.events);
    }
  }
  return { state: { ...state, boards, phase: 'moved' }, events };
}
