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

  it('has a header that links to the home page and to the game', () => {
    const [header] = html.match(/<header[\s\S]*?<\/header>/) ?? [''];
    expect(header).toContain('href="/en/"');
    expect(header).toContain('href="/en/play/"');
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

describe('the game page', () => {
  const html = readBuilt('en/play/index.html');

  it('embeds the game as a client-only Vue island', () => {
    expect(html).toContain('<astro-island');
    expect(html).toMatch(/client="only"/);
    expect(html).toMatch(/renderer-url=/);
  });

  it('has one landmark and one h1 before any JavaScript runs', () => {
    expect(tagText(html, 'main')).toHaveLength(1);
    expect(tagText(html, 'h1')).toEqual([game.product.name]);
  });

  it('tells a visitor without JavaScript that the game needs it', () => {
    expect(tagText(html, 'noscript').join(' ')).toContain(t('play.noscript'));
  });

  it('ships the bot worker so the hard bot stays off the main thread', () => {
    expect(builtFiles().some((file) => /bot\.worker.*\.js$/.test(file))).toBe(
      true,
    );
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
