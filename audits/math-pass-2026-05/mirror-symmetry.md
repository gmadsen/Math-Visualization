# mirror-symmetry.html — math-correctness audit

## Verified claims

**§1.** CY 3-fold definition; Hodge swap $h^{1,1}(X)=h^{2,1}(Y)$; $\chi(Y)=-\chi(X)$; quintic $(1,101)$; bicubic in $\mathbb{P}^2{\times}\mathbb{P}^2$ as bidegree-(3,3) with $(2,83)$; rigid-CY caveat.

**§2.** Greene–Plesser orbifold $\{\sum x_i^5 - 5\psi\prod x_i\}/(\mathbb{Z}/5)^3$ (max phase symmetry $(\mathbb{Z}/5)^4$ with $\sum a_i\equiv 0$ mod diagonal). All five CdGP integer BPS counts $n_1{=}2875,\ldots,n_5{=}229{,}305{,}888{,}887{,}625$ match the 1991 paper. Schubert 1879, Katz 1986, Givental / Lian–Liu–Yau attributions correct.

**§3.** $\overline\partial_J f=0$ with $J$ tame against $\omega$; vdim$=0$ at $g=0,n=0$, CY 3-fold; Aspinwall–Morrison identity $\sum N_\beta q^\beta=\sum n_\beta\sum_k k^{-3}q^{k\beta}$; symplectic-class-only dependence.

**§4.** Picard–Fuchs operator $\theta^4 - 5z(5\theta+1)(5\theta+2)(5\theta+3)(5\theta+4)$ is the canonical CdGP normalization. $\Pi_0(z)=\sum (5n)!/(n!)^5 z^n$. Conifold $|z|=5^{-5}$ matches both leading-symbol singularity and radius of convergence. Mirror map $q=\exp(\Pi_1/\Pi_0)$.

**§5.** Kontsevich's $D^b\mathrm{Coh}(X)\cong D^\pi\mathrm{Fuk}(Y)$; Fukaya objects + Floer morphisms; $\dim\mathrm{Hom}^*(\mathcal{O}_x,\mathcal{O}_x)=1{+}3{+}3{+}1=8$ via Koszul ($\mathrm{Ext}^i=\wedge^i T_x X$); proven cases (Polishchuk–Zaslow / Seidel / Sheridan / Abouzaid / FLTZ).

**§6.** Special-Lagrangian $T^3$-fibration calibrated by $\mathrm{Re}\,\Omega$; dual fibration $\check Y_b=\mathrm{Hom}(T^3_b,U(1))$; Gross–Siebert reformulation.

## Wrong / dubious claims

**mirror-symmetry.html:387 — display $F^X_0$ has wrong $N_d$ coefficients.** Aspinwall–Morrison gives $N_d=\sum_{k|d}n_{d/k}/k^3$, so $N_2=609{,}250+2875/8=4{,}876{,}875/8\approx 609{,}609$, $N_3\approx 317{,}206{,}481.5$. The displayed $609{,}250/8$ and $317{,}206{,}375/27$ look like $n_d/d^3$ with the multi-cover sum dropped — neither matches $N_d$.

**mirror-symmetry.html:669 (widget JS) — same formula, also wrong.** Reads `2875 q + 4876875/2 q^2`; correct $N_2 = 4{,}876{,}875/8$ (off by ×4).

**mirror-symmetry.html:284 — "Generic Schoen 3-fold" with $(h^{1,1},h^{2,1})=(3,55)$ is mislabeled.** Schoen's CY 3-fold (1988, fiber product of two rational elliptic surfaces) has $h^{1,1}=h^{2,1}=19$ — Euler char 0, self-mirror. $(3,55)$ is some other CICY.

**mirror-symmetry.html:283 — "Complete intersection $(2,2,2,4)$" is not a valid CY multidegree.** CY in $\mathbb{P}^7$ requires $\sum d_i=8$, but $2+2+2+4=10$. The numbers $(1,73)$ match the standard CICYs $(3,3)\subset\mathbb{P}^5$ or $(2,2,3)\subset\mathbb{P}^6$.

**mirror-symmetry.html:274 — "flipped about its vertical axis".** The Hodge diamond is already left–right symmetric ($h^{p,q}=h^{q,p}$); reflection about the vertical axis is the identity and does NOT swap $h^{1,1}\leftrightarrow h^{2,1}$. Mirror is reflection about a 45° diagonal (equivalently 90° rotation): $h^{p,q}(X)=h^{n-p,q}(Y)$.

**mirror-symmetry.html:471 — "$\dim HF^*(L,L)=\chi(T^3)\cdot\mathrm{rank}$".** $\chi(T^3)=0$, so this product is 0 and cannot equal the value 8 it is being matched to. Correct: $HF^*(T^3,T^3)\cong H^*(T^3)$, so $\dim=2^3=8$.

## Underspecified or unverifiable claims

**:368 — vdim formula** drops the $(1-g)$ factor and $+n$ term; OK at $g=0,n=0$ but loose vs. Cox–Katz.

**:692–715 (gw widget JS)** labels every degree-$d$ stable map's source as a "chain of $d$ copies of $\mathbb{P}^1$". Generic degree-$d$ map has a smooth $\mathbb{P}^1$ source; only boundary points are nodal, and components don't index by degree. Pedagogical simplification, not strictly false.

**:471 — "Euler pairing on $K^0$ matches symplectic intersection on $H_n(Y,\mathbb{Z})$"** uses unspecified $n$; should be $H_3$ for the 3-fold case (both pairings skew via Serre duality).

**:430 (note) — "other three solutions involve $\log z$ to powers 1, 2, 3"** correctly identifies the MUM basis but readers may misread as pure $\log^k z$ rather than $\Pi_0\log^k z + (\text{corrections})$.

## Severity

**Moderate.** Conceptual scaffolding solid. Concrete fixes:

1. **$F^X_0$ coefficients (lines 387, 669)** — wrong arithmetic; replace with honest $N_d$ values or unfactored BPS form.
2. **"Generic Schoen 3-fold" (line 284)** — rename or use Schoen's actual $(19,19)$.
3. **"Complete intersection $(2,2,2,4)$" (line 283)** — relabel as $(3,3)\subset\mathbb{P}^5$ or $(2,2,3)\subset\mathbb{P}^6$.
4. **"Flipped about its vertical axis" (line 274)** — change to "reflected about its 45° diagonal".
5. **"$\chi(T^3)\cdot\mathrm{rank}$" (line 471)** — replace with $\dim H^*(T^3)=2^3=8$.

None undermine the pedagogical arc; #1, #2, #3, #5 are wrong-on-arithmetic mistakes a careful reader will catch.
