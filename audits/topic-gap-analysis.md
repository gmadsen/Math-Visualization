# Topic Gap Analysis — Number Theory, Algebraic Geometry, Geometry & Topology, Modular Forms & L-functions

Comparative content-gap audit, 2026-05-05. Read-only research; no concept-graph edits.
Benchmarks consulted: Princeton Companion to Mathematics (PCM), nLab, Wikipedia category trees,
Hartshorne, Silverman (AEC + Advanced Topics), Diamond–Shurman, Bott–Tu, Hatcher, Lee (Smooth/Riemannian),
Neukirch, Iwaniec–Kowalski, Cox (Primes of the form x²+ny²), Milne (lecture notes), Bump.

Priority signal scoring is the count of canonical references in which the topic appears as a stand-alone
chapter or major nLab/Wikipedia node:
- **High** (5–6 refs): foundational; gap is conspicuous.
- **Medium** (3–4 refs): standard graduate fare; expected but not load-bearing.
- **Low-medium** (2 refs): canonical but specialized.

---

## 1. Number theory

### What's covered

14 topics covering: Galois theory, quadratic reciprocity, Gauss-style additive NT (sums of squares,
Waring, circle method), binary quadratic forms / genus theory, classical ANT (rings of integers,
ramification, class group, Minkowski), p-adic numbers (norm, Hensel, Newton polygons,
Hasse principle), adèles & idèles (incl. Tate's thesis sketch), Frobenius/Chebotarev,
class field theory (Artin map, Hilbert class field, Takagi), Galois reps,
heights (Néron–Tate, Mordell–Faltings, Vojta, Bogomolov), analytic NT (PNT, sieves,
Bombieri–Vinogradov, large sieve, exp sums), cryptography, computational NT (LLL, Schoof, factoring).

The classical analytic, algebraic, and adelic spines are present and reasonably deep.

### Missing standard topics

1. **Continued fractions and Diophantine approximation** — high
   *Convergents, Hurwitz theorem, Roth's theorem (1958), Liouville numbers, transcendence of e/π, Schmidt subspace theorem.*
   Brings: links into heights (Roth ↔ Vojta), p-adics (p-adic Roth), additive NT, dynamical systems (Markoff spectrum, Gauss map).
   Found in: PCM (multiple chapters), Wikipedia, Hardy–Wright, Schmidt's "Diophantine Approximation," Iwaniec–Kowalski (background).

2. **Iwasawa theory / cyclotomic fields** — high
   *Z_p-extensions, Iwasawa main conjecture, p-adic L-functions, Mazur–Wiles, Kubota–Leopoldt, Stickelberger, units in cyclotomic fields.*
   Brings: a crucial bridge from class field theory + Galois representations into modular forms (Mazur–Wiles, Skinner–Urban) and motives.
   Found in: PCM, Neukirch, Washington "Intro to Cyclotomic Fields," Coates–Sujatha, nLab, Wikipedia. Currently the corpus jumps from CFT directly to Galois reps with no Iwasawa scaffolding.

3. **Dirichlet's unit theorem and the regulator (as a stand-alone unit)** — medium
   *Logarithmic embedding, lattice of units, regulator R_K, class number formula ζ_K(0) = -hR/w.*
   Brings: tightens the link between ANT, analytic NT (class number formula), and heights.
   Found in: PCM, Neukirch, Wikipedia, Marcus, Lang ANT.
   Currently buried as one bullet in `algebraic-number-theory`; deserves first-class treatment because the class number formula is a recurring touchstone.

4. **Complex multiplication (CM) of elliptic curves and abelian varieties** — high
   *CM elliptic curves, Heegner construction, j-invariants generate ring class fields, main theorem of CM, CM abelian varieties, Shimura–Taniyama.*
   Brings: explicit class field theory, Heegner points (BSD), Sato–Tate (CM case lives here).
   Found in: PCM, Silverman Advanced Topics, Cox, Lang Elliptic Functions, Shimura, Wikipedia. Currently a single bullet in `elliptic-curves`.

5. **Diophantine equations and the Mordell conjecture (Faltings)** — medium
   *Mordell, Hilbert's tenth, Falting's theorem, S-unit equations, Thue equations, Bilu–Tichy, Chabauty–Coleman.*
   Brings: applications spine for `heights-arithmetic-geometry`, `algebraic-curves-higher-genus`, `p-adic-numbers`.
   Found in: PCM (multiple), Wikipedia, Bombieri–Gubler "Heights in Diophantine Geometry," Hindry–Silverman.

6. **Multiplicative number theory & the Riemann hypothesis** — medium
   *Riemann ζ as its own page: Hadamard product, RH equivalents, Lindelöf hypothesis, moments of ζ, RMT models (Keating–Snaith), GRH consequences for primes.*
   Brings: deeper into analytic NT, links to random matrix theory (probability) and L-functions.
   Found in: PCM (Sarnak's RH chapter), Iwaniec–Kowalski, Titchmarsh, Edwards, Wikipedia.
   Currently `analytic-number-theory` covers ζ-zero-free-regions but RH itself has no dedicated home.

7. **Transcendence theory** — medium
   *Lindemann–Weierstrass, Gelfond–Schneider, Baker's theorem, period conjectures, Mahler classification, Schanuel.*
   Brings: connects to heights (Lehmer/Mahler), zeta values (irrationality of ζ(3)), motives (periods).
   Found in: PCM, Baker "Transcendental Number Theory," Waldschmidt, Wikipedia. Lehmer is mentioned in heights, but the Lindemann–Baker spine is missing.

8. **Sieve theory beyond the basics** — low-medium
   *Brun, Selberg, large sieve as its own treatment, parity problem, Goldston–Pintz–Yıldırım, Maynard–Tao bounded gaps, Zhang.*
   Brings: deeper analytic NT; pairs with `additive-number-theory` (circle method) as the second analytic toolkit.
   Found in: Iwaniec–Kowalski, Friedlander–Iwaniec "Opera de Cribro," PCM. Currently one bullet in analytic-NT.

---

## 2. Algebraic geometry

### What's covered

24 topics. Strong foundational spine: projective plane, Bézout, schemes (full), sheaves,
morphisms/fiber products, functor of points, sheaf cohomology, algebraic de Rham, Hodge theory,
intersection theory/Chow, group schemes, étale π_1, étale cohomology, deformation theory,
algebraic spaces, stacks, moduli, motives, resolution. Curve theory (elliptic, singular cubics,
higher-genus). Calabi–Yau & mirror symmetry. The Grothendieck–Hartshorne curriculum is largely intact.

### Missing standard topics

1. **Toric varieties** — high
   *Fans, lattice polytopes, Atiyah–Guillemin–Sternberg, toric resolutions, mirror symmetry for toric CYs (Batyrev), GKZ.*
   Brings: an explicit-computational bridge between combinatorics, intersection theory, mirror symmetry, and moduli; used extensively as worked examples in modern AG.
   Found in: Fulton "Toric Varieties," Cox–Little–Schenck, PCM, nLab, Hartshorne (exercises only — but everywhere as examples in research).
   This is the most conspicuous gap: every grad student meets toric varieties early, and the corpus already has Calabi–Yau and mirror symmetry that explicitly invoke them.

2. **Abelian varieties (as a topic, beyond elliptic curves)** — high
   *Theta divisors, polarizations, isogenies, dual abelian variety, Mumford's theorem, Tate module, Néron models, Jacobians of curves (general genus), Albanese.*
   Brings: heights (Faltings), modular curves (J_0(N)), BSD generalization, Galois reps, motives.
   Found in: PCM, Mumford "Abelian Varieties," Milne notes, Hartshorne, Hindry–Silverman, nLab. The corpus has elliptic curves, modular Jacobians, and Néron–Tate heights but no central treatment of abelian varieties.

3. **Positivity / ample line bundles / Kodaira embedding** — high
   *Ample, very ample, nef, big divisors, Nakai–Moishezon, Kodaira embedding, Lefschetz hyperplane, Kawamata–Viehweg vanishing.*
   Brings: completes sheaf cohomology → curves → moduli pipeline; entry to MMP.
   Found in: Hartshorne ch. II §7 + III §5, Lazarsfeld "Positivity," Griffiths–Harris, PCM, nLab.

4. **Minimal model program (MMP) and birational geometry** — medium
   *Kodaira dimension, canonical ring, MMP for surfaces (Castelnuovo, Enriques), threefold MMP, flips & flops, BCHM finite generation.*
   Brings: the second-half-of-graduate-AG spine after Hartshorne; pairs with `resolution-of-singularities`.
   Found in: Kollár–Mori "Birational Geometry," Matsuki, Reid, PCM, Wikipedia. Currently absent.

5. **D-modules and Riemann–Hilbert** — medium
   *D_X-modules, holonomic, regular singular, Riemann–Hilbert correspondence, perverse sheaves, decomposition theorem, Beilinson–Bernstein.*
   Brings: connects algebraic de Rham, étale cohomology, Hodge theory, representation theory.
   Found in: Hotta–Takeuchi–Tanisaki, Borel et al., Kashiwara, PCM, nLab. The corpus has algebraic de Rham and étale cohomology but no D-module bridge.

6. **Crystalline cohomology / p-adic cohomology** — medium
   *Crystalline site, divided powers, comparison with de Rham, Frobenius on crystalline cohomology, p-adic Hodge theory (B_dR, B_cris, Fontaine), prismatic cohomology.*
   Brings: completes the Weil cohomology zoo (étale, de Rham, crystalline) already invoked in `etale-cohomology` and `motives` without a home.
   Found in: PCM (Fontaine), Berthelot, Bhatt–Scholze, nLab, Wikipedia. Currently only mentioned in `etale-cohomology` comparison theorems.

7. **Riemann–Roch and Grothendieck–Riemann–Roch (full treatment)** — medium
   *RR for surfaces, GRR statement and proof sketch, Hirzebruch–Riemann–Roch, applications to χ(O_X) bounds, GRR for singular varieties.*
   Brings: synthesises sheaf cohomology, intersection theory, characteristic classes; currently a single bullet in `intersection-theory-chow`.
   Found in: Hartshorne A.4, Fulton "Intersection Theory," PCM, Borel–Serre.

8. **Algebraic surfaces (Enriques classification)** — low-medium
   *Castelnuovo's contraction, blow-up/blow-down, ruled, K3, Enriques, Abelian, properly elliptic, general type, Kodaira's classification of elliptic fibrations.*
   Brings: smallest concrete arena for MMP; pairs with K3 ⊂ Calabi–Yau.
   Found in: Beauville "Complex Algebraic Surfaces," Barth–Hulek–Peters–Van de Ven, PCM, nLab.

---

## 3. Geometry & topology

### What's covered

16 topics covering: point-set, fundamental group / covering spaces / singular homology
(combined under `algebraic-topology`), smooth manifolds, differential forms, classical
differential geometry (curves and surfaces), Riemannian geometry, Lie groups, Riemann
surfaces, characteristic classes, Morse theory, K-theory, symplectic manifolds, knot
polynomials, Ricci flow, Atiyah–Singer, Mostow rigidity.

### Missing standard topics

1. **Cohomology and Poincaré duality (proper algebraic-topology depth)** — high
   *Singular cohomology, cup product, cap product, Poincaré–Lefschetz duality, Künneth, universal coefficients, Eilenberg–MacLane spaces, Steenrod squares, spectral sequences (Serre, Leray).*
   Brings: foundational deficit. Currently `algebraic-topology` stops at singular *homology* — no cup product, no duality, no spectral sequences.
   Found in: Hatcher (its second half!), Bott–Tu (its core), Spanier, Munkres, PCM, nLab, Wikipedia.
   The single most conspicuous gap in the entire notebook: every other AG/topology page presupposes cup products and Poincaré duality.

2. **Homotopy theory** — high
   *Higher homotopy groups π_n, fibration sequences, Hurewicz theorem, Whitehead theorem, Postnikov towers, stable homotopy, π_*S, model categories (already present!) feeding into stable homotopy.*
   Brings: bridges `algebraic-topology` to `model-categories`, `infinity-categories`, `K-theory` — all of which presume homotopy fluency.
   Found in: Hatcher ch. 4, Bott–Tu, May "Concise Course," Whitehead, nLab, PCM. Currently entirely absent.

3. **Cobordism theory** — medium
   *Thom spectra MO, MU, MSO, oriented cobordism, complex cobordism, Pontryagin–Thom, signature, Hirzebruch L-genus, formal group laws / Quillen.*
   Brings: completes the index-theorem story (signature theorem via cobordism), connects to characteristic classes, K-theory, formal groups.
   Found in: Stong "Notes on Cobordism," Milnor–Stasheff, PCM, nLab. Currently absent despite Atiyah–Singer being present.

4. **Foliations and contact geometry** — medium
   *Frobenius integrability theorem, foliated manifolds, Reeb foliation, contact structures, Darboux for contact, Weinstein conjecture, Legendrian knots.*
   Brings: dual to symplectic; needed for modern symplectic / dynamical systems work.
   Found in: PCM, Geiges "Intro to Contact Topology," Camacho–Lins Neto, McDuff–Salamon, nLab, Wikipedia.

5. **Topological field theories and TQFT** — medium
   *Atiyah's axioms, 2D TQFT ↔ Frobenius algebras, Reshetikhin–Turaev, cobordism hypothesis (Lurie), Chern–Simons, extended TQFT.*
   Brings: connects knot polynomials → vertex operator algebras → mirror symmetry → ∞-categories.
   Found in: PCM, Atiyah, Kock "Frobenius Algebras and 2D TQFTs," Lurie "On the Classification of TFTs," nLab.
   Already implicitly in scope (knot polynomials, VOAs, mirror symmetry) but no organising page.

6. **Geometric group theory (as a topology page; current entry sits in the algebra section)** — medium
   *Cayley graphs, growth functions, hyperbolic groups (Gromov), CAT(0) spaces, asymptotic cones, mapping class groups, Out(F_n), boundary at infinity.*
   Brings: pairs with `mostow-rigidity`; supports `riemann-surfaces` (Teichmüller) and `algebraic-topology`.
   Found in: PCM, Bridson–Haefliger, de la Harpe, Drutu–Kapovich, nLab, Wikipedia.
   Note: `geometric-and-combinatorial-group-theory` exists in the algebra section but the geometric-topology angle (CAT(0), boundaries, mapping class groups) is under-covered.

7. **Hyperbolic geometry beyond surfaces / Teichmüller theory** — medium
   *Hyperbolic 3-manifolds (already in `mostow-rigidity` lightly), Teichmüller space, moduli of Riemann surfaces, Thurston's geometrisation (8 geometries), measured foliations, train tracks.*
   Brings: pairs with `mostow-rigidity`, `riemann-surfaces`, `riemannian-geometry`.
   Found in: PCM, Farb–Margalit "Primer on Mapping Class Groups," Thurston notes, Hubbard, nLab.

8. **Complex / Kähler geometry** — high
   *Almost-complex structures, integrability (Newlander–Nirenberg), Kähler metrics, Kähler identities, Hodge theory on Kähler manifolds, Kodaira embedding, Calabi conjecture.*
   Brings: bridges `differential-geometry`, `riemannian-geometry`, `hodge-theory`, `calabi-yau`. Currently no first-class complex-geometry page; Hodge sits under AG, Calabi–Yau is a stub of the moduli/string angle.
   Found in: Griffiths–Harris, Huybrechts "Complex Geometry," Wells, Voisin, PCM, nLab. Strong canonical presence.

---

## 4. Modular forms & L-functions

### What's covered

17 topics: hyperbolic upper half-plane, modular forms (lattices, SL_2(Z), Eisenstein, q-exp,
Petersson), theta functions, partitions/eta, Hecke operators, Dirichlet series & Euler
products, analytic continuation, ζ-values (Bernoulli, ζ(3), MZVs), L-functions (general),
adelic automorphic forms (incl. Whittaker, spherical Hecke, Satake, L-group), monstrous
moonshine, Sato–Tate, BSD, modularity & FLT, modular curves (Y_0(N), Heegner, Mazur),
vertex operator algebras, Langlands program.

This is the strongest section relative to its size; the Diamond–Shurman + Bump spines
are largely covered.

### Missing standard topics

1. **Half-integral weight modular forms and the Shimura correspondence** — medium
   *Theta-multiplier, Shimura lift, Shintani lift, Waldspurger formula, Kohnen–Zagier, Heegner points and Tunnell.*
   Brings: connects theta functions, modular forms, L-functions, BSD (Tunnell on congruent numbers, Gross–Zagier).
   Found in: Shimura "Modular Forms of Half-Integral Weight," Diamond–Shurman exercises, Iwaniec "Topics in Classical Automorphic Forms," PCM, Bump.

2. **Maass forms and the spectral theory of GL_2** — medium
   *Non-holomorphic automorphic forms, Maass cusp forms, Selberg trace formula, Selberg eigenvalue conjecture, Kuznetsov formula, Rankin–Selberg unfolding (general).*
   Brings: completes the spectrum of automorphic forms (only holomorphic side currently); essential for analytic L-function theory.
   Found in: Iwaniec "Spectral Methods of Automorphic Forms," Bump, Goldfeld, PCM. Currently `automorphic-forms-adelic` mentions "spectral decomposition" without the Maass-form side.

3. **Eichler–Shimura theory (proper)** — medium
   *Eichler–Shimura isomorphism (modular symbols ↔ cusp forms), Eichler integrals, Manin symbols, modular symbols algorithms.*
   Brings: explicit BSD computation, modularity (R = T input), `modular-curves` (currently has it as a bullet only).
   Found in: Diamond–Shurman ch. 6, Shimura, Stein "Modular Forms — A Computational Approach," PCM.

4. **Galois representations attached to modular forms (Deligne) — proper** — medium
   *Construction via étale cohomology of modular curves, ℓ-adic Galois reps from cusp forms, Eichler–Shimura relations Trace(Frob_p) = a_p, Deligne–Serre on weight 1.*
   Brings: this is the technical heart of modularity; currently scattered across `galois-representations`, `etale-cohomology`, `modular-curves`, `modularity-and-flt` without a synthesising page.
   Found in: Deligne "Formes modulaires et représentations ℓ-adiques," Diamond–Shurman ch. 9, Wiles, Cornell–Silverman–Stevens.

5. **Quaternion algebras, Shimura curves, and indefinite-Eichler theory** — low-medium
   *Quaternion orders, optimal embeddings, Eichler–Selberg trace formula, Shimura curves as moduli of false elliptic curves, applications to Jacquet–Langlands.*
   Brings: bridges `quaternions-octonions-and-division-algebras` (already in algebra) into modular forms; needed for Jacquet–Langlands correspondence.
   Found in: Vignéras, PCM (Jacquet–Langlands chapter), Voight "Quaternion Algebras," Shimura.

6. **Iwasawa main conjecture / p-adic L-functions** — medium (cross-section with NT)
   *Kubota–Leopoldt p-adic L, Mazur–Wiles, Skinner–Urban, p-adic modular forms (Serre, Hida).*
   Brings: cross-section bridge to NT (cf. NT gap #2 above). Counted once if the topic is added under either section.
   Found in: PCM, Greenberg, Skinner–Urban, Bump (Hida theory), Coleman–Mazur eigencurve.

7. **The trace formula (Selberg + Arthur)** — low-medium
   *Selberg trace formula for SL_2, Arthur–Selberg trace formula, comparison of trace formulas (Jacquet–Langlands, base change).*
   Brings: capstone for `automorphic-forms-adelic` and `langlands-program`, both of which presuppose it.
   Found in: PCM, Arthur survey papers, Knapp–Rogawski, Bump. Currently absent.

8. **Converse theorems** — low-medium
   *Hecke's converse, Weil's converse with twists, Cogdell–Piatetski-Shapiro for GL_n.*
   Brings: how you go from L-functions back to automorphic forms; pairs with modularity.
   Found in: Bump ch. 1, PCM, Cogdell lecture notes.

---

## Closing recommendation — top-2 cross-section

Two topics dominate by leverage (most upstream/downstream connections + appears in 5–6 of the
canonical reference set):

### #1 — Cohomology, Poincaré duality, and spectral sequences
*Section: geometry-and-topology* (extending or replacing the second half of `algebraic-topology`).

This is the single most conspicuous gap in the entire notebook. **Every** existing topic in the
algebraic geometry, modular forms, and higher-categories sections silently presupposes
cup products, Poincaré duality, and Leray/Serre spectral sequences:

- `sheaf-cohomology`, `etale-cohomology`, `algebraic-de-rham-cohomology`, `hodge-theory`, `motives`
  — all use cup product and duality without forward reference.
- `characteristic-classes`, `k-theory`, `atiyah-singer-index-theorem` — use Steenrod and
  spectral sequences.
- `automorphic-forms-adelic`, `modular-curves` — Eichler–Shimura *is* a Hodge-theoretic/cohomology statement.

Adding it converts a large set of currently-orphan callbacks into clean prerequisites and
unlocks the natural subsequent topics (homotopy theory, cobordism). High pedagogical leverage:
the existing `algebraic-topology` page already has fundamental group and singular homology;
extending it (or splitting off `cohomology-and-duality`) brings the page in line with Hatcher
ch. 3 and Bott–Tu, which is the modal grad-topology baseline.

### #2 — Toric varieties
*Section: algebraic-geometry.*

This is the most conspicuous algebraic-geometry gap, and unique among the candidate gaps in
that it is **explicit, computational, and visualisable** — perfect fit for the notebook's
3Blue1Brown / Brilliant aesthetic. Every concept is concretely a polytope, a fan, a
combinatorial datum, paired with a visible variety.

It bridges existing topics:
- `intersection-theory-chow` — toric Chow rings are simplicial-fan combinatorics.
- `mirror-symmetry` — Batyrev's mirror construction is exactly toric polar duality.
- `calabi-yau-manifolds` — toric CYs (the quintic's ambient P^4 is toric).
- `enumerative-combinatorics` and `simplicial-complexes-combinatorial` (combinatorics
  section) — the algebra-combinatorics bridge.
- `moduli-spaces` — toric moduli (M_0,n, GIT quotients).

Toric varieties are also the standard worked example for everything from singular cubics
(toric resolutions) to GIT (`stacks` already mentions quotient stacks). Strong coverage in
PCM, Fulton's book is the canonical text, Cox–Little–Schenck is the modern textbook,
nLab and Wikipedia have rich entries. Adding it would visibly tighten the algebraic-geometry
+ combinatorics + mathematical-physics triangle.

### Honourable mention

*Iwasawa theory / p-adic L-functions* would be the third pick — it is the missing rung on
the ladder from class field theory to modular forms, and a single page covers a gap in
both number theory **and** modular forms simultaneously. Less visualisable than the top two
but high pedagogical leverage.

---

*Generated read-only on 2026-05-05. No concept-graph or HTML edits performed.*
