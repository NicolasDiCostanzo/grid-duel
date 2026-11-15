import {
  REGULAR_TYPES,
  catalog,
  getPiece,
  type Piece,
  type RegularType,
} from './catalog';
import { restoreRng } from './rng';
import {
  ROWS,
  cellIndex,
  otherPlayer,
  withPlayer,
  type Board,
  type BoardSize,
  type Cell,
  type Placed,
  type PlayerId,
  type RoundState,
} from './round';

export type DuelEvent =
  | {
      type: 'moved';
      player: PlayerId;
      pieceId: string;
      from: Cell;
      to: Cell;
    }
  | {
      type: 'transformed';
      player: PlayerId;
      cell: Cell;
      from: string;
      to: string;
    }
  | { type: 'points'; player: PlayerId; amount: number };

export type MovesErrorCode = 'not-full';

export class MovesError extends Error {
  constructor(readonly code: MovesErrorCode) {
    super(`Cannot resolve moves: ${code}`);
  }
}

const WANDERING_POINTS = 2;

type Entry = { placed: Placed; origin: number };
type Relocation = readonly [from: Cell, to: Cell];

const shift = (cell: Cell, delta: number, rows: number): Relocation[] =>
  Array.from({ length: rows }, (_, row) => [
    { column: cell.column, row },
    { column: cell.column, row: (row + delta + rows) % rows },
  ]);

const swapRow = (cell: Cell): Relocation[] => {
  const other: Cell = { column: cell.column === 0 ? 1 : 0, row: cell.row };
  return [
    [cell, other],
    [other, cell],
  ];
};

const RELOCATIONS: Partial<
  Record<string, (cell: Cell, rows: number) => Relocation[]>
> = {
  'shift-down': (cell, rows) => shift(cell, 1, rows),
  'shift-up': (cell, rows) => shift(cell, -1, rows),
  'swap-row': swapRow,
};

const sequence = (boardSize: BoardSize): Cell[] =>
  ([1, 0] as const).flatMap((column) =>
    Array.from({ length: ROWS[boardSize] }, (_, row) => ({ column, row })),
  );

const plainPiece = (type: RegularType | undefined): Piece => {
  const piece = catalog.find(
    (candidate) =>
      candidate.kind === 'regular' &&
      candidate.type === type &&
      candidate.effect === null,
  );
  if (piece === undefined) {
    throw new Error(`No plain piece of type ${type}`);
  }
  return piece;
};

const toEntries = (board: Board): Entry[] =>
  board.map((placed, origin) => {
    if (placed === null) {
      throw new Error('Full board expected');
    }
    return { placed, origin };
  });

const entryAt = (
  board: readonly Entry[],
  boardSize: BoardSize,
  cell: Cell,
): Entry => {
  const entry = board[cellIndex(boardSize, cell)];
  if (entry === undefined) {
    throw new Error('Full board expected');
  }
  return entry;
};

const relocate = (
  board: readonly Entry[],
  boardSize: BoardSize,
  player: PlayerId,
  relocations: readonly Relocation[],
): { board: Entry[]; events: DuelEvent[] } => {
  const next = [...board];
  const events = relocations.flatMap(([from, to]): DuelEvent[] => {
    const entry = entryAt(board, boardSize, from);
    next[cellIndex(boardSize, to)] = entry;
    const moved: DuelEvent = {
      type: 'moved',
      player,
      pieceId: entry.placed.pieceId,
      from,
      to,
    };
    const earnsPoints =
      !entry.placed.nullified &&
      getPiece(entry.placed.pieceId).effect === 'move-points';
    return earnsPoints
      ? [moved, { type: 'points', player, amount: WANDERING_POINTS }]
      : [moved];
  });
  return { board: next, events };
};

export function resolveMoves(state: RoundState): {
  state: RoundState;
  events: DuelEvent[];
} {
  if (state.phase !== 'full') {
    throw new MovesError('not-full');
  }
  const { boardSize, firstPlayer } = state;
  const rows = ROWS[boardSize];
  const players = [firstPlayer, otherPlayer(firstPlayer)];
  let entries: readonly [Entry[], Entry[]] = [
    toEntries(state.boards[0]),
    toEntries(state.boards[1]),
  ];
  const rng = restoreRng(state.rngState);
  const events: DuelEvent[] = [];
  for (const start of sequence(boardSize)) {
    const origin = cellIndex(boardSize, start);
    for (const player of players) {
      const placed = state.boards[player][origin];
      const piece =
        placed && !placed.nullified ? getPiece(placed.pieceId) : null;
      if (!piece?.effect) {
        continue;
      }
      const current = entries[player].findIndex(
        (entry) => entry.origin === origin,
      );
      const cell: Cell = {
        column: current < rows ? 0 : 1,
        row: current % rows,
      };
      if (piece.kind === 'regular' && piece.effect === 'retype') {
        const others = REGULAR_TYPES.filter((type) => type !== piece.type);
        const becomes = plainPiece(others[rng.nextInt(others.length)]);
        entries = withPlayer(
          entries,
          player,
          entries[player].with(current, {
            placed: { pieceId: becomes.id, nullified: false },
            origin,
          }),
        );
        events.push({
          type: 'transformed',
          player,
          cell,
          from: piece.id,
          to: becomes.id,
        });
        continue;
      }
      const relocation = RELOCATIONS[piece.effect];
      if (relocation === undefined) {
        continue;
      }
      const moved = relocate(
        entries[player],
        boardSize,
        player,
        relocation(cell, rows),
      );
      entries = withPlayer(entries, player, moved.board);
      events.push(...moved.events);
    }
  }
  const boards = [
    entries[0].map((entry) => entry.placed),
    entries[1].map((entry) => entry.placed),
  ] as const;
  const gained = (player: PlayerId) =>
    events.reduce(
      (sum, event) =>
        event.type === 'points' && event.player === player
          ? sum + event.amount
          : sum,
      0,
    );
  const points: RoundState['points'] = [
    state.points[0] + gained(0),
    state.points[1] + gained(1),
  ];
  return {
    state: {
      ...state,
      boards,
      points,
      phase: 'moved',
      rngState: rng.snapshot(),
    },
    events,
  };
}
