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
| `npm run dev`      | Not wired yet (epic 1.10, client)                       |
| `npm run simulate` | Not wired yet (epic 1.9, simulation tool)               |
| `npm run deploy`   | Not wired yet (epic 1.13, deployment)                   |

Continuous integration (`.github/workflows/ci.yml`) runs the format check, lint and tests on every pull request and on every push to `main`.

## Packages

`packages/engine`, `packages/bot`, `packages/simulate` and `packages/client`, named under the neutral scope `@game` (they are private and not published). They are empty shells for now.

## Tooling choices

| Tool            | Choice                                         | Reason                                                                                                                                                                           |
| --------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript      | `~6.0.3`                                       | The latest release is 7.0.x, but `typescript-eslint` 8.72 declares support only for versions below 6.1.0. Moving to 7 is a dependency bump once `typescript-eslint` supports it. |
| Tests           | Vitest 5, one root config                      | One run covers every package. The root config switches to Vitest projects when the client needs a browser-like environment (epic 1.10).                                          |
| Lint and format | ESLint 10 with `typescript-eslint`, Prettier 3 | ESLint covers code problems and Prettier covers layout, so no config is needed to keep them apart.                                                                               |
| Type check      | `tsc` in each package, strict mode             | Shared options live in `tsconfig.base.json`.                                                                                                                                     |

The direct dependencies are MIT (all except TypeScript) or Apache-2.0 (TypeScript). The installed tree, which is development tooling only and not shipped, also contains BSD-2-Clause, BSD-3-Clause, ISC, MPL-2.0 (`lightningcss`, pulled in by Vite) and BlueOak-1.0.0 (`minimatch`). The licence of every runtime dependency is checked when it is added.
