import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

export const distDir = join(import.meta.dirname, '..', 'dist');

export const readBuilt = (path: string): string =>
  readFileSync(join(distDir, path), 'utf8');

export const builtFiles = (dir: string = distDir): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? builtFiles(path) : [relative(distDir, path)];
  });

const ENTITIES: Readonly<Record<string, string>> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
};

export const textOf = (html: string): string =>
  html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(
      /&(?:amp|lt|gt|quot|#39|#x27);/g,
      (entity) => ENTITIES[entity] ?? entity,
    )
    .replace(/\s+/g, ' ')
    .trim();

export const tagText = (html: string, tag: string): string[] =>
  [
    ...html
      .replace(/<template[\s\S]*?<\/template>/g, '')
      .matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'g')),
  ].map((match) => textOf(match[1] ?? ''));
