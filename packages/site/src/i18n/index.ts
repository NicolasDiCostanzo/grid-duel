import { en as game } from '@game/client/src/i18n/en';
import { site } from './en';

const messages = { ...site, game };

type Leaves<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : Leaves<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type MessageKey = Leaves<typeof messages>;

export function t(key: MessageKey): string {
  const value = key
    .split('.')
    .reduce<unknown>(
      (node, part) => (node as Record<string, unknown>)[part],
      messages,
    );
  if (typeof value !== 'string') {
    throw new Error(`No translation for ${key}`);
  }
  return value;
}
