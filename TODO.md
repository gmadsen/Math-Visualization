# TODO

Self-contained tasks derived from `ROADMAP.md` § Outstanding and § Proposed improvements. Each task can be picked up by a fresh agent in parallel — no cross-task dependencies unless explicitly noted. When a task is checked off, the **Roadmap update** line tells you exactly what to change in `ROADMAP.md`.

## Status (2026-04-20 — after parallel fan-out #4)

Fan-out #4 closed Section A (hard-tier authoring, all 56 topics), Section G (capstone prereq-threading, G1–G4), Section F2–F4 hygiene, plus the two top Proposed improvements ("More narrative side quests" and "Deeper cross-referencing"). ROADMAP § Outstanding is now empty — the notebook has no tracked must-do work.

Current baseline:

```text
56 topic pages · 318 concepts · 843 v1 + 829 hard questions · 22 capstones
two-tier quiz schema with full hard-tier coverage (281/281 concepts-with-quizzes)
171 forward callback edges · 227 reverse backlink asides
per-page <details class="changelog"> footers on every topic page
validate-concepts.mjs          → 0 errors, 0 warnings
audit-callbacks.mjs            → OK (all cross-topic prereqs covered)
insert-used-in-backlinks.mjs   → OK (all downstream consumers surfaced)
smoke-test.mjs                 → 56/56 OK
CI (GitHub Actions)            → green
```

Before starting any task, read [`AGENTS.md`](./AGENTS.md) (especially the new § "Common pitfalls"). After finishing, always run:

```bash
node scripts/validate-concepts.mjs
node scripts/audit-callbacks.mjs
node scripts/insert-used-in-backlinks.mjs
node scripts/smoke-test.mjs
node scripts/build-concepts-bundle.mjs   # if concepts/*.json changed
node scripts/build-quizzes-bundle.mjs    # if quizzes/*.json changed
```

## Next wave — Proposed improvements pulled forward from ROADMAP

These are the handful of follow-ups that accumulated during fan-out #4. All are low-urgency; pick them up as the mood strikes.

- [ ] **P1. Third-tier "expert" quiz schema.** Sibling `"expert": [ ... ]` array per concept, unlocked after hard mastery; extend `MVProgress` to a 3-tier model and `pathway.html` to a 3-ring node rendering. Authoring is out-of-scope here — just wire the schema + UI.
- [ ] **P2. Pathway study-plan export.** On `pathway.html`, add a "Copy as study plan" button that, given a capstone, writes a linear topo-sorted list of ancestors as Markdown to the clipboard.
- [ ] **P3. Widen the color-var substitution table.** `scripts/` has no color-audit script yet. Writing one would let us flip legacy `#58c4dd` → `var(--blue)` etc. safely (the color-token sweep in fan-out #4 skipped this because the palette hex and widget hex currently coincide).
- [ ] **P4. Stale-blurb audit.** Walk every concept in `concepts/*.json`, compare the blurb against the owning `<section>` content on its topic page, flag or rewrite any that drift. Small surface-area pass that meaningfully improves pathway preview text.

---

## Completion checklist for ROADMAP.md

When a task is checked off here, the corresponding ROADMAP.md update is:

| Task range | ROADMAP.md section(s) to touch |
|------------|--------------------------------|
| P1         | Add a bullet to Current state describing the 3-tier schema; drop P1 from Proposed improvements |
| P2         | Add a bullet to Current state describing the export button; drop P2 from Proposed improvements |
| P3         | Internal hygiene — mention in the "Recently shipped" block if you want, no structural change needed |
| P4         | Internal hygiene — same |

---

## Archive — completed sections (for reference)

**Fan-out #4 (2026-04-20):**

- **Section A (hard-tier quiz authoring).** A1–A53 shipped, plus hard-tier banks for the three new side-quest pages. 281 of 281 concept entries with quizzes now carry a `"hard"` sibling array. 829 hard-tier questions total.
- **Section B (new narrative side quests).** Three new pages: `zeta-values.html`, `adeles-and-ideles.html`, `quadratic-forms-genus-theory.html`. Each registered in `concepts/index.json`, `index.html`, `concepts/bundle.js`, `quizzes/bundle.js`; each ships a 5-concept graph, 5 quiz entries with hard tier, full page scaffolding, changelog footer.
- **Section G (capstone prereq-threading).** G1–G4 all shipped. Cross-topic prereq edges added to `solvability-by-radicals`, `yoneda-limits-adjunctions`, `ramanujan-congruences`, `quadratic-reciprocity-law`. Ancestry breadth now well above the old 4-node floor.
- **Section F2 (color-token cleanup).** ~95 hex literals across 58 files replaced with `var(--*)`. `.callback` borders switched from hardcoded `rgba(88,196,221,…)` to `color-mix(in srgb, var(--cyan) 45%, transparent)`. `.related` borders follow the same pattern on `var(--mute)`.
- **Section F3 (AGENTS.md pitfalls checklist).** New § "Common pitfalls" near the top of `AGENTS.md` consolidating the recurring gotchas from two-tier schema, anchor contract, quiz bundle regeneration, callback idempotency, 3D decimation, legend placement, changelog re-seed, etc.
- **Section F4 (changelog placeholder reconciliation).** `scripts/insert-changelog-footer.mjs` re-run; real git rows replaced the 5 older side-quest placeholders. Three placeholders remain on the brand-new fan-out #4 side-quests — they'll flip after the first commit that touches those files.
- **Bidirectional backlinks (ROADMAP Proposed "Deeper cross-referencing").** New `scripts/insert-used-in-backlinks.mjs` generates and maintains `<aside class="related">` reverse-direction blocks on 227 concept sections, 457 downstream edges, capped at 6 items + overflow. Idempotent via `<!-- backlinks-auto-begin -->` fences. Wired into CI.

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
