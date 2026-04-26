# Interactive Mathematics Notebook

A library of single-page, interactive explainers for graduate-level mathematics. Each topic is a self-contained HTML file with a dark 3Blue1Brown-style aesthetic, KaTeX for math, and hand-written SVG + JavaScript widgets.

Topics are grouped into seven sections: Foundations · Algebra · Analysis · Geometry & topology · Number theory · Modular forms & L-functions · Algebraic geometry. Open [`index.html`](./index.html) in any modern browser and start wherever you like.

Vanilla HTML/CSS/JS — no build step, no framework, no install.

## How to use

Open the files in a browser — either by double-clicking `index.html` or serving the folder locally:

```bash
python3 -m http.server 8000      # Python 3
npx serve .                      # Node
```

## How the notebook is organized

Each topic is one `<topic>.html` file, plus a concept-graph entry under `concepts/<topic>.json` and a quiz bank under `quizzes/<topic>.json`. The concept graph (`concepts/index.json` + per-topic files + `concepts/capstones.json`) drives [`pathway.html`](./pathway.html); the quiz banks drive the in-page quizzes.

Alongside each handwritten `<topic>.html`, the repo also carries a structured `content/<topic>.json` — a block-level decomposition of the page (prose, widgets, widget scripts, quizzes) that round-trips byte-identically to the HTML via `scripts/render-topic.mjs`. Widgets are described by JSON Schemas under `widgets/<slug>/`, so alternate frontends can consume the same content without touching the HTML. See `examples/react-consumer/` for a proof-of-concept React renderer and [`widgets/README.md`](./widgets/README.md) for the registry.

## Learning pathways

Start from [`pathway.html`](./pathway.html) to explore prerequisite graphs for capstone goals — pick any of the 23 capstones and the DAG layers every prereq concept by depth. For free-form exploration over the entire 505-concept graph (no goal required), [`mindmap.html`](./mindmap.html) renders a section-clustered force-directed layout: click a node to focus its k-hop neighborhood, filter by section/level/mastery, and a structural-stats panel surfaces uneven prereq density across the seven sections. Both views read the same concept graph; pathway is goal-targeted, mindmap is free-explore.

Each concept carries two quiz tiers — v1 (required) and hard (unlocked after v1). Mastery is tracked in `localStorage` and lights up downstream concepts `locked → ready → mastered`, Brilliant-style. Topic cards on the index may carry a level badge: `prereq`, `advanced`, or `capstone`.

## Contents

### Foundations
- [Naive set theory](./naive-set-theory.html) — sets, functions, equivalence relations, quotients, countability, Cantor's diagonal

### Algebra
- [Abstract algebra](./algebra.html) — groups, rings, fields
- [Category theory](./category-theory.html) — objects, arrows, functors, Yoneda, adjunctions
- [Representation theory](./representation-theory.html) — characters, orthogonality, $\mathfrak{sl}_2$
- [Commutative algebra](./commutative-algebra.html) — ideals, localization, tensor, flatness
- [Homological algebra](./homological.html) — chain complexes, Ext, Tor, spectral sequences
- [Derived categories](./derived-categories.html) — $K(\mathcal{A}) \to D(\mathcal{A})$, triangulated structure, derived functors, $t$-structures
- [Elementary topos theory](./elementary-topos-theory.html) — finitely complete cartesian closed + subobject classifier $\Omega$
- [Heyting algebras & intuitionist logic in toposes](./heyting-algebras-toposes.html) — internal language, Kripke–Joyal forcing, double-negation
- [Grothendieck topologies & sites](./grothendieck-topologies-sites.html) — sieves, sheafification, Giraud
- [Simplicial sets & the nerve](./simplicial-sets-and-nerve.html) — $\Delta$, geometric realization, nerve $N(C)$, Kan complexes, inner-horn filling
- [∞-categories (quasi-categories)](./infinity-categories.html) — Joyal's model, $h(\mathcal{C})$, ∞-functors / limits / adjunctions / Kan extensions
- [Cocartesian fibrations & the Grothendieck construction](./cocartesian-fibrations.html) — left/right/cocartesian fibrations, straightening ↔ functors $\mathcal{B} \to \mathrm{Cat}_\infty$
- [∞-topoi (Lurie)](./infinity-topoi.html) — accessible left-exact localization, ∞-Giraud, hypercompletion, internal HoTT — capstone

### Analysis
- [Real analysis](./real-analysis.html) — completeness of $\mathbb{R}$, $\varepsilon$–$\delta$ continuity, differentiation, uniform convergence, Riemann integration, multivariable diff/int, inverse function theorem
- [Measure theory](./measure-theory.html) — Lebesgue measure, $L^p$, DCT
- [Complex analysis](./complex-analysis.html) — Needham-style: amplitwist, residues, Möbius
- [Functional analysis](./functional-analysis.html) — Banach/Hilbert, four pillars, spectrum
- [Operator algebras](./operator-algebras.html) — C*-algebras, Gelfand duality, noncommutative geometry

### Geometry & topology
- [Point-set topology](./point-set-topology.html) — metric spaces, open sets, continuity, compactness, connectedness, separation axioms
- [Algebraic topology](./algebraic-topology.html) — fundamental groups, covers, homology
- [Smooth manifolds](./smooth-manifolds.html) — charts, tangent spaces, Lie brackets
- [Differential forms](./differential-forms.html) — $k$-forms, wedge, Stokes
- [Differential geometry](./differential-geometry.html) — curves, surfaces, Gauss–Bonnet
- [Riemannian geometry](./riemannian-geometry.html) — metric, connection, curvature, geodesics
- [Lie groups & algebras](./lie-groups.html) — matrix groups, exponential map, root systems
- [Riemann surfaces](./riemann-surfaces.html) — branched covers, uniformization

### Number theory
- [Galois theory & the quintic](./galois.html) — constructibility, correspondence, unsolvability
- [Quadratic reciprocity](./quadratic-reciprocity.html) — Legendre symbols and reciprocity law
- [Quadratic forms & genus theory](./quadratic-forms-genus-theory.html) — binary forms, genus classes, representation of primes
- [Sums of squares](./sums-of-squares.html) — two/four-square theorems and theta previews
- [Power sums & Bernoulli numbers](./power-sums-bernoulli.html) — Faulhaber, Bernoulli generating function, $\zeta(-n)$
- [Waring's problem](./waring.html) — $g(k)$ and $G(k)$, Hilbert–Waring, circle-method preview
- [Algebraic number theory](./algebraic-number-theory.html) — rings of integers, class groups, Minkowski
- [p-adic numbers](./p-adic-numbers.html) — inverse limits, Hensel lifting, p-adic metrics
- [Adèles & idèles](./adeles-and-ideles.html) — restricted products, strong approximation, Tate's thesis sketch
- [Frobenius & reciprocity](./frobenius-and-reciprocity.html) — splitting types, Frobenius classes, reciprocity dictionary
- [Class field theory](./class-field-theory.html) — Artin reciprocity, ideles, abelian extensions
- [Heights in arithmetic geometry](./heights-arithmetic-geometry.html) — naive & Weil heights, Northcott finiteness, Néron–Tate canonical $\hat h$, Mahler measure, Mordell–Faltings via heights

### Modular forms & L-functions
- [Upper half-plane](./upper-half-plane-hyperbolic.html) — hyperbolic geometry and Möbius action
- [Modular forms](./modular-forms.html) — $\mathrm{SL}_2(\mathbb{Z})$ action, q-expansions, Eisenstein series
- [Theta functions](./theta-functions.html) — Jacobi theta series and modular transforms
- [Partitions & generating functions](./partitions-generating-functions.html) — Euler's pentagonal number theorem, $p(n)$
- [Hecke operators](./hecke-operators.html) — Hecke algebra, eigenforms, coefficient multiplicativity
- [Dirichlet series & Euler products](./dirichlet-series-euler-products.html) — analytic continuation and Euler factorizations
- [Analytic continuation](./analytic-continuation.html) — zeta at negative integers, reflection formula, functional-equation narrative
- [Zeta values](./zeta-values.html) — $\zeta(2)=\pi^2/6$, Apéry's $\zeta(3)$, $\zeta(-2n)=0$ trivial zeros
- [L-functions](./L-functions.html) — functional equations and arithmetic avatars
- [Galois representations](./galois-representations.html) — linear actions of Galois groups, Frobenius traces, modularity
- [Moonshine](./moonshine.html) — $j$-function coefficients and the monster, McKay–Thompson series
- [Sato–Tate](./sato-tate.html) — Frobenius angles, the semicircular measure, symmetric-power $L$-functions
- [Birch & Swinnerton-Dyer](./bsd.html) — Mordell–Weil, $L$-function order of vanishing, rank equality
- [Modularity & FLT](./modularity-and-flt.html) — Frey curve, Ribet's level lowering, Taylor–Wiles

### Algebraic geometry
- [Projective plane](./projective-plane.html) — homogeneous coordinates, points at infinity, affine patches
- [Bézout's theorem](./bezout.html) — intersection multiplicities and $de$ points for plane curves
- [Schemes](./schemes.html) — $\mathrm{Spec}$ of a ring, locally ringed spaces, generic points
- [Sheaves](./sheaves.html) — presheaves, gluing, stalks, sheafification, quasi-coherent sheaves
- [Morphisms & fiber products](./morphisms-fiber-products.html) — base change and families with ramified fibers
- [Functor of points](./functor-of-points.html) — $h_X = \mathrm{Hom}(-,X)$, Yoneda, representability
- [Elliptic curves](./elliptic-curves.html) — Weierstrass cubics, chord–tangent law, $j$-invariant, uniformization
- [Singular cubics & reduction](./singular-cubics-reduction.html) — nodal/cuspidal degenerations, Hasse counting
- [Moduli spaces](./moduli-spaces.html) — $j$-line, stable curves, Deligne–Mumford compactification
- [Sheaf cohomology](./sheaf-cohomology.html) — Čech cohomology, $H^i(\mathbb{P}^n,\mathcal{O}(d))$, $\mathrm{Pic}(\mathbb{P}^n)=\mathbb{Z}$
- [Stacks (Deligne–Mumford)](./stacks.html) — groupoid-valued functors, $BG$, $\mathcal{M}_{1,1}$
- [Étale cohomology](./etale-cohomology.html) — étale morphisms, $\ell$-adic cohomology, the Weil conjectures
- [Algebraic spaces](./algebraic-spaces.html) — étale equivalence relations, the rung between schemes and DM stacks
- [Intersection theory & Chow groups](./intersection-theory-chow.html) — cycles modulo rational equivalence, Chow ring of $\mathbb{P}^n$, Chern classes, GRR
- [The étale fundamental group](./etale-fundamental-group.html) — finite étale covers, fiber functor, $\pi_1^{\acute{e}t}(\mathrm{Spec}\,k) = \mathrm{Gal}(\bar{k}/k)$
- [Algebraic curves: higher genus](./algebraic-curves-higher-genus.html) — $g \ge 2$, Riemann–Roch, canonical embedding, hyperelliptic, $\mathcal{M}_g$
- [Group schemes](./group-schemes.html) — $\mathbb{G}_a, \mathbb{G}_m, \mu_n, \alpha_p$, Hopf algebras, étale-vs-connected, $\mathrm{Lie}(G)$, torsors
- [Deformation theory](./deformation-theory.html) — first-order $H^1(T)$, obstructions $H^2(T)$, Schlessinger, cotangent complex
- [Algebraic de Rham cohomology](./algebraic-de-rham-cohomology.html) — Kähler differentials, $H^*_{dR}$, Hodge filtration, Hodge diamond

### Combinatorics & graph theory
- [Spectral graph theory](./spectral-graph-theory.html) — adjacency, Laplacian, Cheeger inequality, expanders — graphs as discrete differential geometry
- [Matroid theory](./matroid-theory.html) — Whitney's combinatorial abstraction of independence; bases, rank, duality, the Tutte polynomial
- [Probabilistic method](./probabilistic-method.html) — existence by expectation, Ramsey lower bounds, Lovász Local Lemma, $G(n,p)$ thresholds, concentration
- [Extremal combinatorics](./extremal-combinatorics.html) — Turán's theorem, Kővári–Sós–Turán, Erdős–Stone, Ramsey numbers, Sperner & LYM, removal lemma
- [Simplicial complexes (combinatorial)](./simplicial-complexes-combinatorial.html) — abstract complexes, $f$/$h$-vectors, Dehn–Sommerville, Stanley–Reisner ring, persistent homology

## Resetting progress

Clear all mastery from the browser devtools console:

```js
MVProgress.clearAll()
```

## References

The arithmetic / automorphic arc of the notebook draws primarily on:

- **Fearless Symmetry** — Avner Ash & Robert Gross. Pre-Langlands primer on reciprocity, Galois representations, and the road to Wiles.
- **Summing It Up** — Ash & Gross. Modular forms, $\theta$-series, and partition generating functions from first principles.
- **Elliptic Tales** — Ash & Gross. Elliptic curves, BSD, and the analytic / algebraic dictionary.
- **The Rising Sea: Foundations of Algebraic Geometry** — Ravi Vakil. Schemes, sheaves, cohomology; long-form companion to the algebraic-geometry section.
- **The [Stacks Project](https://stacks.math.columbia.edu/)** — community-maintained open reference for schemes, sheaves, descent, algebraic spaces, and stacks.
- **EGA / SGA** — Alexander Grothendieck. The original sources for schemes, étale cohomology, and the Weil-conjecture program that underlies `etale-cohomology.html`.

---

Contributing, or directing an agent on this repo? See [`AGENTS.md`](./AGENTS.md) for authoring conventions, helper scripts, and the quiz/progression wiring. Forward priorities live in [`PLAN.md`](./PLAN.md), and [`widgets/README.md`](./widgets/README.md) documents the widget registry pattern used by the structured content pipeline.
