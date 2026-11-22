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
  let broken: Error | null = null;
  const failAll = (message: string) => {
    broken = new Error(message);
    for (const waiting of pending.values()) {
      waiting.reject(broken);
    }
    pending.clear();
  };
  worker.addEventListener('error', (event) =>
    failAll(event.message || 'The bot worker failed'),
  );
  worker.addEventListener('messageerror', () =>
    failAll('The bot worker sent an unreadable answer'),
  );
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
        if (broken !== null) {
          reject(broken);
          return;
        }
        const id = nextId++;
        pending.set(id, { resolve, reject });
        try {
          worker.postMessage({ id, request });
        } catch (failure) {
          pending.delete(id);
          reject(
            failure instanceof Error ? failure : new Error(String(failure)),
          );
        }
      }),
  };
}
