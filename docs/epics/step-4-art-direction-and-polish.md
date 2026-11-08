# Roadmap step 4: art direction and polish (7 epics)

How to use: copy one epic section (from its `##` heading to the next `---`) into a new Claude session. Do the epics in order, except that 4.6 can run in parallel. Roadmap definition of done: `docs/reference/PLAN.md` section 11, step 4. Requires step 3 to be complete.

---

## Epic 4.1: Art direction brief and decision

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 4 (art direction and polish), epic 4.1 of 7.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 13), RULES.md.
Skills to use: frontend-design.
Depends on: roadmap step 3. This epic is mostly the user's decision. Present a plan and wait for validation before producing anything.

### Goal
A written art direction and illustration brief the user has approved.

### Behaviours (deliverable)
- 2 or 3 visual directions with mood, palette, typography and shape language, each shown as a small mock-up of the match screen using design tokens (so the choice stays a token change).
- The brief states the constraints from PLAN section 2: pieces distinguishable by shape and not only colour, readable in small cells on mobile, every asset licensed for redistribution (CC0, permissive or commissioned; no "personal use only"), nothing taken from the original game's art.
- The inventory of assets to produce, counted from the catalog: 36 pieces, the plain nullified Shepherd, board and cell states, effect glows, icons, background, logo. Whether pieces get character names and lore (PLAN section 13) is flagged for the user's decision.
- Who produces the art (the user, a commissioned artist, or generated assets with a licence the user can redistribute) is the user's decision; ask, and note the licence consequences.
- Names are decided later (PLAN section 13: after the trademark search and this art direction): this epic does not choose names.

### Done when
The user approves one direction and the brief. Nothing in the code changes.

### Out of scope
Producing final art (4.2).

---

## Epic 4.2: Illustrated visuals replace the placeholders

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 4, epic 4.2 of 7.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 8, 9), RULES.md, the approved art brief from 4.1.
Skills to use: frontend-design, responsive-design, accessibility, performance.
Depends on: 4.1 and the delivered assets. Present a plan for this epic and wait for validation before coding.

### Goal
The approved look replaces the placeholders without any change to game logic.

### Behaviours (target for tests and checks)
- New design tokens (colours, fonts, spacing) and the new asset set dropped in through the asset manifest and the translation files. No game logic file changes (check the diff).
- The rename-and-reskin acceptance test of PLAN section 2 is run again: rename every piece and the product, swap all assets for a dummy second set, in under an hour with no code change. Time it and record it in README.md.
- Shape distinguishability, contrast, 360 px layouts and the 40 percent longer-string check still pass.
- Image formats and sizes keep performance within the audit budget (verify with the performance and web-quality-audit skills).
- CREDITS.md updated for every new asset and font.

### Done when
The acceptance test passes, visual regressions are reviewed by the user, the audit is attached and `npm test` passes.

### Out of scope
Music (4.3), names (PLAN section 13, after the trademark search).

---

## Epic 4.3: Music layers and full SFX set

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 4, epic 4.3 of 7.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 6), RULES.md.
Skills to use: accessibility, performance.
Depends on: 4.1. Present a plan for this epic and wait for validation before coding.

### Goal
Complete audio: two music layers and a full set of sound effects.

### Behaviours (target for tests and checks)
- Two music layers (placement, duel) that crossfade, with ducking under sound effects; separate music and SFX volumes; the mute toggle stays visible from the first screen; audio starts only after the first user interaction.
- A complete SFX set for UI, placement, duel results, effects (from step 3) and match end; short `navigator.vibrate` pulses on supported devices, with a setting to turn them off.
- All assets CC0, permissive or commissioned, in CREDITS.md with source and licence; asked about before use if the licence is unclear. Referenced through the asset manifest.
- Sizes and loading (lazy, streaming for music) keep within the performance budget.
- Volume and mute settings remembered in local storage with try/catch.

### Done when
Tests check mapping of events to sounds, ducking logic with a fake audio context, and the settings; CREDITS.md is complete. `npm test` passes.

### Out of scope
Adaptive or procedural music.

---

## Epic 4.4: Installable PWA with offline solo

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 4, epic 4.4 of 7.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 4, 8, 12), RULES.md.
Skills to use: performance, web-quality-audit.
Depends on: 4.2. Present a plan for this epic and wait for validation before coding.

### Goal
The game can be installed and a solo match works offline.

### Behaviours (target for tests and checks)
- Web app manifest with name and icons coming from the translation files and the asset manifest, never hard-coded (a rename must not need a code change).
- A service worker that caches the app shell and assets and updates safely: a new version never changes the rules of a match in progress (PLAN section 8). The strategy and the tool are chosen in the plan; verify current browser behaviour and tool documentation.
- Offline: solo works, multiplayer shows a clear offline message.
- A web quality audit with PWA-related findings fixed or listed.
- An end-to-end test plays a solo match with the network off.

### Done when
The installability check passes in a browser, the offline end-to-end test passes and `npm test` passes.

### Out of scope
Push notifications, background sync.

---

## Epic 4.5: Long-tail content pages

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 4, epic 4.5 of 7.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 7, 9, 13), RULES.md, docs/reference/flockade-rules.md.
Skills to use: seo, frontend-design.
Depends on: 4.2 and the existing content pages. Present a plan for this epic and wait for validation before coding.

### Goal
One page per blessing and a strategy page, to catch long-tail searches.

### Behaviours (target for checks)
- One page per blessing (and per Shepherd), generated from the catalog and translation files so they never drift from the rules: effect, resolution order, interactions, a short example, and a link to play.
- A strategy page, drafted for the user to approve, whose claims are backed by the simulation report (step 1, epic 1.9) and not by opinion. Facts that may have changed are checked against sources.
- Per-piece pages only if the user decided on character names and lore (PLAN section 13).
- All pages in the `en` folder with title, description, headings, structured data, internal links, sitemap entries and the non-affiliation line.

### Done when
Pages build, a test checks that each blessing in the catalog has a page and that metadata is complete, and the audit is attached. `npm test` passes.

### Out of scope
Other languages (step 6).

---

## Epic 4.6: Analytics, error tracking and monitoring

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 4, epic 4.6 of 7.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 4, 8, 10, 12), RULES.md.
Depends on: roadmap step 2 (server). Present a plan for this epic and wait for validation before coding. Choosing a tool that costs money, or changing the privacy notice, needs the user's agreement first.

### Goal
The operator can see usage, errors and outages, with no cookies and no personal data.

### Behaviours (target for tests and checks)
- A cookie-free, privacy-friendly analytics tool (Plausible, Umami or similar): compare licence, hosting, price and EU data location from their documentation, and recommend one with the reasons.
- Events: match started, finished, abandoned, and mode (solo, room, later public). Events carry no identifier that can single a person out.
- Error tracking on client and server.
- An uptime check on the site and the room service, and a budget alert on hosting.
- The privacy notice is updated and the user approves it (PLAN section 10).

### Done when
Tests check that events fire with the right names and no personal data, and that errors reach the tracker in a staging check. `npm test` passes.

### Out of scope
Dashboards beyond what the chosen tool offers.

---

## Epic 4.7: Public changelog and feedback channel

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 4, epic 4.7 of 7.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 7, 8, 10).
Depends on: 4.2. Present a plan for this epic and wait for validation before coding.

### Goal
Players can see what changed and tell us what they think.

### Behaviours (target for checks)
- A public changelog page, built from a file in the repository, and a rule for adding entries (a rule or balance change is always listed).
- A feedback channel: a one-field form or a Discord link (the user picks). A form must not collect personal data without the notice covering it.
- Linked from the footer and the result screen.

### Done when
The pages are published and linked, and a test checks the links. `npm test` passes. Roadmap step 4 is then complete.

### Out of scope
A support desk or ticketing tool.
