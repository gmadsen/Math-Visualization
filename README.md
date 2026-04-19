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

### Foundations
- [Algebra refresher](./algebra.html) — groups, rings, fields
- [Category theory](./category-theory.html) — objects, arrows, functors, Yoneda, adjunctions
- [Lie groups & algebras](./lie-groups.html) — matrix groups, exponential map, root systems
- [Representation theory](./representation-theory.html) — characters, orthogonality, $\mathfrak{sl}_2$

### Galois & number theory
- [Galois theory & the quintic](./galois.html) — constructibility, correspondence, unsolvability
- [Algebraic number theory](./algebraic-number-theory.html) — rings of integers, class groups, Minkowski

### Analysis
- [Real analysis](./real-analysis.html) — Lebesgue measure, $L^p$, DCT
- [Complex analysis](./complex-analysis.html) — Needham-style: amplitwist, residues, Möbius
- [Riemann surfaces](./riemann-surfaces.html) — branched covers, uniformization
- [Functional analysis](./functional-analysis.html) — Banach/Hilbert, four pillars, spectrum

### Topology & geometry
- [Algebraic topology](./topology.html) — fundamental groups, covers, homology
- [Smooth manifolds](./smooth-manifolds.html) — charts, tangent spaces, Lie brackets
- [Differential forms](./differential-forms.html) — $k$-forms, wedge, Stokes
- [Differential geometry](./differential-geometry.html) — curves, surfaces, Gauss–Bonnet
- [Riemannian geometry](./riemannian-geometry.html) — metric, connection, curvature, geodesics

### Commutative & homological algebra
- [Commutative algebra](./commutative-algebra.html) — ideals, localization, tensor, flatness
- [Homological algebra](./homological.html) — chain complexes, Ext, Tor, spectral sequences

### Algebraic geometry
- [Schemes](./schemes.html) — $\mathrm{Spec}$, locally ringed spaces
- [Sheaves](./sheaves.html) — presheaves, stalks, sheafification, quasi-coherent
- [Morphisms & fiber products](./morphisms-fiber-products.html) — base change, ramified families
- [Functor of points](./functor-of-points.html) — $h_X$, representable functors, Yoneda in AG
- [Elliptic curves](./elliptic-curves.html) — Weierstrass, chord-tangent law, $j$-invariant
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
