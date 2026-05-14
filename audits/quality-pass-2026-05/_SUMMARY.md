# Quality pass 2026-05 — section index

Per-topic pedagogical audits collated by section. Each per-topic report uses the schema:
notation drift / undefined jargon / tone mismatches / missing worked examples / KaTeX & formatting / severity.

**Severity scale:** `no significant issues` (skip) · `minor polish` (file an issue, fix in batch) · `needs rework` (block / re-author).

## Section progress

| Section | Topics | Audited | Status |
|---|---:|---:|---|
| Logic & Foundations | 8 | 8 | complete |
| Higher categories & toposes | 7 | 0 | pending |
| Algebra & homological | 17 | 0 | pending |
| Analysis | 22 | 0 | pending |
| Probability & statistics | 12 | 0 | pending |
| Geometry & topology | 26 | 0 | pending |
| Number theory | 19 | 0 | pending |
| Modular forms & L-functions | 20 | 0 | pending |
| Algebraic geometry | 35 | 0 | pending |
| Combinatorics & graph theory | 9 | 0 | pending |
| Mathematical physics | 11 | 0 | pending |
| Control theory & optimization | 4 | 0 | pending |
| **Total** | **190** | **8** | **4%** |

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

## Logic & Foundations — recommended fix bundle

Order the recommended next PR by cost / impact:

1. **Fix the model-theory-basics callback bug** (drop stale prereq, re-run callback fixers). One commit, ~5 min.
2. **Pass to add 3 missing widgets** (naive `\S 5`, zfc `\S 7`, forcing `\S 5` worked example). Larger; deserves its own PR.
3. **Notation-pass batch** (one-liner glosses for the undefined-jargon hits, the 4 within-page inconsistencies, the cross-page `\mathcal L`/`\sigma` bridge). Small, mechanical, one PR per topic or rolled up by section.
4. **Cosmetic batch** (ccc duplicate, hint wording, SVG ID renames, display-math conversion). Lowest priority, defer.
