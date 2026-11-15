import * as pieces from '../fixtures/pieces';

const names = new Map(Object.entries(pieces).map(([name, id]) => [id, name]));

export const pieceLabel = (entry: string): string =>
  entry.startsWith('~')
    ? `~${pieceLabel(entry.slice(1))}`
    : (names.get(entry) ?? entry);
