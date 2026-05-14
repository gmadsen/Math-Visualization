# advanced-complex-analysis — math correctness audit (2026-05)

**Section:** Analysis

## Verified claims

- **Picard** (§§2–3): little Picard via modular cover $\lambda:\mathbb H\to\mathbb C\setminus\{0,1\}$; great Picard with $e^{1/z}$ omitting $\{0\}$; non-polynomial entire ⇒ essential at $\infty$.
- **Weierstrass** (§4): $E_p(z)=(1-z)\exp(\sum_{k\le p}z^k/k)$ has $\log E_p=-\sum_{k>p}z^k/k=O(z^{p+1})$; $\sin\pi z=\pi z\prod(1-z^2/n^2)$; Wallis $2/\pi$ at $z=1/2$; $1/\Gamma$ Hadamard product $ze^{\gamma z}\prod(1+z/n)e^{-z/n}$; refinement $\deg h\le\rho$.
- **Mittag-Leffler** (§5): $\pi\cot\pi z=1/z+\sum_{n\ne 0}(1/(z-n)+1/n)$, summand $z/(n(z-n))\sim 1/n^2$; differentiated $\pi^2/\sin^2\pi z=\sum 1/(z-n)^2$ (sign matches $-\pi^2\csc^2$); $z=1/2\Rightarrow\sum(2n+1)^{-2}=\pi^2/8\Rightarrow\zeta(2)=\pi^2/6$; truncation with $2^{-n}$ tails.
- **Phragmén-Lindelöf** (§6): sector opening $\pi/\alpha$, $|f|\le e^{|z|^\beta},\beta<\alpha\Rightarrow|f|\le M$; auxiliary $g_\varepsilon=e^{-\varepsilon z^\gamma},\beta<\gamma<\alpha$ uses $\cos(\gamma\theta)>0$ since $\gamma|\theta|<\pi/2$; right half-plane $\alpha=\beta=1$ critical, witness $e^z$; three-lines / Riesz-Thorin link.
- **Three-circles** (§7): $\log M(r)$ convex in $\log r$; $z^a$-multiplier proof; worked $M(2)\le 4$ on $[1,4]$ saturated by $z^2$.
- **Hardy spaces** (§8): definition; nesting $H^\infty\subset H^p\subset H^{p'}$ ($p>p'$, Jensen); Fatou non-tangential limits a.e., $\|f^*\|_{L^p}=\|f\|_{H^p}$; inner-outer $f=B\cdot S\cdot O$ — Blaschke convergence $\sum(1-|a_n|)<\infty$, singular inner via Poisson-exp of singular measure on $\partial\mathbb D$, outer via Poisson-exp of $\log|f^*|$; Hardy-Littlewood maximal + weak-type $p=1$; Beurling.
- **Bloch** (§9): $f(0)=0,f'(0)=1 \Rightarrow$ univalent sub-disk radius $\ge B \ge \sqrt 3/4\approx 0.433$; conj. Ahlfors-Grunsky $\approx 0.4719$; Landau $L\ge B\ge 1/2$; Schottky/Montel chain.
- **Nevanlinna** (§10): $T=m+N$ ($\log^+$); first main $m+N=T+O(1)$; defect $\sum\delta(a)\le 2$, $S(r,f)=O(\log T+\log r)$ off finite-measure exceptional set; Picard recovery; $e^z$ saturates $\delta(0)=\delta(\infty)=1$; $\wp$ four critical values each $\delta=1/2$.
- **Bergman** (§11): $A^2(\mathbb C)=\{0\}$ via $|f(0)|^2\le\|f\|^2/(\pi R^2)\to 0$; bounded point eval ⇒ RKHS; basis $\sqrt{(n+1)/\pi}\,z^n\Rightarrow K=1/(\pi(1-z\bar w)^2)$; transformation $K_{\Omega_2}(\phi z,\phi w)\phi'(z)\overline{\phi'(w)}=K_{\Omega_1}(z,w)$; metric $\partial\bar\partial\log K=2/(1-|z|^2)^2 dz d\bar z$ recovers curvature-$-1$ Poincaré (under $ds^2=2g_{z\bar z}|dz|^2$); widget $|K|^2=1/(\pi^2|1-\bar w z|^4)$.
- **Quasiconformal** (§12): $\mu_f=\partial_{\bar z}f/\partial_z f$, $K=(1+|\mu|)/(1-|\mu|)$, $W^{1,2}_{\rm loc}$; measurable RMT (Morrey-Ahlfors-Bers) with $0,1,\infty$ normalization; Beurling transform; Teichmüller dim $6g-6$; Mostow / Thurston. Warp widget $f(z)=z+\mu\bar z$ gives $\mu_f\equiv\mu$ exactly, Jacobian $1-|\mu|^2$.
- **SCV** (§13): Hartogs (compact $K$, connected $\Omega\setminus K$); Levi; Hörmander $L^2$ + PSH weight; $\bar\partial$-Neumann box; $n=1$ vs $n\ge 2$ table (ball vs bidisk, no isolated singularities, holomorphy = pseudoconvex); widget readout (4-vol $r^4$, BM $\sim r^3$).
- **Quizzes** spot-checks: Weierstrass $2/\pi\approx 0.637$ ✓; three-circles $M(2)\le 4$ ✓; Bloch $f'(0)=2\Rightarrow\sqrt 3/2\approx 0.866$ ✓; Nevanlinna $\rho(e^{z^3})=3$ via $T(r,e^P)\sim r^{\deg P}/\pi$ ✓; QC $k=0.6\Rightarrow K=4$ ✓; Bergman spot-the-error identifies missing $\phi'$. Bloch + Nevanlinna `matching` `[0,1,2,3]` align under quiz.js convention.

## Wrong / dubious claims

None at the load-bearing-math level.

## Underspecified or unverifiable claims

- **§4 line 396**: "polynomial of degree bounded by the order" — strictly $\deg h \le \lfloor\rho\rfloor$ (genus). Loose, not wrong.
- **§11 line 831**: Bergman metric notation conflates Hermitian $g_{z\bar z}dz\,d\bar z$ and Riemannian $ds^2$; curvature-$-1$ identification needs the unstated $ds^2 = 2g_{z\bar z}|dz|^2$ convention.
- **§12 warp widget**: "NOT quasiconformal: $|\mu|\ge 1$" warning unreachable — sliders cap at $|\mu_{\rm re,im}|\le 0.7$. Cosmetic.

## Severity

**clean.** No load-bearing math errors across Picard, Weierstrass / Mittag-Leffler, Phragmén-Lindelöf (sharp $\beta<\alpha$), three-circles, Hardy-space inner-outer, Bloch ($\sqrt 3/4 + 0.4719$), Nevanlinna (defect ≤ 2, $\wp$ saturation, $\rho(e^P)=\deg P$), Bergman, Beltrami / measurable RMT, or SCV. Three cosmetic notes only.
