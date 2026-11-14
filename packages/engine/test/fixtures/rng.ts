export const SEED = '0123456789abcdef0123456789abcdef';
export const OTHER_SEED = 'fedcba9876543210fedcba9876543210';

export const goldenSequences: readonly (readonly [
  string,
  readonly number[],
])[] = [
  [
    '00000000000000000000000000000001',
    [
      0.020917808869853616, 0.8930241616908461, 0.8466880619525909,
      0.20335929933935404, 0.5368598245549947,
    ],
  ],
  [
    SEED,
    [
      0.21509934752248228, 0.08828551601618528, 0.7538491755258292,
      0.5510018044151366, 0.19503642199561,
    ],
  ],
];

export const invalidSeeds: readonly string[] = [
  '',
  '1',
  '0123456789abcdef0123456789abcde',
  '0123456789abcdef0123456789abcdef0',
  '0123456789ABCDEF0123456789ABCDEF',
  '0123456789abcdefg123456789abcdef',
];

export const nextIntBounds: readonly number[] = [1, 2, 3, 36, 1000];

export const invalidBounds: readonly number[] = [0, -1, 1.5, Number.NaN];
