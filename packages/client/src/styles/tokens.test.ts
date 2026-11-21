import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const srcDir = join(import.meta.dirname, '..');
const tokens = readFileSync(join(srcDir, 'styles/tokens.css'), 'utf8');
const [light = '', dark = ''] = tokens.split(
  '@media (prefers-color-scheme: dark)',
);

const names = (css: string, prefix: string) =>
  [...css.matchAll(new RegExp(`--(${prefix}[a-z-]*):`, 'g'))].map(
    (match) => match[1],
  );

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : [path];
  });

describe('the design tokens', () => {
  it('give every colour a light and a dark value', () => {
    const colours = names(light, 'color-');
    expect(colours.length).toBeGreaterThan(10);
    expect(names(dark, 'color-').toSorted()).toEqual(colours.toSorted());
  });

  it('are the only place with a hard-coded colour', () => {
    const offenders = sourceFiles(srcDir)
      .filter((file) => /\.(vue|css|ts)$/.test(file))
      .filter(
        (file) => !file.endsWith('tokens.css') && !file.endsWith('.test.ts'),
      )
      .filter((file) =>
        /#[0-9a-fA-F]{3,8}\b|\b(rgb|hsl)a?\(/.test(readFileSync(file, 'utf8')),
      )
      .map((file) => relative(srcDir, file));
    expect(offenders).toEqual([]);
  });
});
