export const offerSizes: readonly (readonly [boolean, number])[] = [
  [false, 3],
  [true, 1],
];

export const drawSizes: readonly number[] = [1, 3];

export const smallDeck: readonly string[] = ['r0', 'r1'];

export const consumedPieceId = 'r0.tie-win';

export const absentPieceIds: readonly string[] = ['unknown', 'r0.tie-win-x'];

export const manyOffers = 500;

export const recordedDeckOrder: readonly string[] = [
  'r0.swap-row',
  'r0.win-bonus',
  'r2.swap-row',
  'r2.tie-win',
  'r1',
  'r1.retype',
  's.loss-points',
  'r1.replace',
  'r1.shift-up',
  'r0.shift-up',
  'r0.replace',
  's.double-points',
  'r1.tie-win',
  'r2.nullify-row',
  'r2',
  'r2.shift-down',
  's.nullify-side',
  's.move-points',
  'r1.swap-row',
  's.round-win-vs-marked',
  'r2.replace',
  'r2.retype',
  'r0.drain',
  'r1.win-bonus',
  'r2.shift-up',
  'r1.drain',
  'r0.nullify-row',
  'r0.shift-down',
  's.short-offer',
  'r1.shift-down',
  'r2.win-bonus',
  'r0.retype',
  'r0.tie-win',
  'r2.drain',
  'r1.nullify-row',
  'r0',
];
