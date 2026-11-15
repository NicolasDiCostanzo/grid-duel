import { describe, expect, it } from 'vitest';
import {
  shiftCases,
  unresolvablePhases,
  type ShiftCase,
} from '../test/fixtures/moves';
import { fullState, layoutBoard } from '../test/helpers/moves';
import { errorCode } from '../test/helpers/round';
import { resolveMoves } from './moves';

const stateOf = (testCase: ShiftCase) =>
  fullState(
    testCase.boardSize,
    testCase.firstPlayer,
    testCase.board0,
    testCase.board1,
  );

describe('resolveMoves', () => {
  it.each(shiftCases)('$name', (testCase) => {
    const state = stateOf(testCase);
    const result = resolveMoves(state);
    expect(result.state).toEqual({
      ...state,
      boards: [
        layoutBoard(testCase.expected0),
        layoutBoard(testCase.expected1),
      ],
      phase: 'moved',
    });
    expect(result.events).toEqual(testCase.events);
  });

  it.each(unresolvablePhases)('rejects a round in phase %s', (phase) => {
    const state = stateOf(shiftCases[0]!);
    expect(errorCode(() => resolveMoves({ ...state, phase }))).toBe('not-full');
  });
});
