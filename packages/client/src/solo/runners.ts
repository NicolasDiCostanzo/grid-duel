import type { Move } from '@game/engine';
import { handleBotRequest, type BotRequest } from './bots';

export interface BotRunner {
  choose(request: BotRequest): Promise<Move>;
}

export const createInlineBotRunner = (
  options: { hardRollouts?: number } = {},
): BotRunner => ({
  choose: (request) =>
    Promise.resolve(
      handleBotRequest({ ...request, hardRollouts: options.hardRollouts }),
    ),
});

type Answer = { id: number; move?: Move; error?: string };

export function createWorkerBotRunner(): BotRunner {
  const worker = new Worker(new URL('./bot.worker.ts', import.meta.url), {
    type: 'module',
  });
  const pending = new Map<
    number,
    { resolve(move: Move): void; reject(error: Error): void }
  >();
  let nextId = 0;
  worker.addEventListener('message', ({ data }: MessageEvent<Answer>) => {
    const waiting = pending.get(data.id);
    pending.delete(data.id);
    if (data.move !== undefined) {
      waiting?.resolve(data.move);
    } else {
      waiting?.reject(new Error(data.error ?? 'The bot failed'));
    }
  });
  return {
    choose: (request) =>
      new Promise<Move>((resolve, reject) => {
        const id = nextId++;
        pending.set(id, { resolve, reject });
        worker.postMessage({ id, request });
      }),
  };
}
