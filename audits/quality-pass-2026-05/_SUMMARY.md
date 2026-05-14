# Quality pass 2026-05 — section index

Per-topic pedagogical audits collated by section. Each per-topic report uses the schema:
notation drift / undefined jargon / tone mismatches / missing worked examples / KaTeX & formatting / severity.

**Severity scale:** `no significant issues` (skip) · `minor polish` (file an issue, fix in batch) · `needs rework` (block / re-author).

## Section progress

| Section | Topics | Audited | Status |
|---|---:|---:|---|
| Logic & Foundations | 8 | 8 | complete |
| Algebra & homological | 17 | 17 | complete |
| Higher categories & toposes | 7 | 0 | pending |
| Analysis | 22 | 0 | pending |
| Probability & statistics | 12 | 0 | pending |
| Geometry & topology | 26 | 0 | pending |
| Number theory | 19 | 0 | pending |
| Modular forms & L-functions | 20 | 0 | pending |
| Algebraic geometry | 35 | 0 | pending |
| Combinatorics & graph theory | 9 | 0 | pending |
| Mathematical physics | 11 | 0 | pending |
| Control theory & optimization | 4 | 0 | pending |
| **Total** | **190** | **25** | **13%** |

## Logic & Foundations — consolidated findings (8/8)

All 8 topics rated `minor polish`. Recurring themes across the section:

### Real bugs (highest priority — fix before next batch)
- **`model-theory-basics` §6 callback** wrongly links to `symplectic-manifolds.html#floer`. Root cause: stale prereq `sm-floer-homology-preview` in `concepts/model-theory-basics.json` for the `mt-applications-to-algebra` concept. Fix: drop the prereq, re-run `audit-callbacks.mjs --fix` + `inject-used-in-backlinks.mjs --fix`.

### Cross-page notation drift (1 finding)
- **`first-order-logic-and-completeness` vs `model-theory-basics`**: the same object is `\mathcal{L}` (FOL, 9x) and `\sigma` (model theory, 9x). Fix: one bridging clause in either §1.

### Within-page notation inconsistency (4 findings)
- `naive-set-theory`: `\mathbb{Z}/n\mathbb{Z}` vs `\mathbb{Z}/n`; `\mathbb{Z}_{\ne 0}` vs `\mathbb{Z}\setminus\{0\}` adjacent.
- `zfc-and-ordinals`: braced vs unbraced `\mathbb`; `\mathbb N_{>0}` vs `\mathbb N`.
- `computability-and-decidability`: `\Sigma_1^0` (§4) vs `\Sigma_1` (§6) for arithmetical hierarchy.
- `forcing-and-independence`: `\mathbb{P}` vs `\mathbb P`.

### Undefined jargon (every page has at least 2; the most common finding)
- `naive-set-theory`: limits / category of sets / `\mathbb{RP}^n` / `\pi_1` / `\sigma`-algebra
- `first-order-logic-and-completeness`: "presburger" (lowercase typo) / "recursively axiomatised" / "Tarski's undefinability"
- `zfc-and-ordinals`: `\aleph_0` before §4 defines it / DC / GCH / "stationary set" / "tree property" / "$\kappa$-complete ultrafilter"
- `model-theory-basics`: "quantifier rank" / "elementary extension" (3x without def)
- `computability-and-decidability`: "time-constructible" / "space-constructible" / "Kleene's $T$-predicate" / "dovetail"
- `complexity-theory`: ZPP / RP / BQP / QMA / PCP / IP / SETH; `q_acc`
- `type-theory-and-hott`: `\simeq` (HoTT-equivalence vs iso) / `\pi_1` / `\Omega` / "Kan complex / fibration / fibrant"
- `forcing-and-independence`: Suslin tree / Whitehead group / Aronszajn tree / `\diamondsuit` / `\Delta`-system / Easton / GCH / Borel determinacy / iterated forcing / Laver preparation

### Missing widgets / worked examples (3 findings)
- `naive-set-theory` §5 (axiom of choice) — no widget; the only section without one.
- `naive-set-theory` §2 (products) — no widget; partly covered by §1's Venn.
- `zfc-and-ordinals` §7 (Grothendieck universes) — no concrete poke-toy.
- `forcing-and-independence` §5 — no worked example for $\aleph_2$-many distinct reals (currently taken on faith).

### Cosmetic / formatting (5 findings)
- `naive-set-theory` line 681: `<p style="text-align:center">$…$</p>` instead of `\[…\]`.
- `zfc-and-ordinals`: SVG IDs `ch-svg` (§5) and `ch-svg2` (§6) — near-collision; IIFE-scoped so currently safe.
- `forcing-and-independence`: ccc defined twice (§1 + §4).
- `forcing-and-independence` §3: widget hint says "flip" but interaction is "click a preset".
- `type-theory-and-hott`: `\mathsf{}` vs `\mathrm{}` operator-style mixing (defensible per HoTT Book).

### Content-vs-promise gap (1 finding)
- `complexity-theory` §0 plan promises "many-one degree structure" but no section delivers. Either trim the promise or add a sentence on `\equiv_m` and m-degrees in §5.

### Tone (rare)
- `zfc-and-ordinals` §5 jumps to formalism faster than `naive-set-theory#choice` (missing shoes-vs-socks intuition).
- `zfc-and-ordinals` §7 large-cardinal name-density higher than peers allow.

## Algebra & homological — consolidated findings (17/17)

All 17 topics rated `minor polish`. Recurring themes across the section:

### Real bugs (highest priority)
- **`condensed-mathematics`**: undefined `\liq` macro used 3x (lines 762, 765, 780) — renders blank or raw under `throwOnError:false`. Plus a 2022/2021 date desync between §5 widget button label and underlying milestone data.
- **`quaternions-octonions-and-division-algebras`**: 2 broken cross-page anchors in §7 (silent 404s per anchor contract): `lie-groups.html#so3-su2` should be `#so3su2`; `algebra.html#field-extensions` should be `#extensions`.
- **`commutative-algebra`** §15 (line 2563) closing paragraph references "twelve sections" but the page now has sixteen — stale text from before §13/§14/§16 backfill.
- **Duplicate callbacks (corpus-wide pattern)**: hand-authored `<aside class="callback">` blocks coexisting with auto-injected fenced blocks in `quantum-groups` §1, `cluster-algebras` §§5–6, `geometric-and-combinatorial-group-theory` §§5–6. Readers see "See also" twice. `audit-callbacks.mjs` only checks coverage, not duplication — script enhancement needed.

### Notation drift (corpus-wide pattern)
- Pervasive `\mathrm{Op}` vs `\operatorname{Op}` mixing across all 17 pages — `\mathrm` overused for multi-letter operators (`Ext`, `Tor`, `Hom`, `Tot`, `Ch`, `Ind`, `Res`, `GL`, `End`, `Stab`, `sgn`, ...) where the canonical `category-theory.html` and `homological.html` use `\operatorname{...}`. Cleanest fix: extend the page's KaTeX `macros:` block with `\Ext`, `\Tor`, `\Tot`, `\Ch`, `\Ind`, `\Res`, etc., and rewrite call sites.
- Category-name fonts inconsistent across the section: `\mathbf{Top}` (model-categories), `\mathsf{Top}` (category-theory), `\mathrm{Ab}` (derived-categories). Three peers, three font conventions.
- `\mathbb{Z}` vs `\mathbb Z` (braces vs unbraced) interleaved inside many pages.
- Widget readouts emit raw ASCII (`sl_2`, `pi_1`, `>=`, `(+)`) outside `$…$` so KaTeX never re-renders them — `lie-algebras`, `representation-theory`, `algebraic-k-theory-foundations` all flagged.
- `galois-cohomology-and-brauer` uses Latin `\mathrm{III}` for Tate–Shafarevich; `bsd.html` and `elliptic-curves.html` use Cyrillic `\Sha → \text{Ш}`.

### Helper-block hygiene
- `algebra.html` and `homological.html` both omit `ensureArrow` / `drawArrow` / `drawNode` from the canonical helper block (per AGENTS.md § "Page-global helpers" the block must be copied verbatim from category-theory.html). Each ad-hoc widget then re-implements local arrow-drawing.

### Dead macros (corpus-wide)
- Most pages declare `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind` in the loader but never use most of them. Loader copy-paste inertia.

### Missing widgets / worked examples
- `algebra` §1, §7, §8 — no widget.
- `category-theory` §7 — no `<div class="quiz">` placeholder (anomalous; every other section has one).
- `commutative-algebra` §9, §14, §16 — no widget.
- `homological` §5 (LES — most important result on the page), §12, §13, §14 — no widget. Same late-back-fill signature as commutative-algebra §13/§14/§16.
- `representation-theory` §6 (Characters and orthogonality) — no widget.
- `quantum-groups` §5, §6 — no worked computation in prose.
- `lie-algebras` §5, §6 — no walked-through small weight string / Cartan-matrix worked case.
- `galois-cohomology` §5, §6 — read-only widgets only.
- `cluster-algebras` §5 (Caldero–Chapoton), §6 (Bordered surfaces, Total positivity).
- `derived-categories` §3, §6, §7 under-illustrated.
- `algebraic-k-theory-foundations` §6 (motivic) shares one truncating widget across three subsections.
- `quaternions-octonions` §3 (Cayley–Dickson), §6 (Hurwitz four-square).

### Tone slips (corpus-wide pattern)
- §11+ "Connections" sections drift into encyclopedia / name-drop register: `algebra` §16–§19, `representation-theory` §11, `lie-algebras` §7, `algebraic-k-theory` §7, `quaternions-octonions` §7, `cluster-algebras` §7. Recommend collapsing into the standard `<aside class="related">` callback pattern.
- §12–§14 of `homological` drier than §1–§11 (back-fill signature).

### Other notable
- `homological` §14 introduces `\mathbb{R}^n F` for hyper-derived without flagging that it differs from §9's `R^iF` — same semantic risk as `algebra`'s `Galois group` before §8.
- `cluster-algebras` polygon-flip widget has LaTeX-in-`textContent` leak (line 790) — `$\mu_d$` and `$x_{(i,j)}$` written after KaTeX scanned, render literal.
- `geometric-and-combinatorial-group-theory` §5 widget draws δ-neighborhood as Euclidean radius even in Poincaré-disk mode — pedagogically counterproductive in the section *defining* δ-thinness.
- `model-categories` Unicode `⫛` (U+2ADB) in widget readouts where the conventional symbol is `⊠`.
- `algebra` KaTeX loader omits `throwOnError:false` — future LaTeX typos render as red error badges instead of falling back to source.

### Cosmetic
- `zfc`/`commutative-algebra` SVG ID near-collisions (`ch-svg`/`ch-svg2`).
- `quaternions-octonions` line 459 hex literal `'#111'` (should be `var(--ink)`).

## Logic & Foundations — recommended fix bundle

Order the recommended next PR by cost / impact:

1. **Fix the model-theory-basics callback bug** (drop stale prereq, re-run callback fixers). One commit, ~5 min.
2. **Pass to add 3 missing widgets** (naive `\S 5`, zfc `\S 7`, forcing `\S 5` worked example). Larger; deserves its own PR.
3. **Notation-pass batch** (one-liner glosses for the undefined-jargon hits, the 4 within-page inconsistencies, the cross-page `\mathcal L`/`\sigma` bridge). Small, mechanical, one PR per topic or rolled up by section.
4. **Cosmetic batch** (ccc duplicate, hint wording, SVG ID renames, display-math conversion). Lowest priority, defer.
