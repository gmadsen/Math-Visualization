# Interactive Mathematics Notebook

A library of single-page, interactive explainers for graduate-level mathematics. Each topic is a self-contained HTML file with a dark 3Blue1Brown-style aesthetic, KaTeX for math, and hand-written SVG + JavaScript widgets.

The notebook currently includes **48 topic pages** organized into **7 sections**:
- Foundations
- Algebra
- Analysis
- Geometry & topology
- Number theory
- Modular forms & L-functions
- Algebraic geometry

Open [`index.html`](./index.html) in any modern browser and start wherever you like.

## How to use

Just open the files in a browser — either by double-clicking `index.html` or serving the folder locally:

```bash
# Python 3
python3 -m http.server 8000

# Node
npx serve .
```

## Learning pathways

- Start from [`pathway.html`](./pathway.html) to explore prerequisite graphs for capstone goals.
- Topic cards on the index can carry a level badge:
  - `prereq` (foundational)
  - `advanced` (specialized)
  - `capstone` (synthesis topics)

Concept graph data lives under [`concepts/`](./concepts), with topic registration in [`concepts/index.json`](./concepts/index.json).

## Contents

### Foundations
- [Naive set theory](./naive-set-theory.html) — sets, functions, equivalence relations, quotients, countability, Cantor's diagonal

### Algebra
- [Abstract algebra](./algebra.html) — groups, rings, fields
- [Category theory](./category-theory.html) — objects, arrows, functors, Yoneda, adjunctions
- [Representation theory](./representation-theory.html) — characters, orthogonality, $\mathfrak{sl}_2$
- [Commutative algebra](./commutative-algebra.html) — ideals, localization, tensor, flatness
- [Homological algebra](./homological.html) — chain complexes, Ext, Tor, spectral sequences

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
- [Sums of squares](./sums-of-squares.html) — two/four-square theorems and theta previews
- [Algebraic number theory](./algebraic-number-theory.html) — rings of integers, class groups, Minkowski
- [p-adic numbers](./p-adic-numbers.html) — inverse limits, Hensel lifting, p-adic metrics
- [Frobenius & reciprocity](./frobenius-and-reciprocity.html) — splitting types, Frobenius classes, reciprocity dictionary
- [Class field theory](./class-field-theory.html) — Artin reciprocity, ideles, abelian extensions

### Modular forms & L-functions
- [Upper half-plane](./upper-half-plane-hyperbolic.html) — hyperbolic geometry and Möbius action
- [Modular forms](./modular-forms.html) — $\mathrm{SL}_2(\mathbb{Z})$ action, q-expansions, Eisenstein series
- [Theta functions](./theta-functions.html) — Jacobi theta series and modular transforms
- [Hecke operators](./hecke-operators.html) — Hecke algebra, eigenforms, coefficient multiplicativity
- [Dirichlet series & Euler products](./dirichlet-series-euler-products.html) — analytic continuation and Euler factorizations
- [L-functions](./L-functions.html) — functional equations and arithmetic avatars
- [Galois representations](./galois-representations.html) — linear actions of Galois groups, Frobenius traces, modularity
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

## Quizzes and progression

Topic pages ship with [Brilliant](https://brilliant.org)-style concept-by-concept quizzes. Answer all questions in a concept correctly and it is marked **mastered** (persisted in `localStorage`). The mastery store powers [`pathway.html`](./pathway.html): prerequisite concepts light up as *ready* when their predecessors are mastered, and *locked* otherwise.

Clear all progress from the browser devtools console with:

```js
MVProgress.clearAll()
```

## Repo layout

```
index.html                    landing page with section grid
pathway.html                  capstone prerequisite explorer
<topic>.html                  one self-contained page per topic
concepts/                     concept graph JSONs (one per topic) + index.json + capstones.json
quizzes/                      quiz bank JSONs (one per topic)
js/progress.js                mastery store (localStorage)
js/quiz.js                    quiz widget
scripts/validate-concepts.mjs concept-graph validator
AGENTS.md                     authoring conventions for contributors (human or agent)
ROADMAP.md                    current priorities and per-wave status
```

## Contributing

If you're working on this notebook (or directing an agent to), start with [`AGENTS.md`](./AGENTS.md). It covers the canonical template ([`category-theory.html`](./category-theory.html)), house conventions, helper scripts, the quiz/progression wiring, and verification. [`ROADMAP.md`](./ROADMAP.md) tracks what's prioritized next.

## References

The arithmetic / automorphic arc of the notebook draws primarily on:

- **Fearless Symmetry** — Avner Ash & Robert Gross. Pre-Langlands primer on reciprocity, Galois representations, and the road to Wiles.
- **Summing It Up** — Ash & Gross. Modular forms, $\theta$-series, and partition generating functions from first principles.
- **Elliptic Tales** — Ash & Gross. Elliptic curves, BSD, and the analytic / algebraic dictionary.
- **The Rising Sea: Foundations of Algebraic Geometry** — Ravi Vakil. Schemes, sheaves, cohomology; long-form companion to the algebraic-geometry section.
- **The [Stacks Project](https://stacks.math.columbia.edu/)** — community-maintained open reference for schemes, sheaves, descent, algebraic spaces, and stacks.
- **EGA / SGA** — Alexander Grothendieck. The original sources for schemes, étale cohomology, and the Weil-conjecture program that underlies `etale-cohomology.html`.
