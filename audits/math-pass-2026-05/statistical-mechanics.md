# Math correctness audit — `statistical-mechanics.html`

Pass date: 2026-05-14. Scope: every mathematical claim in §1–§8 plus widget readouts.

## Verified claims

**§1 Microstates / ensembles.** Hamilton's equations, Liouville's theorem (divergence-free flow,
$\partial_t\rho + \{\rho,H\}=0$), microcanonical density, $S = k_B\log\Omega$, $1/T = \partial S/\partial E$
all stated correctly. Harmonic-oscillator phase-space ellipse semi-axes $a=\sqrt{2E}/\omega$, $b=\sqrt{2E}$,
enclosed area $2\pi E/\omega$, density of states $\Omega(E) = 2\pi/\omega$ constant in $E$ — all correct
(line 367-373 widget readout). $S(E) = Nk_B(\log(E/N\hbar\omega)+1)$ for $N$ classical oscillators is the
correct Sackur-Tetrode-type leading term (line 306).

**§2 Boltzmann / canonical.** Heat-bath derivation, $\rho = e^{-\beta H}/Z$, the standard generator-function
table $\langle E\rangle = -\partial_\beta\log Z$, $\mathrm{Var}(E) = \partial^2_\beta\log Z$,
$F=-k_BT\log Z$, $C_V = k_B\beta^2\mathrm{Var}(E)$ all correct. Two-level worked example
$Z=2\cosh(\beta\Delta/2)$, $\langle E\rangle = -(\Delta/2)\tanh(\beta\Delta/2)$,
$C_V = k_B(\beta\Delta/2)^2\mathrm{sech}^2(\beta\Delta/2)$ correct. Schottky-anomaly peak location
$k_BT \approx \Delta/2.4$ matches the numerical max of $x^2\mathrm{sech}^2(x)$ at $x\approx 1.1997$.

**§3 Entropy / Gibbs.** Variational derivation, Lagrange-multiplier proof, Klein inequality
$D(\rho\|\sigma)\ge 0$, recovery of $S=k_B\log\Omega$ from the uniform microcanonical distribution — all
correct.

**§4 Grand canonical.** Density operator, $\Xi$, grand potential $\Omega = -PV$ (Euler), per-mode
factorization, FD/BE/MB occupations and per-mode $\Xi_k$ all correct. The MB row $\Xi_k = e^{e^{-\beta(\epsilon-\mu)}}$
is the correct Poisson-mode grand partition function. Bose convergence requires $\mu < \min_k\epsilon_k$ (✓);
classical limit at $e^{\beta\mu}\ll 1$ (✓).

**§5 Ising.** Hamiltonian, partition sum, MFT self-consistency $m=\tanh(\beta(qJm+h))$, MFT
$k_BT_c = qJ$, MFT exponent $\beta=1/2$ all correct. 2D $T_c = 2J/\log(1+\sqrt 2)\approx 2.269$ ✓;
2D magnetization exponent $1/8$ (Onsager/Yang) ✓; 3D $T_c/J\approx 4.51$ ✓; 3D $\beta\approx 0.326$ ✓.
Peierls 1D argument (wall energy $2J$ vs entropy $k_B\log L$) correct. Kramers-Wannier
$\sinh(2\beta J)\sinh(2\beta J^*)=1$ correct.

**§6 RG.** Fixed-point linearization, $\lambda_a = b^{y_a}$ classification, exponent identities
$\nu = 1/y_t$, $\beta = (d-y_h)/y_t$, $\gamma = (2y_h - d)/y_t$, $\eta = d+2-2y_h$ all correct.
Rushbrooke ($\alpha+2\beta+\gamma=2$) and Fisher ($\gamma=\nu(2-\eta)$) correct as scaling equalities.
Wilson–Fisher one-loop $\nu = 1/2 + \epsilon/12$ and $\eta = \epsilon^2/54$ are the correct N=1 values
(general $(N+2)/(4(N+8))\epsilon$ and $(N+2)/(2(N+8)^2)\epsilon^2$ specialize correctly). $\epsilon=1$ gives
$\nu = 7/12 \approx 0.5833$ vs MC $0.6299$ — quoted accurately.

**§7 Large deviations.** Cramér-Chernoff statement, Legendre rate function, Gaussian recovery near mean,
Kubo response $\chi_{AB} = \beta\,\mathrm{Cov}(A,B)$ correct. Bernoulli(1/2) Cramér rate
$I(x) = x\log(2x) + (1-x)\log(2(1-x))$ matches the Legendre transform of $\Lambda(\theta) = \log((1+e^\theta)/2)$.
CLT sd $1/(2\sqrt n)$ correct.

## Wrong / dubious claims

- **statistical-mechanics.html:1058** — Gärtner-Ellis worked example: "$\Lambda(\theta) = -\beta f(\beta-\theta) + \beta f(\beta)$".
  The first term is wrong. From $E[e^{n\theta\bar E_n}] = Z(\beta-\theta)/Z(\beta)$ and $\log Z(\beta) = -n\beta f(\beta)$
  one gets $\Lambda(\theta) = -(\beta-\theta)f(\beta-\theta) + \beta f(\beta)$. The missing $\theta$ in the prefactor
  breaks the Legendre relation that the surrounding paragraph then claims. Minor (1-character fix).

- **statistical-mechanics.html:509** — continuous Gibbs entropy: "$S = -k_B\int\rho\log(\rho h^{3N}/N!)d\Gamma$".
  For indistinguishable particles the canonical convention puts $h^{3N} N!$ in the log argument as a product
  (the reference measure is $d\Gamma/(h^{3N}N!)$), so the parenthetical should read $(\rho\,h^{3N} N!)$, not $/N!$.
  As written, the indistinguishability term flips sign relative to Sackur-Tetrode. Minor / notational.

## Underspecified or unverifiable claims

- **statistical-mechanics.html:416** — "Boltzmann factors saturate at $1/2$" in the high-$T$ limit of the
  two-level system. The factors $e^{\pm\beta\Delta/2}$ go to $1$, not $1/2$; what saturates at $1/2$ is the
  population $p_\pm = 1/Z\cdot e^{\mp\beta\Delta/2}$. Wording sloppy, conclusion ($C_V\to 0$) is right.

- **statistical-mechanics.html:789** — "Wilson-Fisher trivial above 4D". Conventional shorthand for
  "Gaussian fixed point governs critical behaviour, MFT exponents become exact (modulo logs at $d=4$)".
  Strictly the WF fixed point doesn't exist for $\epsilon<0$, so calling it "trivial" is loose; not wrong.

- **statistical-mechanics.html:931** — "exactly $y_t$ and $y_h$" claimed as the reduction from six exponents
  to two via Rushbrooke and Fisher. There are actually four standard scaling relations
  (Rushbrooke, Widom, Fisher, Josephson); two suffice when hyperscaling holds. Statement isn't wrong but
  is silently using hyperscaling.

## Severity

**Minor.** All quantitative thermodynamic, critical-exponent, and large-deviation results are correct.
Two minor notational/algebraic slips (the Gärtner-Ellis CGF prefactor and the $h^{3N}/N!$ vs $h^{3N}N!$
sign in the continuous Gibbs entropy) are worth fixing but do not propagate into any downstream formula
on the page or any widget computation.
