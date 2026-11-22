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
  flag: string,
])[] = [
  ['an unknown option', ['--nope'], '--nope'],
  ['a missing value', ['--games'], '--games'],
  [
    'an option where a value is expected',
    ['--games', '--seed', '5'],
    '--games',
  ],
  ['an option instead of the output folder', ['--out', '--seed', '5'], '--out'],
  ['a games count that is not a positive integer', ['--games', '0'], '--games'],
  ['a games count that is not a number', ['--games', 'many'], '--games'],
  [
    'an analysis games count of zero',
    ['--analysis-games', '0'],
    '--analysis-games',
  ],
  ['an unknown level', ['--levels', 'easy,expert'], '--levels'],
  ['a single level', ['--levels', 'easy'], '--levels'],
  ['the same level twice', ['--levels', 'hard,hard'], '--levels'],
  ['an unknown board', ['--board', '3x3'], '--board'],
  [
    'an unknown analysis level',
    ['--analysis-level', 'expert'],
    '--analysis-level',
  ],
  [
    'a rollout count that is not a positive integer',
    ['--hard-rollouts', '0'],
    '--hard-rollouts',
  ],
  ['a negative seed', ['--seed', '-5'], '--seed'],
  ['a seed too large to be exact', ['--seed', '9007199254740993'], '--seed'],
  ['a seed written as an exponent', ['--seed', '1e40'], '--seed'],
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
