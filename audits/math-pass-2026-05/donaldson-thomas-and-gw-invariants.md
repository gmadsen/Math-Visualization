# Math-correctness audit — `donaldson-thomas-and-gw-invariants.html`

## Verified claims (sections)

- **§1 ideal sheaves.** Definition of $\mathcal I_Z$ (rank-1 torsion-free, $c_1=0$) and identification $I_n(X,0)=\mathrm{Hilb}^n(X)$ are correct. The Chern character pinning $\mathrm{ch}_2=-\beta$, $\mathrm{ch}_3=-n$ matches MNOP I conventions.
- **§1 widget MacMahon coefficients.** `macmahonCoeffs(N)` produces $1,1,3,6,13,24,48,86,160,282,500,859,1479,\ldots$ — agrees exactly with OEIS A000219 (plane partitions).
- **§2 virtual dimension on CY3.** Serre-duality argument $\mathrm{Ext}^i\cong\mathrm{Ext}^{3-i,\vee}$ pairing deformations with obstructions, hence $\mathrm{vd}=0$, is correct.
- **§2 Behrend formula.** $\nu(x)=(-1)^{\dim_x M}(1-\chi(\mathrm{MF}_x))$ matches Behrend (Annals 2009).
- **§3 degree-zero DT.** $Z_{\mathrm{DT}}(X;q,0)=M(-q)^{\chi(X)}$ correct (Behrend–Fantechi / Levine–Pandharipande / Li).
- **§3 quintic Euler characteristic.** $\chi(\text{quintic})=-200$ correct.
- **§3 plane-partition asymptotics.** $\log p_3(n)\sim c\,n^{2/3}$ correct (Wright 1931).
- **§4 GW virtual dimension.** $\mathrm{vd}=\int_\beta c_1(X)+(\dim X-3)(1-g)+n$ standard.
- **§4 quintic genus-0 BPS counts.** $n^0_d = 2{,}875,\ 609{,}250,\ 317{,}206{,}375$ for $d=1,2,3$ matches Candelas–de la Ossa–Green–Parkes (1991).
- **§4 GV formula.** $\sum_g\mathrm{GW}_{g,\beta}u^{2g-2}=\sum_g n^g_\beta\sum_d\frac1d(2\sin\frac{du}{2})^{2g-2}Q^{d\beta}$ matches Gopakumar–Vafa.
- **§5 MNOP substitution & history.** $q=-e^{iu}$, attribution to MNOP 2003 preprint and MOOP toric proof correct.
- **§6 trivial vertex.** $C_{\emptyset\emptyset\emptyset}(q)=M(q)$ correct; $\rho=(-\frac12,-\frac32,\ldots)$ standard.
- **§7 quantum dilogarithm.** $\mathbb E_q(x)=\prod_{k\ge0}(1+q^{k+1/2}x)^{-1}$ matches Faddeev convention.

## Wrong / dubious claims (with file:line)

- **`donaldson-thomas-and-gw-invariants.html:811` — wrong genus-0 conifold formula.** Says "$\sum_d \mathrm{GW}_{0,d}\,Q^d = -\sum_d Q^d/d^2$." Correct value is $\sum_d Q^d/d^3$ (the multiple-cover formula gives $\mathrm{GW}_{0,d}=1/d^3$, no minus sign). This contradicts the widget's own step-1 line, which uses $(2\sin(du/2))^{-2}$ — leading $u^{-2}$ coefficient is $\sum Q^d/d^3$, not $1/d^2$.
- **`donaldson-thomas-and-gw-invariants.html:836` — sign-flipped conifold partition function.** Step 5 claims "Both sides equal $\prod_{d\ge1}(1-q^d Q)^{-d}$." The correct reduced conifold series is $Z'_{\mathrm{DT}} = \prod_{d\ge1}(1-(-q)^d Q)^d$ (positive exponent $d$, with $-q$ inside). The widget's own step-2 datum on line 940 (`∏_d (1 − (−q)^d Q)^d`) is correct and contradicts step 5.
- **`donaldson-thomas-and-gw-invariants.html:368` — overstated singularity claim.** "$\mathrm{Hilb}^n(\mathbb C^3)$ is generically singular for $n\ge4$." On the principal (smoothable) component the open locus of $n$ distinct points is smooth; the space is generically smooth and irreducible for small $n$. Reducibility of $\mathrm{Hilb}^n(\mathbb A^3)$ (Iarrobino) only sets in at much larger $n$. Correct statement: starts to acquire non-smoothable / obstructed boundary loci, with extra components appearing eventually.
- **`donaldson-thomas-and-gw-invariants.html:823` — garbled step-2 algebra.** "$2\sin(du/2)=(e^{idu/2}-e^{-idu/2})/i = -i\cdot q^{d/2}(1-q^{-d})/$" has a dangling `/` and the substitution $q=-e^{iu}$ makes $q^{d/2}$ branch-ambiguous; the manipulation as written doesn't follow.
- **`donaldson-thomas-and-gw-invariants.html:898` — incomplete vertex prefactor.** Closed form is missing the second framing factor: standard ORV/AKMV is $C_{\lambda\mu\nu}=q^{(\kappa(\lambda)+\kappa(\nu))/2}s_{\nu^t}(q^\rho)\sum_\eta\ldots$ The page omits $\kappa(\nu)/2$. (Conventions vary by source, but the asymmetric form on the page is non-standard.)

## Underspecified or unverifiable claims

- **PT (Pandharipande–Thomas) invariants** — listed in the audit prompt but completely absent from the page. The DT/PT correspondence is the natural complement to MNOP (DT/GW) and a coverage gap rather than an error.
- **§5 "proved for the quintic" (line 796).** MNOP for the quintic is true in low degree by direct check, but a *full* MNOP proof for the quintic at all degrees is not in the literature; usually attributed in genus-0 only via Pandharipande–Pixton's GV-side results. Attribution is loose.
- **§3 worked example "$(x^2,xy,y^2)$ for $n=3$"** in widget readout is colength 3 as stated, but the alternative `(x^n,y)` listed for n=3 is colength n, ok. The "or" alternatives in the readout (line 343–349) are not all monomial ideals of the stated colength — `$(x^2, y^2, xy)$ plus a tangent direction` for $n=4$ is informal at best.
- **§7 "Joyce / KS wall-crossing"** — the Hall-algebra identity is stated qualitatively; no concrete jump example is shown, so it cannot be numerically checked.

## Severity

**Moderate.** Two outright wrong formulas in the MNOP/conifold worked example (lines 811 and 836) are headline pedagogical content and contradict each other within the same widget. The Hilb^n(C^3) singularity claim (line 368) is overstated. Step-2 of the MNOP substitution widget (line 823) is algebraically broken. None of these is a structural misconception — the rest of the page (definitions, GV, MacMahon, MNOP statement, vertex, wall-crossing) is sound — but the conifold worked example is the most concrete computation on the page and currently misleads.
