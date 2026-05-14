# Math-correctness audit — `calabi-yau-manifolds.html`

## Verified claims

**§1 Definition / Yau's theorem.** Adjunction line $K_X = \mathcal O(d-n-1)|_X$ for a degree-$d$ hypersurface in $\mathbb P^n$ (line 306, 354) is correct; the CY window $d = n+1$ recovers cubic-in-$\mathbb P^2$ (elliptic), quartic-in-$\mathbb P^3$ (K3), quintic-in-$\mathbb P^4$ — correct dimensions 1, 2, 3. Calabi 1954 conjecture / Yau 1976 theorem attribution and the "Ricci-flat is not flat" caveat (line 277) are correct. SU($n$) holonomy characterisation matches the standard four-way equivalence.

**§2 Hodge diamond.** Hodge symmetry $h^{p,q}=h^{q,p}$ and Serre duality $h^{p,q}=h^{n-p,n-q}$ correct. CY-3 reduction to $(h^{1,1},h^{2,1})$ with $\chi = 2(h^{1,1}-h^{2,1})$ (line 513) correct. Strict-CY corner identities $h^{0,0}=h^{n,0}=1$ and vanishing of $h^{i,0}$ for $0<i<n$ correct.

**§3 Examples.**
- Elliptic curve diamond `1; 1,1; 1` ✓.
- K3: $h^{1,1}=20$, $b_2=22$, $\chi=24$, intersection lattice $E_8(-1)^{\oplus 2} \oplus U^{\oplus 3}$ (line 549) — all correct (the unique even unimodular lattice of signature $(3,19)$).
- Quintic in $\mathbb P^4$: $(h^{1,1},h^{2,1})=(1,101)$, $\chi=-200$, 101-dim complex moduli ✓.
- $(3,3)$ CICY in $\mathbb P^5$: $\sum d_i = 6 = n+1$ ✓; $(h^{1,1},h^{2,1})=(1,73)$, $\chi=-144$ ✓.
- Tian–Yau 3-fold $(14,23)$, $\chi=-18$ — matches the 1986 Tian–Yau quotient construction.
- "$\sim$473 million reflexive 4D polytopes" (Kreuzer–Skarke): exact count 473,800,776 ✓.
- General CICY criterion $\sum d_i = n+1$ in $\mathbb P^n$ (line 618) — correct via $K_X = \mathcal O(\sum d_i - n - 1)|_X$.

**§4 Periods / Picard–Fuchs.** Period definition, Gauss–Manin transport, and order-4 PF equation for the mirror quintic stated as
$$\mathcal L = \theta^4 - 5z(5\theta+1)(5\theta+2)(5\theta+3)(5\theta+4),\quad z=(5\psi)^{-5}$$
(line 644) — this is the canonical Candelas–de la Ossa–Green–Parkes form ✓. Elliptic-curve specialisation $\int_A dz = 1, \int_B dz = \tau$ ✓.

**§5 Mirror symmetry.** Hodge-number swap statement ✓; A/B-side dictionary (Kähler ↔ complex moduli, symplectic ↔ complex, GW ↔ periods, IIA ↔ IIB) is the standard table. CDOGP 1991 prediction $n_1=2{,}875,\ n_2=609{,}250,\ n_3=317{,}206{,}375,\ n_4=242{,}467{,}530{,}000$ (line 778) — all four match the canonical reference values; $n_1=2875$ is Schubert's count, $n_2=609{,}250$ is the corrected Katz value. Givental / Lian–Liu–Yau attribution of rigorous proof ✓. HMS statement $D^b\mathrm{Coh}(X) \simeq D^\pi\mathrm{Fuk}(Y)$ with split-closure ✓; Polishchuk–Zaslow (elliptic), Seidel (quartic K3, genus-2), Sheridan (CY/Fano hypersurfaces) attribution ✓. Mirror Euler relation $\chi(X)=-\chi(Y)$ in the widget ✓.

**§6 Applications.** SU(3) holonomy ↔ $\mathcal N=1$ SUSY in 4D ✓; Candelas–Horowitz–Strominger–Witten 1985 reference is correct. DT for CY 3-fold: virtual dimension 0 from perfect obstruction theory (Thomas 2000) ✓. MNOP / GW–DT correspondence attribution ✓. SYZ 1996 special-Lagrangian $T^3$-fibration ✓; Gross–Wilson and Gross–Siebert tropical-degeneration follow-up ✓.

## Wrong / dubious claims

**`calabi-yau-manifolds.html:269` — "$c_1(X) = 0 \in H^2(X,\mathbb R)$" listed as equivalent to $K_X \cong \mathcal O_X$.** Vanishing of $c_1$ in **real** cohomology only forces $K_X$ to be a *torsion* line bundle (some power $K_X^{\otimes m} \cong \mathcal O_X$); it is not equivalent to $K_X \cong \mathcal O_X$ (which corresponds to $c_1 = 0$ in $H^2(X,\mathbb Z)$ modulo torsion, i.e. integrally). For a hyperelliptic surface or an Enriques surface, $c_1 = 0$ in $H^2(\cdot,\mathbb R)$ but $K$ is non-trivial torsion. The four bullets are equivalent only if the first uses integral cohomology (or one passes to a finite étale cover). Either flip the first bullet to $H^2(X,\mathbb Z)$, or note the torsion subtlety explicitly.

## Underspecified or unverifiable claims

- **`:275` "strict CY" requiring simply-connected ($\pi_1=0$)** — strict-CY definitions in the literature use $h^{i,0}=0$ for $0<i<n$, which implies $b_1 = 0$ but not literally $\pi_1=0$ (e.g. Enriques-type quotients can have torsion $\pi_1$ while satisfying the Hodge-vanishing). The parenthetical is loose but standard shorthand.
- **`:552` "101-dim variety" of complex structures on the quintic modulo PGL$_5$** — true at the infinitesimal / smooth-locus level; the global quotient stack has automorphism subtleties not addressed.
- **`:569` Tian–Yau "non-simply-connected" / "non-toric"** — accurate but the construction (free $\mathbb Z_3$ quotient of the $(3,3)$ CICY in $\mathbb P^2 \times \mathbb P^2$) is not stated; reader can't independently verify the $(14,23)$ Hodge numbers from the prose alone.
- **`:618` Yau's finiteness conjecture** — stated as open, which is correct, but the precise form (finitely many topological types up to diffeomorphism vs. up to deformation equivalence) is not pinned down.
- **`:869` MNOP "partly proved"** — fair as of the text's vintage; Pandharipande–Pixton (2014) and subsequent work have proved substantial portions, so the hedge is conservative-correct, not wrong.
- **`:872` SYZ "established near the large-complex-structure limit by Gross–Wilson"** — Gross–Wilson handled K3 (dim 2). The full SYZ conjecture for CY 3-folds remains open in the differential-geometric formulation; the prose conflates the dim-2 result with the general case.
- **`:850` Seidel "for the genus-2 surface"** — Seidel proved HMS for the genus-2 *curve* (its symmetric product enters the Fukaya category) and for the quartic K3; "genus-2 surface" is ambiguous wording.

## Severity

**Minor.** One real but subtle error in the four-way CY definition (the $H^2(\cdot,\mathbb R)$ vs $H^2(\cdot,\mathbb Z)$ slip at line 269, which makes the claimed equivalence false on torsion-canonical surfaces like Enriques and bielliptic). All quantitative claims — adjunction, Hodge numbers, $\chi$, lattice $E_8^2 \oplus U^3$, CDOGP curve counts $n_1$–$n_4$, Picard–Fuchs operator, Kreuzer–Skarke polytope count, MNOP / SYZ / HMS attributions — are correct. Recommend tightening the first bullet of §1 to integral cohomology (or adding a one-line "modulo torsion" caveat) and clarifying the Gross–Wilson / Seidel attributions.
