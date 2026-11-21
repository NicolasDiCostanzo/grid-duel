import {
  createHardBot,
  easyBot,
  hardBot,
  mediumBot,
  type Bot,
} from '@game/bot';
import {
  applyMove,
  catalog,
  createGame,
  createRng,
  getPiece,
  view,
  type BoardSize,
  type PlayerId,
} from '@game/engine';
import {
  LEVELS,
  checkOrdering,
  effectImpact,
  firstPlayerAdvantage,
  wilsonInterval,
  type BotLevel,
  type EffectImpact,
  type Interval,
  type Pairing,
  type RoundRecord,
} from './stats';

export type SimulateOptions = {
  games: number;
  levels: readonly BotLevel[];
  boardSizes: readonly BoardSize[];
  seed: number;
  analysisLevel: BotLevel;
  hardRollouts?: number;
};

export type GameSeeds = { game: string; bots: readonly [string, string] };

export type PairingReport = Pairing & { rate: number; interval: Interval };

export type BoardReport = {
  boardSize: BoardSize;
  pairings: PairingReport[];
  ordering: ReturnType<typeof checkOrdering>;
  firstPlayer: ReturnType<typeof firstPlayerAdvantage>;
  effects: EffectImpact[];
  randomness: {
    drawRate: number | null;
    upsets: {
      stronger: BotLevel;
      weaker: BotLevel;
      rate: number;
      interval: Interval;
    }[];
  };
};

export type Report = {
  options: SimulateOptions;
  boards: BoardReport[];
  orderingHolds: boolean;
};

const SEED_DIGITS = 32;
const HEX = 16;
const MAX_MOVES_PER_GAME = 10_000;

const digits = (rng: { nextInt(max: number): number }): string =>
  Array.from({ length: SEED_DIGITS }, () =>
    rng.nextInt(HEX).toString(HEX),
  ).join('');

export function seedsFor(seed: number, games: number): GameSeeds[] {
  const master = createRng(seed.toString(HEX).padStart(SEED_DIGITS, '0'));
  return Array.from({ length: games }, () => ({
    game: digits(master),
    bots: [digits(master), digits(master)] as const,
  }));
}

export function playGame(
  bots: readonly [Bot, Bot],
  options: {
    seed: string;
    boardSize: BoardSize;
    botSeeds: readonly [string, string];
  },
): { winner: PlayerId; rounds: RoundRecord[] } {
  const rngs = [createRng(options.botSeeds[0]), createRng(options.botSeeds[1])];
  let state = createGame({ seed: options.seed, boardSize: options.boardSize });
  const rounds: RoundRecord[] = [];
  let placed: [string[], string[]] = [[], []];
  for (let played = 0; state.winner === null; played++) {
    if (played >= MAX_MOVES_PER_GAME) {
      throw new Error('The game did not finish');
    }
    const player = state.round.currentPlayer as PlayerId;
    const move = bots[player](view(state, player), rngs[player]!);
    placed[player].push(move.pieceId);
    const { firstPlayer } = state.round;
    const next = applyMove(state, player, move).state;
    if (next.results.length > state.results.length) {
      rounds.push({
        firstPlayer,
        winner: next.results[next.results.length - 1]!,
        placed,
      });
      placed = [[], []];
    }
    state = next;
  }
  return { winner: state.winner, rounds };
}

export function runPairing(
  a: Bot,
  b: Bot,
  options: { boardSize: BoardSize; seeds: readonly GameSeeds[] },
): { games: number; aWins: number; rounds: RoundRecord[] } {
  let aWins = 0;
  const rounds: RoundRecord[] = [];
  options.seeds.forEach(({ game, bots }, index) => {
    const aSeat = (index % 2) as PlayerId;
    const pair: readonly [Bot, Bot] = aSeat === 0 ? [a, b] : [b, a];
    const record = playGame(pair, {
      seed: game,
      boardSize: options.boardSize,
      botSeeds: bots,
    });
    if (record.winner === aSeat) {
      aWins++;
    }
    rounds.push(...record.rounds);
  });
  return { games: options.seeds.length, aWins, rounds };
}

const botFor = (level: BotLevel, hardRollouts?: number): Bot => {
  if (level === 'easy') {
    return easyBot;
  }
  if (level === 'medium') {
    return mediumBot;
  }
  return hardRollouts === undefined
    ? hardBot
    : createHardBot({ rollouts: hardRollouts });
};

const EFFECTS = [
  ...new Set(
    catalog.flatMap((piece) => (piece.effect === null ? [] : [piece.effect])),
  ),
];

export function simulate(
  options: SimulateOptions,
  onProgress: (message: string) => void = () => undefined,
): Report {
  const seeds = seedsFor(options.seed, options.games);
  const bot = (level: BotLevel) => botFor(level, options.hardRollouts);
  const boards = options.boardSizes.map((boardSize): BoardReport => {
    const levels = LEVELS.filter((level) => options.levels.includes(level));
    const pairings = levels.flatMap((stronger, index) =>
      levels.slice(0, index).map((weaker): PairingReport => {
        onProgress(`${boardSize}: ${stronger} against ${weaker}`);
        const { games, aWins } = runPairing(bot(stronger), bot(weaker), {
          boardSize,
          seeds,
        });
        return {
          a: stronger,
          b: weaker,
          games,
          aWins,
          rate: games === 0 ? 0 : aWins / games,
          interval: wilsonInterval(aWins, games),
        };
      }),
    );
    onProgress(`${boardSize}: ${options.analysisLevel} against itself`);
    const analysis = bot(options.analysisLevel);
    const { rounds } = runPairing(analysis, analysis, { boardSize, seeds });
    const firstPlayer = firstPlayerAdvantage(rounds);
    return {
      boardSize,
      pairings,
      ordering: checkOrdering(pairings),
      firstPlayer,
      effects: effectImpact(
        rounds,
        (pieceId) => getPiece(pieceId).effect,
        EFFECTS,
      ),
      randomness: {
        drawRate:
          rounds.length === 0 ? null : firstPlayer.draws / rounds.length,
        upsets: pairings.map(({ a, b, games, aWins }) => ({
          stronger: a,
          weaker: b,
          rate: games === 0 ? 0 : 1 - aWins / games,
          interval: wilsonInterval(games - aWins, games),
        })),
      },
    };
  });
  return {
    options,
    boards,
    orderingHolds: boards.every(({ ordering }) => ordering.holds),
  };
}
