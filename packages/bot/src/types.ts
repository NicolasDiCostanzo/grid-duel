import type { GameView, Move } from '@game/engine';

export type BotRng = { nextInt(max: number): number };

export type Bot = (view: GameView, rng: BotRng) => Move;
