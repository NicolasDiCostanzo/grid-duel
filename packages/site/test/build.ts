import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

export default function setup(): void {
  execFileSync('npx', ['astro', 'build'], {
    cwd: join(import.meta.dirname, '..'),
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
    stdio: 'pipe',
  });
}
