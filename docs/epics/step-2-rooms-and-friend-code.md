# Roadmap step 2: rooms and friend code (8 epics)

How to use: copy one epic section (from its `##` heading to the next `---`) into a new Claude session. Do the epics in order. Roadmap definition of done: `docs/reference/PLAN.md` section 11, step 2. Requires steps 1 and 1b to be complete. Platform details (Cloudflare Workers, Durable Objects, D1 or KV) must be verified in the official documentation before use; ask before changing the stack or buying anything.

---

## Epic 2.1: Room protocol and server spike

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 2 (rooms and friend code), epic 2.1 of 8.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 3, 4, 8, 12), RULES.md, README.md.
Depends on: roadmap steps 1 and 1b. Present a plan for this epic and wait for validation before coding.

### Goal
Decide and document the multiplayer protocol, and prove the chosen server platform with a minimal room.

### Behaviours (target for tests and checks)
- A protocol document (in `docs/` or `README.md`, as decided in the plan) describes every message between client and server: create room, join with code, state updates as per-player views, move submission, errors, reconnect, forfeit. Messages are validated once at the boundary into typed shapes.
- The server owns the game: random draws happen server-side from a recorded seed, and a client cannot change the state on its own (PLAN section 2).
- Spike: one room on the chosen platform (Cloudflare Durable Objects per PLAN section 4) that accepts two WebSocket connections and echoes a message between them, runnable locally. If the platform proves awkward, report it and propose the alternative from PLAN section 4 (Node WebSocket server) instead of switching silently.
- Pending decisions listed for the user: room code format, room lifetime, how a client proves it is the player who created or joined a seat (ties to the identity cookie, 2.3).

### Done when
The protocol document is approved by the user and the spike runs locally with a test for the two-connection exchange. `npm test` passes.

### Out of scope
Game logic on the server (2.2), identity (2.3), client screens (2.4).

---

## Epic 2.2: Server-side game rooms

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 2, epic 2.2 of 8.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 3, 8), RULES.md, the protocol document from 2.1.
Depends on: 2.1. Present a plan for this epic and wait for validation before coding.

### Goal
A room runs a full match with the shared engine, server in control.

### Behaviours (target for tests)
- Create a room (board size chosen by the creator) and get a code; join with the code as the second player; a third join is rejected; unknown or expired codes are rejected.
- The server runs the engine package (the same code as solo), applies only legal moves from the player whose turn it is, and rejects illegal moves with an explicit error that leaves the state unchanged.
- Each player receives only their per-player view: the opponent's deck and offers never leave the server.
- Players leaving, and joining late or twice with the same seat, behave as defined in the protocol document.
- The game record (seed, board size, move list, engine version) is kept so any game can be replayed.
- Engine version is stored with each room so a deploy never changes the rules of a game in progress (PLAN section 8).

### Done when
Server tests cover join, leave, rejection of illegal moves, hidden information and replay of a finished game. `npm test` passes.

### Out of scope
Timers and reconnect (2.5), persistence beyond the live room (2.7), client UI (2.4).

---

## Epic 2.3: Server-side anonymous identity

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 2, epic 2.3 of 8.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 8, 10), RULES.md, the existing identifier module from step 1b.
Depends on: 2.1. Present a plan for this epic and wait for validation before coding. Privacy items (PLAN section 10) need the user's agreement.

### Goal
The server recognises a browser by its anonymous identifier, kept in local storage and in a long-lived server-set cookie.

### Behaviours (target for tests)
- The server sets a long-lived cookie with the identifier (HttpOnly, Secure, SameSite as appropriate; verify the current browser rules in the documentation) because Safari can evict local storage after 7 days without a visit (PLAN section 2). If the cookie and local storage disagree, the rule for which wins is decided in the plan.
- The identifier is also accepted as a token carried in the protocol messages, not only as a cookie, because wrapped apps (roadmap step 8) run from another origin where a server-set cookie is likely to be blocked as third-party (to verify when step 8 starts). The cookie stays the default for the browser.
- A seat in a room is bound to the identifier, so a disconnected player can come back (2.5) and nobody else can take the seat.
- Game history is attached to the identifier through a link that lets several identifiers be merged into one account later (step 7) without rewriting history.
- "Reset my identity" (from step 1b) now also deletes the player's server record and unlinks their games, as PLAN section 8 requires.

### Done when
Tests cover cookie creation and reuse, mismatch handling, seat binding and reset. `npm test` passes.

### Out of scope
Accounts and magic links (step 7).

---

## Epic 2.4: Client multiplayer screens

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 2, epic 2.4 of 8.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 6, 8, 9), RULES.md, the protocol document.
Skills to use: vue-best-practices, frontend-design, responsive-design, accessibility.
Depends on: 2.2, 2.3. Present a plan for this epic and wait for validation before coding.

### Goal
Two browsers can play a full match through a room code.

### Behaviours (target for tests)
- Screens: friend room (create with board size, join with a code), waiting room showing the code with a copy button, then the existing match screen driven by server state.
- The match screen reuses the solo components and the engine's event list for animations; the only change is the source of state and moves.
- A shareable join link that opens the join screen with the code filled in.
- The server address is configuration, not hard-coded, so a wrapped app (roadmap step 8) can point to it.
- Clear states for waiting, opponent connected or not, and errors (room full, unknown code, illegal move).
- All text comes from the translation files; layouts work at 360 px.
- An end-to-end test plays a full match between two browser contexts.

### Done when
The two-browser end-to-end test passes and `npm test` passes.

### Out of scope
Timers, reconnect (2.5), nicknames and emotes (2.6).

---

## Epic 2.5: Timers, reconnect and forfeits

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 2, epic 2.5 of 8.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 3, 8), RULES.md, the protocol document.
Depends on: 2.2, 2.3, 2.4. Present a plan for this epic and wait for validation before coding.

### Goal
A match survives slow and disconnected players with clear rules.

### Behaviours (target for tests)
- Move timer: 30 seconds by default (a setting), shown to both players. On timeout the server auto-passes.
- Forfeit after 3 consecutive timeouts or 60 seconds of disconnection (PLAN section 3).
- A disconnected player who comes back within the limit resumes their game with the current view.
- Timeouts and forfeits are part of the game record.
- The time source is injected so tests run without waiting.

### Open question (ask the user)
"Auto-pass" has no meaning during placement, since a board must be filled. Proposed default: on timeout the server plays a random legal move for that player.

### Done when
Server tests cover timeout, three timeouts, 60 s disconnect, reconnect within the limit and reconnect after the limit; one client end-to-end test covers reconnect. `npm test` passes.

### Out of scope
Public matchmaking and idle room cleanup (step 5).

---

## Epic 2.6: Rate limits, nickname filter, emotes

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 2, epic 2.6 of 8.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 8, 9), RULES.md.
Depends on: 2.2, 2.4. Present a plan for this epic and wait for validation before coding.

### Goal
Basic abuse protection and light social features that carry no free text between players.

### Behaviours (target for tests)
- Rate limits on room creation, join attempts and messages per identifier and per address (limits chosen in the plan and listed in the protocol document).
- Optional nickname with length and character rules and a profanity filter. Word lists must come from a source with a licence compatible with AGPL-3.0 and cover English now, other languages at step 6; record the source in README.md and ask before adding it.
- Emotes: a fixed set of preset reactions, shown through translation keys and sent as ids, never as free text.
- Everything hits the server first: the client never decides.

### Done when
Tests cover limits (accepted, rejected, reset), nickname validation and the emote whitelist. `npm test` passes.

### Out of scope
Report and block (step 5).

---

## Epic 2.7: Persistence and data retention

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 2, epic 2.7 of 8.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 8, 10), RULES.md.
Depends on: 2.2, 2.3. Present a plan for this epic and wait for validation before coding.

### Goal
Players and results are stored, and old data is removed according to the retention rule.

### Behaviours (target for tests)
- Storage choice between D1 and KV (PLAN section 4) made in the plan with its reason; verify limits and pricing in the official documentation and ask before anything that costs money.
- Stored: player record (anonymous identifier, optional nickname, timestamps), finished game records (seed, board size, moves, engine version, result, timeout or forfeit flags) linked to identifiers.
- Finished rooms are deleted within days (the exact period is decided with the user); game records are kept.
- Reset identity deletes the player's record and unlinks their games (consistent with 2.3).
- A replay check: any stored record can be replayed to the same result.

### Done when
Tests cover writes, retention deletion, identity reset and replay of a stored record. `npm test` passes.

### Out of scope
Analytics (step 4), accounts (step 7).

---

## Epic 2.8: Legal pages and soft launch

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 2, epic 2.8 of 8.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 10, 12).
Depends on: 2.1 to 2.7. Present a plan for this epic and wait for validation before acting. Every item here is in PLAN section 10: the user's agreement is needed first.

### Goal
The legal pages exist and friends can be invited.

### Behaviours (target for checks)
- Update the privacy notice for the server (cookie, stored data, retention, reset).
- Publisher identification page required by the French LCEN: verify the current wording and whether an individual may name the host instead of themselves; the user supplies the facts.
- Terms of use and a contact address, drafted for the user to approve. State that a lawyer should review them.
- CONTRIBUTING.md present, published only after the copyright holder and contributor agreement are decided (PLAN sections 2 and 10, epic 8.1); repository description and topics set on GitHub (the user does the GitHub settings).
- Ask the user before the production deployment of the server and before any purchase (PLAN section 12).
- A short list of what to ask friends to test, and a feedback channel (one-field form or Discord, the user picks).

### Done when
Legal pages are approved by the user and published, the room game works in production between two real browsers, and the soft launch is done by the user. Roadmap step 2 is then complete.

### Out of scope
Public launch posts (step 5).
