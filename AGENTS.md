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

## Helper tools (in every page's top `<script>`)

```js
$(selector, root?)        // querySelector
$$(selector, root?)       // querySelectorAll → array
SVG(tag, attrs)           // create namespaced SVG element
drawArrow(svg, p1, p2, opts)   // curved arrow with optional label, marker auto-def'd
drawNode(svg, x, y, label, opts)  // circle + centered label
```

Copy the block verbatim from `category-theory.html` rather than rewriting.

## Quiz + progression (Brilliant-style)

Every new topic page should ship with quizzes for its concepts.

1. **Page wiring** — in `<head>`:
   ```html
   <script src="./js/progress.js"></script>
   <script src="./js/quiz.js"></script>
   ```
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
3. **Quiz bank** — `quizzes/<topic>.json`:
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
         ]
       }
     }
   }
   ```
   Aim for 3 questions per concept, mixing types, with KaTeX in `q` and `explain`.
4. **Progression** — `js/progress.js` exposes `MVProgress.{isMastered, setMastered, stateOf, clearAll}` on `window`. On all-correct, the quiz widget calls `setMastered(conceptId, true)`; `pathway.html` reads the same store to compute locked/ready/mastered.

## Concept graph

- [`concepts/<topic>.json`](./concepts) declares each concept with `id`, `title`, `anchor`, `prereqs`, `blurb`. Prereqs can reference ids from other topic files — cross-topic edges are the whole point of [`pathway.html`](./pathway.html).
- Register the topic in [`concepts/index.json`](./concepts/index.json).
- When adding a capstone page, also extend [`concepts/capstones.json`](./concepts/capstones.json) with a capstone entry.

## Registering a new page

When you publish `new-topic.html`:

1. Add a card to the right section of [`index.html`](./index.html), matching the `a.card` structure of neighboring cards (colored thumb SVG, `.tt` with optional level badge, `.desc`, `.tag`).
2. Add a bullet to [`README.md`](./README.md) under the matching `###` section.
3. Create `concepts/new-topic.json` and register it in `concepts/index.json`.
4. Create `quizzes/new-topic.json` with one quiz per concept id.
5. Bump the "41 topic pages" count in `README.md` and `ROADMAP.md`.

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
- **Console**: no errors in the browser devtools console.

If you can't run a browser, say so explicitly — do not claim a visual feature works.

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
