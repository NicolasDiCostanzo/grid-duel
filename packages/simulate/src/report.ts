import type { Interval } from './stats';
import type { BoardReport, Report } from './run';

const BLESSINGS: Readonly<Record<string, string>> = {
  'tie-win': 'Just',
  'shift-down': 'Fallen',
  'shift-up': 'Risen',
  'win-bonus': 'Prize',
  'nullify-row': 'Rotten',
  replace: 'Scout',
  'swap-row': 'Mercenary',
  drain: 'Marked',
  retype: 'Trickster',
  'short-offer': 'Lone',
  'move-points': 'Wandering',
  'round-win-vs-marked': 'Guardian',
  'nullify-side': 'Rotten+',
  'loss-points': 'False',
  'double-points': 'Golden',
};

const NOT_AVAILABLE = 'n/a';

const pct = (value: number | null): string =>
  value === null ? NOT_AVAILABLE : `${(value * 100).toFixed(1)}%`;

const range = (interval: Interval | null): string =>
  interval === null
    ? NOT_AVAILABLE
    : `${pct(interval[0])} to ${pct(interval[1])}`;

const signedPoints = (delta: number | null): string =>
  delta === null
    ? NOT_AVAILABLE
    : `${delta >= 0 ? '+' : '-'}${(Math.abs(delta) * 100).toFixed(1)} points`;

const blessingName = (effect: string): string =>
  BLESSINGS[effect] === undefined
    ? effect
    : `${BLESSINGS[effect]} (\`${effect}\`)`;

const row = (...cells: (string | number)[]): string =>
  `| ${cells.join(' | ')} |`;

const boardFindings = (board: BoardReport): string[] => {
  const { boardSize } = board;
  const ordering = board.ordering.failures.map(
    ({ stronger, weaker, rate, games }) =>
      `${boardSize}: ${stronger} does not beat ${weaker} (${pct(rate)} of ${games} games)`,
  );
  const { firstWinRate, interval } = board.firstPlayer;
  const firstPlayer =
    firstWinRate !== null &&
    interval !== null &&
    (interval[0] > 0.5 || interval[1] < 0.5)
      ? [
          `${boardSize}: the first player wins ${pct(firstWinRate)} of the decided rounds (95% interval ${range(interval)})`,
        ]
      : [];
  const effects = board.effects
    .filter(({ flagged }) => flagged)
    .map(
      ({ effect, delta }) =>
        `${boardSize}: ${BLESSINGS[effect] ?? effect} (${effect}) moves the round score by ${signedPoints(delta)} when played`,
    );
  return [...ordering, ...firstPlayer, ...effects];
};

export const findings = (report: Report): string[] =>
  report.boards.flatMap(boardFindings);

const renderBoard = (board: BoardReport, analysisLevel: string): string[] => [
  `## Board ${board.boardSize}`,
  '',
  '### Pairings',
  '',
  'Win rate of the stronger level over the weaker one. Seats alternate and every pairing plays the same deals.',
  '',
  row('Pairing', 'Games', 'Wins', 'Win rate', '95% interval'),
  row('---', '---', '---', '---', '---'),
  ...board.pairings.map((pairing) =>
    row(
      `${pairing.a} over ${pairing.b}`,
      pairing.games,
      pairing.aWins,
      pct(pairing.rate),
      range(pairing.interval),
    ),
  ),
  '',
  `### First player advantage (${analysisLevel} against itself)`,
  '',
  row(
    'Rounds',
    'First player wins',
    'Second player wins',
    'Draws',
    'First player win rate',
    '95% interval',
  ),
  row('---', '---', '---', '---', '---', '---'),
  row(
    board.firstPlayer.rounds,
    board.firstPlayer.firstWins,
    board.firstPlayer.secondWins,
    board.firstPlayer.draws,
    pct(board.firstPlayer.firstWinRate),
    range(board.firstPlayer.interval),
  ),
  '',
  'The win rate counts the decided rounds only.',
  '',
  `### Blessings (${analysisLevel} against itself)`,
  '',
  'Score of a player in a round: win 100%, draw 50%, loss 0%. "Rounds played" counts each player in each round once. The difference compares the rounds where a player placed a piece with the blessing with the other rounds.',
  '',
  'Read the Shepherd blessings (Lone, Wandering, Guardian, Rotten+, False, Golden) with care: a Shepherd loses to every regular piece by type, so a negative difference mostly reflects that base weakness and is not specific to the blessing. Compare the Shepherds with each other.',
  '',
  row(
    'Blessing',
    'Rounds played',
    'Score when played',
    'Score otherwise',
    'Difference',
    'Flagged',
  ),
  row('---', '---', '---', '---', '---', '---'),
  ...board.effects.map((impact) =>
    row(
      blessingName(impact.effect),
      impact.playedRounds,
      pct(impact.playedScore),
      pct(impact.notPlayedScore),
      signedPoints(impact.delta),
      impact.flagged ? 'yes' : 'no',
    ),
  ),
  '',
  '### Randomness of the offers and the draws',
  '',
  `Rounds that end in a draw: ${pct(board.randomness.drawRate)}`,
  '',
  'How often the weaker level still wins the match.',
  '',
  row('Pairing', 'Weaker level wins the match', '95% interval'),
  row('---', '---', '---'),
  ...board.randomness.upsets.map((upset) =>
    row(
      `${upset.stronger} over ${upset.weaker}`,
      pct(upset.rate),
      range(upset.interval),
    ),
  ),
  '',
];

export function renderMarkdown(report: Report): string {
  const { options } = report;
  const all = findings(report);
  return [
    '# Balance report',
    '',
    `Games per pairing: ${options.games}. Games of the analysis: ${options.analysisGames}. Levels: ${options.levels.join(', ')}. Boards: ${options.boardSizes.join(', ')}. Seed: ${options.seed}. Analysis level: ${options.analysisLevel}. Hard bot rollouts: ${options.hardRollouts ?? 'default'}.`,
    '',
    `Ordering of the levels: ${report.orderingHolds ? 'holds' : 'does not hold'}`,
    '',
    ...report.boards.flatMap((board) =>
      renderBoard(board, options.analysisLevel),
    ),
    '## Findings',
    '',
    ...(all.length === 0 ? ['None.'] : all.map((finding) => `- ${finding}`)),
    '',
  ].join('\n');
}

export const renderJson = (report: Report): string =>
  `${JSON.stringify(report, null, 2)}\n`;
