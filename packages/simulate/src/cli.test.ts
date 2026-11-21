import { describe, expect, it } from 'vitest';
import {
  defaults,
  parseCases,
  smallRun,
  usageErrors,
} from '../test/fixtures/cli';
import { report } from '../test/fixtures/report';
import { parseArgs, runCli, type CliIo } from './cli';

const fakeIo = () => {
  const files = new Map<string, string>();
  const messages: string[] = [];
  const errors: string[] = [];
  const io: CliIo = {
    writeFile: (path, content) => void files.set(path, content),
    log: (message) => void messages.push(message),
    error: (message) => void errors.push(message),
  };
  return { io, files, messages, errors };
};

describe('parseArgs', () => {
  it.each(parseCases)('$name', ({ args, expected }) => {
    expect(parseArgs(args)).toEqual({
      ok: true,
      options: { ...defaults, ...expected },
    });
  });

  it.each(usageErrors)('rejects %s', (_name, args) => {
    const result = parseArgs(args);
    expect(result.ok).toBe(false);
  });
});

describe('runCli', () => {
  it('writes the Markdown and the JSON report and prints where', async () => {
    const { io, files, messages } = fakeIo();
    await runCli(smallRun, io);
    expect([...files.keys()].toSorted()).toEqual([
      'out/balance-report.json',
      'out/balance-report.md',
    ]);
    expect(files.get('out/balance-report.md')).toMatch(/^# Balance report/);
    expect(
      JSON.parse(files.get('out/balance-report.json') ?? '').options,
    ).toMatchObject({
      games: 4,
      seed: 1,
    });
    expect(messages.join('\n')).toContain('out/balance-report.md');
  });

  it('is reproducible from the seed', async () => {
    const first = fakeIo();
    const second = fakeIo();
    await runCli(smallRun, first.io);
    await runCli(smallRun, second.io);
    expect(second.files).toEqual(first.files);
  });

  it('exits with 0 when the ordering holds', async () => {
    const { io } = fakeIo();
    expect(await runCli(smallRun, io, () => report)).toBe(0);
  });

  it('exits with 1 and says why when the ordering does not hold', async () => {
    const { io, errors } = fakeIo();
    const failing = { ...report, orderingHolds: false };
    expect(await runCli(smallRun, io, () => failing)).toBe(1);
    expect(errors.join('\n')).toContain('ordering');
  });

  it('exits with 2 and writes nothing on a usage error', async () => {
    const { io, files, errors } = fakeIo();
    expect(await runCli(['--games', '0'], io)).toBe(2);
    expect(files.size).toBe(0);
    expect(errors.length).toBeGreaterThan(0);
  });
});
