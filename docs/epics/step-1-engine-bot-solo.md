# Roadmap step 1: engine, bot, solo prototype (13 epics)

How to use: copy one epic section (from its `##` heading to the next `---`) into a new Claude session. Each epic names the files to read first. Do the epics in order. Roadmap definition of done for step 1: `docs/reference/PLAN.md` section 11.

---

## Epic 1.1: Workspace and CI

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 1 (engine, bot, solo prototype), epic 1.1 of 13.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 4, 12), RULES.md.
Depends on: nothing. Present a plan for this epic and wait for validation before coding.

### Goal
An empty but working TypeScript monorepo with tests, lint, formatting and CI, so every later epic starts from a green build.

### Behaviours (target for tests and checks)
- npm workspaces with packages `engine`, `bot`, `simulate`, `client` (empty shells). Package and folder names are neutral: never the working name `grid-duel`, never a displayed game name (PLAN section 2).
- TypeScript strict mode with a shared base config.
- `npm test` runs Vitest across every package.
- `npm run lint` (ESLint) and `npm run format` (Prettier).
- A GitHub Actions workflow runs install, lint and `npm test` on every pull request and push to main.
- README.md lists the commands (`npm install`, `npm run dev`, `npm test`, `npm run simulate`, `npm run deploy`; mark those not yet wired) and records each tooling choice with its reason.

### Done when
`npm install && npm test && npm run lint` pass locally with one trivial test per package, and the CI workflow runs the same commands.

### Out of scope
Game logic, Vite/Vue setup (1.10), deployment (1.13).

### Notes
Verify tool versions and config keys in the official docs, do not guess. Dependencies must be maintained and AGPL-3.0 compatible (MIT, BSD, Apache-2.0, LGPL, GPL).

---

## Epic 1.2: Engine - catalog, RNG, deck

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 1, epic 1.2 of 13.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 3, 8), RULES.md, docs/reference/flockade-rules.md.
Depends on: 1.1 (workspace). Present a plan for this epic and wait for validation before coding.

### Goal
The engine package holds the piece catalog as data, a seeded random generator and the per-player deck, all pure and deterministic.

### Behaviours (target for tests)
- The catalog has 36 pieces: for each of the 3 types (Sword, Shield, Scribe) one regular piece plus 9 blessed pieces (Just, Fallen, Risen, Prize, Rotten, Scout, Mercenary, Marked, Trickster), plus 6 Shepherds (Lone, Wandering, Guardian, Rotten+, False, Golden). No Trickster+. The plain "nullified Shepherd" is a state, not a catalog piece.
- The 3 types form a cycle: each beats one and loses to one. Shepherds beat nothing and lose to every non-Shepherd.
- Piece data holds only stable ids and rules data: no displayed name, no working name, no asset path (PLAN section 2). Suggested convention, to confirm in the plan: effect ids describe behaviour (for example `shift-down`, `win-bonus`) and types use neutral ids.
- A seeded PRNG returns the same sequence for the same seed and different sequences for different seeds. It is injected, never global; the engine never calls `Math.random`.
- Each player starts with a deck of all 36 pieces, shuffled from the seed.
- An offer is 3 pieces from the player's deck, or 1 when the opponent has a Lone Shepherd in play (here only the offer-size function; placement is 1.3).
- Picking a piece consumes it for the rest of the round. Unpicked offered pieces go back into the deck. A consumed piece is not offered again in the same round. Decks are rebuilt in full at the start of every round (RULES.md), so an offer is always full.

### Done when
Table-driven tests with fixtures in dedicated files cover each behaviour, including catalog counts per type and blessing. `npm test` passes.

### Out of scope
Board, placement, duels (1.3 to 1.6), displayed text.

### Notes
PRNG: small own implementation or a dependency, record the choice in README.md.

---

## Epic 1.3: Engine - placement phase

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 1, epic 1.3 of 13.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 3, 8), RULES.md, docs/reference/flockade-rules.md.
Depends on: 1.2 (catalog, RNG, deck). Present a plan for this epic and wait for validation before coding.

### Goal
The placement phase of one round as a pure state machine: a state plus a legal move gives the next state, illegal moves are rejected.

### Behaviours (target for tests)
- Two board sizes: 2 columns x 2 rows (4 duels) and 2 columns x 3 rows (6 duels). Each player has their own board.
- Round 1: the first player is drawn from the seed. Later rounds: the previous round's winner goes first; after a drawn round the player who went first goes first again (RULES.md).
- Players alternate placing one piece per turn on an empty cell of their own board, chosen from an offer (3 pieces, 1 under the opponent's Lone). The phase ends when both boards are full.
- Legal-move generation lists every legal placement (piece x cell). A placement outside the offer, on an occupied cell, out of turn or after the phase ended is rejected with an explicit error.
- Scout: it must replace an enemy piece when at least one exists on the opponent's board, otherwise it is placed like any piece. The replaced piece is removed from the game.
- Rotten: when placed, blessings on the opposite row are nullified. Rotten+ (Shepherd): when placed, blessings of all the opponent's pieces are nullified. Pieces placed later keep their blessing (RULES.md). A nullified Shepherd becomes the plain Shepherd state (no effect).
- Per-player view: the opponent's deck and offers are hidden.

### Open rule questions (not validated: ask the user before writing tests)
1. Layout: the two boards face each other and a duel pairs cells in the same position; "opposite row" for Rotten is the opponent's row facing the Rotten's row. Proposed default.
2. A Scout replacing a piece counts as that turn's placement. Proposed default.

### Done when
Table-driven tests with fixtures cover each behaviour, both board sizes and each kind of illegal move. `npm test` passes.

### Out of scope
Duel-phase effects and duels (1.4, 1.5), round and match flow (1.6), bots.

---

## Epic 1.4: Engine - duel-phase moves

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 1, epic 1.4 of 13.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 3, 8), RULES.md, docs/reference/flockade-rules.md.
Depends on: 1.3 (placement). Present a plan for this epic and wait for validation before coding.

### Goal
When both boards are full, apply the effects that change the board, in sequence order 1 to 4 (1 to 6 on the 2x3 board), before any duel.

### Behaviours (target for tests)
- Sequence order: right column first, top to bottom, then the next column (RULES.md). Each piece with a move or transform effect acts once, at its sequence position.
- Fallen: all pieces in its column move down one square. Risen: same, up.
- Mercenary: swaps places with the piece in the same row (the other column).
- Trickster: turns into a regular (unblessed) piece of one of the other two types, drawn at random from the seed (RULES.md). It keeps no blessing.
- Wandering (Shepherd): its owner gains 2 points each time this piece moves, whatever moved it.
- Nullified blessings (from Rotten or Rotten+) do nothing.
- Every transition emits an ordered list of events (piece moved, piece transformed, points gained) that the client will animate later.

### Open rule questions (not validated: ask the user before writing tests)
1. Fallen and Risen wrap around inside the column (the piece pushed off one end appears at the other end), because a full board has no free square. Proposed default.
2. Sequence positions are the cells at the start of the duel phase, and an effect uses its piece's current cell when it acts. Proposed default.
3. At the same sequence number, the round's first player resolves first. Proposed default.

### Done when
Table-driven tests with fixtures cover each effect, both board sizes, the order of several effects in one column, and the event list. `npm test` passes.

### Out of scope
Duels and scoring (1.5).

---

## Epic 1.5: Engine - duels and scoring

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 1, epic 1.5 of 13.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 3, 8), RULES.md, docs/reference/flockade-rules.md.
Depends on: 1.4 (duel-phase moves). Present a plan for this epic and wait for validation before coding.

### Goal
After the moves, resolve each duel between facing cells, award points and decide the round.

### Behaviours (target for tests)
- Rock-Paper-Scissors between the 3 types; same type is a tie; a Shepherd loses to every non-Shepherd and ties with another Shepherd.
- Just: wins ties against its own type (two Just of the same type tie).
- Prize: a win gives 2 points instead of 1. Marked: when it wins, the opponent loses 1 point.
- Guardian: if it duels a Marked piece, its owner wins the whole round. False: if this piece loses, 2 points are awarded. Golden: points won in duels are doubled.
- A won duel gives 1 point by default. The round winner has the most points; equal points is a drawn round.
- Nullified blessings do nothing.
- Duel events are emitted in order (duel resolved, points changed) for the client.

### Open rule questions (not validated: ask the user before writing tests)
1. Guardian: if it wins its duel against a Marked piece, its owner wins the whole round immediately, whatever the points. Proposed default.
2. False: the 2 points go to the False piece's owner when it loses (not to the winner, who still gets their normal point). Proposed default.
3. Golden: it doubles only its owner's duel points. Proposed default.
4. Marked: the round score may not go below 0. Proposed default.
5. Order of duels: facing pairs in sequence order 1 to 4, so Guardian and score effects resolve in the same order. Proposed default.

### Done when
Table-driven tests with fixtures cover every blessing alone and the main interactions (Prize with Golden, Marked with Guardian, Just against Just, nullified blessings). `npm test` passes.

### Out of scope
Rounds, match, replay (1.6).

---

## Epic 1.6: Engine - rounds, match, replay

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 1, epic 1.6 of 13.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 3, 8), RULES.md, docs/reference/flockade-rules.md.
Depends on: 1.5 (duels and scoring). Present a plan for this epic and wait for validation before coding.

### Goal
The full game loop, replay from a recorded seed, and confidence that no legal sequence breaks the state.

### Behaviours (target for tests)
- A drawn round counts as a win for both players, in every round. After each round the match ends if one player has at least 2 round wins and strictly more than the opponent (RULES.md, "Match winner"). Otherwise another round is played. The number of rounds has no limit.
- Boards and decks reset between rounds: every round starts with a full 36-piece deck per player.
- A game is fully described by seed, board size and the list of moves. Replaying them gives the exact same final state and event list.
- Per-player view function: a player's view never contains the opponent's deck, offers or future draws.
- Randomised test: random legal move sequences over many seeds, both board sizes, never reach an invalid state. The harness stops a game after a fixed number of rounds and checks the state invariants at that point, so an unfinished match is allowed; a separate test checks that repeated drawn rounds keep the match unfinished and the state valid (board counts, no duplicated piece, deck consistency, round and match rules). Property-testing library choice recorded in README.md.
- A single public engine API (create game, list legal moves, apply move, view) that solo, multiplayer and the bots will all use.

### Done when
Table-driven tests cover the match rules (2-0, 2-1, 1-1 after a draw, 2-2 continuing, a win after several drawn rounds), replay equality and the view; the randomised test passes. `npm test` passes.

### Out of scope
Bots, UI, networking.

---

## Epic 1.7: Bots - easy and medium

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 1, epic 1.7 of 13.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 5, 8), RULES.md.
Depends on: 1.6 (engine API). Present a plan for this epic and wait for validation before coding.

### Goal
Two bot levels in the `bot` package. A bot is a pure function from the player's view (and an injected RNG) to a legal move.

### Behaviours (target for tests)
- Easy: plays a legal move chosen at random.
- Medium: counters what it can see (prefers a piece whose type beats the visible facing opponent piece) and otherwise plays randomly. It ignores blessing effects when choosing.
- Both bots only receive the per-player view: a test checks that no hidden data (opponent deck, offers, future draws) is reachable from the input.
- Both always return a legal move and are deterministic for the same view and seed.
- Over many seeded games, medium beats easy with a win rate above a threshold chosen in the plan (for example 60 percent over 1000 games).

### Done when
Tests cover legality, determinism, the view restriction and the medium-over-easy win rate. `npm test` passes.

### Out of scope
Hard bot (1.8), human-like thinking delays (client, 1.10).

---

## Epic 1.8: Bot - hard

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 1, epic 1.8 of 13.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 5, 8), RULES.md.
Depends on: 1.7 (easy and medium bots). Present a plan for this epic and wait for validation before coding.

### Goal
A hard bot that plays as well as the visible information allows, taking effects and resolution order into account and exploiting the rules.

### Behaviours (target for tests)
- It uses the engine to simulate the duel phase of candidate boards (effects, order, points) and handles hidden information (opponent deck and offers, Trickster randomness) by sampling or expectation. The algorithm is chosen in the plan (for example sampled search); record the reasoning in README.md.
- It only receives the per-player view, same restriction as the other bots.
- Over many seeded games hard beats medium and medium beats easy, on both board sizes, with thresholds chosen in the plan.
- A move takes under 500 ms. A timing test runs on the dev machine with a safety margin. A mid-range phone cannot be measured here, so state that in the report.
- Deterministic for a given view and seed.

### Done when
Tests cover legality, the view restriction, the win-rate ordering hard > medium > easy and the time budget. `npm test` passes.

### Out of scope
Simulation report tooling (1.9), client integration (1.10).

---

## Epic 1.9: Simulation tool and balance report

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 1, epic 1.9 of 13.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 3, 5, 8), RULES.md.
Depends on: 1.8 (all bots). Present a plan for this epic and wait for validation before coding.

### Goal
`npm run simulate` plays many bot games and writes a balance report. It is run before any rules or balance change ships.

### Behaviours (target for tests)
- Options: number of games, bot levels, board size, seed.
- The report gives: win rates for each bot pairing (showing hard > medium > easy), first-player versus second-player advantage, the impact of each blessing (for example the win rate of games where a piece carrying it was played, or with it removed), and the effect of offer and deck-draw randomness.
- Runs are reproducible from the seed.
- Output as readable Markdown plus machine-readable JSON, written to a folder that is not committed or to docs/ (decide in the plan).
- The tool exits with an error if the ordering hard > medium > easy does not hold.

### Done when
Tests cover the statistics code on small fixed seeds and the ordering check; a first report is produced and any balance finding that suggests a rule interpretation change is listed for the user (RULES.md is not changed without asking). `npm test` passes.

### Out of scope
Any rule change.

---

## Epic 1.10: Client - solo match

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 1, epic 1.10 of 13.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 4, 8, 9, 12), RULES.md.
Skills to use: vue-best-practices (any Vue code), frontend-design, responsive-design.
Depends on: 1.8 (engine and bots). Present a plan for this epic and wait for validation before coding.

### Goal
A person can play a full solo match against a chosen bot level on a chosen board size, in the browser, on phone and desktop, with placeholder visuals.

### Behaviours (target for tests)
- Vite and Vue 3, Composition API with `<script setup>` and TypeScript.
- Screens: start (board size, bot level), match, result.
- Components for board, cell, piece, offer (the 3 offered pieces), score, round and match status, each with explicit props and events.
- All user-facing text comes from the English translation file, including the product name and every piece, blessing and Shepherd name (placeholders, not the original's words). Plurals and gender handled, layouts tolerate strings 30 to 40 percent longer. Colours, fonts and spacing are design tokens, light and dark variants.
- Every visual and audio asset is referenced through a manifest of stable names so a full set can be swapped.
- Pieces differ by shape, not only colour (placeholder SVG).
- The hard bot runs off the main thread so the UI never freezes. The bot gets a short, slightly random thinking delay so it feels human.
- The engine runs in the client for solo play. The anonymous player id logic is not part of this epic.
- Mobile first, works at 360 px width and on desktop.
- An end-to-end test plays one complete solo match (end-to-end tool chosen in the plan, recorded in README.md).

### Done when
A full match is playable against each bot level on both board sizes, component tests and the end-to-end test pass. `npm test` passes.

### Out of scope
Effect labels, animations and sound (1.11), reskin test (1.12), deployment (1.13).

---

## Epic 1.11: Client - feel and clarity

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 1, epic 1.11 of 13.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 6, 8), RULES.md.
Skills to use: vue-best-practices, frontend-design, accessibility.
Depends on: 1.10 (client). Present a plan for this epic and wait for validation before coding.

### Goal
Make each effect understandable and give placement a basic game feel and sound.

### Behaviours (target for tests)
- Each blessing shows a one-word label and a short explanation, both from the translation file, visible on the piece and in an info view.
- Placement feel: lift on hover, ghost on the target cell, squash-and-stretch pop of about 150 ms, dust ring, the opponent's piece slides in from their side after a short delay. All motion respects the reduced-motion setting.
- A low thud on placement with plus or minus 5 percent pitch variation. Audio starts only after the first user interaction, with a mute toggle visible from the first screen, and the mute state remembered in local storage (reads and writes wrapped in try/catch).
- Sound assets are CC0 or permissive and listed with source and licence in CREDITS.md. They are referenced through the asset manifest.
- Animations are driven by the engine's event list, not by re-deriving game logic in the UI.

### Done when
Component tests cover labels, the mute toggle and the first-interaction audio rule; manual check of feel on desktop and a phone-size viewport. `npm test` passes.

### Out of scope
Duel animations (hit-stop, shake, slow motion: roadmap step 3), music layers (step 4).

---

## Epic 1.12: Rename-and-reskin acceptance test and accessibility pass

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 1, epic 1.12 of 13.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 8, 9), RULES.md.
Skills to use: accessibility, responsive-design.
Depends on: 1.11 (client feel). Present a plan for this epic and wait for validation before coding.

### Goal
Prove that names and assets are replaceable without code changes (PLAN section 2), and that the first client is accessible.

### Behaviours (target for tests and checks)
- Acceptance test: rename the product and every piece through the translation file and swap all placeholder assets for a dummy second set, in under an hour and with no code change. Time it and write the procedure in README.md. If it takes longer or needs a code change, fix the structure first.
- An automated check fails the build if a displayed name or an asset path appears in code outside the translation files and the asset manifest.
- Keyboard play: every action reachable with the keyboard, visible focus, logical order.
- Screen-reader labels on cells, pieces, offers and score. Meaning is never carried by colour or sound alone.
- Contrast and layout checks at 360 px width and on desktop, plus a pseudo-locale with 40 percent longer strings that does not break layouts.

### Done when
The acceptance test passes and its timing is written down, the automated naming check is in `npm test`, and the accessibility checks pass.

### Out of scope
New features, deployment.

---

## Epic 1.13: Deployment

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 1, epic 1.13 of 13.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 4, 10, 12), RULES.md, README.md.
Skills to use: web-quality-audit, performance.
Depends on: 1.12 (acceptance test). Present a plan for this epic and wait for validation before coding.

### Goal
The solo game is reachable online on Cloudflare Pages.

### Behaviours (target for checks)
- `npm run build` produces the static client, `npm run deploy` publishes it to Cloudflare Pages. Verify the deploy tool and its options in the official docs, do not guess.
- A web quality audit before deployment (performance, accessibility, SEO, best practices) with the findings fixed or listed.
- CREDITS.md lists every asset with source and licence. LICENSE (AGPL-3.0) and README.md are present and accurate. No secrets or personal data in the repository.
- The app footer carries the non-affiliation line from PLAN section 10. Touching section 10 items needs the user's agreement first.
- Ask the user before the first production deployment (PLAN section 12). Do not buy a domain: use the default Pages address until the trademark search (PLAN section 10) is done.

### Done when
The game is reachable at a public URL, the audit report is attached, a full solo match works there on a phone-size viewport, and `npm test` still passes. Roadmap step 1 is then complete.

### Out of scope
Content pages, privacy notice and identity reset (roadmap step 1b), multiplayer.
