# Math correctness audit — `geometric-measure-theory.html`

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.
Format per section: **Verified · Wrong/dubious · Underspecified · Severity**.

---

## §1 Functions of bounded variation (lines 259–523)

- **Verified.**
  - BV definition. $u\in L^1(\Omega)$ with distributional gradient $Du$ a finite vector-valued Radon measure: $\int u\,\partial_i\phi\,dx = -\int\phi\,d(D_iu)$ for $\phi\in C^1_c(\Omega)$ — standard (Ambrosio–Fusco–Pallara Def. 3.1). Correct.
  - Total variation as dual norm: $|Du|(\Omega) = \sup\{\int u\,\mathrm{div}\,\phi\,dx : \phi\in C^1_c(\Omega;\mathbb{R}^n), |\phi|\le 1\}$. Correct standard form (AFP Prop. 3.6).
  - **BV decomposition (Lebesgue–Radon–Nikodym):** $Du = \nabla u\,\mathcal{L}^n + (u^+-u^-)\nu_u\,\mathcal{H}^{n-1}\restriction J_u + D^c u$. Standard AFP Theorem 3.78 / Prop. 3.92. Each piece correctly characterized: AC (classical $\nabla u\in L^1$), jump (codimension-1 rectifiable jump set $J_u$ with two-sided traces $u^\pm$ and unit normal $\nu_u$), Cantor ($D^cu\perp\mathcal{L}^n$, vanishes on every $\mathcal{H}^{n-1}$-finite set). Correct.
  - **Counterexample lineup:** Heaviside on $\mathbb{R}$ has $H' = \delta_0$ — finite Radon measure, not in $L^1$, so $H\in\mathrm{BV}_{\mathrm{loc}}\setminus W^{1,1}_{\mathrm{loc}}$. Correct.
  - **Cantor staircase:** $\nabla u\equiv 0$ a.e., $J_u = \emptyset$, all variation in $D^cu$ with $|Du|([0,1]) = 1$ (since the function is monotone $0\to 1$). Correct canonical $\mathrm{BV}\setminus W^{1,1}$ example.
  - $L^1$-lower-semicontinuity of $|Du|$ and $\mathrm{BV}\hookrightarrow L^1$ Rellich-style compactness — standard (AFP Thm. 3.23, 3.49). Correct.
  - **Coarea identity** $|Du|(\Omega) = \int_\mathbb{R}|D\chi_{\{u>t\}}|(\Omega)\,dt$ — standard BV coarea (Fleming–Rishel 1960; AFP Thm. 3.40). Correct.
  - **BV widget** (lines 278–507): Total variation budgets:
    - AC slope $0.4$, $|Du|_{AC} = \int_0^1 0.4\,dt = 0.4$ ✓.
    - $N$ jumps each of amplitude $A$ (same sign), $|Du|_{Jump} = N\cdot|A|$ ✓.
    - Cantor weight $C\cdot$(Cantor staircase), TV $= C\cdot 1 = C$ since the Cantor function is monotone $0\to 1$ ✓.
  - The piecewise-segment plotting takes left limits at jump points (lines 419–422), so the cyan curve respects discontinuities — geometrically correct rendering of a càdlàg-style function. Correct.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §2 Sets of finite perimeter and reduced boundary (lines 525–688)

- **Verified.**
  - Finite-perimeter definition $\chi_E\in\mathrm{BV}_{\mathrm{loc}}$, $P(E) = |D\chi_E|(\mathbb{R}^n) = \sup\{\int_E\mathrm{div}\,\phi\,dx : |\phi|\le 1\}$. Correct (De Giorgi 1954; AFP Def. 3.35).
  - Compatibility with smooth case: divergence theorem ⇒ $P(E) = \mathcal{H}^{n-1}(\partial E)$ when $\partial E$ is smooth. Correct.
  - **Reduced boundary** $\partial^*E$ defined as set of $x$ where $\nu_E(x) = -\lim_{r\to 0}D\chi_E(B_r(x))/|D\chi_E|(B_r(x)) \in S^{n-1}$ exists, with $|D\chi_E|(B_r(x))>0$ for all $r>0$. **Sign-check:** the page also asserts $D\chi_E = -\nu_E\mathcal{H}^{n-1}\restriction\partial^*E$, which forces $\lim D\chi_E(B_r)/|D\chi_E|(B_r) = -\nu_E(x)$, hence the leading minus sign in $\nu_E = -\lim\ldots$. Internally consistent. Standard convention: $\nu_E$ is the outward unit normal, $D\chi_E$ points inward (since $\chi_E$ jumps from 1 inside to 0 outside).
  - **De Giorgi structure theorem** (AFP Thm. 3.59): $\partial^*E$ countably $(n-1)$-rectifiable, $\nu_E$ Borel, $|D\chi_E| = \mathcal{H}^{n-1}\restriction\partial^*E$, $P(E) = \mathcal{H}^{n-1}(\partial^*E)$, $D\chi_E = -\nu_E\mathcal{H}^{n-1}\restriction\partial^*E$. All correct.
  - **Square example:** $\partial^*((0,1)^2)$ = four open edges; the four corners drop out as $\mathcal{H}^1$-null (a 4-point set). $P = 4$. Correct.
  - **Koch snowflake** has finite Lebesgue area but infinite perimeter (the prefractal perimeters $\to\infty$ as $(4/3)^k\to\infty$). Correct exclusion from finite-perimeter class.
  - **Isoperimetric inequality** $P(E)\ge n\omega_n^{1/n}|E|^{(n-1)/n}$ with equality only on balls. Sanity check: ball $B_R$ has $|E| = \omega_n R^n$, $P(E) = n\omega_n R^{n-1}$, ratio $P/|E|^{(n-1)/n} = n\omega_n R^{n-1}/(\omega_n R^n)^{(n-1)/n} = n\omega_n^{1/n}$. ✓ Equality on the ball.
  - **Perimeter widget** (lines 544–681):
    - Each Koch subdivision multiplies perimeter by $4/3$: each edge of length $L$ replaced by 4 edges of length $L/3$, total $4L/3$. ✓ Readout matches $(4/3)^k$ analytically.
    - Square initial perimeter 4, disk-16-gon initial perimeter $\approx 3.1214$ ($16\cdot 2\sin(\pi/16)\cdot 0.5 \approx 3.121$). Both correct base values; widget reports them correctly.
    - Bounded area growth as $k\to\infty$, $P\to\infty$ — correct Koch limit.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §3 Rectifiable sets and Hausdorff measure (lines 690–905)

- **Verified.**
  - **Countable $k$-rectifiability** definition: $\mathcal{H}^k$-almost all of $S$ contained in countable union of Lipschitz images of subsets of $\mathbb{R}^k$. Standard (Mattila Ch. 15; AFP Def. 2.57). Correct.
  - **Approximate tangent planes** at $\mathcal{H}^k$-a.e. $x\in S$ (rectifiable). Standard consequence of Rademacher applied to the Lipschitz parametrizations. Correct.
  - **Besicovitch–Federer projection theorem.** A purely $k$-unrectifiable set in $\mathbb{R}^n$ projects to $\mathcal{L}^k$-measure zero on $\gamma_{n,k}$-a.e. $k$-plane. The page phrases "$\mathcal{H}^{k(n-k)}$-almost every $k$-plane," referring to the natural Hausdorff measure on the Grassmannian $G(n,k)$, which has dimension $k(n-k)$ — consistent with the rotation-invariant measure $\gamma_{n,k}$. Correct (Mattila Thm. 18.1).
  - **Density characterization** $\Theta^k(S,x) = \lim_r\mathcal{H}^k(S\cap B_r(x))/(\omega_k r^k)$. Forward direction (rectifiable ⇒ $\Theta^k = 1$ a.e.) is older (Besicovitch in 1D, Marstrand/Mattila in higher dim). Converse (positive finite density a.e. ⇒ rectifiable) is **Preiss's theorem (1987)** — the page attributes to "Besicovitch, Marstrand, Mattila" without naming Preiss explicitly, which slightly under-credits the converse direction. Mathematically the statement is correct; attribution is loose.
  - **De Giorgi structure ⇒ $\partial^*E$ is the canonical rectifiable example.** Correct.
  - **4-corner Cantor set** in the plane has $\dim_H = 1$ exactly, is purely $1$-unrectifiable, has positive finite $\mathcal{H}^1$-measure (Garnett class), and projects to Lebesgue-null on a.e. line. Correct.
  - **Rectifiability widget** (lines 707–890):
    - Circle of radius $0.5$: every projection is an interval of length $1$ ✓.
    - 4-corner Cantor IFS at depth 4 with ratio $1/4$: 256 leaf cells, each of side $4^{-4} = 1/256$. Hausdorff dim from $4(1/4)^s = 1 \Rightarrow s = 1$ ✓.
    - "Occupied length" via 100-bin histogram on the projected discrete cloud: a heuristic proxy for $\mathcal{H}^1$ of the projected Cantor set; correctly behaves "small for most $\theta$" pedagogically. Numerical value should not be read as the literal $\mathcal{H}^1$ — it's a discrete-binning approximation.
- **Wrong/dubious.** None.
- **Underspecified.** Preiss's theorem attribution as noted above. The widget's "$H^1(\pi_\theta(S))$" readout is a binning count, not a true Hausdorff $1$-measure of the projected Cantor set; conceptually right (collapses for most $\theta$) but the absolute numerical value isn't $\mathcal{H}^1$-meaningful.
- **Severity.** None.

## §4 Area and coarea formulas (lines 907–1202)

- **Verified.**
  - **Area formula** for Lipschitz $f:\mathbb{R}^k\to\mathbb{R}^n$, $k\le n$, Borel $A\subset\mathbb{R}^k$:
    $$\int_A J_f\,d\mathcal{L}^k = \int_{\mathbb{R}^n}\mathcal{H}^0(A\cap f^{-1}(y))\,d\mathcal{H}^k(y).$$
    Standard (Federer 3.2.3; Evans–Gariepy Thm. 3.7). $k$-Jacobian $J_f = \sqrt{\det(Df^TDf)}$. Multiplicity factor $\mathcal{H}^0(A\cap f^{-1}(y))$ is the cardinality of the preimage. Correct, with injective case reducing to classical change-of-variables $\mathcal{H}^k(f(A)) = \int_A J_f\,d\mathcal{L}^k$. Correct.
  - **Coarea formula** for Lipschitz $u:\mathbb{R}^n\to\mathbb{R}^m$, $m\le n$, integrable $g$:
    $$\int_{\mathbb{R}^n} g\,J_u\,d\mathcal{L}^n = \int_{\mathbb{R}^m}\Bigl(\int_{u^{-1}(y)} g\,d\mathcal{H}^{n-m}\Bigr)d\mathcal{L}^m(y).$$
    Standard (Federer 3.2.11; Evans–Gariepy Thm. 3.10). $J_u = \sqrt{\det(Du Du^T)}$ (note: order swapped from area-formula convention because $u$ goes high-dim → low-dim). Correct.
  - **Sard-style level-set rectifiability:** for $\mathcal{L}^m$-a.e. $y$, $u^{-1}(y)$ is $(n-m)$-rectifiable. Correct (consequence of coarea + a.e. existence of approximate gradient).
  - **Special case $m=1, g=1$:** $\int_\Omega|\nabla u|\,dx = \int_{-\infty}^\infty\mathcal{H}^{n-1}(\Omega\cap\{u=t\})\,dt$. ✓ The 1-Jacobian for $m=1$ reduces to $|\nabla u|$.
  - **BV-coarea upgrade:** $|Du|(\Omega) = \int|D\chi_{\{u>t\}}|(\Omega)\,dt$ — Fleming–Rishel 1960, AFP Thm. 3.40. Correct.
  - **Coarea widget** (lines 928–1195) — analytic check of each preset:
    - **Paraboloid** $u = x^2+y^2$: $|\nabla u| = 2r$, $\int_{B_1}|\nabla u| = \int_0^{2\pi}\int_0^1 2r\cdot r\,dr\,d\theta = 4\pi/3 \approx 4.189$ ✓. Level set $\{u=t\}$ for $t\in[0,1]$ is the circle of radius $\sqrt{t}$, $\mathcal{H}^1 = 2\pi\sqrt{t}$. Cavalieri $\int_0^1 2\pi\sqrt{t}\,dt = 2\pi\cdot 2/3 = 4\pi/3$ ✓.
    - **Saddle** $u = x^2-y^2$: $|\nabla u| = 2\sqrt{x^2+y^2} = 2r$, same integral $4\pi/3$ ✓.
    - **Cone** $u = \sqrt{x^2+y^2}$: $|\nabla u| = 1$ a.e., $\int_{B_1} 1 = \pi$ ✓. Level set $\{u=t\}$ is circle radius $t$, $\mathcal{H}^1 = 2\pi t$, $\int_0^1 2\pi t\,dt = \pi$ ✓.
    - **Ridge** $u = |x|$: $|\nabla u| = 1$ a.e., $\int_{B_1} = \pi$ ✓. Level set is two vertical chords at $x = \pm t$, each of length $2\sqrt{1-t^2}$, total $4\sqrt{1-t^2}$. $\int_0^1 4\sqrt{1-t^2}\,dt = 4\cdot\pi/4 = \pi$ ✓.

- **Wrong/dubious.**
  - **Saddle widget closed-form at $t=0$ is off by $\sqrt{2}$.** Lines 1040–1043, the special-case branch:
    > if(Math.abs(t) < eps) … `return 2 * Math.sqrt(2);`
    The level set $\{x^2 = y^2\}\cap B_1$ is two diagonal chords $y = \pm x$ clipped to the unit disk. Each chord runs from $(-1/\sqrt 2,\mp 1/\sqrt 2)$ to $(1/\sqrt 2,\pm 1/\sqrt 2)$, with length $\sqrt{(2/\sqrt 2)^2 + (2/\sqrt 2)^2} = \sqrt{2+2} = 2$. Two chords ⇒ $\mathcal{H}^1 = 4$, not $2\sqrt 2 \approx 2.83$. The accompanying comment is internally muddled ("chord length $2$ … $= \sqrt 2$"). Net effect on the Cavalieri sum is at most $O(1/N)$ since $t=0$ is a Lebesgue-null sample — cosmetic widget bug, not a math-claim error.

- **Underspecified.** None.
- **Severity.** **Trivial.** Singular-value widget closed-form off by $\sqrt 2$ at the measure-zero point $t=0$; no impact on the displayed Cavalieri-vs-analytic comparison.

## §5 Currents and Federer–Fleming compactness (lines 1204–1418)

- **Verified.**
  - **$k$-current** $T\in\mathcal{D}_k(\mathbb{R}^n)$ as continuous linear functional on $\mathcal{D}^k(\mathbb{R}^n)$ (smooth compactly-supported $k$-forms). Standard (Federer §4; Simon LSGMT §26). Correct.
  - **Integration current** $\langle [M],\omega\rangle = \int_M\omega$ for oriented submanifold $M$. Correct.
  - **Boundary** $\partial T$ via $\langle\partial T,\eta\rangle = \langle T,d\eta\rangle$. Distributional adjoint of exterior derivative. For integration currents, Stokes ⇒ $\partial[M] = [\partial M]$. Correct.
  - **Mass** $\mathbf{M}(T) = \sup\{\langle T,\omega\rangle : \|\omega\|_\infty\le 1\}$. Generalizes $\mathcal{H}^k$: $\mathbf{M}([M]) = \mathcal{H}^k(M)$ for an oriented submanifold. Correct.
  - **Integral currents** $\mathbf{I}_k(\mathbb{R}^n)$: rectifiable, integer-valued multiplicity, $\mathcal{H}^k$-measurable orientation, $\partial T$ also rectifiable. Standard (Federer 4.1.24). Correct.
  - **Federer–Fleming compactness:** $T_j\in\mathbf{I}_k$ with $\mathrm{spt}(T_j)\subset K$ compact and $\mathbf{M}(T_j)+\mathbf{M}(\partial T_j)\le C$ admits a weakly convergent subsequence with limit $T\in\mathbf{I}_k$, satisfying lower-semicontinuity of mass and boundary mass. Standard (Federer 4.2.17). Correct hypotheses (the support-in-compact-set hypothesis is needed; without it mass can escape to infinity).
  - **Currents widget** (lines 1221–1404): mass $=$ sum of segment lengths; boundary tally at each vertex via (incoming $-$ outgoing) signed count. For a 1-current as oriented polygonal chain, $\partial T = \sum(\delta_{head} - \delta_{tail})$, so closed cycles cancel ✓. The "snap radius 6 px" vertex-key bucketing is an implementation detail to detect cancellations on a discretized canvas.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §6 Applications: Plateau, minimal surfaces, and Mumford–Shah (lines 1420–1707)

- **Verified.**
  - **Plateau's problem statement.** Given closed $(k-1)$-current $\Gamma$ with finite mass, find $k$-current $T$ with $\partial T = \Gamma$ minimizing $\mathbf{M}(T)$. Federer–Fleming gives existence: minimizing sequence has bounded $\mathbf{M}(T_j)$ (any competitor is upper bound) and $\mathbf{M}(\partial T_j) = \mathbf{M}(\Gamma)$ fixed; extract subsequence. Correct.
  - **Varifold.** Radon measure on $\mathbb{R}^n\times G(n,k)$. Forgets orientation, retains tangent-plane data. Correct (Allard 1972; Simon LSGMT §38).
  - **Stationary varifold:** first variation of mass under any compactly-supported diffeomorphism vanishes. Correct.
  - **Allard's regularity theorem.** Stationary integral varifold has support that is $C^{1,\alpha}$-submanifold $\mathcal{H}^k$-a.e. Correct (Allard 1972, with the precision that local $C^{1,\alpha}$ regularity holds where density is close to integer and mass excess is small; the "a.e." statement is the corollary).
  - **Singular minimizers in codimension 1.** Smooth in dimensions $n\le 7$; **Simons cone** $\{x_1^2+\cdots+x_4^2 = x_5^2+\cdots+x_8^2\}\subset\mathbb{R}^8$ first singular minimizer. Correct (Bombieri–De Giorgi–Giusti 1969). Attribution chain "Fleming, De Giorgi, Almgren, Simons" is reasonable (Simons proved the cone is stable; B–DG–G proved area-minimizing).
  - **Mumford–Shah functional** $\mathcal{E}(u,K) = \int_{\Omega\setminus K}(u-g)^2 + \alpha\int_{\Omega\setminus K}|\nabla u|^2 + \beta\,\mathcal{H}^{n-1}(K)$. Standard form (Mumford–Shah 1989). The fidelity term is over $\Omega\setminus K$ rather than $\Omega$, but since $K$ is null this is equivalent to the more common $\int_\Omega(u-g)^2$. Correct.
  - **SBV definition** $D^cu = 0$. Correct (Ambrosio 1989; AFP §4).
  - **Ambrosio's SBV compactness theorem (1989).** Bounded sequences in SBV with bounded $\mathcal{H}^{n-1}(J_u)$ and bounded $L^\infty$ have $L^1$-convergent subsequences with limit in SBV. Correct (AFP Thm. 4.7).
  - **De Giorgi–Carriero–Leaci density estimates.** Close the singular set $K = \overline{J_u}$. Correct (DGCL 1989).
  - **Brakke flow inequality** $\frac{d}{dt}\mathbf{M}(V_t)\le -\int|H|^2\,dV_t$. Correct in spirit; the precise Brakke condition is a one-sided distributional inequality $\bar D_t\mathbf{M}(V_t)(\phi)\le \int(\nabla\phi\cdot H - \phi|H|^2)\,dV_t$ for nonnegative test functions $\phi$, which specializes to the displayed form for $\phi\equiv 1$ when defined. Correct simplification.
  - **Plateau-2D widget readout** (lines 1571–1622): straight chord is unique mass-minimizer of 1-currents with $\partial T = \delta_B - \delta_A$. Trivially correct (Euclidean geodesic).
  - **Mumford–Shah 1D widget** (lines 1623–1697): standard piecewise-constant DP for the discrete 1D problem with $L = 0$ approximation on each segment (so $\alpha\int|\nabla u|^2 = 0$ on the recovered constants). Energy $= \sum(u-g)^2 + \beta\cdot|K|$ which matches the page's recovered minimizer. Correct.

- **Wrong/dubious.**
  - **Cheeger inequality conflation (line 1435).** The page writes
    > Cheeger constant $h(\Omega) = \inf P(E)/\min(|E|, |\Omega\setminus E|)$ … gives $\lambda_1(\Omega) \ge h(\Omega)^2/4$.
    The symmetric formulation with $\min(|E|,|\Omega\setminus E|)$ is the **Neumann / closed-manifold** Cheeger constant, and the controlled eigenvalue is the **first nonzero** eigenvalue (often denoted $\lambda_1$ in the closed-manifold setting where the zero eigenvalue from constants is understood, or $\lambda_2$ in the Neumann-Laplacian setting where $\lambda_1 = 0$ identically). For Dirichlet boundary conditions on a bounded domain, the Cheeger constant is the asymmetric $h_D(\Omega) = \inf_{E\subset\Omega} P(E,\Omega)/|E|$, and there $\lambda_1^D \ge h_D^2/4$. The page mixes the symmetric Cheeger constant with the symbol "$\lambda_1$" without specifying boundary conditions. Charitably read as "first nontrivial eigenvalue," the statement is correct for closed manifolds / Neumann; literally read as "lowest Dirichlet eigenvalue," the constant on the right is mis-paired. Minor pedagogical imprecision.

- **Underspecified.**
  - The mass-of-projection numerical readouts in the rectifiability widget (§3) and the Cheeger remark above both depend on conventions the prose doesn't fully pin down. Neither is a hard error.

- **Severity.** **Trivial-to-minor.** The Cheeger inequality phrasing conflates Neumann/closed-manifold and Dirichlet versions; the displayed bound is correct under either reading provided "$\lambda_1$" is interpreted in the matching convention.

## §7 Connections (lines 1709–1722)

- **Verified.** Cross-references to Hausdorff measure (substrate of $\mathcal{H}^k$), Sobolev/distributions (BV one rung above $W^{1,1}$), 1D classical BV, differential forms / Stokes (currents as distributional dual), variational direct method (existence theorems in §6 are direct-method instances), Atiyah–Singer (Allard regularity is microlocally elliptic). All correct in spirit; no false claims.
- **Wrong/dubious.** None.
- **Severity.** None.

---

## Quiz bank `quizzes/geometric-measure-theory.json`

### `gmt-bv-functions` — 3 v1
- **Verified.** Q1 (BV characterization): only choice 1 admits the Heaviside, and matches the distributional-Radon-measure definition ✓. Q2 (multi-select on the LRN decomposition): all four claims correct, including $W^{1,1}\subset\mathrm{BV}$ as the "AC-only" subclass ✓. Q3 (spot-the-error on TV-vanishing implies constant): correctly identifies step 3 as a vacuous "rigor add" — step 2 already proved $u$ constant on the connected interval. Pedagogically sound.

### `gmt-perimeter-sets` — 3 v1
- **Verified.**
  - Q1: smooth $\partial E$ ⇒ $P = \mathcal{H}^{n-1}(\partial E)$, $\partial^*E = \partial E$. Correct dimension and identification.
  - Q2 (matching): square→$P=4$ with corners null; disk→$P=2\pi$, $\partial^*E = \partial B_1$; Koch→$P=\infty$ excluded; half-space ∩ ball→piecewise-smooth, $P =$ disk + cap. Answer key `[3,1,0,2]` correctly aligns (using the page's left-to-right reading of `right` array).
  - Q3 (numeric): $P((0,1)^2) = 4$ ✓.

### `gmt-rectifiability` — 3 v1
- **Verified.**
  - Q1 (rectifiability characterization): Lipschitz-image cover is the right definition; (0) over-restricts to smooth submanifolds, (2) confuses $\dim_H$ with rectifiability (4-corner Cantor counterexample), (3) is one example. Correct.
  - Q2 (ordering of De Giorgi structure proof): `[3,1,2,0]` = define $\partial^*E$ → blow-up to half-space → Lipschitz-graph local cover → conclude. Standard outline. Correct.
  - Q3 (multi-select): unit circle, Lipschitz curve, smooth+Lipschitz curve all rectifiable; 4-corner Cantor purely $1$-unrectifiable. Answer `[0,1,3]` correct.

### `gmt-area-coarea` — 3 v1
- **Verified.**
  - Q1 (area-formula identification): only choice 1 includes the $\mathcal{H}^0$ multiplicity factor required for non-injective $f$. Correct.
  - Q2 (multi-select on coarea consequences): the $|\nabla u|$ identity, level-set rectifiability $\mathcal{L}^m$-a.e., BV upgrade to superlevel-perimeter — all true; "every $y$, smooth manifold" is wrong (rectifiable a.e., not smooth everywhere). Answer `[0,1,2]` correct.
  - Q3 (numeric): $\int_{B_1}|\nabla(x^2+y^2)| = 4\pi/3 \approx 4.18879$ ✓ (cross-checked above).

### `gmt-currents` — 3 v1
- **Verified.**
  - Q1 (boundary definition): $\langle\partial T,\eta\rangle = \langle T,d\eta\rangle$ ✓. Other choices either drop the test-form pairing or get the direction wrong.
  - Q2 (matching): mass↔dual-sup-over-forms, $\mathbf{M}(\partial T)$↔scalar bound, integral current↔rectifiable+integer-multiplicity, weak convergence↔pairing-by-pairing. Answer `[2,3,1,0]` correct.
  - Q3 (spot-the-error): correctly flags the loose summary "bounded mass" as missing the boundary-mass hypothesis. The full Federer–Fleming requires both bounds. Correct identification.

### `gmt-applications` — 3 v1
- **Verified.**
  - Q1 (Allard's regularity): $C^{1,\alpha}$ submanifold $\mathcal{H}^k$-a.e. on the support of a stationary integral varifold ✓. Simons cone counterexamples to "smooth everywhere" claim. Correct.
  - Q2 (ordering Mumford–Shah direct method): `[1,2,0,3,4]` = state energy → SBV reformulation → SBV compactness → lower-semicontinuity → conclude+DGCL closure. Standard direct-method skeleton. Correct.
  - Q3 (multi-select GMT applications): Plateau, Mumford–Shah, Cheeger all use BV/perimeter machinery; FFT-Radon inversion is microlocal/Fourier, not GMT. Answer `[0,1,2]` correct.

---

## Concept graph `concepts/geometric-measure-theory.json`

- **Verified.** All 6 concept entries well-formed. Anchors `bv-functions`, `perimeter`, `rectifiability`, `area-coarea`, `currents`, `applications` all match `<section id="…">` values in the topic HTML. Prereq edges sensible:
  - `gmt-bv-functions` ← `distributional-derivative`, `lp-spaces`, `bounded-variation` (cross-topic to sobolev, measure-theory, real-analysis).
  - `gmt-perimeter-sets` ← `gmt-bv-functions`.
  - `gmt-rectifiability` ← `gmt-perimeter-sets`, `hausdorff-measure` (cross-topic to measure-theory).
  - `gmt-area-coarea` ← `gmt-rectifiability`.
  - `gmt-currents` ← `gmt-rectifiability`, `stokes-derham` (cross-topic to differential-forms).
  - `gmt-applications` ← `gmt-area-coarea`, `gmt-currents`.
  Topology consistent with the page's narrative (BV → perimeter → rectifiability → area/coarea → currents → applications).
- **Wrong/dubious.** None.
- **Severity.** None.

---

## Summary

| Section | Severity | Notes |
|---|---|---|
| §1 BV functions | none | Decomposition, TV widget computations, Heaviside/Cantor counterexamples all correct |
| §2 Perimeter | none | De Giorgi structure theorem, sign conventions for $\nu_E$ vs $D\chi_E$, isoperimetric inequality all check; Koch-perimeter $(4/3)^k$ widget matches |
| §3 Rectifiability | none | Lipschitz-image definition, density characterization, Besicovitch–Federer projection all correct; Preiss attribution loose but mathematically right |
| §4 Area / coarea | trivial | Saddle widget closed-form $\mathcal{H}^1$ at $t=0$ is $2\sqrt 2$ where it should be $4$ — measure-zero singular point, cosmetic; analytic checks for paraboloid / cone / ridge all match |
| §5 Currents | none | Federer–Fleming hypotheses (mass + boundary-mass + compact-support) correctly stated |
| §6 Applications | trivial-to-minor | Cheeger inequality phrasing conflates Neumann/closed-manifold ($\min(|E|,|\Omega\setminus E|)$ denominator) with "$\lambda_1$" notation that is naturally Dirichlet; charitable reading correct, literal reading mis-pairs constant. All other claims (Plateau, Allard, Simons cone in $\mathbb{R}^8$, Mumford–Shah, SBV, Brakke) verified |
| Quiz banks | none | 18 questions across 6 concepts, all answer keys correct |
| Concept graph | none | 6 concepts, all anchors match, prereq DAG sensible |

**Overall severity: trivial.** One closed-form widget value at a measure-zero $t$ is off by $\sqrt 2$ (no impact on the displayed comparison), and one famous-inequality phrasing conflates two distinct Cheeger conventions (correct under the "first nontrivial eigenvalue" reading the page seems to intend). Every theorem statement, proof outline, widget analytic computation, and quiz answer key is otherwise correct.

**Notable patterns observed:**
- BV decomposition triple (AC + jump + Cantor) is consistently presented across §1, §6, the widget, and the concept blurb — internally consistent.
- Sign convention for the reduced-boundary normal: $\nu_E = -\lim D\chi_E(B_r)/|D\chi_E|(B_r)$ paired with $D\chi_E = -\nu_E\mathcal{H}^{n-1}\restriction\partial^*E$. The two are mutually consistent (gradient measure points inward, normal points outward).
- Coarea identity is correctly stated in three forms: smooth Lipschitz form (general), $m=1$ special case, and BV-superlevel form. Each appears in the right context.
- Federer–Fleming hypotheses (mass + boundary-mass + compact support) are precisely cited — and one quiz spot-the-error specifically tests the trap of dropping the boundary-mass bound.
- Hausdorff dimensions for the page's two key sets check: 4-corner Cantor with ratio $1/4$ (4-IFS) gives $\dim_H = 1$ via Moran $4(1/4)^s = 1$.
