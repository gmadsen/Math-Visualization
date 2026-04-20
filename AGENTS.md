# Agent Guide

Read this file before making any change to the repository. Read [`ROADMAP.md`](./ROADMAP.md) immediately after to know what work is actually wanted — the roadmap defines current priorities and the dependency spine.

## Project goal

A single-file, interactive graduate-mathematics notebook in the spirit of 3Blue1Brown for aesthetic and Brilliant.org for pedagogy:

- Each topic is one self-contained HTML file (embedded CSS + JS, KaTeX from CDN, hand-written SVG widgets).
- Every major concept has a toy you can poke: a slider, a clickable diagram, a live computation.
- Every page ends concepts with a short quiz. Passing the quiz marks the concept *mastered*.
- Mastery is tracked locally and gates downstream concepts on [`pathway.html`](./pathway.html) (locked → ready → mastered), exactly like Brilliant's progression.

## Style reference — always read first

Before drafting a new page or editing widget code, **read [`category-theory.html`](./category-theory.html)** end-to-end. It is the canonical style template:

- `<head>` block (KaTeX loader, `:root` CSS variables, widget/readout/note classes, sticky sidebar TOC)
- Helper `<script>` block at the top of `<body>` with `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`
- `<nav class="toc">` + `<aside class="sidetoc">` pattern
- `<section class="hero">` with `<h1>` + `<p class="sub">`
- Numbered `<h2>` sections (`1. …`, `2. …`) each with a worked widget

When parallelizing: every agent spawned to draft or edit a page must read `category-theory.html` first so tone, markup, and helpers stay consistent across the notebook.

## House conventions

- **Colors** live in `:root`: `--bg`, `--panel`, `--panel2`, `--ink`, `--mute`, `--line`, plus accents `--yellow --blue --green --pink --violet --cyan`. Use these vars, never hex literals inside widgets.
- **KaTeX delimiters**: `$…$` inline, `$$…$$` display, plus `\(…\)` and `\[…\]`. Configured in the loader script — don't invent new ones.
- **Widget chrome**: wrap interactives in `<div class="widget">` with `<div class="hd"><div class="ttl">…</div><div class="hint">…</div></div>`. Use `.readout`, `.row`, `.note`, `.ok`, `.bad` for standard sub-elements.
- **Level badges** on index cards: `<span class="level prereq">prereq</span>`, `advanced`, or `capstone`. Match the roadmap's classification.
- **SVG**: use the shared helpers, include `viewBox`, let CSS size it. Text inherits `fill:var(--ink)` from the stylesheet.
- **Storage**: the only persistence mechanism is `MVProgress` (localStorage) for mastery state. Don't add ad-hoc `localStorage` keys, cookies, or IndexedDB — anything else goes in memory for the session.
- **Index sections** (as of 2026-04-19, 44 topics). When registering a new card, put it in one of:
  1. **Foundations** (blue) — naive set theory.
  2. **Algebra** (yellow/pink/violet mix) — abstract algebra, category theory, representation theory, commutative algebra, homological algebra.
  3. **Analysis** (pink/cyan) — real analysis, measure theory, complex analysis, functional analysis, operator algebras.
  4. **Geometry & topology** (violet/green) — point-set topology, algebraic topology, smooth manifolds, differential forms, differential geometry, Riemannian geometry, Lie groups, Riemann surfaces.
  5. **Number theory** (yellow/pink) — Galois, quadratic reciprocity, sums of squares, algebraic number theory, p-adics, Frobenius & reciprocity, class field theory.
  6. **Modular forms & L-functions** (cyan/pink) — upper half-plane, modular forms, theta functions, Hecke operators, Dirichlet series, L-functions, Galois representations.
  7. **Algebraic geometry** (green/cyan/violet) — projective plane, Bézout, schemes, sheaves, morphisms & fiber products, functor of points, elliptic curves, singular cubics, moduli spaces, sheaf cohomology, stacks.
- **Card color palette**: each card uses one of the six accent colors via the `.y`, `.b`, `.p`, `.g`, `.c`, `.v` classes on its thumb SVG. Pick a color that harmonizes with the section rather than strictly matching — variety inside a section is fine.
- **Cross-page callbacks**: when a concept's `prereqs` reference an id owned by another topic, the section ends with an `<aside class="callback">` listing "See also" links to the target anchors. Insertions are mechanical — run `node scripts/audit-callbacks.mjs --fix` after editing any `concepts/*.json` prereqs. The companion audit (`node scripts/audit-callbacks.mjs`, no flag) and a light smoke-test guard both enforce coverage.
- **Per-page changelog footers**: every topic HTML ends with a `<details class="changelog">` block seeded from `git log`. New content PRs that touch a topic page should prepend a changelog row via re-running `scripts/insert-changelog-footer.mjs` — it rebuilds the block in place, picking up any new commits to the page.

## Helper tools (in every page's top `<script>`)

```js
$(selector, root?)        // querySelector
$$(selector, root?)       // querySelectorAll → array
SVG(tag, attrs)           // create namespaced SVG element
drawArrow(svg, p1, p2, opts)   // curved arrow with optional label, marker auto-def'd
drawNode(svg, x, y, label, opts)  // circle + centered label
```

Copy the block verbatim from `category-theory.html` rather than rewriting.

### 3D widgets — vectors, projection, and rotation

Pages that render 3D surfaces or curves (e.g. `differential-geometry.html`, `smooth-manifolds.html`) keep a second helper block at the top of `<body>`. Copy it verbatim from [`differential-geometry.html`](./differential-geometry.html) — it provides:

```js
vsub, vadd, vscl, vdot, vlen, vnorm, vcross    // basic 3-vector ops (arrays of 3 numbers)
proj3(p, yaw, pitch)                           // isometric 3D → 2D projection, yaw around z, pitch around x
curvColor(t)                                   // diverging colormap for curvature-tinted meshes (−1..+1 → blue..white..red)
make3DDraggable(svg, draw, opts)               // pointer-drag → { yaw, pitch, dragging } state; calls draw() rAF-throttled
```

`make3DDraggable` is the canonical way to make a 3D widget rotatable. Usage pattern:

```js
function draw(){
  svg.innerHTML = '';
  const yaw = view.yaw, pitch = view.pitch;
  // decimate mesh density while dragging so the user sees smooth rotation:
  const NU = view.dragging ? 14 : 28;
  const NV = view.dragging ? 20 : 40;
  // ...project vertices via proj3(P, yaw, pitch), sort quads by z (painter's algorithm), fill polygons...
}
const view = make3DDraggable(svg, draw, { yaw: 0.75, pitch: 0.55 });
draw();
```

Three recurring gotchas:

- **Decimation on drag** — cut `NU`/`NV` (or whatever your mesh density knob is) while `view.dragging` is true, then the final `pointerup` triggers a full-resolution redraw automatically. Without this, heavy meshes chug on a drag.
- **Legends in viewport coords, not data coords** — if you place a legend with `translate(xmin, ymin + pad)` it will drift as the bounding box changes with rotation. Anchor legends at fixed viewport coordinates (e.g. `translate(-230, 155)`).
- **Readout should advertise the interaction** — include a `yaw … · pitch … — drag to rotate` line in the widget's `.readout` so the affordance is discoverable.

For widgets that also need a view slider (e.g. pre-existing `yaw`/`pitch` sliders), remove the slider — the drag interaction supersedes it and redundant controls confuse users.

## Quiz + progression (Brilliant-style)

Every new topic page should ship with quizzes for its concepts.

1. **Page wiring** — in `<head>`:
   ```html
   <script src="./js/progress.js"></script>
   <script src="./js/quiz.js"></script>
   <script src="./quizzes/bundle.js"></script>
   ```
   The bundle assigns `window.MVQuizBank = { <topic>: {...}, ... }`. `MVQuiz.init` reads it first and falls back to `fetch('./quizzes/<topic>.json')` for dev servers. Without the bundle tag, opening the page via `file://` shows "could not load" because browsers block local-file `fetch()`.

   At the bottom of `<body>`:
   ```html
   <script>
   (function(){
     function start(){ if(window.MVQuiz) MVQuiz.init('<topic-id>'); }
     if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
     else start();
   })();
   </script>
   ```
2. **Quiz placeholders** — drop at the end of each concept's section:
   ```html
   <div class="quiz" data-concept="<concept-id>"></div>
   ```
   The `data-concept` must match an `id` in `concepts/<topic>.json`.
3. **Quiz bank** — `quizzes/<topic>.json`. Each concept entry carries a **v1 tier** (`questions`, required) and an optional **hard tier** (`hard`, unlocked only after v1 is mastered):
   ```json
   {
     "topic": "<topic-id>",
     "quizzes": {
       "<concept-id>": {
         "title": "Readable title",
         "questions": [
           { "type": "mcq",     "q": "...", "choices": ["a","b","c"], "answer": 1, "explain": "..." },
           { "type": "numeric", "q": "...", "answer": 5,     "tol": 1e-6,  "explain": "..." },
           { "type": "complex", "q": "...", "answer": [3,1], "tol": 1e-3,  "explain": "..." }
         ],
         "hard": [
           { "type": "mcq", "q": "...", "choices": [...], "answer": 2, "explain": "..." }
         ]
       }
     }
   }
   ```
   Aim for 3 questions per concept in `questions` (mix types, use KaTeX). The `hard` array is optional; when present, aim for 2–3 questions that either **chain two concepts** or probe **counterexamples / subtle failures of a hypothesis**. Authoring the Section-A hard-tier banks (A1–A48) is tracked in `TODO.md`.

   **Schema compatibility**: banks without a `hard` key keep behaving as before — nothing changes in the UI except the badge text.
4. **Progression** — `js/progress.js` exposes `MVProgress.{isMastered, setMastered, stateOf, clearAll}` on `window`. Mastery is tracked at two tiers per concept: `'v1'` and `'hard'`.

   ```js
   MVProgress.setMastered(conceptId, tier, value)   // tier ∈ {'v1','hard'}
   MVProgress.setMastered(conceptId, value)         // legacy 2-arg form; tier defaults to 'v1'
   MVProgress.isMastered(conceptId)                 // true ⇔ v1 mastered
   MVProgress.isMastered(conceptId, 'hard')         // true ⇔ hard mastered
   MVProgress.stateOf(conceptId, conceptsMap)
     // → { state: 'locked'|'ready'|'mastered', v1: bool, hard: bool }
   MVProgress.clearAll()                            // wipe storage
   ```

   Rules the store enforces:
   - Setting `v1 = false` also clears `hard` (can't have hard without v1).
   - Setting `hard = true` implies `v1 = true`.
   - Only v1 mastery gates downstream concepts in `pathway.html` (locked/ready/mastered). Hard mastery is a separate visual ring — it doesn't unlock anything else.

   **Storage migration**: legacy entries (bare booleans or the old `{at: ts}` form) are coerced transparently on first read to `{v1: true, hard: false}`; no user action needed. The storage key (`mvnb.progress.v1`) is unchanged.

   On v1 all-correct, the quiz widget calls `setMastered(conceptId, 'v1', true)` and exposes a "Harder tier unlocked" button if the bank has a `hard` array. Clicking it renders the hard tier; on all-correct there, the widget calls `setMastered(conceptId, 'hard', true)`. `pathway.html` draws two rings per node: an inner green ring for v1 mastery and an outer violet ring for hard-tier mastery.

## Concept graph

- [`concepts/<topic>.json`](./concepts) declares each concept with `id`, `title`, `anchor`, `prereqs`, `blurb`. Prereqs can reference ids from other topic files — cross-topic edges are the whole point of [`pathway.html`](./pathway.html).
- Register the topic in [`concepts/index.json`](./concepts/index.json).
- When adding a capstone page, also extend [`concepts/capstones.json`](./concepts/capstones.json) with a capstone entry. Each capstone entry needs a `section` field (one of the 7 index-section names above) — `pathway.html` uses it to group the capstone dropdown via `<optgroup>`.
- **Rebuild the bundle** after any edit to `concepts/*.json` or `capstones.json`:
  ```bash
  node scripts/build-concepts-bundle.mjs
  ```
  `pathway.html` reads `concepts/bundle.js` first because browsers block `fetch()` of local JSON over `file://` (the double-click flow). If the bundle is stale, the page falls back to `fetch` and works under a dev server but shows an error when opened by double-clicking.

### Concept schema + anchor contract

Every entry in `concepts/<topic>.json`'s `concepts` array must carry exactly these fields:

- `id` — unique concept id across the whole notebook, kebab-case (e.g. `sato-tate-measure`). Other concepts' `prereqs` reference this id, possibly across topic files.
- `title` — short human-readable title shown on `pathway.html` nodes and on the concept detail panel.
- `anchor` — matches an `id="..."` attribute on the topic HTML page. `pathway.html` renders the "open page →" link as `<topic>.html#<anchor>`, so the `<section>` for that concept on the HTML page must carry the same id:
  ```html
  <section id="measure">
    <h2>2. The Sato–Tate measure</h2>
    …
  </section>
  ```
  ```json
  { "id": "sato-tate-measure", "anchor": "measure", … }
  ```
  A mismatch (missing `id=`, typo, moved section) is a silent 404 on the deep-link — the page opens but doesn't jump.
- `prereqs` — array of concept ids (may reference concepts from other topic files). Drives the locked → ready → mastered state machine on `pathway.html`.
- `blurb` — 1–2 sentence summary, rendered in the pathway detail panel.

After editing any file under `concepts/`, run all three checks in order:

```bash
node scripts/build-concepts-bundle.mjs   # regenerate concepts/bundle.js so file:// opens still work
node scripts/validate-concepts.mjs       # duplicate ids, broken prereqs, cycles, missing anchor/blurb
node scripts/smoke-test.mjs              # verifies each concept's anchor resolves to id="…" on its topic page
```

The smoke test is what catches anchor drift — it refuses to exit 0 if any `concepts/<topic>.json` concept's `anchor` has no matching `id="<anchor>"` in `<topic>.html`.

## Page scaffolding — required on every topic page

Every topic HTML file must include, in order:

1. **Top-nav backlink** inside `<nav class="toc">`: `<a href="./index.html" style="color:var(--violet);font-weight:500">← Notebook</a>` as the first anchor. Without it there is no way back to the index from a deep link.
2. **Sidetoc scaffold**: `<aside class="sidetoc" aria-label="Table of contents"></aside>`. The shared helper populates it at page load.
3. **`MVQuiz.init('<topic-id>')` footer** at the bottom of `<body>`, exactly as shown in the Quiz + progression section below. Without it, quizzes render but do not wire up answer-checking or `MVProgress` calls.

Skipping any of these is a silent break — quizzes appear but do nothing, or the sidebar stays empty. Always copy the scaffolding from `category-theory.html` rather than reconstructing it.

## Registering a new page

When you publish `new-topic.html`:

1. Add a card to the right section of [`index.html`](./index.html), matching the `a.card` structure of neighboring cards (colored thumb SVG, `.tt` with optional level badge, `.desc`, `.tag`). Put it under the appropriate section header from the 7-section list above.
2. Add a bullet to [`README.md`](./README.md) under the matching `###` section.
3. Create `concepts/new-topic.json` and register it in `concepts/index.json`.
4. Create `quizzes/new-topic.json` with one quiz per concept id.
5. If it's a capstone, add an entry (with `section` field) to [`concepts/capstones.json`](./concepts/capstones.json).
6. Bump the topic count in `README.md` and `ROADMAP.md` (currently 44 pages across 7 sections — update both in sync).
7. **Regenerate both bundles** so pages opened via `file://` still work:
   ```bash
   node scripts/build-concepts-bundle.mjs
   node scripts/build-quizzes-bundle.mjs
   ```
   `concepts/bundle.js` feeds `pathway.html`; `quizzes/bundle.js` feeds `MVQuiz.init` on every topic page. Both fall back to `fetch()` under a dev server but silently break under double-click if stale or missing.

## Verification (required before claiming done)

Run a local server and exercise the page in a browser — type-checking or file existence is not enough:

```bash
python3 -m http.server 8000
# open http://localhost:8000/<page>.html
```

Check all of:

- **KaTeX**: no raw `$…$` visible; no red error badges from `throwOnError`.
- **Every widget**: interact with it — sliders, buttons, inputs. Confirm readouts update and SVG redraws.
- **Quizzes**: answer each question correctly once, confirm the `✓ mastered` badge appears, reload the page and confirm "already mastered" persists.
- **Links**: the top-nav "← Notebook" link resolves; internal `#anchor` links jump; the sidetoc highlights the active section on scroll.
- **Index card**: open [`index.html`](./index.html), find the new card in its section, click through.
- **Pathway**: if the page adds concepts with prereqs from other topics, load [`pathway.html`](./pathway.html) and confirm the new nodes appear in the right state.
- **Concept graph**: run `node scripts/validate-concepts.mjs` (exit 0 clean, exit 1 on errors) whenever you touch `concepts/*.json`. It catches duplicate ids, broken prereqs, cycles, and missing `anchor`/`blurb` fields.
- **Concept bundle**: after any edit to `concepts/*.json` or `concepts/capstones.json`, run `node scripts/build-concepts-bundle.mjs`. `pathway.html` will fall back to `fetch()` under a dev server but silently fail when opened by double-click if the bundle is stale.
- **Quiz bundle**: after any edit to `quizzes/*.json`, run `node scripts/build-quizzes-bundle.mjs`. Topic pages show "could not load ./quizzes/\<topic\>.json" under `file://` if the bundle is missing or stale.
- **Console**: no errors in the browser devtools console.

### Agent-environment fallback (no browser)

If you're running in an agent sandbox without a real browser, use jsdom as a partial substitute — it won't exercise CSS layout or user interaction, but it will run the page's top-of-body helper script and KaTeX, and will surface script errors. Minimum shape:

```js
const { JSDOM, VirtualConsole } = require('jsdom');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push('jsdomError: ' + (e && (e.message||e))));
vc.on('error',      e => errors.push('error: ' + (e && (e.message||e))));
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  virtualConsole: vc,
  url: 'file://' + file
});
setTimeout(() => {
  const { document } = dom.window;
  // count sidebar links, top-nav anchors, .widget, section, svg; assert errors.length === 0
}, 500);
```

Count `aside.sidetoc a`, `nav.toc a[href^="#"]`, `.widget`, `section`, and `.widget svg` to catch missing scaffolding, and assert zero jsdom errors. A clean jsdom run is necessary but not sufficient — say so explicitly when reporting. Widget interactivity still has to be verified by a human in a real browser before the page is considered final.

If you can't run even jsdom, say so explicitly — do not claim a visual feature works.

## Parallelization protocol

You may spawn multiple agents to draft independent pages in parallel. Every such agent must:

1. Read `AGENTS.md` (this file) and `ROADMAP.md`.
2. Read `category-theory.html` for style before writing markup.
3. Read one page with similar subject matter (e.g. drafting `bsd.html` → also read `L-functions.html` and `elliptic-curves.html`) so notation and callbacks match.
4. Write only the assigned page plus its `concepts/` and `quizzes/` files. Do not touch `index.html`, `README.md`, or `ROADMAP.md` — the orchestrating session handles registration so edits don't conflict.

Side tasks that are safe to parallelize with page drafting: concept-graph validation scripts, concept-map JSON for an already-published page, CSS-only refactors scoped to a single file.

## What not to do

- Don't create new `.md` files for planning, status, or decisions. Work from conversation context.
- Don't introduce build tools, bundlers, TypeScript, or frameworks. The notebook is vanilla HTML/CSS/JS by design.
- Don't add external JS dependencies beyond the KaTeX CDN already in use.
- Don't rewrite the helper block in a new style — copy from `category-theory.html`.
- Don't claim a page is done without browser verification.
- Don't commit scratch verification scripts into the repo. Ad-hoc `_verify_*.js` files used for jsdom smoke-testing belong one level up from the workspace (e.g. `/sessions/<id>/_verify_<page>.js`), not inside `Math-Visualization/`. The repo is public; keep it free of throwaway instrumentation.
