# Roadmap step 3: duel-phase feel and onboarding (5 epics)

How to use: copy one epic section (from its `##` heading to the next `---`) into a new Claude session. Do the epics in order. Roadmap definition of done: `docs/reference/PLAN.md` section 11, step 3. Requires step 2 to be complete.

---

## Epic 3.1: Duel animation sequence

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 3 (duel-phase feel and onboarding), epic 3.1 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 6, 8), RULES.md.
Skills to use: vue-best-practices, frontend-design, accessibility, performance.
Depends on: roadmap step 2. Present a plan for this epic and wait for validation before coding.

### Goal
The duel phase is readable and satisfying, driven by the engine's event list.

### Behaviours (target for tests and checks)
- Anticipation beat of 300 to 500 ms before the first duel.
- Per cell: focus on the facing pair, hit-stop of 60 to 100 ms, the winner scales and glows, the loser cracks and falls, a point flies to the counter which ticks.
- Screen shake scaled to the stakes (none on a tie, light on an ordinary win, strong on a high-value duel such as Prize), with a capped amplitude.
- Slow motion on the deciding duel. Loss animations are as satisfying as win animations.
- Moves from the duel-phase effects (Fallen, Risen, Mercenary, Trickster) are animated before the duels, in sequence order.
- The animation layer only reads events from the engine and never re-derives results. The final state is identical with animations skipped.
- Reduced-motion and a "shake off" setting are respected; a skip control exists.
- Works the same for solo and for multiplayer events from the server.

### Done when
Component tests check the animation timeline from a recorded event list (order and durations, using a controllable clock); manual check on desktop and a phone-size viewport. `npm test` passes.

### Out of scope
Sounds (3.2), music (roadmap step 4).

---

## Epic 3.2: Blessing sounds and effect glow

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 3, epic 3.2 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 6), RULES.md.
Skills to use: accessibility.
Depends on: 3.1. Present a plan for this epic and wait for validation before coding.

### Goal
One sound and one glow per blessing family, so players learn effects.

### Behaviours (target for tests and checks)
- Families are defined in the plan from the catalog (proposal: movers, transform, nullify, scoring modifiers, tie-breaker, scout, round-win), each with one sound, one glow and the existing one-word label.
- The sound and glow play when the effect triggers, from the engine event, in both solo and multiplayer.
- Sound assets are CC0 or permissive, referenced through the asset manifest and listed in CREDITS.md with source and licence. Ask before using any asset whose licence is unclear.
- Meaning is never carried by sound alone: each effect also has a visual cue and a text label (screen-reader announcement included).
- The mute and volume settings from step 1 apply.

### Done when
Tests check that each family maps to a sound and glow in the manifest and that every effect event triggers its family; CREDITS.md is complete. `npm test` passes.

### Out of scope
Music layers and full SFX set (step 4).

---

## Epic 3.3: Interactive tutorial

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 3, epic 3.3 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 8, 9), RULES.md.
Skills to use: vue-best-practices, frontend-design, accessibility, responsive-design.
Depends on: 3.1, 3.2. Present a plan for this epic and wait for validation before coding.

### Goal
A new player learns placement, a duel and a blessing in about 90 seconds.

### Behaviours (target for tests)
- A scripted game on a fixed seed so every player sees the same pieces, using the real engine (no separate rules copy).
- Three beats: place a piece, watch a duel resolve (including the winner by type), see one blessing work.
- Skip and replay controls; offered on first launch and from the menu; completion remembered in local storage (try/catch, works without it).
- All text from translation files, layouts tolerant of longer strings, keyboard and screen-reader friendly.
- An end-to-end test completes the tutorial.

### Done when
The end-to-end test passes and a timing check shows the happy path lasting about 90 seconds. `npm test` passes.

### Out of scope
Per-blessing teaching pages (step 4).

---

## Epic 3.4: Rematch button

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 3, epic 3.4 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 3, 8), RULES.md, the protocol document.
Depends on: roadmap step 2 (rooms). Present a plan for this epic and wait for validation before coding.

### Goal
Players can start another match straight from the result screen.

### Behaviours (target for tests)
- Solo: starts a new match with the same bot level and board size.
- Room: a rematch needs both players to accept; the server creates a new game in the same room with a new seed, and decides who goes first by the usual rule for round 1 of a match (random).
- A declined or ignored rematch ends cleanly and the room is cleaned up by the existing retention rule.
- Protocol additions are documented in the protocol document.

### Done when
Server tests cover accept, decline and timeout; a client end-to-end test covers a rematch in a room. `npm test` passes.

### Out of scope
Matchmaking (step 5).

---

## Epic 3.5: Shareable result card

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 3, epic 3.5 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 7, 9), RULES.md.
Skills to use: frontend-design, seo.
Depends on: 3.1. Present a plan for this epic and wait for validation before coding.

### Goal
At match end the player can save or share an image of the result.

### Behaviours (target for tests and checks)
- A card showing the result, round scores and the board, built from design tokens, translation strings and the asset manifest (so a reskin changes it without code). Layouts tolerate strings 30 to 40 percent longer.
- Image rendering approach chosen in the plan (library choice recorded in README.md with its licence; ask if unclear). Download button and the browser's share sheet when available.
- No personal data on the card beyond an optional nickname the player already set.
- It doubles as the Open Graph image where that makes sense: decide in the plan whether a per-match image needs a server route, or whether the static image from step 1b stays and the card is only user-shared.
- The card text is the product's placeholder names from the translation files, never the original's words.

### Done when
Tests check card generation for each outcome (win, loss, draw, tie) and each board size and that no text is hard-coded. `npm test` passes. Roadmap step 3 is then complete.

### Out of scope
Social network integrations beyond the share sheet.
