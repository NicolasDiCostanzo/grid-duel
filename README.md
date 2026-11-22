# grid-duel

A free two-player web board game. The project plan is in [docs/reference/PLAN.md](docs/reference/PLAN.md); the rules we implement are in [docs/reference/flockade-rules.md](docs/reference/flockade-rules.md) and [RULES.md](RULES.md).

`grid-duel` is a neutral working name for this repository. It is not the product name and must not appear in code, package names or anything a player sees.

## Commands

Requires Node 24 (see `.nvmrc`) and npm.

| Command            | What it does                                            |
| ------------------ | ------------------------------------------------------- |
| `npm install`      | Install all workspace dependencies                      |
| `npm test`         | Run the Vitest tests of every package                   |
| `npm run lint`     | ESLint, then the TypeScript type check of every package |
| `npm run format`   | Format the repository with Prettier                     |
| `npm run dev`      | Start the client with the Vite dev server               |
| `npm run build`    | Build the static site (home page and the game)          |
| `npm run test:e2e` | Play whole solo matches in Chrome with Playwright       |
| `npm run simulate` | Play seeded bot games and write the balance report      |
| `npm run deploy`   | Not wired yet (epic 1.13, deployment)                   |

Continuous integration (`.github/workflows/ci.yml`) runs the format check, lint and tests on every pull request and on every push to `main`.

Git hooks live in `.githooks/` and `npm install` enables them: `pre-commit` checks the formatting of staged files, `pre-push` refuses a dirty working tree, then runs the same checks as CI. `npm install` leaves an existing `core.hooksPath` unchanged. `git commit --no-verify` and `git push --no-verify` skip them; CI and the ruleset on `main` stay the real gate.

## Packages

`packages/engine`, `packages/bot`, `packages/simulate` and `packages/client`, named under the neutral scope `@game` (they are private and not published). `engine` is the rules, `bot` the three bot levels, `simulate` the balance report, `client` the game app and `site` the Astro site that serves the pages and embeds the game.

## Client

`packages/client` is a Vite 8 and Vue 3.5 app (Composition API, `<script setup lang="ts">`). `npm run dev` starts it; `npm run build -w @game/client` builds it. A person plays a solo match against the easy, medium or hard bot on the 2x2 or 2x3 board. The engine runs in the browser and the bots run in a Web Worker, so the hard bot never freezes the interface; each bot move is delayed by 500 to 1199 ms so it feels human.

Choices and why:

- **Text:** every displayed name, the product name included, comes from `src/i18n/en.ts` through `vue-i18n` (MIT), which handles plurals; the pieces, blessings and Keepers have working names that are not the original's words, and a test fails if one of the original words appears.
- **Look:** colours, fonts and spacing are CSS custom properties in `src/styles/tokens.css` with light and dark values, and a test fails if a colour is hard-coded elsewhere. Every shape is a named asset in `src/assets/manifest.ts`, so a full set can be swapped. Pieces differ by shape (circle, square, triangle, diamond), not only by colour.
- **Component tests:** Vitest with Vue Test Utils and happy-dom, one file per component, plus a test of the match flow for every level on both board sizes.
- **End-to-end test:** Playwright (Apache-2.0) drives the built app in the Google Chrome that is already installed, so no browser is downloaded; GitHub's Ubuntu runners include Chrome. `npm run test:e2e` plays whole matches (2x2 against easy, 2x3 against medium and against hard) at 360 px and at 1280 px width and checks that the page never scrolls sideways. It runs in CI and not in `npm test`, because it needs a browser and a build.
- **Type check and lint:** `vue-tsc` checks the `.vue` files and `eslint-plugin-vue` lints them (its layout rules are off, Prettier formats).

Not in this epic: labels that explain each effect, animations and sound (1.11), the reskin test (1.12), deployment (1.13). The 360 px layout was checked in Chrome with a viewport of that width; no real phone was available.

## Site

`packages/site` is an Astro 7 site (static HTML, no adapter) with the Vue integration. `npm run build` writes it to `packages/site/dist`; `npm run dev -w @game/site` serves it while you work.

- **Pages** live in one folder per locale, `src/pages/en/` for now, and `/` redirects to `/en/`. A header and a footer are shared by every page, and the footer carries the non-affiliation line.
- **Text:** the product name and every game name come from the game's translation file (`packages/client/src/i18n/en.ts`); the site's own text is in `packages/site/src/i18n/en.ts`. A test fails if a page, layout or component hard-codes the product name or the footer line. The layout imports the game's design tokens.
- **The game** is a client-only Vue island on `/en/play/` (`src/components/SoloGame.vue`). `src/vue-app.ts` installs `vue-i18n` on it. The island needs JavaScript; the page says so in a `<noscript>` and keeps its heading in the HTML. The host page owns the `<main>` landmark, so the game's root is a `div`.
- **Tests:** Vitest builds the site once (`test/build.ts`) and checks the built HTML, for example that the home page text is in the HTML without running JavaScript. `npm run test:e2e` also plays a whole match from the site's home page, served from `dist/` by a 40-line static server (`e2e/serve.mjs`): under Playwright, `astro preview` detaches into the background and Playwright takes it for a crash.
- `SITE_URL` sets the site address used for canonical URLs (default `http://localhost:4321`). Astro sends anonymous usage data unless `ASTRO_TELEMETRY_DISABLED=1` is set or `astro telemetry disable` was run; the test build sets it.
- Deployment is not wired yet (epic 1.13): the site builds, and publishing it is part of that epic.

## Simulation and balance report

`npm run simulate -- [options]` plays seeded games between the bot levels and writes `reports/balance-report.md` and `reports/balance-report.json` (the `reports/` folder is not committed; a baseline report is kept in `docs/reports/`). Run it before any rules or balance change ships. It exits with 1 if the ordering hard > medium > easy does not hold and with 2 on a usage error. The same seed gives the same report.

| Option                   | Default                | Meaning                                                               |
| ------------------------ | ---------------------- | --------------------------------------------------------------------- |
| `--games N`              | 100                    | Games per pairing of two levels (seats alternate, same deals)         |
| `--analysis-games N`     | 1000                   | Games of the analysis level against itself, for the two tables below  |
| `--levels a,b`           | `easy,medium,hard`     | Levels to pair (at least two different ones)                          |
| `--board 2x2\|2x3\|both` | `both`                 | Board size                                                            |
| `--seed N`               | 1                      | Seed of every deal and of the bots (positive integer, at most 2^53-1) |
| `--analysis-level LEVEL` | `easy`                 | Level used for the first player and blessing analysis                 |
| `--hard-rollouts N`      | the hard bot's default | Rollout budget of the hard bot (lower it for a quick run)             |
| `--out DIR`              | `reports`              | Output folder                                                         |

The report has, per board size: the win rate of each stronger level over each weaker one with a 95% Wilson interval; the first player advantage (share of decided rounds won by the player who goes first, in games of the analysis level against itself); the impact of each blessing (the round score of a player who placed a piece with the blessing against the other rounds, with a standard error; a difference is flagged when it is at least 5 points and more than two standard errors); the luck of the offers and the draws (how often the weaker level still wins the match, and the share of drawn rounds); and a list of findings for the rules owner. The analysis uses the easy level by default because random play places each blessing approximately independently of the situation (a forced Scout or a Lone-limited offer are the exceptions), so the comparison is not biased by smart choices. A finding is a lead for the rules owner, never a rule change: `RULES.md` is changed only on the owner's decision.

`tsx` (MIT, development only) runs the command line, because Node 24 strips types but does not resolve the extensionless imports of the workspace packages.

## Bots

A bot is a pure function `(view, rng) => move` in `packages/bot`. It receives only the `GameView` of its player (own deck and offer, both boards, the legal `moves`) and an injected random generator, so it cannot read hidden data and gives the same move for the same view and seed.

| Level  | How it chooses                                                                                                                                                                                                                        |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Easy   | A random legal move.                                                                                                                                                                                                                  |
| Medium | Among the legal moves, those where its own board piece beats the opposing board piece at that cell, by type only (blessings are ignored); a random one of them, or a random legal move if none wins. A Scout counts for the opponent. |
| Hard   | Sampled search: for every legal move it plays the rest of the round many times with the engine and plays the move that wins the round most often (a draw counts for half).                                                            |

Measured on 1000 seeded games per board size with alternating seats (epic 1.7): medium beats easy 66.9% of the time on 2x2 and 70.0% on 2x3. The test requires at least 58%.

### Hard bot

The hard bot cannot read the opponent's deck or offers, and the rest of the round is random (the Trickster, the offers) and full of effects whose order matters. Instead of re-implementing the rules, it asks the engine: `sampleRound(view, move, source)` plays the move, deals the cards it cannot see at random (the 36 pieces minus those visible on the opponent's board), finishes the round with random legal moves and resolves the effects and duels with the real engine. For each legal move the bot runs the same set of random deals (so moves are compared on equal terms), scores a round win as 1 and a draw as 0.5, and plays one of the best moves.

- The budget is a number of rollouts, not a duration, so the same view and seed always give the same move. `rollouts` (800 by default) is a total that is split evenly between the legal moves and rounded down, with at least 1 and at most 200 rollouts per move. The total therefore stays at or below `rollouts`, except when there are more legal moves than rollouts (each move still gets 1), and with few legal moves the cap applies: 3 legal moves get 200 each, 600 in all, not 800. A single legal move is played without any rollout. The worst move measured here takes about 100 ms (2x2) and 120 ms (2x3). A mid-range phone cannot be measured from this machine; the budget is a constructor option (`createHardBot({ rollouts })`) if the client needs to lower it.
- Known limits: the unseen pool ignores pieces removed by a Scout, the bot plays each round to win it without looking at the match score, and the rollouts assume random play by both sides, so it may underrate a strong opponent.
- Measured on seeded games with alternating seats: with a budget of 200 rollouts the hard bot beats medium in 86.7% of 60 games on 2x2 and 91.7% on 2x3; with the default budget 93.3% and 90.0% (60 games) and 100% against easy (40 games). The test requires at least 75% against medium with the reduced budget, which keeps it fast.

## Tooling choices

| Tool            | Choice                                         | Reason                                                                                                                                                                           |
| --------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript      | `~6.0.3`                                       | The latest release is 7.0.x, but `typescript-eslint` 8.72 declares support only for versions below 6.1.0. Moving to 7 is a dependency bump once `typescript-eslint` supports it. |
| Tests           | Vitest 5, one root config with projects        | One run covers every package: Node for the engine, bots and simulation, happy-dom for the client.                                                                                |
| Lint and format | ESLint 10 with `typescript-eslint`, Prettier 3 | ESLint covers code problems and Prettier covers layout, so no config is needed to keep them apart.                                                                               |
| Type check      | `tsc` in each package, strict mode             | Shared options live in `tsconfig.base.json`.                                                                                                                                     |
| Random tests    | Own seeded loop, no library                    | A failure reproduces from its seed and no dependency is needed. Upgrade path: `fast-check` (MIT), which shrinks a failing sequence.                                              |

The direct dependencies are MIT (all except TypeScript) or Apache-2.0 (TypeScript). The installed tree, which is development tooling only and not shipped, also contains BSD-2-Clause, BSD-3-Clause, ISC, MPL-2.0 (`lightningcss`, pulled in by Vite) and BlueOak-1.0.0 (`minimatch`). The licence of every runtime dependency is checked when it is added.
