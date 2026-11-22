import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { en as game } from '@game/client/src/i18n/en';
import { describe, expect, it } from 'vitest';
import { builtFiles, readBuilt, tagText, textOf } from '../test/built';
import { contentPages, sourceFolders } from '../test/fixtures/pages';
import { t } from './i18n';

const siteDir = join(import.meta.dirname, '..');

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? sourceFiles(path) : [path];
  });

describe('the home page', () => {
  const html = readBuilt('en/index.html');

  it('has the product name from the game translations as its only h1', () => {
    expect(tagText(html, 'h1')).toEqual([game.product.name]);
  });

  it('says what the game is without running any JavaScript', () => {
    expect(textOf(html)).toContain(t('home.lead'));
  });

  it('declares its language', () => {
    expect(html).toMatch(/<html[^>]*lang="en"/);
  });
});

describe.each(contentPages)('the shared layout of %s', (page) => {
  const html = readBuilt(page);

  it('has the non-affiliation line in its footer', () => {
    const [footer] = tagText(html, 'footer');
    expect(footer).toContain(t('footer.nonAffiliation'));
  });

  it('has a header that links to the home page', () => {
    const [header] = html.match(/<header[\s\S]*?<\/header>/) ?? [''];
    expect(header).toContain('href="/en/"');
  });

  it('takes its design tokens from the game', () => {
    const css = [
      html,
      ...builtFiles()
        .filter((file) => file.endsWith('.css'))
        .map((file) => readBuilt(file)),
    ].join('\n');
    expect(css).toContain('--color-bg');
    expect(css).toContain('prefers-color-scheme:dark');
  });
});

describe('the locale structure', () => {
  it('keeps every page in a folder per locale, only the root redirects', () => {
    const pages = builtFiles().filter((file) => file.endsWith('.html'));
    for (const page of pages) {
      expect(page === 'index.html' || page.startsWith('en/')).toBe(true);
    }
  });

  it('sends the root to the English home page', () => {
    const root = readBuilt('index.html');
    expect(root).toContain('http-equiv="refresh"');
    expect(root).toContain('/en/');
  });
});

describe('the source', () => {
  it('does not hard-code the product name in a page, a layout or a component', () => {
    const offenders = sourceFolders
      .flatMap((folder) => sourceFiles(join(siteDir, folder)))
      .filter((file) => readFileSync(file, 'utf8').includes(game.product.name));
    expect(offenders).toEqual([]);
  });

  it('does not hard-code the non-affiliation line outside the translations', () => {
    const offenders = sourceFolders
      .flatMap((folder) => sourceFiles(join(siteDir, folder)))
      .filter((file) => readFileSync(file, 'utf8').includes('Massive Monster'));
    expect(offenders).toEqual([]);
  });
});
