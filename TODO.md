# TODO

Self-contained tasks derived from `ROADMAP.md` § Outstanding and § Proposed improvements. Each task can be picked up by a fresh agent in parallel — no cross-task dependencies unless explicitly noted. When a task is checked off, the **Roadmap update** line tells you exactly what to change in `ROADMAP.md`.

## Status (2026-04-20 — after parallel fan-out #3, Round 2)

Round 1 (Sections A0, B1–B5, D1–D4) and Round 2 (Sections C1–C3, E1–E3) are ✅ closed.

Current baseline:

```text
53 topic pages · 303 concepts · 798 quiz questions · 8 capstones
two-tier quiz schema live (v1 + hard)
149 cross-topic prereq edges, all surfaced via <aside class="callback">
per-page <details class="changelog"> footers on every topic page
validate-concepts.mjs → 0 errors, 0 warnings
audit-callbacks.mjs   → OK (all cross-topic prereqs covered)
smoke-test.mjs        → 53/53 OK
CI (GitHub Actions)   → green
```

Before starting any task, read [`AGENTS.md`](./AGENTS.md) for house style + quiz wiring conventions. After finishing, always run:

```bash
node scripts/validate-concepts.mjs
node scripts/audit-callbacks.mjs
node scripts/smoke-test.mjs
node scripts/build-concepts-bundle.mjs   # if concepts/*.json changed
node scripts/build-quizzes-bundle.mjs    # if quizzes/*.json changed
```

**Priority ordering** (pick tasks top-down unless you have a reason):

1. **Section A** — hard-tier quiz authoring. A0 is done; A1–A53 is the biggest remaining surface area and the last Roadmap Outstanding item.
2. **Section F** — ongoing hygiene (stale blurbs, color tokens, AGENTS.md pitfalls). Grab when touching adjacent files.

---

## Section A — Hard-tier quiz questions (Outstanding #1 + Proposed: Difficulty scaling)

A0 shipped the schema; the runtime now reads a sibling `"hard": [ ... ]` array on each concept entry. Extend mastery beyond v1 by filling in hard-tier banks, one topic at a time.

**Schema reminder (already live):**

```json
"gelfand-duality-oa": {
  "title": "Commutative duality and spectra",
  "questions": [ /* v1 tier */ ],
  "hard":      [ /* v2 tier — proof-flavor, counterexamples, chained reasoning */ ]
}
```

`js/quiz.js` already renders a "Harder tier" gate after v1 mastery; `js/progress.js` tracks `v1` vs `hard` separately; `pathway.html` shows dual mastery rings (inner green v1, outer violet hard).

One hard-tier fixture exists in `quizzes/algebraic-topology.json` under `singular-homology` — use it as the reference shape.

**Per-task recipe (one task per topic):**

1. Open `quizzes/<topic>.json`.
2. For each concept entry, author 2–3 hard-tier questions. Hard-tier criteria:
   - Requires chaining two concepts on the page, not just recall.
   - Counterexample selection (MCQ where every choice looks plausible).
   - Numeric with non-trivial algebra (no direct plug-and-chug).
   - Proof-step ordering (shuffled bullet list → correct order).
3. Add under `"hard": [...]` per concept. Same shape as v1 questions.
4. `node scripts/build-quizzes-bundle.mjs` → regenerate bundle.
5. `node scripts/smoke-test.mjs` — no new errors.

**Roadmap update (per task):** bump the `798 quiz questions total` number in Current state. When all 53 topics are done, reword Outstanding #1 from "quiz depth" to closed, and remove "Difficulty scaling on quizzes" from Proposed improvements.

All 53 topics:

- [ ] **A1. `algebra`** · **A2. `algebraic-number-theory`** · **A3. `algebraic-topology`** (partial — 1 concept already has hard fixture) · **A4. `analytic-continuation`** · **A5. `bezout`** · **A6. `bsd`** · **A7. `category-theory`** · **A8. `class-field-theory`** · **A9. `commutative-algebra`** · **A10. `complex-analysis`** · **A11. `differential-forms`** · **A12. `differential-geometry`** · **A13. `dirichlet-series-euler-products`** · **A14. `elliptic-curves`** · **A15. `etale-cohomology`** · **A16. `frobenius-and-reciprocity`** · **A17. `functional-analysis`** · **A18. `functor-of-points`** · **A19. `galois`** · **A20. `galois-representations`** · **A21. `hecke-operators`** · **A22. `homological`** · **A23. `L-functions`** · **A24. `lie-groups`** · **A25. `measure-theory`** · **A26. `modular-forms`** · **A27. `modularity-and-flt`** · **A28. `moduli-spaces`** · **A29. `moonshine`** · **A30. `morphisms-fiber-products`** · **A31. `naive-set-theory`** · **A32. `operator-algebras`** · **A33. `p-adic-numbers`** · **A34. `partitions-generating-functions`** · **A35. `point-set-topology`** · **A36. `power-sums-bernoulli`** · **A37. `projective-plane`** · **A38. `quadratic-reciprocity`** · **A39. `real-analysis`** · **A40. `representation-theory`** · **A41. `riemann-surfaces`** · **A42. `riemannian-geometry`** · **A43. `sato-tate`** · **A44. `schemes`** · **A45. `sheaf-cohomology`** · **A46. `sheaves`** · **A47. `singular-cubics-reduction`** · **A48. `smooth-manifolds`** · **A49. `stacks`** · **A50. `sums-of-squares`** · **A51. `theta-functions`** · **A52. `upper-half-plane-hyperbolic`** · **A53. `waring`**

> Parallelization note: A1–A53 are all independent. Fan out freely. Typical time per topic: 20–40 min depending on concept count (5–26 concepts per topic, median 5).

---

## Section F — Ongoing hygiene (pick-up-as-you-go)

Not formal outstanding work, but easy wins to grab when touching adjacent files:

- [ ] **F1. Audit stale concept blurbs.** Some blurbs date to before the anchor contract was enforced; a pass to ensure blurbs match the section content would improve `pathway.html` preview text.
- [ ] **F2. Color-token cleanup.** A few older pages still inline hex colors in SVG widgets; replace with CSS-variable references. Also: the `.callback` and `.changelog` rules injected in Round 2 use a hardcoded cyan border (`rgba(88,196,221,…)`) — good candidate to unify with each page's section accent color.
- [ ] **F3. AGENTS.md "common pitfalls" section.** Consolidate recurring gotchas (3D drag decimation, legend coords, quiz bundle ordering, anchor contract, two-tier quiz schema, callback idempotency, changelog re-seed) into a single top-of-file checklist for new contributors.
- [ ] **F4. Reconcile changelog placeholders.** Five pages carry a `2026-04-20 · initial version` placeholder row (`power-sums-bernoulli`, `waring`, `partitions-generating-functions`, `moonshine`, `analytic-continuation`). After the next few commits touch those files, re-run `scripts/insert-changelog-footer.mjs` and verify real git rows replace the placeholder.

---

## Completion checklist for ROADMAP.md

When a task is checked off here, the corresponding ROADMAP.md update is:

| Task range | ROADMAP.md section(s) to touch |
|------------|--------------------------------|
| A1–A53     | Current state (question-count bump); when all done, close Outstanding #1 + remove "Difficulty scaling" from Proposed improvements |
| F1–F4      | No roadmap change required (internal hygiene) |

---

## Archive — completed sections (for reference)

**Fan-out #3 (2026-04-20):**

- **Round 1**
  - **A0 (two-tier schema).** `js/progress.js` and `js/quiz.js` extended; `pathway.html` shows dual mastery rings; `AGENTS.md § Quiz + progression` documents the new shape; fixture in `algebraic-topology.json`.
  - **B1–B5 (narrative side quests).** Five new pages shipped: `power-sums-bernoulli.html`, `waring.html`, `partitions-generating-functions.html`, `moonshine.html`, `analytic-continuation.html`. Each with full concept graph (5 concepts) + quiz bank (~15 Q). Registered in `concepts/index.json` and `index.html`.
  - **D1–D4 (4→5 concept expansion).** `hecke-operators`, `modular-forms`, `quadratic-reciprocity`, `upper-half-plane-hyperbolic` each gained one new concept with anchor-bearing section + quiz entry. No topic remains at the 4-concept floor.

- **Round 2**
  - **C1–C3 (cross-page callbacks).** `scripts/audit-callbacks.mjs` inserts `<aside class="callback">` on 49 pages; 149 cross-topic prereq edges surface as "See also" links; smoke-test guard added.
  - **E1–E3 (changelog footers).** `scripts/insert-changelog-footer.mjs` seeds `<details class="changelog">` from `git log --follow` on all 53 pages; 133 real rows + 5 placeholders; smoke-test guard added.

**Fan-outs #1 and #2 (earlier, 2026-04-20):**

- **A (legacy, orphan quiz wiring)** — 4/4 topics wired.
- **B (legacy, missing quiz banks)** — 30/30 banks authored.
- **C (legacy, Wave-4 capstone expansion)** — 4/4 capstones expanded from 3-widget v1 to 9-widget v2.
- **D (legacy, under-resolved concept graphs)** — 39/39 topics expanded; 0 graphs remain at the 3-concept floor.
- **E (legacy, anchor contract docs)** — 1/1; `AGENTS.md` now documents the concept schema + anchor contract.
- **F1 (legacy, CI)** — `.github/workflows/verify.yml` runs all four scripts on push + PR.
- **F2 (legacy, offline bundle)** — `scripts/package-offline.mjs` produces `math-viz-notebook.zip` + `serve.sh`.

Full per-task history is in git (`git log --oneline`).
