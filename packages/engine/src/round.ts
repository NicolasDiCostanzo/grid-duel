import { getPiece } from './catalog';
import { consume, createDeck, drawOffer, offerSize, type Deck } from './deck';
import { restoreRng, type Rng, type RngState } from './rng';

export type BoardSize = '2x2' | '2x3';
export type PlayerId = 0 | 1;
export type Cell = { column: 0 | 1; row: number };
export type Placed = { pieceId: string; nullified: boolean };
export type Board = readonly (Placed | null)[];
export type Move = { pieceId: string; cell: Cell };
export type RoundPhase = 'placing' | 'full';

export type RoundState = {
  boardSize: BoardSize;
  boards: readonly [Board, Board];
  decks: readonly [Deck, Deck];
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
  'wrong-turn' | 'not-offered' | 'invalid-cell' | 'occupied' | 'round-over';

export class PlacementError extends Error {
  constructor(readonly code: PlacementErrorCode) {
    super(`Illegal placement: ${code}`);
  }
}

const ROWS: Record<BoardSize, number> = { '2x2': 2, '2x3': 3 };
const COLUMNS = [0, 1] as const;

const otherPlayer = (player: PlayerId): PlayerId => (player === 0 ? 1 : 0);

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
  const decks: readonly [Deck, Deck] = [createDeck(), createDeck()];
  return {
    boardSize,
    boards: [emptyBoard, emptyBoard],
    decks,
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
  const board = state.boards[state.currentPlayer];
  const emptyCells = allCells(state.boardSize).filter(
    (_, index) => board[index] === null,
  );
  return state.offer.flatMap((pieceId) =>
    emptyCells.map((cell) => ({ pieceId, cell })),
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
  const index = cellIndex(state.boardSize, move.cell);
  if (state.boards[player][index] !== null) {
    throw new PlacementError('occupied');
  }

  const board = state.boards[player].with(index, {
    pieceId: move.pieceId,
    nullified: false,
  });
  const boards: readonly [Board, Board] =
    player === 0 ? [board, state.boards[1]] : [state.boards[0], board];
  const deck = consume(state.decks[player], move.pieceId);
  const decks: readonly [Deck, Deck] =
    player === 0 ? [deck, state.decks[1]] : [state.decks[0], deck];

  if (boards.every((candidate) => candidate.every((cell) => cell !== null))) {
    return {
      ...state,
      boards,
      decks,
      currentPlayer: null,
      offer: [],
      phase: 'full',
    };
  }

  const next = otherPlayer(player);
  const rng = restoreRng(state.rngState);
  const offer = drawOffer(decks[next], offerSize(hasActiveLone(board)), rng);
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
    deck: state.decks[player],
    offer: state.currentPlayer === player ? state.offer : null,
    phase: state.phase,
    player,
  };
}
