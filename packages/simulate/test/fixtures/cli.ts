import type { SimulateOptions } from '../../src/run';

export const defaults: SimulateOptions & { out: string } = {
  games: 100,
  analysisGames: 1000,
  levels: ['easy', 'medium', 'hard'],
  boardSizes: ['2x2', '2x3'],
  seed: 1,
  analysisLevel: 'easy',
  out: 'reports',
};

export const parseCases: readonly {
  name: string;
  args: readonly string[];
  expected: Partial<typeof defaults>;
}[] = [
  { name: 'uses the defaults', args: [], expected: defaults },
  {
    name: 'reads every option',
    args: [
      '--games',
      '20',
      '--analysis-games',
      '300',
      '--levels',
      'easy,hard',
      '--board',
      '2x3',
      '--seed',
      '7',
      '--analysis-level',
      'medium',
      '--hard-rollouts',
      '50',
      '--out',
      'somewhere',
    ],
    expected: {
      games: 20,
      analysisGames: 300,
      levels: ['easy', 'hard'],
      boardSizes: ['2x3'],
      seed: 7,
      analysisLevel: 'medium',
      hardRollouts: 50,
      out: 'somewhere',
    },
  },
  {
    name: 'reads both boards',
    args: ['--board', 'both'],
    expected: { boardSizes: ['2x2', '2x3'] },
  },
];

export const usageErrors: readonly (readonly [
  name: string,
  args: readonly string[],
])[] = [
  ['an unknown option', ['--nope']],
  ['a missing value', ['--games']],
  ['a games count that is not a positive integer', ['--games', '0']],
  ['a games count that is not a number', ['--games', 'many']],
  ['an analysis games count of zero', ['--analysis-games', '0']],
  ['an unknown level', ['--levels', 'easy,expert']],
  ['an unknown board', ['--board', '3x3']],
  ['an unknown analysis level', ['--analysis-level', 'expert']],
  ['a rollout count that is not a positive integer', ['--hard-rollouts', '0']],
];

export const smallRun = [
  '--games',
  '4',
  '--levels',
  'easy,medium',
  '--board',
  '2x2',
  '--out',
  'out',
] as const;
