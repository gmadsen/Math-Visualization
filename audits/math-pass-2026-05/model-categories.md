# Math correctness audit — `model-categories.html`

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.
Format per section: **Verified · Wrong/dubious · Underspecified · Severity**.

---

## §1 Quillen's model category axioms (lines 230–343)

- **Verified.**
  - **M1–M5 statements** (lines 235–245): all five axioms in the standard Quillen (1967) form: completeness/cocompleteness, 2-of-3 on $W$, retract closure on $W,F,C$, two functorial factorizations through trivial-fib / trivial-cof, and the lifting calculus $C \boxslash F_W$, $C_W \boxslash F$. Wording matches Hovey's textbook.
  - **Over-determination remark** (line 247): "two of $\{W,C,F\}$ pin the structure down" — correct standard observation; specifically $C$ and $F$ each determine the other via the lifting calculus once $W$ is fixed (and $W$ is determined by $C$ and the trivial cofibrations, etc.).
  - **Homotopy category as $\mathcal{M}[W^{-1}]$ with $\Hom = \pi(QX, RY)$** (line 249): the small-Hom-set theorem of Quillen; correct standard formulation. The cylinder/path-object construction is alluded to but not detailed (no specific claim to verify).
  - **Lifting widget logic** (lines 264–325): the truth table "lift exists iff iTriv or pTriv" implements axiom M5 correctly. The three case strings (both trivial / iTriv only / pTriv only) correctly identify which lifting class ($C \boxslash F_W$ or $C_W \boxslash F$) applies.

- **Wrong/dubious.**
  - **Lifting-widget counterexample uses a non-cofibration** (line 319). The text claims $i = (S^1 \xrightarrow{z^2} S^1)$ is a cofibration in the Quillen model on $\mathbf{Top}$. It is **not**: Quillen cofibrations are retracts of relative cell complexes ($S^{n-1}\hookrightarrow D^n$), in particular closed inclusions. The double-cover $z^2$ is a continuous surjection (not even injective), hence not a Quillen cofibration in any of the standard model structures on $\mathbf{Top}$ (Quillen, Strom, mixed). This is also internally inconsistent with the §2 widget at line 408, which correctly classifies the same map "$z\mapsto z^2$" as $w=\text{false}, f=\text{false}, c=\text{false}$ (i.e. NOT a cofibration). The mathematical *conclusion* of the counterexample (no lift in the square) is correct; only the labeling of $z^2$ as a cofibration is wrong. A correct replacement using the same ingredients: $i = (S^1 \hookrightarrow D^2)$ (a genuine relative-cell cofibration, not a weak eq) and $p = (S^1 \to *)$ (Serre fib, not weak eq); top map $\mathrm{id}_{S^1}$, bottom map $D^2 \to *$; a lift $D^2\to S^1$ extending the identity would exhibit $S^1$ as a retract of $D^2$, contradicting $\pi_1$.

- **Underspecified.** None.

- **Severity. MEDIUM** — the readout's worked counterexample asserts an object is in a class it provably is not in, contradicting the page's own §2 classification of the same morphism. The high-level point (no lift when neither side is in $W$) is correct, but the specific witness is wrong.

---

## §2 Standard model structures (lines 345–489)

### Top (Quillen) — lines 350–359

- **Verified.**
  - $W = $ weak homotopy equivalences (iso on all $\pi_n$, all basepoints) — correct.
  - $F = $ Serre fibrations defined as RLP against $D^n \hookrightarrow D^n \times [0,1]$ — correct (this is the cube-inclusion characterization; using disks vs. cubes gives the same class since $D^n \cong I^n$).
  - $C = $ retracts of relative cell complexes built from $S^{n-1} \hookrightarrow D^n$ — correct.
  - "Compactly generated topological spaces" qualifier — standard convexity needed to make the model structure actually exist.

### sSet (Kan–Quillen) — lines 361–370

- **Verified.**
  - $W$ = pre-image under $|\cdot|$ of weak homotopy equivalences — correct.
  - $F$ = Kan fibrations = RLP against horns $\Lambda^n_k \hookrightarrow \Delta^n$ for all $0\le k\le n$ — correct (all horns, in contrast to Joyal's only-inner-horns).
  - $C$ = monomorphisms (levelwise injections) — correct.
  - Every simplicial set is cofibrant; fibrant ones are Kan complexes — correct.

### Ch_{≥0}(R) (projective) — lines 372–381

- **Verified.**
  - $W$ = quasi-isomorphisms — correct.
  - $F$ = surjections in every positive degree (degree 0 unconstrained) — correct standard formulation for the bounded-below projective structure.
  - $C$ = degreewise mono with degreewise projective cokernel — correct (equivalently, retracts of relative cell complexes built from $D^n \hookrightarrow D^n \oplus D^{n+1}$ or similar generating cofibrations).
  - Every complex is fibrant (terminal object is $0$, and any $X \to 0$ is degreewise surjective) — correct.
  - Cofibrant replacement of $M[0]$ is a projective resolution — correct.

### Worked-example widget (lines 396–484)

- **Verified.**
  - **Top examples:**
    - CW inclusion $S^1 \hookrightarrow D^2$: $w=$F, $f=$F, $c=$T — correct (relative cell complex hence cof; not a weak eq since $\pi_1$ differs; not a Serre fib since $S^1$ isn't a retract of $D^2$).
    - Path-space projection $PX \to X$: $w=$T, $f=$T, $c=$F — correct (Hurewicz hence Serre fib; weak eq since $PX$ contractible). The contractibility argument "path-connected and $\pi_n=0$" is loose phrasing but correct (the explicit homotopy $H_s(\gamma)(t) = \gamma(st)$ contracts $PX$ to constant paths).
    - $z^2: S^1\to S^1$: $w=$F, $f=$F, $c=$F — correct.
    - Identity: in all three classes — correct (every iso is a triv. fib + triv. cof = iso in any model structure).
  - **sSet examples:**
    - $\Lambda^2_1 \hookrightarrow \Delta^2$: mono ⇒ cof. $|\Lambda^2_1|$ is a wedge of two intervals at vertex 1, hence contractible; $|\Delta^2| = D^2$ contractible — both are weakly contractible, so the inclusion is a weak homotopy equivalence after realization, hence a Kan–Quillen weak eq. So this is a TRIVIAL cof. ✓ The pedagogically nice "horn-on-the-left, Kan-fib-on-the-right; same lifting test, just two sides of one square" is correct: $\{X \to *: \text{Kan fib}\} = \{X : \text{Kan complex}\}$ and Kan fibs are by definition the maps with RLP against all horns.
    - $\partial \Delta^2 \hookrightarrow \Delta^2$: mono ⇒ cof. $|\partial\Delta^2| = S^1$, $|\Delta^2| = D^2$; not a weak eq (different $\pi_1$). ✓
    - $\mathrm{Sing}(D^2) \to *$: $w=$T, $f=$T, $c=$F — correct ($\mathrm{Sing}(D^2)$ is a Kan complex of contractible space, the unique map to $*$ is a Kan fib and weak eq; not a mono since $\mathrm{Sing}(D^2)_n$ is large for every $n$ while $*_n = \{*\}$).
    - The aside "$\mathrm{Sing}(*) \cong * = \Delta^0$" — correct, since $\mathrm{Sing}(*)_n = \mathrm{Map}(|\Delta^n|, *) = \{*\}$.
  - **Ch(R) examples:**
    - Projective resolution $P_* \to \mathbb{Z}[0]$: $w=$T, $f=$T, $c=$F — correct (by the standard characterization of trivial fibs in the projective model, plus the quoted reason that the augmentation $P_0 \twoheadrightarrow \mathbb{Z}$ is generally not mono in degree 0).
    - $\mathbb{Z} \xrightarrow{\cdot 2} \mathbb{Z}$ in degree 0: $w=$F, $f=$T, $c=$F — verifiable: vacuously surjective in positive degrees ⇒ fib; not a quasi-iso ($H_0$ map is $\cdot 2$, not iso); cokernel $\mathbb{Z}/2$ not projective ⇒ not a cof. ✓ Minor phrasing issue: "$H_0$ changes from $\mathbb{Z}$ to $\mathbb{Z}/2$" is slightly off — both source and target have $H_0=\mathbb{Z}$; the *induced map* on $H_0$ is $\cdot 2$ with cokernel $\mathbb{Z}/2$. Reader-correctable.
    - Inclusion as direct summand $\mathbb{Z} \to \mathbb{Z} \oplus \mathbb{Z}$: $w=$F, $f=$T, $c=$T — correct (degreewise mono with cokernel $\mathbb{Z}$ projective; vacuously surjective in positive degrees; not a quasi-iso since $H_0$ grows).

- **Wrong/dubious.** None of substance in §2 prose or widget data. (See §1 for the cross-section inconsistency on $z^2$.)

- **Underspecified.**
  - The Top description doesn't address that the existence of the Quillen model on all of $\mathbf{Top}$ (vs. just compactly generated) requires additional care; the page restricts to compactly generated, which is the standard fix. Acceptable.
  - The Ch_{≥0}(R) "fibrations are surjective in every positive degree" silently uses bounded-below convention; the unbounded $\mathrm{Ch}(R)$ projective structure has a different fibration class (degreewise surjections + extra acyclicity on the kernel). Page says "Ch_{≥0}(R)" so the convention is fixed; OK.

- **Severity.** None blocking on §2.

---

## §3 Cofibrant and fibrant replacement (lines 491–628)

- **Verified.**
  - $\emptyset \xrightarrow{\text{cof}} QX \xrightarrow{\sim} X$ from M4 — correct.
  - $X \xrightarrow{\sim} RX \xrightarrow{\text{fib}} *$ from M4 — correct.
  - **Derived-functor recipe** $\mathbb{L}L(X) := L(QX)$, well-defined on $\Ho$ via Ken Brown's lemma — correct.
  - **Replacement table** (lines 509–517):
    - Top: cofibrant replacement = CW-approximation ✓
    - sSet: every $K$ already cofibrant ✓
    - $\mathrm{Ch}_{\ge 0}(R)$ projective: cofibrant replacement of $M[0]$ = projective resolution ✓
    - $\mathrm{Ch}_{\ge 0}(R)$ injective: $M[0]$ already cofibrant; fibrant replacement = injective resolution ✓
  - **Resolution widget data:**
    - $\mathbb{Z}/2$ over $\mathbb{Z}$: $0 \to \mathbb{Z} \xrightarrow{\cdot 2} \mathbb{Z} \to \mathbb{Z}/2 \to 0$, $\mathrm{pd}_\mathbb{Z}(\mathbb{Z}/2) = 1$ ✓
    - $\mathbb{Z}/6 = \mathbb{Z}/2 \oplus \mathbb{Z}/3$ (CRT) ✓; resolution $0 \to \mathbb{Z} \xrightarrow{\cdot 6} \mathbb{Z} \to \mathbb{Z}/6 \to 0$ ✓; $\mathrm{pd}_\mathbb{Z}(\mathbb{Z}/6) = 1$ ✓
    - $\mathbb{Q}$ over $\mathbb{Z}$: NOT projective (no surjection $\mathbb{Z}^n \twoheadrightarrow \mathbb{Q}$ has a section since $\mathbb{Q}$ is divisible, $\mathbb{Z}^n$ isn't); $\mathrm{pd}_\mathbb{Z}(\mathbb{Q}) = 1$ since $\mathbb{Z}$ is a PID; standard rank-$\aleph_0$ free resolution exists ✓.
    - "Over a PID every module has projective dimension at most 1" — correct.
    - "Genuinely infinite resolution requires non-PID, e.g. $k[x,y]/(xy)$ or $\mathbb{Z}[x]$" ✓.

- **Wrong/dubious.** None.

- **Underspecified.**
  - The widget label `mode === 'q'` differential reads "surj" rather than computing the actual map — pedagogical simplification, not an error.
  - "P_n (deg n+1)" labeling in the SVG output (line 597) — misnumbering: $P_n$ sits in chain-degree $n$, not $n+1$. The widget's text label "(deg n+1)" is off by one. Minor display bug; doesn't affect any mathematical claim in the prose.

- **Severity. LOW** — degree-labeling off-by-one in the SVG is the only flaw and doesn't propagate to a wrong claim.

---

## §4 Quillen functors and Quillen equivalences (lines 630–773)

- **Verified.**
  - **Quillen pair definition** (line 633): $L$ preserves cofs and trivial cofs ⇔ $R$ preserves fibs and trivial fibs — the equivalence follows from adjunction-based correspondence of lifts. ✓
  - **Total derived functors** $\mathbb{L}L(X) = L(QX)$, $\mathbb{R}R(Y) = R(RY)$ — correct.
  - **Ken Brown's lemma**: a left Quillen functor preserves weak equivalences between cofibrant objects — correct standard statement.
  - **Quillen-equivalence definition** (line 641): for cofibrant $X$ and fibrant $Y$, $LX \to Y$ is a weak eq iff $X \to RY$ is — correct standard equivalent definition.
  - **Geometric realization adjunction** (line 645): $|\cdot|: \mathbf{sSet}\rightleftarrows\mathbf{Top}: \mathrm{Sing}$ — correct.
  - **Unit / counit weak equivalences:**
    - $K \to \mathrm{Sing}|K|$ a weak eq for any $K$ ✓ (unit of the Quillen equiv at a cofibrant object — every $K$ is cofibrant in sSet, $\mathrm{Sing}|K|$ is fibrant since $|K|$ is a topological space, and Quillen equivalence delivers the unit weak-eq).
    - $|\mathrm{Sing}\,X| \to X$ is a weak homotopy eq, generally not a homeomorphism ✓.
  - **Tensor–Hom on Ch(R)**: $-\otimes_R N \dashv \Hom_R(N,-)$ derives to $\mathrm{Tor}^R$ on the left, $\Ext^*_R$ on the right ✓ (with the standard caveat that $N$ should be cofibrant or the bimodule conditions made precise).
  - **Constant–colimit Quillen pair**: $\Delta \dashv \mathrm{colim}: \mathcal{M} \rightleftarrows \mathcal{M}^I$ derives to $\mathrm{hocolim}_I = \mathbb{L}\,\mathrm{colim}$ ✓ (standard Bousfield–Kan recipe; requires the diagram-category model structure).
  - **Quillen-functor widget cases** (lines 675–712):
    - $\Delta^2$: $|\Delta^2| = D^2$ ✓; $\mathrm{Sing}(D^2)$ contractible Kan complex ✓; unit $\Delta^2 \to \mathrm{Sing}(D^2)$ a weak eq, not injective ✓.
    - $S^1$: $\mathrm{Sing}(S^1)$ Kan complex with countably-many simplices per level ✓; counit $|\mathrm{Sing}(S^1)| \to S^1$ a weak homotopy eq, not a homeomorphism ✓.
    - $*$: $\mathrm{Sing}(*) = \Delta^0$ ✓; $|\mathrm{Sing}(*)| = |\Delta^0| = *$ ✓; unit and counit reduce to identity ✓.
    - $\Delta^0$: $|\Delta^0| = *$ ✓; $\mathrm{Sing}(*) = \Delta^0$ ✓.

- **Wrong/dubious.** None.

- **Underspecified.**
  - "$\Delta \dashv \mathrm{colim}$" needs a model structure on $\mathcal{M}^I$ for which $\mathrm{colim}$ is left Quillen; the page doesn't specify whether projective or injective. For `$\mathrm{colim}$` left Quillen one wants the projective model on $\mathcal{M}^I$. Standard textbook elision.
  - Tensor–Hom adjunction implicitly assumes some flatness/projectivity on $N$ for the pair to actually be Quillen. Standard introductory shorthand.

- **Severity.** None.

---

## §5 Monoidal model categories and pushout-product (lines 775–895)

- **Verified.**
  - **Pushout-product square** (lines 782–786): the four corners $A\otimes C, A\otimes D, B\otimes C$, and the pushout $A\otimes D \sqcup_{A\otimes C} B\otimes C$ — correct.
  - **Pushout-product map** $i\Box j: A\otimes D \sqcup_{A\otimes C} B\otimes C \to B\otimes D$ — correct standard definition.
  - **Axiom statement**: $i\Box j$ is a cofibration, trivial when either $i$ or $j$ is — correct.
  - **Unit axiom** (line 792): mentioned in passing; standard supplementary requirement for monoidal model categories (cofibrant replacement of $\mathbb{1}$ tensored with cofibrants gives weak equivalences). Not elaborated, but stated correctly.
  - **Examples** (lines 796–800):
    - $\mathbf{Top}$ (cartesian, compactly generated): pushout-product of relative cell complexes is again relative cell complex ✓
    - $\mathbf{sSet}$ (cartesian): pushout-product of monos is mono ✓
    - $\mathrm{Ch}(R)$ for $R$ commutative: pushout-product preserves degreewise-projective cofibrations ✓
  - **Schwede–Shipley monoid axiom** (line 802): "lifts the model structure to monoid objects: $E_\infty$-rings, structured ring spectra, simplicial monoids, and dgas all arise as monoids" — correct standard application of the transferred model structure on monoids in a monoidal model category.
  - **Pushout-product widget arithmetic:**
    - For $i: \partial\Delta^m \hookrightarrow \Delta^m$ and $j: \partial\Delta^n \hookrightarrow \Delta^n$, the pushout-product is (after geometric realization) the boundary inclusion $S^{m+n-1} \hookrightarrow D^{m+n}$, attaching a single $(m+n)$-cell — correct topologically.
    - **Sanity check at $m=n=1$**: $\partial\Delta^1 \hookrightarrow \Delta^1$ pushout-product itself realizes to $\partial(I\times I) \hookrightarrow I\times I$, i.e. $S^1 \hookrightarrow D^2$ (dim 2 = 1+1) ✓.

- **Wrong/dubious.** None.

- **Underspecified.**
  - The widget says "Corner is a cofibration of dim $m+n$ (cell of dimension $m+n$)" — true after geometric realization, but in $\mathbf{sSet}$ itself the pushout-product of two boundary inclusions is NOT a single boundary inclusion (it's a more elaborate sub-simplicial set). The "attaches one cell" framing is faithful only at the level of $|-|$. Pedagogical compression, not a math error.
  - "$\emptyset \hookrightarrow D^n$ is a cof but NOT trivial (target contractible $\ne \emptyset$, so not a weak eq)" (line 876) — correct: $\emptyset \to D^n$ is not a weak eq because the source has empty $\pi_0$ while the target has $\pi_0 = *$.

- **Severity.** None.

---

## §6 From model categories to ∞-categories (lines 897–1034)

- **Verified.**
  - **$\mathcal{M}_\infty := N_\Delta(\mathcal{M}^{cf})$** — correct standard definition for a simplicial model category.
  - **Both $X, Y$ cof–fib ⇒ $\mathrm{Map}_\mathcal{M}(X,Y)$ is a Kan complex** — correct standard fact (this is exactly the property the simplicial model axioms guarantee).
  - **Simplicial nerve $N_\Delta$**: produces a quasi-category from a Kan-complex-enriched category — correct (Lurie HTT 1.1.5).
  - **Quillen equivalences induce $(\infty,1)$-equivalences** ✓ standard.
  - **Dugger's theorem** (line 917): every presentable $(\infty,1)$-category arises as $\mathcal{M}_\infty$ for some combinatorial simplicial model category — correct (Dugger 2001 + Lurie's combination of "combinatorial" with simplicial enrichment via the Dugger replacement procedure).
  - **Combinatorial = locally presentable + cofibrantly generated** ✓ standard definition.
  - **SM7 / pushout-product axiom for the simplicial action** ✓ standard simplicial-model compatibility axiom.
  - **$h(\mathcal{M}_\infty) = \Ho(\mathcal{M})$**: the homotopy 1-category of the underlying $(\infty,1)$-category equals the classical model-category homotopy category — correct.
  - **Nerve-widget per-level descriptions** (lines 942–1023):
    - 0-simplices = cof–fib objects ✓
    - 1-simplices = maps in $\mathcal{M}$ (= 0-simplices of $\mathrm{Map}(X,Y)$) ✓
    - 2-simplices = composable triples + a homotopy filling ✓ (correctly framed as "encoded as a 1-simplex of $\mathrm{Map}(X,Y)$ connecting $h$ to $g\circ f$" — this is the precise simplicial-nerve cell structure)
    - 3-simplices = higher coherence / homotopy between homotopies ✓.

- **Wrong/dubious.** None.

- **Underspecified.**
  - Calling it the "homotopy coherent nerve" in some references vs. "simplicial nerve" / "Cordier nerve" / "$N_\Delta$" — page uses $N_\Delta$, which is unambiguous.
  - Dugger's original theorem produces a Quillen-equivalent simplicial replacement; the page conflates the two-step "combinatorial $\Rightarrow$ Quillen-equivalent to simplicial combinatorial" into one statement. Standard textbook compression.

- **Severity.** None.

---

## Quiz bank (`quizzes/model-categories.json`)

### `mc-axioms`

- **Q1** (lifting axiom MCQ, lines 7–19): correct statement of M5 ($C \perp F_W$ and $C_W \perp F$). Distractor analysis correct.
- **Q2** (multi-select on 2-of-3, lines 20–37): answer marks (0,1,2,3) correct, (4) false.
  - **Wrong/dubious in the explain string**: "(4) is false in general: arbitrary direct sums of weak equivalences need not be weak equivalences (consider $\mathrm{Ch}(R)$ where filtered colimits but not all coproducts preserve quasi-isos)." This is **backwards**. In $\mathrm{Ch}(R)$, both arbitrary direct sums AND filtered colimits of quasi-isomorphisms ARE quasi-isomorphisms (since homology commutes with both in a Grothendieck abelian category). The correct reading: (4) fails *in general model categories* because no axiom enforces it; but the cited counterexample-domain $\mathrm{Ch}(R)$ actually satisfies the property. A cleaner counterexample-source: pick a model category where transfinite composites or arbitrary coproducts of weak equivalences fail to be weak equivalences (e.g., certain non-cofibrantly-generated structures), or note that (4) is simply not implied by 2-of-3 alone.
  - The graded answer (mark (4) as false) is acceptable since (4) is genuinely not a consequence of 2-of-3, but the rationale in `explain` is misleading.
- **Q3** (matching M1–M5 to properties, lines 40–65): all five pairings correct.

### `mc-examples`

- **Q1** (cofs in sSet, lines 73–83): "monomorphisms" — correct.
- **Q2** (matching weak eqs by model structure, lines 85–106):
  - Quillen on Top → weak homotopy eqs ✓
  - Kan–Quillen on sSet → "induces iso on $\pi_n$ of $|X|$" ✓
  - Projective on Ch(R) → quasi-isos ✓
  - Joyal on sSet → categorical equivs of quasi-cats ✓
- **Q3** (multi-select on projective Ch(R) fibrations, lines 109–124): answer marks (0,1,2) correct, (3) false.
  - **Wrong/dubious**: option (1) marked correct: "Trivial fibrations are exactly the surjective quasi-isomorphisms whose **kernel is degreewise projective**." The "degreewise projective kernel" qualifier is **not** a true general characterization. Trivial fibrations in projective $\mathrm{Ch}_{\ge 0}(R)$ are exactly the levelwise-surjective quasi-isos; the kernel is acyclic, but need not be degreewise projective.
    - Concrete counterexample: $R = \mathbb{Z}/4$, take a projective resolution $P_\bullet \twoheadrightarrow \mathbb{Z}/2$ over $\mathbb{Z}/4$ with $P_0 = \mathbb{Z}/4$. The augmentation $p: P_\bullet \to \mathbb{Z}/2[0]$ is a trivial fibration. But $\ker(p)_0 = \ker(\mathbb{Z}/4 \to \mathbb{Z}/2) = 2\mathbb{Z}/4 \cong \mathbb{Z}/2$, which is NOT projective over $\mathbb{Z}/4$.
    - The kernel-projective characterization holds when both source AND target are cofibrant (since then $X \to Y$ splits as graded modules and the kernel is a cofibrant complex), but that's a more restrictive setting than "trivial fibration" in general.
  - (0), (2) are correctly marked, (3) correctly marked false (projective and injective structures share $W$ but swap $C$ and $F$; their fibrations are different).

### `mc-cofibrant-replacement`

- **Q1** (cofibrant replacement = projective resolution, lines 131–141): correct.
- **Q2** (ordering of Ext computation, lines 144–159): answer order (3,2,0,1) correct.
- **Q3** (multi-select on well-definedness, lines 162–176): (1,2,3) marked correct, (0) false.
  - All four assessments correct: $QX$ unique up to homotopy (1) ✓; canonically iso in $\Ho$ (2) ✓; the localization is an equivalence (3) ✓; but NOT unique up to literal isomorphism in $\mathcal{M}$ (0) ✓.

### `mc-quillen-functors`

- **Q1** (Quillen pair definition, lines 184–194): correct (option 1).
- **Q2** (multi-select on $|\cdot| \dashv \mathrm{Sing}$, lines 197–211): (0,1,2) correct, (3) false (counit is weak eq, not homeomorphism). All correct.
- **Q3** (matching Quillen pairs to derived functors, lines 214–235): all four pairings correct.

### `mc-monoidal`

- **Q1** (pushout-product axiom statement, lines 243–253): correct (option 1).
- **Q2** (multi-select on monoidal model categories, lines 256–271): all four marked correct.
  - (0) Top with cartesian product is monoidal model ✓
  - (1) sSet pushout-product axiom ✓
  - (2) Ch(R) projective for commutative R ✓
  - (3) Schwede–Shipley monoid model structure ✓ (with the standard "monoid axiom" technical hypothesis, satisfied in the named examples)
- **Q3** (ordering of $\otimes^\mathbb{L}$ derivation, lines 274–289): order (2,0,1,3) correct.

### `mc-bridge-infinity`

- **Q1** ($N_\Delta(\mathcal{M}^{cf})$ as the simplicial nerve, lines 297–307): correct (option 1; Lurie HTT 1.3.4.20 reference is standard).
- **Q2** (multi-select on the dictionary, lines 310–324): (0,1,2) correct, (3) false.
  - (3) "$\infty$-limits/colimits require model categories to define" — correctly marked false; intrinsic $\infty$-categorical limits are defined via terminal/initial objects in slice quasi-categories, model-independent. Lurie HTT goes the model-free route deliberately. ✓
- **Q3** (matching constructions, lines 327–348): all four pairings correct.

---

## Summary of severity-ranked findings

| # | Section | Issue | Severity |
|---|---|---|---|
| 1 | §1 lifting widget readout (line 319) | Counterexample claims $z^2: S^1\to S^1$ is a Quillen cofibration in $\mathbf{Top}$. It is not (it's not even injective; cofibrations are retracts of relative cell complexes). The widget directly contradicts the §2 example widget (line 408) which correctly classifies the same map as $c=$F. The high-level conclusion (no lift in the square) is correct; the witness chosen is wrong. A correct replacement: $S^1 \hookrightarrow D^2$ (cof, not weak eq) and $S^1 \to *$ (Serre fib, not weak eq), top map identity, bottom map constant. | **Medium** |
| 2 | Quiz `mc-examples` Q3 (line 117) | Option (1) marks "trivial fibrations are exactly the surjective quasi-isos whose kernel is **degreewise projective**" as correct. The "degreewise projective kernel" qualifier is false in general (counterexample: projective resolution of $\mathbb{Z}/2$ over $\mathbb{Z}/4$ gives a trivial fib whose degree-0 kernel is $\mathbb{Z}/2$, not projective over $\mathbb{Z}/4$). The actual characterization is just "levelwise-surjective quasi-iso." The kernel is acyclic but not necessarily degreewise projective unless source and target are both cofibrant. | **Medium** |
| 3 | Quiz `mc-axioms` Q2 explain (line 37) | Justification for why "arbitrary direct sums of weak eqs are weak eqs" can fail cites $\mathrm{Ch}(R)$ as a counterexample-source. But $\mathrm{Ch}(R)$ for $R$ a ring (so $R$-Mod is Grothendieck abelian) DOES satisfy: arbitrary coproducts and filtered colimits of quasi-isos are quasi-isos. The grading of (4) as false is defensible (no axiom delivers it), but the cited example is wrong. | **Low** (only the explanation string is wrong; the answer key is fine) |
| 4 | §3 cofibrant-replacement widget (line 597) | SVG label reads "$P_n$ (deg $n+1$)" — off by one; $P_n$ is in chain degree $n$. Cosmetic. | **Low** |
| 5 | §2 Ch(R) "mult" example wording (line 419) | Says "NOT a quasi-iso ($H_0$ changes from $\mathbb{Z}$ to $\mathbb{Z}/2$)." Both source and target have $H_0 = \mathbb{Z}$; what is $\mathbb{Z}/2$ is the cokernel of the induced map $H_0 \xrightarrow{\cdot 2} H_0$. Slight phrasing imprecision, conclusion correct. | **Low** (cosmetic) |

Mathematical claims in prose (Quillen's M1–M5 axioms; Top/sSet/Ch(R) model structures and their classes; Serre and Kan fibration definitions; CW-approximation and projective-resolution as cofibrant replacements; Ken Brown's lemma; Quillen-pair, total-derived-functor, and Quillen-equivalence definitions; geometric realization adjunction and its unit/counit weak-equivalence properties; pushout-product axiom and its standard examples; Schwede–Shipley monoid axiom; Dugger's theorem; the simplicial-nerve-of-cof-fib construction $\mathcal{M}_\infty = N_\Delta(\mathcal{M}^{cf})$; the homotopy-1-category identification $h(\mathcal{M}_\infty) = \Ho(\mathcal{M})$) are all correctly stated. Worked computations in the resolution widget ($\mathrm{pd}_\mathbb{Z}(\mathbb{Z}/2) = \mathrm{pd}_\mathbb{Z}(\mathbb{Z}/6) = \mathrm{pd}_\mathbb{Z}(\mathbb{Q}) = 1$, the explicit short exact sequences) are correct. The classification widget's verdict tags ($w, f, c$ flags) are correct for every example listed. The pushout-product widget's $(m,n) \mapsto (m+n)$-cell-attachment story is correct after geometric realization.
