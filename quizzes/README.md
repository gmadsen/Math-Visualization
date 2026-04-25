# Quiz banks

Each topic page has a quiz bank under `quizzes/<topic>.json`. Banks are loaded by `js/quiz.js` (via `quizzes/bundle.js` for `file://` and a `fetch()` fallback for dev servers) and wired into the page by an `MVQuiz.init('<topic>')` call at the bottom of the topic HTML.

This file documents the bank schema, the eight question types, the three-tier mastery model, and the integration touchpoints. CLAUDE.md only carries the operational checklist — full reference lives here.

## Page wiring

In the topic page `<head>`:

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

Drop a placeholder at the end of each concept's section — `data-concept` must match a concept `id` in `concepts/<topic>.json`:

```html
<div class="quiz" data-concept="<concept-id>"></div>
```

## Bank schema

`quizzes/<topic>.json`. Each concept entry carries a **v1 tier** (`questions`, required), an optional **hard tier** (`hard`, unlocked after v1 is mastered), and an optional **expert tier** (`expert`, unlocked after hard is mastered):

```json
{
  "topic": "<topic-id>",
  "quizzes": {
    "<concept-id>": {
      "title": "Readable title",
      "questions": [
        { "type": "mcq",          "q": "...", "choices": ["a","b","c"], "answer": 1, "explain": "...", "hint": "optional short nudge" },
        { "type": "numeric",      "q": "...", "answer": 5,     "tol": 1e-6,  "explain": "..." },
        { "type": "complex",      "q": "...", "answer": [3,1], "tol": 1e-3,  "explain": "..." },
        { "type": "multi-select", "q": "Select all abelian groups.", "choices": ["$\\mathbb{Z}$","$S_3$","$\\mathbb{Z}/4$"], "answer": [0,2], "explain": "..." },
        { "type": "ordering",     "q": "Arrange the proof steps.",    "items": ["step A","step B","step C"],               "answer": [1,0,2], "explain": "..." }
      ],
      "hard": [
        { "type": "mcq", "q": "...", "choices": [], "answer": 2, "explain": "..." }
      ],
      "expert": [
        { "type": "mcq", "q": "...", "choices": [], "answer": 0, "explain": "..." }
      ]
    }
  }
}
```

Aim for 3 questions per concept in `questions` (mix types, use KaTeX). The `hard` array is optional; when present, aim for 2–3 questions that either **chain two concepts** or probe **counterexamples / subtle failures of a hypothesis**. The `expert` array is optional on top of `hard`; when present, aim for 2–3 questions that synthesize across multiple concepts or reach for the deepest non-obvious consequences — reserve this tier for the hardest problems.

Banks without `hard` or `expert` keys keep behaving as before — nothing changes in the UI except the badge text. The `js/quiz.js` widget transparently rejects non-existent tiers.

## Question types

### `mcq` — single-correct multiple choice

```json
{ "type": "mcq", "q": "...", "choices": ["a","b","c"], "answer": 1, "explain": "...", "hint": "optional" }
```

### `numeric` — scalar answer within absolute tolerance

```json
{ "type": "numeric", "q": "...", "answer": 5, "tol": 1e-6, "explain": "..." }
```

### `complex` — `[re, im]` answer within absolute tolerance per component

```json
{ "type": "complex", "q": "...", "answer": [3, 1], "tol": 1e-3, "explain": "..." }
```

### `multi-select` — checkboxes graded as a set

`answer` is the array of correct indices. Order-insensitive. Wrong-answer feedback distinguishes "too few", "too many", and "partially wrong".

```json
{ "type": "multi-select",
  "q": "Select all abelian groups.",
  "choices": ["$\\mathbb{Z}$","$S_3$","$\\mathbb{Z}/4$"],
  "answer": [0, 2],
  "explain": "..." }
```

### `ordering` — reorder items via ↑/↓ buttons

`answer` is the correct permutation of original indices (e.g. `[1,0,2]` means item-at-position-1 should come first). Click-to-promote — works on touch without drag-and-drop flakiness. Wrong-answer feedback reports how many items are out of place without revealing which.

```json
{ "type": "ordering",
  "q": "Arrange the proof steps.",
  "items": ["step A","step B","step C"],
  "answer": [1, 0, 2],
  "explain": "..." }
```

### `proof-completion` — pick the next step

Learner sees the first N proof `steps` (numbered list, read-only) and picks the correct continuation from `choices` (radio buttons). `answer` is the index of the correct next step. Wrong-answer feedback points back to the last given step (the gap the learner missed must use it).

```json
{ "type": "proof-completion", "q": "...",
  "steps": ["step1","step2"],
  "choices": ["A","B","C"], "answer": 1, "explain": "..." }
```

### `matching` — pair items from two columns

`left` and `right` are the two item arrays (they may differ in semantic role); the widget renders `left` labeled `A, B, C, …` and puts a dropdown next to each `right` row asking which letter pairs with it. `answer[i]` is the index into `left` that pairs with `right[i]`. Wrong-answer feedback reports `"N of M pairs correct"` (never reveals which pair is wrong). `left` and `right` must have the same length.

```json
{ "type": "matching", "q": "...",
  "left":  ["theorem A", "theorem B", "theorem C"],
  "right": ["implication X", "implication Y", "implication Z"],
  "answer": [2, 0, 1], "explain": "..." }
```

### `spot-the-error` — find the planted flaw

A proof is shown as a clickable numbered list; exactly one step contains a planted flaw. `answer` is the 0-based index of the flawed step. Feedback: clicking the correct step → ✓; clicking any other step → `"step N is valid — try another"`.

```json
{ "type": "spot-the-error", "q": "...",
  "steps": ["s1","s2 (bad)","s3"], "answer": 1, "explain": "..." }
```

### `construction` — drag a marker on an SVG canvas

`viewBox` sets the coordinate system; learner drags a marker to place a point; `target.x`, `target.y`, and `target.tolerance` (in viewBox units) define the acceptance region. Optional `start` object sets the marker's initial position. Feedback is directional: `"too far left/right/up/down"` based on the dominant error axis (no magnitude revealed). v1 only supports `target.kind: "point"`; lines/curves/regions can be added later without schema breakage.

```json
{ "type": "construction", "q": "...",
  "target":  { "kind": "point", "x": 40, "y": 60, "tolerance": 6 },
  "viewBox": "0 0 100 100",
  "start":   { "x": 50, "y": 50 },
  "explain": "..." }
```

### `guess-my-rule` — inductive pattern fill-in

`examples` are `[input, output]` pairs shown to the learner; `testCases` are `[input, expected]` pairs where the learner fills in expected outputs in text inputs. `tol` is the per-case absolute tolerance (defaults to `1e-6`). `inputKind`/`outputKind` are advisory labels (e.g. `"integer"`). Grading checks all test cases within tolerance; wrong-answer feedback reports how many match. No client-side formula sandbox — the simpler "fill in each output" variant is used.

```json
{ "type": "guess-my-rule", "q": "...",
  "examples":  [[1,1],[2,4],[3,9]],
  "testCases": [[4,16],[5,25]],
  "inputKind": "integer", "outputKind": "integer",
  "tol": 1e-6, "hint": "...", "explain": "..." }
```

## Per-question `hint`

Any question type may carry a `hint` field — a short nudge the learner can reveal via the `?` button rendered next to the question. If `hint` is absent, the quiz widget falls back to the first sentence of `explain` (when that is a usable sentence of ≥ 20 chars). Revealing a hint does not affect mastery — it's purely a pedagogical aid.

`scripts/generate-hints.mjs` (and the `generate-hints` skill) auto-derives missing hints for hard-tier questions from their `explain` text.

## Three-tier mastery model

`js/progress.js` tracks **three tiers per concept**: `'v1'`, `'hard'`, `'expert'`. The full API surface and storage-coercion rules live in JSDoc at the top of [`js/progress.js`](../js/progress.js). The operational rules:

- Setting `v1 = false` also clears `hard` and `expert`.
- Setting `hard = false` also clears `expert`.
- Setting `hard = true` implies `v1 = true`.
- Setting `expert = true` implies `hard = true` and `v1 = true`.
- **Only v1 mastery gates downstream concepts** in `pathway.html` (locked / ready / mastered). Hard and expert are separate visual rings — they unlock no further concepts.
- The legacy 2-arg form `MVProgress.setMastered(id, bool)` defaults `tier='v1'` for backwards compat. New code passes the tier explicitly.

The single `localStorage` key is `mvnb.progress.v1`. Legacy entries (bare booleans, the old `{at: ts}` form, the two-tier `{v1, hard}` form) are coerced transparently on first read.

## Quiz widget behaviour

On v1 all-correct, the widget calls `setMastered(conceptId, 'v1', true)` and exposes a "Harder tier unlocked" button if the bank has a `hard` array. Clicking it renders the hard tier; on all-correct there, the widget calls `setMastered(conceptId, 'hard', true)` and surfaces an "Expert tier unlocked" button if the bank has an `expert` array. On expert all-correct, the widget calls `setMastered(conceptId, 'expert', true)`.

`pathway.html` currently draws **two** rings per node — inner green ring for v1 mastery, outer violet ring for hard mastery. Expert is tracked in storage and readable via `MVProgress.isMastered(id, 'expert')` but is not yet visualized on the pathway.

## "Next up" panel

After v1 mastery on a concept, the quiz widget renders a small "Next up" block listing up to 3 concepts that just became `ready` (their prereqs include the just-mastered concept and all other prereqs are also v1-mastered). Computed via `window.__MVConcepts` (from `concepts/bundle.js`); skipped silently on pages that don't load the bundle.

## After editing a bank

Always run `node scripts/build-quizzes-bundle.mjs` (or `node scripts/rebuild.mjs`) — `quizzes/bundle.js` is what the `file://` flow reads.
