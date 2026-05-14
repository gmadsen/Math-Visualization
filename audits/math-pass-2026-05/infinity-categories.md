# infinity-categories — math correctness audit (2026-05)

**Section:** Higher categories & toposes

## Verified claims

### Quasi-categories (§1)

- **Quasi-category definition** (line 275): a simplicial set in which every inner horn $\Lambda^n_k \to \mathcal{C}$ ($0 < k < n$) admits a filler $\Delta^n \to \mathcal{C}$; equivalently fibrant in the Joyal model structure on $\mathbf{sSet}$. Correct.
- **Joyal nerve theorem** (line 281): if every inner horn admits a *unique* filler, $\mathcal{C} \cong N(C)$ for a unique ordinary category $C$. Correct (one of the standard characterizations of the essential image of $N$).
- **2-simplex composition data** (lines 277–280): $\sigma:\Delta^2\to\mathcal{C}$ with $\partial_2\sigma=f$, $\partial_0\sigma=g$, $\partial_1\sigma=h$ witnesses $h\simeq g\circ f$; the inner-horn filler for $\Lambda^2_1$ provides the (non-unique) composite $g\circ f$. Correct standard convention.
- **Kan complex characterization** (line 281): every horn fills (inner and outer) ⇔ Kan complex ⇔ ∞-groupoid ⇔ every 1-simplex is an equivalence. Correct.
- **Maximal sub-Kan-complex $\mathcal{C}^\simeq$** (line 281): the equivalences of $\mathcal{C}$ form the largest sub-Kan-complex. Correct (HTT 1.2.5.3).
- **$N(\mathrm{Ch}(\mathcal{A}))[\mathrm{qis}^{-1}]$** (line 283) as a quasi-category whose 1-simplices are zigzags is correct (Dwyer–Kan localization passed through nerves; the underlying ∞-category of the model category $\mathrm{Ch}(\mathcal{A})$).
- **Step 5 (line 342)**: equivalences ↔ outer-horn filling at $f$ is morally correct: $f:x\to y$ is an equivalence iff its image in $h(\mathcal{C})$ is an iso, iff suitable outer horns containing $f$ in the appropriate face fill. (The terse phrasing "filling $\Lambda^2_0$ at $f$" is an informal but standard pointer.)
- **Step 6 — Joyal lift theorem** (line 347): $\mathcal{C}$ is a quasi-category iff $\mathcal{C}^{\Delta^n}\to\mathcal{C}^{\Lambda^n_k}$ is a trivial Kan fibration for $0<k<n$. Correct (this strengthens the bare definition via inner anodyne ⇒ trivial cofibration).
- **Step 6 — mapping spaces are Kan complexes** (line 348): correct (HTT 1.2.2.3).

### Homotopy category (§2)

- **Composition in $h(\mathcal{C})$ via $\Lambda^2_1$ fillers** (line 362): well-defined because two fillers differ by a homotopy (specifically, by a $\Lambda^3_2$-fillable 3-simplex). Correct.
- **$h \dashv N$ adjunction** (line 364): $h\colon\mathbf{QCat}\to\mathbf{Cat}$ is left adjoint to the nerve, with $\Hom_{\mathbf{Cat}}(h(\mathcal{C}),D)\cong\Hom_{\mathbf{sSet}}(\mathcal{C},N(D))$. Correct.
- **Counit on ordinary categories is an iso** (widget Step 5, line 465): "counit at $C\in\mathbf{Cat}$: $hN(C)\cong C$." Correct (the nerve is fully faithful, so its counit is iso).
- **$h(\mathcal{C})$ collapses mapping space to $\pi_0$** (line 366, widget Step 6): the homotopy category retains exactly $\pi_0\,\mathrm{Map}_\mathcal{C}(x,y)$. Correct.
- **Equivalence criterion** (line 368): $F$ is an equivalence iff $h(F)$ is an equivalence of 1-categories AND $F$ induces equivalences on mapping spaces. Correct (the standard "$F$ fully faithful + essentially surjective" criterion in the ∞-categorical sense).
- **Widget Step 2 — homotopy via $\partial_2\sigma=f, \partial_0\sigma=\mathrm{id}_y, \partial_1\sigma=g$** (line 449, also widget at line 391, 411): correct standard convention.
- **Widget Step 3 — symmetry via $\Lambda^3_2$, transitivity via $\Lambda^3_1$** (line 454): correct (this is exactly Joyal's argument that $\simeq$ is an equivalence relation; cf. Lurie HTT 1.2.4 / Kerodon §1.4.4).
- **Reflexivity via $s_0(f)$ or $s_1(f)$** (line 413, widget Step 3 line 455): correct — the degenerate 2-simplex $s_1(f)$ has $\partial_2=f, \partial_0=s_0(\partial_0 f)=\mathrm{id}_y, \partial_1=f$.
- **Widget Step 4** (line 459): composition well-defined via $\Lambda^3_2$-filler comparing two $\Lambda^2_1$-fillers. Correct.
- **Widget Step 5 — associativity uses $\Lambda^4_1, \Lambda^4_2$** (line 464): correct (associator coherence is encoded by inner 3-horns, but unit/associativity at the level of the homotopy category needs 4-horn fillers to identify the two parenthesizations up to homotopy).

### ∞-functors and natural transformations (§3)

- **∞-functor = map of simplicial sets** (line 491): $F_n\colon\mathcal{C}_n\to\mathcal{D}_n$ commuting with face/degeneracy maps. Correct — the simplicial-set machinery encodes coherence at every level.
- **Compositor as image of a 2-simplex** (line 491): $F_2$ sends a 2-simplex witnessing $h\simeq g\circ f$ to one witnessing $F(h)\simeq F(g)\circ F(f)$. Correct.
- **Functor ∞-category $\mathrm{Fun}(\mathcal{C},\mathcal{D})=\mathcal{D}^\mathcal{C}$ is a quasi-category** (line 495): correct via Joyal's lifting theorem — the inner-horn lift extends to internal hom because inner anodyne maps are stable under pushout-product with monomorphisms.
- **1-simplices in $\mathrm{Fun}(\mathcal{C},\mathcal{D})$ = natural transformations** (line 495): correct (a 1-simplex of $\mathcal{D}^\mathcal{C}$ is exactly a map $\mathcal{C}\times\Delta^1\to\mathcal{D}$).
- **∞-Yoneda embedding $y\colon\mathcal{C}\to\mathcal{P}(\mathcal{C})=\mathrm{Fun}(\mathcal{C}^{\mathrm{op}},\mathcal{S})$, $y(x)=\mathrm{Map}_\mathcal{C}(-,x)$** (line 497) is fully faithful: $\mathrm{Map}_{\mathcal{P}(\mathcal{C})}(y(x),y(y))\simeq\mathrm{Map}_\mathcal{C}(x,y)$ (HTT 5.1.3). Correct.
- **$\mathcal{P}(\mathcal{C})$ = free cocompletion** (line 497): correct (HTT 5.1.5.6, also restated in the §6 hard quiz).
- **Widget readouts** (lines 528–531): on $n=0,1,2$-simplices the action of $F$ is correctly described as $F_0,F_1,F_2$ with $F_2$ supplying the chosen compositor.

### ∞-(co)limits (§4)

- **Slice $\mathcal{C}_{/p}$ and limit = terminal object** (line 568): correct (HTT 1.2.13.4); cones are 0-simplices of the slice, the limit is its terminal object.
- **Terminal objects unique up to a contractible space** (line 568): correct — the full subcategory of terminal objects is a contractible Kan complex when nonempty.
- **Concrete formulas in $\mathcal{S}$** (lines 574–578):
  - **∞-product** = strict cartesian product of Kan complexes. Correct (no fibrant replacement needed since both factors are already fibrant and product preserves fibrancy).
  - **∞-pullback** $X\times^h_Z Y\simeq\{(x,\gamma,y):\gamma\colon p(x)\rightsquigarrow q(y)\}$. Correct (mapping cocylinder model of homotopy pullback).
  - **∞-equalizer** = $\{x : f(x)\rightsquigarrow g(x)\}$ as homotopy fibre of $(f,g)\colon X\to Y\times Y$ over $\Delta_Y$. Correct (the "fibre of the difference" phrasing is loose since spaces have no subtraction, but the description is accurate).
  - **Geometric realization** $|X_\bullet|=\mathrm{colim}_{[n]\in\Delta^{\mathrm{op}}}X_n$ in $\mathcal{S}$. Correct.
- **Cocompleteness via small simplicial-set indexing** (line 580): correct — ∞-categorical cocompleteness must use ∞-categorical indexing shapes, not just 1-categorical ones, because higher-dimensional coherence has to be matched.
- **Presentability ⇒ cocomplete + adjoint functor theorem** (line 580): correct (Lurie HTT 5.5).
- **Widget cones (line 633–635)**:
  - $L$ = homotopy pullback as the ∞-limit, with maps from any cone factoring through $L$ uniquely up to a contractible space. Correct.
  - The strict pullback $A=\{(x,y):p(x)=q(y)\}$ is generally not the ∞-limit in $\mathcal{S}$. Correct.

### ∞-adjunctions (§5)

- **Mapping-space formulation** (line 673): natural equivalence $\mathrm{Map}_\mathcal{D}(f(c),d)\simeq\mathrm{Map}_\mathcal{C}(c,g(d))$ of Kan complexes. Correct standard definition (HTT 5.2.2.8).
- **Triangle identities up to homotopy** (line 672): $\eta:\mathrm{id}_\mathcal{C}\to gf$, $\varepsilon:fg\to\mathrm{id}_\mathcal{D}$ as 1-simplices in functor ∞-categories, with chosen 2-simplices witnessing $\varepsilon f\cdot f\eta\simeq\mathrm{id}_f$ and $g\varepsilon\cdot\eta g\simeq\mathrm{id}_g$. Correct.
- **Bifibration formulation** (line 675): an adjunction = a single fibration $p\colon\mathcal{M}\to\Delta^1$ which is both cocartesian and cartesian, with cocartesian transport giving $f$ and cartesian transport giving $g$. Correct (HTT 5.2 — this is Lurie's preferred packaging).
- **Quillen adjunctions derive to ∞-adjunctions** (line 677): correct.
- **∞-adjoint functor theorem** (line 679): $g\colon\mathcal{D}\to\mathcal{C}$ between presentable ∞-categories has a left adjoint iff it preserves small limits and is accessible (HTT 5.5.2.9). Correct. (The dual statement at line 679 — right adjoint iff preserves small colimits — is correct in the presentable setting where accessibility is automatic for colimit-preserving functors.)
- **Widget readouts for whiskered units/counits** (lines 729–741): the directions and compositions are all correct: $f\eta\colon f\to fgf$, $\varepsilon f\colon fgf\to f$ etc. (See "Wrong / dubious" below for the SVG vertex-labeling issue.)

### ∞-Kan extensions (§6)

- **Universal property** (line 776): $\mathrm{Map}(\mathrm{Lan}_i F, G)\xrightarrow\sim\mathrm{Map}(F, G\circ i)$ (so $\mathrm{Lan}_i\dashv i^*$ on $\mathrm{Fun}(-,\mathcal{E})$). Correct.
- **Pointwise formula** (line 779): $(\mathrm{Lan}_i F)(d)\simeq\mathrm{colim}_{(c,\alpha)\in\mathcal{C}\times_\mathcal{D}\mathcal{D}_{/d}} F(c)$ when $\mathcal{E}$ has the requisite colimits (Lurie HTT 4.3.2.15). Correct.
- **Special cases** (lines 785–787):
  - Free cocompletion via Yoneda — correct.
  - Derived functors as Kan extensions along localizations — correct.
  - $\mathrm{Ind}(\mathcal{C})\subset\mathcal{P}(\mathcal{C})$ as filtered-colimit closure — correct.
- **Widget Step 6 — universal property restated** (line 831): correct.

### Quiz claims (cross-checked against the prose)

- **v1 quiz quasi-category Q1** (line 9): nerves, $\Delta^n=N([n])$, and Kan complexes are quasi-categories; arbitrary simplicial sets are not. Correct.
- **v1 quiz quasi-category Q2** (line 22): Joyal's existence (not uniqueness) of inner-horn fillers. Correct.
- **v1 quiz quasi-category Q3** (line 34): the boundary configuration of the homotopy-witnessing 2-simplex. Correct.
- **Hard quiz quasi-category Q1** (line 49): all-horns-fill ⇔ Kan complex ⇔ ∞-groupoid ⇔ homotopy type by the homotopy hypothesis. Correct.
- **v1 quiz homotopy-category Q1** (line 80): $h(N(C))\cong C$ via the counit of $h\dashv N$. Correct.
- **v1 quiz homotopy-category Q2** (line 93): $[f]=[g]$ in $h(\mathcal{C})$ iff a witnessing 2-simplex exists. Correct.
- **v1 quiz homotopy-category Q3** (line 106): higher $\pi_k$-data ($k\ge1$) is what's lost; objects, $\pi_0$ of mapping spaces, and composition are kept. Correct.
- **v1 quiz infty-functors Q1** (line 124): ∞-functor = map of simplicial sets. Correct.
- **v1 quiz infty-functors Q2** (line 137): equivalence criterion = $h(F)$ equivalence + mapping-space equivalences. Correct (matches the prose at line 368).
- **v1 quiz infty-functors Q3** (line 150): $\mathrm{Fun}(N(C),\mathcal{S})$ ≃ homotopy-coherent diagrams of spaces (HTT 4.2). Correct.
- **v1 quiz infty-limits Q1** (line 168): ∞-product in $\mathcal{S}$ = strict cartesian product of Kan complexes. Correct.
- **v1 quiz infty-limits Q2** (line 181): pullbacks and equalizers gain homotopy data; products and discrete-shape limits don't. Correct.
- **v1 quiz infty-limits Q3** (line 194): cocompleteness uses arbitrary small simplicial-set indexing shapes. Correct.
- **Hard quiz infty-limits Q1** (line 209): if $Y\to Z$ is a Kan fibration the strict pullback computes the homotopy pullback. Correct (the standard "fibration" criterion for homotopy invariance of pullbacks; cf. Quillen / HTT A.2.4).
- **Hard quiz infty-limits Q2** (line 222): presentable ⇒ complete + cocomplete + adjoint functor theorem. Correct.
- **v1 quiz infty-adjunctions Q1** (line 240): an ordinary adjunction passes to the nerve as an ∞-adjunction. Correct.
- **v1 quiz infty-adjunctions Q2** (line 253): triangle identities encoded as 2-simplex + higher coherences. Correct.
- **v1 quiz infty-adjunctions Q3** (line 266): adjoint functor theorem — left adjoint exists iff preserves limits and is accessible. Correct.
- **v1 quiz kan-extension Q1** (line 284): Lan exists (pointwise) when $\mathcal{E}$ has colimits of shape $\mathcal{C}/_d$. Correct.
- **v1 quiz kan-extension Q2 (matching)** (line 297): Lan↔$\mathcal{C}\times_\mathcal{D}\mathcal{D}_{/d}$ colimit, Ran↔$\mathcal{D}_{d/}$ limit, free cocompletion = $\mathcal{P}(\mathcal{C})$, Ind = filtered-colimit closure of $y(\mathcal{C})$. All four pairings correct.
- **v1 quiz kan-extension Q3** (line 316): ∞-categorical colimits over ∞-categorical shapes are automatically homotopy colimits. Correct.
- **Hard quiz kan-extension Q1** (line 331): when $i$ is fully faithful, the unit $\eta\colon F\to(\mathrm{Lan}_i F)\circ i$ is an equivalence (HTT 4.3.2.15: $(c,\mathrm{id}_{i(c)})$ is final in $\mathcal{C}/_{i(c)}$, so the colimit collapses to $F(c)$). Correct — this is a textbook fact and the quiz answer/explanation is accurate.
- **Hard quiz kan-extension Q2** (line 343): universal property of $\mathcal{P}(\mathcal{C})$ — colimit-preserving functors out of $\mathcal{P}(\mathcal{C})$ are equivalent to functors out of $\mathcal{C}$ (HTT 5.1.5.6). Correct.

## Wrong / dubious claims

- **§2 line 360 — boundary-data typo for the homotopy-witnessing 2-simplex.** The prose says "$\partial_0\sigma=g$, $\partial_1\sigma=g$, $\partial_2\sigma=f$" — this is incoherent (the $\partial_0$-edge of $\Delta^2$ goes from vertex 1 to vertex 2, so writing $\partial_0\sigma=g$ when $g\colon x\to y$ would force vertex 1 of $\sigma$ to map to $x$, but then $\partial_2\sigma=f\colon x\to y$ requires vertex 1 to map to $y$). The intended (and correct) statement, as used throughout the widget at lines 391, 411, 449, is "$\partial_0\sigma=\mathrm{id}_y$, $\partial_1\sigma=g$, $\partial_2\sigma=f$." The first "$=g$" should be "$=\mathrm{id}_y$."

- **§2 line 364 — "unit map $C\to h(N(C))$" terminology and arrow direction are inverted.** Since $h\dashv N$ and $C\in\mathbf{Cat}$ is in the *target* of $N$, the relevant component at $C$ is the **counit** $hN(C)\to C$, not "the unit." The widget at line 465 has it correct ("Counit at $C\in\mathbf{Cat}$: $hN(C)\cong C$"). The prose mis-names the map and reverses the canonical direction (the counit is the canonical iso, in direction $hN(C)\to C$).

- **§5 widget triangle SVG (lines 693–705 and 707–720) — vertex labels and arrow endpoints are mismatched.** For triangle 1, the three vertices are drawn as `f` (bottom-left), `f` (top), `fgf` (bottom-right); the arrows are then $f\eta$ from `f`(BL)→`f`(top), $\varepsilon f$ from `f`(top)→`fgf`(BR), and $\mathrm{id}_f$ from `f`(BL)→`fgf`(BR). For the triangle identity $\varepsilon f\circ f\eta\simeq\mathrm{id}_f$ to read off the diagram, the source of $f\eta$ should be `f` and its target should be `fgf`, the source of $\varepsilon f$ should be `fgf` and its target `f`, and $\mathrm{id}_f$ should run `f`→`f`. As drawn, $f\eta$ goes `f`→`f` (wrong target — should be `fgf`), $\varepsilon f$ goes `f`→`fgf` (wrong source and target swapped), and $\mathrm{id}_f$ runs `f`→`fgf` (wrong target — an identity should be a self-loop or land back at `f`). The fix is to swap the labels of the top vertex (`f`→`fgf`) and the bottom-right vertex (`fgf`→`f`). The same labeling defect appears in triangle 2 (lines 707–720): swap the top vertex label `g`→`gfg` and the bottom-right `gfg`→`g`. The readout-text descriptions of the arrows (lines 731–740) all use the correct directions, so the inconsistency is purely between SVG geometry and arrow semantics.

- **§6 widget Step 5 (line 827) contradicts the prose, the universal property, and the hard-tier quiz.** The widget claims: "$\eta$ is generally not invertible — even if $i$ is fully faithful, the colimit can be larger than $F(c)$." This is **mathematically wrong**: the standard theorem (HTT 4.3.2.15) is that *when $i$ is fully faithful*, the unit $\eta\colon F\to(\mathrm{Lan}_i F)\circ i$ **is** an equivalence — because the comma ∞-category $\mathcal{C}/_{i(c)}$ has $(c,\mathrm{id}_{i(c)})$ as a final object, making the colimit collapse to $F(c)$ by final-object cofinality. The hard-tier quiz Q1 at line 331–340 states exactly this, citing the same theorem, and is correct. So the widget's Step 5 caption needs to be inverted: the unit is generally not invertible *when $i$ is not fully faithful*; it IS an equivalence when $i$ is fully faithful.

- **Hard-tier quiz quasi-category Q2 (lines 62–72) — incorrect counterexample.** The question asks whether $\Delta^1\amalg_{\partial\Delta^1}\Delta^1$ (two parallel edges $f,g\colon 0\to 1$ on the same two vertices) is a quasi-category, and asserts the answer is "(c) No — there is an inner horn $\Lambda^2_1$ formed by the two edges that has no filler." This counterexample does not exist. To form a $\Lambda^2_1$ horn from $f,g$, the two edges would need to be composable: the $\partial_2$-edge from vertex 0 to vertex 1, and the $\partial_0$-edge from vertex 1 to vertex 2. With $f\colon 0\to 1$ as $\partial_2$, vertex 1 of $\Delta^2$ must map to $1\in\mathcal{C}_0$; with $g\colon 0\to 1$ as $\partial_0$, vertex 1 must map to $0\in\mathcal{C}_0$. These are inconsistent, so no such horn exists. In fact, the only $\Lambda^2_1$ horns this simplicial set admits have $\partial_0=\mathrm{id}_1$ (or the $\partial_2$ side degenerate), which fill via $s_1(f)$ or $s_1(g)$. Higher inner horns fill similarly via degeneracies. So this simplicial set IS a quasi-category — it equals the nerve of the free category on the graph with two vertices $0,1$ and two parallel edges $f,g\colon 0\to 1$ (the same simplicial set described in answer choice (b), which is therefore the correct answer). The quiz answer key (`"answer": 2`) and explanation should be revised.

## Underspecified or unverifiable claims

- **Widget cone (§4 line 635) — "$B = X\times Y$ with the projections" as a too-big cone.** Without a third map $B\to Z$, $X\times Y$ is not naturally a cone over the cospan $X\to Z\leftarrow Y$. The two natural choices ($p\circ\pi_X$ and $q\circ\pi_Y$) generally disagree, so $X\times Y$ is at best the apex of a *not-quite-commuting* span. The pedagogical intent (a cone whose canonical comparison map to $L$ is not an equivalence) is reasonable, but the specific concrete description "$X\times Y$ with the projections" is muddled. Not a math error so much as a sloppy aside.

- **§5 line 679 dual statement — accessibility hypothesis dropped.** The page states the dual (right adjoint exists iff $g$ preserves small colimits) without explicitly carrying over the accessibility hypothesis. In the presentable setting both directions of HTT 5.5.2.9 require accessibility (it's automatic for colimit-preserving functors between presentable ∞-categories, so the omission is harmless in practice). Standard textbook elision.

- **§6 line 781 — "end/coend formulas" in the 1-categorical case.** The pointwise Lan formula recovers the coend formula $\mathrm{Lan}_i F(d)=\int^c \mathcal{D}(i(c),d)\cdot F(c)$, while the Ran formula recovers an end. Saying "end/coend formulas" together for the Lan side alone is a minor imprecision but reads naturally as "the end-and-coend pair of formulas in the dualized statements."

- **§5 line 342 — "$f$ equivalence iff filling $\Lambda^2_0$ at $f$ is possible."** A bit terse: the standard characterization is that $f$ is an equivalence iff its image in $h(\mathcal{C})$ is an iso, equivalently iff appropriate outer horns containing $f$ in the appropriate face fill. The phrasing is morally correct but leaves underspecified which face $f$ occupies.

- **§3 line 497 — Yoneda formula $y(x)=\mathrm{Map}_\mathcal{C}(-,x)$.** Strictly speaking the Yoneda embedding lands in $\mathrm{Fun}(\mathcal{C}^{\mathrm{op}},\mathcal{S})$ as a coherent assignment of mapping spaces, and "$\mathrm{Map}_\mathcal{C}(-,x)$" is a shorthand for the entire coherent presheaf rather than a pointwise definition. Standard textbook elision.

## Severity

**moderate.** The §1 prose, the limits/colimits §4 prose and widget, the ∞-adjunction §5 prose, and the Kan-extension §6 prose are all mathematically clean. The v1 quiz banks across all five concept entries are correct. However, four real defects are worth flagging:

1. **Math error in widget Step 5 (§6, line 827)**: claims the Lan unit can fail to be an equivalence "even if $i$ is fully faithful" — this contradicts HTT 4.3.2.15 and the page's own hard-tier quiz answer. (Fix: invert the qualifier — the unit is an equivalence when $i$ is fully faithful.)

2. **Math error in hard-tier quasi-category Q2 (line 62)**: the simplicial set $\Delta^1\amalg_{\partial\Delta^1}\Delta^1$ IS a quasi-category (it is the nerve of the free category on two parallel arrows), so the answer key `"answer": 2` and explanation are wrong. The correct answer is (b). (No such $\Lambda^2_1$ horn exists for two parallel arrows from $0$ to $1$.)

3. **Visual/labeling error in §5 adjunction triangle widget (lines 693–720)**: the SVG vertex labels are inconsistent with the arrow source/target semantics — swap the top and bottom-right vertex labels in both triangles (top should read `fgf` / `gfg`, bottom-right should read `f` / `g`). The readout text is correct; only the SVG geometry is mislabeled.

4. **Typo + terminology error in §2 line 360**: the homotopy 2-simplex boundary data has a typo (`$\partial_0\sigma=g$` should be `$\partial_0\sigma=\mathrm{id}_y$`) and the description of the $hN(C)\cong C$ map calls it "the unit" when it is the counit (and reverses the canonical arrow direction).

Items 1 and 2 are substantive: they would mislead a learner. Items 3 and 4 are presentation defects (the underlying intent in 3 is correct in the readout text; item 4 is a typo plus a terminology slip) but worth fixing because they appear in prominent positions.

All other content — the Joyal definitions, the homotopy-category construction proof, the ∞-functor / ∞-Yoneda picture, the slice-category description of (co)limits, the bifibration / mapping-space packaging of ∞-adjunctions, the pointwise Kan-extension formula and its universal property — checks out and matches Lurie HTT / Cisinski / Riehl–Verity.
