import type { BoardSize } from '@game/engine';
import type { BotLevel } from '../../src/solo/bots';

export const hexSeed = (index: number): string =>
  index.toString(16).padStart(32, '0');

export const levels: readonly BotLevel[] = ['easy', 'medium', 'hard'];
export const boardSizes: readonly BoardSize[] = ['2x2', '2x3'];
export const hardRollouts = 10;
export const maxSteps = 2000;
