import { describe, expect, it } from 'vitest';
import {
  duelCases,
  outcomeCases,
  pointCases,
  unduelablePhases,
} from '../test/fixtures/duels';
import { movedState, pieceLabel } from '../test/helpers/duels';
import { errorCode } from '../test/helpers/round';
import { parsePlaced } from '../test/helpers/moves';
import { duelOutcome, resolveDuels } from './duels';

describe('duelOutcome', () => {
  it.each(
    outcomeCases.map(([a, b, outcome]) => ({
      title: `${pieceLabel(a)} against ${pieceLabel(b)} is a ${outcome}`,
      a,
      b,
      outcome,
    })),
  )('$title', ({ a, b, outcome }) => {
    expect(duelOutcome(parsePlaced(a), parsePlaced(b))).toBe(outcome);
  });
});

describe('resolveDuels', () => {
  it.each([...duelCases, ...pointCases])('$name', (testCase) => {
    const state = movedState(testCase);
    const result = resolveDuels(state);
    expect(result.state).toEqual({
      ...state,
      phase: 'resolved',
      points: testCase.points,
      winner: testCase.winner,
    });
    expect(result.events).toEqual(testCase.events);
  });

  it.each(unduelablePhases)('rejects a round in phase %s', (phase) => {
    const state = movedState(duelCases[0]!);
    expect(errorCode(() => resolveDuels({ ...state, phase }))).toBe(
      'not-moved',
    );
  });
});
