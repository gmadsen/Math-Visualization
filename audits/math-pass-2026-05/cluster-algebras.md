# cluster-algebras — math correctness audit (2026-05)

**Section:** Algebra & homological

## Verified claims

### §1 Quivers and seeds
- **Definition** (line 268): a quiver is a finite directed multigraph on $\{1,\dots,n\}$ with no loops and no oriented 2-cycles, encoded by a skew-symmetric integer matrix $B=(b_{ij})$ with $b_{ij}=$ (#arrows $i\to j$) $-$ (#arrows $j\to i$). Skew-symmetry $\Leftrightarrow$ no 2-cycles. ✓ Standard.
- **Seed definition** (line 269): pair $(\mathbf x, B)$ with $\mathbf x$ algebraically independent in $\mathcal F = \mathbb Q(x_1,\dots,x_n)$. ✓ Standard.
- **Seed inspector widget** (lines 272–384, type $A_3$, quiver $1\to 2\to 3$): exchange matrix $B=\begin{pmatrix}0&1&0\\-1&0&1\\0&-1&0\end{pmatrix}$ correctly assembled; skew-symmetry verified. The per-vertex readouts produce the correct exchange-relation formulas:
  - $\mu_1$: $x_1 x_1' = 1 + x_2$ ✓
  - $\mu_2$: $x_2 x_2' = x_1 + x_3$ ✓
  - $\mu_3$: $x_3 x_3' = x_2 + 1$ ✓
- **2-cycle note** (line 387): banning 2-cycles is the right normalisation; multiplicities go into the matrix entries — correct.

### §2 Mutation and the exchange relation
- **Cluster mutation rule** (line 410): $x_k x_k' = \prod_{b_{ik}>0} x_i^{b_{ik}} + \prod_{b_{ik}<0} x_i^{-b_{ik}}$ — standard FZ binomial form. ✓
- **Matrix mutation rule** (line 412): $b'_{ij} = -b_{ij}$ if $i=k$ or $j=k$; else $b_{ij} + (|b_{ik}| b_{kj} + b_{ik} |b_{kj}|)/2$. Verified equivalent to the alternative form $b_{ij} + \mathrm{sgn}(b_{ik})\max(b_{ik}b_{kj},0)$ across all sign patterns. ✓
- **Involution** (line 413): $\mu_k^2 = \mathrm{id}$ on both $B$ and $\mathbf x$. ✓
- **$A_2$ pentagon example** (lines 416–418): starting from $(x_1,x_2)$ with $1\to 2$, mutating alternately at $1,2,1,2,1$ produces the 5-seed cycle, returning to the starting cluster up to label swap on the 6th step (i.e., 5 mutations recover the starting cluster as an unordered pair). All five clusters in the widget (lines 440–446) are explicitly correct:
  - $(x_1, x_2)$
  - $((1+x_2)/x_1, x_2)$
  - $((1+x_2)/x_1, (1+x_1+x_2)/(x_1 x_2))$
  - $((1+x_1)/x_2, (1+x_1+x_2)/(x_1 x_2))$
  - $((1+x_1)/x_2, x_1)$
  
  Verified by chain of exchange relations: each $x_k x_k' = $ (product of incoming) $+$ (product of outgoing) checks out numerically and the closure $x_6=x_1$, $x_7=x_2$ is exact.
- **Arrow-direction alternation** (widget): the quiver alternates $\to / \leftarrow$ each mutation — confirmed by direct matrix mutation $\mu_1$ on $\begin{pmatrix}0&1\\-1&0\end{pmatrix}$ gives $\begin{pmatrix}0&-1\\1&0\end{pmatrix}$.

### §3 Laurent phenomenon and positivity
- **Theorem (FZ 2002)** (line 548): every cluster variable lies in $\mathbb Z[x_1^{\pm 1},\dots,x_n^{\pm 1}]$. ✓ Standard.
- **Positivity** (Lee–Schiffler 2015 for skew-symmetric; GHKK 2018 in general) (line 553) — correct attributions.
- **Type-$A_2$ Laurent expansions** (widget, lines 575–581): all five Laurent forms with their numerator coefficient lists $[1]$, $[1]$, $[1,1]$, $[1,1,1]$, $[1,1]$ are correct, denominators $1, 1, x_1, x_1 x_2, x_2$ are monomial as guaranteed.
- **Caldero–Chapoton interpretation of coefficients as Euler characteristics of quiver Grassmannians** (line 554) — correct standard result.
- **Proof-sketch note** (line 641): "any two cluster variables are coprime in the appropriate Laurent ring" — fair informal description of FZ's caterpillar-lemma approach.

### §4 Finite type and the ADE classification
- **Theorem (FZ 2003)** (line 662): finite-type ↔ mutation-equivalent to a Dynkin-type quiver/diagram (ADE simply-laced; BCFG with multiplicities). Phrasing is informal but conveys the correct mathematical content. The precise statement involves Cartan companion matrices.
- **Almost positive root counts** (line 663): for $A_n$ the count is $n(n+3)/2$; for $E_8$ it is $128$. Verified:
  - $A_n$: $n(n+1)/2$ positive roots $+ n$ simples $= n(n+3)/2$ ✓
  - $E_6$: $36+6=42$, $E_7$: $63+7=70$, $E_8$: $120+8=128$ ✓
- **Cluster count $C_{n+1}$ for type $A_n$** (line 663): $\frac{1}{n+2}\binom{2(n+1)}{n+1}$. Correct Catalan formula. Verified $C_3=5$, $C_4=14$, $C_5=42$.
- **Polygon model** (line 666–671): cluster variables ↔ diagonals; clusters ↔ triangulations; mutation ↔ flip. Standard.
- **Ptolemy interpretation** (line 672): $x_k x_k' = M_+ + M_-$ becomes Ptolemy for a cyclic quadrilateral — verified algebraically: for vertices $i<j<k<l$, $p_{ik} p_{jl} = p_{ij} p_{kl} + p_{il} p_{jk}$ matches Ptolemy with diagonals $(i,k),(j,l)$ and opposite-side pairs $(p_{ij},p_{kl})$ and $(p_{jk},p_{il})$. ✓
- **Polygon-flip widget counts** (line 800): $n*(n+3)/2$ cluster variables and $C_{n+1}$ clusters — verified for $n=3,4,5$ (heptagon: 14 cluster variables, 42 clusters; octagon: 20 cluster variables, 132 clusters).
- **Exchange graph = Stasheff associahedron $K_{n+2}$ of dimension $n$** (line 835): correct under Stasheff's original indexing convention (where $K_m$ has dimension $m-2$). $K_{n+2}$ has $C_{n+1}$ vertices, matching cluster count. ✓
- **$E_{6,7,8}$ produce $42,70,128$ cluster variables** (line 835) ✓.

### §5 Cluster categories and τ-tilting
- **Cluster category** $\mathcal C_Q := D^b(\mathrm{mod}\,kQ)/\tau^{-1}\circ[1]$ (line 856) — standard BMRRT 2006 definition. Both this convention and $D^b/\tau[-1]^{-1}$ appear in the literature; equivalent.
- **Triangulated structure** (Keller 2005), **2-Calabi–Yau property** $\mathrm{Ext}^1(X,Y)\cong D\,\mathrm{Ext}^1(Y,X)$ (line 857) — correct.
- **BMRRT dictionary table** (lines 859–868): each row matches the standard correspondence. The exchange-triangle row $T_k^*\to E\to T_k\to T_k^*[1]$ refers to the Iyama–Yoshino exchange — correct.
- **Caldero–Chapoton formula** (line 866): $\sum_e \chi(\mathrm{Gr}_e(M))\prod x_i^{\langle\dim,\beta_i\rangle}$. Structurally correct (sum over dimension vectors of submodules, Euler characteristics of quiver Grassmannians, monomial in cluster variables); the inner exponent abbreviation $\langle\dim,\beta_i\rangle$ is somewhat underspecified for a reader without prior background, but acceptable as a high-level pointer.
- **AR-quiver widget** (lines 871–998): the 9 indecomposable objects of the type-$A_3$ cluster category and their hexagon-diagonal correspondence. Verified the 9 listed diagonals $\{(0,2),(0,3),(0,4),(1,3),(1,4),(1,5),(2,4),(2,5),(3,5)\}$ are exactly the 9 diagonals of the hexagon (no duplicates, no sides). The correspondence between cluster-category indecomposables and hexagon diagonals (modulo a labeling choice) is correct.

### §6 Grassmannians, surfaces, and total positivity
- **Plücker relation** (line 1024): $p_{ik} p_{j\ell} = p_{ij} p_{k\ell} + p_{i\ell} p_{jk}$ for $1\le i<j<k<\ell\le n$ — standard. ✓
- **Cluster structure on $\mathrm{Gr}(2,n)$** (line 1025): $n$ frozen sides + $n(n-3)/2$ mutable diagonals = $\binom{n}{2}$ Plückers; mutable part is type $A_{n-3}$. Verified for $n=5$ (10 total = 5+5, type $A_2$) and $n=6$ (15 total = 6+9, type $A_3$). ✓
- **Gr(2,n) chord widget** (lines 1027–1142): all counts (frozen, mutable, total) and triangulation count $C_{n-2}$ correct for $n=5,6,7,8$.
- **Bordered surfaces** (line 1146): Fomin–Shapiro–Thurston extension; flips ↔ mutation; lambda-length identities (Penner) ↔ Plücker-style exchange. ✓
- **Total positivity** (line 1148–1149): definition (all minors positive) and Lusztig's TP-cell decomposition / FZ's identification of cells as cluster charts — standard. ✓
- **Scattering diagrams (GHKK)** (line 1152) — correct attribution.

### §7 Connections
- All five connection bullets (lines 1174–1178) point to genuine cross-topic links; quantum cluster algebras (Berenstein–Zelevinsky), categorification, derived categories, scattering-diagram mirror symmetry, and cluster structures on $\mathrm{Gr}(k,n)$ / flag varieties all standard. ✓

### Quizzes (`quizzes/cluster-algebras.json`)
Spot-checked all 18 questions across the 6 concepts. Most stems and answers are mathematically correct. Issues itemized below.

## Wrong / dubious claims

### Major

- **Quiz `ca-finite-type` Q3 (matching), line 144 of quiz JSON:** The right-side label
  > "Triangulations of a punctured $n$-gon (one tagged interior point); exchange graph is the cyclohedron."
  
  is matched (correctly) to type $D_n$. **The "exchange graph is the cyclohedron" clause is wrong.** The cyclohedron (Bott–Taubes polytope) is the generalized associahedron of types $B_n$ / $C_n$, not $D_n$. The exchange polytope of type $D_n$ is the type-$D$ generalized associahedron of Fomin–Reading — a distinct polytope from both the Stasheff associahedron and the cyclohedron. The "punctured polygon with tagged arc" surface model for $D_n$ (FST 2008) is correct; only the "cyclohedron" identification is wrong.
  
  **Fix:** drop "; exchange graph is the cyclohedron" or replace with "; exchange graph is the type-$D$ generalized associahedron".

- **Quiz `ca-finite-type` Q3 right-side label for $E_{6,7,8}$:**
  > "Exceptional cluster algebras with no surface model; ... finite cluster sets of sizes $42, 70, 128$ respectively."
  
  The numbers $42, 70, 128$ are the **cluster variable counts** (= numbers of almost-positive roots), not the cluster (= seed) counts. The actual cluster counts are the generalized Catalan numbers $C(W)$, which for $E_{6,7,8}$ are $833$, $4160$, $25080$ respectively (verified via $\prod_i (h+e_i+1)/(e_i+1)$ over the exponents). The phrase "finite cluster sets of sizes 42, 70, 128" reads naturally as cluster counts and is therefore wrong; it would be correct if rephrased as "$42$, $70$, $128$ cluster variables" — matching the prose statement on line 663 of the page proper.
  
  **Fix:** change "cluster sets" to "cluster-variable sets" (or "almost positive roots").

- **Quiz `ca-categories` Q2 (numeric), line 172 of quiz JSON:** The explanation paragraph is internally garbled:
  > "Type $A_n$ has $n(n+3)/2$ cluster variables (= indecomposable rigid objects) and $n$ shifted projectives = $n$ extra indecomposables. The $A_3$ cluster category has $\binom{n+3}{2}$ indecomposables total when $n=3$: $9$ indecomposable rigid objects."
  
  The "+ $n$ extra" framing is wrong: in the cluster category, the $n$ shifted projectives $P_i[1]$ are **among** the $n(n+3)/2$ indecomposable objects, not in addition to them. (For $A_3$: $9 = 6$ module indecomposables $+ 3$ shifts $P_i[1]$, all rigid.) The widget itself correctly puts $P[1]$ and $M[1]$ labels on three of the nine nodes (positions $M_5, M_6, M_9$), so the widget is right and the quiz explanation contradicts it. The numeric answer ($9$) is correct; only the explanation needs repair.
  
  **Fix:** replace with something like "All $n(n+3)/2$ indecomposable objects of the cluster category are rigid; for $A_3$ that gives $9$. Equivalently: $6$ indecomposable $kQ$-modules plus the $3$ shifted projectives $P_1[1], P_2[1], P_3[1]$."

### Minor

- **AR-quiver widget label collision** (lines 889 and 895): Two different indecomposables — $M_5$ at diagonal $(0,3)$ and $M_9$ at diagonal $(2,5)$ — are both given the description **"P[1]"**. In the cluster category of $A_3$ there are three distinct shifted projectives $P_1[1], P_2[1], P_3[1]$, and the third one (likely the intended label for $M_5$ or $M_9$) is missing. As written, the labels are ambiguous: a reader can't tell which of the three $P_i[1]$ each node represents. ($M_6$'s "M[1]" label is also unspecific — presumably it's $P_2[1]$ or an indecomposable module shifted, not literally a projective.)
  
  **Fix:** disambiguate as $P_1[1]$, $P_2[1]$, $P_3[1]$ (and re-label $M_6$ similarly if it's a shift; otherwise specify which module).

- **Quiz `ca-quivers-and-seeds` Q3 explanation (line 38 of quiz JSON):** "type $A_3$ has $\det B = 0$ in some orientations." For $A_3$ (rank $3$, odd), every skew-symmetric $3\times 3$ matrix has determinant $0$ (since $\det B = \det B^T = \det(-B) = -\det B$ for odd $n$ forces $\det B = 0$), regardless of orientation. The phrase "in some orientations" misleads: $\det B$ is identically $0$ for all orientations of any $A_3$ quiver. The explanation's larger point (skew-symmetric matrices need not be invertible) is correct.
  
  **Fix:** "For $A_3$ (any orientation) $\det B = 0$ since odd-rank skew-symmetric matrices are always singular."

- **Quiz `ca-finite-type` Q1 marked answer (line 121 of quiz JSON):** "iff $B$ is mutation-equivalent to a Cartan matrix of a finite-type root system." Technically inaccurate: the exchange matrix $B$ is skew-symmetric (or skew-symmetrizable), so $B$ itself can never literally be a Cartan matrix (Cartan matrices have $2$'s on the diagonal). The correct statement is "the Cartan companion of $B$ is the Cartan matrix of a finite-type root system" (where Cartan companion $C(B)$ has $C_{ii}=2$ and $C_{ij}=-|b_{ij}|$). The page's body prose (line 662) avoids this trap by speaking of Dynkin diagrams instead of Cartan matrices.
  
  **Fix:** "$B$ is mutation-equivalent to the (signed) Cartan companion of a finite-type Cartan matrix" or, simpler, "the underlying valued graph of $B$ is a finite-type Dynkin diagram for some seed in the mutation class."

- **Quiz `ca-categories` Q3 (multi-select), explanation footer (line 184 of quiz JSON):** "$\mathcal C_Q$ is hereditary (every short exact sequence splits)." The parenthetical defines **semisimple**, not hereditary: hereditary means global dimension $\le 1$ (equivalently $\mathrm{Ext}^2 = 0$), while "every SES splits" means $\mathrm{Ext}^1=0$, which is semisimplicity. Since the option is correctly marked unchecked the student is told it's false, but the parenthetical teaches the wrong definition.
  
  **Fix:** drop the parenthetical, or replace with "(every module has projective dimension $\le 1$, i.e. $\mathrm{Ext}^2 \equiv 0$)."

- **Quiz `ca-laurent` Q3 (spot-the-error):** the marked answer (Step 4 contradicts Step 3) is defensible, but the deeper issue is that **Step 1's inductive hypothesis is false from the start** — the base case fails ($x_3 = (1+x_2)/x_1 \notin \mathbb Z[x_1,x_2]$ already at depth 1). A careful student might pick Step 1 as the flaw rather than Step 4. The current grader penalizes either reading; the explanation should at least note that Step 1 is also untenable.

- **§2 line 413 "the set of seeds carries an action of the free product of $n$ copies of $\mathbb Z/2$":** technically the free product (universal Coxeter group of rank $n$) acts on the **labeled mutation tree** (the $n$-regular tree), with seeds appearing as the quotient by the relations that arise from the cluster pattern. The mutations $\mu_i$ are involutions but $\mu_i \mu_j$ ($i\ne j$) typically have nontrivial finite or infinite order depending on the seed. The statement is pedagogically standard but conflates "the generators are involutions" with "the group acts freely on seeds"; for finite-type cluster algebras the action is far from free. Pedagogical wording, not a content error.

- **§5 widget $M_6$ label "M[1]" (line 892):** the cluster category of $A_3$ has only $9$ indecomposables: $6$ modules ($S_1, S_2, S_3$, plus three indecomposables of dimension $\ge 2$) and $3$ shifts $P_i[1]$. "M[1]" reads as "an unspecified module shifted" but the AR-quiver position pins it to a specific object. As with the $P[1]$ collision above, the label is unspecific.

## Underspecified or unverifiable claims

- **§2 line 418 "Type $A_2$ is *periodic*":** the period is unambiguously $5$ for cluster variables, $5$ for unordered seeds, and $10$ for ordered seeds. The page's "after five mutations, you return to the starting seed (with the variables permuted)" handles this correctly.

- **§3 line 554 "non-negative integer coefficients ... count *something*":** the page hedges and then names two interpretations (Caldero–Chapoton Euler characteristics, GHKK broken-line counts). Both correct.

- **§5 line 866 Caldero–Chapoton formula exponent**: $\langle\dim,\beta_i\rangle$ is left unexplained inline ($\beta_i$ presumably the simple roots / dimension vectors of simples). The high-level structural form is right; readers needing the precise exponent need to consult a reference.

- **§6 line 1146 "all surface-type cluster algebras simultaneously":** the FST 2008 framework recovers cluster algebras from bordered surfaces with marked points; not literally *all* cluster algebras (only the surface-type / mutation-finite ones with that origin). The phrasing is fine in context (the sentence is about *surface-type* cluster algebras specifically).

- **§4 line 835 "Stasheff associahedron $K_{n+2}$, dimension $n$":** matches Stasheff's original indexing. Some modern texts use $K_n$ for the $n$-dimensional polytope; the page's choice is the older convention. Either is fine; not noted on the page.

## Severity

**Three major errors, all in the quiz bank, none in the body prose:**

1. Type $D_n$ exchange graph is **not** the cyclohedron (quiz `ca-finite-type` Q3) — confuses $D_n$ with $B_n/C_n$.
2. The numbers $42, 70, 128$ for $E_{6,7,8}$ are cluster variable counts, **not** cluster counts (quiz `ca-finite-type` Q3) — true cluster counts are $833, 4160, 25080$.
3. The claim "$n$ shifted projectives = $n$ extra indecomposables" in quiz `ca-categories` Q2 explanation contradicts both the widget and the standard fact that all $n(n+3)/2$ indecomposables of the cluster category are rigid (shifts $P_i[1]$ are *among* them, not extra).

**Six minor issues**, each a wording or precision nit (Cartan-companion vs Cartan-matrix, hereditary-vs-semisimple parenthetical, $\det = 0$ "in some orientations" for odd-rank skew-symmetric, ambiguous AR-quiver labels $P[1]$/$M[1]$, free-product-of-$\mathbb Z/2$ action phrasing, spot-the-error answer choice).

**The mathematical content of the page proper (§§1–7, all widgets, all formulas) is correct.** The exchange relation, matrix mutation rule, $A_2$ pentagon (all five clusters explicitly verified), Laurent expansions and their non-negative coefficients in $A_2$, $A_n$ cluster variable count $n(n+3)/2$, cluster count $C_{n+1}$, almost-positive-root counts for $E_{6,7,8}$, polygon-flip / Ptolemy / Plücker correspondence, $\mathrm{Gr}(2,n)$ frozen-vs-mutable counts, Stasheff associahedron $K_{n+2}$ indexing, BMRRT cluster category and 2-CY property — all are stated correctly. The seed-inspector and polygon-flip widgets produce mathematically correct outputs across all parameter choices.
