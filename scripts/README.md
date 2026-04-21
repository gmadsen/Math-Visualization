# scripts/

Node-based helpers for the notebook. All scripts are vanilla ESM (`.mjs`), no external dependencies, Node ≥ 18. Run from the repo root.

## Generators (rebuild derived files)

| Script | What it does | Inputs → outputs |
|---|---|---|
| `build-concepts-bundle.mjs` | Flatten every `concepts/*.json` + `capstones.json` into a single `concepts/bundle.js` that loads as a `<script>` tag. Needed because browsers block `fetch()` of local JSON over `file://`. | `concepts/*.json` → `concepts/bundle.js` |
| `build-quizzes-bundle.mjs` | Same pattern for quiz banks. | `quizzes/*.json` → `quizzes/bundle.js` |
| `insert-changelog-footer.mjs` | Regenerate the `<details class="changelog">` footer on every topic page from `git log --follow`. Re-runnable — rebuilds in place. Pages with no git history get a `YYYY-MM-DD · initial version` placeholder. | `git log` + topic HTML → topic HTML |
| `insert-used-in-backlinks.mjs` | Insert a reverse-direction `<aside class="related">` ("Used in →") block into each concept section listing downstream consumers. Idempotent via `<!-- backlinks-auto-* -->` fences. Audit mode (no flag) is the CI guard; `--fix` writes. | `concepts/*.json` + topic HTML → topic HTML |
| `inject-page-metadata.mjs` | Set `data-section` and `data-level` attributes on the `<body>` of each topic page, reading section assignments and level badges from `index.html`. Idempotent. | `index.html` + topic HTML → topic HTML |
| `build-section-indexes.mjs` | Generate one mini-index page per section under `sections/`, extracting that section's cards from `index.html`. Idempotent. | `index.html` → `sections/<section>.html` |
| `wire-katex-select.mjs` | Ensure every page with `<option>…$tex$…</option>` loads `js/katex-select.js` in its `<head>`. Native `<select>` popups can't render HTML, so this custom-dropdown shim must be wired in wherever LaTeX appears inside options. Idempotent. Audit mode is the CI guard; `--fix` writes. | topic HTML → topic HTML |
| `package-offline.mjs` | Zip the notebook (HTML, CSS, JS, JSON, bundles, skipping git + scripts) into `math-viz-notebook.zip` with a `serve.sh` helper for workshops. | whole repo → `math-viz-notebook.zip` |

## Validators / audits (read-only, exit 1 on failure)

| Script | What it checks |
|---|---|
| `validate-concepts.mjs` | Concept graph: duplicate ids, broken prereqs, cycles, missing `anchor`/`blurb`, registered vs. present topics. |
| `audit-callbacks.mjs` | Every cross-topic prereq surfaces as a forward `<aside class="callback">` block on its host section. Pass `--fix` to insert missing blocks. |
| `smoke-test.mjs` | Per-page: sidebar present, top-nav backlink present, concept anchors resolve to `id="..."` sections, quiz placeholders wired, changelog footer present (exactly one), callback/backlink invariants hold. |

## Typical workflow

After editing any `concepts/*.json` or `quizzes/*.json`:

```bash
node scripts/build-concepts-bundle.mjs
node scripts/build-quizzes-bundle.mjs
node scripts/validate-concepts.mjs
node scripts/audit-callbacks.mjs --fix
node scripts/insert-used-in-backlinks.mjs --fix
node scripts/smoke-test.mjs
```

After adding or re-sectioning a topic page in `index.html`:

```bash
node scripts/inject-page-metadata.mjs
node scripts/build-section-indexes.mjs
node scripts/smoke-test.mjs
```

After authoring a widget with LaTeX inside `<option>` labels:

```bash
node scripts/wire-katex-select.mjs --fix
```

CI ([`.github/workflows/verify.yml`](../.github/workflows/verify.yml)) runs the validator chain in audit mode on every push and PR.
