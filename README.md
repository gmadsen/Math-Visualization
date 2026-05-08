# Interactive Mathematics Notebook

A library of single-page, interactive explainers for graduate-level mathematics. Each topic is a self-contained HTML file with a dark 3Blue1Brown-style aesthetic, KaTeX for math, and hand-written SVG + JavaScript widgets.

Topics are grouped into eleven sections: Logic & Foundations · Algebra & homological · Higher categories & toposes · Analysis · Probability & statistics · Geometry & topology · Number theory · Modular forms & L-functions · Algebraic geometry · Combinatorics & graph theory · Mathematical physics. Open [`index.html`](./index.html) in any modern browser and start wherever you like.

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

Start from [`pathway.html`](./pathway.html) to explore prerequisite graphs for capstone goals — pick any of the 34 capstones and the DAG layers every prereq concept by depth. For free-form exploration over the entire 1176-concept graph (no goal required), [`mindmap.html`](./mindmap.html) renders a section-clustered force-directed layout: click a node to focus its k-hop neighborhood, filter by section/level/mastery, and a structural-stats panel surfaces uneven prereq density across the eleven sections. Both views read the same concept graph; pathway is goal-targeted, mindmap is free-explore.

Each concept carries up to three quiz tiers — v1 (required), hard (unlocked after v1), and expert (unlocked after hard). Mastery is tracked in `localStorage` and lights up downstream concepts `locked → ready → mastered`, Brilliant-style. Topic cards on the index may carry a level badge: `prereq`, `advanced`, or `capstone`.

## Contents

### Logic & Foundations
- [Naive set theory](./naive-set-theory.html) — sets, functions, equivalence relations, quotients, countability, Cantor's diagonal
- [First-order logic and completeness](./first-order-logic-and-completeness.html) — formal deductions, Gödel completeness, compactness, Löwenheim–Skolem
- [ZFC and ordinals](./zfc-and-ordinals.html) — axioms, well-ordering, transfinite recursion, the cumulative hierarchy
- [Model theory](./model-theory-basics.html) — structures, elementary equivalence, types, $\omega$-stable theories
- [Computability theory](./computability-and-decidability.html) — Turing machines, halting problem, recursion theorem, $m$-degrees
- [Complexity theory](./complexity-theory.html) — P, NP, polynomial reductions, oracles, P vs NP barriers
- [Type theory and HoTT](./type-theory-and-hott.html) — Martin-Löf types, identity, univalence, propositions-as-types
- [Forcing and independence](./forcing-and-independence.html) — generic filters, CH and AC independence, large cardinals

### Algebra & homological
- [Abstract algebra](./algebra.html) — groups, rings, fields
- [Category theory](./category-theory.html) — objects, arrows, functors, Yoneda, adjunctions
- [Representation theory](./representation-theory.html) — characters, orthogonality, $\mathfrak{sl}_2$
- [Commutative algebra](./commutative-algebra.html) — ideals, localization, tensor, flatness
- [Homological algebra](./homological.html) — chain complexes, Ext, Tor, spectral sequences
- [Derived categories](./derived-categories.html) — $K(\mathcal{A}) \to D(\mathcal{A})$, triangulated structure, derived functors, $t$-structures
- [Group cohomology](./group-cohomology.html) — bar resolution, $H^0=M^G$ → $H^1$ crossed homs (Hilbert 90) → $H^2$ extensions; Galois cohomology + Brauer
- [Lie algebras](./lie-algebras.html) — Lie brackets, Killing form, Cartan subalgebras, root systems, Dynkin classification
- [Galois cohomology and Brauer groups](./galois-cohomology-and-brauer.html) — $H^1$ cocycles, Brauer $\mathrm{Br}(k)$, Skolem–Noether, central simple algebras
- [Quaternions, octonions, and division algebras](./quaternions-octonions-and-division-algebras.html) — $\mathbb{H}$, $\mathbb{O}$, Hurwitz's theorem, composition algebras
- [Quantum groups](./quantum-groups.html) — Drinfeld–Jimbo $U_q(\mathfrak{g})$, $R$-matrices, $q$-Yang–Baxter, ribbon categories
- [Geometric and combinatorial group theory](./geometric-and-combinatorial-group-theory.html) — Cayley graphs, growth, hyperbolic groups, ends, quasi-isometry
- [Gröbner bases](./groebner-bases.html) — capstone of computational commutative algebra: monomial orders (lex / grlex / grevlex), the multivariable division algorithm and the non-uniqueness of remainders, S-polynomials and Buchberger's criterion, the algorithm and its termination, reduced bases as canonical representatives, elimination ideals, and triangular solving / implicitization.
- [Algebraic K-theory foundations](./algebraic-k-theory-foundations.html) — $K_0$ / $K_1$ / $K_2$ of a ring, Steinberg symbols and Matsumoto, Quillen's Q-construction, the localization long exact sequence, and applications: Bass-Quillen, Wall finiteness obstruction, motivic K-theory
- [Model categories](./model-categories.html) — Quillen's axioms ($W$, $F$, $C$ + 2-of-3, retracts, factorization, lifting), standard examples on $\mathrm{Top}$ / $\mathrm{sSet}$ / $\mathrm{Ch}(R)$, cofibrant–fibrant replacement, Quillen functors and equivalences ($|\cdot|\dashv\mathrm{Sing}$ as the prototype), monoidal model structures and the pushout-product axiom, and the simplicial nerve $N_\Delta(\mathcal{M}^{cf})$ that bridges to $\infty$-categories
- [Condensed mathematics](./condensed-mathematics.html) — Clausen–Scholze: condensed sets, solid + liquid abelian groups, the Liquid Tensor Experiment, applications to $p$-adic Hodge theory and analytic stacks (capstone)
- [Cluster algebras](./cluster-algebras.html) — quivers and seeds, mutation and the exchange relation, the Laurent phenomenon, ADE classification of finite type, cluster categories and τ-tilting, applications to Grassmannians and Teichmüller theory

### Higher categories & toposes
- [Elementary topos theory](./elementary-topos-theory.html) — finitely complete cartesian closed + subobject classifier $\Omega$
- [Heyting algebras and toposes](./heyting-algebras-toposes.html) — internal language, Kripke–Joyal forcing, double-negation
- [Grothendieck topologies and sites](./grothendieck-topologies-sites.html) — sieves, sheafification, Giraud
- [Simplicial sets and the nerve](./simplicial-sets-and-nerve.html) — $\Delta$, geometric realization, nerve $N(C)$, Kan complexes, inner-horn filling
- [∞-categories (quasi-categories)](./infinity-categories.html) — Joyal's model, $h(\mathcal{C})$, ∞-functors / limits / adjunctions / Kan extensions
- [Cocartesian fibrations & the Grothendieck construction](./cocartesian-fibrations.html) — left/right/cocartesian fibrations, straightening ↔ functors $\mathcal{B} \to \mathrm{Cat}_\infty$
- [∞-topoi (Lurie)](./infinity-topoi.html) — accessible left-exact localization, ∞-Giraud, hypercompletion, internal HoTT — capstone

### Analysis
- [Real analysis](./real-analysis.html) — completeness of $\mathbb{R}$, $\varepsilon$–$\delta$ continuity, differentiation, uniform convergence, Riemann integration, multivariable diff/int, inverse function theorem
- [Measure theory](./measure-theory.html) — Lebesgue measure, $L^p$, DCT
- [Complex analysis](./complex-analysis.html) — Needham-style: amplitwist, residues, Möbius
- [Functional analysis](./functional-analysis.html) — Banach/Hilbert, four pillars, spectrum
- [Operator algebras](./operator-algebras.html) — C*-algebras, Gelfand duality, noncommutative geometry
- [Dynamical systems](./dynamical-systems.html) — flows, invariant sets, ergodicity teasers
- [Harmonic analysis & Fourier theory](./harmonic-analysis-fourier.html) — Fourier series + transform, Plancherel, convolution, Schwartz space, uncertainty, Poisson summation, Pontryagin duality
- [Sobolev spaces & distributions](./sobolev-spaces-distributions.html) — test functions, $\mathcal{D}'$, weak derivatives, $W^{k,p}$ embeddings, traces, fundamental solutions, variational $-\Delta u = f$
- [Advanced complex analysis](./advanced-complex-analysis.html) — graduate sequel: Picard's theorems, Weierstrass factorization, Mittag-Leffler, Phragmén-Lindelöf, Hadamard three-circles, Hardy spaces and Fatou boundary behavior
- [Partial differential equations](./partial-differential-equations.html) — heat / wave / Laplace, characteristics, weak solutions, energy methods
- [Harmonic functions](./harmonic-functions.html) — mean-value, maximum principle, Harnack, Poisson integral, capacity
- [Spectral theory](./spectral-theory.html) — bounded vs unbounded operators, spectrum, Stone's theorem, functional calculus
- [Wavelets](./wavelets.html) — multiresolution, Haar / Daubechies / CDF, lifting, fast wavelet transform
- [Numerical analysis](./numerical-analysis.html) — floating point, conditioning, finite differences, quadrature, iterative solvers
- [Variational methods](./variational-methods.html) — Euler–Lagrange, direct method, $\Gamma$-convergence, mountain-pass
- [Fixed-point theorems](./fixed-point-theorems.html) — Banach, Brouwer, Schauder, Kakutani, Caristi, KKM
- [Microlocal analysis](./microlocal-analysis.html) — wavefront sets, pseudodifferential and Fourier integral operators, Hörmander's propagation of singularities, parametrices, applications to scattering and X-ray transforms
- [Geometric measure theory](./geometric-measure-theory.html) — BV functions, sets of finite perimeter, rectifiable sets, area / coarea formulas, currents, Federer-Fleming compactness, Plateau's problem, Mumford-Shah image segmentation
- [Semigroup theory & evolution equations](./semigroup-theory-evolution-equations.html) — $C_0$ semigroups, Hille–Yosida, analytic semigroups, abstract Cauchy problems, applications to nonlinear PDE / control / stochastic flows
- [Several complex variables](./several-complex-variables.html) — Hartogs phenomenon, plurisubharmonic functions and the Levi form, the $\bar\partial$-equation with Hörmander's $L^2$ estimates, Levi pseudoconvexity, Stein manifolds + Cartan's Theorems A and B, Cousin problems

### Probability & statistics
- [Probability theory](./probability-theory.html) — measure-theoretic foundations, expectation, independence, limit theorems, characteristic functions
- [Stochastic processes and martingales](./stochastic-processes-and-martingales.html) — filtrations, Markov chains, martingale convergence, optional stopping
- [Stochastic calculus](./stochastic-calculus.html) — Brownian motion, Itô integral, SDEs, Girsanov, Feynman–Kac
- [Random walks and mixing](./random-walks-and-mixing.html) — recurrence, return times, mixing time, spectral gap, expander mixing
- [Information theory](./information-theory.html) — entropy, KL divergence, mutual information, Shannon coding, AEP, Fisher–Cramér–Rao
- [Large deviations](./large-deviations.html) — Cramér, Sanov, Varadhan's lemma, rate functions
- [Mathematical statistics](./mathematical-statistics.html) — sufficiency, MLE, Cramér–Rao, asymptotic normality, hypothesis tests
- [High-dimensional geometry](./high-dimensional-geometry.html) — concentration of measure, Johnson–Lindenstrauss, isoperimetry, random projections

### Geometry & topology
- [Point-set topology](./point-set-topology.html) — metric spaces, open sets, continuity, compactness, connectedness, separation axioms
- [Algebraic topology](./algebraic-topology.html) — fundamental groups, covers, homology
- [Smooth manifolds](./smooth-manifolds.html) — charts, tangent spaces, Lie brackets
- [Differential forms](./differential-forms.html) — $k$-forms, wedge, Stokes
- [Differential geometry](./differential-geometry.html) — curves, surfaces, Gauss–Bonnet
- [Riemannian geometry](./riemannian-geometry.html) — metric, connection, curvature, geodesics
- [Lie groups & algebras](./lie-groups.html) — matrix groups, exponential map, root systems
- [Riemann surfaces](./riemann-surfaces.html) — branched covers, uniformization
- [Characteristic classes](./characteristic-classes.html) — Stiefel–Whitney, Chern, Pontryagin, Euler; obstruction theory
- [Morse theory](./morse-theory.html) — critical points, gradient flows, handle decompositions, Morse inequalities
- [K-theory](./k-theory.html) — topological $K^0/K^1$, Bott periodicity, $K$-homology, Atiyah index pairing
- [Symplectic manifolds](./symplectic-manifolds.html) — Darboux, Hamiltonian vector fields, Lagrangian submanifolds, Floer hints
- [Knot polynomials](./knot-polynomials.html) — Alexander, Jones, HOMFLY, Vassiliev invariants, Khovanov categorification
- [Ricci flow](./ricci-flow.html) — Hamilton's equation, neckpinches, Perelman entropy, geometrization
- [Atiyah–Singer index theorem](./atiyah-singer-index-theorem.html) — Dirac operators, analytic vs topological index, heat-kernel proof
- [Mostow rigidity](./mostow-rigidity.html) — hyperbolic $n\ge 3$ lattices are rigid; quasiconformal maps on the boundary
- [Cohomology and duality](./cohomology-and-duality.html) — singular cohomology, cup product, Mayer–Vietoris, Künneth, Poincaré duality, de Rham, spectral sequences
- [Cobordism](./cobordism.html) — cobordism as equivalence relation, Stiefel–Whitney/Pontryagin numbers, Thom spectrum $MO$, $\Omega_*^{SO}$, surgery, $h$-cobordism, TQFT
- [Homotopy theory](./homotopy-theory.html) — higher homotopy groups, Hurewicz/Whitehead, Eilenberg–MacLane spaces, stable homotopy and spectra, loop spaces, Bott periodicity
- [Kähler geometry](./kahler-geometry.html) — almost complex structures, Hermitian metrics, Kähler identities and Hodge decomposition, hard Lefschetz, Calabi conjecture, K-stability
- [Mapping class groups & 4-manifolds](./mapping-class-groups.html) — $\mathrm{Mod}(S)$ and Dehn twists, Nielsen–Thurston classification, Teichmüller space and Fenchel–Nielsen coordinates, smooth vs topological 4-manifolds and intersection forms, Casson invariant
- [Khovanov homology](./khovanov-homology.html) — draft — fill in once the page has real content

### Number theory
- [Galois theory & the quintic](./galois.html) — constructibility, correspondence, unsolvability
- [Quadratic reciprocity](./quadratic-reciprocity.html) — Legendre symbols and reciprocity law
- [Quadratic forms & genus theory](./quadratic-forms-genus-theory.html) — binary forms, genus classes, representation of primes
- [Algebraic number theory](./algebraic-number-theory.html) — rings of integers, class groups, Minkowski
- [p-adic numbers](./p-adic-numbers.html) — inverse limits, Hensel lifting, p-adic metrics
- [Adèles & idèles](./adeles-and-ideles.html) — restricted products, strong approximation, Tate's thesis sketch
- [Frobenius & reciprocity](./frobenius-and-reciprocity.html) — splitting types, Frobenius classes, reciprocity dictionary
- [Class field theory](./class-field-theory.html) — Artin reciprocity, ideles, abelian extensions
- [Heights in arithmetic geometry](./heights-arithmetic-geometry.html) — naive & Weil heights, Northcott finiteness, Néron–Tate canonical $\hat h$, Mahler measure, Mordell–Faltings via heights
- [Additive number theory](./additive-number-theory.html) — Schnirelmann / Erdős densities, sumsets, Plünnecke, Freiman, Goldbach-style problems
- [Analytic number theory](./analytic-number-theory.html) — prime counting, Dirichlet's theorem, sieves, $\zeta$-zeros, prime number theorem
- [Mathematics and cryptography](./mathematics-and-cryptography.html) — RSA, elliptic-curve cryptography, lattice-based / post-quantum schemes
- [Computational number theory](./computational-number-theory.html) — primality testing, factorization, $L^3$ lattice reduction, point-counting
- [Iwasawa theory](./iwasawa-theory.html) — cyclotomic $\mathbb{Z}_p$-extensions, Iwasawa algebra $\Lambda$, class groups along the tower, Kubota–Leopoldt $p$-adic $L$-function, Iwasawa main conjecture
- [Continued fractions & Diophantine approximation](./continued-fractions.html) — convergents, Hurwitz, Liouville, Roth's theorem, Markoff spectrum, $p$-adic Roth and the subspace theorem
- [Dirichlet's unit theorem](./dirichlet-unit-theorem.html) — logarithmic embedding of units, the regulator $R_K$, analytic class number formula, real quadratic units & Pell, $S$-units
- [Complex multiplication of elliptic curves](./complex-multiplication.html) — CM elliptic curves, Hilbert class polynomial, Heegner points on modular curves, the main theorem of CM (explicit CFT for imaginary quadratic), CM abelian varieties (Shimura–Taniyama), Heegner numbers and Gross–Zagier

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
- [Modular curves](./modular-curves.html) — $X(N)$, $X_0(N)$, $Y_1(N)$, moduli of elliptic curves with level structure
- [Automorphic forms (adelic)](./automorphic-forms-adelic.html) — $\mathrm{GL}_2$ over adèles, automorphic representations, Tate's thesis full sketch
- [Vertex operator algebras](./vertex-operator-algebras.html) — chiral algebras, the Monster VOA, Borcherds proof of moonshine
- [Langlands program](./langlands-program.html) — capstone of modular forms / L-functions: arithmetic side (Galois reps from cohomology) and analytic side (cuspidal automorphic reps of $\mathrm{GL}_n$) bridged by L-function matching. CFT as the proven $\mathrm{GL}_1$ case, modularity + Sato-Tate as proven $\mathrm{GL}_2$ corners, functoriality and the Langlands group $L_F$, universal reciprocity
- [Maass forms](./maass-forms.html) — Maass forms and the hyperbolic Laplacian, spectral decomposition of $L^2(\Gamma\backslash\mathbb{H})$, Selberg eigenvalue conjecture, Eisenstein series, Selberg trace formula, Weyl law
- [Half-integral weight forms](./half-integral-weight-forms.html) — metaplectic group and theta cocycle, Shimura's lift, Kohnen's plus space, Waldspurger's formula, Tunnell and the congruent number problem

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
- [Calabi–Yau manifolds](./calabi-yau-manifolds.html) — Ricci-flat Kähler, holonomy $\mathrm{SU}(n)$, mirror pairs, string compactifications
- [Mirror symmetry](./mirror-symmetry.html) — A- and B-models, SYZ, homological mirror symmetry
- [Resolution of singularities](./resolution-of-singularities.html) — Hironaka in characteristic 0, blowups, log resolution
- [Motives](./motives.html) — capstone of cohomology fanout: Tannakian categories, the motivic Galois group, realizations (Betti / de Rham / $\ell$-adic / crystalline), Tate twists, the standard conjectures and how Grothendieck's vision unifies the cohomology theories
- [Hodge theory](./hodge-theory.html) — capstone of complex algebraic geometry: pure Hodge decomposition for smooth projective varieties, the Hodge filtration as a structure in its own right, mixed Hodge structures (Deligne), period domains, the Hodge conjecture
- [Toric varieties](./toric-varieties.html) — lattices/cones/fans, affine $U_\sigma$, the toric dictionary, $\mathbb{P}^n$ / $\mathbb{P}^1\times\mathbb{P}^1$ / blowups, Cox ring, reflexive polytopes and Batyrev mirrors
- [Abelian varieties](./abelian-varieties.html) — complex tori, polarizations and the dual, isogenies & Tate modules, Jacobians and Torelli, Néron models, Mordell–Weil & Faltings
- [Positivity & ample line bundles](./positivity-and-ample-line-bundles.html) — divisors, Picard, very ample / ample / nef / big, Nakai–Moishezon, the cone of curves, Kodaira embedding, Kawamata–Viehweg vanishing
- [MMP & birational geometry](./mmp-and-birational-geometry.html) — Kodaira dimension, the cone theorem, surface MMP (Castelnuovo / Enriques), threefold MMP and flips, singularities of pairs, Mori fibre spaces and Sarkisov
- [D-modules & the Riemann–Hilbert correspondence](./d-modules.html) — the Weyl algebra, $\mathcal{D}_X$-modules, holonomicity and characteristic varieties, hypergeometric systems, the Bernstein–Sato polynomial
- [Crystalline cohomology](./crystalline-cohomology.html) — the $\ell=p$ gap, divided powers and the crystalline site, comparison with de Rham of a lift, Frobenius and Katz–Messing, F-isocrystals, period rings $B_{\mathrm{cris}} / B_{\mathrm{dR}}$
- [Tropical geometry](./tropical-geometry.html) — draft — fill in once the page has real content

### Combinatorics & graph theory
- [Spectral graph theory](./spectral-graph-theory.html) — adjacency, Laplacian, Cheeger inequality, expanders — graphs as discrete differential geometry
- [Matroid theory](./matroid-theory.html) — Whitney's combinatorial abstraction of independence; bases, rank, duality, the Tutte polynomial
- [Probabilistic method](./probabilistic-method.html) — existence by expectation, Ramsey lower bounds, Lovász Local Lemma, $G(n,p)$ thresholds, concentration
- [Extremal combinatorics](./extremal-combinatorics.html) — Turán's theorem, Kővári–Sós–Turán, Erdős–Stone, Ramsey numbers, Sperner & LYM, removal lemma
- [Simplicial complexes (combinatorial)](./simplicial-complexes-combinatorial.html) — abstract complexes, $f$/$h$-vectors, Dehn–Sommerville, Stanley–Reisner ring, persistent homology
- [Enumerative combinatorics](./enumerative-combinatorics.html) — generating functions, the twelvefold way, species, exponential structures
- [Designs](./designs.html) — block designs, Steiner systems, projective planes, Latin squares, Bruck–Ryser–Chowla
- [Expanders](./expanders.html) — spectral expansion, Cheeger inequality, zigzag product, Ramanujan graphs

### Mathematical physics
- [Schrödinger equation](./schrodinger-equation.html) — wave functions, eigenstates, harmonic oscillator, hydrogen atom, scattering
- [Hamiltonians and classical mechanics](./hamiltonians-classical-mechanics.html) — symplectic phase space, Liouville's theorem, integrability, action-angle
- [General relativity](./general-relativity.html) — Einstein field equations, Schwarzschild, black holes, gravitational waves
- [The three-body problem](./three-body-problem.html) — Lagrange points, restricted three-body, KAM tori, chaos
- [Statistical mechanics](./statistical-mechanics.html) — capstone of equilibrium statistical mechanics: phase-space ensembles, the Boltzmann/Gibbs distribution, free energy from $\log Z$, the grand canonical with chemical potential, Ising phase transitions and the renormalization group, large-deviations fluctuations and the Legendre bridge to thermodynamics.
- [Gauge theory](./gauge-theory.html) — capstone of differential gauge theory: connections on principal bundles, curvature and Yang-Mills, gauge transformations and Wilson loops, BPST instantons and Chern-Simons, lattice gauge theory and confinement, the Donaldson and Seiberg-Witten 4-manifold invariants.
- [String theory](./string-theory.html) — capstone of mathematical string theory: world-sheet action and 2D CFT, bosonic critical dimension $D=26$, superstrings in $D=10$, Calabi-Yau compactification, T-duality and mirror symmetry, branes and AdS/CFT, and the math output (mirror symmetry, monstrous moonshine, geometric Langlands).
- [Special relativity](./special-relativity.html) — Einstein's postulates, Lorentz transformations, Minkowski metric and the spacetime interval, time dilation, relativistic energy-momentum, light cones and causality
- [Klein–Gordon equation](./klein-gordon-equation.html) — from $E^2=p^2+m^2$ to a wave operator, plane-wave solutions, negative-energy / antiparticle interpretation, conserved current, non-relativistic limit
- [Dirac equation](./dirac-equation.html) — first-order operator from $E^2=p^2+m^2$, covariant form, spin-½, positive-definite probability current, Dirac sea & antimatter, Pauli equation as the non-relativistic limit
- [Quantum field theory](./quantum-field-theory.html) — operator-valued distributions, Fock space, Feynman path integral, Feynman diagrams, renormalization and running couplings, gauge fields and the Standard Model

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
