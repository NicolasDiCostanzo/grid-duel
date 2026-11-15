import {
  applyMove,
  cellIndex,
  legalMoves,
  type Cell,
  type Placed,
  type PlayerId,
  type RoundState,
} from '../../src/round';

export const forceOffer = (
  state: RoundState,
  offer: readonly string[],
): RoundState => ({ ...state, offer });

export const withPlaced = (
  state: RoundState,
  player: PlayerId,
  cell: Cell,
  placed: Placed,
): RoundState => {
  const board = [...state.boards[player]];
  board[cellIndex(state.boardSize, cell)] = placed;
  const boards: RoundState['boards'] =
    player === 0 ? [board, state.boards[1]] : [state.boards[0], board];
  return { ...state, boards };
};

export const withFilledBoard = (
  state: RoundState,
  player: PlayerId,
  placed: Placed,
  empty: readonly Cell[] = [],
): RoundState => {
  const emptyIndexes = empty.map((cell) => cellIndex(state.boardSize, cell));
  const board = state.boards[player].map((_, index) =>
    emptyIndexes.includes(index) ? null : placed,
  );
  const boards: RoundState['boards'] =
    player === 0 ? [board, state.boards[1]] : [state.boards[0], board];
  return { ...state, boards };
};

export const playFirstLegalMove = (state: RoundState): RoundState => {
  const [move] = legalMoves(state);
  if (move === undefined || state.currentPlayer === null) {
    throw new Error('No legal move');
  }
  return applyMove(state, state.currentPlayer, move);
};

export const errorCode = (action: () => unknown): string | undefined => {
  try {
    action();
  } catch (error) {
    return (error as { code?: string }).code;
  }
  return undefined;
};
