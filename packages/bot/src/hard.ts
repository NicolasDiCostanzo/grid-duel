import { createRng, sampleRound, type SampledRound } from '@game/engine';
import { pickMove } from './pick';
import type { Bot, BotRng } from './types';

const SEED_DIGITS = 32;
const HEX = 16;
const MAX_ROLLOUTS_PER_MOVE = 200;
const DEFAULT_ROLLOUTS = 800;

const seedFrom = (rng: BotRng): string =>
  Array.from({ length: SEED_DIGITS }, () =>
    rng.nextInt(HEX).toString(HEX),
  ).join('');

const valueFor = (outcome: SampledRound, player: 0 | 1): number => {
  if (outcome.winner === 'draw') {
    return 0.5;
  }
  return outcome.winner === player ? 1 : 0;
};

export function createHardBot(options: { rollouts: number }): Bot {
  return (view, rng) => {
    const { moves } = view;
    if (moves.length <= 1) {
      return pickMove(moves, rng);
    }
    const perMove = Math.min(
      MAX_ROLLOUTS_PER_MOVE,
      Math.max(1, Math.floor(options.rollouts / moves.length)),
    );
    const seeds = Array.from({ length: perMove }, () => seedFrom(rng));
    const scored = moves.map((move) => ({
      move,
      value: seeds.reduce(
        (sum, seed) =>
          sum + valueFor(sampleRound(view, move, createRng(seed)), view.player),
        0,
      ),
    }));
    const best = Math.max(...scored.map(({ value }) => value));
    return pickMove(
      scored.filter(({ value }) => value === best).map(({ move }) => move),
      rng,
    );
  };
}

export const hardBot = createHardBot({ rollouts: DEFAULT_ROLLOUTS });
