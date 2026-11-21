import { handleBotRequest, type BotRequest } from './bots';

type Incoming = { id: number; request: BotRequest };

const scope = self as unknown as {
  postMessage(message: unknown): void;
  addEventListener(
    type: 'message',
    listener: (event: MessageEvent<Incoming>) => void,
  ): void;
};

scope.addEventListener('message', ({ data }) => {
  try {
    scope.postMessage({ id: data.id, move: handleBotRequest(data.request) });
  } catch (error) {
    scope.postMessage({
      id: data.id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
