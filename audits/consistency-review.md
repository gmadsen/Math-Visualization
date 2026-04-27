# Cross-topic consistency audit

Read-only review against the canonical voice template (`category-theory.html`) and the
current 83-page corpus, with cross-checks against `content/*.json`, `quizzes/*.json`,
and `concepts/*.json`. Tools used: `audit-notation`, `validate-katex`,
`audit-cross-page-consistency`, plus targeted greps. Sampled at depth:
`category-theory.html`, `complex-analysis.html`, `algebraic-de-rham-cohomology.html`,
`spectral-graph-theory.html`, `automorphic-forms-adelic.html`,
`sobolev-spaces-distributions.html`, `group-cohomology.html`,
`heyting-algebras-toposes.html`, `intersection-theory-chow.html`,
`heights-arithmetic-geometry.html`.

## Headline findings

The corpus is in remarkably good shape on KaTeX hygiene (validator clean), HTML
shape (`audit-cross-page-consistency` reports 0 gaps), and the gold-standard
prose voice — `algebraic-de-rham-cohomology.html`, `automorphic-forms-adelic.html`,
and `spectral-graph-theory.html` are essentially indistinguishable in voice from
the template. The biggest visible drift is **slugged-from-filename `<title>`
tags** that the rest of the page then upstages with a fully-edited `<h1>` — a
dozen pages still display un-cased Wikipedia-stub titles in the browser tab.
Second-biggest is a **silently duplicated `<aside class="callback">` block** in
~5 pages (manual aside left in place when the auto-injector started fencing its
own copy). Notation is mostly consistent corpus-wide; the one real split is
`\mathrm{Spec}` (HTML side) vs `\operatorname{Spec}` (some `content/*.json` and
quizzes), with a handful of follow-on operators (`Hom`, `Gal`, `Frob`) that
would benefit from a one-line `\newcommand` block in the page header to
collapse 470+ inline `\operatorname{…}` invocations into named macros.

## Notation clashes

| Object | Topic A uses | Topic B uses | Recommended house style |
|---|---|---|---|
| `Spec` operator | `\mathrm{Spec}` (galois, commutative-algebra, etale-fundamental-group, sheaves) — 184 lines in HTML | `\operatorname{Spec}` (morphisms-fiber-products, schemes, algebraic-spaces in JSON) — 141 lines | Pick `\operatorname{Spec}` (correct spacing in `Spec\,A` form, KaTeX-native). Migrate or just define `\newcommand{\Spec}{\operatorname{Spec}}` once per page. |
| `Hom` | `\mathrm{Hom}` (14) | `\operatorname{Hom}` (1 in HTML, 110 across content+quizzes) | Same: `\Hom` macro. |
| `Gal`, `Frob`, `Aut`, `End`, `tr`, `Re`, `Im`, `im`, `rank`, `vol` | mixed `\mathrm` / `\operatorname` | per-topic | `audit-notation` already lists 16 macro candidates — add a shared header and migrate. |
| `\mathbb{Z}/n` quotient | `\mathbb{Z}/n` (52) and `\mathbb{Z}/2` (99) — bare slash form dominant | `\mathbb{Z}/n\mathbb{Z}` (10) — handful of holdouts | The bare-slash form is the de-facto house style. The 10 long-form occurrences look like incidental verbosity, not a deliberate disambiguation; collapse on next pass. |
| Iff symbol | `\iff` (87) | `\Leftrightarrow` (38) | `\iff`: it's the LaTeX-recommended logical-equivalence (auto-spaced); `\Leftrightarrow` is the relational form. |
| Map arrow | `\to` (3750) | `\longrightarrow` (54) — used in a couple of long named-arrow contexts in `morphisms-fiber-products`, `frobenius-and-reciprocity`, `galois-representations` | `\to` is canonical; `\longrightarrow` is fine when the arrow needs to span a label, but should not be sprinkled. |
| Cohomology coefficients | `H^*(X;\mathbb{Z})` semicolon (4) | `H^*(X,\mathbb{Z})` comma (2) — both rare, both used in `algebraic-topology.html`, `derived-categories.html`, `sheaf-cohomology.html` | Algebraic-topology house style is **semicolon for coefficients, comma for sheaves**: `H^*(X;\mathbb{Z})` vs `H^*(X,\mathcal{F})`. The comma cases (e.g. `H^2(C_2,\mathbb{Z}/2)` in group-cohomology) are group-cohomology convention and *should* stay — that's an anti-recommendation, see below. |
| Sheaf script | `\mathcal{F}` (uniform, ~140 occurrences across 13 files) | `\mathscr{F}` (1 — only `latex-cheatsheet.html`) | Already converged on `\mathcal{F}`; nothing to do. |
| Category | `\mathcal{C}` (302), `\mathcal{D}` (105) | `\mathbf{C}` (0) | Already converged on `\mathcal{C}`. |
| Hat presheaf cat | `\widehat{C}` (18) | `\hat{C}` (16) | `\widehat{C}` reads cleaner over multi-letter names; collapse to it. |

## Undefined / under-defined jargon

| Term | First-used topic (assumed-known) | Should-be-defined-in topic | Recommendation |
|---|---|---|---|
| `quasi-isomorphism` | used in `algebraic-de-rham-cohomology`, `derived-categories`, `infinity-categories`, `homological`, `deformation-theory`, `sheaf-cohomology` (7 files) | `homological.html` (chain complexes section) — currently appears but is not flagged with a definition heading | Add a one-line definition (`a chain map inducing isos on cohomology`) and cross-link from every other use. |
| `sheafification` | 9 files (algebraic-spaces, category-theory, elementary-topos-theory, grothendieck-topologies-sites, infinity-topoi, sheaves, sheaf-cohomology, homological) | `sheaves.html` covers it but the term is reached from upstream pages without callbacks | Add `<aside class="callback">` from `algebraic-spaces`, `infinity-topoi`, `homological` back to `sheaves#sheafification`. |
| `Hodge filtration`, `Hodge spectral sequence` | `algebraic-de-rham-cohomology` mentions both before the dedicated section | introduces them in the same file (§4) | Internal §-link or move the definition forward. |
| `monodromy` | `complex-analysis`, `analytic-continuation`, `riemann-surfaces`, `etale-fundamental-group`, `differential-geometry` | `analytic-continuation` defines it cleanly | Confirm callbacks exist on the other four; `audit-callbacks` may already enforce this — re-run after defining the prereq edge. |
| `ramification`, `inertia` | used in `algebraic-number-theory`, `class-field-theory`, `etale-cohomology`, `etale-fundamental-group` | `algebraic-number-theory` is the canonical home | Looks well-callbacked; spot-check on next pass. |

## Tone drift

The biggest tone-drift signal is the **hero `<p class="sub">`**. Compare:

- **Gold-standard, full-prose hero** (`category-theory.html`): "A disciplined way to
  say 'arrows between things behave like the things themselves.' From objects and
  morphisms to the universal property of the pullback and the adjunction that
  constructs free groups." — full sentences, with a thesis and a tour-of-stops.
  Same shape on `spectral-graph-theory.html`, `sobolev-spaces-distributions.html`,
  `automorphic-forms-adelic.html`, `complex-analysis.html`.

- **Drift to fragmentary / index-card hero** (4 pages):
  - `heyting-algebras-toposes.html`: "Intuitionist logic inside any topos: $\Omega$
    as a Heyting algebra and the Mitchell–Bénabou language." (fragment)
  - `algebraic-de-rham-cohomology.html`: "Hypercohomology of $\Omega^\bullet_{X/k}$:
    Hodge filtration, Betti comparison, Hodge diamond." (fragment)
  - `intersection-theory-chow.html`: "Algebraic cycles modulo rational equivalence:
    Chow rings, Chern classes, and Bezout generalized." (fragment, plus "Bezout"
    should be "Bézout")
  - `group-cohomology.html`: "Derived $G$-fixed points: a single machine that
    controls extensions, twisted forms, Hilbert 90, and Brauer groups." (the
    crispest of the four — borderline, leaning fragment)

These four heroes read as TOC-card blurbs that escaped into the page itself. The
prose **inside** these pages is uniformly excellent (see e.g. the §2 prose of
`algebraic-de-rham-cohomology` or `heyting-algebras-toposes`); only the hero
sub-paragraph is off-key.

Sentence-length distribution otherwise looks consistent. Contractions are used
liberally and consistently (`doesn't`, `isn't`, `we'll`, `let's` all show 13–36×).
Voice is `we`-heavy (561) with frequent `you` (426) — matches the Brilliant-style
template.

## KaTeX hygiene gaps

`validate-katex.mjs` reports clean. Findings come from manual scan:

- **Duplicate `<aside class="callback">`** (manual + auto-injected fences both
  present, identical content rendered twice) in:
  - `capstone-bsd-story.html` (5)
  - `group-cohomology.html` (5) — line 303 unfenced + line 311 fenced; line 363
    onwards same pattern
  - `probabilistic-method.html` (5)
  - `sobolev-spaces-distributions.html` (5) — line 297 unfenced + line 305 fenced
  - `heights-arithmetic-geometry.html` (3)
  - `adeles-and-ideles.html`, `algebraic-topology.html`, `spectral-graph-theory.html`
    (2 each)
  - 9 files with 1 each (algebraic-curves-higher-genus, algebraic-de-rham-cohomology,
    cocartesian-fibrations, grothendieck-topologies-sites, group-schemes,
    heyting-algebras-toposes, infinity-topoi, probability-theory,
    quadratic-reciprocity, schemes)
  - **Total: ~36 stray unfenced callback asides corpus-wide.** These render twice
    in the browser (visual bug) but pass roundtrip because the JSON contains
    both. `audit-callbacks --fix` re-emits the fenced one but doesn't strip the
    pre-existing unfenced one.

- **`\mathrm{...}` vs `\text{...}`**: 4596 vs 593 — `\mathrm` is dominant.
  Actual splits where it matters: `\mathrm{loc}`, `\mathrm{rat}`, `\mathrm{div}`,
  `\mathrm{cl}` are used as multi-letter operator names where `\operatorname{}`
  would compute spacing better. `\text{otherwise}`, `\text{compact}` for English
  fragments inside math is the right call.

- **No custom `\newcommand` block anywhere**. Every page re-types
  `\operatorname{Spec}`, `\operatorname{Hom}`, `\operatorname{Gal}`,
  `\operatorname{Frob}` etc. The KaTeX loader supports `macros: { "\\Spec":
  "\\operatorname{Spec}", … }` — defining 16 macros once would shrink ~970
  inline boilerplate calls.

- **Bracket commutator `[X,Y]`** appears 48× in unambiguous contexts (Lie
  brackets, derived ideals). Spot-check: usages are always context-disambiguated
  by surrounding prose. No fix needed.

## Title casing fixes

Twelve `<title>`s and four `<h1>`s read like un-edited filename slugs:

| File | Current `<title>` | Suggested |
|---|---|---|
| `algebraic-curves-higher-genus.html` | "Algebraic curves higher genus" | "Algebraic curves of higher genus — canonical embedding, Riemann–Roch, moduli" |
| `algebraic-de-rham-cohomology.html` | "Algebraic de rham cohomology" | "Algebraic de Rham cohomology — hypercohomology of $\Omega^\bullet_{X/k}$" (note **R**ham) |
| `algebraic-spaces.html` | "Algebraic spaces" | "Algebraic spaces — étale equivalence quotients of schemes" |
| `cocartesian-fibrations.html` | "Cocartesian fibrations" | "Cocartesian fibrations — straightening to functors of $\infty$-categories" |
| `commutative-algebra.html` | "Commutative algebra" | "Commutative algebra — primes, localization, dimension" (matches `<h1>`) |
| `derived-categories.html` | "Derived categories" | "Derived categories — chain complexes up to quasi-isomorphism" |
| `elementary-topos-theory.html` | "Elementary topos theory" | "Elementary topos theory — finite limits, exponentials, $\Omega$" |
| `etale-fundamental-group.html` | "Etale fundamental group" | "Étale fundamental group — Galois covers in algebraic geometry" (note **É**) |
| `grothendieck-topologies-sites.html` | "Grothendieck topologies sites" | "Grothendieck topologies and sites — covers without points" (also fix `<h1>`) |
| `group-schemes.html` | "Group schemes" | "Group schemes — affine, finite flat, $p$-divisible" |
| `heyting-algebras-toposes.html` | "Heyting algebras toposes" | "Heyting algebras in toposes — internal intuitionist logic" (also fix `<h1>` — currently same broken slug) |
| `infinity-categories.html` | "Infinity categories" | "$\infty$-categories — quasi-categories, Joyal model" |
| `infinity-topoi.html` | "Infinity topoi" | "$\infty$-topoi — sheaves of spaces" (also fix `<h1>` — currently `$\infty$-topoi` which is fine, just propagate to `<title>`) |
| `intersection-theory-chow.html` | "Intersection theory chow" | "Intersection theory and Chow groups — cycles, rational equivalence, Chern classes" (also fix `<h1>` and the "Bezout generalized" → "Bézout generalized" in the hero sub) |
| `naive-set-theory.html` | "Naive set theory" | "Naive set theory — sets, functions, Zorn" (likely intentional, low priority) |
| `probabilistic-method.html` | "Probabilistic method" | "The probabilistic method — Erdős's existence-by-counting" |
| `simplicial-sets-and-nerve.html` | "Simplicial sets and nerve" | "Simplicial sets and the nerve construction" |
| `spectral-graph-theory.html` | "Spectral graph theory" | "Spectral graph theory — Laplacian eigenvalues, Cheeger, expanders" (the `<h1>` is also the bare slug; both want updating) |

Mismatched `<title>` vs `<h1>` (browser tab ≠ page heading), low-stakes but
worth aligning on the same pass:

- `algebra.html`: title says "Abstract algebra — interactive intro", h1 says
  "Abstract algebra".
- `bsd.html`, `bezout.html`, `class-field-theory.html`, `commutative-algebra.html`,
  `extremal-combinatorics.html`, `frobenius-and-reciprocity.html`,
  `hecke-operators.html`, `homological.html`, `L-functions.html`,
  `modular-forms.html`, `representation-theory.html`, `riemann-surfaces.html`,
  `schemes.html`, `theta-functions.html`, `zeta-values.html` — all have a more
  descriptive `<title>` than the `<h1>` shows. This is a standard "tab vs page"
  pattern and is fine; the only ones to fix are where the `<h1>` is the
  un-cased slug.

## Concrete proposals (ranked)

1. **Strip the 36 unfenced duplicate `<aside class="callback">` blocks** across
   ~18 files. Audit script: a 20-line node helper that finds each `<aside
   class="callback">` not preceded (within 80 chars) by `<!-- callback-auto-begin
   -->`, removes it, and re-runs `audit-callbacks --fix` to ensure the auto
   block survives. (Highest leverage: removes a real visual duplication.)
2. **Fix the 12 slug-flavoured `<title>` tags + 4 slug-flavoured `<h1>` tags**
   listed above. New-topic scaffolder leaves these as draft strings; they got
   shipped without overrides.
3. **Add a shared KaTeX `\newcommand` block** to the page-header loader: `\Spec`,
   `\Hom`, `\Gal`, `\Frob`, `\Aut`, `\End`, `\Tr`, `\tr`, `\Re`, `\Im`, `\im`,
   `\rank`, `\vol`, `\diag`, `\ord`, `\char`. Migrating in-place is ~970
   replacements; leaving old usages alone for one cycle and only emitting macros
   for new content is also acceptable.
4. **Rewrite the four fragmentary hero sub-paragraphs** (`heyting-algebras-toposes`,
   `algebraic-de-rham-cohomology`, `intersection-theory-chow`, `group-cohomology`)
   into full-sentence template-style heroes. Each is a 30-minute prose pass.
5. **Fix "Bezout" → "Bézout"** in `intersection-theory-chow.html` hero sub.
6. **Decide `\mathrm{Spec}` vs `\operatorname{Spec}`**, then run the migration as
   one script-driven sweep (the audit-notation report already targets it).
   Recommendation: `\operatorname{Spec}` (correct spacing for `\Spec\,A`) — but
   either is fine if a `\Spec` macro is introduced.
7. **Add a "first defined in" callback** for `quasi-isomorphism` and
   `sheafification` from the 7+9 pages that currently use them un-defined.
   `audit-callbacks --fix` will handle this once the prereq edges are added in
   `concepts/*.json`.
8. **Collapse `\hat{C}` (16) → `\widehat{C}` (18)**: trivial sed pass for visual
   uniformity in presheaf-category notation.
9. **Run the repaired-macro pass through `validate-katex.mjs`** as a final gate
   — the validator is currently clean, ensure it stays clean.
10. **Worked-example signposting is already converged** on `<strong>Worked
    example.</strong>` (~24 cases) with `<strong>Example.</strong>` as a
    secondary (5 cases). One-line decision: standardize on `<strong>Worked
    example.</strong>` and rewrite the 5 holdouts.

## Anti-recommendations

- **`\mathbb{Z}_p`**: in `p-adic-numbers.html`, `algebraic-number-theory.html`,
  `class-field-theory.html`, `frobenius-and-reciprocity.html` it means the
  $p$-adic integers; in `naive-set-theory.html` (where the prerequisite section
  introduces basic groups) and possibly `algebra.html` it could mean the cyclic
  group. Spot-check: in this corpus `\mathbb{Z}_p` is used **only** in the
  $p$-adic sense; cyclic groups are uniformly `\mathbb{Z}/p`. Do not flatten —
  keep the convention but ensure every page that introduces $\mathbb{Z}_p$
  (especially `p-adic-numbers.html`) explicitly defines the symbol on first use.
- **`H^q(G, M)` comma vs `H^*(X; \mathbb{Z})` semicolon**: this is a
  domain-warranted split, not a clash. Group cohomology (`H^q(G, M)` with
  module $M$) idiomatically uses a comma; sheaf/topology cohomology with
  coefficient ring uses a semicolon. The two existing comma uses in
  `derived-categories.html` and `algebraic-topology.html` are correct in
  context.
- **`\hat{C}` and `\widehat{C}`**: these are visually almost identical in
  KaTeX; the corpus split (16 vs 18) is cosmetic, not semantic. If a strip-pass
  is convenient go with `\widehat`; otherwise leave alone.
- **`\mathrm{...}` vs `\text{...}`**: the 593 `\text{}` usages are mostly real
  English ("compact", "otherwise", "if and only if") inside conditional
  cases — those should stay `\text{}`. Only the multi-letter *operator names*
  inside `\mathrm{}` are candidates for `\operatorname{}` migration.
- **Voice register variation between expository sections and §-headers**: the
  modal voice is full-sentence "we" prose; `<h2>` headers are noun-phrase
  fragments ("Adjacency, degree, and the Laplacian"). This isn't drift — it's
  the standard expository pattern, matching `category-theory.html`.

---

[consistency reviewer]

**Highest-leverage cleanup target: strip the 36 unfenced duplicate
`<aside class="callback">` blocks** (proposal #1). It's a real visual bug
(every reader of `sobolev-spaces-distributions`, `group-cohomology`,
`probabilistic-method`, `capstone-bsd-story`, `heights-arithmetic-geometry`
sees the same "See also" list rendered twice in succession), it's mechanically
detectable, and it's a 30-line node helper away.

**Top notation clash: `\mathrm{Spec}` vs `\operatorname{Spec}`** — 184 vs 141
HTML occurrences with no semantic difference, only spacing. Resolve once, or
better: introduce a `\Spec` macro in the shared KaTeX loader.

**Top tone-drift example:** `heyting-algebras-toposes.html` hero sub is a
single fragment ("Intuitionist logic inside any topos: $\Omega$ as a Heyting
algebra and the Mitchell–Bénabou language."), where the template (and the
page's own §2 prose) demands a 2-sentence thesis-plus-tour. Same shape on
`algebraic-de-rham-cohomology`, `intersection-theory-chow`, `group-cohomology`.
Auto-generated heroes that escaped to production.
