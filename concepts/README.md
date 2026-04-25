# Concept graph

Each topic page has a concept graph under `concepts/<topic>.json`. The graph's nodes are concepts (atomic learning units); the edges are prerequisite relations. Edges may cross topic boundaries — that's the entire point of [`pathway.html`](../pathway.html), which renders the union graph and gates downstream concepts on `MVProgress` mastery state.

This file documents the per-concept schema, the anchor contract that links a concept to its HTML section, and the validation flow.

## Per-concept schema

Every entry in `concepts/<topic>.json`'s `concepts` array must carry exactly these fields:

- **`id`** — unique concept id across the whole notebook, kebab-case (e.g. `sato-tate-measure`). Other concepts' `prereqs` reference this id, possibly across topic files. Duplicates are a hard validation failure.
- **`title`** — short human-readable title shown on `pathway.html` nodes and in the concept detail panel.
- **`anchor`** — matches an `id="..."` attribute on the corresponding `<section>` in the topic HTML. See "Anchor contract" below.
- **`prereqs`** — array of concept ids (may reference concepts from other topic files). Drives the `locked → ready → mastered` state machine on `pathway.html`. Cycles are a hard validation failure.
- **`blurb`** — 1–2 sentence summary, rendered in the pathway detail panel.

JSON Schema lives at `schemas/concepts.json` and is enforced by `scripts/validate-schema.mjs`.

## Anchor contract

`pathway.html` builds the "open page →" link as `<topic>.html#<anchor>`, so the `<section>` for that concept on the HTML page must carry an `id="<anchor>"`:

```html
<section id="measure">
  <h2>2. The Sato–Tate measure</h2>
  …
</section>
```

```json
{ "id": "sato-tate-measure", "anchor": "measure", … }
```

A mismatch (missing `id=`, typo, moved section) is a **silent 404** on the deep link — the page opens but doesn't jump to the right section. `scripts/smoke-test.mjs` is the gate: it refuses to exit 0 if any concept's `anchor` has no matching `id="<anchor>"` in `<topic>.html`.

Common pitfall: when renaming an HTML section, the `id` attribute and the JSON `anchor` field must stay in sync. Run `scripts/smoke-test.mjs` after any rename.

## Topic registration

A new topic file must be registered in two places:

- **`concepts/index.json`** — the master list of topics. Drives bundle generation, `pathway.html`, and `search.html`.
- **`concepts/sections.json`** — maps each topic to one of the 7 subjects (Foundations, Algebra, Analysis, Geometry & topology, Number theory, Modular forms & L-functions, Algebraic geometry). `validate-concepts.mjs` fails if a registered topic is missing from `sections.json`.

If the new page is a **capstone**, also extend `concepts/capstones.json` with a capstone entry. Each capstone entry needs a `section` field (one of the 7 subject names) — `pathway.html` uses it to group the capstone dropdown via `<optgroup>`.

## After editing anything under `concepts/`

Run these three checks in order:

```bash
node scripts/build-concepts-bundle.mjs   # regenerate concepts/bundle.js so file:// opens still work
node scripts/validate-concepts.mjs       # duplicate ids, broken prereqs, cycles, missing anchor/blurb
node scripts/smoke-test.mjs              # anchor contract — every concept's anchor resolves on its topic page
```

Or just run `node scripts/rebuild.mjs`, which subsumes all three (and 17 other steps). The bundle rebuild is critical for the `file://` flow — `pathway.html` falls back to `fetch()` under a dev server but breaks silently on double-click if the bundle is stale.

## Why a separate bundle?

Browsers block `fetch()` of local JSON over `file://` to prevent same-origin tricks. The "double-click an HTML file" flow is non-negotiable for this notebook (workshop / offline / no-server contexts), so every `concepts/*.json` is flattened into `concepts/bundle.js` — a single file that assigns the union onto `window.__MVConcepts`. `pathway.html` reads this first and falls back to `fetch()` only when the bundle isn't present.

Same pattern for `quizzes/bundle.js` (see [`../quizzes/README.md`](../quizzes/README.md)) and `widgets/bundle.js`.

## Cross-topic edges and callbacks

A `prereqs` entry that references a concept owned by another topic is a **cross-topic edge**. These are the spine of `pathway.html` and require a forward "See also" callback aside in the topic HTML:

```html
<aside class="callback">
  <strong>See also</strong>: <a href="./other-topic.html#anchor">Title</a> — short description.
</aside>
```

Mechanically inserted by `node scripts/audit-callbacks.mjs --fix` (idempotent via `<!-- callback-auto-begin -->` / `<!-- callback-auto-end -->` fences). The reverse direction — "Used in" backlinks on the prereq side — is handled by `node scripts/inject-used-in-backlinks.mjs --fix`. Both injectors are wired into `rebuild.mjs`.

## Mastery and gating

`MVProgress` (in [`../js/progress.js`](../js/progress.js)) tracks per-concept mastery at three tiers (v1, hard, expert). Only **v1 mastery gates downstream concepts** on `pathway.html`:

- **locked** — at least one `prereqs` entry is not v1-mastered.
- **ready** — every `prereqs` entry is v1-mastered (or the concept has no prereqs); v1 itself is not yet mastered.
- **mastered** — v1 is set.

Hard and expert tiers are visual-only rings on the pathway — they unlock no further concepts. See [`../quizzes/README.md`](../quizzes/README.md) for the bank schema and tier semantics.
