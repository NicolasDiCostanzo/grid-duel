import { expect, it } from 'vitest';
import * as entry from './index';

it('loads the package entry point', () => {
  expect(entry).toBeDefined();
});
