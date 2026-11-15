import type { DuelCase } from '../fixtures/duels';
import type { RoundState } from '../../src/round';
import { fullState } from './moves';

import * as pieces from '../fixtures/pieces';

const names = new Map(Object.entries(pieces).map(([name, id]) => [id, name]));

export const pieceLabel = (entry: string): string =>
  entry.startsWith('~')
    ? `~${pieceLabel(entry.slice(1))}`
    : (names.get(entry) ?? entry);

export const movedState = (testCase: DuelCase): RoundState => {
  const state = fullState(
    testCase.boardSize,
    0,
    testCase.board0,
    testCase.board1,
  );
  return { ...state, phase: 'moved', points: testCase.startPoints ?? [0, 0] };
};
