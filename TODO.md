# TODO

Self-contained tasks derived from `ROADMAP.md` § Outstanding. Each task can be picked up by a fresh agent in parallel — no cross-task dependencies unless explicitly noted. When a task is checked off, the **Roadmap update** line tells you exactly what to change in `ROADMAP.md`.

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

- [ ] **A1. Wire quizzes on `hecke-operators.html`** (bank: 4 quizzes)
      - **Roadmap update**: remove `hecke-operators` from Outstanding #2 list and from Current state "4 warnings" count (→ 3).
- [ ] **A2. Wire quizzes on `modular-forms.html`** (bank: 4 quizzes)
      - **Roadmap update**: remove `modular-forms` from Outstanding #2 list and decrement warning count.
- [ ] **A3. Wire quizzes on `quadratic-reciprocity.html`** (bank: 4 quizzes)
      - **Roadmap update**: remove `quadratic-reciprocity` from Outstanding #2 list and decrement warning count.
- [ ] **A4. Wire quizzes on `upper-half-plane-hyperbolic.html`** (bank: 4 quizzes)
      - **Roadmap update**: remove `upper-half-plane-hyperbolic` from Outstanding #2 list and decrement warning count. When A1–A4 all done, delete Outstanding #2 entirely and update Current state to "0 warnings".

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

- [ ] **B1.  `algebraic-number-theory`** — 3 concepts
- [ ] **B2.  `bezout`** — 3 concepts
- [ ] **B3.  `category-theory`** — 3 concepts
- [ ] **B4.  `class-field-theory`** — 3 concepts
- [ ] **B5.  `commutative-algebra`** — 3 concepts
- [ ] **B6.  `differential-forms`** — 3 concepts
- [ ] **B7.  `differential-geometry`** — 3 concepts
- [ ] **B8.  `frobenius-and-reciprocity`** — 3 concepts
- [ ] **B9.  `functional-analysis`** — 3 concepts
- [ ] **B10. `functor-of-points`** — 3 concepts
- [ ] **B11. `galois`** — 3 concepts
- [ ] **B12. `galois-representations`** — 3 concepts
- [ ] **B13. `homological`** — 3 concepts
- [ ] **B14. `lie-groups`** — 3 concepts
- [ ] **B15. `moduli-spaces`** — 3 concepts
- [ ] **B16. `morphisms-fiber-products`** — 3 concepts
- [ ] **B17. `operator-algebras`** — 3 concepts
- [ ] **B18. `p-adic-numbers`** — 3 concepts
- [ ] **B19. `projective-plane`** — 3 concepts
- [ ] **B20. `representation-theory`** — 3 concepts
- [ ] **B21. `riemann-surfaces`** — 3 concepts
- [ ] **B22. `riemannian-geometry`** — 3 concepts
- [ ] **B23. `schemes`** — 3 concepts
- [ ] **B24. `sheaf-cohomology`** — 3 concepts
- [ ] **B25. `sheaves`** — 3 concepts
- [ ] **B26. `singular-cubics-reduction`** — 3 concepts
- [ ] **B27. `smooth-manifolds`** — 3 concepts
- [ ] **B28. `stacks`** — 3 concepts
- [ ] **B29. `sums-of-squares`** — 3 concepts
- [ ] **B30. `theta-functions`** — 3 concepts

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

- [ ] **D1.  `lie-groups`** — add ≥3 concepts; candidates: exponential-map, one-parameter subgroups, Lie bracket structure, root system, Haar measure.
- [ ] **D2.  `schemes`** — add ≥3 concepts; candidates: Spec as topological space, structure sheaf, generic point, affine vs projective, gluing.
- [ ] **D3.  `sheaves`** — add ≥3 concepts; candidates: presheaf vs sheaf axiom, stalk, sheafification, direct/inverse image, coherent sheaves.
- [ ] **D4.  `commutative-algebra`** — add ≥3 concepts; candidates: localization, flatness, Noetherian, Nakayama, integral extensions.
- [ ] **D5.  `smooth-manifolds`** — add ≥3 concepts; candidates: chart atlas, tangent bundle, pushforward, submersion/immersion, vector fields.
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

- [ ] **E1. Add an "Anchors" subsection to `AGENTS.md § Quiz + progression` (or a sibling "Concept graphs" section)** explaining:
      - Every concept in `concepts/<topic>.json` must carry an `anchor` string.
      - `pathway.html` renders `topic.html#<anchor>` as the "open page →" link.
      - The anchor **must** exactly match an `id="<anchor>"` on `<topic>.html` (usually on the `<section>` element for that concept).
      - `scripts/smoke-test.mjs` fails on any unresolved anchor.
      - **Roadmap update**: delete Outstanding #5 once AGENTS.md is updated and committed.

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
