# Roadmap step 6: localisation (6 epics)

How to use: copy one epic section (from its `##` heading to the next `---`) into a new Claude session. Do the epics in order. Roadmap definition of done: `docs/reference/PLAN.md` section 11, step 6, with the approach of section 9. Requires step 5 to be complete. Languages: English, French, Spanish, German.

---

## Epic 6.1: Final names and trademark search

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 6 (localisation), epic 6.1 of 6.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 9, 10, 13), RULES.md.
Depends on: roadmap steps 4 and 5 (art direction decided). This epic is mostly the user's decision. Present a plan and wait for validation before acting. Section 10 items need the user's agreement first.

### Goal
The final product name and the final names from PLAN section 13 exist, in all four languages.

### Behaviours (deliverable)
- A name proposal sheet per slot of PLAN section 13: product name, the words for "blessing" and "Shepherd", the three base types and the prefix for the regular form, 9 blessings, 6 Shepherd blessings, the nullified Shepherd, the Marked status, optional character names and lore. Each candidate comes with its four-language version.
- Combination check: every blessing label must combine with each type ("Just Sword" pattern) in each language, gender and agreement included. Show the full grid of combinations for review.
- Trademark search guidance for INPI and EUIPO, and domain and social handle checks, before any purchase (PLAN section 10). The user runs the searches or hires help; Claude lists the exact things to check and does not claim a name is free. Do not buy a domain without the user's agreement.
- Names must not be the original's words (PLAN section 2).
- Renaming the repository, the domain and the published pages is listed as a checklist; GitHub redirects the old repository URL.

### Done when
The user has approved the names in all four languages and the trademark and domain checks are done by the user.

### Out of scope
Applying the names in the code (6.3).

---

## Epic 6.2: Localisation infrastructure

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 6, epic 6.2 of 6.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 9, 12), RULES.md, README.md.
Skills to use: vue-best-practices, responsive-design, accessibility, seo.
Depends on: roadmap step 5. Present a plan for this epic and wait for validation before coding.

### Goal
The app and the site can serve four locales, with the language switcher, before any text is translated.

### Behaviours (target for tests)
- Locale files for `en`, `fr`, `es`, `de` with the same keys; a test fails if a key is missing in any locale or has a different set of plural and gender variants.
- Language detection from the browser with a visible switcher that remembers the choice (local storage, try/catch).
- Locale-aware number, date and time formatting.
- Content pages in one folder per locale (the structure exists since step 1b), routing and the language switcher on the site.
- A check that layouts hold with strings 30 to 40 percent longer (German in particular) in cells, buttons and the result card, using the pseudo-locale from step 1 plus real German strings later.
- `lang` attribute and `dir` set correctly on every page.

### Done when
Tests cover key parity, formatting, switching and persistence. `npm test` passes.

### Out of scope
The translations themselves (6.3, 6.4).

---

## Epic 6.3: Game UI, names and tutorial translation

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 6, epic 6.3 of 6.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 9, 13), RULES.md, the approved names from 6.1.
Depends on: 6.1, 6.2. Present a plan for this epic and wait for validation before coding.

### Goal
The whole game is available in French, Spanish and German.

### Behaviours (target for tests and checks)
- The approved final names land in the translation files, one entry per locale, with no code change (the acceptance test of PLAN section 2 again).
- Translate the game UI, effect labels and explanations, the tutorial, the result card, error messages and accessibility labels. Plurals and gender handled; length checked against the layouts.
- Claude drafts the translations; each language is reviewed by a native or fluent speaker the user designates (6.5). Claude marks each file as unreviewed until then.
- Game vocabulary reads as a coherent set in each language, and the full combination grid of blessing and type labels is tested for presence and length.

### Done when
All keys are translated in every locale, the key parity test passes, layouts hold in every language, and `npm test` passes.

### Out of scope
Content pages (6.4), reviewer sign-off (6.5).

---

## Epic 6.4: Content pages, SEO and legal texts in each language

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 6, epic 6.4 of 6.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 7, 9, 10), RULES.md.
Skills to use: seo, web-quality-audit.
Depends on: 6.2, 6.3. Present a plan for this epic and wait for validation before coding. Legal texts (PLAN section 10) need the user's agreement.

### Goal
The site is indexed per language.

### Behaviours (target for checks)
- Translate the home, rules, FAQ and per-blessing, strategy and per-piece pages, the privacy notice, terms, the publisher page and the store-style metadata (titles, descriptions, Open Graph). Legal texts need a qualified human check in each language, and the user decides who does it.
- `hreflang` between all locales (including `x-default`), a sitemap per locale, canonical URLs, and correct `lang` metadata. Verify current search engine guidance in their documentation.
- The keyword intent ("play online / with friends / against a bot") is researched per language rather than literally translated, with sources.
- Register the new locales in Search Console and Bing (the user's action, Claude prepares).
- A test checks every built page for title, description, hreflang reciprocity and canonical tags in every locale.

### Done when
The test passes, the audit is attached and `npm test` passes.

### Out of scope
Adding languages beyond the four.

---

## Epic 6.5: Native review of game vocabulary

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 6, epic 6.5 of 6.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 9, 13), the locale files.
Depends on: 6.3. Present a plan for this epic and wait for validation before acting.

### Goal
A fluent speaker has checked each language's game vocabulary.

### Behaviours (deliverable)
- A review kit for each language: the grid of all blessing and type combinations, the effect explanations, the Shepherd names, sample screens, and a short questionnaire (does it read naturally, is the set coherent, is any word taken or confusing, gender and agreement).
- A way to collect and apply feedback: the reviewer edits the locale file or lists changes; Claude applies them and reruns the key parity and length tests.
- A review log in the repository: language, reviewer role (no personal data without consent), date, outcome. Files are marked reviewed only after sign-off.

### Done when
Each of the four languages is signed off by its reviewer and marked reviewed. Roadmap step 6 is then complete.

### Out of scope
Professional translation of the legal texts (6.4, the user's decision).

---

## Epic 6.6: Localised game feel and regression pass

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 6, epic 6.6 of 6.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 8, 9), RULES.md.
Skills to use: accessibility, responsive-design, web-quality-audit.
Depends on: 6.3, 6.4. Present a plan for this epic and wait for validation before coding.

### Goal
Nothing broke when the languages arrived.

### Behaviours (checks)
- End-to-end tests of a full solo match, a room match and the tutorial in each locale.
- Screen-reader labels checked per language; no text baked into images or sounds (PLAN section 9). The result card is checked per locale.
- A web quality audit per locale, with findings fixed or listed.
- Final names checked in every place they appear (UI, pages, metadata, manifest, result card), with an automated scan for leftover working names.

### Done when
All tests and audits pass. `npm test` passes.

### Out of scope
New features.
