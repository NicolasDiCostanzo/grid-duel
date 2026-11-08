# Roadmap step 7: optional accounts (5 epics)

How to use: copy one epic section (from its `##` heading to the next `---`) into a new Claude session. Do the epics in order. Roadmap definition of done: `docs/reference/PLAN.md` section 11, step 7. Requires step 6 to be complete. The anonymous path must keep working unchanged throughout.

---

## Epic 7.1: Account model and identity merge design

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 7 (optional accounts), epic 7.1 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 8, 10), RULES.md, the protocol document, the identity code from step 2.
Depends on: roadmap step 6. Present a plan for this epic and wait for validation before coding.

### Goal
A data model where several browser identifiers merge into one account without rewriting history.

### Behaviours (deliverable and tests)
- Design (PLAN section 2): game records stay attached to the anonymous identifier; an account owns a set of identifiers through a link table; reading history means joining through the link. Describe the tables, the merge and unmerge operations, and what happens if two accounts claim the same identifier.
- Migration plan from the step 2 storage, with a rollback.
- Account data minimised: an email address (needed for the magic link) and nothing else beyond the identifiers. Retention and deletion rules proposed for the user to approve.
- Tests on the storage layer for link, merge, history read and unlink on an in-memory or local store.

### Done when
The design is approved by the user and the tested storage layer passes. `npm test` passes.

### Out of scope
Sending emails, screens (7.2, 7.3).

---

## Epic 7.2: Magic link sign-in

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 7, epic 7.2 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 4, 10, 12), RULES.md.
Depends on: 7.1. Present a plan for this epic and wait for validation before coding. Choosing an email service, buying anything or touching PLAN section 10 items needs the user's agreement first.

### Goal
A player can sign in with a one-time link sent by email, with no password and no third-party login.

### Behaviours (target for tests)
- An email-sending service chosen in the plan: compare price, EU data location, deliverability and licence from their documentation, and recommend one with the reasons.
- Link tokens: random, single use, short lifetime, stored hashed, with rate limits on requests per address and per identifier; the response never reveals whether an address exists.
- Sign-in creates a session in a secure, HttpOnly cookie (verify the current browser rules in the documentation); sign-out and session expiry work.
- Email text is in the translation files in all four locales and carries no tracking pixel.
- Tests cover token creation, use, expiry, reuse refusal, rate limits, and session handling, with the email sender faked.

### Done when
Tests pass and a staging email flow works with a real mailbox. `npm test` passes.

### Out of scope
Claiming and merging history (7.3).

---

## Epic 7.3: Claim history and merge identities

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 7, epic 7.3 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 8), RULES.md, the design from 7.1.
Skills to use: vue-best-practices, frontend-design, accessibility, responsive-design.
Depends on: 7.1, 7.2. Present a plan for this epic and wait for validation before coding.

### Goal
A signed-in player can attach the current browser's history to their account and merge several browsers.

### Behaviours (target for tests)
- "Save my history" from the settings or result screen: after signing in, the current identifier is linked to the account.
- Signing in from a second browser links its identifier too; history from all linked identifiers appears together, read through the link table (nothing rewritten).
- A player can unlink an identifier; its games stay with that identifier.
- A history screen listing matches (result, mode, date) from all linked identifiers.
- A seat in a running match stays bound to its identifier: signing in mid-match changes nothing about the match.
- Text from translation files, layouts tolerant of longer strings, keyboard and screen-reader support. An end-to-end test covers claim, a second browser and unlink.

### Done when
Server and end-to-end tests pass and `npm test` passes.

### Out of scope
Ratings, friends lists.

---

## Epic 7.4: Anonymous path regression

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 7, epic 7.4 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 8), RULES.md.
Depends on: 7.3. Present a plan for this epic and wait for validation before coding.

### Goal
Playing without an account works exactly as before.

### Behaviours (checks)
- A test suite that never signs in: solo, room, quick match, rematch, tutorial, reset identity, reconnect, forfeits, and the privacy notice link all pass unchanged.
- No screen blocks on, or nags about, sign-in. Account features are optional and discoverable only from settings and the result screen.
- Reset identity for an anonymous player still deletes their record and unlinks their games; for a signed-in player the effect on the account is defined in 7.5.
- Run the full existing end-to-end suite and compare with the results before step 7.

### Done when
All earlier end-to-end tests pass without modification. `npm test` passes.

### Out of scope
New features.

---

## Epic 7.5: Account privacy, deletion and launch

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 7, epic 7.5 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 8, 10, 12), RULES.md.
Depends on: 7.3, 7.4. Present a plan for this epic and wait for validation before coding. PLAN section 10 items need the user's agreement first.

### Goal
Accounts are covered by the privacy notice and a player can leave completely.

### Behaviours (tests and deliverable)
- Update the privacy notice in all four languages for the email address, sessions and linked identifiers, and the retention rule; the user approves it and a qualified person checks it (GDPR, France).
- "Delete my account": removes the email, sessions and links, and either unlinks or deletes the games as the user decides in the plan (proposed default: unlink them and keep the anonymous records, as in the identity reset).
- Data export of what is stored for the account (a GDPR right): what it contains and how it is delivered are proposed for approval.
- Tests cover deletion, export and session cleanup.
- Ask the user before deploying to production and before any email-service purchase (PLAN section 12).

### Done when
The tests pass, the notice is approved and the feature is deployed with the user's agreement. Roadmap step 7 is then complete.

### Out of scope
Payments, social login.
