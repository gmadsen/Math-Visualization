# Section taxonomy + topic placement review

_Read-only review of `concepts/sections.json` × `concepts/index.json` levels × `concepts/capstones.json`. 83 topics across 8 sections._

## Headline findings

1. **Algebra (14) is silently two sections.** A coherent classical core (`algebra`, `category-theory`, `representation-theory`, `commutative-algebra`, `homological`, `derived-categories`, `group-cohomology`) sits next to a self-contained higher-categorical / topos arc (`elementary-topos-theory`, `heyting-algebras-toposes`, `grothendieck-topologies-sites`, `simplicial-sets-and-nerve`, `infinity-categories`, `cocartesian-fibrations`, `infinity-topoi`). Capstones agree: `capstone-yoneda` and `capstone-infinity-topoi` both live under `Algebra` but target totally different audiences.
2. **Algebraic geometry (19) is the largest section and double-counts a capstone arc.** `etale-cohomology` (capstone, level=`capstone`) lives alphabetically among standard AG topics, while sister capstones (`sato-tate`, `bsd`, `modularity-and-flt`) live under Modular forms. There is no consistent home for Wiles-arc capstones.
3. **Foundations (1) is vestigial as a top-level peer.** A single page (`naive-set-theory`, level=`prereq`) does not earn a section header equal in weight to "Algebra" or "Algebraic geometry". It is currently a styling slot, not a curricular unit.
4. **Combinatorics & graph theory (5) is genuinely a new pillar**, and the only section whose color (`g`) collides with another live section (Algebraic geometry, also `g`). Worth fixing while it's small.
5. **Number theory ↔ Modular forms cut is approximately right but two topics straddle it.** `frobenius-and-reciprocity` and `class-field-theory` are pure number theory (correctly placed), but `galois-representations` (currently in Modular forms, marked `capstone`) is the bridge concept that arguably belongs adjacent to `frobenius-and-reciprocity`.

## Section-by-section evaluation

### 1. Foundations (1 topic, color `b`)

**Scope statement:** Naive set-theoretic prerequisites assumed by every other page.

- **Fits:** `naive-set-theory`.
- **Misfits / debatable:** none — it's just empty.
- **Sizing:** structurally underweight. Sections in this notebook are content pillars (Algebra, AG); a 1-topic section is a card category, not a pillar. Two viable repairs: (a) absorb into `index.html` as a "Before you start" callout, (b) demote the section header and let `naive-set-theory` orphan-float at the top of the index. Either way, **don't keep it as a peer of 14- and 19-topic sections in the live nav**.

### 2. Algebra (14 topics, color `y`)

**Scope statement:** Algebraic structures, category theory, homological methods, and the higher-categorical / topos tower.

- **Fits well:** `algebra`, `category-theory`, `representation-theory`, `commutative-algebra`, `homological`, `derived-categories`, `group-cohomology`. These are the classical-graduate-algebra core.
- **Misfits / debatable:** the 7 higher-categorical topics (`elementary-topos-theory`, `heyting-algebras-toposes`, `grothendieck-topologies-sites`, `simplicial-sets-and-nerve`, `infinity-categories`, `cocartesian-fibrations`, `infinity-topoi`). They are technically "Algebra" only by adjacency to category theory, but their audience, prereq depth, and pedagogical tone are different — these are post-Lurie, the rest are pre-Eisenbud. The fact that the Stacks-Project arc and ∞-topoi capstone all funnel through these 7 pages means they read as a coherent _separate_ unit, not seven Algebra topics.
- **Sizing:** 14 is too many for one section header on the index. Splitting (see proposals) gets two natural sections of 7 each, both of which are pedagogically clean.

### 3. Analysis (9 topics, color `p`)

**Scope statement:** From ε–δ to operator algebras and PDE machinery.

- **Fits well:** `real-analysis`, `measure-theory`, `complex-analysis`, `functional-analysis`, `operator-algebras`, `probability-theory`, `harmonic-analysis-fourier`, `sobolev-spaces-distributions`.
- **Misfits / debatable:** `dynamical-systems` — this is currently in Analysis, but `dyn-orbits-flows` opens with "smooth vector field $X$ on $M$ … flow $\Phi_t$"; that's smooth manifolds territory. A learner reaching dynamical systems via "Analysis" hits a manifold prerequisite cliff. Plausible alternate home: Geometry & topology, between `smooth-manifolds` and `riemannian-geometry`. Counter-argument: ergodic theory and circle-rotation examples lean analytic. Verdict: keep in Analysis but flag for explicit cross-section callbacks.
- **Sizing:** appropriate. 9 is the median section size.

### 4. Geometry & topology (8 topics, color `v`)

**Scope statement:** Point-set + algebraic + differential + Riemannian + Lie + Riemann surfaces.

- **Fits well:** all 8 topics. This is the cleanest section in the corpus.
- **Misfits / debatable:** mild quibble — `riemann-surfaces` arguably belongs nearer to `complex-analysis` and `algebraic-curves-higher-genus`, but it's a textbook geometry topic and the current placement is defensible.
- **Sizing:** appropriate.

### 5. Number theory (12 topics, color `y`)

**Scope statement:** Galois → reciprocity → algebraic NT → adèles → CFT → heights.

- **Fits well:** `galois`, `quadratic-reciprocity`, `quadratic-forms-genus-theory`, `sums-of-squares`, `power-sums-bernoulli`, `waring`, `algebraic-number-theory`, `p-adic-numbers`, `adeles-and-ideles`, `frobenius-and-reciprocity`, `class-field-theory`, `heights-arithmetic-geometry`.
- **Misfits / debatable:** color collision with Algebra (both `y`). This is harmless on the index page (separate section headers) but matters in `pathway.html` and `mindmap.html` where node fills cluster — Algebra and Number theory nodes become indistinguishable.
- **Sizing:** appropriate. Coherent prereq spine top-to-bottom.

### 6. Modular forms & L-functions (15 topics, color `c`)

**Scope statement:** Upper half-plane → modular forms → Hecke / L → Galois reps → arithmetic capstones.

- **Fits well:** `upper-half-plane-hyperbolic`, `modular-forms`, `theta-functions`, `partitions-generating-functions`, `hecke-operators`, `dirichlet-series-euler-products`, `analytic-continuation`, `zeta-values`, `L-functions`, `automorphic-forms-adelic`, `moonshine`.
- **Misfits / debatable:**
  - `galois-representations` is a bridge topic. `galois-rep-definition` ("continuous homomorphisms to linear groups encode arithmetic symmetries") is pure NT machinery; the modular-forms connection is a downstream consequence (Deligne–Serre, Eichler–Shimura). It would slot equally well at the end of Number theory, where it would also sit next to `frobenius-and-reciprocity` as the natural successor. Currently `level=capstone` here; if moved to NT the level becomes more defensible as `advanced` since other capstones in MF/L use it as a black box.
  - `sato-tate`, `bsd`, `modularity-and-flt` are all `level=capstone` and are the three Wiles-arc capstones. They live correctly next to `modular-forms` but read structurally like a "Capstones" sub-band.
- **Sizing:** 15 is large but coherent.

### 7. Algebraic geometry (19 topics, color `g`)

**Scope statement:** Projective geometry → schemes/sheaves → cohomology → moduli/stacks/spaces → arithmetic-geometry tools.

- **Fits well:** `projective-plane`, `bezout`, `schemes`, `sheaves`, `morphisms-fiber-products`, `functor-of-points`, `elliptic-curves`, `singular-cubics-reduction`, `moduli-spaces`, `sheaf-cohomology`, `stacks`, `algebraic-spaces`, `algebraic-curves-higher-genus`, `intersection-theory-chow`.
- **Misfits / debatable:**
  - `etale-cohomology` is a capstone (`level=capstone`) and is the punchline of the Weil-conjectures arc — sibling to `sato-tate`/`bsd`/`modularity-and-flt`. It is correctly tagged but its placement among "standard" AG topics in `concepts/index.json` ordering is misleading.
  - `etale-fundamental-group`, `group-schemes`, `deformation-theory`, `algebraic-de-rham-cohomology`: all four are "AG-as-toolkit-for-arithmetic" topics. They are correctly in AG but a learner using the section as a roadmap would benefit from an explicit "post-Hartshorne" or "arithmetic-geometry tools" sub-grouping.
- **Sizing:** 19 is the largest section. It fits — AG genuinely is this big — but the in-section ordering would benefit from explicit sub-bands (Foundations / Cohomology / Moduli / Arithmetic-toolkit).

### 8. Combinatorics & graph theory (5 topics, color `g`)

**Scope statement:** Graphs, matroids, probabilistic and extremal methods, simplicial combinatorics.

- **Fits well:** all 5 topics — internally coherent.
- **Misfits / debatable:** the section color `g` collides with Algebraic geometry's `g`. The two sections produce indistinguishable node fills in graph views.
- **Sizing:** appropriate for an early-stage section. Natural extensions (additive combinatorics, polytope theory, enumerative species) can fill out later.

## Proposed structural changes (ranked by impact)

1. **Split Algebra into "Algebra & homological" (7) + "Higher categories & topos theory" (7).** Highest-impact change. Cleanly partitions the section by audience and prereq depth; resolves the mismatch between `capstone-yoneda` (classical) and `capstone-infinity-topoi` (Lurie). Proposed boundary: classical = `algebra`, `category-theory`, `representation-theory`, `commutative-algebra`, `homological`, `derived-categories`, `group-cohomology`; higher = `elementary-topos-theory`, `heyting-algebras-toposes`, `grothendieck-topologies-sites`, `simplicial-sets-and-nerve`, `infinity-categories`, `cocartesian-fibrations`, `infinity-topoi`. Color suggestion: keep Algebra `y`, give Higher cat/topos a free color (currently no section uses pink-violet hybrid, or reuse `v` since Geometry/Topology already owns `v`). Downstream: `concepts/sections.json`, `concepts/capstones.json` `section` field for `capstone-infinity-topoi`, `pathway.html` legend, `index.html` section grid, `README.md`.
2. **Demote Foundations from a top-level section.** Either fold `naive-set-theory` into the index page as a "Before you start" callout, or rename the section to "Prerequisites" and (over time) absorb other prereq-tier topics that today are stranded inside their downstream sections. Keeping a 1-topic section header is structural noise.
3. **Recolor Combinatorics & graph theory to break the `g` collision with Algebraic geometry.** Pick `b` (currently only Foundations uses it, and that section is small and may be removed). Cheap, mechanical, fixes mindmap/pathway visual confusion. Touches: `concepts/sections.json`, the in-page accent classes if any.
4. **Move `galois-representations` from Modular forms & L-functions into Number theory**, place it after `frobenius-and-reciprocity`. It opens with "Continuous homomorphisms to linear groups encode arithmetic symmetries" — that's a NT topic. Modular forms then references it as a black box (one-way callback, not a sibling). Also revisit its `capstone` level: it functions as a bridge concept, not a goal-tier result; `advanced` is a better fit.
5. **Optional: introduce a "Capstones" pseudo-section in `pathway.html` only** (not in `concepts/sections.json`) that visually groups the 6 `level=capstone` topics: `etale-cohomology`, `stacks`, `galois-representations` (if not relabeled), `sato-tate`, `bsd`, `modularity-and-flt`. Don't move them out of their subject homes — that breaks the prereq DAG locality — but offer a "show me only the capstone goals" filter. Lower priority because `capstones.json` already drives this in `pathway.html`.
6. **Within Algebraic geometry, declare a sub-banding in the topic order** (no schema change, just `concepts/index.json` ordering convention): Foundations (`projective-plane` → `bezout` → `schemes` → `sheaves` → `morphisms-fiber-products` → `functor-of-points`), Curves & cohomology (`elliptic-curves` → `singular-cubics-reduction` → `algebraic-curves-higher-genus` → `sheaf-cohomology` → `algebraic-de-rham-cohomology`), Moduli & stacks (`moduli-spaces` → `algebraic-spaces` → `stacks` → `intersection-theory-chow`), Arithmetic-geometry tools (`group-schemes` → `etale-fundamental-group` → `deformation-theory` → `etale-cohomology`). Pure ordering nudge; no JSON schema work.

## Levels-map corrections

Spot-checked candidates:

- **`galois-representations`: `capstone` → `advanced`.** The page is a bridge concept, not a goal. The four current `capstone`-level pages elsewhere (`stacks`, `sato-tate`, `bsd`, `modularity-and-flt`, `etale-cohomology`) are all "deepest result, terminal node in the prereq DAG"; Galois reps is upstream of `modularity-and-flt` and `sato-tate` and shouldn't share the tier with its consumers.
- **`stacks`: `capstone` → debatable.** It's tagged `capstone` but `capstones.json` lists `capstone-moduli-stable-curves` (goal=`higher-genus-moduli`) which lives on `algebraic-curves-higher-genus`, not on `stacks`. The Stacks page itself hosts no goal in `capstones.json`. Either add a stacks-specific capstone goal or relabel `stacks` as `advanced` to match its "deep but not terminal" actual role.
- **`theta-functions`: `advanced` → debatable, possibly `standard`.** Currently `advanced` while siblings like `dirichlet-series-euler-products` and `partitions-generating-functions` are `standard`. Theta is a foundational construction in this section, not a deep consequence — closer to `modular-forms` (`standard`) than to `hecke-operators` (`advanced`). Lean toward `standard`.
- **`hecke-operators`: `advanced` → keep, but worth confirming.** The opening blurb is mechanical ("$T_p$ averages index-$p$ sublattices"); if the page proves the multiplicativity / Euler-factor consequences in depth, `advanced` is fine; if it stops at the definition, `standard`.
- **`heights-arithmetic-geometry`: `standard` → `advanced`.** Northcott + Néron–Tate canonical heights + Mordell–Faltings-via-heights is post-`algebraic-number-theory` and post-`elliptic-curves`, deeper than its current peer `frobenius-and-reciprocity` (also `standard`). Lean `advanced`.
- **`automorphic-forms-adelic`: `advanced` → consider `capstone`.** Adelic GL₂, restricted product, strong approximation: this _is_ a goal, on the road to Langlands. If `galois-representations` is downgraded to `advanced`, this is the natural Modular forms `capstone` slot for the automorphic side.

## Topic-ordering improvements

- **Algebra:** if not split, current ordering puts `derived-categories` after `homological` (good) but `group-cohomology` before the higher-categorical block (correct DAG). Consider moving `representation-theory` to immediately after `algebra` (it's the most accessible follow-on) and pushing `category-theory` to position 3, since most learners will read Rep Theory before getting comfortable with categories.
- **Number theory:** strong existing order. One nudge: place `quadratic-forms-genus-theory` between `quadratic-reciprocity` and `sums-of-squares` (currently it's later in `concepts/index.json`, separated from its natural neighbors). Already true in `sections.json` so just align `index.json`.
- **Modular forms:** current order interleaves analytic objects (`zeta-values`, `analytic-continuation`) with arithmetic ones (`galois-representations`). Suggested re-grouping: hyperbolic foundations → modular-forms machinery (`modular-forms`, `theta-functions`, `partitions-generating-functions`) → analytic toolkit (`dirichlet-series-euler-products`, `analytic-continuation`, `zeta-values`, `L-functions`) → Hecke + Galois reps → adelic / capstones. Mostly cosmetic.
- **Algebraic geometry:** sub-banding (see proposal #6) is the main lever.

## Out of scope / hands off

- **`riemann-surfaces` in Geometry & topology, not Algebraic geometry.** Looks like it could move (genus, divisors, Riemann–Roch all live there). It's deliberate — `riemann-surfaces` is the analytic complex-1-manifold view, intentionally distinct from `algebraic-curves-higher-genus`. Don't relitigate.
- **`upper-half-plane-hyperbolic` in Modular forms, not Geometry & topology.** Hyperbolic geometry per se belongs in G&T, but this page is _specifically_ the SL₂(ℝ) action stage that modular forms uses. The framing is intentional.
- **`functor-of-points` in Algebraic geometry, not Algebra.** Yoneda's there too — but `functor-of-points` is specifically the AG application (representable schemes), not a category-theory lecture. Correctly placed.
- **`group-cohomology` in Algebra, not Algebraic geometry or Number theory.** Has heavy CFT downstream consumers. The home is correct because the page itself is the Ext / bar resolution machinery, not the arithmetic application.
- **Power sums + Bernoulli + Waring in Number theory.** They are elementary-feeling but the prereq spine to `analytic-continuation` and `zeta-values` is real; correctly placed.
- **Color reuse `y` for Algebra and Number theory.** Currently a known harmless duplication on the index (separate section headers). Only worth changing if accent palette expands.

[taxonomy reviewer]
