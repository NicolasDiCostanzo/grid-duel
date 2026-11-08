# Roadmap step 5: public lobby or quick match (5 epics)

How to use: copy one epic section (from its `##` heading to the next `---`) into a new Claude session. Do the epics in order. Roadmap definition of done: `docs/reference/PLAN.md` section 11, step 5. Requires step 4 to be complete.

---

## Epic 5.1: Matchmaking model decision

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 5 (public lobby or quick match), epic 5.1 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 1, 2, 3, 8), RULES.md, the protocol document.
Depends on: roadmap step 4. Present a plan for this epic and wait for validation before coding.

### Goal
Choose and design how strangers find each other.

### Behaviours (deliverable and tests)
- PLAN section 1 says "public lobby or quick match". Compare the two for this game (a small audience, short matches, no accounts) and recommend one; the user decides. Proposed default: quick match (a queue by board size), because a lobby list is empty-looking when few people are online.
- Protocol additions in the protocol document: join queue, leave queue, match found, with the same server-side control as friend rooms.
- Queue rules: pairing by board size, time-out of waiting, what the player sees when nobody is found (offer a solo bot match).
- Rate limits from step 2 apply to the queue.

### Done when
The model and protocol additions are approved by the user. No code, or only a tested queue module if the plan includes it.

### Out of scope
Skill-based matching (no ratings without accounts).

---

## Epic 5.2: Quick match queue

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 5, epic 5.2 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 3, 8), RULES.md, the protocol document.
Skills to use: vue-best-practices, frontend-design, accessibility.
Depends on: 5.1. Present a plan for this epic and wait for validation before coding.

### Goal
A player can press a button and get matched with a stranger.

### Behaviours (target for tests)
- Server: queue per board size, pair two waiting identifiers into a new room using the existing room logic (seed, per-player views, timers and forfeits from step 2).
- A player cannot be in two queues or two matches; a player in a match who opens another tab gets a clear message.
- Leaving the queue or disconnecting removes the player.
- Client: "quick match" screen with board size choice, a waiting state with a cancel button and a "play a bot instead" suggestion after a delay; text from translation files.
- Tests: pairing, cancel, disconnect, double queue, and an end-to-end test with two browsers.

### Done when
Server and end-to-end tests pass and `npm test` passes.

### Out of scope
Abandon handling and idle rooms (5.3), moderation (5.4).

---

## Epic 5.3: Abandons and idle rooms

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 5, epic 5.3 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 3, 8), RULES.md, the protocol document.
Depends on: 5.2. Present a plan for this epic and wait for validation before coding.

### Goal
No match or room stays stuck, and abandoning has a clear outcome.

### Behaviours (target for tests)
- An abandoned public match (forfeit, repeated timeouts, leaving) ends with a recorded result and the opponent shown a clear message with the option to find another match.
- Idle rooms (nobody connected, or never joined) are closed and removed after a delay, following the retention rule from step 2; the delay values are chosen in the plan.
- Analytics events for abandoned matches (from step 4) fire for public matches.
- Repeated abandoning by the same identifier is detectable (a counter) so a rule can be decided with the user later. No penalty is built without the user's agreement.
- The time source is injected so the tests run without waiting.

### Done when
Tests cover each abandon path and idle cleanup. `npm test` passes.

### Out of scope
Penalties, ratings.

---

## Epic 5.4: Moderation: report and block

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 5, epic 5.4 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 8, 10), RULES.md.
Skills to use: accessibility.
Depends on: 5.2. Present a plan for this epic and wait for validation before coding. Privacy items (PLAN section 10) need the user's agreement first.

### Goal
Players can protect themselves in the social features that exist: nicknames and emotes from step 2.

### Behaviours (target for tests)
- Block: a player can block an opponent identifier so they are never matched with it again, and can mute their emotes in a match. Stored against the blocker's identifier only.
- Report: a player can report an opponent (nickname or emote abuse) with a reason from a fixed list; the report stores the identifiers and the game record reference and nothing else. How reports reach the operator is decided with the user (a daily list, an email, a Discord message).
- Reports and blocks follow the data retention and reset-identity rules from step 2.
- The privacy notice is updated for what is stored; the user approves it.
- No free-text chat is added.

### Done when
Tests cover block, report, retention and identity reset. `npm test` passes.

### Out of scope
Automated sanctions, appeals, an admin console.

---

## Epic 5.5: Public launch preparation

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 5, epic 5.5 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 7, 8, 10, 12).
Depends on: 5.1 to 5.4. Present a plan for this epic and wait for validation before acting. Posting is the user's action; Claude only prepares.

### Goal
The game is ready for public launch posts.

### Behaviours (deliverable)
- A readiness checklist covered with evidence: the PLAN section 10 items still open (trademark search, non-affiliation line everywhere, legal pages, CREDITS.md, LICENSE, README, CONTRIBUTING), monitoring from step 4 live, quick match tested with real people, capacity and cost limits known.
- Draft launch posts for the channels listed in PLAN section 7 (r/CultOfTheLamb, the game's Discord, the itch.io listing, a comment on the Steam guide, a wiki mention if their rules allow it). For each channel, check its current self-promotion rules from its own page before drafting. Posts use our product's names and describe the original factually with the non-affiliation line.
- A plan for the launch day: who watches errors, how to disable quick match quickly if it misbehaves.

### Done when
The user has approved the checklist and drafts and done the posts. Roadmap step 5 is then complete.

### Out of scope
Paid promotion.
