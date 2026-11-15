import { getPiece } from './catalog';
import { consume, createDeck, drawOffer, offerSize, type Deck } from './deck';
import { restoreRng, type Rng, type RngState } from './rng';

export type BoardSize = '2x2' | '2x3';
export type PlayerId = 0 | 1;
export type Cell = { column: 0 | 1; row: number };
export type Placed = { pieceId: string; nullified: boolean };
export type Board = readonly (Placed | null)[];
export type Move = { pieceId: string; cell: Cell };
export type RoundPhase = 'placing' | 'full' | 'moved';

export type RoundState = {
  boardSize: BoardSize;
  boards: readonly [Board, Board];
  decks: readonly [Deck, Deck];
  firstPlayer: PlayerId;
  currentPlayer: PlayerId | null;
  offer: readonly string[];
  phase: RoundPhase;
  rngState: RngState;
};

export type PlayerView = {
  boardSize: BoardSize;
  boards: readonly [Board, Board];
  currentPlayer: PlayerId | null;
  deck: Deck;
  offer: readonly string[] | null;
  phase: RoundPhase;
  player: PlayerId;
};

export type PlacementErrorCode =
  | 'wrong-turn'
  | 'not-offered'
  | 'invalid-cell'
  | 'occupied'
  | 'no-piece-to-replace'
  | 'round-over';

export class PlacementError extends Error {
  constructor(readonly code: PlacementErrorCode) {
    super(`Illegal placement: ${code}`);
  }
}

export const ROWS: Record<BoardSize, number> = { '2x2': 2, '2x3': 3 };
const COLUMNS = [0, 1] as const;

export const otherPlayer = (player: PlayerId): PlayerId =>
  player === 0 ? 1 : 0;

const allCells = (boardSize: BoardSize): Cell[] =>
  COLUMNS.flatMap((column) =>
    Array.from({ length: ROWS[boardSize] }, (_, row) => ({ column, row })),
  );

const hasActiveLone = (board: Board): boolean =>
  board.some(
    (placed) =>
      placed !== null &&
      !placed.nullified &&
      getPiece(placed.pieceId).effect === 'short-offer',
  );

const isScout = (pieceId: string): boolean =>
  getPiece(pieceId).effect === 'replace';

const isFull = (board: Board): boolean =>
  board.every((placed) => placed !== null);

const hasPiece = (board: Board): boolean =>
  board.some((placed) => placed !== null);

const nullifiedRows = (
  pieceId: string,
  cell: Cell,
  boardSize: BoardSize,
): readonly number[] => {
  const { effect } = getPiece(pieceId);
  if (effect === 'nullify-row') {
    return [cell.row];
  }
  if (effect === 'nullify-side') {
    return Array.from({ length: ROWS[boardSize] }, (_, row) => row);
  }
  return [];
};

const nullifyRows = (
  board: Board,
  boardSize: BoardSize,
  rows: readonly number[],
): Board =>
  board.map((placed, index) =>
    placed !== null &&
    rows.includes(index % ROWS[boardSize]) &&
    getPiece(placed.pieceId).effect !== null
      ? { ...placed, nullified: true }
      : placed,
  );

export const withPlayer = <T>(
  pair: readonly [T, T],
  player: PlayerId,
  value: T,
): readonly [T, T] => (player === 0 ? [value, pair[1]] : [pair[0], value]);

export function pickFirstPlayer(rng: Rng): PlayerId {
  return rng.nextInt(2) as PlayerId;
}

export function cellIndex(boardSize: BoardSize, cell: Cell): number {
  const rows = ROWS[boardSize];
  const validColumn = cell.column === 0 || cell.column === 1;
  const validRow =
    Number.isInteger(cell.row) && cell.row >= 0 && cell.row < rows;
  if (!validColumn || !validRow) {
    throw new PlacementError('invalid-cell');
  }
  return cell.column * rows + cell.row;
}

export function pieceAt(
  state: RoundState,
  player: PlayerId,
  cell: Cell,
): Placed | null {
  return state.boards[player][cellIndex(state.boardSize, cell)] ?? null;
}

export function createRound(options: {
  boardSize: BoardSize;
  firstPlayer: PlayerId;
  rng: Rng;
}): RoundState {
  const { boardSize, firstPlayer, rng } = options;
  const emptyBoard: Board = Array(allCells(boardSize).length).fill(null);
  const decks: readonly [Deck, Deck] = [createDeck(rng), createDeck(rng)];
  return {
    boardSize,
    boards: [emptyBoard, emptyBoard],
    decks,
    firstPlayer,
    currentPlayer: firstPlayer,
    offer: drawOffer(decks[firstPlayer], offerSize(false), rng),
    phase: 'placing',
    rngState: rng.snapshot(),
  };
}

export function legalMoves(state: RoundState): Move[] {
  if (state.phase !== 'placing' || state.currentPlayer === null) {
    return [];
  }
  const cellsWhere = (board: Board, occupied: boolean) =>
    allCells(state.boardSize).filter(
      (_, index) => (board[index] !== null) === occupied,
    );
  const emptyCells = cellsWhere(state.boards[state.currentPlayer], false);
  const enemyBoard = state.boards[otherPlayer(state.currentPlayer)];
  const enemyCells = cellsWhere(enemyBoard, true);
  return state.offer.flatMap((pieceId) =>
    (isScout(pieceId) && enemyCells.length > 0 ? enemyCells : emptyCells).map(
      (cell) => ({ pieceId, cell }),
    ),
  );
}

export function applyMove(
  state: RoundState,
  player: PlayerId,
  move: Move,
): RoundState {
  if (state.phase !== 'placing') {
    throw new PlacementError('round-over');
  }
  if (player !== state.currentPlayer) {
    throw new PlacementError('wrong-turn');
  }
  if (!state.offer.includes(move.pieceId)) {
    throw new PlacementError('not-offered');
  }
  const opponent = otherPlayer(player);
  const replacing = isScout(move.pieceId) && hasPiece(state.boards[opponent]);
  const target = replacing ? opponent : player;
  const index = cellIndex(state.boardSize, move.cell);
  if (replacing && state.boards[target][index] === null) {
    throw new PlacementError('no-piece-to-replace');
  }
  if (!replacing && state.boards[target][index] !== null) {
    throw new PlacementError('occupied');
  }

  const board = state.boards[target].with(index, {
    pieceId: move.pieceId,
    nullified: false,
  });
  const placedBoards = withPlayer(state.boards, target, board);
  const boards = withPlayer(
    placedBoards,
    opponent,
    nullifyRows(
      placedBoards[opponent],
      state.boardSize,
      nullifiedRows(move.pieceId, move.cell, state.boardSize),
    ),
  );
  const decks = withPlayer(
    state.decks,
    player,
    consume(state.decks[player], move.pieceId),
  );

  if (boards.every(isFull)) {
    return {
      ...state,
      boards,
      decks,
      currentPlayer: null,
      offer: [],
      phase: 'full',
    };
  }

  const next = isFull(boards[opponent]) ? player : opponent;
  const rng = restoreRng(state.rngState);
  const offer = drawOffer(
    decks[next],
    offerSize(hasActiveLone(boards[otherPlayer(next)])),
    rng,
  );
  return {
    ...state,
    boards,
    decks,
    currentPlayer: next,
    offer,
    rngState: rng.snapshot(),
  };
}

export function playerView(state: RoundState, player: PlayerId): PlayerView {
  return {
    boardSize: state.boardSize,
    boards: state.boards,
    currentPlayer: state.currentPlayer,
    deck: state.decks[player].toSorted(),
    offer: state.currentPlayer === player ? state.offer : null,
    phase: state.phase,
    player,
  };
}
