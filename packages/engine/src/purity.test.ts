import { ESLint } from 'eslint';
import { expect, it } from 'vitest';

it('forbids Math.random in the engine sources', async () => {
  const eslint = new ESLint();
  const [result] = await eslint.lintText('export const x = Math.random();\n', {
    filePath: 'packages/engine/src/example.ts',
  });
  expect(result?.messages.map((message) => message.ruleId)).toContain(
    'no-restricted-properties',
  );
});
