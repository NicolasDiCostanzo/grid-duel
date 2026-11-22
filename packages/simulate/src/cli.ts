import { LEVELS, type BotLevel } from './stats';
import { findings, renderJson, renderMarkdown } from './report';
import { simulate, type Report, type SimulateOptions } from './run';
import type { BoardSize } from '@game/engine';

export type CliOptions = SimulateOptions & { out: string };

export type CliIo = {
  writeFile(path: string, content: string): void;
  log(message: string): void;
  error(message: string): void;
};

export type ParseResult =
  | { ok: true; options: CliOptions }
  | { ok: false; message: string; help?: boolean };

const USAGE = `Usage: npm run simulate -- [--games N] [--analysis-games N] [--levels easy,medium,hard] [--board 2x2|2x3|both] [--seed N] [--analysis-level LEVEL] [--hard-rollouts N] [--out DIR]`;

const BOARDS: Readonly<Record<string, readonly BoardSize[]>> = {
  '2x2': ['2x2'],
  '2x3': ['2x3'],
  both: ['2x2', '2x3'],
};

const KNOWN_FLAGS: ReadonlySet<string> = new Set([
  '--games',
  '--analysis-games',
  '--seed',
  '--hard-rollouts',
  '--levels',
  '--board',
  '--analysis-level',
  '--out',
  '--help',
]);

const isLevel = (value: string): value is BotLevel =>
  (LEVELS as readonly string[]).includes(value);

const positiveInteger = (value: string): number | null => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
};

const positiveSafeInteger = (value: string): number | null => {
  const number = positiveInteger(value);
  return number !== null && Number.isSafeInteger(number) ? number : null;
};

export function parseArgs(args: readonly string[]): ParseResult {
  const options: CliOptions = {
    games: 100,
    analysisGames: 1000,
    levels: ['easy', 'medium', 'hard'],
    boardSizes: ['2x2', '2x3'],
    seed: 1,
    analysisLevel: 'easy',
    out: 'reports',
  };
  const fail = (message: string): ParseResult => ({
    ok: false,
    message: `${message}\n${USAGE}`,
  });
  if (args.includes('--help')) {
    return { ok: false, message: USAGE, help: true };
  }
  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index] as string;
    const value = args[index + 1];
    if (value === undefined || KNOWN_FLAGS.has(value)) {
      return fail(`Missing value for ${flag}`);
    }
    switch (flag) {
      case '--seed': {
        const seed = positiveSafeInteger(value);
        if (seed === null) {
          return fail(
            `--seed needs a positive integer up to ${Number.MAX_SAFE_INTEGER}, got ${value}`,
          );
        }
        options.seed = seed;
        break;
      }
      case '--games':
      case '--analysis-games':
      case '--hard-rollouts': {
        const number = positiveInteger(value);
        if (number === null) {
          return fail(`${flag} needs a positive integer, got ${value}`);
        }
        if (flag === '--games') options.games = number;
        else if (flag === '--analysis-games') options.analysisGames = number;
        else options.hardRollouts = number;
        break;
      }
      case '--levels': {
        const levels = value.split(',');
        if (!levels.every(isLevel)) {
          return fail(
            `--levels needs levels among ${LEVELS.join(', ')}, got ${value}`,
          );
        }
        if (new Set(levels).size < 2) {
          return fail(
            `--levels needs at least two different levels, got ${value}`,
          );
        }
        options.levels = levels;
        break;
      }
      case '--board': {
        const boards = BOARDS[value];
        if (boards === undefined) {
          return fail(`--board needs 2x2, 2x3 or both, got ${value}`);
        }
        options.boardSizes = boards;
        break;
      }
      case '--analysis-level':
        if (!isLevel(value)) {
          return fail(
            `--analysis-level needs a level among ${LEVELS.join(', ')}, got ${value}`,
          );
        }
        options.analysisLevel = value;
        break;
      case '--out':
        options.out = value;
        break;
      default:
        return fail(`Unknown option ${flag}`);
    }
  }
  return { ok: true, options };
}

export function runCli(
  args: readonly string[],
  io: CliIo,
  run: (
    options: SimulateOptions,
    onProgress: (message: string) => void,
  ) => Report = simulate,
): number {
  const parsed = parseArgs(args);
  if (!parsed.ok) {
    if (parsed.help) {
      io.log(parsed.message);
      return 0;
    }
    io.error(parsed.message);
    return 2;
  }
  const { out, ...options } = parsed.options;
  const report = run(options, io.log);
  const markdown = `${out}/balance-report.md`;
  io.writeFile(markdown, renderMarkdown(report));
  io.writeFile(`${out}/balance-report.json`, renderJson(report));
  io.log(`Report written to ${markdown}`);
  if (!report.orderingHolds) {
    io.error(
      `The ordering of the levels does not hold:\n${findings(report).join('\n')}`,
    );
    return 1;
  }
  return 0;
}
