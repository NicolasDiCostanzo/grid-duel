# Roadmap step 8 (optional): Android app (3 epics)

How to use: copy one epic section (from its `##` heading to the next `---`) into a new Claude session. Epic 8.1 is a decision that must be taken before the first outside contribution, so before step 2 ends; the other epics come after step 7 (the store listing needs the final names from step 6). Roadmap definition of done: `docs/reference/PLAN.md` section 11, step 8. iOS and Steam are out of scope. Store rules and fees change: verify each in the primary documentation when the epic starts. Submitting to the store and any payment need the user's agreement first.

---

## Epic 8.1: Copyright holder and contributor agreement

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 8 (Android app), epic 8.1 of 3.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 10, 11), LICENSE, README.md.
Depends on: nothing. Do it before CONTRIBUTING.md is published and before the first outside contribution. Present a plan and wait for validation. This is a legal question: Claude prepares the facts and options, a lawyer decides.

### Goal
A written decision on who holds the copyright and how outside contributions are handled, so the project can later grant a licence exception or change licence if a store needs it.

### Behaviours (deliverable)
- Facts to establish with the user: who holds the copyright today (the user, or an employer if any of the work falls under an employment or contract clause), and whether anyone else has already contributed.
- Check Google Play's current developer terms against the AGPL-3.0 from primary sources. Earlier searches only raised the AGPL conflict for Apple's App Store (contested, from forums), which is out of scope, and did not examine Google Play.
- Options with consequences: (a) sole copyright holder plus a contributor licence agreement or copyright assignment for every outside contribution; (b) accept AGPL-only contributions and give up any exception or relicensing; (c) stay a web and PWA game only. Include how each is enforced in practice (a CLA bot, a sign-off).
- A draft contributor agreement or notice wording for a lawyer to review, if the user chooses (a).
- The decision recorded in README.md and CONTRIBUTING.md and ticked in PLAN section 10.

### Done when
The user has decided with legal advice and the decision is written in the repository.

### Out of scope
Building anything.

---

## Epic 8.2: Android shell and offline bundling

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 8, epic 8.2 of 3.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 4, 8, 12), RULES.md, the protocol document, README.md.
Skills to use: performance, accessibility, responsive-design.
Depends on: roadmap step 7 and epic 8.1. Present a plan for this epic and wait for validation before coding. Changing the stack or adding a dependency whose licence is unclear needs the user's agreement.

### Goal
The existing web app runs as an Android app, with the browser version unchanged.

### Behaviours (target for tests and checks)
- Approach chosen in the plan with reasons, verified in the tools' documentation. Two candidates: a Capacitor-style shell that bundles the built client, or packaging the installable PWA from step 4 as a Trusted Web Activity. Compare offline behaviour, update flow, tool licence and maintenance, and recommend one.
- Solo works fully offline, with its own error and offline states instead of a browser error page.
- The server address comes from configuration. Identity works through the token in the protocol (epic 2.3) in case the shell's origin differs from the server. Check that rooms, reconnect and forfeits behave in the app.
- Storage access stays wrapped in try/catch; audio starts after the first interaction; the haptic pulses from PLAN section 6 work in the app.
- A build script for a signed release, with the signing key stored outside the repository.
- No game logic or layout file changes except through configuration (check the diff), and the browser build is unchanged.
- A smoke test on an emulator or device: the app starts, plays a solo match offline, and joins a room online.

### Done when
A debug build passes the smoke test and `npm test` passes.

### Out of scope
Store listing and submission (8.3), iOS.

---

## Epic 8.3: Google Play submission

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 8, epic 8.3 of 3.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 9, 10, 12), the privacy notice, epic 8.2 output.
Depends on: 8.1, 8.2, roadmap step 6 (final names). Present a plan and wait for validation before acting. The user owns the console account; paying, accepting terms and submitting are the user's actions.

### Goal
The Android app is submitted to Google Play.

### Behaviours (deliverable and checks)
- Account type: according to Google's Play Console help page, personal accounts created after 13 November 2023 must run a closed test with at least 12 testers opted in for 14 continuous days before applying for production, while organisation accounts are reported exempt but need a D-U-N-S number. Verify the current rules on Google's page and ask the user which account type to use.
- Store listing text in all four languages from the translation files, using the final names; screenshots from the real app; no use of the original's name or art (PLAN section 2).
- Data safety and content rating answers consistent with the privacy notice (identifier, analytics, retention).
- A test plan for the closed testing period with real testers found by the user.
- No secrets in the repository.

### Done when
The submission is made by the user and the listing, answers and build are recorded in README.md without credentials. Roadmap step 8 is then complete.

### Out of scope
Paid features, ads.
