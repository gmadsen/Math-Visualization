# schrodinger-equation.html — math-correctness audit

## Verified claims

- **§1 Time-dependent SE.** $i\hbar\partial_t\psi = H\psi$, $H = -\hbar^2/(2m)\Delta + V$ (line 266). Norm conservation derivation via Stone's theorem (line 267–269) is algebraically clean: $\frac{d}{dt}\langle\psi,\psi\rangle = \langle -iH\psi/\hbar,\psi\rangle + \langle\psi,-iH\psi/\hbar\rangle = 0$ uses self-adjointness correctly.
- **§1 Square-well revival.** Eigenstates $\varphi_n = \sqrt{2/\pi}\sin(nx)$ on $[0,\pi]$ with $E_n=n^2$ (units $\hbar=2m=1$). Smallest $T$ with $e^{-iE_n T}=1$ for all $n$ is $T_{\mathrm{rev}}=2\pi$ since all $E_n\in\mathbb Z$ (line 372). Widget code matches (line 489).
- **§2 Stationary-state beating.** Two-level superposition oscillates at frequency $|E_2-E_1|/\hbar$, period $2\pi/|E_2-E_1|\approx 2.094$ for $E_1=1, E_2=4$ (line 587). Correct.
- **§3 Harmonic oscillator.** Ladder definitions $a = \sqrt{m\omega/(2\hbar)}(x + ip/(m\omega))$ (line 629), commutator $[a,a^\dagger]=1$ from $[x,p]=i\hbar$, factorisation $H=\hbar\omega(a^\dagger a + 1/2)$, spectrum $E_n=\hbar\omega(n+1/2)$ (line 631). All standard and correct. Energy ladder widget renders $E_n = (n+0.5)\hbar\omega$ correctly (line 695).
- **§3 Classical turning points.** $V(x) = x^2/2$, turning at $V=E$ gives $x=\pm\sqrt{2E}$ (line 686, 733). Correct.
- **§4 Hydrogen.** Effective radial potential $V_{\mathrm{eff}}=-e^2/r + \hbar^2\ell(\ell+1)/(2mr^2)$ (line 746) — standard centrifugal-plus-Coulomb form. $E_n = -E_0/n^2$ with $E_0 = me^4/(2\hbar^2)\approx 13.6$ eV (line 747) — correct in Gaussian units where $V=-e^2/r$. Degeneracy $n^2$ (orbital, ignoring spin) and SO(4) Runge–Lenz origin (line 748) — correct.
- **§4 Photon wavelengths.** $\lambda[\mathrm{nm}] = 1240/E[\mathrm{eV}]$ (line 805) — standard $hc$ in eV·nm.
- **§5 Tunneling.** $|T|^2 + |R|^2 = 1$ from S-matrix unitarity (line 841). Decay rate $\kappa = \sqrt{2m(V_0-E)}/\hbar$ (line 842). Closed-form transmission $T = 1/[1 + V_0^2/(4E(V_0-E))\sinh^2(\kappa a)]$ for $E<V_0$ and the analogous $\sin^2$ form for $E>V_0$ (line 869–887) match the standard rectangular-barrier result. $E=V_0$ limit $T = 1/(1+ma^2 V_0/(2\hbar^2))$ correctly written as $1/(1+a^2/4)$ in units $\hbar=2m=1$ (line 877).
- **§6 Path integral.** Propagator $K = \int e^{iS/\hbar}\,\mathcal D q$ (line 970). Stationary-phase classical limit (line 973). For toy paths $q(t)=\alpha t(1-t)$, $S=\frac{1}{2}\int_0^1 \alpha^2(1-2t)^2\,dt = \alpha^2/6$ (line 1003). Verified.
- **§7 Connections.** Spectral / PDE / path-integral framing, all correct categorisations.

## Wrong / dubious claims

- **§1 Free wavepacket spreading hint vs. code mismatch.** Hint at line 272 says width grows as $\sqrt{1+t^2}$. Widget code (line 309–311) actually uses $\sigma_t^2 = 1 + t^2/16$, so width grows as $\sqrt{1+t^2/16}$. Both are schematic and the widget readout (line 333) does correctly say `√(1 + t²/16)`, but the hint disagrees with what the user sees. The general physical result is $\sigma(t)^2 = \sigma_0^2 + (\hbar t/(2m\sigma_0))^2$; neither expression names units, so either is defensible — but they should agree. Minor.

- **§5 Symbol overload of $T$.** Line 840: "transmitted piece $T\,e^{ikx}$" introduces $T$ as the *amplitude*, then line 841 writes $|T|^2 + |R|^2 = 1$ as if $T$ is now the amplitude (consistent with the prior line). Then the widget caption at line 845 and the readout label at line 948 use $T$ for the *probability* $|t|^2$. The convention silently flips between the two. Minor / cosmetic — physics is correct under either reading.

## Underspecified or unverifiable claims

- **§1 "Sobolev space $H^2$ for nice $V$"** (line 267) glosses Kato / Faris–Lavine self-adjointness; "nice" is doing heavy lifting (e.g. $V$ Kato-bounded). Acceptable for a notebook; not wrong.
- **§4 "hidden SO(4) symmetry"** (line 748). True historically (Pauli 1926, Fock 1935) — the Lie-algebra derivation is omitted but the claim is correct.
- **§6 Wick rotation to Wiener integral** (line 971). Correct in spirit (Feynman–Kac); the analytic continuation $t\to -i\tau$ is not justified beyond a handwave, which is appropriate at this level.
- **Position–momentum uncertainty $\Delta x\Delta p \ge \hbar/2$** is in the audit-focus list but the page never states it. Not a math error — a topical omission.
- **Continuity equation** $\partial_t|\psi|^2 + \nabla\cdot j = 0$ in the focus list is also absent; the page derives only the integrated form $d/dt\|\psi\|^2 = 0$. Again not wrong, just absent.

## Severity

**Clean** — no mathematical errors. Two minor presentation issues (hint/code mismatch on Gaussian width, transmission $T$ amplitude-vs-probability double-use) are cosmetic. Two named focus topics (Heisenberg uncertainty, local continuity equation) are simply not covered on the page; they are not stated incorrectly.
