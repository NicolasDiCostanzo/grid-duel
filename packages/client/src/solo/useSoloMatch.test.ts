import { createGame, type Move } from '@game/engine';
import { flushPromises } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import {
  boardSizes,
  hardRollouts,
  hexSeed,
  levels,
  maxSteps,
} from '../../test/fixtures/solo';
import { createInlineBotRunner, type BotRunner } from './runners';
import { useSoloMatch } from './useSoloMatch';

const firstPlayerOf = (seed: string) =>
  createGame({ seed, boardSize: '2x2' }).round.firstPlayer;

const seedWhereFirstPlayerIs = (player: 0 | 1): string => {
  for (let index = 1; index < 200; index++) {
    if (firstPlayerOf(hexSeed(index)) === player) {
      return hexSeed(index);
    }
  }
  throw new Error('No seed found');
};

const newMatch = (options: { runner?: BotRunner; seed?: string } = {}) => {
  const seeds = [options.seed ?? hexSeed(1), hexSeed(500), hexSeed(501)];
  return useSoloMatch({
    runner: options.runner ?? createInlineBotRunner({ hardRollouts }),
    newSeed: () => seeds.shift() ?? hexSeed(777),
    wait: () => Promise.resolve(),
    delay: () => 0,
  });
};

const deferredRunner = () => {
  const pending: ((move: Move) => void)[] = [];
  const failures: ((error: Error) => void)[] = [];
  const inline = createInlineBotRunner({ hardRollouts });
  const runner: BotRunner = {
    choose: (request) =>
      new Promise<Move>((resolve, reject) => {
        pending.push(() => void inline.choose(request).then(resolve));
        failures.push(reject);
      }),
  };
  return {
    runner,
    answer: () => pending.shift()?.({} as Move),
    fail: (e: Error) => failures.shift()?.(e),
  };
};

describe('useSoloMatch', () => {
  it('starts a match from the chosen settings', () => {
    const match = newMatch({ seed: seedWhereFirstPlayerIs(0) });
    expect(match.phase.value).toBe('idle');
    match.start({ boardSize: '2x3', level: 'easy' });
    expect(match.phase.value).toBe('playing');
    expect(match.view.value).toMatchObject({
      boardSize: '2x3',
      player: 0,
      wins: [0, 0],
    });
    expect(match.settings.value).toEqual({ boardSize: '2x3', level: 'easy' });
  });

  it('lets the human play first when the draw says so', async () => {
    const match = newMatch({ seed: seedWhereFirstPlayerIs(0) });
    match.start({ boardSize: '2x2', level: 'easy' });
    await flushPromises();
    expect(match.view.value?.currentPlayer).toBe(0);
    expect(match.view.value?.moves.length).toBeGreaterThan(0);
    expect(match.thinking.value).toBe(false);
  });

  it('lets the bot play first when the draw says so', async () => {
    const match = newMatch({ seed: seedWhereFirstPlayerIs(1) });
    match.start({ boardSize: '2x2', level: 'medium' });
    await flushPromises();
    expect(match.view.value?.currentPlayer).toBe(0);
    expect(match.view.value?.boards[1].filter(Boolean)).toHaveLength(1);
  });

  it('answers a move of the human with a move of the bot', async () => {
    const match = newMatch({ seed: seedWhereFirstPlayerIs(0) });
    match.start({ boardSize: '2x2', level: 'easy' });
    await flushPromises();
    const [move] = match.view.value?.moves ?? [];
    match.play(move as Move);
    await flushPromises();
    expect(match.view.value?.boards[0].filter(Boolean)).toHaveLength(1);
    expect(match.view.value?.boards[1].filter(Boolean)).toHaveLength(1);
    expect(match.view.value?.currentPlayer).toBe(0);
  });

  it('says it is thinking while the bot has not answered', async () => {
    const { runner, answer } = deferredRunner();
    const match = newMatch({ runner, seed: seedWhereFirstPlayerIs(0) });
    match.start({ boardSize: '2x2', level: 'easy' });
    match.play(match.view.value?.moves[0] as Move);
    await flushPromises();
    expect(match.thinking.value).toBe(true);
    answer();
    await flushPromises();
    expect(match.thinking.value).toBe(false);
    expect(match.view.value?.currentPlayer).toBe(0);
  });

  it('refuses a move out of turn and an illegal move', async () => {
    const { runner } = deferredRunner();
    const match = newMatch({ runner, seed: seedWhereFirstPlayerIs(0) });
    match.start({ boardSize: '2x2', level: 'easy' });
    const [move] = match.view.value?.moves ?? [];
    expect(() =>
      match.play({ ...(move as Move), pieceId: 'unknown' }),
    ).toThrow();
    match.play(move as Move);
    await flushPromises();
    expect(() => match.play(move as Move)).toThrow();
  });

  it.each(
    levels.flatMap((level) =>
      boardSizes.map((boardSize) => ({ level, boardSize })),
    ),
  )(
    'plays a whole $boardSize match against the $level bot',
    async (settings) => {
      const match = newMatch({ seed: hexSeed(4) });
      match.start(settings);
      const summaries: string[] = [];
      for (let step = 0; match.phase.value !== 'over'; step++) {
        expect(step).toBeLessThan(maxSteps);
        await flushPromises();
        if (match.phase.value === 'round-end') {
          summaries.push(match.summary.value?.outcome ?? '');
          match.nextRound();
        } else if (match.view.value?.currentPlayer === 0) {
          match.play(match.view.value.moves[0] as Move);
        }
      }
      const results = match.view.value?.results ?? [];
      expect(summaries.length).toBeGreaterThanOrEqual(1);
      expect(summaries.length).toBe(results.length);
      expect(match.result.value?.outcome).toBe(
        match.view.value?.winner === 0 ? 'won' : 'lost',
      );
    },
  );

  it('plays the same match twice from the same seeds', async () => {
    const play = async () => {
      const match = newMatch({ seed: hexSeed(6) });
      match.start({ boardSize: '2x2', level: 'medium' });
      while (match.phase.value !== 'over') {
        await flushPromises();
        if (match.phase.value === 'round-end') match.nextRound();
        else if (match.view.value?.currentPlayer === 0) {
          match.play(match.view.value.moves[0] as Move);
        }
      }
      return match.view.value?.results;
    };
    expect(await play()).toEqual(await play());
  });

  it('refuses to go to the next round when the round is not over', () => {
    const match = newMatch();
    match.start({ boardSize: '2x2', level: 'easy' });
    expect(() => match.nextRound()).toThrow();
  });

  it('forgets a bot answer that comes after a restart', async () => {
    const { runner, answer } = deferredRunner();
    const match = newMatch({ runner, seed: seedWhereFirstPlayerIs(1) });
    match.start({ boardSize: '2x2', level: 'easy' });
    await flushPromises();
    expect(match.thinking.value).toBe(true);
    match.restart();
    expect(match.phase.value).toBe('idle');
    answer();
    await flushPromises();
    expect(match.phase.value).toBe('idle');
    expect(match.view.value).toBeNull();
    expect(match.thinking.value).toBe(false);
  });

  it('reports a bot that fails and stops thinking', async () => {
    const { runner, fail } = deferredRunner();
    const match = newMatch({ runner, seed: seedWhereFirstPlayerIs(1) });
    match.start({ boardSize: '2x2', level: 'hard' });
    await flushPromises();
    fail(new Error('boom'));
    await flushPromises();
    expect(match.error.value?.message).toBe('boom');
    expect(match.thinking.value).toBe(false);
  });
});
