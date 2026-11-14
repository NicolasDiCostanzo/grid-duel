export type RngState = readonly [number, number, number, number];

export type Rng = {
  nextFloat(): number;
  nextInt(max: number): number;
  snapshot(): RngState;
};

const SEED_PATTERN = /^[0-9a-f]{32}$/;
const WARM_UP_ROUNDS = 15;

export function restoreRng(state: RngState): Rng {
  let [a, b, c, d] = state;

  const nextFloat = () => {
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };

  return {
    nextFloat,
    nextInt(max) {
      if (!Number.isInteger(max) || max < 1) {
        throw new Error(`nextInt needs a positive integer, got ${max}`);
      }
      return Math.floor(nextFloat() * max);
    },
    snapshot: () => [a >>> 0, b >>> 0, c >>> 0, d >>> 0],
  };
}

export function createRng(seed: string): Rng {
  if (!SEED_PATTERN.test(seed)) {
    throw new Error('A seed is 32 lowercase hexadecimal characters');
  }
  const [a, b, c, d] = [0, 8, 16, 24].map((start) =>
    parseInt(seed.slice(start, start + 8), 16),
  );
  const rng = restoreRng([a ?? 0, b ?? 0, c ?? 0, d ?? 0]);
  for (let round = 0; round < WARM_UP_ROUNDS; round++) {
    rng.nextFloat();
  }
  return rng;
}
