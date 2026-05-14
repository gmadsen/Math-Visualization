# Math correctness audit — `numerical-analysis.html`

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.
Format per section: **Verified · Wrong/dubious · Underspecified · Severity**.

---

## §1 Floating-point arithmetic (lines 263–362)
- **Verified.** IEEE 754 double layout (1+11+52=64); $\varepsilon_M=2^{-52}\approx 2.22\times 10^{-16}$; rounding-model identity $\mathrm{fl}(a\circ b)=(a\circ b)(1+\delta)$, $|\delta|\le\varepsilon_M$. Conditioning vs. stability definitions, forward-error $\le \kappa\cdot$backward-error. Catastrophic-cancellation widget: `(1+x)-1` correctly demonstrates digit loss; the `\sqrt{x+1}-\sqrt x = 1/(\sqrt{x+1}+\sqrt x)$` rewrite is a textbook fix.
- **Wrong/dubious.** None.
- **Underspecified.** The rounding-model statement implicitly assumes round-to-nearest with no underflow/overflow; harmless at this level.
- **Severity.** None.

## §2 Rootfinding: bisection and Newton (lines 364–503)
- **Verified.** Bisection bracket width $(b-a)/2^n$. Newton update $x_{n+1}=x_n - f(x_n)/f'(x_n)$ with quadratic convergence near a simple root. Order table: bisection linear (rate 1/2), secant order $(1+\sqrt5)/2$, Newton 2, Halley 3 — all standard. Failure-mode summary (overshoot, multiple-root demotion to linear, cycles) correct. Brent's method correctly described as a hybrid. Newton widget code: $f=x^2-2$, $f'=2x$, tangent intersect at $x_n - f/f'$ — correct.
- **Wrong/dubious. SEVERITY: MEDIUM.**
  - Line 485 prose: "Starting from $x_0=2.5$ with $|e_0|\approx 1.09$, **three steps** reach machine precision". By direct computation the iterates from $x_0=2.5$ are $|e_0|=1.086,\ |e_1|=0.236,\ |e_2|=1.68\times 10^{-2},\ |e_3|=9.92\times 10^{-5},\ |e_4|=3.48\times 10^{-9},\ |e_5|=2.22\times 10^{-16}$ — **five** Newton steps to reach machine precision, not three. (Three steps land at error $\sim 10^{-4}$.) The bisection comparison "~50 steps" on $[1,2]$ is correct ($\log_2(1/\varepsilon_M)\approx 53$).
- **Underspecified.** None.
- **Severity. MEDIUM** — concrete numerical claim contradicted by the page's own widget output.

## §3 Quadrature (lines 505–670)
- **Verified.**
  - Composite trapezoid weights $h[\tfrac12 f_0+f_1+\cdots+f_{n-1}+\tfrac12 f_n]$ and error $-(b-a)h^2/12 \cdot f''(\xi)$ — correct.
  - Composite-Simpson code: 1-4-2-4-…-2-4-1 pattern (`(i%2 ? 4 : 2)`), divisor $h/3$ — correct standard form.
  - "Simpson degree 3 (cubics)" — correct (error term $-(b-a)h^4/180\cdot f^{(4)}(\xi)$ vanishes for cubics).
  - Gauss–Legendre "$n$ nodes exact for poly degree $\le 2n-1$" — correct.
  - Hard-coded GL nodes/weights for $n=2,4,8$ on $[-1,1]$ verified against standard tables (e.g. $\pm 1/\sqrt3 \approx \pm 0.5773502692$ for $n=2$). Rescaling $x=\tfrac12(t+1)$ with prefactor $\tfrac12$ is correct for $[0,1]$.
  - Slope claim: trapezoid error $\sim N^{-2}$ (slope $-2$ on log–log), Simpson $\sim N^{-4}$ (slope $-4$). Correct.
  - Periodic-trapezoid spectral convergence remark, Euler–Maclaurin attribution — correct.
- **Wrong/dubious.** None mathematically. The "$n=4$ Gauss nails $x^4$ to machine precision" claim is correct ($2n-1=7\ge 4$). Even $n=2$ Gauss has degree-of-exactness $3$, missing only the $x^4$ piece, so error is $\int_0^1 x^4 dx - \tfrac12[(\tfrac{1-1/\sqrt3}{2})^4+(\tfrac{1+1/\sqrt3}{2})^4]\approx 7\times 10^{-3}$ — small but nonzero, consistent with the widget's plot.
- **Underspecified.** None.
- **Severity.** None.

## §4 Linear systems (lines 672–798)
- **Verified.** LU $\tfrac23 n^3$, Cholesky $\tfrac13 n^3$, Householder QR $\tfrac43 n^3$ for square $n\times n$, SVD $O(n^3)$ — standard counts. $\kappa(A)=\|A\|\,\|A^{-1}\|$, $=\sigma_{\max}/\sigma_{\min}$ in 2-norm. Perturbation bound $\|\delta x\|/\|x\|\le \kappa(\|\delta A\|/\|A\|+\|\delta b\|/\|b\|)$ — correct (the standard first-order bound). Hilbert condition values in the JS array `[1, 19.28, 524, 15514, 476607, 1.495e7, 4.754e8, 1.526e10, 4.932e11, 1.602e13, 5.221e14, 1.704e16, 5.5e17, 1.78e19]` cross-check against published tables (Higham, Todd) for $n=2,\dots,14$. Jacobi update $x^{(k+1)}=D^{-1}(b-(L+U)x^{(k)})$, Gauss–Seidel $x^{(k+1)}=(D+L)^{-1}(b-Ux^{(k)})$, "converge iff $\rho(M)<1$" — all correct. CG bound $\|e_k\|_A\le 2\bigl((\sqrt\kappa-1)/(\sqrt\kappa+1)\bigr)^k\|e_0\|_A$ giving $O(\sqrt\kappa)$ vs Jacobi's $O(\kappa)$ for fixed-factor reduction — standard textbook bound.
- **Wrong/dubious.** None.
- **Underspecified.** SOR is mentioned in the user's audit checklist but is **not in this page** — only Jacobi, Gauss–Seidel, and CG are covered. (Not a defect; just a scope note.)
- **Severity.** None.

## §5 Finite differences and CFL (lines 800–930)
- **Verified.** Forward/backward $O(h)$, central $O(h^2)$, second-difference 3-point stencil $O(h^2)$ — correct Taylor remainders. FTCS heat scheme $u_j^{n+1}=u_j^n+\lambda(u_{j+1}^n-2u_j^n+u_{j-1}^n)$, $\lambda=\Delta t/\Delta x^2$. Von Neumann amplification factor $g(\xi)=1-4\lambda\sin^2(\xi\Delta x/2)$; $|g|\le 1$ for all $\xi$ iff $4\lambda\le 2$ iff $\lambda\le \tfrac12$ — correct. Wave-equation CFL $c\Delta t/\Delta x\le 1$ for centered explicit scheme, with the domain-of-dependence interpretation — correct. Implicit (backward Euler, Crank–Nicolson) unconditional stability — correct. Widget code implements FTCS faithfully; "BLOWUP" detection at $|u|>100$ is a sensible heuristic.
- **Wrong/dubious. SEVERITY: LOW.**
  - Line 907 readout text says "the highest-frequency Fourier mode amplifies as $|1-4\lambda|^n$". Strictly, the highest grid frequency $\xi\Delta x=\pi$ gives $\sin^2(\pi/2)=1$, so $g=1-4\lambda$, and the per-step amplification of that mode is $|1-4\lambda|$. This is what the prose says — **correct**, but the formula is conventionally stated as the per-step factor (which is what's printed). No error; flagging only because "amplifies as $|1-4\lambda|^n$" is technically the cumulative amplification after $n$ steps and reads ambiguous.
- **Underspecified.** None.
- **Severity.** None blocking.

## §6 Finite elements / Galerkin (lines 932–1102)
- **Verified.** Weak form of $-\Delta u=f$, Lax–Milgram existence/uniqueness in $H^1_0$. Hat-function basis with $\varphi_i(x_j)=\delta_{ij}$, span $V_h\subset H^1_0$, stiffness $K_{ij}=\int\nabla\varphi_i\cdot\nabla\varphi_j$ sparse and SPD — all correct. 1D widget: tridiagonal $K$ with $2/h$ diagonal, $-1/h$ off-diagonal — correct (analytically, $\int_0^1 (\varphi_i')^2 = 2/h$, neighbour overlap $-1/h$). Numerically the solver reproduces the exact discrete solution $c_j=\sin(\pi x_j)\cdot(\pi h/2)^2/\sin^2(\pi h/2)$ to machine precision (cross-checked at $N=10$, middle node: numeric $1.00826541696623$, theory $1.00826541696623$). Céa's lemma statement and the standard $H^1$/$L^2$ rates $h$/$h^2$ via interpolation + Aubin–Nitsche duality — correct. $P^k$ rates $h^k$/$h^{k+1}$ — correct.
- **Wrong/dubious.** None.
- **Underspecified.**
  - Load vector uses the simple lumped/midpoint approximation $b_j\approx h f(x_j)$ (line 979) rather than the exact $\int \varphi_j f$. The comment in the code ("good enough for plot") concedes this. For $f=\pi^2\sin\pi x$ the true load is $h f(x_j)\cdot\bigl[\sin(\pi h/2)/(\pi h/2)\bigr]^2$, an $O(h^2)$ correction; the resulting consistency error is the same order as the FEM error, so the widget's $L^2$-error trace stays $O(h^2)$ in practice. The "predicted $0.4 h^2$" is an eyeball coefficient, not derived; theoretical leading constant for this problem is $\approx \sqrt{1/2}\cdot \pi^2/12\approx 0.58$. Not wrong, just loose.
- **Severity.** None.

## §7 Connections (lines 1107–1119)
- **Verified.** Monte Carlo $O(N^{-1/2})$ vs deterministic $O(h^{-d})$ — correct.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

---

## Topics NOT covered on the page (per audit checklist)

- **Romberg / Richardson extrapolation** — absent. No false claim to flag; just a coverage gap relative to the user's checklist.
- **SOR convergence** — absent (only Jacobi, Gauss–Seidel, CG).
- **Fixed-point iteration linear convergence** — implicit only (bisection and the "rate $1/2$" cell).

---

## Summary of severity-ranked findings

| # | Section | Issue | Severity |
|---|---|---|---|
| 1 | §2 Newton prose (line 485) | Claims "three steps reach machine precision" from $x_0=2.5$; actual count is **five** (errors $1.09 \to 0.24 \to 1.7\!\times\!10^{-2} \to 9.9\!\times\!10^{-5} \to 3.5\!\times\!10^{-9} \to 2.2\!\times\!10^{-16}$). The widget itself prints the correct sequence, so the prose contradicts the demo. | **Medium** |
| 2 | §6 FEM widget (line 977 + readout) | Load vector uses midpoint $b_j\approx h f(x_j)$ rather than exact $\int \varphi_j f$; "predicted $0.4 h^2$" coefficient is heuristic (true leading constant $\approx 0.58$). Not a math error, just coarse. | Low |
| 3 | §5 CFL readout (line 907) | "Amplifies as $|1-4\lambda|^n$" reads as cumulative-after-$n$-steps; per-step factor is $|1-4\lambda|$. Wording, not math. | Low (cosmetic) |

Mathematical claims in prose — IEEE 754 layout, $\varepsilon_M$, rounding model, conditioning vs. stability inequality, bisection halving, Newton quadratic, secant golden-ratio, Halley cubic, trapezoid/Simpson error orders, Gauss–Legendre degree of exactness, hard-coded GL nodes/weights, LU/Cholesky/QR/SVD costs, $\kappa(A)$ definition, perturbation bound, Hilbert condition values, Jacobi/Gauss–Seidel iteration matrices, CG bound, FTCS amplification, $\lambda\le 1/2$ heat stability, $c\Delta t/\Delta x\le 1$ wave CFL, weak form, Lax–Milgram, Céa's lemma, Aubin–Nitsche $h^2$ $L^2$-rate, $P^k$ rates — all correctly stated.

Quizzes were not separately exercised (this audit looked at prose + widget code; quiz banks live in `quizzes/numerical-analysis.json`).
