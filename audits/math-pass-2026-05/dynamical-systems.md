# dynamical-systems — math correctness audit (2026-05)

**Section:** Analysis

## Verified claims

### Orbits, flows, and vector fields (§1)

- **Flow group law** (line 333): $\Phi_{t+s}=\Phi_t\circ\Phi_s,\ \Phi_0=\mathrm{id}$ — correct one-parameter group of diffeomorphisms.
- **Picard–Lindelöf statement** (line 336): $C^1$ (Lipschitz suffices) gives local existence and uniqueness; flow smooth in $(t,p)$ — standard.
- **Non-completeness example $\dot x=x^2$** (line 338): $x(t)=1/(1-t)$ blows up at $t=1$ — correct.
- **Three classifications of orbits** (line 334): fixed point / closed curve / non-self-intersecting path forever — correct.
- **Pendulum conservation** (line 362): $H=\tfrac12 y^2-\cos x$, orbits are level sets — verified (along orbit $\dot H = y\dot y + \sin x\,\dot x = -y\sin x + y\sin x = 0$).
- **Lotka–Volterra closed orbits around $(1,1)$** (line 363): correct (system has invariant $V=y-\ln y+x-\ln x$, orbits closed by Poincaré–Bendixson + nonlinear-center analysis).

### Fixed points and linearization (§2)

- **Hartman–Grobman statement** (line 460): hyperbolic ⇒ topological conjugacy to linear flow $e^{tDX(p^*)}$ — standard.
- **Hyperbolicity definition**: no eigenvalue on imaginary axis — correct.
- **$\dot x=-x^3$ degenerate case** (line 462): linearization vanishes; $V(x)=x^2$ Lyapunov-decreases ($\dot V=-2x^4$), so origin asymptotically stable — verified.
- **Sink/source/saddle/center classifications** (lines 466–469) — standard, correct.
- **Linear 2D classifier widget** (lines 500–549): trace/det/discriminant logic matches the standard $(\tr,\det)$ classification scheme exactly:
  - $\det<0$ → saddle ✓
  - $\det>0,\ \tr=0$ → center ✓
  - $\det>0,\ \tr<0,\ \tr^2>4\det$ → stable node ✓
  - $\det>0,\ \tr<0,\ \tr^2<4\det$ → stable spiral ✓
  - (positive-trace mirrors) ✓

### Phase portraits in 2D (§3)

- **$(\tr,\det)$ classification table** (lines 561–569) — correct standard atlas.
- **Hopf-like normal form** (line 571): $\dot x=\mu x-y-x(x^2+y^2),\ \dot y=x+\mu y-y(x^2+y^2)$ — verified to be polar Hopf form $\dot r=\mu r-r^3,\ \dot\theta=1$. Stable spiral for $\mu<0$, unstable spiral with stable limit cycle for $\mu>0$ — correct.

### Periodic orbits and limit cycles (§4)

- **Poincaré–Bendixson trichotomy** (line 672): fixed point / periodic orbit / homo-/heteroclinic connections — correct standard statement.
- **Sharpness in 2D** (line 674): chaos in 3D, planar non-crossing forces settling — correct.
- **Bendixson–Dulac** (line 676): simply connected $D$, $\phi>0$ smooth, $\operatorname{div}(\phi X)$ constant sign and not identically zero ⇒ no closed orbit — standard.
- **Polar limit-cycle prototype** (line 678): $\dot r=r(1-r^2),\ \dot\theta=1$ has unstable origin and stable limit cycle at $r=1$ — verified (sign of $\dot r$ changes at $r=1$).
- **Van der Pol** (line 678): $\ddot x+\mu(x^2-1)\dot x+x=0$ in standard form, equivalent first-order system, negative damping for $|x|<1$ — correct.
- **Stable limit cycle for all $\mu>0$** — correct standard fact.

### Iterated maps and the logistic family (§5)

- **Stability of fixed point** (line 739): multiplier $|f'(x^*)|<1$ — correct.
- **Logistic fixed points** (line 741): $0$ and $x^*=1-1/r$; multipliers $f_r'(0)=r$ and $f_r'(x^*)=2-r$ — verified ($f'(x)=r-2rx$, evaluate).
- **Stability transitions** (line 741): $0$ attracting for $r<1$, $x^*$ attracting for $1<r<3$, period-doubling at $r=3$ where multiplier crosses $-1$ — verified ($2-3=-1$).
- **Cobweb intuition** (line 743): "less steep than diagonal" ⟺ $|f'(x^*)|<1$ — correct.

### The period-doubling cascade (§6)

- **$r_2 \approx 3.449$** for first 4-cycle — correct ($r_2=1+\sqrt 6=3.44949\ldots$).
- **$r_\infty \approx 3.5699$** accumulation point — correct ($r_\infty=3.56994567\ldots$).
- **Feigenbaum constant $\delta\approx 4.66920$** (lines 822, 1176) — correct ($\delta=4.669201609\ldots$).
- **Universality across smooth unimodal families with quadratic maximum** (line 823) — correct (Coullet–Tresser, Feigenbaum, 1978).
- **Period-3 window opens at $r\approx 3.8284$** (line 825) — correct ($r=1+2\sqrt 2 = 3.82843$, exact value of the period-3 saddle-node tangent bifurcation).
- **Sharkovsky reference** (line 825): "period 3 implies all periods" — correct (Sharkovsky 1964; topmost in the Sharkovsky ordering).
- **Conjugacy to real quadratic family $z\mapsto z^2+c$** (line 846) — correct (affine conjugation $c=r/2-r^2/4$).
- **Mandelbrot definition** (line 846): orbit of $0$ stays bounded — correct.
- **Filled Julia set definition** $K_c$ (line 846) — correct.
- **Fatou–Julia dichotomy** (line 848): $K_c$ connected ⟺ $c\in M$; otherwise dust — correct (attribution as "Fatou's theorem" is loose shorthand for the Fatou–Julia dichotomy).
- **$c=-1$ basilica** — correct (period-2 superattracting parameter, center of the period-2 disk in $M$).
- **Real-axis cascade lives in $c\in[-2,1/4]$** — correct.

### Bifurcations (§7)

- **Normal-form table** (lines 1164–1173): saddle-node, transcritical, supercritical pitchfork, supercritical Hopf, period-doubling — all five normal forms correct (period-doubling form $x_{k+1}=-(1+\mu)x_k+x_k^3$ has multiplier $-(1+\mu)$, equal to $-1$ at $\mu=0$, verified).
- **Cascade restated** (lines 1175–1176): $r_2\approx 3.449$, $r_\infty\approx 3.5699$, $\delta\approx 4.66920$ — all correct.

### Chaos and Lyapunov exponents (§8)

- **Devaney chaos triplet** (lines 1234–1238): SDIC + topological transitivity + dense periodic points — correct.
- **Lyapunov exponent definition** (line 1241) — correct standard formula.
- **Doubling map $\lambda=\log 2$** (line 1242): $|f'|\equiv 2$ a.e. — correct.
- **Tent map $\lambda=\log 2$** — correct ($|T'|=2$ a.e.).
- **$f_4(x)=4x(1-x)$ has $\lambda=\log 2$** via semiconjugacy to tent — correct (numerically verified by integrating $\log|f_4'(x)|\rho(x)$ against the invariant Cauchy density $\rho(x)=1/(\pi\sqrt{x(1-x)})$ → $\approx 0.6920\to\log 2=0.6931$).
- **3D flow has zero exponent along flow direction** (line 1244) — correct.
- **Lorenz exponents $\approx (+0.906,\ 0,\ -14.57)$** (line 1244) — matches Sprott's published values $(0.9056,\ 0,\ -14.5723)$.

### Conservative vs dissipative flows (§9)

- **Liouville's theorem** (lines 1318–1320) — correct standard statement.
- **Hamiltonian $\operatorname{div}X_H = 0$** (line 1323): vanishes by equality of mixed partials — verified.
- **Symplectic form $\omega=\sum dq_i\wedge dp_i$** preserved — correct.
- **Lorenz divergence** (line 1326): $\operatorname{div}X = -\sigma-1-\beta = -41/3 \approx -13.67$ at classical params — verified.
- **Volume contracts by $e^{-41/3}\approx 1.2\times 10^{-6}$ per unit time** — correct ($\exp(-41/3)\approx 1.16\times 10^{-6}$).
- **Attractor has zero Lebesgue 3-volume** — correct (intersection of shrinking forward images).

### Poincaré sections and return maps (§10)

- **Poincaré map definition** (line 1405): codimension-1 transverse $\Sigma$, smooth first-return time $\tau$ via IFT, $P=\Phi_{\tau(x)}(x)$ — correct.
- **Periodic orbit ↔ fixed point of $P$** (line 1407) — correct.
- **Floquet multipliers** (line 1407): eigenvalues of $dP(p^*)$, cycle attracting iff all $|\cdot|<1$ (excluding flow direction) — correct.
- **Rössler system** $\dot x=-y-z,\ \dot y=x+ay,\ \dot z=b+z(x-c)$ (line 1409 + widget code) — standard form, correct.

### Symbolic dynamics (§11)

- **Doubling map ↔ shift conjugacy** (line 1471): $f(0.b_1b_2\ldots)=0.b_2b_3\ldots$ — correct.
- **Conjugacy fails on dyadic rationals (countable, measure zero)** — correct.
- **Period-$n$ point count for full $k$-shift = $k^n$** (line 1473) — correct.
- **Itinerary widget**: correctly extracts binary digits of successive iterates (rows = iterates, leading column gives $\sigma(x)$).

### Ergodicity and invariant measures (§12)

- **Measure-preserving definition** (line 1532): $\mu(T^{-1}A)=\mu(A)$ — correct.
- **Ergodic definition**: only invariant sets have measure 0 or 1 — correct.
- **Birkhoff ergodic theorem** (lines 1534–1536) — correct standard statement.
- **Borel normal-numbers theorem via Birkhoff applied to $\mathbf 1_{[1/2,1)}$** (line 1538) — correct.
- **$\tfrac{1}{N}\sum T^k(x) \to 1/2 = \int_0^1 x\,dx$ a.e.** (line 1538) — correct application of Birkhoff to $f(x)=x$.
- **Irrational rotations uniquely ergodic** (line 1540) — correct (Weyl).
- **Rational rotations split into finitely many cycles, NOT ergodic** — correct.
- **Bernoulli shifts mixing for every $p\in(0,1)$** — correct.

### Strange attractors (§13)

- **Strange-attractor working definition** (lines 1602–1607): attracts positive-volume basin + SDIC on $\Lambda$ + fractal dimension + zero Lebesgue volume in dissipative flow — correct informal definition (no universally accepted formal one; this is standard usage).
- **Lorenz system equations** (line 1610) and classical parameters $(10, 8/3, 28)$ — correct.
- **Three fixed points: origin (saddle) + $C_\pm = (\pm\sqrt{\beta(\rho-1)}, \pm\sqrt{\beta(\rho-1)}, \rho-1)$** (line 1611) — verified by setting RHS to zero.
- **Subcritical Hopf at $\rho_H\approx 24.74$** (line 1611) — verified ($\rho_H = \sigma(\sigma+\beta+3)/(\sigma-\beta-1) = 10\cdot 15.667/6.333 = 24.737$).
- **By $\rho=28$ all three equilibria unstable** — correct.
- **Box-counting dimension $\approx 2.06$** (line 1611) — correct (Grassberger–Procaccia and later: $2.05\sim 2.07$).
- **Tucker 1999 attribution** (line 1613) — correct (Warwick Tucker, *Found. Comput. Math.* 2002 = 1999 thesis: rigorous interval-arithmetic proof of strange attractor).

### Quiz bank (cross-check)

- **`dyn-orbits-flows` v1**: q1 (group law), q2 ($x(\ln 2)=2$), q3 (matching) — all correct.
- **`dyn-orbits-flows` hard**: q1 (completeness fails for $\dot x=x^2$), q2 (uniqueness step), q3 (rigid rotation preserves distance) — all correct.
- **`dyn-fixed-linearization` v1**: q1 (hyperbolic = no imag-axis eigenvalue), q2 ($\cos 0=1$), q3 (saddle) — all correct.
- **`dyn-fixed-linearization` hard**: q1 ($\dot x=-x^3$ asymptotically stable via Lyapunov, even with degenerate linearization), q2 ($\lambda=\pm i$ for the 2D rotation matrix), q3 (spot-the-error: step 4 wrongly assumes negative-real-part eigenvalues) — all correct.
- **`dyn-phase-portraits` v1**: q1 (stable node from $\tr=-3,\det=2,\disc=1$), q2 (saddles have $\det<0$: items 0 and 3), q3 (nullclines) — all correct.
- **`dyn-phase-portraits` hard**: q1 (matching), q2 (Van der Pol origin = unstable spiral for small $\mu$), q3 (ordering) — all correct.
- **`dyn-limit-cycles` v1**: q1 (P–B periodic orbit conclusion), q2 (Bendixson–Dulac criterion), q3 ($r=1$ for the polar limit cycle) — all correct.
- **`dyn-limit-cycles` hard**: q1 (compact forward-invariant fixed-point-free annulus forces periodic orbit), q3 (Van der Pol $\mu=0$ amplitude $=2$) — correct. (q2 flagged below in "Wrong / dubious".)
- **`dyn-iterated-maps` v1**: q1 ($x^*=0.6$ at $r=2.5$), q2 ($|f'(x^*)|<1$), q3 (logistic at $r=3$) — all correct.
- **`dyn-iterated-maps` hard**: q1 ($r=3$ for first period-doubling), q2 (2-cycle definition), q3 ($\{1/3,2/3\}$ doubling-map 2-cycle) — all correct.
- **`period-doubling-cascade` v1**: q1 ($x^*=0.6$ at $r=2.5$), q2 (2-cycle at $r=3.2$), q3 (Feigenbaum geometric scaling) — all correct.
- **`dyn-bifurcations` v1**: q1 (saddle-node at $\mu=0$ for $\dot x=\mu-x^2$), q2 (matching), q3 (2-cycle born stable at $r=3$) — all correct.
- **`dyn-bifurcations` hard**: q1 (all four pitchfork facts correct), q2 (Hopf amplitude $\sqrt\mu$), q3 ($\delta=4.669$) — all correct.
- **`dyn-chaos` v1**: q1 ($\lambda_{\text{doubling}}=\log 2 \approx 0.6931$), q2 (SDIC definition), q3 (Devaney ordering) — all correct.
- **`dyn-chaos` hard**: q1 ($f_4$ Lyapunov $=\log 2$ via semiconjugacy), q2 (Lorenz exponents $+, 0, -$), q3 (Birkhoff for tent-map Lyapunov) — all correct.
- **`dyn-conservative-dissipative` v1**: q1 (Liouville $\Leftrightarrow \div X=0$), q2 ($-13.67$ Lorenz), q3 (Hamiltonian + pendulum) — all correct.
- **`dyn-conservative-dissipative` hard**: q1 (no positive 3-volume invariant set under $\div<0$), q2 (Hamiltonian Liouville proof), q3 ($e^{-5}\approx 0.00674$) — all correct.
- **`dyn-poincare-section` v1**: q1 (transverse codim-1), q2 (closed orbit ↔ fixed point), q3 (return time $2\pi$) — all correct.
- **`dyn-poincare-section` hard**: q1 (dim reduction by 1), q2 (ordering), q3 (IFT for smoothness of $\tau$) — all correct.
- **`dyn-symbolic-dynamics` v1**: q1 (doubling ↔ shift), q2 (matching), q3 ($2^2=4$ period-2 points of full 2-shift) — all correct.
- **`dyn-symbolic-dynamics` hard**: q1 (critical-point ambiguity makes coding finite-to-one), q2 ($2^5=32$), q3 (multi-select: trans + dense periodic + SDIC) — all correct.
- **`dyn-ergodicity` v1**: q1 (ergodicity definition), q2 (Birkhoff statement), q3 (irrational rotation + doubling are ergodic) — all correct.
- **`dyn-ergodicity` hard**: q1 ($\int_0^1 x\,dx = 1/2$), q2 (Bernoulli shifts mixing for all $p$), q3 (Borel normality $=1/2$) — all correct.
- **`dyn-strange-attractors` v1**: q1 (SDIC + fractal), q2 ($(10,8/3,28)$ classical), q3 ($d\approx 2.06$) — all correct.
- **`dyn-strange-attractors` hard**: q1 (zero 3-volume by dissipation), q2 (3 fixed points, origin saddle, $C_\pm$ unstable, SDIC) — all correct. q3 (matching attractor types to dimensions) — all correct.

## Wrong / dubious claims

### 1. (Substantive) "$c=-0.75$ is the cusp" — incorrect labeling

Line 851 of `dynamical-systems.html`, in the Julia-set widget hint:

> drag $\Re(c)$ / $\Im(c)$ to move $c$ · shift-click to pin · $c=-1$ is the basilica · **$c=-0.75$ is the cusp** · the real-axis cascade lives at $c\in[-2,\,1/4]$

The cusp of the Mandelbrot set's main cardioid is at $c = 1/4$ (where the main cardioid pinches to a point on the positive real axis). The point $c = -3/4$ is the **period-doubling bifurcation** between the main cardioid and the period-2 disk — it is the *left edge* of the main cardioid where it meets the period-2 disk centered at $c=-1$, not a cusp.

Verification:
- Fixed points of $z^2+c$: $z^2-z+c=0\Rightarrow z=(1\pm\sqrt{1-4c})/2$.
- At $c=-3/4$: $z\in\{3/2,\,-1/2\}$. Multiplier $f'(z)=2z$. At $z=-1/2$: multiplier $=-1$ — the period-doubling threshold.
- At $c=1/4$: $z=1/2$ (double root). Multiplier $=1$ — the saddle-node tangency at the cardioid cusp.

Correct fix: replace "$c=-0.75$ is the cusp" with either "$c=-3/4$ is the period-2 bifurcation point (where the main cardioid meets the period-2 disk)" or "$c=1/4$ is the cusp".

### 2. (Substantive / dubious) `dyn-limit-cycles` hard quiz `spot-the-error` — the proof being flagged as wrong is actually valid

Lines 313–323 of `quizzes/dynamical-systems.json` (the `spot-the-error` question for the system $\dot x=y,\ \dot y=-x+y^3$):

```
Step 1: div X = ∂(y)/∂x + ∂(-x+y^3)/∂y = 0 + 3y^2 = 3y^2
Step 2: div X = 3y^2 ≥ 0 everywhere
Step 3: By Bendixson's criterion, since div X ≥ 0, no closed orbit exists.
Step 4: Conclude: the system has no periodic orbit in R^2.
answer: 2  (= step 3 is the error)
explain: Bendixson requires div X to have STRICTLY one sign on the region (not identically
zero). 3y^2 vanishes on the x-axis, so the hypothesis is not satisfied; the argument is invalid.
```

The standard textbook formulation of Bendixson's criterion (Strogatz, *Nonlinear Dynamics and Chaos*, Thm 7.2.1; Glendinning, *Stability, Instability and Chaos*, Thm 4.7; Verhulst) reads:

> If $D$ is a simply connected open region in the plane and $\operatorname{div}X$ does not change sign and is not identically zero in $D$, then there are no closed orbits lying entirely in $D$.

"Not identically zero" allows the divergence to vanish on a measure-zero subset (such as the $x$-axis), so $3y^2 \ge 0$ on $\mathbb R^2$ (vanishing only on the 1D $x$-axis) **does** satisfy the hypothesis. The proof (Green's theorem: $\oint_\gamma X\cdot n\,ds = 0$ on a closed orbit since $X$ is tangent to $\gamma$, but $\iint_{\text{int}\gamma} 3y^2\,dA > 0$, contradiction) is valid.

Independent check: the system $\dot x = y$, $\dot y = -x + y^3$ has no closed orbit. Take Lyapunov candidate $V=(x^2+y^2)/2$; then $\dot V = x\dot x + y\dot y = xy + y(-x+y^3) = y^4 \ge 0$. So $V$ is non-decreasing along orbits, with equality only when $y=0$. On the $x$-axis $\dot y = -x$, so the only orbit confined to $y=0$ is the origin. Therefore no nontrivial closed orbit exists.

Conclusion: the proof in the quiz is **mathematically valid** under the standard Bendixson statement. The quiz's claim that "Step 3 is the error" and the explanation "Bendixson requires *strictly* one sign" reflect a stricter reading of Bendixson that most modern textbooks do not adopt. The question asks students to identify a flawed step where there is no flaw.

A correct rewrite would either (a) replace the system with one where Bendixson genuinely fails (e.g. one with $\operatorname{div}X$ that changes sign), or (b) drop this question, or (c) flag a different actually-flawed step (none of steps 1, 2, 4 are flawed either — the calculation is right, the inequality is right, and the conclusion follows from step 3).

## Underspecified or unverifiable claims

- **Picard–Lindelöf wording** (line 336): "If $X$ is $C^1$ (Lipschitz suffices), then for each $p$ there is an $\varepsilon>0$ and a unique smooth $\gamma\colon(-\varepsilon,\varepsilon)\to M$..."

  Strict reading: under Lipschitz $X$, the integral curve $\gamma$ is $C^1$ (with Lipschitz derivative); to call $\gamma$ "smooth" you need $X\in C^\infty$. Under $X\in C^1$, $\gamma\in C^2$. The parenthetical "Lipschitz suffices" is correct for *existence and uniqueness* but not for smoothness. Pedagogical loose end, not a substantive error.

- **"Chaos is unavoidable beyond [the period-3 window]"** (line 825): the claim is true under topological-entropy / Li-Yorke notions of chaos (the topological entropy is positive for any logistic $r$ admitting a period-3 point, by Block–Coppel: $h_{\rm top}\ge \log\frac{1+\sqrt 5}{2}\approx 0.481$). It is misleading under the "typical-orbit" reading: in the period-3 window itself, almost every orbit converges to the stable 3-cycle, and the chaotic invariant Cantor set is unstable. Slightly loose framing, but defensible.

- **Linearization-based stability claim "When $\lambda<0$, orbits contract onto a stable attractor"** (line 1242): true at the local-linearization level, but globally "stable attractor" is a heuristic interpretation. Standard pedagogical phrasing.

- **Strange-attractor definition** (lines 1602–1607): no widely agreed-upon formal definition exists in the literature; the page's three-criterion working definition is standard but not unique. Not an error, just an inherent ambiguity in the field.

- **Logistic bifurcation widget readout "distinct attractor values"** (line 1221): the widget rounds to 3 decimal places and counts distinct rounded values. In chaotic regions this gives a noisy approximation to the attractor structure (e.g. high-period attractors and sparse chaotic bands look similar). Pedagogical limitation, not an error; the readout caption is honest about the interpretation.

## Severity

**moderate.** Two substantive errors:

1. **"$c=-0.75$ is the cusp" of the Mandelbrot main cardioid is wrong.** The cusp is at $c=1/4$; $c=-3/4$ is the period-2 bifurcation point. Easy fix: replace the hint label, e.g. "$c=-3/4$ is the period-2 bifurcation point" or "$c=1/4$ is the cusp".

2. **The `dyn-limit-cycles` hard `spot-the-error` quiz flags a step that is not actually an error**, based on a stricter reading of Bendixson's criterion than is standard in modern textbooks (Strogatz, Glendinning, Verhulst all allow $\operatorname{div}X$ to vanish on a measure-zero subset). The argument it asks students to invalidate is in fact a valid Bendixson application; the system genuinely has no closed orbit (independently confirmed via a Lyapunov function $V=(x^2+y^2)/2$ giving $\dot V=y^4\ge 0$). Recommended fix: replace the system with one where Bendixson genuinely fails (e.g. a system whose divergence changes sign), or remove the question.

The narrative prose across all 13 sections is otherwise mathematically clean. All headline theorem statements (Picard–Lindelöf, Hartman–Grobman, Poincaré–Bendixson, Bendixson–Dulac, Liouville, Birkhoff ergodic theorem, Sharkovsky's "period 3 implies all periods", Fatou–Julia dichotomy) are correct. All numeric constants ($r_2=1+\sqrt 6$, $r_\infty\approx 3.5699$, $\delta\approx 4.66920$, period-3 onset $1+2\sqrt 2\approx 3.8284$, doubling/tent/$f_4$ Lyapunov $=\log 2$, Lorenz divergence $-41/3$, Hopf bifurcation $\rho_H\approx 24.74$, attractor box-dim $\approx 2.06$, Lorenz Lyapunov triple $(+0.906, 0, -14.57)$) are correct. The widget computations (linear-classifier discriminant logic, cobweb iteration, bifurcation-diagram transient + sampling, Lyapunov-exponent running sum, Rössler Poincaré section, doubling-map binary itinerary, ergodic running mean, Lorenz integration with classical parameters) are mathematically faithful. The quiz bank (12 concepts × v1 + hard tiers) is correct apart from the one Bendixson question.
