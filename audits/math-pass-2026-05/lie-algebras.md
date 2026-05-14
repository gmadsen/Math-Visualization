# lie-algebras — math correctness audit (2026-05)

**Section:** Algebra & homological

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.

## Verified claims

### §1 Axioms and matrix examples

- **Lie-algebra axioms** (lines 272–274): bilinear bracket with $[x,x]=0$ + Jacobi; equivalence with $[x,y]=-[y,x]$ in char $\ne 2$. Standard.
- **Commutator bracket on associative algebras** (line 274) — standard.
- **Classical-algebra dimension table** (lines 280–283):
  - $\mathfrak{gl}_n$: $\dim = n^2$ ✓
  - $\mathfrak{sl}_n$: $\tr X = 0$, $\dim = n^2 - 1$ ✓
  - $\mathfrak{so}_n$: $X + X^\top = 0$, $\dim = \binom{n}{2} = n(n-1)/2$ ✓
  - $\mathfrak{sp}_{2n}$: $X^\top J + JX = 0$, $\dim = n(2n+1)$ ✓
- **Bracket-table widget for $\mathfrak{sl}_2$** (lines 303–307): all nine entries correct.
  - $[e,h] = -2e$, $[e,f] = h$, $[h,e] = 2e$, $[h,f] = -2f$, $[f,e] = -h$, $[f,h] = 2f$, three diagonal entries $0$. Verified against the standard Chevalley basis $\{e, h, f\}$ with $e = E_{12}$, $h = \mathrm{diag}(1,-1)$, $f = E_{21}$.

### §2 Derivations and the adjoint representation

- **$\ad(x)$ is a derivation iff Jacobi** (lines 378–380): $\ad(x)[y,z] = [\ad(x)y, z] + [y, \ad(x)z]$ — equivalent to Jacobi. ✓
- **$[\ad(x), \ad(y)] = \ad([x,y])$** ⇒ $\ad: \mathfrak{g} \to \mathfrak{gl}(\mathfrak{g})$ is a Lie homomorphism (line 380). ✓
- **Killing form $B(x,y) = \tr(\ad(x)\ad(y))$** is symmetric, bilinear, $\mathfrak{g}$-invariant ($B([z,x],y) + B(x,[z,y]) = 0$) (lines 383–385). ✓
- **Killing form is unique up to scalar on simple Lie algebras** (line 385) — correct via Schur applied to $\mathrm{End}_\mathfrak{g}(\mathfrak{g}) = k$ for simple $\mathfrak{g}$.
- **Eigenvalues of $\ad(h)$ on $\mathfrak{sl}_2$ basis $(e,h,f)$ are $\{2, 0, -2\}$** (line 401, widget readout). ✓
  - And $\mathfrak{sl}_2 = \mathfrak{g}_{-2} \oplus \mathfrak{g}_0 \oplus \mathfrak{g}_2$ root decomposition statement is correct (with $\mathfrak{g}_2 = \mathbb{C} e$, $\mathfrak{g}_0 = \mathbb{C} h$, $\mathfrak{g}_{-2} = \mathbb{C} f$).
- **$\ad(e), \ad(h), \ad(f)$ matrices** in widget (line 406–410):
  - $\ad(e)$ matrix `[[0,-2,0],[0,0,1],[0,0,0]]` — column $j$ = image of basis$[j]$. Correct: $\ad(e)(e) = 0$, $\ad(e)(h) = -2e$, $\ad(e)(f) = h$. ✓
  - $\ad(h)$ matrix `[[2,0,0],[0,0,0],[0,0,-2]]`. Correct: $\ad(h)(e) = 2e$, $\ad(h)(h) = 0$, $\ad(h)(f) = -2f$. ✓
  - $\ad(f)$ — see "Wrong / dubious" below.

### §3 Solvable and nilpotent Lie algebras

- **Derived series** $\mathfrak{g}^{(0)} = \mathfrak{g}$, $\mathfrak{g}^{(k+1)} = [\mathfrak{g}^{(k)}, \mathfrak{g}^{(k)}]$; solvable iff series terminates at $0$ (line 502). ✓
- **Lower-central series** $\mathfrak{g}^0 = \mathfrak{g}$, $\mathfrak{g}^{k+1} = [\mathfrak{g}, \mathfrak{g}^k]$; nilpotent iff terminates (line 503). ✓
- **Nilpotent ⇒ solvable** (line 505). ✓
- **Engel:** $\mathfrak{g}$ nilpotent $\iff$ each $\ad(x)$ is nilpotent (line 507). ✓
- **Lie:** every fin-dim rep of solvable Lie algebra over $\mathbb{C}$ is upper-triangularizable (line 508). ✓
- **Borel $\mathfrak{b}_2$** (upper-tri 2×2): derived series dim $[3, 1, 0]$ — verified. $[\mathfrak{b}_2, \mathfrak{b}_2] = \mathbb{C}\, E_{12}$, dim $1$; then abelian ⇒ next is $0$. Solvable but NOT nilpotent (since $\ad(\mathrm{diag}(a,b))(E_{12}) = (a-b) E_{12}$ has nonzero eigenvalue). ✓
- **Heisenberg $\mathfrak{n}_3$**: derived series dim $[3, 1, 0]$, nilpotent — verified. $[\mathfrak{n}_3, \mathfrak{n}_3] = \mathbb{C}\, E_{13}$ which is central, so lower-central series also terminates. ✓
- **$\mathfrak{sl}_2$**: derived series stays at $3$ — perfect Lie algebra ($[\mathfrak{sl}_2, \mathfrak{sl}_2] = \mathfrak{sl}_2$). ✓ Verdict "semisimple" ✓.

### §4 Cartan, Killing, root decomposition

- **Cartan's criterion (semisimplicity):** $\mathfrak{g}$ semisimple $\iff$ Killing form nondegenerate (line 606). ✓
- **Cartan subalgebra** = maximal toral (ad-diagonalizable) for semisimple $\mathfrak{g}$ (line 607). ✓ (Equivalent to "nilpotent + self-normalizing" in the semisimple case.)
- **Root-space decomposition** $\mathfrak{g} = \mathfrak{h} \oplus \bigoplus_{\alpha \in \Phi} \mathfrak{g}_\alpha$ with $\mathfrak{g}_\alpha = \{x : [h,x] = \alpha(h) x\}$ (line 608). ✓
- **Root-system properties** (line 609): finite, $\Phi = -\Phi$, spans $\mathfrak{h}^*$, integrality. ✓
- **$A_2$ root system widget** (line 627–631): six roots at $k\pi/3$ for $k = 0, \ldots, 5$, all length $r = 110$. Hexagonal, equal length. ✓
- **$B_2$ root system widget** (line 633–642): 4 short (length $90$) along axes + 4 long (length $90\sqrt{2}$) on diagonals. Standard $B_2$ has short roots $\pm e_1, \pm e_2$ and long roots $\pm e_1 \pm e_2$ — matches. ✓
- **$G_2$ root system widget** (line 644–650): 6 short (length $70$) at angles $k\pi/3$ + 6 long (length $70\sqrt{3}$) at angles $\pi/6 + k\pi/3$. ✓
- **Length ratios** in info text: $B_2$ ratio $1:\sqrt{2}$ ✓, $G_2$ ratio $1:\sqrt{3}$ ✓.
- **Algebra associations**: $A_2 \leftrightarrow \mathfrak{sl}_3$ (8-dim) ✓, $B_2 \leftrightarrow \mathfrak{so}_5 \cong \mathfrak{sp}_4$ (10-dim) ✓, $G_2 \leftrightarrow$ exceptional (14-dim) ✓.

### §5 $\mathfrak{sl}_2$-triples and weight diagrams

- **$\mathfrak{sl}_2$-triple from each root** (line 710): $e_\alpha \in \mathfrak{g}_\alpha$, $f_\alpha \in \mathfrak{g}_{-\alpha}$, $h_\alpha = [e_\alpha, f_\alpha]$ with $[h_\alpha, e_\alpha] = 2e_\alpha$, $[h_\alpha, f_\alpha] = -2f_\alpha$. Standard normalization. ✓
- **Irreducible $V_n$ has dim $n+1$ and weights $n, n-2, \ldots, -n$**, multiplicity $1$ (lines 714–716). ✓
- **$e$ raises by $2$, $f$ lowers by $2$** (line 716): verified — $h(ev) = ([h,e] + eh)v = 2ev + e(hv) = (2 + \lambda)ev$ when $hv = \lambda v$. ✓
- **Casimir $C = ef + fe + h^2/2$ acts as $n(n+2)/2$ on $V_n$** (line 725). Verified on highest-weight vector $v_0$ ($e v_0 = 0$, $h v_0 = n v_0$): $f e v_0 = 0$, $e f v_0 = n v_0$ (since $f v_0 \in V_{n-2}$, raised back by $e$ with coefficient $n$); $h^2 v_0 = n^2 v_0$. So $C v_0 = (n + n^2/2) v_0 = n(n+2)/2 v_0$. ✓
- **Physics analogy $j(j+1)$ with $j = n/2$**: verified — with $h = 2J_z$, $e = J_+$, $f = J_-$, $C = 2 J^2$, eigenvalue $2 j(j+1) = n(n+2)/2$. ✓

### §6 Classification

- **Cartan–Killing classification statement** (line 810–811): four families $A_n, B_n, C_n, D_n$ ($n \ge 2$ for $D$) plus five exceptions $G_2, F_4, E_6, E_7, E_8$. ✓
- **Identifications**: $A_n = \mathfrak{sl}_{n+1}$ ✓, $B_n = \mathfrak{so}_{2n+1}$ ✓, $C_n = \mathfrak{sp}_{2n}$ ✓, $D_n = \mathfrak{so}_{2n}$ ✓.
- **Bond conventions** (line 812): 1 bond = $120°$, 2 bonds = $135°$ length-ratio $\sqrt{2}$, 3 bonds = $150°$ length-ratio $\sqrt{3}$. ✓
- **"Arrow on multiple bond points from long to short root"** (line 812). ✓ Standard Bourbaki convention.
- **Exceptional dimensions in info dict** (lines 922–931):
  - $A_n: \dim = n(n+2)$ — equivalent to $(n+1)^2 - 1 = \dim\mathfrak{sl}_{n+1}$. ✓
  - $B_n: \dim = n(2n+1)$ ✓
  - $C_n: \dim = n(2n+1)$ ✓
  - $D_n: \dim = n(2n-1)$ ✓
  - $G_2: 14$ ✓; $F_4: 52$ ✓; $E_6: 78$ ✓; $E_7: 133$ ✓; $E_8: 248$ ✓
- **$D_2 = A_1 \times A_1$**: $\mathfrak{so}_4 \cong \mathfrak{sl}_2 \times \mathfrak{sl}_2$. ✓
- **$D_3 = A_3$**: $\mathfrak{so}_6 \cong \mathfrak{sl}_4$. ✓
- **$B_n$ vector rep $(2n+1)$-dim, Spin double cover $\mathrm{Spin}_{2n+1}$** ✓.
- **$C_n$ standard rep symplectic, dim $2n$** ✓.
- **$G_2$ = aut(octonions)** ✓.
- **$F_4$ = aut of exceptional Jordan algebra $\mathfrak{h}_3(\mathbb{O})$** ✓.
- **$E_6$ fundamental rep dim $27$** ✓; role in GUTs is correct (E_6 GUT models).
- **$E_7$ smallest fundamental rep $56$-dim** ✓ (the geometric attachment is wrong — see below).
- **$E_8$ self-dual, equals own adjoint, dim $248$** ✓ (the smallest non-trivial $E_8$ rep is the adjoint).
- **$E_8$ root lattice = weight lattice = unique even unimodular lattice in dim $8$** (line 957). ✓
- **Dynkin pictures structurally correct**:
  - $A_n$: chain of single bonds. ✓
  - $B_n$: chain ending with double bond, arrow → (long → short). ✓
  - $C_n$: chain ending with double bond, arrow ← (long → short, since long is the last node). ✓
  - $D_n$: chain with forked tail. ✓
  - $G_2$: two nodes, triple bond. ✓
  - $F_4$: 4 nodes, double bond in middle, arrow → (long → short). ✓
  - $E_6, E_7, E_8$: chains of 5/6/7 nodes with one branch off the third node. Arms (excluding branch node): $\{1,2,2\}$ for $E_6$, $\{1,2,3\}$ for $E_7$, $\{1,2,4\}$ for $E_8$. Matches $T_{2,3,3}, T_{2,3,4}, T_{2,3,5}$. ✓

### Quiz bank `quizzes/lie-algebras.json`

- **`la-axioms` Q1**: Jacobi is the third axiom — correct, with correct rationale that $[x,x] = 0$ alone is equivalent to skew-symmetry in char $\ne 2$.
- **`la-axioms` Q2**: $\dim \mathfrak{sl}_3 = 8$ ✓.
- **`la-axioms` Q3**: skew-symmetric matrices form a Lie subalgebra. Verified $[X,Y]^\top = -[X,Y]$ from $X^\top = -X, Y^\top = -Y$. ✓
- **`la-derivations-and-adjoint` Q1**: $[\ad(x), \ad(y)] = \ad([x,y])$ encodes Jacobi (verified by expanding on $z$). ✓
- **`la-derivations-and-adjoint` Q2**: invariance $B([z,x], y) + B(x, [z,y]) = 0$ — correct (skew under $\ad(z)$).
- **`la-derivations-and-adjoint` Q3**: abelian ⇒ $\ad = 0$ ⇒ $B \equiv 0$ ✓.
- **`la-solvable-and-nilpotent` Q1**: solvable iff derived series terminates ✓.
- **`la-solvable-and-nilpotent` Q2**: Engel's theorem. ✓
- **`la-solvable-and-nilpotent` Q3**: Borel $\mathfrak{b}_2$ solvable not nilpotent. Rationale correct.
- **`la-cartan-killing-classification` Q1**: Cartan's criterion (semisimplicity ⇔ nondeg Killing). ✓
- **`la-cartan-killing-classification` Q2**: Cartan = self-normalizing nilpotent, equivalently maximal toral for semisimple. ✓
- **`la-cartan-killing-classification` Q3**: $A_2$ has 6 roots; explanation $\dim \mathfrak{sl}_3 = 8 = 2 + 6$ ✓; six roots $\pm \alpha_1, \pm \alpha_2, \pm(\alpha_1 + \alpha_2)$ ✓.
- **`la-sl2-and-roots` Q1**: $[h,e] = 2e, [h,f] = -2f, [e,f] = h$ ✓.
- **`la-sl2-and-roots` Q2**: $V_4$ weights $\{4, 2, 0, -2, -4\}$ ✓.
- **`la-sl2-and-roots` Q3**: $V_2 \otimes V_2 = V_4 \oplus V_2 \oplus V_0$ (dims $5 + 3 + 1 = 9 = 3 \cdot 3$) ✓.
- **`la-classification-simple` Q1**: symplectic = $C_n$ ✓.
- **`la-classification-simple` Q2**: 5 exceptionals ✓.
- **`la-classification-simple` Q3**: $G_2$ has triple bond; $A_2$ single, $B_2 = C_2$ double; trivalent branch nodes in $D_n, E_6, E_7, E_8$. All correct.

## Wrong / dubious claims

### Major

- **§2 widget — $\ad(f)$ matrix is wrong (lines 406–410).**

  The widget defines
  ```js
  AD = {
    e: [[0,-2,0],[0,0,1],[0,0,0]],   // ad(e): e->0, h->-2e, f->h     ✓ correct
    h: [[2,0,0],[0,0,0],[0,0,-2]],   // ad(h): e->2e, h->0, f->-2f    ✓ correct
    f: [[0,0,0],[0,2,0],[-1,0,0]]    // ad(f): e->h, h->2f, f->0      ✗ wrong (both matrix and comment)
  };
  ```
  with the convention "column $j$ of $M$ = $\ad(x)(\text{basis}_j)$" (line 442 comment + line 445 code). For the given matrix, the columns of $\ad(f)$ are
  - col 0 (image of $e$): $(0, 0, -1) = -f$
  - col 1 (image of $h$): $(0, 2, 0) = 2h$
  - col 2 (image of $f$): $(0, 0, 0) = 0$

  But the standard $\mathfrak{sl}_2$ relations give $\ad(f)(e) = [f, e] = -h$ (i.e., $(0, -1, 0)$) and $\ad(f)(h) = [f, h] = 2f$ (i.e., $(0, 0, 2)$). The widget therefore renders $\ad(f)$ as if $[f,e] = -f$ and $[f,h] = 2h$, which violates the bracket table that the very widget above (§1) lists correctly. The comment "ad(f): e->h, h->2f, f->0" is also wrong on its first entry — $\ad(f)(e) = [f, e] = -h$, not $+h$.

  Visual symptom: when the user selects $x = f$ from the dropdown, the widget shows arrows $f \xrightarrow{-1\cdot f} f$ (a self-loop "$\ad(f)(e) = -f$") and $h \xrightarrow{2h} h$ — both wrong both as labels and as arrows.

  Eigenvalue readout `0, 0, 0 (nilpotent)` for $x = f$ is correct (since $\ad(f)$ is genuinely nilpotent), but the matrix that's drawn is not actually that operator.

  **Fix:** replace `f: [[0,0,0],[0,2,0],[-1,0,0]]` with `f: [[0,0,0],[-1,0,0],[0,2,0]]`, and update the comment to `ad(f): e->-h, h->2f, f->0`.

- **§6 widget info text — $E_7$ "closely tied to lines on a cubic surface" (line 930).**

  The line reads
  > `E7:"E_7: dim 133. Smallest fundamental rep is 56-dim (closely tied to lines on a cubic surface)."`

  But the 27 lines on a smooth cubic surface in $\mathbb{P}^3$ correspond to the 27-dim fundamental rep of **$E_6$** (their incidence configuration has Weyl group $W(E_6)$). The 56-dim rep of $E_7$ is the one tied to **del Pezzo surfaces of degree $2$** (which carry 56 $(-1)$-curves) or equivalently to the 28 bitangents of a smooth plane quartic (with each bitangent appearing with two signs). The page has the geometric attachment misassigned.

  **Fix:** rewrite as "(closely tied to the 56 (−1)-curves on a del Pezzo surface of degree 2, or equivalently to the 28 bitangents of a plane quartic)." Optionally add to the $E_6$ entry: "the 27-dim fundamental rep is the configuration of 27 lines on a smooth cubic surface."

### Minor

- **§6 widget label for $C_n$ (line 872): `"C_n  (last bond double, short→long)"`.**

  The label "short→long" is ambiguous next to the parallel $B_n$ label "long→short". For $B_n$ "long→short" describes the arrow direction (from long root to short root, which is the Bourbaki convention also stated at line 812). For $C_n$ the arrow on the double bond ALSO points from long to short (i.e., from the last node, which is the long root in $C_n$, back to the second-to-last node) — the label "short→long" appears to describe the **numbering order** along the chain (short roots come first, long root last) rather than arrow direction.

  The widget's drawn arrow is actually correct (`bond(xs[3], xs[4], 2, "<-")` with `"<-"` rendering the arrow apex at the LEFT, pointing from the rightmost long node back to the short node — so it does point long→short visually). Only the label is inconsistent with the convention $B_n$ uses.

  **Fix:** change to `"C_n  (last bond double, long→short)"` for parallelism with $B_n$, OR rewrite both labels to talk explicitly about numbering direction.

- **§5 prose, line 710: $h_\alpha = [e_\alpha, f_\alpha]$.**

  Strictly, $h_\alpha = [e_\alpha, f_\alpha]$ is a coroot only after choosing a specific normalization of $e_\alpha, f_\alpha$ (the Chevalley normalization that gives $\alpha(h_\alpha) = 2$). The page asserts $[h_\alpha, e_\alpha] = 2 e_\alpha$ in the same line, which is the consistent choice — but the order of presentation suggests $h_\alpha$ comes "for free" from any choice of $e_\alpha, f_\alpha$, when in fact one has to scale $e_\alpha, f_\alpha$ to ensure $\alpha(h_\alpha) = 2$. Pedagogically informal but not incorrect for the (implicit) Chevalley convention.

- **§4 line 607: "Cartan subalgebra — a maximal toral (ad-diagonalizable) subalgebra".**

  The "maximal toral" characterization is specific to the semisimple case over an algebraically closed field of characteristic zero. For general $\mathfrak{g}$ the definition is "nilpotent and self-normalizing." The §4 context is semisimple, so this is consistent — would be cleaner to flag the contextual restriction.

- **§1 line 286: "differentiating the group equation $g \in G$ at $g=I$ along $g(t) = I + tX + \cdots$ gives the linear equation cutting out $\mathfrak{g} \subset \mathfrak{gl}_n$".**

  Sketch is correct but a bit imprecise — the "linear equation" really comes from differentiating the *defining relation* of the group (e.g., $g^\top g = I$ for $\mathrm{O}_n$), not the group element itself. Wording-level, not math-level.

## Underspecified or unverifiable claims

- **§4 line 609: "the integrality conditions that make it one of the rank-$n$ root systems".**
  Doesn't say what the conditions ARE (the standard one being $\langle \alpha, \beta^\vee \rangle \in \mathbb{Z}$ for any roots $\alpha, \beta$). Pedagogically a forward pointer; not wrong.

- **§7 connections, line 969: "BCH formula are the bridge in both directions."**
  BCH formula is referenced but never stated on the page. Out of scope (the actual BCH content lives in `lie-groups.html`), so not a defect of this page.

- **§2 widget readout: `eig.textContent = eigsForX(x)` where $x \in \{e, f\}$ returns `"0, 0, 0 (nilpotent)"`.**
  Mathematically correct (both $\ad(e)$ and $\ad(f)$ are nilpotent on $\mathfrak{sl}_2$, with all eigenvalues zero). Note however: even with the broken $\ad(f)$ matrix in the widget, the *rendered* matrix is also nilpotent (one can check the matrix `[[0,0,0],[0,2,0],[-1,0,0]]` has eigenvalues $\{0, 2, 0\}$ — so actually NOT nilpotent! The wrong matrix is not even the right *kind* of operator). This is a second symptom of the AD["f"] bug: the readout label says "nilpotent" but the broken matrix has a nonzero eigenvalue $2$.

## Severity

**Two majors:**
1. The §2 widget's `AD["f"]` matrix is wrong — both columns are wrong; the displayed action of $\ad(f)$ on the basis is not the genuine $\ad(f)$, and the widget's eigenvalue readout ("nilpotent") contradicts the eigenvalues of the matrix it actually draws.
2. The §6 $E_7$ info text wrongly attributes the 56-dim fundamental rep to "lines on a cubic surface" (that's $E_6$ + 27 lines).

**Minors:** $C_n$ Dynkin label ambiguity; small wording issues in §1, §4, §5.

The classification statement, dimension counts for all classical and exceptional algebras, root-system numerology ($A_2, B_2, G_2$), Cartan/Killing criterion, Engel/Lie theorems, derived/lower-central series for $\mathfrak{b}_2$ / Heisenberg / $\mathfrak{sl}_2$, the Dynkin-diagram pictures (E_n branching positions, arrow placements), and the entire quiz bank are all mathematically correct.
