# Coverage gaps vs. canonical graduate curriculum

## Headline gaps

The notebook's structural / arithmetic / categorical spine is unusually deep for a one-author project — Lurie-tier ∞-categorical material sits next to class field theory and a 19-page algebraic-geometry sub-arc. The visible holes are along three axes: (i) **logic and proper foundations** (only `naive-set-theory`, no first-order logic, model theory, computability, or HoTT-as-foundations), (ii) **PDE / spectral / hard analysis** (`real-analysis`, `measure-theory`, `functional-analysis`, `sobolev-spaces-distributions`, but no PDE-as-a-topic, no spectral theorem treated as its own page, no calculus-of-variations / distribution-theoretic FA), and (iii) **probabilistic-and-applied** (one probability page, no statistical-inference, no stochastic processes beyond a sub-section, no information theory, no optimization). The geometry section is missing **Morse theory / characteristic classes / symplectic** despite owning the prerequisites, and the number-theory section has no **analytic-NT-as-a-discipline** page (sieves, primes-in-AP, exponential sums) even though the pieces orbit it.

## Per-section coverage assessment

### Foundations
**What's well-covered:** `naive-set-theory` is solid Halmos-flavored.
**Gaps (ranked by leverage):**
1. *first-order-logic-and-completeness* — propositional/predicate calculus, Gödel completeness, compactness, Löwenheim–Skolem; the lingua franca every other proof on the site implicitly uses.
2. *zfc-and-ordinals* — axioms, transfinite induction, cardinals, choice/Zorn equivalents; a graduate student opening "Foundations" expects this and finds only naive set theory.
3. *incompleteness-and-computability* — Gödel's two theorems, Turing machines, halting, recursion; capstone-grade material that connects logic to algorithmic mathematics.
4. *type-theory-and-hott* — Martin-Löf intensional type theory, identity types, univalence; promised by `infinity-topoi`'s closing arc but never developed.

**Possible removals or merges:** none — the section is thin, not bloated.

### Algebra
**What's well-covered:** the categorical / ∞-categorical / homological spine is exceptional. Dummit-Foote's group/ring/field core lives in `algebra`.
**Gaps (ranked by leverage):**
1. *modules-and-tensor-algebra* — modules over a ring, tensor/exterior/symmetric algebras, Smith normal form, structure theorem over PIDs; these are sprinkled across `algebra`, `commutative-algebra`, and `homological` but never centered.
2. *galois-cohomology-and-brauer* — $H^*(G_K, \cdot)$, Brauer group, Hilbert 90, Tate cohomology; a natural bridge between `group-cohomology`, `class-field-theory`, and `etale-cohomology`.
3. *lie-algebras-as-an-algebraic-topic* — root systems, Cartan/Killing, classification, universal enveloping; `lie-groups` is geometric, but the algebraic side (Humphreys-flavored) deserves its own page.

**Possible removals or merges:** none, but `cocartesian-fibrations` is borderline-thin as a standalone outside of the Lurie arc.

### Analysis
**What's well-covered:** the Rudin / Folland / Stein-Shakarchi spine is mostly there, with a strong functional-analysis page and Sobolev/distributions.
**Gaps (ranked by leverage):**
1. *partial-differential-equations* — heat / Laplace / wave equations, weak solutions, Sobolev embedding in action, energy methods; Evans-flavored. The site has the prerequisites and no payoff.
2. *spectral-theory-of-self-adjoint-operators* — spectral theorem for unbounded self-adjoint operators, functional calculus, Stone's theorem; currently a sub-section of `functional-analysis` but a proper anchor of mathematical physics.
3. *calculus-of-variations-and-optimal-transport* — Euler–Lagrange, direct method, $\Gamma$-convergence, Wasserstein/Monge–Kantorovich; modern and connects analysis to geometry/probability.
4. *ergodic-theory* — Birkhoff/von Neumann ergodic theorems, mixing, entropy; sits at analysis ∩ dynamics ∩ number theory and is implicit in `dynamical-systems` §12.

**Possible removals or merges:** none.

### Geometry & topology
**What's well-covered:** a complete Hatcher / Lee / do Carmo spine through Riemannian geometry and Lie groups.
**Gaps (ranked by leverage):**
1. *characteristic-classes* — Chern, Stiefel–Whitney, Pontryagin, Euler; Bott–Tu material that connects `differential-forms`, `algebraic-topology`, and `intersection-theory-chow`.
2. *morse-theory* — critical points → CW structure, Morse inequalities, Morse–Smale; Milnor's classic and a beautiful interactive subject.
3. *symplectic-and-hamiltonian-geometry* — symplectic forms, Hamiltonian flows, moment maps, Darboux; the mathematical-physics gateway and adjacent to `lie-groups`.
4. *cobordism-and-surgery* — bordism groups, Pontryagin–Thom, surgery exact sequence; the natural capstone for the topology arc.

**Possible removals or merges:** none.

### Number theory
**What's well-covered:** the algebraic-NT / class-field / heights spine is extraordinarily deep.
**Gaps (ranked by leverage):**
1. *analytic-number-theory* — PNT via complex analysis, Dirichlet's theorem, sieves (Selberg/large), Vinogradov sums; the analytic counterweight to the Galois-flavored coverage.
2. *transcendence-theory* — Hermite–Lindemann, Gelfond–Schneider, Baker's theorem; a clean self-contained pillar.
3. *diophantine-approximation* — continued fractions, Roth's theorem, Thue–Siegel; sits next to `heights-arithmetic-geometry` and complements it.

**Possible removals or merges:** `waring` and `sums-of-squares` could plausibly merge into a single "additive number theory" page, freeing room for analytic NT.

### Modular forms & L-functions
**What's well-covered:** Diamond–Shurman through Bump and Iwaniec–Kowalski, plus capstones (Sato–Tate, BSD, modularity).
**Gaps (ranked by leverage):**
1. *modular-curves-and-moduli-of-elliptic-curves* — $Y_0(N)$, $X_0(N)$, modular interpretation; the geometric spine under modular forms, currently only adjacent.
2. *langlands-program-overview* — automorphic ↔ Galois dictionary, functoriality, reciprocity; a survey-capstone tying `automorphic-forms-adelic`, `galois-representations`, and `class-field-theory` together.
3. *converse-theorems-and-rankin-selberg* — Weil's converse, Rankin–Selberg integrals, $L$-function constructions; the bread and butter of the modern theory.

**Possible removals or merges:** none.

### Algebraic geometry
**What's well-covered:** an unusually complete Hartshorne / Vakil / Stacks-Project spine — 19 topics including étale, stacks, deformation theory.
**Gaps (ranked by leverage):**
1. *positivity-and-line-bundles* — ample/nef/big, Kodaira embedding, Nakai–Moishezon; the bridge to birational geometry.
2. *birational-geometry-and-mmp* — blowups, Kodaira dimension, MMP overview; the modern AG arc absent from the site.
3. *hodge-theory* — Hodge decomposition, Lefschetz $(1,1)$, mixed Hodge; sits between `riemann-surfaces`, `algebraic-de-rham-cohomology`, and `complex-analysis`.

**Possible removals or merges:** `singular-cubics-reduction` is narrow and could fold into `elliptic-curves`.

### Combinatorics & graph theory
**What's well-covered:** five pages built around modern themes (spectral, matroid, probabilistic, extremal, topological).
**Gaps (ranked by leverage):**
1. *enumerative-combinatorics* — Stanley I/II flavor: generating functions in earnest, species, transfer matrices, $q$-analogs; the missing classical anchor.
2. *algebraic-combinatorics* — Young tableaux, RSK, symmetric functions, Schur polynomials; a clean bridge to `representation-theory`.
3. *graph-theory-classical* — connectivity, planarity, coloring, Menger / Hall / Tutte / Robertson–Seymour minors; the West/Diestel core that the section currently skips.
4. *combinatorial-optimization-and-polytopes* — LP duality, matchings/flows, Ehrhart, polytope combinatorics; the applied bridge.

**Possible removals or merges:** none — section is young.

## Section-level gaps (entire missing sections)

- **Logic & foundations of mathematics** — *should exist*. The current "Foundations" has one page, and the corpus's deep ∞-topos / HoTT material has no logical substrate. Anchor topics: first-order-logic, ZFC-and-ordinals, model-theory, computability-and-incompleteness, type-theory-and-hott, reverse-mathematics. Promote `naive-set-theory` into this section as the prereq.
- **Probability & statistics** — *should exist as its own section*. One page is far below the gravitational pull of the topic. Anchor topics: probability-theory (existing), stochastic-processes-and-martingales, statistical-inference, information-theory, large-deviations, concentration-of-measure, markov-chains-and-mixing. Spectral graph theory and probabilistic method are natural cross-section neighbors.
- **Mathematical physics** — *fold into existing sections*, do not create. Hamiltonian/Lagrangian → symplectic-geometry under Geometry. Quantum/spectral → spectral-theory under Analysis. Gauge theory → characteristic-classes + lie-groups. GR → riemannian-geometry. The site's vibe is pure math; a physics section would dilute focus.
- **Dynamical systems & ergodic theory** — *expand within Analysis*, do not create a new section. `dynamical-systems` exists; add `ergodic-theory`, `hyperbolic-and-symbolic-dynamics`, possibly `kam-and-hamiltonian-dynamics`. A standalone section is premature with only 1–4 pages.
- **Computational / numerical mathematics** — *do not create*. Out of scope for a "graduate-mathematics-as-art" notebook; the closest legitimate addition is an *algorithmic number theory* page inside number theory if Schoof / lattice reduction excite the author.
- **Optimization & convex analysis** — *do not create as a section*. Add convex-analysis-and-duality as a single page in Analysis if anywhere; `combinatorial-optimization-and-polytopes` belongs in Combinatorics.

## Cross-cutting themes the corpus underweights

1. **Spectral theory across contexts** — graphs (covered), Riemannian Laplacian (implicit), self-adjoint operators (sub-section), zeta zeros (capstone). A unifying "spectrum-of-an-operator" thread would be powerful and currently is absent.
2. **Inequalities and concentration** — Jensen, Hölder, Sobolev, Poincaré, log-Sobolev, isoperimetric, Brunn–Minkowski, concentration of measure; appear scattered, never as a topic.
3. **Generating functions as a unifying tool** — present in `partitions`, `dirichlet-series`, `theta-functions`, but never centered as a single technique-page; Wilf-style.
4. **Asymptotic and analytic methods** — saddle-point, stationary phase, WKB, Laplace's method, Tauberian theorems; the analytic plumbing under most $L$-function and partition results.
5. **Explicit computational anchoring** — beyond a few widgets, theorems are rarely demonstrated with a worked example a student could redo on paper (e.g., compute a class group, run Buchberger, factor a Dedekind zeta). Audits already note widget-corpus skew toward `button-stepper`.

## Highest-leverage 10 additions to ship next

1. **first-order-logic-and-completeness** — Foundations — the missing substrate for every proof on the site.
2. **partial-differential-equations** — Analysis — turns Sobolev/FA prerequisites into a payoff.
3. **characteristic-classes** — Geometry & topology — bridges differential-forms, algebraic-topology, and Chow.
4. **analytic-number-theory** — Number theory — completes the NT section's pure-algebraic skew.
5. **lie-algebras** — Algebra — the classification half that `lie-groups` doesn't carry.
6. **stochastic-processes-and-martingales** — Probability (new section) — anchors probability beyond one page.
7. **morse-theory** — Geometry & topology — visually irresistible, links topology to differential geometry.
8. **enumerative-combinatorics** — Combinatorics — the missing classical anchor.
9. **modular-curves** — Modular forms — geometric spine under modular forms, supplies §-for-§ neighbor for `moduli-spaces`.
10. **galois-cohomology-and-brauer** — Algebra — connects group-cohomology, CFT, and étale cohomology with one page.

## Anti-recommendations

- **Elementary calculus, linear algebra basics, ODE-as-a-first-course** — out of scope; the bar is graduate-level.
- **A standalone mathematical-physics section** — fold into Geometry/Analysis instead; preserves the site's pure-math identity.
- **Numerical analysis as a section** — out of scope; the notebook is about *understanding*, not *computing approximately*.
- **A statistics section beyond a single-page statistical-inference under Probability** — graduate stats is a different discipline; one anchor page suffices.
- **Game theory, mathematical economics, machine learning theory** — adjacent fields that would dilute the curatorial focus on pure mathematics.
- **A separate "applied" section** — the site's identity is the structural / arithmetic / categorical spine; turning it into a generic graduate-math index would erase what makes it distinctive.

[coverage reviewer]
