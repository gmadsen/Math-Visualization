# Quality pass 2026-05 — section index

Per-topic pedagogical audits collated by section. Each per-topic report uses the schema:
notation drift / undefined jargon / tone mismatches / missing worked examples / KaTeX & formatting / severity.

**Severity scale:** `no significant issues` (skip) · `minor polish` (file an issue, fix in batch) · `needs rework` (block / re-author).

## Section progress

| Section | Topics | Audited | Status |
|---|---:|---:|---|
| Logic & Foundations | 8 | 8 | complete |
| Algebra & homological | 17 | 17 | complete |
| Higher categories & toposes | 7 | 7 | complete |
| Analysis | 22 | 22 | complete |
| Probability & statistics | 12 | 12 | complete |
| Geometry & topology | 26 | 26 | complete |
| Number theory | 19 | 19 | complete |
| Modular forms & L-functions | 20 | 20 | complete |
| Algebraic geometry | 35 | 35 | complete |
| Combinatorics & graph theory | 9 | 0 | pending |
| Mathematical physics | 11 | 0 | pending |
| Control theory & optimization | 4 | 0 | pending |
| **Total** | **190** | **166** | **87%** |

## Higher categories & toposes — consolidated findings (7/7)

All 7 topics rated `minor polish`. Section themes:

### Real bugs (highest priority)
- **`infinity-categories.html` line 360**: two real bugs in the same defining sentence for the homotopy relation `f \simeq g` — (a) `\\colon` (doubled-backslash leaked from a JS-string context, won't render); (b) `\partial_0\sigma = g, \partial_1\sigma = g` repeats `g` where intended values are `\mathrm{id}_y, g, f` (correct values appear in widget code at line 411).
- **`cocartesian-fibrations.html`** lines 270, 335: deep-links to `simplicial-sets-and-nerve.html#horns` — anchor doesn't exist (matching ids are `#kan-complex` and `#horn-filling`). Silent 404 per anchor contract. Cheapest fix: add `id="horns"` alias.
- **`simplicial-sets-and-nerve.html`** line 414 widget readout contains author note leaked as user copy: `'... s⁰d¹ = d¹s⁰? not quite, check the third identity.'`
- **`infinity-topoi.html` §5** missing the auto-injected `<!-- callback-auto-begin -->` block — verify against `concepts/infinity-topoi.json` whether that concept has no cross-topic prereqs or whether `audit-callbacks.mjs --fix` was skipped.

### Notation drift (within-section)
- Face-operator notation: `simplicial-sets-and-nerve` uses `d_i`/`d^i`; `infinity-categories` and `cocartesian-fibrations` use `\partial_i`. Same operator, different glyphs, three adjacent pages.
- Typed-arrow style: `cocartesian-fibrations` uses bare `:` for `$p: \mathcal{E} \to \mathcal{B}$`; both peers consistently use `\colon`. Mechanical mass-find/replace.
- Presheaf-topos hat: `elementary-topos-theory` uses `\hat{C}` everywhere; both peers use `\widehat{C}`.
- `elementary-topos-theory` is the in-section outlier on `\mathbf{Set}` (others use `\mathsf{Set}`).
- `infinity-topoi`: `\mathcal{X}_\flat` (line 715) vs standard `\tau_{\leq 0}` (line 952) for the same idea.
- `elementary-topos-theory` has a bare Japanese `よ(c)` for the Yoneda embedding (line 573) — used nowhere else in the corpus, in math mode unwrapped.

### Undefined jargon
- `infinity-categories`: "fibrant in the Joyal model structure", "inner fibration", "trivial Kan fibration", "Dwyer–Kan", `\mathbb{E}_\infty`-ring spectrum
- `cocartesian-fibrations`: "inner fibration" used in §1 widget Step 4 + §2 prose before its only quasi-definition in §3 line 429; lax colimit, cofiber sequence, $E_n$-algebras, biCartesian
- `simplicial-sets-and-nerve`: presheaf topos structure, subobject classifier, Quillen equivalence, Joyal model structure, $(\infty,1)$-categories, right lifting property
- `heyting-algebras-toposes`: Beck–Chevalley (§3+§6), locally cartesian closed (§3), regular open (§5)
- `elementary-topos-theory`: sober space, Frobenius reciprocity
- `grothendieck-topologies-sites`: "sober", `\Omega` (used as if defined; only callback to ETT)
- `infinity-topoi`: `\mathrm{Kan}_\infty`, "animae" introduced §1 line 278 with no callback

### Missing widgets / worked examples
- `grothendieck-topologies-sites` §5 (Giraud-axioms) is decorative SVG only; peer infinity-topoi has interactive scrubber for same content.
- `grothendieck-topologies-sites` §6 widget never delivers prose promise ("trace what $f^*$ and $f_*$ do to a specific sheaf").
- `heyting-algebras-toposes` §6 asserts $f^*$ doesn't preserve $\Rightarrow/\forall$ but exhibits no concrete failing $f$.
- `heyting-algebras-toposes` §5 alludes to Cohen forcing without sketching a base topos.
- `elementary-topos-theory` §2 has display-math pullback square that peers would render as SVG.
- `simplicial-sets-and-nerve` §2 needs non-representable simplicial-set toy.
- `infinity-categories` §5 (Adjunctions), §6 (Kan extensions) widgets are conceptual, not worked.
- `cocartesian-fibrations` §5 abstract straightening scrubber doesn't share running example with §5's code-cell. §7 examples (b)/(c)/(d) prose-only. §6 universal-left-fibration widget is illustration-only.
- `infinity-topoi` §5 hypercompletion widget classifies cases without computing one.

### Other
- `heyting-algebras-toposes` §2 line 428: densest formula-without-narration block on the page.
- `simplicial-sets-and-nerve` lines 274, 664: `<p style="text-align:center">$...$</p>` instead of `$$...$$` per peer convention (same anti-pattern as `naive-set-theory` line 681).

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

## Analysis — consolidated findings (22/22)

21 topics rated `minor polish`; **1 topic rated `needs rework` (`complex-analysis`)** — the only such finding so far in the audit.

### Real bugs (highest priority)
- **`complex-analysis.html`**: 8 inline `(§N)` cross-references in §16, §17, §18, §24 target stale section numbers — `Open Mapping` was inserted as §15 after numbering was set, so reader clicking "the residue theorem (§18)" lands on "Classification of singularities" and "Riemann mapping (§24)" lands on "Normal families." (`needs rework`)
- **`real-analysis.html:1281`** (§8): missing `$…$` delimiters and `\le` macro: text `"The sublevel set ({(x,y): g_a(x,y)le 0})"` renders as raw characters in-browser.
- **`harmonic-functions.html:287`** (§1): literal `;=;` instead of `\;=\;` — visible semicolons in the defining Laplace equation `$\Delta u ;=; \sum… ;=; 0$`.
- **`infinity-categories.html:360`** (cross-section reminder): doubled `\\colon` won't render and value-repetition typo (already in Higher categories findings).
- **`several-complex-variables.html`**:
  - Lines 165–172 manually load 6 scripts + 2 stylesheets that lines 173–183 then reload inside the `breadcrumb-head-auto-*` fence — 8 duplicated resources, including `concepts/bundle.js`.
  - §6 line 819: paragraph self-contradicts mid-sentence about whether ℂ²\{0} is Stein (claims it's not, then admits it actually is in a parenthetical).
  - §6 widget title says "Cousin obstructions on ℂℙ¹×ℂ*" but draws two abstract ellipses, no actual ℂℙ¹/annulus geometry.
- **`dynamical-systems.html`**:
  - Line 1244: orphan `</p>` with no opening tag inside a `<div class="note">`.
  - Line 1386: JS camelCase `fillOpacity:0.25` as SVG attribute (browsers ignore) — §9 `#w-div` blob renders fully opaque instead of 0.25.
  - Lines 210–212: overrides canonical `drawArrow` defaults (canonical 14/16; target 0/8) — violates AGENTS.md helper-block rule.
- **`conformal-and-cr-geometry.html`**:
  - Line 855: cross-reference says "§6 of Several complex variables" but the link goes to `#psh` which is §2 (§6 is Cousin problems).
  - §7 dictionary widget writes `rows[active].l` strings via `out.textContent` AFTER KaTeX's auto-render pass — users see literal `$\Delta_g$ (Laplacian)` source.
- **`fixed-point-theorems.html`** §6 Caristi widget: line 472 hint reads `Slide x_0; orbit displacement is capped by varphi.` (raw `x_0` and `varphi`); line 534 SVG axis label is literal `"varphi"` while line 500 uses Unicode `φ`.
- **`numerical-analysis.html`**: every section §1–§6 emits its "See also" callback TWICE — once fenced, once unfenced after the quiz placeholder. Page has 12 callback asides vs 5 in each peer. The unfenced one isn't strippable by `audit-callbacks.mjs --fix`. Same pattern as `cluster-algebras`/`geometric-and-combinatorial-group-theory`/`quantum-groups` — corpus-wide issue.
- **`operator-algebras.html` §16**: opener leaks authoring context (`*The user's aside, made precise*`).
- **`geometric-measure-theory.html`** §6: `gmt-plateau` widget hint promises drag-the-boundary-point interactivity that isn't implemented (endpoints hard-coded at line 1574).
- **`partial-differential-equations.html` §3** (wave equation): only section without a "See also" callback aside; verify against `concepts/partial-differential-equations.json` whether prereqs were missed.

### Cross-page semantic drift
- **Heisenberg uncertainty bound** (high priority): `wavelets` §5 quotes `\Delta x\,\Delta\xi\gtrsim 1`; `harmonic-analysis-fourier` §5 establishes `\sigma_x\sigma_\xi\ge 1/(4\pi)`. Two different bounds for the same statement on adjacent pages.
- **Upper half-plane** (cross-section, with Modular forms): `complex-analysis` §23 uses `\mathbb{H}`; modular-forms uses `\mathcal{H}`.
- **Sharkovsky/Sharkovskii** spelling: `dynamical-systems` line 825 uses Sharkovskii, line 771 + `mathematical-chaos` everywhere uses Sharkovsky.
- **Compact operators**: `operator-algebras` uses bare `K(H)`; `spectral-theory` and `functional-analysis` use `\mathcal{K}(H)`.
- **British vs American spelling**: `sobolev-spaces-distributions` uses _regularised, minimiser, optimisation_ throughout; rest of corpus is American. Consistent enough that it's a stylistic decision worth recording or flipping.

### Within-page notation drift
- `measure-theory`: `\mathcal{L}` overloaded — informal in §1, formal `\mathcal{L}^p(\mu)` in §8.
- `complex-analysis`: `\operatorname{Res}` vs `\mathrm{Res}` within 5 lines of each other in §19.
- `wavelets` §3 jargon dump: QMF / spectral-factor / minimum-phase filter all introduced same sentence (line 358).
- `infinity-topoi`: `\mathcal{X}_\flat` (line 715) vs standard `\tau_{\leq 0}` (line 952).

### Missing widgets / worked examples
- `measure-theory` §2 (the foundational σ-algebras section, anomalous given peers' widget-per-section discipline).
- `functional-analysis` §6, §11, §13, §14, §15 (back-fill PR #89 didn't get widgets).
- `complex-analysis` §5, §13, §23, §25, §26, §27 (six sections; §27 analytic continuation is the most visual-friendly miss).
- `advanced-complex-analysis` §4, §5, §6, §7, §8 — five back-to-back narrative-only sections.
- `harmonic-analysis-fourier` §4 (Schwartz), §6 (Poisson summation).
- `several-complex-variables` §4 (Domains of holomorphy & Levi pseudoconvexity).
- `operator-algebras` §12 duplicates §13 state-definition; should refocus on positive cone with worked widget.
- `microlocal-analysis` §5/§7 jargon density; §6 Strichartz/dispersive name-drops.

### Other
- `operator-algebras` `\mathrm{conv}` should be `\operatorname{conv}`; type-roman labels `\mathrm{II}_1` not used consistently with bare-ASCII "II$_1$" elsewhere on the same page.
- `dynamical-systems` §6/§7 duplicate the period-doubling cascade text including the verbatim Feigenbaum-constant formula.
- `complex-analysis` 2D helper diverges in `pad1/pad2` defaults from canonical (harmless but flagged).
- `mathematical-chaos` Sharkovsky proof-scrubber uses `$…$` inside `svgInner` strings — `renderMathInElement` skips `<svg>`, needs verification.

## Logic & Foundations — recommended fix bundle

Order the recommended next PR by cost / impact:

1. **Fix the model-theory-basics callback bug** (drop stale prereq, re-run callback fixers). One commit, ~5 min.
2. **Pass to add 3 missing widgets** (naive `\S 5`, zfc `\S 7`, forcing `\S 5` worked example). Larger; deserves its own PR.
3. **Notation-pass batch** (one-liner glosses for the undefined-jargon hits, the 4 within-page inconsistencies, the cross-page `\mathcal L`/`\sigma` bridge). Small, mechanical, one PR per topic or rolled up by section.
4. **Cosmetic batch** (ccc duplicate, hint wording, SVG ID renames, display-math conversion). Lowest priority, defer.
