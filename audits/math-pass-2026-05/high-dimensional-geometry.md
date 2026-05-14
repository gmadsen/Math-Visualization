# `high-dimensional-geometry.html` — math-correctness audit

## Verified claims

**§1 Concentration on the sphere.** Lévy's lemma $\sigma(|f-M_f|>t) \le 2 e^{-(n-1)t^2/2}$ for 1-Lipschitz $f$ on $S^{n-1}$ (line 267) is the standard form. The "near-orthogonality" identity $\mathbb{E}[\langle u,v\rangle^2]=1/n$ for independent uniform unit vectors (line 270) follows from $\sum_i \mathbb{E}[u_i^2 v_i^2] = n \cdot (1/n)\cdot(1/n)$ via symmetry plus $\mathbb{E}\|u\|^2=1$. The widget's 95%-band cutoff $t^* = \sqrt{2\log 40/(n-1)}$ (line 325) inverts the bound at level $0.05$ correctly.

**§3 Johnson–Lindenstrauss.** Target dimension $k = O(\log N/\varepsilon^2)$, the Gaussian construction $\Phi = G/\sqrt k$, the $\chi^2_k/k$ identity, and the union bound (lines 480–487) all match the textbook proof. The widget's theoretical std $\sqrt{2/k}$ (line 605) is the correct variance of $\chi^2_k/k$.

**§4 Talagrand.** Convex-distance definition (line 636), the product inequality $\mathbb{P}(A)\mathbb{P}(d_T(\cdot,A)>t) \le e^{-t^2/4}$ (line 638), and the dimension-free convex-Lipschitz tail $4e^{-t^2/4}$ on $[0,1]^n$ (line 640) are standard.

**§5 Gaussian isoperimetry.** Borell / Sudakov–Tsirelson statement (line 760), the enlargement form $\gamma_n(A_t) \ge \Phi(a+t)$ (line 761), the half-mass corollary $\gamma_n(A_t) \ge 1-e^{-t^2/2}$ (line 764), Maxwell–Poincaré marginal limit (line 766), Gross's log-Sobolev $\mathrm{Ent}_\gamma(f^2)\le 2\int|\nabla f|^2 d\gamma$ (line 768), and Bobkov's $I(\mathbb{E}f)\le \mathbb{E}\sqrt{I(f)^2+|\nabla f|^2}$ (line 768) are all stated correctly.

**§6 Applications.** Compressed-sensing rate $m = O(k\log(n/k))$, the RIP definition, Marchenko–Pastur support $[(1-\sqrt\lambda)^2,(1+\sqrt\lambda)^2]$, Vapnik's uniform-deviation bound $8 m^d e^{-m\varepsilon^2/32}$, and the random-tensor injective-norm scaling $\sqrt{n\log n}$ (lines 884–892) match standard references.

## Wrong / dubious claims

**`high-dimensional-geometry.html:382` — $\ell^p$ Dvoretzky exponents are swapped.** The page states "$k(\ell^p,\varepsilon)\asymp \varepsilon^2 n^{2/p}$ for $1\le p\le 2$ and $\asymp \varepsilon^2 \log n$ for $p\ge 2$." This is backwards. The Figiel–Lindenstrauss–Milman result is: $k(\ell^p_n)\asymp \varepsilon^2 n$ for $1\le p\le 2$, $k(\ell^p_n)\asymp \varepsilon^2 n^{2/p}$ for $2\le p<\infty$, and $k(\ell^\infty_n)\asymp \varepsilon^2\log n$. The current text gives $n^2$ at $p=1$, exceeding the ambient dimension $n$, which is impossible. Fix: swap the two ranges and split off $p=\infty$ for the $\log n$ case.

**`high-dimensional-geometry.html:272` — cap-bound direction is misstated.** "$\sigma(\text{cap of angular radius }\theta)\le e^{-(n-1)\sin^2\theta/2}$" cannot be right as stated — cap measure is increasing in $\theta$ and tends to $1/2$ at $\theta=\pi/2$, not zero. The standard estimate (Milman–Schechtman) is for the *complementary* cap: the polar cap of angular radius $\le \pi/2-\theta$ has measure $\le \tfrac12 e^{-(n-1)\theta^2/2}$, equivalently the spherical cap of angular distance $\ge \pi/2+\theta$ from the equator. Rewrite to make the deviation direction explicit.

## Underspecified or unverifiable claims

**`high-dimensional-geometry.html:643` vs widget at line 686.** Prose discusses the Hamming-Lipschitz $f(x)=\sum x_i$ on $\{0,1\}^n$ with std $\sqrt n/2$, but the widget evaluates $\sum U_i$ with $U_i\sim\text{Unif}[0,1]$ and matches the theory line $\sqrt n/(2\sqrt 3)$. The widget output is internally correct but does not illustrate the prose example.

**`high-dimensional-geometry.html:886` — Wigner edge.** "$\|W\|_{op}\le 2\sqrt n+O(1)$" is loose; the actual edge fluctuation is $O(n^{-1/6})$ (Tracy–Widom). Not wrong, just imprecise.

**`high-dimensional-geometry.html:957–971` — MP widget normalization.** Prose normalizes $\frac1n WW^*$ ($m\times m$); the JS computes $\frac1n W^TW$ ($n\times n$) instead. The non-zero spectra coincide up to multiplicity, so the histogram is still correct, but the matrix shape stated and computed disagree.

## Severity

**Minor** — one genuine math error (the $\ell^p$ Dvoretzky-exponent ranges) and one direction-of-bound slip in a parenthetical proof note; everything else is either correct or a presentational mismatch between prose and widget. No central theorem statement (Lévy, JL, Talagrand, Gaussian isoperimetry, RIP, MP) is wrong.
