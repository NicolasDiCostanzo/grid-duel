import {
  createHardBot,
  easyBot,
  hardBot,
  mediumBot,
  type Bot,
} from '@game/bot';
import { createRng, type GameView, type Move } from '@game/engine';

export type BotLevel = 'easy' | 'medium' | 'hard';

export type BotRequest = {
  level: BotLevel;
  view: GameView;
  seed: string;
  hardRollouts?: number;
};

const MIN_DELAY_MS = 500;
const DELAY_SPREAD_MS = 700;

export function botFor(level: BotLevel, hardRollouts?: number): Bot {
  if (level === 'easy') {
    return easyBot;
  }
  if (level === 'medium') {
    return mediumBot;
  }
  return hardRollouts === undefined
    ? hardBot
    : createHardBot({ rollouts: hardRollouts });
}

export const thinkingDelay = (rng: { nextInt(max: number): number }): number =>
  MIN_DELAY_MS + rng.nextInt(DELAY_SPREAD_MS);

export const handleBotRequest = (request: BotRequest): Move =>
  botFor(request.level, request.hardRollouts)(
    request.view,
    createRng(request.seed),
  );
