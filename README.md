# Interactive Mathematics Notebook

A library of single-page, interactive explainers for graduate-level mathematics. Each topic is a self-contained HTML file with a dark 3Blue1Brown-style aesthetic, KaTeX for math, and hand-written SVG + JavaScript widgets. No build step, no server, no dependencies beyond two CDN links.

Open [`index.html`](./index.html) in any modern browser and start wherever you like.

## How to use

Just open the files in a browser — either by double-clicking `index.html` or serving the folder locally:

```bash
# Python 3
python -m http.server 8000

# Node
npx serve .
```

Every topic page has a sticky sidebar table of contents that highlights the current section, and a `← Notebook` back-link to the index.

## Contents

### Algebra
- [Algebra refresher](./algebra.html) — groups, rings, fields
- [Category theory](./category-theory.html) — objects, arrows, functors, Yoneda, adjunctions
- [Representation theory](./representation-theory.html) — characters, orthogonality, $\mathfrak{sl}_2$
- [Commutative algebra](./commutative-algebra.html) — ideals, localization, tensor, flatness
- [Homological algebra](./homological.html) — chain complexes, Ext, Tor, spectral sequences

### Analysis
- [Real analysis](./real-analysis.html) — Lebesgue measure, $L^p$, DCT
- [Complex analysis](./complex-analysis.html) — Needham-style: amplitwist, residues, Möbius
- [Functional analysis](./functional-analysis.html) — Banach/Hilbert, four pillars, spectrum
- [Operator algebras](./operator-algebras.html) — C*-algebras, Gelfand duality, noncommutative geometry

### Geometry & topology
- [Algebraic topology](./topology.html) — fundamental groups, covers, homology
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
- [Galois representations](./galois-representations.html) — Frobenius traces and modularity links

### Algebraic geometry
- [Projective plane](./projective-plane.html) — homogeneous coordinates and points at infinity
- [Bézout's theorem](./bezout.html) — intersection multiplicity and curve counting
- [Schemes](./schemes.html) — $\mathrm{Spec}$, locally ringed spaces
- [Sheaves](./sheaves.html) — presheaves, stalks, sheafification, quasi-coherent
- [Morphisms & fiber products](./morphisms-fiber-products.html) — base change, ramified families
- [Functor of points](./functor-of-points.html) — $h_X$, representable functors, Yoneda in AG
- [Elliptic curves](./elliptic-curves.html) — Weierstrass, chord-tangent law, $j$-invariant
- [Singular cubics & reduction](./singular-cubics-reduction.html) — nodal/cuspidal reduction and local behavior
- [Moduli spaces](./moduli-spaces.html) — $j$-line, fine vs. coarse, $\overline{M}_{g,n}$
- [Sheaf cohomology](./sheaf-cohomology.html) — Čech, $H^i(\mathbb{P}^n, \mathcal{O}(d))$
- [Stacks (Deligne–Mumford)](./stacks.html) — groupoid-valued functors, $BG$, $\mathcal{M}_{1,1}$

## Design

- **Single-file pages.** Each topic is one HTML file with embedded CSS and JavaScript. No bundler, no package manager, no framework.
- **Widgets are vanilla.** SVG built with a small set of helper functions (`SVG`, `$`, `drawArrow`, `drawNode`). Interactions are plain event listeners.
- **Math via KaTeX.** Rendered in-browser from CDN, with `$...$` inline and `$$...$$` display delimiters.
- **Dark palette.** `#0f1218` background with accent colors for conceptual grouping (yellow for invariants, blue for structure, green for examples, pink for diagrams, violet for transformations, cyan for spaces).

## Contributing

This is a personal study notebook. If you spot an error or have a suggestion, feel free to open an issue.

## License

[MIT](./LICENSE) — Copyright (c) 2026 Garrett Madsen.

Math typeset with [KaTeX](https://katex.org). Dark palette and pedagogical spirit after [3Blue1Brown](https://www.3blue1brown.com/).
