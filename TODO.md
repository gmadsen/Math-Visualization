# TODO

Self-contained tasks derived from `ROADMAP.md` § Outstanding. Each task can be picked up by a fresh agent in parallel — no cross-task dependencies unless explicitly noted. When a task is checked off, the **Roadmap update** line tells you exactly what to change in `ROADMAP.md`.

## Status (2026-04-20)

Overnight parallel fan-out ran through Sections A, B, E and the D-priority edge (D1–D3, D5). The working tree has the delta — nothing has been committed yet so you can review the diff before pushing.

- **Section A (orphan quiz wiring)** — ✅ 4/4 complete
- **Section B (missing quiz banks)** — ✅ 30/30 complete → quiz coverage went from 18/48 to 48/48
- **Section D priority** — ✅ 4/8 complete (`lie-groups`, `schemes`, `sheaves`, `smooth-manifolds` each expanded 3 → 7 concepts); D4, D6–D8 still open
- **Section D secondary (D9–D39)** — 31 open
- **Section E (anchor contract docs)** — ✅ 1/1 complete
- **Section C (capstone expansion)** — 4 open
- **Section F (QOL)** — 3 open

Verification after the fan-out:

```text
node scripts/validate-concepts.mjs  → 48 topics, 200 concepts, OK (0 errors, 0 warnings)
node scripts/smoke-test.mjs         → 48 pages, 48 banks, OK (0 errors, 0 warnings)
```

Uncommitted delta summary: **43 modified files + 30 new quiz banks**. See `git status` for the full list.

Before starting any task, read [`AGENTS.md`](./AGENTS.md) for house style and quiz wiring conventions. After finishing, always run:

```bash
node scripts/validate-concepts.mjs
node scripts/smoke-test.mjs
node scripts/build-concepts-bundle.mjs   # if concepts/*.json changed
node scripts/build-quizzes-bundle.mjs    # if quizzes/*.json changed
```

---

## Section A — Wire orphan quiz banks (Outstanding #2)

Each bank already exists at `quizzes/<topic>.json`. The topic page has **no** `.quiz[data-concept]` placeholders or `MVQuiz.init('<topic>')` call. Follow `AGENTS.md § Quiz + progression` exactly, and copy the scaffolding pattern from `algebraic-topology.html` (see its `<script>` header at lines 11–12 and the `MVQuiz.init(...)` footer).

**Per-task recipe (identical for all four):**
1. Open `quizzes/<topic>.json` → note every key under `quizzes` (these are the concept ids).
2. In `<topic>.html`, add `<script src="./js/quiz.js"></script>` and `<script src="./quizzes/bundle.js"></script>` to the `<head>` if missing; ensure `<script src="./js/progress.js"></script>` is also present.
3. For each concept id in the bank, drop `<div class="quiz" data-concept="<id>"></div>` at the end of that concept's `<section>` on the page. Section ids should match the concept `anchor` field in `concepts/<topic>.json`.
4. Add a DOMContentLoaded footer at the bottom of `<body>`:
   ```html
   <script>
   (function(){
     function start(){ if(window.MVQuiz) MVQuiz.init('<topic>'); }
     if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
     else start();
   })();
   </script>
   ```
5. `node scripts/smoke-test.mjs` → the orphan-bank WARNING for this topic should disappear; page should report `quiz=<N>` where N matches the bank size.

- [x] **A1. Wire quizzes on `hecke-operators.html`** (bank: 4 quizzes) — done 2026-04-20
- [x] **A2. Wire quizzes on `modular-forms.html`** (bank: 4 quizzes) — done 2026-04-20
- [x] **A3. Wire quizzes on `quadratic-reciprocity.html`** (bank: 4 quizzes) — done 2026-04-20
- [x] **A4. Wire quizzes on `upper-half-plane-hyperbolic.html`** (bank: 4 quizzes) — done 2026-04-20
      - **Roadmap status**: Outstanding #2 deleted; Current state warnings → 0. ✅

---

## Section B — Author missing quiz banks (Outstanding #1)

30 topic pages have no `quizzes/<topic>.json`. For each, author a bank covering every concept declared in `concepts/<topic>.json`, then wire the page exactly as in Section A.

**Per-task recipe (identical for all thirty):**
1. Read `concepts/<topic>.json` → list every `concepts[].id` and its blurb.
2. Create `quizzes/<topic>.json` with this shape:
   ```json
   {
     "topic": "<topic>",
     "quizzes": {
       "<concept-id>": {
         "title": "<short human title>",
         "questions": [ /* 2–4 items: mcq / numeric / complex */ ]
       }
     }
   }
   ```
   Use `quizzes/algebraic-topology.json` as the canonical template for question shapes. Each concept should have at least one `mcq` and ideally one numeric/computational check. LaTeX goes in `$...$` inside `q` / `choices` / `explain`.
3. Add `<div class="quiz" data-concept="<id>"></div>` at the end of each concept's `<section>` on `<topic>.html` (match the concept's `anchor` field for the section id).
4. Add `<script src="./js/quiz.js"></script>` + `<script src="./quizzes/bundle.js"></script>` to `<head>` if absent; ensure `js/progress.js` include is present.
5. Add the `MVQuiz.init('<topic>')` DOMContentLoaded footer (see Section A step 4).
6. `node scripts/build-quizzes-bundle.mjs` to regenerate `quizzes/bundle.js`.
7. `node scripts/smoke-test.mjs` — the page should report `quiz=<N>` with all checks passing.

**Common roadmap update**: each completed bank decrements the "30 remaining" count in Outstanding #1 and increments the "18 of 48" / "18 quiz banks" lines in Current state. When the last of B1–B30 is done, delete Outstanding #1.

- [x] **B1.  `algebraic-number-theory`** — done 2026-04-20
- [x] **B2.  `bezout`** — done 2026-04-20
- [x] **B3.  `category-theory`** — done 2026-04-20
- [x] **B4.  `class-field-theory`** — done 2026-04-20
- [x] **B5.  `commutative-algebra`** — done 2026-04-20
- [x] **B6.  `differential-forms`** — done 2026-04-20
- [x] **B7.  `differential-geometry`** — done 2026-04-20
- [x] **B8.  `frobenius-and-reciprocity`** — done 2026-04-20
- [x] **B9.  `functional-analysis`** — done 2026-04-20
- [x] **B10. `functor-of-points`** — done 2026-04-20
- [x] **B11. `galois`** — done 2026-04-20
- [x] **B12. `galois-representations`** — done 2026-04-20
- [x] **B13. `homological`** — done 2026-04-20
- [x] **B14. `lie-groups`** — done 2026-04-20 (authored against expanded 7-concept graph)
- [x] **B15. `moduli-spaces`** — done 2026-04-20
- [x] **B16. `morphisms-fiber-products`** — done 2026-04-20
- [x] **B17. `operator-algebras`** — done 2026-04-20
- [x] **B18. `p-adic-numbers`** — done 2026-04-20
- [x] **B19. `projective-plane`** — done 2026-04-20
- [x] **B20. `representation-theory`** — done 2026-04-20
- [x] **B21. `riemann-surfaces`** — done 2026-04-20
- [x] **B22. `riemannian-geometry`** — done 2026-04-20
- [x] **B23. `schemes`** — done 2026-04-20 (authored against expanded 7-concept graph)
- [x] **B24. `sheaf-cohomology`** — done 2026-04-20
- [x] **B25. `sheaves`** — done 2026-04-20 (authored against expanded 7-concept graph)
- [x] **B26. `singular-cubics-reduction`** — done 2026-04-20
- [x] **B27. `smooth-manifolds`** — done 2026-04-20 (authored against expanded 7-concept graph)
- [x] **B28. `stacks`** — done 2026-04-20
- [x] **B29. `sums-of-squares`** — done 2026-04-20
- [x] **B30. `theta-functions`** — done 2026-04-20

> **Section B complete.** All 30 banks authored, wired, and bundled. Roadmap Outstanding #1 deleted; Current state reflects "48 quiz banks / 489 questions total / full coverage".

> Parallelization note: B1–B30 are independent. A section-B task can be done without waiting on any section-A task or vice versa. If a B-task topic gains new concepts in a section-D expansion first, author quizzes for the expanded concept list.

---

## Section C — Expand Wave 4 capstone pages from 3 → ~5 widgets (Outstanding #3)

Four arithmetic capstones currently have ~4–5 `class="widget"` blocks but the prose is thin — the ROADMAP characterises them as "tight 3-widget v1s" (the 3 refers to widgets carrying load for the exposition, not raw `<svg>` count). Each task is: add 1–2 richer widgets + exposition so the page feels as developed as `complex-analysis.html`. Stay in the dark 3b1b aesthetic, no external dependencies beyond KaTeX.

**Per-task recipe:**
1. Open the page and identify its 3 narrative beats (usually one per existing widget).
2. Pick 1–2 additional beats worth a widget (e.g. an interactive slider for a parameter, a small visual proof, a numerical table the user can regenerate).
3. Implement widget(s) inline with SVG + vanilla JS. Re-use helpers already in `js/` if applicable.
4. Do not delete existing widgets; add, don't replace.
5. `node scripts/smoke-test.mjs` — page should still pass and now show `svg=≥5 widgets=≥6` or better.
6. If new concepts emerge from the expansion, add them to `concepts/<topic>.json` (with `anchor` pointing at a matching `id="..."`) and regenerate `concepts/bundle.js`.

- [ ] **C1. `sato-tate.html`** — currently svg=5 widgets=5. Candidates: (a) interactive Frobenius-angle histogram that accumulates as the user scrolls primes, (b) symmetric-power L-function strip visualizer.
      - **Roadmap update**: if all four capstones are expanded, change Outstanding #3 from "shipped as tight 3-widget v1s" to reflect the new state or delete the item.
- [ ] **C2. `bsd.html`** — currently svg=4 widgets=5. Candidates: (a) rank-vs-L-function-order visualization on a curve zoo, (b) Mordell–Weil generator chord–tangent animation.
      - **Roadmap update**: same as C1.
- [ ] **C3. `etale-cohomology.html`** — currently svg=4 widgets=5. Candidates: (a) Frobenius-eigenvalue distribution on the unit circle for a varying curve, (b) Betti-numbers-vs-point-count comparison widget.
      - **Roadmap update**: same as C1.
- [ ] **C4. `modularity-and-flt.html`** — currently svg=3 widgets=5. Candidates: (a) Frey curve conductor calculator, (b) Ribet level-lowering diagram stepper.
      - **Roadmap update**: when all four done, delete Outstanding #3 entirely.

---

## Section D — Expand under-resolved concept graphs (Outstanding #4)

39 topic graphs ship with exactly 3 concepts — the Codex cookie-cutter shape. Dense subjects should grow to 5–7 concepts so the `pathway.html` DAG exposes real prerequisite structure. Each task is a single topic's graph expansion.

**Per-task recipe:**
1. Open `concepts/<topic>.json`.
2. Add 2–4 new concepts. Each concept needs: `id`, `title`, `anchor`, `prereqs` (array of ids from this or any other topic graph), `blurb` (1–2 sentences). The `anchor` **must** correspond to an existing `id="..."` on `<topic>.html`; add anchors to HTML sections if missing.
3. Thread the new concepts into the prereq DAG — internal dependencies (A within topic depends on B within topic) and cross-topic dependencies are both fine.
4. `node scripts/validate-concepts.mjs` — must be 0 errors, 0 warnings (no cycles, all prereqs resolve).
5. `node scripts/build-concepts-bundle.mjs` — regenerate the bundle.
6. `node scripts/smoke-test.mjs` — every new anchor must resolve to an `id="..."` on the page (the smoke test now guards this).
7. If this topic also has a quiz bank (or a Section-B task is in progress for it), add a quiz entry per new concept.

**Roadmap update (each task)**: decrement "39 of 48 graphs" in Outstanding #4 and update the distribution line (e.g. one fewer in the "3 concepts" bucket, one more in "5/6/7"). When the bucket drops below a meaningful threshold, rewrite or remove Outstanding #4.

### D — Priority (dense, structurally central topics):

- [x] **D1.  `lie-groups`** — done 2026-04-20 (expanded to 7 concepts)
- [x] **D2.  `schemes`** — done 2026-04-20 (expanded to 7 concepts)
- [x] **D3.  `sheaves`** — done 2026-04-20 (expanded to 7 concepts)
- [ ] **D4.  `commutative-algebra`** — add ≥3 concepts; candidates: localization, flatness, Noetherian, Nakayama, integral extensions.
- [x] **D5.  `smooth-manifolds`** — done 2026-04-20 (expanded to 7 concepts)
- [ ] **D6.  `class-field-theory`** — add ≥3 concepts; candidates: ray class group, Artin map, conductor-discriminant, idele class group, existence theorem.
- [ ] **D7.  `homological`** — add ≥3 concepts; candidates: exact sequence, long exact sequence in cohomology, Ext/Tor definitions, spectral sequence, derived category intuition.
- [ ] **D8.  `representation-theory`** — add ≥3 concepts; candidates: character orthogonality, induced representations, Schur's lemma, sl₂ weight decomposition, regular representation.

### D — Secondary (smaller topics, growth to 4–5 is sufficient):

Each of the following is a standalone task with the same recipe above. Target 4–5 concepts instead of 5–7.

- [ ] **D9.  `L-functions`**
- [ ] **D10. `algebra`**
- [ ] **D11. `algebraic-number-theory`**
- [ ] **D12. `bezout`**
- [ ] **D13. `bsd`**
- [ ] **D14. `category-theory`**
- [ ] **D15. `differential-forms`**
- [ ] **D16. `differential-geometry`**
- [ ] **D17. `dirichlet-series-euler-products`**
- [ ] **D18. `elliptic-curves`**
- [ ] **D19. `etale-cohomology`**
- [ ] **D20. `frobenius-and-reciprocity`**
- [ ] **D21. `functional-analysis`**
- [ ] **D22. `functor-of-points`**
- [ ] **D23. `galois-representations`**
- [ ] **D24. `galois`**
- [ ] **D25. `modularity-and-flt`**
- [ ] **D26. `moduli-spaces`**
- [ ] **D27. `morphisms-fiber-products`**
- [ ] **D28. `naive-set-theory`**
- [ ] **D29. `operator-algebras`**
- [ ] **D30. `p-adic-numbers`**
- [ ] **D31. `projective-plane`**
- [ ] **D32. `riemann-surfaces`**
- [ ] **D33. `riemannian-geometry`**
- [ ] **D34. `sato-tate`**
- [ ] **D35. `sheaf-cohomology`**
- [ ] **D36. `singular-cubics-reduction`**
- [ ] **D37. `stacks`**
- [ ] **D38. `sums-of-squares`**
- [ ] **D39. `theta-functions`**

> Parallelization note: D-tasks can run in parallel across different topics. A D-task may introduce cross-topic prereqs (e.g. `lie-groups` depending on `smooth-manifolds`); rerun `validate-concepts.mjs` after merging to catch unresolved ids.

---

## Section E — Document the anchor contract (Outstanding #5)

The smoke test now fails if any concept `anchor` has no matching `id="..."` on the topic page (184/184 currently resolve). The contract is enforced in CI but not yet documented for human authors.

- [x] **E1. Add an "Anchors" subsection to `AGENTS.md`** — done 2026-04-20; "Concept schema + anchor contract" subsection added, documenting the five required fields and the anchor→id contract enforced by the smoke test. Outstanding #5 deleted from ROADMAP.md.

---

## Section F — Quality-of-life (Proposed improvements section of ROADMAP.md)

Not outstanding work, but easy parallelizable picks. Uncheck if not yet scoped.

- [ ] **F1. Wire smoke test + validator into CI** — add a GitHub Actions workflow that runs `node scripts/validate-concepts.mjs` and `node scripts/smoke-test.mjs` on every push to `main` and on PRs. Fail the build if either exits non-zero. **Roadmap update**: move the bullet out of "Proposed improvements" when done.
- [ ] **F2. Printable / offline bundle** — produce a `scripts/package-offline.mjs` that zips the repo minus `.git` and adds a tiny `serve.sh`. **Roadmap update**: remove from "Proposed improvements".
- [ ] **F3. Per-page changelog footers** — roll out `<details class="changelog">` blocks to every topic page. **Roadmap update**: remove from "Proposed improvements".

---

## Completion checklist for ROADMAP.md

When a task is checked off here, the corresponding ROADMAP.md update is:

| Task range | ROADMAP.md section(s) to touch |
|------------|--------------------------------|
| A1–A4      | Current state (warnings count); Outstanding #2 (remove topic, or delete item when all four done) |
| B1–B30     | Current state ("18 quiz banks" → new count); Outstanding #1 ("30 remaining" → new count); delete item when all done |
| C1–C4      | Outstanding #3 (rephrase or delete) |
| D1–D39     | Current state (concept count if new ones added); Outstanding #4 (update "39 of 48" count + distribution line; delete when ≤ ~5 three-concept graphs remain) |
| E1         | Delete Outstanding #5 |
| F1–F3      | Move bullet out of "Proposed improvements" (or remove) |
