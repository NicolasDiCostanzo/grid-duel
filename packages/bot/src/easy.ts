import { pickMove } from './pick';
import type { Bot } from './types';

export const easyBot: Bot = (view, rng) => pickMove(view.moves, rng);
