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

  it.each(usageErrors)('rejects %s', (_name, args, flag) => {
    const result = parseArgs(args);
    expect(result.ok).toBe(false);
    const problem = result.ok ? '' : (result.message.split('\n')[0] ?? '');
    expect(problem).toContain(flag);
  });

  it('shows the usage for --help without calling it a mistake', () => {
    const result = parseArgs(['--help']);
    expect(result).toMatchObject({ ok: false, help: true });
    expect(result.ok ? '' : result.message).toContain('Usage');
  });

  it('accepts a seed of any size that is still exact', () => {
    expect(parseArgs(['--seed', '9007199254740991'])).toMatchObject({
      ok: true,
      options: { seed: 9007199254740991 },
    });
  });

  it('accepts any text as the output folder', () => {
    expect(parseArgs(['--out', 'some/-odd folder'])).toMatchObject({
      ok: true,
      options: { out: 'some/-odd folder' },
    });
  });
});

describe('runCli', () => {
  it('writes the Markdown and the JSON report and prints where', () => {
    const { io, files, messages } = fakeIo();
    runCli(smallRun, io);
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

  it('is reproducible from the seed', () => {
    const first = fakeIo();
    const second = fakeIo();
    runCli(smallRun, first.io);
    runCli(smallRun, second.io);
    expect(second.files).toEqual(first.files);
  });

  it('exits with 0 when the ordering holds', () => {
    const { io } = fakeIo();
    expect(runCli(smallRun, io, () => report)).toBe(0);
  });

  it('exits with 1 and says why when the ordering does not hold', () => {
    const { io, errors } = fakeIo();
    const failing = { ...report, orderingHolds: false };
    expect(runCli(smallRun, io, () => failing)).toBe(1);
    expect(errors.join('\n')).toContain('ordering');
  });

  it('prints the usage and exits with 0 for --help, writing nothing', () => {
    const { io, files, messages } = fakeIo();
    expect(runCli(['--help'], io)).toBe(0);
    expect(files.size).toBe(0);
    expect(messages.join('\n')).toContain('Usage');
  });

  it('exits with 2 and writes nothing on a usage error', () => {
    const { io, files, errors } = fakeIo();
    expect(runCli(['--games', '0'], io)).toBe(2);
    expect(files.size).toBe(0);
    expect(errors.length).toBeGreaterThan(0);
  });
});
