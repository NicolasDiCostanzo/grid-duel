import { createRng } from '../../src/rng';
import {
  createRound,
  type Board,
  type BoardSize,
  type Placed,
  type PlayerId,
  type RoundState,
} from '../../src/round';
import { SEED } from '../fixtures/rng';
import type { Layout } from '../fixtures/moves';

const parsePlaced = (entry: string): Placed =>
  entry.startsWith('~')
    ? { pieceId: entry.slice(1), nullified: true }
    : { pieceId: entry, nullified: false };

export const layoutBoard = (layout: Layout): Board =>
  layout.flat().map(parsePlaced);

export const fullState = (
  boardSize: BoardSize,
  firstPlayer: PlayerId,
  board0: Layout,
  board1: Layout,
): RoundState => ({
  ...createRound({ boardSize, firstPlayer, rng: createRng(SEED) }),
  boards: [layoutBoard(board0), layoutBoard(board1)],
  currentPlayer: null,
  offer: [],
  phase: 'full',
});
