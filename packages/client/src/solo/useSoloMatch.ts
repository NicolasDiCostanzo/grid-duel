import {
  applyMove,
  createGame,
  createRng,
  view as viewOf,
  type BoardSize,
  type GameState,
  type GameView,
  type Move,
} from '@game/engine';
import { computed, shallowRef } from 'vue';
import { thinkingDelay, type BotLevel } from './bots';
import type { BotRunner } from './runners';

export type Settings = { boardSize: BoardSize; level: BotLevel };

export type RoundSummary = {
  round: number;
  outcome: 'won' | 'lost' | 'drawn';
  points: readonly [you: number, opponent: number];
};

export type MatchResult = {
  outcome: 'won' | 'lost';
  wins: readonly [you: number, opponent: number];
};

export type SoloMatchOptions = {
  runner: BotRunner;
  newSeed?: () => string;
  wait?: (ms: number) => Promise<void>;
  delay?: (rng: { nextInt(max: number): number }) => number;
};

const HUMAN = 0;
const BOT = 1;
const SEED_DIGITS = 32;
const HEX = 16;

const randomSeed = (): string =>
  Array.from(crypto.getRandomValues(new Uint8Array(SEED_DIGITS / 2)), (byte) =>
    byte.toString(HEX).padStart(2, '0'),
  ).join('');

const seedFrom = (rng: { nextInt(max: number): number }): string =>
  Array.from({ length: SEED_DIGITS }, () =>
    rng.nextInt(HEX).toString(HEX),
  ).join('');

export function useSoloMatch(options: SoloMatchOptions) {
  const {
    runner,
    newSeed = randomSeed,
    wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    delay = thinkingDelay,
  } = options;

  const game = shallowRef<GameState | null>(null);
  const settings = shallowRef<Settings | null>(null);
  const thinking = shallowRef(false);
  const summary = shallowRef<RoundSummary | null>(null);
  const error = shallowRef<Error | null>(null);
  let generation = 0;
  let botRng = createRng(randomSeed());

  const view = computed<GameView | null>(() =>
    game.value === null ? null : viewOf(game.value, HUMAN),
  );

  const phase = computed(() => {
    if (game.value === null) return 'idle';
    if (summary.value !== null) return 'round-end';
    return game.value.winner === null ? 'playing' : 'over';
  });

  const result = computed<MatchResult | null>(() =>
    phase.value !== 'over' || view.value === null
      ? null
      : {
          outcome: view.value.winner === HUMAN ? 'won' : 'lost',
          wins: view.value.wins,
        },
  );

  function apply(player: 0 | 1, move: Move): void {
    const current = game.value as GameState;
    const outcome = applyMove(current, player, move);
    game.value = outcome.state;
    const ended = outcome.events.find((event) => event.type === 'round-ended');
    if (ended?.type === 'round-ended') {
      summary.value = {
        round: outcome.state.results.length,
        outcome:
          ended.winner === 'draw'
            ? 'drawn'
            : ended.winner === HUMAN
              ? 'won'
              : 'lost',
        points: [ended.points[HUMAN], ended.points[BOT]],
      };
    }
  }

  async function runBot(token: number): Promise<void> {
    const isBotTurn = () =>
      token === generation &&
      game.value !== null &&
      game.value.winner === null &&
      summary.value === null &&
      game.value.round.currentPlayer === BOT;
    try {
      while (isBotTurn()) {
        thinking.value = true;
        await wait(delay(botRng));
        if (token !== generation) return;
        const current = game.value as GameState;
        const move = await runner.choose({
          level: (settings.value as Settings).level,
          view: viewOf(current, BOT),
          seed: seedFrom(botRng),
        });
        if (token !== generation) return;
        apply(BOT, move);
      }
      thinking.value = false;
    } catch (failure) {
      if (token === generation) {
        error.value =
          failure instanceof Error ? failure : new Error(String(failure));
        thinking.value = false;
      }
    }
  }

  function start(chosen: Settings): void {
    generation++;
    settings.value = chosen;
    error.value = null;
    summary.value = null;
    thinking.value = false;
    game.value = createGame({ seed: newSeed(), boardSize: chosen.boardSize });
    botRng = createRng(newSeed());
    void runBot(generation);
  }

  function play(move: Move): void {
    if (
      game.value === null ||
      summary.value !== null ||
      game.value.round.currentPlayer !== HUMAN
    ) {
      throw new Error('It is not your turn');
    }
    apply(HUMAN, move);
    void runBot(generation);
  }

  function nextRound(): void {
    if (summary.value === null) {
      throw new Error('The round is not over');
    }
    summary.value = null;
    void runBot(generation);
  }

  function restart(): void {
    generation++;
    game.value = null;
    settings.value = null;
    summary.value = null;
    thinking.value = false;
    error.value = null;
  }

  return {
    phase,
    view,
    settings,
    thinking,
    summary,
    result,
    error,
    start,
    play,
    nextRound,
    restart,
  };
}
