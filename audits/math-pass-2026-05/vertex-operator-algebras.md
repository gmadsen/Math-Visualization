# vertex-operator-algebras.html — math correctness pass

## Verified claims

**Section 1 (vertex operators).** Mode-expansion convention $Y(a,z)=\sum a_n z^{-n-1}$, locality $(z-w)^N[Y(a,z),Y(b,w)]=0$, vacuum $Y(\mathbf{1},z)=\mathrm{id}$, creation $Y(a,z)\mathbf{1}\in V[[z]]$ with value $a$ at $z=0$, and $a_{-1}\mathbf{1}=a$ are all standard FLM/Kac axioms.

**Section 2 (axioms / Jacobi).** Translation $[T,Y(a,z)]=\partial_z Y(a,z)$, grading $V=\bigoplus V_n$ bounded below with finite-dim pieces, and the Borcherds–Jacobi identity (line 365) match the FLM 1988 / Kac VAA reference forms exactly. The remark that $T=L_{-1}$ and grading = $L_0$-spectrum reduce the axioms is correct.

**Section 3 (Virasoro).** Bracket $[L_m,L_n]=(m-n)L_{m+n}+\tfrac{c}{12}(m^3-m)\delta_{m+n,0}$ standard. Conformal vector has weight 2, hence $Y(\omega,z)=\sum L_n z^{-n-2}$ ✓. The general weight-$h$ shift $Y(a,z)=\sum a_n z^{-n-h}$ is correct. Widget 3's note that $m^3-m=0$ on the $\mathfrak{sl}_2$-triple $\{L_{-1},L_0,L_1\}$ is correct (cocycle vanishes there). Central-charge inventory ($c=1$ Heisenberg, $c=\dim L$ lattice on rank-$\dim L$, $c=k\dim\mathfrak{g}/(k+h^\vee)$ affine, $c=24$ moonshine) all standard.

**Section 4 (Zhu).** Character $\mathrm{ch}_M(\tau)=\mathrm{tr}_M\,q^{L_0-c/24}$ standard. Zhu 1996 modular-invariance statement (vector-valued modular form for $\mathrm{SL}_2(\mathbb{Z})$, rational + $C_2$-cofinite hypothesis, finitely many irreducibles, $S$-matrix carries fusion via Verlinde) is correct. Minimal-model central charge $c_{p,q}=1-6(p-q)^2/(pq)$ ✓. Heisenberg character $1/\eta(\tau)$ ✓ (since $q^{-1/24}\prod(1-q^n)^{-1}=1/\eta$). Moonshine character $J(\tau)=j(\tau)-744$ ✓.

**Section 5 (FLM construction).** Frenkel–Lepowsky–Meurman 1988 attribution, $\mathbb{Z}/2$-orbifold of Leech lattice VOA, full-Aut-group = Monster, McKay–Thompson series $T_g(\tau)=\sum\mathrm{tr}(g\mid V^\natural_n)q^{n-1}$, Conway–Norton genus-zero conjecture, Borcherds 1992 proof via Monster Lie algebra (generalized Kac–Moody from $V^\natural\otimes V_{II_{1,1}}$ + Goddard–Thorn no-ghost), denominator-identity recursion — all correct. Lattice-VOA graded dimension $\Theta_\Lambda(\tau)/\eta(\tau)^{24}$ standard.

**Section 6 (chiral algebras).** Beilinson–Drinfeld definition $\mu:j_*j^*(\mathcal{A}\boxtimes\mathcal{A})\to\Delta_*\mathcal{A}$ on $X^2\setminus\Delta\hookrightarrow X^2$, restriction-to-formal-disc recovers a VOA, role in geometric Langlands (BD Grassmannian, Hecke side, geometric Satake) — all consistent with BD 2004.

**Widget 6 (zoo).** Heisenberg $[b_m,b_n]=m\delta_{m+n,0}$ ✓. Lattice VOA underlying space $\mathbb{C}[L]\otimes S(\mathfrak{h}_-)$ ✓. Minimal-model examples $(3,4)\to c=1/2$ (Ising), $(4,5)\to c=7/10$ (tricritical Ising) ✓. Affine $V_k(\mathfrak{g})$ description ✓.

## Wrong / dubious claims

- **`vertex-operator-algebras.html:649` — McKay–Thompson 3B sign error.** Widget array `"3B": {q:[1, 54, -76, 243]}`. Conway–Norton 3B Hauptmodul is $T_{3B}(\tau)=(\eta(\tau)/\eta(3\tau))^{12}=q^{-1}+54q-76q^2-243q^3+1188q^4-\dots$. The $q^3$ coefficient is **$-243$**, not $+243$. The widget will print the wrong sign for class 3B.
- **`vertex-operator-algebras.html:540–584` (widget 4) — column header `dim V^\natural_n` mislabels the grading.** With $c=24$ and the convention $L_0(V^\natural_n)=n$, the FLM module has $V^\natural_0=\mathbb{C}\mathbf{1}$, **$V^\natural_1=0$**, $V^\natural_2=$ Griess algebra (dim 196884), $V^\natural_3$ has dim 21493760, etc. The widget's table prints `n=1, dim V^\natural_n = 196884` and `n=2, dim V^\natural_n = 21493760`, which conflates the Fourier-coefficient index with the $L_0$-grading. Either the column should be relabeled "coeff of $q^{n-1}$" or the row indices need to shift by 1 (so 196884 sits at $n=2$). The vanishing $V^\natural_1=0$ is the load-bearing fact for the Borcherds construction, so this mis-labeling is pedagogically harmful.
- **`vertex-operator-algebras.html:616` — graded-dim formula for $V_\Lambda^+$.** Table row 2 gives $\mathrm{ch}\,V_\Lambda^+ = \tfrac12(\mathrm{ch}\,V_\Lambda + \mathrm{ch}\,V_\Lambda^{tw})$. The standard formula for the $\theta$-fixed subspace is $\tfrac12(\mathrm{ch}\,V_\Lambda + \mathrm{tr}(\theta\mid V_\Lambda)\,)$, where the second term is the **graded trace of the $-1$ involution on $V_\Lambda$ itself**, not the character of the twisted module $V_\Lambda^{tw}$. (The twisted module enters only at row 3 of the orbifold construction.) As written the row-2 formula is incorrect.

## Underspecified or unverifiable claims

- **`vertex-operator-algebras.html:617` — $V^\natural=V_\Lambda^+\oplus V_\Lambda^{tw,+}$.** Notation $V_\Lambda^{tw,+}$ is not introduced; standard FLM writes $V^\natural=V_\Lambda^+\oplus (V_\Lambda^T)^+$ where $V_\Lambda^T$ is the unique irreducible $\theta$-twisted $V_\Lambda$-module and the outer "+" is again $\theta$-fixed points. Substantively correct, but a reader cannot verify the equation without supplying the missing definition.
- **`vertex-operator-algebras.html:506` — "Unitary VOAs satisfy $c\ge 0$."** True, but understated: unitary rational VOAs at $c<1$ are restricted to the discrete series $c=1-6/(p(p+1))$ (Friedan–Qiu–Shenker); the page mentions the minimal-model formula one paragraph later but does not connect the two facts.
- **`vertex-operator-algebras.html:632` — class label "3A — order 3 (Fi24-related)".** The 3A centralizer in $\mathbb{M}$ involves $3\cdot Fi_{24}'$, so "Fi24-related" is roughly right but loose; a careful statement would say $C_\mathbb{M}(3A)\cong 3.Fi_{24}'$ rather than the parenthetical hand-wave. Not wrong, just imprecise.
- **`vertex-operator-algebras.html:451` — "$L_{-1}=T$ is the translation operator."** This is a *defining requirement* on $\omega$ (part of the conformal-vector axioms), not a derived property. The phrasing "two further demands fix $\omega$'s role" is fine but glosses the axiomatic status.

## Severity

**Minor.** All five sections' core mathematics (axioms, Virasoro relation, Zhu, FLM construction, BD chiral algebras) are correct and standard. The defects are localized: one sign error in a widget data array (3B at $q^3$), one mislabeled column in the V^♮ character widget that obscures the load-bearing fact $V^\natural_1=0$, and one incorrect orbifold-character formula in the FLM construction table. None of the boxed identities or narrative theorems are misstated. Fix the three numerics/labels and the page is clean.
