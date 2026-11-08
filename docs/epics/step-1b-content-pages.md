# Roadmap step 1b: content pages indexed (5 epics)

How to use: copy one epic section (from its `##` heading to the next `---`) into a new Claude session. Do the epics in order. Roadmap definition of done: `docs/reference/PLAN.md` section 11, step 1b. Requires step 1 to be complete.

---

## Epic 1b.1: Astro site with the game embedded

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 1b (content pages indexed), epic 1b.1 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 4, 7, 9), RULES.md.
Skills to use: vue-best-practices, frontend-design, seo.
Depends on: roadmap step 1 (client and deployment). Present a plan for this epic and wait for validation before coding.

### Goal
An Astro site that serves real HTML pages and embeds the existing Vue game, with the locale structure ready.

### Behaviours (target for checks)
- A new workspace package for the site (neutral name). The Vue game is embedded as an island and still plays a full solo match.
- Pages live in one folder per locale from the start (`en` only for now), PLAN section 9.
- Shared design tokens and the same translation files as the game: no displayed name is hard-coded in a page.
- A header and footer shared by all pages, the footer carrying the non-affiliation line ("not affiliated with Massive Monster or Devolver Digital").
- `npm run build` outputs static HTML. A test checks that the built home page contains its main text without running JavaScript.
- The existing deployment (step 1, epic 1.13) publishes the site.

### Done when
The site builds, the embedded game plays, the built HTML is readable without JavaScript, and `npm test` passes.

### Out of scope
Page content (1b.2), sitemap and metadata (1b.3), privacy page (1b.4).

---

## Epic 1b.2: Home, rules and FAQ pages

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 1b, epic 1b.2 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 7, 13), RULES.md, docs/reference/flockade-rules.md.
Skills to use: seo, frontend-design.
Depends on: 1b.1 (Astro site). Present a plan for this epic and wait for validation before coding.

### Goal
Three English pages that own the "play online / multiplayer / with friends / against a bot" intent without competing with the wiki on the rules themselves.

### Behaviours (target for checks)
- Home: what the game is, three ways to play (solo available now, friend room and public match marked as coming later), a play button. A factual descriptive sentence may name the original game and Cult of the Lamb, next to the non-affiliation line (PLAN section 2).
- Rules page: our placeholder names, a mapping table to the original's slots, and the differences from the original (from RULES.md: no Trickster+, no betting, interpretations). The tables are generated from the catalog and translation files so they never drift.
- FAQ page with `FAQPage` structured data. Questions drafted for the user to approve.
- No illustration, name or text taken from the original game or the wiki beyond factual descriptions.

### Done when
Pages build, structured data validates (verify the validator in the official docs), and a test checks that the original's words appear only in the allowed factual sentences. `npm test` passes.

### Out of scope
Sitemap and Open Graph (1b.3), per-blessing and strategy pages (roadmap step 4).

---

## Epic 1b.3: Search metadata, sitemap, Open Graph image

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 1b, epic 1b.3 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (section 7), RULES.md.
Skills to use: seo, performance, web-quality-audit.
Depends on: 1b.2 (pages). Present a plan for this epic and wait for validation before coding.

### Goal
Every page is correctly described for search engines and social sharing.

### Behaviours (target for checks)
- One `<title>` and meta description per page, one h1 and a proper heading order, canonical URLs.
- `WebApplication` or `VideoGame` structured data on the home page (pick one in the plan and say why).
- `sitemap.xml` and `robots.txt`; `hreflang` only for `en` for now.
- A static placeholder Open Graph image (the shareable result card of roadmap step 3 will replace it), generated from design tokens and translation strings, no original artwork.
- A web quality audit with the findings fixed or listed.

### Done when
A test checks every built page for title, description, canonical and OG tags; the audit report is attached; `npm test` passes.

### Out of scope
Search Console and Bing registration (1b.5).

---

## Epic 1b.4: Privacy notice and identity reset

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 1b, epic 1b.4 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 2, 8, 10), RULES.md.
Skills to use: accessibility.
Depends on: 1b.1 (site). Present a plan for this epic and wait for validation before coding. PLAN section 10 items need the user's agreement before they are touched.

### Goal
An anonymous identifier exists in the browser, with a privacy notice and a "reset my identity" button.

### Behaviours (target for tests)
- On first visit the client creates a random anonymous identifier stored in local storage (reads and writes wrapped in try/catch, the app works without it). No email, no password, no third-party login (PLAN section 2).
- The identifier is a single module with a clear interface, so the server-set cookie of roadmap step 2 and the future account merge (step 7) can be added without changing its callers.
- A "reset my identity" button deletes the identifier and creates a new one after confirmation.
- A privacy notice page in English: what is stored (the pseudonymous identifier, nothing else at this stage), why, retention, how to reset. Draft for the user to approve; the legal wording needs a human check (GDPR, France).
- The notice is linked from the footer on every page.

### Done when
Tests cover creation, persistence, reset, and behaviour when storage is unavailable. The user has approved the notice text. `npm test` passes.

### Out of scope
Server-side identity and cookie (step 2), the French publisher page and terms (step 2).

---

## Epic 1b.5: Search engine registration

Project: grid-duel, a free two-player web board game inspired by Flockade. Roadmap step 1b, epic 1b.5 of 5.
Read first: CLAUDE.md, docs/reference/PLAN.md (sections 7, 10, 12).
Depends on: 1b.3 (sitemap and metadata), the site deployed. Present a plan for this epic and wait for validation before acting.

### Goal
The site is registered in Google Search Console and Bing Webmaster Tools and its sitemap submitted.

### Behaviours (target for checks)
- Claude prepares the verification method (verify the current options in each tool's documentation) and any file or meta tag it needs, then tells the user exactly what to do in each console. Registration uses the user's accounts, so the user does it.
- The sitemap is submitted in both tools and the result noted in README.md (date, status, no credentials).
- If the site still uses the default hosting address, say so: a domain bought after the trademark search (PLAN section 10) means registering again.

### Done when
Both registrations are confirmed by the user and noted in README.md. Roadmap step 1b is then complete.

### Out of scope
Buying a domain (needs the user's agreement), analytics (step 4).
