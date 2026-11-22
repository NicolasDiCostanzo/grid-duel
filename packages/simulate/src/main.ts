import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { runCli } from './cli';

const base = process.env.INIT_CWD ?? process.cwd();

process.exitCode = runCli(process.argv.slice(2), {
  writeFile(path, content) {
    const file = resolve(base, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  },
  log: (message) => console.log(message),
  error: (message) => console.error(message),
});
