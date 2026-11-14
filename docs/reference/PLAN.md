# Project plan: online board game inspired by Flockade

This file is the reference for the project. Read it at the start of a session and work on one roadmap step at a time; when a decision changes, update the relevant section of this file. When this plan and the code disagree, say so and ask before choosing.

## 1. What we are building

A free web game for two players, inspired by Flockade, the mini-game from Cult of the Lamb (Woolhaven DLC). Three ways to play:

1. Friend room: create a room, share a code, a friend joins.
2. Public lobby or quick match: play against a stranger.
3. Solo: play against a bot with three difficulty levels.

Target: a complete, polished, shareable game that works on phone and desktop. Development and content happen in English first; the game is then localised into French, Spanish and German at the end of the roadmap (see §9). The project is open source, developed in a public GitHub repository.

### Rules

The game follows the original Flockade rules as documented on the Cult of the Lamb wiki: https://cult-of-the-lamb.fandom.com/wiki/Flockade. That page is the single reference for every rule question (boards, draft, turn order, duels, ties, blessings, Shepherds, resolution order). A copy of its text is kept in the repository at `docs/reference/flockade-rules.md` (source and CC BY-SA licence noted at the top) so sessions can read it offline and the implemented version of the rules is frozen; the engine follows that file, and the file is refreshed from the wiki only on purpose. Game mechanics are not protected by copyright, so we implement them faithfully; only names, art, sounds and texts are ours (see §2). Where the wiki is silent or ambiguous, choose the simplest reading, write it down in `RULES.md` with a note that it is an interpretation, and move on.

## 2. Hard constraints

These hold for the whole project. Each has a reason so you can apply it to cases not listed.

- **Original branding.** The product name, domain, piece names, blessing names, illustrations, sounds and texts are ours, because names and art are protected even though mechanics are not. The words "Flockade" and "Cult of the Lamb" appear only in factual descriptive sentences on content pages (see §7), with a visible "not affiliated with Massive Monster or Devolver Digital" line.
- **No account, pseudonymous identity.** Each browser gets an anonymous identifier on first visit, kept in the browser (localStorage and, once a server exists, a long-lived cookie set by the server, because Safari can evict localStorage after 7 days without a visit). No email, no password, no third-party login. Accounts may come later (§11, step 7), so game history must be attached to that identifier in a way that lets several identifiers be merged into one account without rewriting history. The server also accepts the identifier as a token carried in the protocol, not only as a cookie, so that wrapped apps (§11, step 8), which run from another origin, can play.
- **Fair online play.** In multiplayer the server decides: random draws happen server-side and a client cannot alter the game state on its own. Every game can be replayed from a recorded seed.
- **Pieces are distinguishable by shape, not only colour.** Colour-blind players and small cells on mobile both need this. It also constrains the future illustration brief.
- **Everything the player sees is a placeholder until decided.** No name has been chosen: not the product name, not the pieces, effects or categories (§13). No visual direction has been chosen either: the first release uses simple placeholder shapes, sounds and colours. Both must be trivial to replace later:
  - Every displayed name, the product name included, comes from the translation files and nowhere else. Code identifiers, file names, CSS classes, repository name and URLs never contain a working name, so renaming the product or a piece is a translation-file edit, not a search-and-replace in code.
  - Every visual and audio asset is referenced by a stable name and can be swapped as a set (a complete new look drops in without touching game logic or layout code). Colours, fonts and spacing are defined once as design tokens, so a new visual identity is a token change plus new assets.
  - The repository's name is a neutral working name, not the product name; it will be renamed once the product name is chosen (GitHub redirects the old URL). Nothing in the code, the packages or the published pages derives a displayed name from it.
  - Acceptance test, to run at the end of step 1 and again at step 4: rename every piece and the product, and swap all placeholder assets for a dummy second set, in under an hour and without a single code change. If it takes longer, fix the structure before moving on.
- **Every asset has a licence we can use.** Sounds, fonts, illustrations: CC0, permissive licences, or commissioned. `CREDITS.md` lists each asset with its source and licence.
- **Public repository, AGPL-3.0.** The code is licensed under the GNU AGPL-3.0, so anyone who runs a modified version online must publish their changes. Everything committed is public from day one: no secrets, tokens or personal data in the repo, the AGPL-3.0 text in `LICENSE` at the root, a `README.md` that explains how to run and contribute, and asset licences compatible with redistribution (a CC-BY sound is fine with attribution in `CREDITS.md`; a "personal use only" asset is not). Store distribution (§11, step 8) may need an exception to the AGPL-3.0 that only the copyright holders can grant, so who holds the copyright, and whether outside contributions come under a contributor agreement, is decided before `CONTRIBUTING.md` is published.
- **EU defaults.** The publisher is in France. Privacy notice, "reset my identity" button and a data retention rule exist from the first server deployment, because a persistent identifier is pseudonymous personal data under GDPR.

## 3. Scope of the rules

- The whole game is implemented at once, in step 1: every rule, every piece and every effect described on the wiki page, with their resolution order. Nothing from the wiki is left for a later step, except two deliberate omissions and one deliberate change, each recorded in `RULES.md` as a difference from the original: the Trickster+ Shepherd blessing (marked unused on the wiki), betting (no accounts, no currency), and the tied match (play continues until one player has at least 2 round wins and more than the opponent). Both board sizes are implemented from step 1: 2x2 with 4 duels and 2x3 with 6 duels.
- The plan states no rule; the wiki is the only source. Anything the wiki does not specify (for instance how pieces are weighted when drawn, since the original ties the pool to what a player has unlocked and we have no unlocking) is decided by the simplest reading, tuned by simulation where balance is involved, and recorded in a `RULES.md` file in the repository as an interpretation.
- Online-play additions that are not game rules: a move timer (30 s default, auto-pass after timeout) and a forfeit after 3 consecutive timeouts or 60 s of disconnection.

## 4. Tools

Only the tools are fixed here. Code structure, data model, protocol and internal design are decided as the work progresses and documented in the repository (`README.md`, `RULES.md`, project skills), not in this plan.

- Language and tooling: TypeScript, npm workspaces, Vitest, ESLint and Prettier.
- Client: Vite and Vue 3.
- Content pages: Astro, with the Vue game embedded.
- Hosting and backend: Cloudflare (Pages for static content, Workers and Durable Objects for multiplayer rooms, D1 or KV for persistence). Alternative if Cloudflare proves awkward: a small Node WebSocket server on Fly.io or a VPS.
- Analytics: a cookie-free, privacy-friendly tool (Plausible, Umami or similar). Error tracking on client and server.
- Source control and CI: GitHub, with tests on every pull request.
- Development: Claude Code with the skills listed in §12.

No library is imposed. Pick what fits when the need arises (schema validation, property testing, end-to-end tests, animation, audio, i18n, image rendering for the result card, particles), record each choice and its reason in `README.md`, and prefer dependencies that are maintained, AGPL-compatible (MIT, BSD, Apache-2.0, LGPL, GPL) and keep the client bundle small. Ask before adding anything whose licence is unclear.

## 5. Bot

Three levels, described by behaviour; how they are implemented is open.

- Easy: plays legal moves at random. Beatable by anyone who has understood the rules.
- Medium: counters what it can see on the board and otherwise plays randomly; ignores effects when choosing. Beatable with some thought.
- Hard: plays as well as the information allows, taking effects and resolution order into account, and exploits whatever advantages the rules give. A move must take under 500 ms on a mid-range phone.

The bot only receives what a human opponent would see; it never reads the player's hidden hand or future draws. The game is small enough that a strong bot is feasible; the work is in making the weaker levels feel human rather than random.

## 6. Game feel (added progressively, each tied to an event)

- Placement: card lift on hover, ghost on target, squash-and-stretch pop (~150 ms), dust ring, low thud with ±5% pitch variation. Opponent's piece slides in from their side after a short delay.
- Duel phase: anticipation beat (300 to 500 ms) before the first duel; per cell, focus on the pair, hit-stop 60 to 100 ms, winner scales and glows, loser cracks and falls, point flies to the counter which ticks. Screen shake scaled to stakes (none on tie, light on an ordinary win, strong on a high-value duel), with a capped amplitude. Slow motion on the deciding duel. Loss animations as satisfying as wins.
- Blessings: one sound per family, glow and a one-word label so players learn effects.
- Audio: sound starts on the first user interaction (browsers require it); mute toggle visible immediately; two music layers (placement, duel) with ducking; separate music and SFX volumes. `navigator.vibrate` short pulses on supported devices.

## 7. SEO and content

Goal: own the "play flockade online / multiplayer / with friends / against a bot" intent, in English first and in each supported language once localised. We do not compete with the wiki or Steam guides on the rules themselves.

- Pages served as real HTML that search engines can read without running the game: home, rules (our names, mapping to the original, differences), FAQ (`FAQPage` schema), later one page per blessing and a strategy page.
- One `<title>` and meta description per page, proper headings, `VideoGame` or `WebApplication` schema on the home page, `hreflang` between all published locales (English only until the localisation step, §9), `sitemap.xml`, Open Graph image (the shareable result card doubles as this).
- Register in Google Search Console and Bing Webmaster Tools at first deployment.
- Distribution after the lobby exists: r/CultOfTheLamb, the game's Discord, itch.io listing, comment on the Steam guide, wiki mention if their rules allow it.

## 8. Quality and operations

- Rules: automated tests for every rule and effect and their interactions, plus randomised tests that no sequence of legal moves can reach an invalid state.
- Bot: tests that hard beats medium beats easy over many simulated games; a simulation tool reports win rates, first-player versus second-player advantage, per-effect impact and draw-weight effects. Run it before any rules or balance change ships.
- Client: tests for the board and hand; an end-to-end test of a full solo match.
- Server: tests for join, leave, reconnect and timeout, and for rejection of illegal moves.
- Observability: analytics events (match started, finished, abandoned, mode), error tracking, uptime check, budget alert on hosting.
- Data retention: finished rooms deleted within days; game records kept; "reset my identity" deletes the player's record and unlinks their games.
- Deploys never change rules while games are in progress.
- Public changelog and a feedback channel (one-field form or Discord).
- Accessibility: keyboard play, screen-reader labels, no meaning carried by colour or sound alone.

## 9. Localisation

Languages: English (development and first release), then French, Spanish and German, delivered together in the localisation step of the roadmap (§11). Translation is the last step, but the product is built so that it is translation work and not a rework.

Built in from day one, in the English-only product:
- Every user-facing string is kept in translation files, including the product, piece, blessing and Shepherd names (see §13), with proper handling of plurals and gender; no text is baked into images or sounds.
- Locale-aware number, date and time formatting.
- Layouts that tolerate strings 30 to 40 % longer than English (German in particular) in cells, buttons and the result card.
- Content pages structured as one folder per locale from the start, even if only `en` exists.

In the localisation step:
- Translate the game UI, the tutorial, the content pages (home, rules, FAQ, per-piece pages), the result card, the privacy notice and the store-style metadata (titles, descriptions, Open Graph).
- A fluent speaker reviews each language, with particular attention to the game vocabulary: piece, blessing and Shepherd names must combine naturally ("Just Sword" patterns) and read as a coherent set in each language.
- Language switcher, `hreflang` between all locales, per-locale sitemaps and Search Console registration.
- Translation files are the place where the final names from §13 land, one entry per locale.

## 10. Legal and launch checklist

- [ ] Trademark search for our name on INPI and EUIPO; check domain and social handles. Do this before buying the domain.
- [ ] Non-affiliation line on every content page and in the app footer.
- [ ] Privacy notice (pseudonymous id, analytics tool, retention), "reset my identity" button.
- [ ] Publisher identification page as required by the French LCEN (an individual may name the host instead of themselves; verify current wording).
- [ ] Terms of use, contact.
- [ ] `CREDITS.md` complete.
- [ ] Copyright holder and contributor agreement decided (§2), before `CONTRIBUTING.md` is published and before the first outside contribution.
- [ ] `LICENSE` (AGPL-3.0), `README.md` and `CONTRIBUTING.md` present; repository description and topics set on GitHub.
- [ ] Soft launch to friends (after step 2), fix, then public posts (after step 5).

## 11. Roadmap

Each step has a definition of done. Finish and verify a step before starting the next, unless the user asks otherwise.

**Step 1: engine, bot, solo prototype**
Done when: the engine implements every rule, piece and effect from the wiki (with the deliberate differences listed in §3), with tests for each effect and their interactions, and a simulation balance report; the three bot levels exist and the simulation tool shows hard > medium > easy; a person can play a full solo match on both board sizes with placeholder visuals, labels that explain each effect, basic placement feel and sound, mute toggle, all text in translation files with English as the only language; the rename-and-reskin acceptance test from §2 passes; deployed and reachable online.

**Step 1b: content pages indexed**
Done when: home, rules and FAQ exist in English with schema, sitemap and OG image; non-affiliation line present; site registered in Search Console and Bing; privacy notice and identity reset exist.

**Step 2: rooms and friend code**
Done when: a room can be created and joined by code; a full match plays between two browsers with the server in control of the game; a disconnected player returns to their game; timers, forfeits, rate limits, nickname filter and emotes work; players and results are stored; legal pages published. Soft launch to friends.

**Step 3: duel-phase feel and onboarding**
Done when: duel animations (hit-stop, shake, slow motion) and one sound per blessing family exist; interactive tutorial (90 s, covering placement, a duel and a blessing) and rematch button exist; shareable result card is generated at match end.

**Step 4: art direction and polish**
Done when: illustrated visuals replace the placeholders without changes to game logic (the §2 acceptance test is how this is checked); music layers and SFX set complete; PWA installable with offline solo; long-tail content pages (per blessing, strategy) published; analytics and error tracking live.

**Step 5: public lobby or quick match**
Done when: strangers can be matched without sharing a code; abandons and idle rooms are handled; moderation (report, block) exists for whatever social features are present. Public launch posts.

**Step 6: localisation**
Done when: the game, the tutorial and the content pages exist in English, French, Spanish and German, with a language switcher, `hreflang` and per-locale sitemaps; a native or fluent reviewer has checked each language's game vocabulary (the piece, blessing and Shepherd names in particular); the final names from §13 are in place in every locale.

**Step 7: optional accounts**
Done when: a player can claim their history with a magic link; several browser identities merge under one account; the anonymous path still works unchanged.

**Step 8 (optional): Android app**
Done when: an Android app (a shell around the web app) is submitted to Google Play; the licensing for the store is settled; solo works offline in the app; the game in the browser is unchanged. iOS and Steam are out of scope.

## 12. Working conventions for Claude Code sessions

- Start by reading this file and the git log; state which step you are on.
- Keep the game rules in one place, separate from display and networking, so solo, multiplayer and the bot share them.
- Add or update tests with every rule or protocol change; run `npm test` before declaring a step done.
- Prefer small, reviewable commits with messages that name the roadmap step.
- When a decision in this plan turns out wrong or incomplete, propose the change, update this file once agreed, and keep going.
- Ask before: buying anything, deploying to production for the first time, changing the stack, adding a dependency whose licence is incompatible with the AGPL-3.0, or touching anything in §10.
- Skills available on the author's machine (personal, `~/.claude/skills/`): `frontend-design`, `responsive-design`, `vue-best-practices`, `accessibility`, `seo`, `performance`, `web-quality-audit`, `skill-creator`. Use them when their descriptions match the task (`vue-best-practices` for any Vue component or composable, `responsive-design` when laying out screens); `web-quality-audit` before each deploy. Project guidance for sessions lives in the root `CLAUDE.md`, which points to `docs/reference/flockade-rules.md` and `RULES.md` (interpretations) and, from step 2, to the protocol documentation. Create a project skill in `.claude/skills/` only when a session repeatedly needs details that `RULES.md`, the code and `README.md` do not give.
- Commands (fill in once the repo exists): `npm install`, `npm run dev`, `npm test`, `npm run simulate`, `npm run deploy`.

## 13. Open decisions

All user-facing names are still to be decided, after the trademark search (§10) and the art direction (step 4), and before the localisation step (§9). Until then, use plain English working names that are not the original's words (the content pages ship in step 1b, before the final names exist, and §2 forbids the original's names anywhere in the product); the list below uses the original's words only to identify each slot. Deciding a name changes one entry per language.

The inventory to decide, counted from the original rules:

- The product name (also domain and handles).
- Two category words: the piece effects ("blessing") and the fourth piece type ("Shepherd").
- The three base piece types, and the prefix for their plain, unblessed form if one is wanted.
- Nine blessings on the three types: Just, Fallen, Risen, Prize, Rotten, Scout, Mercenary, Marked, Trickster. Each label combines with each piece ("Just Sword"), so the words must combine naturally in every language.
- Six Shepherd blessings: Lone, Wandering, Guardian, Rotten+, False, Golden, plus a name or visible state for a Shepherd whose blessing has been nullified.
- The status carried by Marked pieces that Guardian reacts to.
- Optional flavour: a character name and a one-line lore text for each piece, which also feeds the per-piece content pages.

Not to be named: modes, ways to play, phases, round, match, points.
