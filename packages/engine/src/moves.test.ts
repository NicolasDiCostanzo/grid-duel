import { describe, expect, it } from 'vitest';
import {
  FALLEN,
  mercenaryCases,
  plain2x2,
  shiftCases,
  tricksterBoard,
  tricksterOf,
  tricksterSeedCount,
  tricksterTypes,
  unresolvablePhases,
  wanderingCases,
  type ShiftCase,
} from '../test/fixtures/moves';
import { hexSeedFor } from '../test/fixtures/round';
import { fullState, layoutBoard } from '../test/helpers/moves';
import { errorCode } from '../test/helpers/round';
import { resolveMoves } from './moves';
import { createRng, restoreRng } from './rng';
import { cellIndex } from './round';

const stateOf = (testCase: ShiftCase) =>
  fullState(
    testCase.boardSize,
    testCase.firstPlayer,
    testCase.board0,
    testCase.board1,
  );

describe('resolveMoves', () => {
  it.each([...shiftCases, ...mercenaryCases, ...wanderingCases])(
    '$name',
    (testCase) => {
      const state = stateOf(testCase);
      const result = resolveMoves(state);
      expect(result.state).toEqual({
        ...state,
        boards: [
          layoutBoard(testCase.expected0),
          layoutBoard(testCase.expected1),
        ],
        phase: 'moved',
        points: testCase.points ?? state.points,
      });
      expect(result.events).toEqual(testCase.events);
    },
  );

  it.each(unresolvablePhases)('rejects a round in phase %s', (phase) => {
    const state = stateOf(shiftCases[0]!);
    expect(errorCode(() => resolveMoves({ ...state, phase }))).toBe('not-full');
  });
});

describe('resolveMoves with a Trickster', () => {
  const cell = { column: 1, row: 0 } as const;
  const index = cellIndex('2x2', cell);
  const stateWith = (pieceId: string, seed?: string) => ({
    ...fullState('2x2', 0, tricksterBoard(pieceId), plain2x2),
    ...(seed === undefined ? {} : { rngState: createRng(seed).snapshot() }),
  });

  it.each(tricksterTypes)(
    'turns a type %i Trickster into a regular piece of another type',
    (type) => {
      const state = stateWith(tricksterOf(type));
      const result = resolveMoves(state);
      const placed = result.state.boards[0][index];
      const others = tricksterTypes
        .filter((other) => other !== type)
        .map((other) => `r${other}`);
      expect(others).toContain(placed?.pieceId);
      expect(placed?.nullified).toBe(false);
      expect(result.events).toEqual([
        {
          type: 'transformed',
          player: 0,
          cell,
          from: tricksterOf(type),
          to: placed?.pieceId,
        },
      ]);
      expect(result.state.boards[0].filter((_, i) => i !== index)).toEqual(
        state.boards[0].filter((_, i) => i !== index),
      );
      expect(result.state.boards[1]).toEqual(state.boards[1]);
    },
  );

  it('depends on the seed and reaches both other types', () => {
    const results = new Set(
      Array.from(
        { length: tricksterSeedCount },
        (_, seed) =>
          resolveMoves(stateWith(tricksterOf(0), hexSeedFor(seed))).state
            .boards[0][index]?.pieceId,
      ),
    );
    expect(results).toEqual(new Set(['r1', 'r2']));
  });

  it('gives the same result for the same state', () => {
    const state = stateWith(tricksterOf(0), hexSeedFor(7));
    expect(resolveMoves(state)).toEqual(resolveMoves(state));
  });

  it('leaves a nullified Trickster and the random state untouched', () => {
    const state = stateWith(`~${tricksterOf(0)}`);
    const result = resolveMoves(state);
    expect(result.state).toEqual({ ...state, phase: 'moved' });
    expect(result.events).toEqual([]);
  });

  it('draws once per Trickster, in sequence order', () => {
    const state = fullState('2x2', 0, tricksterBoard(tricksterOf(0)), [
      ['r2', 'r0'],
      ['r0', tricksterOf(1)],
    ]);
    const result = resolveMoves(state);
    const rng = restoreRng(state.rngState);
    rng.nextInt(2);
    rng.nextInt(2);
    expect(result.state.rngState).toEqual(rng.snapshot());
    expect(result.events.map((event) => event.type)).toEqual([
      'transformed',
      'transformed',
    ]);
    expect(result.events.map((event) => 'cell' in event && event.cell)).toEqual(
      [
        { column: 1, row: 0 },
        { column: 1, row: 1 },
      ],
    );
  });

  it('transforms from the cell the Trickster was moved to', () => {
    const state = fullState(
      '2x2',
      0,
      [
        ['r1', 'r2'],
        [FALLEN, tricksterOf(0)],
      ],
      plain2x2,
    );
    const result = resolveMoves(state);
    const placed = result.state.boards[0][index];
    expect(result.events).toEqual([
      expect.objectContaining({ type: 'moved', pieceId: FALLEN }),
      expect.objectContaining({ type: 'moved', pieceId: tricksterOf(0) }),
      {
        type: 'transformed',
        player: 0,
        cell,
        from: tricksterOf(0),
        to: placed?.pieceId,
      },
    ]);
    expect(placed?.pieceId).toMatch(/^r[12]$/);
    expect(
      result.state.boards[0][cellIndex('2x2', { column: 1, row: 1 })]?.pieceId,
    ).toBe(FALLEN);
  });
});
