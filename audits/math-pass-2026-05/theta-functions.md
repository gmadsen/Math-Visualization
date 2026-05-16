# Math correctness audit — `theta-functions.html`

## Verified claims

**§1 Definition (lines 262–271).** $\theta(\tau)=\sum_{n\in\mathbb{Z}}e^{\pi i n^2\tau}=\sum q^{n^2/2}$ with $q=e^{2\pi i\tau}$ is internally consistent (since $q^{1/2}=e^{\pi i\tau}$). Expansion $1+2q^{1/2}+2q^2+2q^{9/2}+2q^8+2q^{25/2}+\cdots$ matches exponents $n^2/2\in\{0,1/2,2,9/2,8,25/2,\ldots\}$ for $n=0,1,2,3,4,5$ — correct, doubled for $\pm n$.

**§1 widget (lines 273–281, 312–320).** `thetaReal(y)` computes $1+2\sum_{n\ge1}e^{-\pi n^2 y}$ — i.e. $\theta(iy)$ on the imaginary axis (since $e^{\pi i n^2(iy)}=e^{-\pi n^2 y}$). Asymptotic $\theta(iy)\to1$ as $y\to\infty$ and $\theta\sim 1/\sqrt y$ as $y\to0^+$ both correct (the $1/\sqrt y$ blow-up is the $y\to 1/y$ transformation applied to $\theta(i/y)\to1$).

**§2 Period 2 (lines 387–393).** $|q^{n^2/2}|=e^{-\pi n^2\mathrm{Im}\,\tau}$ Gaussian decay, holomorphy on $\mathcal{H}$ standard. Per-term minimal period $2/n^2$ in $\mathrm{Re}\,\tau$ correct. Common minimal period is 2 (smallest $T$ with $n^2 T/2\in\mathbb{Z}$ for all $n$ is $T=2$, witnessed by $n=1$). $\theta(\tau+1)\ne\theta(\tau)$ because $e^{\pi i\cdot 1\cdot 1}=-1$ flips the $n=\pm1$ terms — correct.

**§3 Jacobi transformation (lines 510–522).** $\theta(-1/\tau)=\sqrt{-i\tau}\,\theta(\tau)$, with $\sqrt{-i\tau}=1$ at $\tau=i$, standard. Poisson-summation derivation correct: Gaussian Fourier transform $\widehat{f}(\xi)=(1/\sqrt{-i\tau})\,e^{-\pi i\xi^2/\tau}$ standard for $f(x)=e^{\pi i x^2\tau}$, $\mathrm{Im}\,\tau>0$. Spot checks in widget (`thetaReal(1/y)` vs `√y·thetaReal(y)`) implement the identity correctly on the imaginary axis (since $-1/(iy)=i/y$ and $\sqrt{-i\cdot iy}=\sqrt y$).

**§3 $\theta^4$ on $\Gamma_0(4)$ (line 524).** Squaring twice gives $(-i\tau)^2=-\tau^2$, so $\theta^4(-1/\tau)=-\tau^2\theta^4(\tau)$; together with $T^2$-invariance this is the weight-2 modular transformation on $\Gamma_0(4)$ (with the appropriate character handled by the Nebentypus). Correct as stated.

**§4 $r_4$ formula (lines 649–651).** $r_4(n)=8\sigma(n)-32\sigma(n/4)$ is equivalent to the prompt's $r_4(n)=8\sum_{d\mid n,\,4\nmid d}d$: for $n=4m$, $\sum_{d\mid n,4\mid d}d=4\sigma(m)=4\sigma(n/4)$, so $\sum_{d\mid n,4\nmid d}d=\sigma(n)-4\sigma(n/4)$ and $8\cdot$ that gives $8\sigma(n)-32\sigma(n/4)$. ✓ Widget cross-checks verified by spot-check (e.g. $n=25$: $\sigma=31$, $r_4=8\cdot31=248$; $n=4$: $\sigma=7$, $\sigma(1)=1$, $r_4=56-32=24$; $n=24$: $\sigma=60$, $\sigma(6)=12$, $r_4=480-384=96$).

**§4 $r_2$ formula (lines 645–647).** $r_2(n)=4(d_1(n)-d_3(n))$ — Jacobi's two-square theorem, correct.

**§5 Jacobi triple product (lines 897–899).** $\prod_{n\ge1}(1-q^n)(1+zq^{n-1/2})(1+z^{-1}q^{n-1/2})=\sum_n z^n q^{n^2/2}$ — standard form, correct. Widget code (`partialProduct`) builds $\prod(1-u^{2n})(1+u^{2n-1})^2$ in $u=q^{1/2}$, matching the $z=1$ specialization.

**§5 $z=1$ and $z=-1$ specializations (lines 906–907).** $z=1$: $\theta(\tau)=\prod(1-q^n)(1+q^{n-1/2})^2$ — direct. $z=-1$: $\sum(-1)^n q^{n^2/2}=\prod(1-q^n)(1-q^{n-1/2})^2$, and the eta-quotient identification $=\eta(\tau/2)^2/\eta(\tau)$ verifies: $\eta(\tau/2)^2=q^{1/24}\prod(1-q^{n/2})^2=q^{1/24}\prod(1-q^k)^2\prod(1-q^{k-1/2})^2$, divide by $\eta(\tau)=q^{1/24}\prod(1-q^n)$ to get $\prod(1-q^n)\prod(1-q^{n-1/2})^2$. ✓

**§6 Eta function (lines 1041–1052).** $\eta(\tau)=q^{1/24}\prod(1-q^n)$, $\eta(\tau+1)=e^{\pi i/12}\eta(\tau)$ (immediate from $q^{1/24}\to e^{2\pi i/24}q^{1/24}=e^{\pi i/12}q^{1/24}$), $\eta(-1/\tau)=\sqrt{-i\tau}\,\eta(\tau)$ standard. $\Delta=\eta^{24}=q\prod(1-q^n)^{24}$ weight 12 on $\mathrm{SL}_2(\mathbb{Z})$ correct. Tau values $\tau(1{,}2{,}3{,}4{,}5)=(1,-24,252,-1472,4830)$ match OEIS A000594. The TAU table in the widget (lines 1076–1078) is correct through $\tau(20)$ (spot-checked: $\tau(6)=-6048$, $\tau(10)=-115920$, $\tau(11)=534612$).

**§7 $E_8$ theta (lines 1192–1194).** $\Theta_{E_8}=E_4=1+240\sum\sigma_3(n)q^n$ correct (single weight-4 form on $\mathrm{SL}_2(\mathbb{Z})$ up to scale, normalized so constant term is 1). "Number of $E_8$ vectors of squared length $2n$ equals $240\,\sigma_3(n)$" correct.

**§7 Leech lattice (line 1196).** $\Theta_{\Lambda_{24}}=E_{12}-(65520/691)\Delta$ — standard (Conway–Sloane §4). The 24-Niemeier classification and Conway group $\mathrm{Co}_1=\mathrm{Aut}(\Lambda_{24})/\{\pm1\}$ correct.

**§7 $A_2$ norm (lines 1222–1230, 1252).** Basis $(1,0),(1/2,\sqrt3/2)$ gives $\|a\mathbf e_1+b\mathbf e_2\|^2=(a+b/2)^2+3b^2/4=a^2+ab+b^2$. Widget code matches.

**§7 $D_4$ definition (lines 1234–1239).** $D_4=\{(x_1,\ldots,x_4)\in\mathbb{Z}^4:\sum x_i\text{ even}\}$ standard.

## Wrong / dubious claims

**theta-functions.html:908 — $z=q^{1/2}$ does NOT give Euler's pentagonal number theorem.** Substituting $z=q^{1/2}$ into the JTP yields
$$\prod_{n\ge1}(1-q^n)(1+q^n)(1+q^{n-1})\;=\;\sum_n q^{(n^2+n)/2},$$
i.e. a **triangular-number** identity (Gauss), not Euler's pentagonal $\prod(1-q^n)=\sum(-1)^k q^{k(3k-1)/2}$. Pentagonal needs the substitution $q\mapsto q^3$, $z\mapsto -q^{-1/2}$ (so the three product factors become $(1-q^{3n})(1-q^{3n-2})(1-q^{3n-1})=\prod(1-q^k)$ and the right side becomes $\sum(-1)^n q^{n(3n-1)/2}$). Fix: either swap the specialization to one that actually produces pentagonal (with the $q\mapsto q^3$ change of variable made explicit) or relabel the bullet as Gauss's triangular-number identity.

## Underspecified or unverifiable claims

- **§1/§3 modular group for $\theta$ itself.** §2 line 393 places $\theta$ on $\Gamma_\theta=\langle T^2,S\rangle$ (level 2), while §3 line 524 lifts to $\theta^4$ on $\Gamma_0(4)$. The page never explicitly states that $\theta$ is a half-integral-weight form of weight $1/2$ on $\Gamma_0(4)$ with the theta multiplier — both descriptions are correct (since $\Gamma_\theta\subset\Gamma_0(4)$) but the half-integral-weight character on $\Gamma_0(4)$ is implied rather than stated.
- **§4 line 736** — comment "Gauss genus theory gives one mod 8" is a brief gesture at Legendre/Gauss three-square machinery; not load-bearing, no specific formula to verify.
- **Heat equation interpretation** (mentioned in audit prompt) — not present on the page. Skipped.
- **Riemann zeta connection** — only a forward callback to `analytic-continuation.html#zeta` (line 543); the Mellin-transform argument is alluded to in the closing paragraph (line 1387) but not developed. Not a wrong claim, just absent.

## Severity

**Minor.** One genuine specialization error: the $z=q^{1/2}$ bullet (line 908) labels a triangular-number identity as Euler's pentagonal — fix by either changing the specialization parameters or relabeling the resulting identity. Every transformation law, every product/sum identity, every $r_k$ formula, the $\tau(n)$ table, the $E_8$ and Leech theta identifications, and all widget computations check out.
